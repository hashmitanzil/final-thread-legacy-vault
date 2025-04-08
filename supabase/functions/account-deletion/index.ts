
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with Admin rights
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default when deployed on Supabase
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API SERVICE ROLE KEY - env var exported by default when deployed on Supabase
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Extract the token from the Authorization header
    const token = authHeader.replace('Bearer ', '');
    
    // Verify the token and get the user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token', details: userError }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse request body
    const requestData = await req.json();
    const { action } = requestData;

    if (action === 'schedule_deletion') {
      // Schedule account for deletion in 15 days
      const deletionDate = new Date();
      deletionDate.setDate(deletionDate.getDate() + 15);
      
      // Insert into a hypothetical scheduled_deletions table
      // In a real app, you'd have a background job checking this table
      await supabaseClient.from('scheduled_deletions').upsert({
        user_id: user.id,
        scheduled_for: deletionDate.toISOString()
      });
      
      // For this example, we'll just mark the user's profile
      await supabaseClient
        .from('profiles')
        .update({ 
          deletion_scheduled: true,
          deletion_date: deletionDate.toISOString() 
        })
        .eq('id', user.id);
      
      return new Response(
        JSON.stringify({ 
          message: 'Account scheduled for deletion', 
          deletion_date: deletionDate.toISOString() 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    else if (action === 'cancel_deletion') {
      // Cancel scheduled deletion
      await supabaseClient
        .from('profiles')
        .update({ 
          deletion_scheduled: false,
          deletion_date: null 
        })
        .eq('id', user.id);
      
      // Remove from scheduled deletions
      await supabaseClient
        .from('scheduled_deletions')
        .delete()
        .eq('user_id', user.id);
      
      return new Response(
        JSON.stringify({ message: 'Account deletion cancelled' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    else if (action === 'execute_deletion') {
      // This would be called by an admin function or cron job
      // Delete user's data and then the auth account
      
      // Delete user's digital assets from storage
      const { data: assets } = await supabaseClient
        .from('digital_assets')
        .select('storage_path')
        .eq('user_id', user.id);
      
      if (assets && assets.length > 0) {
        const paths = assets.map(asset => asset.storage_path);
        await supabaseClient.storage.from('digital_assets').remove(paths);
      }
      
      // Delete user's data from all tables
      await supabaseClient.from('digital_assets').delete().eq('user_id', user.id);
      await supabaseClient.from('trusted_contacts').delete().eq('user_id', user.id);
      await supabaseClient.from('messages').delete().eq('user_id', user.id);
      await supabaseClient.from('login_activity').delete().eq('user_id', user.id);
      await supabaseClient.from('scheduled_deletions').delete().eq('user_id', user.id);
      
      // Finally delete the user - requires admin privileges
      const { error: deleteError } = await supabaseClient.auth.admin.deleteUser(user.id);
      
      if (deleteError) {
        return new Response(
          JSON.stringify({ error: 'Failed to delete user account', details: deleteError }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      return new Response(
        JSON.stringify({ message: 'Account permanently deleted' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    else {
      return new Response(
        JSON.stringify({ error: 'Invalid action' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
