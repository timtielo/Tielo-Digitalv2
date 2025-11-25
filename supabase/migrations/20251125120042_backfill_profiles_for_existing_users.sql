/*
  # Backfill Profiles for Existing Users

  1. Purpose
    - Create user_profiles entries for existing auth users who don't have profiles yet
    - This is a one-time backfill for users created before the auto-profile trigger was added

  2. Changes
    - Insert user_profiles for any auth.users that don't have a profile yet
    - Uses default values for all profile fields

  3. Data Integrity
    - Only inserts profiles for users who don't already have one
    - Uses the auth.users id directly
*/

-- Create profiles for existing auth users without profiles
INSERT INTO public.user_profiles (
  id,
  name,
  business_name,
  business_type,
  is_admin
)
SELECT
  au.id,
  '',
  '',
  'basis',
  false
FROM auth.users au
WHERE au.id NOT IN (
  SELECT id FROM public.user_profiles
);