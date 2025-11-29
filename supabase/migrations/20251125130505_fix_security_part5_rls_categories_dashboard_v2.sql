/*
  # Fix Security Issues - Part 5: Categories and Dashboard Config RLS

  Optimize and consolidate RLS policies for:
  - portfolio_categories (consolidate 5 policies into 1)
  - user_dashboard_config (consolidate 3 policies into 3 better ones)
  - dashboard_modules (consolidate 2 policies into 2)
*/

-- TABLE: portfolio_categories
DROP POLICY IF EXISTS "Users can view own categories" ON portfolio_categories;
DROP POLICY IF EXISTS "Users can create own categories" ON portfolio_categories;
DROP POLICY IF EXISTS "Users can update own categories" ON portfolio_categories;
DROP POLICY IF EXISTS "Users can delete own categories" ON portfolio_categories;
DROP POLICY IF EXISTS "Admins can view all categories" ON portfolio_categories;

-- Consolidated policy for categories (admins can see all, users see own)
CREATE POLICY "Users can manage own categories"
  ON portfolio_categories FOR ALL
  TO authenticated
  USING (
    user_id = (select auth.uid())
    OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND is_admin = true
    )
  )
  WITH CHECK (
    user_id = (select auth.uid())
    OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND is_admin = true
    )
  );

-- TABLE: user_dashboard_config
DROP POLICY IF EXISTS "Users can read own dashboard config" ON user_dashboard_config;
DROP POLICY IF EXISTS "Admins can read all dashboard configs" ON user_dashboard_config;
DROP POLICY IF EXISTS "Admins can manage dashboard configs" ON user_dashboard_config;

-- Consolidated policies for dashboard config
CREATE POLICY "Users can read dashboard config"
  ON user_dashboard_config FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid())
    OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND is_admin = true
    )
  );

CREATE POLICY "Users can manage own dashboard config"
  ON user_dashboard_config FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Admins can manage all dashboard configs"
  ON user_dashboard_config FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND is_admin = true
    )
  );

-- TABLE: dashboard_modules
DROP POLICY IF EXISTS "Anyone can read dashboard modules" ON dashboard_modules;
DROP POLICY IF EXISTS "Admins can manage dashboard modules" ON dashboard_modules;

-- Simplified policies for dashboard modules
CREATE POLICY "All authenticated users can read dashboard modules"
  ON dashboard_modules FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage dashboard modules"
  ON dashboard_modules FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = (select auth.uid()) AND is_admin = true
    )
  );
