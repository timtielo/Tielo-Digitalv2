/*
  # Add Foreign Key Constraint for Projects

  1. Changes
    - Add foreign key constraint from projects.client_id to user_profiles.id
    - This enables Supabase to perform joins between the tables

  2. Security
    - No changes to RLS policies
    - Maintains existing data integrity
*/

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'projects_client_id_fkey'
    AND table_name = 'projects'
  ) THEN
    ALTER TABLE projects
    ADD CONSTRAINT projects_client_id_fkey
    FOREIGN KEY (client_id)
    REFERENCES user_profiles(id)
    ON DELETE CASCADE;
  END IF;
END $$;
