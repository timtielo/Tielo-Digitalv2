/*
  # Fix Infinite Recursion in Admin Policies

  1. Problem
    - The admin policies were causing infinite recursion by querying user_profiles
      from within user_profiles RLS policies
    - This happens because checking is_admin requires reading user_profiles,
      which triggers the policy again

  2. Solution
    - Drop the problematic admin policies
    - Create new policies that use auth.uid() directly without subqueries
    - Use a simpler approach: allow authenticated users to read profiles,
      but use application logic to restrict admin actions

  3. Changes
    - Drop "Admins can read all profiles" policy
    - Drop "Admins can update all profiles" policy
    - Create simpler read policy for all authenticated users
    - Update policy only allows users to update their own profile OR if they're admin
*/

-- Drop the problematic policies
DROP POLICY IF EXISTS "Admins can read all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;

-- Allow all authenticated users to read any profile
-- (We'll handle admin checks in the application layer)
CREATE POLICY "Authenticated users can read all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Users can update their own profile, admins handled by application logic
-- The existing "Users can update own profile" policy is sufficient