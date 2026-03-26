/*
  # Create Mobile Photos Module (v2 - safe rerun)

  ## Summary
  Creates the infrastructure for the "Fotos Mobiel Websites" dashboard module,
  which allows users to manage photos displayed in the phone-frame mockup on their website.

  ## New Tables

  ### `mobile_photos`
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, FK to auth.users) - Owner of the photo
  - `image_url` (text) - Public URL of the uploaded image in Supabase Storage
  - `storage_path` (text) - Internal storage path for deletion
  - `title` (text) - Optional title/label for the photo
  - `display_order` (integer) - Order in which photos are displayed
  - `active` (boolean) - Whether the photo is currently shown on the website
  - `created_at` (timestamptz) - Creation timestamp

  ## Security
  - RLS enabled on `mobile_photos` table
  - Separate policies for SELECT, INSERT, UPDATE, DELETE
  - Storage bucket `mobile-photos` is public for reading (website display)
  - Storage policies restrict upload/delete to authenticated owners
*/

CREATE TABLE IF NOT EXISTS mobile_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  storage_path text NOT NULL,
  title text DEFAULT '',
  display_order integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE mobile_photos ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'mobile_photos' AND policyname = 'Users can view own mobile photos'
  ) THEN
    CREATE POLICY "Users can view own mobile photos"
      ON mobile_photos FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'mobile_photos' AND policyname = 'Users can insert own mobile photos'
  ) THEN
    CREATE POLICY "Users can insert own mobile photos"
      ON mobile_photos FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'mobile_photos' AND policyname = 'Users can update own mobile photos'
  ) THEN
    CREATE POLICY "Users can update own mobile photos"
      ON mobile_photos FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'mobile_photos' AND policyname = 'Users can delete own mobile photos'
  ) THEN
    CREATE POLICY "Users can delete own mobile photos"
      ON mobile_photos FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS mobile_photos_user_id_idx ON mobile_photos(user_id);
CREATE INDEX IF NOT EXISTS mobile_photos_display_order_idx ON mobile_photos(user_id, display_order);

INSERT INTO storage.buckets (id, name, public)
VALUES ('mobile-photos', 'mobile-photos', true)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Public read access for mobile photos'
  ) THEN
    CREATE POLICY "Public read access for mobile photos"
      ON storage.objects FOR SELECT
      TO public
      USING (bucket_id = 'mobile-photos');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Authenticated users can upload mobile photos'
  ) THEN
    CREATE POLICY "Authenticated users can upload mobile photos"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (
        bucket_id = 'mobile-photos' AND
        (storage.foldername(name))[1] = auth.uid()::text
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Users can update own mobile photos in storage'
  ) THEN
    CREATE POLICY "Users can update own mobile photos in storage"
      ON storage.objects FOR UPDATE
      TO authenticated
      USING (
        bucket_id = 'mobile-photos' AND
        (storage.foldername(name))[1] = auth.uid()::text
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Users can delete own mobile photos from storage'
  ) THEN
    CREATE POLICY "Users can delete own mobile photos from storage"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (
        bucket_id = 'mobile-photos' AND
        (storage.foldername(name))[1] = auth.uid()::text
      );
  END IF;
END $$;
