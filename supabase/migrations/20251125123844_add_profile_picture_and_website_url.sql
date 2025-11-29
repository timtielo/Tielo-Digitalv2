/*
  # Add profile picture and website URL to user profiles

  1. Changes
    - Add `profile_picture_url` column to store user profile picture URL
    - Add `website_url` column to store business website URL (only admin can set)
  
  2. Notes
    - profile_picture_url can be set by users themselves
    - website_url can only be set by admins via RPC function
*/

-- Add new columns to user_profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'profile_picture_url'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN profile_picture_url text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'website_url'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN website_url text;
  END IF;
END $$;

-- Allow users to update their own profile picture
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'user_profiles'
      AND policyname = 'Users can update own profile picture'
  ) THEN
    CREATE POLICY "Users can update own profile picture"
      ON user_profiles
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- Function for admins to update website URL
CREATE OR REPLACE FUNCTION update_user_website_url(
  target_user_id uuid,
  new_website_url text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_admin boolean;
BEGIN
  SELECT user_profiles.is_admin INTO is_admin
  FROM user_profiles
  WHERE user_profiles.id = auth.uid();

  IF NOT is_admin THEN
    RAISE EXCEPTION 'Only admins can update website URLs';
  END IF;

  UPDATE user_profiles
  SET website_url = new_website_url
  WHERE id = target_user_id;
END;
$$;