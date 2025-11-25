/*
  # Add function to delete users (admin only)

  1. New Functions
    - `delete_user` - Allows admins to delete users from the system
  
  2. Security
    - Only admins can delete users
    - Cascading deletes handled by foreign key constraints
    - Cannot delete yourself
*/

CREATE OR REPLACE FUNCTION delete_user(
  target_user_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_admin boolean;
BEGIN
  -- Check if the caller is an admin
  SELECT user_profiles.is_admin INTO is_admin
  FROM user_profiles
  WHERE user_profiles.id = auth.uid();

  IF NOT is_admin THEN
    RAISE EXCEPTION 'Only admins can delete users';
  END IF;

  -- Prevent admins from deleting themselves
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'You cannot delete your own account';
  END IF;

  -- Delete the user profile (cascading deletes will handle related records)
  DELETE FROM user_profiles WHERE id = target_user_id;

  -- Delete the auth user
  DELETE FROM auth.users WHERE id = target_user_id;
END;
$$;