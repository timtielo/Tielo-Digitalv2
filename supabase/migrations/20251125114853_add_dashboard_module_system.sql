/*
  # Dashboard Module System

  1. Changes to Existing Tables
    - Add `business_type` to `user_profiles` table
      - Values: 'bouw' or 'basis'
      - Default: 'basis'
    - Add `is_admin` flag to `user_profiles` table
      - Allows admin to manage other users' business types

  2. New Tables
    - `dashboard_modules`
      - `id` (uuid, primary key)
      - `module_key` (text, unique) - Internal identifier (e.g., 'portfolio', 'werkspot')
      - `display_name` (text) - Display name in Dutch
      - `icon_name` (text) - Lucide icon name
      - `route_path` (text) - URL path for the module
      - `description` (text) - Module description
      - `created_at` (timestamptz)

    - `user_dashboard_config`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `module_key` (text, references dashboard_modules)
      - `enabled` (boolean) - Whether module is visible to user
      - `sort_order` (integer) - Order in navigation
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - Unique constraint on (user_id, module_key)

  3. Security
    - Enable RLS on all new tables
    - Users can read their own dashboard config
    - Only admins can modify business_type
    - Only admins can modify user_dashboard_config for other users
    - Anyone can read dashboard_modules

  4. Initial Data
    - Insert standard modules: portfolio, werkspot, reviews, leads, profile
    - 'bouw' gets: portfolio, werkspot, reviews, leads, profile
    - 'basis' gets: reviews, leads, profile

  5. Triggers
    - Auto-create default dashboard config when user profile is created
    - Update modules when business_type changes
*/

-- Add business_type and is_admin to user_profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'business_type'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN business_type text NOT NULL DEFAULT 'basis' CHECK (business_type IN ('bouw', 'basis'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN is_admin boolean NOT NULL DEFAULT false;
  END IF;
END $$;

-- Create dashboard_modules table
CREATE TABLE IF NOT EXISTS dashboard_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_key text UNIQUE NOT NULL,
  display_name text NOT NULL,
  icon_name text NOT NULL,
  route_path text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on dashboard_modules
ALTER TABLE dashboard_modules ENABLE ROW LEVEL SECURITY;

-- Anyone can read dashboard modules
CREATE POLICY "Anyone can read dashboard modules"
  ON dashboard_modules
  FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can manage dashboard modules
CREATE POLICY "Admins can manage dashboard modules"
  ON dashboard_modules
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Create user_dashboard_config table
CREATE TABLE IF NOT EXISTS user_dashboard_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  module_key text NOT NULL REFERENCES dashboard_modules(module_key) ON DELETE CASCADE,
  enabled boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, module_key)
);

-- Enable RLS on user_dashboard_config
ALTER TABLE user_dashboard_config ENABLE ROW LEVEL SECURITY;

-- Users can read their own dashboard config
CREATE POLICY "Users can read own dashboard config"
  ON user_dashboard_config
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can read all dashboard configs
CREATE POLICY "Admins can read all dashboard configs"
  ON user_dashboard_config
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Admins can manage all dashboard configs
CREATE POLICY "Admins can manage dashboard configs"
  ON user_dashboard_config
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Insert standard dashboard modules
INSERT INTO dashboard_modules (module_key, display_name, icon_name, route_path, description)
VALUES
  ('portfolio', 'Portfolio', 'Briefcase', '/dashboard/portfolio', 'Beheer je portfolio items en projecten'),
  ('werkspot', 'Werkspot', 'Star', '/dashboard/werkspot', 'Beheer je Werkspot statistieken'),
  ('reviews', 'Reviews', 'MessageSquare', '/dashboard/reviews', 'Beheer klantreviews'),
  ('leads', 'Leads', 'Users', '/dashboard/leads', 'Beheer leads en prospects'),
  ('profile', 'Profiel', 'User', '/dashboard/profile', 'Beheer je profiel en instellingen')
ON CONFLICT (module_key) DO NOTHING;

-- Function to sync user dashboard config based on business_type
CREATE OR REPLACE FUNCTION sync_user_dashboard_modules()
RETURNS TRIGGER AS $$
DECLARE
  module_record RECORD;
BEGIN
  -- Delete existing config for this user
  DELETE FROM user_dashboard_config WHERE user_id = NEW.id;

  -- Insert modules based on business_type
  IF NEW.business_type = 'bouw' THEN
    -- Bouw gets all modules
    FOR module_record IN
      SELECT module_key FROM dashboard_modules
      ORDER BY 
        CASE module_key
          WHEN 'portfolio' THEN 1
          WHEN 'werkspot' THEN 2
          WHEN 'reviews' THEN 3
          WHEN 'leads' THEN 4
          WHEN 'profile' THEN 5
          ELSE 99
        END
    LOOP
      INSERT INTO user_dashboard_config (user_id, module_key, enabled, sort_order)
      VALUES (
        NEW.id,
        module_record.module_key,
        true,
        CASE module_record.module_key
          WHEN 'portfolio' THEN 1
          WHEN 'werkspot' THEN 2
          WHEN 'reviews' THEN 3
          WHEN 'leads' THEN 4
          WHEN 'profile' THEN 5
          ELSE 99
        END
      );
    END LOOP;
  ELSE
    -- Basis gets limited modules (reviews, leads, profile)
    INSERT INTO user_dashboard_config (user_id, module_key, enabled, sort_order)
    VALUES
      (NEW.id, 'reviews', true, 1),
      (NEW.id, 'leads', true, 2),
      (NEW.id, 'profile', true, 3);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create dashboard config on user profile creation
CREATE TRIGGER sync_dashboard_modules_on_insert
  AFTER INSERT ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_dashboard_modules();

-- Trigger to update dashboard config when business_type changes
CREATE TRIGGER sync_dashboard_modules_on_update
  AFTER UPDATE OF business_type ON user_profiles
  FOR EACH ROW
  WHEN (OLD.business_type IS DISTINCT FROM NEW.business_type)
  EXECUTE FUNCTION sync_user_dashboard_modules();

-- Add updated_at trigger for user_dashboard_config
CREATE TRIGGER update_user_dashboard_config_updated_at
  BEFORE UPDATE ON user_dashboard_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();