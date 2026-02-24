/*
  # Video Upload Module Setup

  ## Summary
  Sets up everything needed for the video upload dashboard module.

  ## Changes

  ### 1. Storage Bucket
  - Creates a public `videos` storage bucket for video file uploads
  - 50MB file size limit per upload

  ### 2. Storage RLS Policies
  - Authenticated users can upload video files to their own folder (path: {user_id}/filename)
  - Authenticated users can delete their own video files
  - Public read access so videos can be served on the public site

  ### 3. Dashboard Module Registration
  - Inserts a new row into `dashboard_modules` with key `videos`
  - Display name: "Video's", icon: "Video", route: /dashboard/videos

  ### 4. Videos Table RLS
  - Add SELECT policy: users can read their own video rows
  - Add INSERT policy: users can insert rows tied to their own user_id
  - Add UPDATE policy: users can update their own video rows
  - Add DELETE policy: users can delete their own video rows
*/

-- Create the videos storage bucket (public, 50MB limit)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'videos',
  'videos',
  true,
  52428800,
  ARRAY['video/mp4', 'video/quicktime', 'video/webm']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for the videos bucket

CREATE POLICY "Authenticated users can upload their own videos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'videos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Authenticated users can update their own videos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'videos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Authenticated users can delete their own videos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'videos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Public can read videos"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'videos');

-- Register the videos module in dashboard_modules
INSERT INTO dashboard_modules (module_key, display_name, icon_name, route_path, description)
VALUES (
  'videos',
  'Video''s',
  'Video',
  '/dashboard/videos',
  'Upload en beheer video''s voor je website'
)
ON CONFLICT (module_key) DO NOTHING;

-- RLS policies for the videos table

CREATE POLICY "Users can read own videos"
  ON videos FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own videos"
  ON videos FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own videos"
  ON videos FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own videos"
  ON videos FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());
