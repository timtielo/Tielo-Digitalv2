/*
  # Fix user profile email synchronization

  1. Changes
    - Update existing user_profiles to sync email with auth.users
    - Update the trigger to keep emails in sync on user creation
    - Add a new trigger to sync email when it changes in auth.users

  2. Security
    - Maintains existing RLS policies
*/

-- First, sync all existing profiles with auth.users emails
UPDATE user_profiles
SET email = auth.users.email
FROM auth.users
WHERE user_profiles.id = auth.users.id
AND user_profiles.email != auth.users.email;

-- Drop the old trigger function and recreate it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create improved trigger function that ensures email is synced
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public, auth
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, name, business_name, business_type, is_admin)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'business_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'business_type', 'basis'),
    FALSE
  )
  ON CONFLICT (id) DO UPDATE
  SET email = NEW.email;
  
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create a new trigger to sync email updates
CREATE OR REPLACE FUNCTION public.handle_user_email_update()
RETURNS trigger
SECURITY DEFINER
SET search_path = public, auth
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only update if email actually changed
  IF NEW.email != OLD.email THEN
    UPDATE public.user_profiles
    SET email = NEW.email
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_email_updated
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW
  WHEN (OLD.email IS DISTINCT FROM NEW.email)
  EXECUTE FUNCTION public.handle_user_email_update();