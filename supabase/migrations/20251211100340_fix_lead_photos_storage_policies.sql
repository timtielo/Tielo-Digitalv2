/*
  # Fix Lead Photos Storage Policies

  1. Changes
    - Drop existing incorrect policies
    - Recreate policies with correct column references
    - Fix the bug where `leads.name` was used instead of storage object `name`

  2. Security
    - Users can only access photos from their own leads
    - Admins can access all photos
*/

-- Drop existing incorrect policies
DROP POLICY IF EXISTS "Users can view their lead photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their lead photos" ON storage.objects;

-- Create corrected SELECT policy
CREATE POLICY "Users can view their lead photos"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'lead-photos' AND
  (
    -- Extract lead_id from storage object path (format: lead_id/filename)
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id::text = split_part(storage.objects.name, '/', 1)
      AND leads.user_id = auth.uid()::text
    )
    OR
    -- Admins can view all photos
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  )
);

-- Create corrected DELETE policy
CREATE POLICY "Users can delete their lead photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'lead-photos' AND
  (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id::text = split_part(storage.objects.name, '/', 1)
      AND leads.user_id = auth.uid()::text
    )
    OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  )
);