
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://uabsydymuolshbxaimex.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhYnN5ZHltdW9sc2hieGFpbWV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwOTQxODgsImV4cCI6MjA1OTY3MDE4OH0.Uay8Dih-ikfa_xypmSxvI8h_EJrxRG8-wthweG_qpKE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
