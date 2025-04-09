
// Custom type definitions for our database tables that haven't been 
// automatically included in the generated Supabase types

export interface EOLInstructions {
  id: string;
  user_id: string;
  funeral_notes: string | null;
  organ_donation: boolean | null;
  final_message: string;
  access_level: 'private' | 'contacts' | 'public';
  created_at: string;
  updated_at: string;
}

export interface TimeCapsule {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  type: 'message' | 'file';
  content: string | null;
  storage_path: string | null;
  lock_until: string;
  is_locked: boolean;
  created_at: string;
}

export interface ExportLog {
  id: string;
  user_id: string;
  type: 'zip' | 'pdf';
  download_url: string | null;
  requested_at: string;
  completed_at?: string | null;
  status: 'pending' | 'completed' | 'failed';
}
