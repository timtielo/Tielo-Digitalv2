/*
  # Add important links field to user profiles

  1. Changes
    - Add `important_links` column to user_profiles table
    - This will store rich text content with HTML formatting
    - Allows admins to add formatted links to documents for each user

  2. Security
    - Maintains existing RLS policies
    - Only admins can edit this field (through admin functions)
*/

-- Add important_links column to user_profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'important_links'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN important_links TEXT DEFAULT '';
  END IF;
END $$;