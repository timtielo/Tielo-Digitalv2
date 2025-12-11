/*
  # Add user portfolio categories

  1. New Tables
    - `portfolio_categories`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to user_profiles)
      - `name` (text) - category name
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on `portfolio_categories` table
    - Users can only view and manage their own categories
    - Admin users can view all categories
*/

CREATE TABLE IF NOT EXISTS portfolio_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, name)
);

ALTER TABLE portfolio_categories ENABLE ROW LEVEL SECURITY;

-- Users can view their own categories
CREATE POLICY "Users can view own categories"
  ON portfolio_categories
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can view all categories
CREATE POLICY "Admins can view all categories"
  ON portfolio_categories
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Users can insert their own categories
CREATE POLICY "Users can create own categories"
  ON portfolio_categories
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own categories
CREATE POLICY "Users can update own categories"
  ON portfolio_categories
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own categories
CREATE POLICY "Users can delete own categories"
  ON portfolio_categories
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);