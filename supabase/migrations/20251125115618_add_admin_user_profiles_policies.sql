/*
  # Add Admin Policies for User Profiles

  1. Changes
    - Add RLS policy for admins to read all user profiles
    - Add RLS policy for admins to update other users' business_type and is_admin
    - These policies enable the admin page to function properly

  2. Security
    - Only users with is_admin = true can read all profiles
    - Only users with is_admin = true can update other users' profiles
    - Regular users can still only read/update their own profile
*/

-- Allow admins to read all user profiles
CREATE POLICY "Admins can read all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles AS admin_check
      WHERE admin_check.id = auth.uid()
      AND admin_check.is_admin = true
    )
  );

-- Allow admins to update all user profiles
CREATE POLICY "Admins can update all profiles"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles AS admin_check
      WHERE admin_check.id = auth.uid()
      AND admin_check.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles AS admin_check
      WHERE admin_check.id = auth.uid()
      AND admin_check.is_admin = true
    )
  );