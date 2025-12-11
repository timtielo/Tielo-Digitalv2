/*
  # Fix Security Issues - Part 1: Indexes

  ## 1. Missing Foreign Key Indexes
  Add indexes for foreign keys to improve join performance

  ## 2. Fix Unused Indexes
  Replace conditional indexes with simpler versions
*/

-- Add missing foreign key indexes
CREATE INDEX IF NOT EXISTS idx_impersonation_tokens_user_id
  ON impersonation_tokens(user_id);

CREATE INDEX IF NOT EXISTS idx_user_dashboard_config_module_key
  ON user_dashboard_config(module_key);

-- Drop unused conditional indexes
DROP INDEX IF EXISTS idx_impersonation_tokens_token;
DROP INDEX IF EXISTS idx_impersonation_tokens_expires;

-- Create simpler replacement indexes
CREATE INDEX IF NOT EXISTS idx_impersonation_tokens_token_simple
  ON impersonation_tokens(token);
CREATE INDEX IF NOT EXISTS idx_impersonation_tokens_expires_simple
  ON impersonation_tokens(expires_at);
