/*
  # Create form submissions tables

  1. New Tables
    - `form_submissions`
      - `id` (uuid, primary key)
      - `form_type` (text) - either 'guide' or 'analysis'
      - `first_name` (text)
      - `email` (text)
      - `submitted_at` (timestamptz)
      - `last_name` (text, nullable)
      - `phone` (text, nullable)
      - `company` (text, nullable)
      - `website` (text, nullable)
      - `main_question` (text, nullable)
      - `automation_tasks` (text, nullable)
      - `time_spent` (text, nullable)
      - `found_us` (text, nullable)

  2. Security
    - Enable RLS on `form_submissions` table
    - Add policy for authenticated users to read submissions
    - Add policy for anon users to insert submissions
*/

CREATE TABLE IF NOT EXISTS form_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_type text NOT NULL CHECK (form_type IN ('guide', 'analysis')),
  first_name text NOT NULL,
  email text NOT NULL,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  last_name text,
  phone text,
  company text,
  website text,
  main_question text,
  automation_tasks text,
  time_spent text,
  found_us text
);

-- Enable RLS
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all submissions
CREATE POLICY "Users can read form submissions"
  ON form_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow anyone to insert submissions
CREATE POLICY "Anyone can submit forms"
  ON form_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);