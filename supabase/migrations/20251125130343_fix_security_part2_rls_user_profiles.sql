/*
  # Fix Security Issues - Part 2: User Profiles RLS

  Optimize RLS policies for user_profiles table by:
  - Using (select auth.uid()) instead of auth.uid()
  - Consolidating multiple policies into fewer, more efficient policies
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile picture" ON user_profiles;
DROP POLICY IF EXISTS "Authenticated users can read all profiles" ON user_profiles;

-- Create optimized policies
CREATE POLICY "Users can read all profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = (select auth.uid()));

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));
