/*
  # Add impersonation tokens table

  1. New Tables
    - `impersonation_tokens`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `token` (text, unique)
      - `created_at` (timestamptz)
      - `expires_at` (timestamptz)
      - `used` (boolean)
  
  2. Security
    - Enable RLS on `impersonation_tokens` table
    - Only service role can access this table
*/

CREATE TABLE IF NOT EXISTS impersonation_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '5 minutes'),
  used boolean DEFAULT false
);

ALTER TABLE impersonation_tokens ENABLE ROW LEVEL SECURITY;

-- No policies - only service role can access
CREATE INDEX IF NOT EXISTS idx_impersonation_tokens_token ON impersonation_tokens(token) WHERE NOT used;
CREATE INDEX IF NOT EXISTS idx_impersonation_tokens_expires ON impersonation_tokens(expires_at) WHERE NOT used;