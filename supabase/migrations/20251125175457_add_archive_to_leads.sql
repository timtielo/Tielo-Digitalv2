/*
  # Add archive functionality to leads

  1. Changes
    - Add `archived` column to leads table
    - Default to false (not archived)
    - Allows users to archive leads without deleting them

  2. Security
    - Maintains existing RLS policies
*/

-- Add archived column to leads
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'archived'
  ) THEN
    ALTER TABLE leads ADD COLUMN archived BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Create index for faster queries on archived leads
CREATE INDEX IF NOT EXISTS idx_leads_archived ON leads(archived);