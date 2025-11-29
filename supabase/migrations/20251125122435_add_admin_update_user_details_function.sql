/*
  # Add Admin Update User Details Function

  1. Purpose
    - Allow admins to update user profile details (name and business_name)
    - Secure function that verifies admin status before allowing updates

  2. New Functions
    - update_user_details: Allows admins to change user name and business name

  3. Security
    - Function verifies caller is admin before executing
    - Function is SECURITY DEFINER to bypass RLS
    - Only admins can execute this function successfully
*/

-- Function to update user details (admin only)
CREATE OR REPLACE FUNCTION update_user_details(
  target_user_id uuid,
  new_name text,
  new_business_name text
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
    RAISE EXCEPTION 'Only admins can update user details';
  END IF;

  -- Update the user details
  UPDATE user_profiles
  SET 
    name = new_name,
    business_name = new_business_name
  WHERE id = target_user_id;
END;
$$;