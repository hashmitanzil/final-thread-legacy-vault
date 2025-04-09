
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { getUserStorageUsage, getRemainingStorage } from '@/utils/storage-utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { 
  BarChart3, 
  Mail, 
  FileArchive, 
  Users, 
  Clock, 
  FileText, 
  Shield, 
  Database 
} from 'lucide-react';

const LegacyStatsDashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Get counts of various entities
  const { data: stats, isLoading } = useQuery({
    queryKey: ['legacy-stats', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const [
        { count: messagesCount },
        { count: contactsCount },
        { count: timeCapsuleCount },
        { count: assetsCount }
      ] = await Promise.all([
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('trusted_contacts').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('time_capsules').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('digital_assets').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      ]);
      
      // Check if end-of-life instructions exist
      const { data: eolInstructions } = await supabase
        .from('eol_instructions')
        .select('id')
        .eq('user_id', user.id)
        .single();
        
      // Get storage usage
      const storageUsage = await getUserStorageUsage(user.id);
      const storageRemaining = getRemainingStorage(storageUsage.totalSizeBytes);
      
      return {
        messagesCount: messagesCount || 0,
        contactsCount: contactsCount || 0,
        timeCapsuleCount: timeCapsuleCount || 0,
        assetsCount: assetsCount || 0,
        hasEolInstructions: !!eolInstructions,
        storageUsage,
        storageRemaining
      };
    },
    enabled: !!user,
  });
  
  if (isLoading || !stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Legacy Plan Overview</CardTitle>
          <CardDescription>Loading your digital legacy statistics...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-10">
          <LoadingSpinner size="lg" />
        </CardContent>
      </Card>
    );
  }
  
  // Calculate completion percentage
  const totalPossibleItems = 5; // Messages, contacts, time capsules, assets, EOL instructions
  const completedItems = [
    stats.messagesCount > 0,
    stats.contactsCount > 0,
    stats.timeCapsuleCount > 0,
    stats.assetsCount > 0,
    stats.hasEolInstructions
  ].filter(Boolean).length;
  
  const completionPercentage = Math.round((completedItems / totalPossibleItems) * 100);
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-primary" />
          Legacy Plan Overview
        </CardTitle>
        <CardDescription>Summary of your digital legacy plan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="mb-2 flex justify-between items-center">
            <span className="text-sm font-medium">Plan Completion</span>
            <span className="text-sm">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          <div className="bg-muted/50 p-3 rounded-md">
            <div className="flex items-center">
              <div className="mr-3 p-2 bg-primary/10 rounded-full">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{stats.messagesCount}</p>
                <p className="text-xs text-muted-foreground">Messages</p>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/50 p-3 rounded-md">
            <div className="flex items-center">
              <div className="mr-3 p-2 bg-primary/10 rounded-full">
                <FileArchive className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{stats.assetsCount}</p>
                <p className="text-xs text-muted-foreground">Digital Assets</p>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/50 p-3 rounded-md">
            <div className="flex items-center">
              <div className="mr-3 p-2 bg-primary/10 rounded-full">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{stats.contactsCount}</p>
                <p className="text-xs text-muted-foreground">Trusted Contacts</p>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/50 p-3 rounded-md">
            <div className="flex items-center">
              <div className="mr-3 p-2 bg-primary/10 rounded-full">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{stats.timeCapsuleCount}</p>
                <p className="text-xs text-muted-foreground">Time Capsules</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <div className="mb-2 flex justify-between items-center">
            <div className="flex items-center">
              <Database className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium">Storage Used</span>
            </div>
            <span className="text-xs font-medium">
              {stats.storageUsage.formattedSize} / 1 GB
            </span>
          </div>
          <Progress 
            value={stats.storageRemaining.usagePercentage} 
            className="h-2"
            // Add red color if almost full
            variant={stats.storageRemaining.usagePercentage > 90 ? 'destructive' : undefined}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {stats.storageRemaining.remainingFormatted} remaining
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LegacyStatsDashboard;
