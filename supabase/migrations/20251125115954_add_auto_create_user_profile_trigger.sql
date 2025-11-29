/*
  # Auto-create User Profile on Auth Signup

  1. Purpose
    - Automatically create a user_profiles entry when a new user signs up via Supabase Auth
    - Ensures every authenticated user has a corresponding profile in user_profiles table
    - Sets default values for new users

  2. Changes
    - Create a trigger function that runs when a new user is created in auth.users
    - Create a trigger that calls this function
    - Function creates a user_profiles entry with default values

  3. Default Values
    - id: matches auth.users.id (UUID)
    - email: from auth.users.email
    - name: defaults to empty string (user can update later)
    - business_name: defaults to empty string (user can update later)
    - business_type: defaults to 'basis'
    - is_admin: defaults to false
*/

-- Function to handle new user creation
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

-- Trigger to automatically create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();