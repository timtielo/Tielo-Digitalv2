/*
  # Custom Account Types System

  1. Overview
    This migration adds a flexible account types system that allows admins to create
    custom account types with their own module configurations.

  2. New Tables
    - `account_types`
      - `id` (uuid, primary key)
      - `name` (text, unique) - Account type name (e.g., 'Bouw Premium', 'Marketing Plus')
      - `description` (text) - Description of what this account type includes
      - `is_system` (boolean) - Whether this is a system-defined type (cannot be deleted)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `account_type_modules`
      - `id` (uuid, primary key)
      - `account_type_id` (uuid, references account_types)
      - `module_key` (text, references dashboard_modules)
      - `enabled` (boolean) - Whether this module is included in the account type
      - `sort_order` (integer) - Default sort order for this module in this account type
      - `created_at` (timestamptz)
      - Unique constraint on (account_type_id, module_key)

  3. Changes to Existing Tables
    - Add `account_type_id` to `user_profiles`
      - References `account_types` table
      - Replaces the old `business_type` field functionality
    
  4. Security
    - Enable RLS on all new tables
    - Authenticated users can read all account types (to see what's available)
    - Only admins can create/update/delete account types
    - Only admins can configure account type modules
    - Users can read their own account type configuration

  5. Initial Data
    - Migrate existing 'bouw' and 'basis' business types to account types
    - Create 'Bouw' account type with: portfolio, werkspot, reviews, leads, profile
    - Create 'Basis' account type with: reviews, leads, profile
    - Create 'Custom' account type template (empty, for admin customization)

  6. Important Notes
    - When a user's account_type_id is updated, their dashboard config should sync
    - Admins can still override individual user module configs via user_dashboard_config
    - The old business_type field will be deprecated but kept for backward compatibility
*/

-- Create account_types table
CREATE TABLE IF NOT EXISTS account_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text NOT NULL DEFAULT '',
  is_system boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE account_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read account types"
  ON account_types FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage account types"
  ON account_types FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Create account_type_modules table
CREATE TABLE IF NOT EXISTS account_type_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_type_id uuid NOT NULL REFERENCES account_types(id) ON DELETE CASCADE,
  module_key text NOT NULL REFERENCES dashboard_modules(module_key) ON DELETE CASCADE,
  enabled boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(account_type_id, module_key)
);

ALTER TABLE account_type_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read account type modules"
  ON account_type_modules FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage account type modules"
  ON account_type_modules FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Add account_type_id to user_profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'account_type_id'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN account_type_id uuid REFERENCES account_types(id);
  END IF;
END $$;

-- Insert default account types
INSERT INTO account_types (name, description, is_system)
VALUES
  ('Bouw', 'Volledige toegang tot alle bouw-gerelateerde modules inclusief portfolio en Werkspot', true),
  ('Basis', 'Basis toegang tot reviews, leads en profiel beheer', true),
  ('Custom', 'Maatwerk account type - volledig aanpasbaar door admin', false)
ON CONFLICT (name) DO NOTHING;

-- Configure modules for 'Bouw' account type
INSERT INTO account_type_modules (account_type_id, module_key, enabled, sort_order)
SELECT 
  (SELECT id FROM account_types WHERE name = 'Bouw'),
  module_key,
  true,
  CASE module_key
    WHEN 'portfolio' THEN 1
    WHEN 'werkspot' THEN 2
    WHEN 'reviews' THEN 3
    WHEN 'leads' THEN 4
    WHEN 'profile' THEN 5
    ELSE 99
  END
FROM dashboard_modules
WHERE module_key IN ('portfolio', 'werkspot', 'reviews', 'leads', 'profile')
ON CONFLICT (account_type_id, module_key) DO NOTHING;

-- Configure modules for 'Basis' account type
INSERT INTO account_type_modules (account_type_id, module_key, enabled, sort_order)
SELECT 
  (SELECT id FROM account_types WHERE name = 'Basis'),
  module_key,
  true,
  CASE module_key
    WHEN 'reviews' THEN 1
    WHEN 'leads' THEN 2
    WHEN 'profile' THEN 3
    ELSE 99
  END
FROM dashboard_modules
WHERE module_key IN ('reviews', 'leads', 'profile')
ON CONFLICT (account_type_id, module_key) DO NOTHING;

-- Migrate existing users from business_type to account_type_id
UPDATE user_profiles
SET account_type_id = (
  SELECT id FROM account_types 
  WHERE name = CASE 
    WHEN user_profiles.business_type = 'bouw' THEN 'Bouw'
    WHEN user_profiles.business_type = 'basis' THEN 'Basis'
    ELSE 'Basis'
  END
)
WHERE account_type_id IS NULL;

-- Create function to sync dashboard modules from account type
CREATE OR REPLACE FUNCTION sync_dashboard_from_account_type()
RETURNS TRIGGER AS $$
DECLARE
  module_record RECORD;
BEGIN
  -- Only sync if account_type_id changed or new user
  IF (TG_OP = 'INSERT') OR (OLD.account_type_id IS DISTINCT FROM NEW.account_type_id) THEN
    -- Delete existing config for this user
    DELETE FROM user_dashboard_config WHERE user_id = NEW.id;

    -- If user has an account type, copy its modules
    IF NEW.account_type_id IS NOT NULL THEN
      FOR module_record IN
        SELECT module_key, sort_order
        FROM account_type_modules
        WHERE account_type_id = NEW.account_type_id
        AND enabled = true
        ORDER BY sort_order
      LOOP
        INSERT INTO user_dashboard_config (user_id, module_key, enabled, sort_order)
        VALUES (NEW.id, module_record.module_key, true, module_record.sort_order)
        ON CONFLICT (user_id, module_key) DO NOTHING;
      END LOOP;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop old triggers
DROP TRIGGER IF EXISTS sync_dashboard_modules_on_insert ON user_profiles;
DROP TRIGGER IF EXISTS sync_dashboard_modules_on_update ON user_profiles;

-- Create new triggers for account type syncing
CREATE TRIGGER sync_dashboard_from_account_type_on_insert
  AFTER INSERT ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION sync_dashboard_from_account_type();

CREATE TRIGGER sync_dashboard_from_account_type_on_update
  AFTER UPDATE OF account_type_id ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION sync_dashboard_from_account_type();

-- Add updated_at trigger for account_types
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_account_types_updated_at
  BEFORE UPDATE ON account_types
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();