
-- Create buckets for file storage
INSERT INTO storage.buckets (id, name, public)
VALUES ('time_capsules', 'Time Capsule Files', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('digital_assets', 'Digital Assets', false)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for time capsules bucket
CREATE POLICY "Users can upload time capsule files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'time_capsules' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own time capsule files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'time_capsules' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create RLS policies for digital assets bucket
CREATE POLICY "Users can upload digital assets"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'digital_assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own digital assets"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'digital_assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own digital assets"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'digital_assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own digital assets"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'digital_assets' AND auth.uid()::text = (storage.foldername(name))[1]);
