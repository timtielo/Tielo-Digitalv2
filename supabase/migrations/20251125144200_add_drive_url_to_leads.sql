/*
  # Add Drive URL to Leads Table

  1. Changes
    - Add `drive_url` column to `leads` table
      - Type: text (nullable)
      - Purpose: Store Google Drive or other cloud storage URLs for lead documents

  2. Notes
    - Column is nullable to maintain compatibility with existing records
    - No default value set
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'drive_url'
  ) THEN
    ALTER TABLE leads ADD COLUMN drive_url text;
  END IF;
END $$;
