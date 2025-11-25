/*
  # Add UPDATE policy to leads table

  1. Changes
    - Add UPDATE policy for authenticated users to update their own leads
    - Allows users to archive/unarchive their leads
    - Users can only update their own leads (matched by user_id)

  2. Security
    - Policy ensures users can only update leads where user_id matches their auth.uid()
    - Maintains data isolation between users
*/

-- Add UPDATE policy for leads
CREATE POLICY "Users can update own leads"
  ON leads
  FOR UPDATE
  TO authenticated
  USING (user_id = (auth.uid())::text)
  WITH CHECK (user_id = (auth.uid())::text);