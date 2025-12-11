/*
  # Fix Security Issues - Part 6: Impersonation Tokens RLS

  Add restrictive policy for impersonation_tokens table.
  This table should only be accessible by service role.
*/

-- Block all regular authenticated access to impersonation_tokens
CREATE POLICY "Service role only"
  ON impersonation_tokens FOR ALL
  TO authenticated
  USING (false)
  WITH CHECK (false);
