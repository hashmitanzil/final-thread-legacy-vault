
import { Database } from './database';

// Extended database type to include tables not in the original definitions
export interface ExtendedDatabase extends Database {
  Tables: Database['Tables'] & {
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
  };
}

// Create a type-safe client using the extended database type
export type CustomSupabaseClient = ReturnType<typeof createClient<ExtendedDatabase>>;

// Helper function to create the client (not used directly)
function createClient<T>() {
  return {} as any;
}
