/*
  # Fix Security Issues - Part 3: Portfolio and Reviews RLS

  Optimize RLS policies for portfolio_items and reviews tables
  Note: user_id columns are text type, so we cast auth.uid() to text
*/

-- TABLE: portfolio_items
DROP POLICY IF EXISTS "Users can view own portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Users can insert own portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Users can update own portfolio items" ON portfolio_items;
DROP POLICY IF EXISTS "Users can delete own portfolio items" ON portfolio_items;

CREATE POLICY "Users can view own portfolio items"
  ON portfolio_items FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid())::text);

CREATE POLICY "Users can insert own portfolio items"
  ON portfolio_items FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid())::text);

CREATE POLICY "Users can update own portfolio items"
  ON portfolio_items FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid())::text)
  WITH CHECK (user_id = (select auth.uid())::text);

CREATE POLICY "Users can delete own portfolio items"
  ON portfolio_items FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid())::text);

-- TABLE: reviews
DROP POLICY IF EXISTS "Users can view own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can insert own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can delete own reviews" ON reviews;

CREATE POLICY "Users can view own reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid())::text);

CREATE POLICY "Users can insert own reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid())::text);

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid())::text)
  WITH CHECK (user_id = (select auth.uid())::text);

CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid())::text);
