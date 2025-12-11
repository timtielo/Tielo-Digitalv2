/*
  # Fix Security Issues - Part 4: Leads and Werkspot RLS

  Optimize RLS policies for leads and werkspot_data tables
*/

-- TABLE: leads
DROP POLICY IF EXISTS "Users can view own leads" ON leads;

CREATE POLICY "Users can view own leads"
  ON leads FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid())::text);

-- TABLE: werkspot_data
DROP POLICY IF EXISTS "Users can view own werkspot data" ON werkspot_data;
DROP POLICY IF EXISTS "Users can insert own werkspot data" ON werkspot_data;
DROP POLICY IF EXISTS "Users can update own werkspot data" ON werkspot_data;

CREATE POLICY "Users can view own werkspot data"
  ON werkspot_data FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid())::text);

CREATE POLICY "Users can insert own werkspot data"
  ON werkspot_data FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid())::text);

CREATE POLICY "Users can update own werkspot data"
  ON werkspot_data FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid())::text)
  WITH CHECK (user_id = (select auth.uid())::text);
