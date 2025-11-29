/*
  # Fix Auto-create User Profile Trigger

  1. Purpose
    - Fix the handle_new_user function to not include 'email' column
    - The user_profiles table doesn't have an email column
    - Only include actual columns: id, name, business_name, business_type, is_admin

  2. Changes
    - Drop and recreate the handle_new_user function with correct columns
*/

-- Drop the existing function
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- Recreate function with correct columns
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id,
    name,
    business_name,
    business_type,
    is_admin
  )
  VALUES (
    NEW.id,
    '',
    '',
    'basis',
    false
  );
  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();