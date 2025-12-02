/*
  # Mission Control Center Tables

  1. New Tables
    - `mcc_months`
      - `id` (uuid, primary key)
      - `year` (int) - Year like 2025
      - `month` (int) - Month 1-12
      - `created_at` (timestamp)
      - Unique constraint on (year, month)
    
    - `mcc_items`
      - `id` (uuid, primary key)
      - `month_id` (uuid, foreign key to mcc_months)
      - `category` (text) - e.g., LEADS, KLANTEN, CASH
      - `item` (text) - e.g., "Outreach WhatsApp", "Omzet"
      - `target` (int) - Monthly goal
      - `status` (text) - enum: "on-track", "at-risk", "off-track"
      - `order_index` (int) - Display order
      - `created_at` (timestamp)
    
    - `mcc_item_scores`
      - `id` (uuid, primary key)
      - `item_id` (uuid, foreign key to mcc_items)
      - `week` (int) - Week number 1-5
      - `value` (int) - Score value
      - `updated_at` (timestamp)
      - Unique constraint on (item_id, week)

  2. Security
    - Enable RLS on all tables
    - Add admin-only policies for all operations (using is_admin column)
*/

-- Create mcc_months table
CREATE TABLE IF NOT EXISTS mcc_months (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year int NOT NULL,
  month int NOT NULL CHECK (month >= 1 AND month <= 12),
  created_at timestamptz DEFAULT now(),
  UNIQUE(year, month)
);

-- Create mcc_items table
CREATE TABLE IF NOT EXISTS mcc_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month_id uuid NOT NULL REFERENCES mcc_months(id) ON DELETE CASCADE,
  category text NOT NULL,
  item text NOT NULL,
  target int DEFAULT 0,
  status text DEFAULT 'on-track' CHECK (status IN ('on-track', 'at-risk', 'off-track')),
  order_index int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create mcc_item_scores table
CREATE TABLE IF NOT EXISTS mcc_item_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES mcc_items(id) ON DELETE CASCADE,
  week int NOT NULL CHECK (week >= 1 AND week <= 5),
  value int DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(item_id, week)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_mcc_items_month_id ON mcc_items(month_id);
CREATE INDEX IF NOT EXISTS idx_mcc_items_order ON mcc_items(month_id, order_index);
CREATE INDEX IF NOT EXISTS idx_mcc_scores_item_id ON mcc_item_scores(item_id);

-- Enable RLS
ALTER TABLE mcc_months ENABLE ROW LEVEL SECURITY;
ALTER TABLE mcc_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE mcc_item_scores ENABLE ROW LEVEL SECURITY;

-- Admin-only policies for mcc_months
CREATE POLICY "Admins can view all months"
  ON mcc_months FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can insert months"
  ON mcc_months FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update months"
  ON mcc_months FOR UPDATE
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

CREATE POLICY "Admins can delete months"
  ON mcc_months FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Admin-only policies for mcc_items
CREATE POLICY "Admins can view all items"
  ON mcc_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can insert items"
  ON mcc_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update items"
  ON mcc_items FOR UPDATE
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

CREATE POLICY "Admins can delete items"
  ON mcc_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Admin-only policies for mcc_item_scores
CREATE POLICY "Admins can view all scores"
  ON mcc_item_scores FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can insert scores"
  ON mcc_item_scores FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update scores"
  ON mcc_item_scores FOR UPDATE
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

CREATE POLICY "Admins can delete scores"
  ON mcc_item_scores FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );