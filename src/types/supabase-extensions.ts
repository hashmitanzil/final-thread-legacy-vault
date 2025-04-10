
// Additional types for Supabase tables that aren't in the auto-generated types

export interface LegacyMedia {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  media_type: 'video' | 'audio';
  storage_path: string;
  thumbnail_path: string | null;
  delivery_type: 'date' | 'event' | 'post-death';
  delivery_date: string | null;
  delivery_event: string | null;
  is_draft: boolean;
  recipients: string[];
  created_at: string;
  updated_at: string;
}

export interface DeathTrigger {
  id: string;
  user_id: string;
  inactivity_days: number;
  last_activity: string | null;
  prompt_days: number;
  last_prompt: string | null;
  require_contact_verification: boolean;
  manual_trigger: boolean;
  created_at: string;
  updated_at: string;
}

export interface DigitalAssetExtended {
  id: string;
  user_id: string;
  name: string;
  size: string;
  type: string;
  storage_path: string;
  last_accessed: string | null;
  created_at: string;
  updated_at: string;
  visibility: 'private' | 'post-death' | 'scheduled';
  tags: string[];
  folder: string;
  scheduled_release_date: string | null;
  watermark: boolean;
  restrict_download: boolean;
}

export interface TrustedContactExtended {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  relationship: string | null;
  role: 'verifier' | 'executor' | 'heir' | 'viewer';
  can_verify_death: boolean;
  can_trigger_messages: boolean;
  can_access_vault: boolean;
  temp_password: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}
