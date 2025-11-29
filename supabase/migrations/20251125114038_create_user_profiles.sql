/*
  # Create User Profiles Table

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `name` (text) - User's full name
      - `business_name` (text) - Business name
      - `profile_picture` (text, nullable) - URL to profile picture
      - `created_at` (timestamptz) - When profile was created
      - `updated_at` (timestamptz) - When profile was last updated

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policy for users to read their own profile
    - Add policy for users to insert their own profile
    - Add policy for users to update their own profile

  3. Storage
    - Create storage bucket for profile pictures
    - Enable RLS on storage bucket
    - Add policies for authenticated users to upload/update/delete their own images
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  business_name text NOT NULL DEFAULT '',
  profile_picture text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create storage bucket for profile pictures
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-pictures', 'profile-pictures', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Users can view own profile pictures"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload own profile pictures"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own profile pictures"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own profile pictures"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public access to view profile pictures
CREATE POLICY "Profile pictures are publicly accessible"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'profile-pictures');