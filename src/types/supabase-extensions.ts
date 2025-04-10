
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

export interface DigitalAsset {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  type: string;
  size: string;
  storage_path: string;
  created_at: string;
  updated_at: string;
  last_accessed: string;
  is_encrypted?: boolean;
  category?: string;
  tags?: string[];
}

export interface TrustedContact {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  relationship: string;
  access_level: string;
  status: 'pending' | 'active' | 'declined';
  created_at: string;
  updated_at: string;
}
