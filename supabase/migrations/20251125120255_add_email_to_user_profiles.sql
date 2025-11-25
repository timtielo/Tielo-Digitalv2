/*
  # Add Email to User Profiles

  1. Purpose
    - Add email column to user_profiles table
    - Populate email from auth.users for existing profiles
    - Update trigger to include email when creating new profiles

  2. Changes
    - Add email column to user_profiles
    - Backfill emails for existing profiles
    - Update handle_new_user trigger to include email

  3. Security
    - Email is stored for easy admin access
    - Users can read their own email
    - Admins can read all emails (via existing policy)
*/

-- Add email column to user_profiles
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS email text;

-- Backfill emails for existing users
UPDATE user_profiles up
SET email = au.email
FROM auth.users au
WHERE up.id = au.id
AND up.email IS NULL;

-- Update the trigger function to include email
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id,
    email,
    name,
    business_name,
    business_type,
    is_admin
  )
  VALUES (
    NEW.id,
    NEW.email,
    '',
    '',
    'basis',
    false
  );
  RETURN NEW;
END;
$$;