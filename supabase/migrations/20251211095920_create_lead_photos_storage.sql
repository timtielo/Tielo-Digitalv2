/*
  # Create Lead Photos Storage Bucket

  1. Storage
    - Create `lead-photos` bucket for storing lead photos
    - Enable RLS on the bucket
    - Add policies for authenticated users to upload
    - Add policies for users to view their own lead photos

  2. Security
    - Admins can upload photos to any lead's folder
    - Users can only view photos from leads assigned to them
*/

-- Create the storage bucket for lead photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('lead-photos', 'lead-photos', false)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload photos
CREATE POLICY "Authenticated users can upload lead photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'lead-photos');

-- Allow users to view their own lead photos
CREATE POLICY "Users can view their lead photos"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'lead-photos' AND
  (
    -- Extract lead_id from path (format: lead_id/filename)
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id::text = split_part(name, '/', 1)
      AND leads.user_id = auth.uid()::text
    )
    OR
    -- Admins can view all photos
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  )
);

-- Allow users to delete their own lead photos
CREATE POLICY "Users can delete their lead photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'lead-photos' AND
  (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id::text = split_part(name, '/', 1)
      AND leads.user_id = auth.uid()::text
    )
    OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND is_admin = true
    )
  )
);