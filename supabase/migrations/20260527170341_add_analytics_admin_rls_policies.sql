/*
  # Analytics Admin RLS Policies

  ## Summary
  Add read-only policies to visitors, page_views, and events tables so the
  admin user (tim@tielo-digital.nl) can access analytics data for tielo-digital.nl.

  Uses a helper approach: policies check if the authenticated user has is_admin = true
  in user_profiles, which is already the security gate used throughout the app.

  ## Changes
  1. visitors - add admin SELECT policy
  2. page_views - add admin SELECT policy
  3. events - add admin SELECT policy

  ## Security
  - Only users with is_admin = true in user_profiles can read
  - No data modification allowed through these policies
*/

-- Admin read access for visitors table
CREATE POLICY "Admin can read visitors analytics"
  ON visitors FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Admin read access for page_views table
CREATE POLICY "Admin can read page_views analytics"
  ON page_views FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Admin read access for events table
CREATE POLICY "Admin can read events analytics"
  ON events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );
