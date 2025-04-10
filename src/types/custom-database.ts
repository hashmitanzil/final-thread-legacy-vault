
import { Database as OriginalDatabase } from '@/integrations/supabase/types';
import { PostgrestError } from '@supabase/supabase-js';
import { LegacyMedia, DigitalAsset, TrustedContact } from './supabase-extensions';

// Extended database type to include tables not in the original definitions
export interface ExtendedDatabase {
  public: {
    Tables: {
      legacy_media: {
        Row: {
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
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          media_type: 'video' | 'audio';
          storage_path: string;
          thumbnail_path?: string | null;
          delivery_type: 'date' | 'event' | 'post-death';
          delivery_date?: string | null;
          delivery_event?: string | null;
          is_draft?: boolean;
          recipients?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          media_type?: 'video' | 'audio';
          storage_path?: string;
          thumbnail_path?: string | null;
          delivery_type?: 'date' | 'event' | 'post-death';
          delivery_date?: string | null;
          delivery_event?: string | null;
          is_draft?: boolean;
          recipients?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
    } & OriginalDatabase['public']['Tables'];
    Views: OriginalDatabase['public']['Views'];
    Functions: OriginalDatabase['public']['Functions'];
    Enums: OriginalDatabase['public']['Enums'];
    CompositeTypes: OriginalDatabase['public']['CompositeTypes'];
  };
}

// Create a custom Supabase client type
import { createClient, SupabaseClient } from '@supabase/supabase-js';
export type CustomSupabaseClient = SupabaseClient<ExtendedDatabase>;
