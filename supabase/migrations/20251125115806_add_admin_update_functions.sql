/*
  # Add Admin Update Functions

  1. Purpose
    - Create secure server-side functions for admin operations
    - Prevent non-admin users from updating business_type or is_admin
    - These functions check admin status before allowing updates

  2. New Functions
    - update_user_business_type: Allows admins to change user business types
    - update_user_admin_status: Allows admins to change user admin status

  3. Security
    - Functions verify caller is admin before executing
    - Functions are SECURITY DEFINER to bypass RLS
    - Only admins can execute these functions successfully
*/

-- Function to update user business type (admin only)
CREATE OR REPLACE FUNCTION update_user_business_type(
  target_user_id uuid,
  new_business_type text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_caller_admin boolean;
BEGIN
  -- Check if the caller is an admin
  SELECT is_admin INTO is_caller_admin
  FROM user_profiles
  WHERE id = auth.uid();

  -- If not admin, raise exception
  IF NOT is_caller_admin THEN
    RAISE EXCEPTION 'Only admins can update business types';
  END IF;

  -- Validate business_type value
  IF new_business_type NOT IN ('bouw', 'basis') THEN
    RAISE EXCEPTION 'Invalid business type. Must be bouw or basis';
  END IF;

  -- Update the business type
  UPDATE user_profiles
  SET business_type = new_business_type
  WHERE id = target_user_id;
END;
$$;

-- Function to update user admin status (admin only)
CREATE OR REPLACE FUNCTION update_user_admin_status(
  target_user_id uuid,
  new_admin_status boolean
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_caller_admin boolean;
BEGIN
  -- Check if the caller is an admin
  SELECT is_admin INTO is_caller_admin
  FROM user_profiles
  WHERE id = auth.uid();

  -- If not admin, raise exception
  IF NOT is_caller_admin THEN
    RAISE EXCEPTION 'Only admins can update admin status';
  END IF;

  -- Prevent users from removing their own admin status
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot modify your own admin status';
  END IF;

  -- Update the admin status
  UPDATE user_profiles
  SET is_admin = new_admin_status
  WHERE id = target_user_id;
END;
$$;