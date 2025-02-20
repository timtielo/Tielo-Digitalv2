/*
  # Add dashboard metrics table

  1. New Tables
    - `dashboard_metrics`
      - `id` (uuid, primary key)
      - `metric_key` (text, unique) - identifier for the metric
      - `value` (text) - display value
      - `title` (text) - metric title
      - `subtitle` (text) - metric subtitle
      - `updated_at` (timestamptz) - last update timestamp

  2. Security
    - Enable RLS
    - Add policies for reading and updating metrics
*/

CREATE TABLE IF NOT EXISTS dashboard_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_key text UNIQUE NOT NULL,
  value text NOT NULL,
  title text NOT NULL,
  subtitle text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE dashboard_metrics ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read metrics
CREATE POLICY "Anyone can read dashboard metrics"
  ON dashboard_metrics
  FOR SELECT
  TO anon
  USING (true);

-- Allow authenticated users to update metrics
CREATE POLICY "Authenticated users can update dashboard metrics"
  ON dashboard_metrics
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default metrics
INSERT INTO dashboard_metrics (metric_key, value, title, subtitle) VALUES
  ('satisfied_clients', '3', 'Tevreden Klanten', 'Succesvolle samenwerkingen'),
  ('average_roi', '300%', 'Gemiddelde ROI', 'Return on Investment'),
  ('extra_revenue', '€15000+', 'Extra Omzet', 'Voor onze klanten in 2024'),
  ('hours_saved', '100+', 'Uren Bespaard', 'Door blijvende automatisatie');