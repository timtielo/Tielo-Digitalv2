/*
  # Restructure Module System for Individual User Assignment

  1. Changes
    - Create `user_modules` junction table for many-to-many relationship between users and modules
    - Migrate existing account type module assignments to individual user assignments
    - Remove account_type_id from user_profiles
    - Drop account_types table and related structures
  
  2. New Tables
    - `user_modules`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `module_key` (text, references dashboard_modules)
      - `created_at` (timestamp)
      - Unique constraint on (user_id, module_key)
  
  3. Security
    - Enable RLS on user_modules
    - Users can view their own module assignments
    - Admins can view and manage all module assignments
  
  4. Migration Strategy
    - Create new user_modules table first
    - Migrate existing data from account_types to user_modules
    - Remove old structures last
*/

-- Create user_modules junction table
CREATE TABLE IF NOT EXISTS user_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  module_key text NOT NULL REFERENCES dashboard_modules(module_key) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, module_key)
);

-- Enable RLS
ALTER TABLE user_modules ENABLE ROW LEVEL SECURITY;

-- Users can view their own module assignments
CREATE POLICY "Users can view own modules"
  ON user_modules
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can view all module assignments
CREATE POLICY "Admins can view all modules"
  ON user_modules
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Admins can insert module assignments
CREATE POLICY "Admins can insert modules"
  ON user_modules
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Admins can delete module assignments
CREATE POLICY "Admins can delete modules"
  ON user_modules
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_modules_user_id ON user_modules(user_id);
CREATE INDEX IF NOT EXISTS idx_user_modules_module_key ON user_modules(module_key);

-- Migrate existing account type assignments to user modules
-- For each user with an account_type_id, copy their account type's modules to user_modules
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' 
    AND column_name = 'account_type_id'
  ) THEN
    -- Insert module assignments for users who have account types
    INSERT INTO user_modules (user_id, module_key)
    SELECT DISTINCT up.id, atm.module_key
    FROM user_profiles up
    JOIN account_type_modules atm ON atm.account_type_id = up.account_type_id
    WHERE up.account_type_id IS NOT NULL
      AND atm.enabled = true
    ON CONFLICT (user_id, module_key) DO NOTHING;
  END IF;
END $$;

-- Drop triggers related to account types
DROP TRIGGER IF EXISTS sync_dashboard_from_account_type_on_insert ON user_profiles;
DROP TRIGGER IF EXISTS sync_dashboard_from_account_type_on_update ON user_profiles;
DROP FUNCTION IF EXISTS sync_dashboard_from_account_type();

-- Drop the account_type_id column from user_profiles
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'account_type_id'
  ) THEN
    ALTER TABLE user_profiles DROP COLUMN account_type_id;
  END IF;
END $$;

-- Drop account type related tables
DROP TABLE IF EXISTS account_type_modules CASCADE;
DROP TABLE IF EXISTS account_types CASCADE;