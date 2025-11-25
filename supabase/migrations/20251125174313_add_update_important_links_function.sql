/*
  # Add function to update important links

  1. Changes
    - Create RPC function for admins to update important_links field
    - Validates admin permissions before allowing updates

  2. Security
    - Function uses SECURITY DEFINER with explicit search path
    - Checks for admin status before allowing updates
*/

-- Create function to update important links
CREATE OR REPLACE FUNCTION update_user_important_links(
  target_user_id UUID,
  new_important_links TEXT
)
RETURNS void
SECURITY DEFINER
SET search_path = public, auth
LANGUAGE plpgsql
AS $$
DECLARE
  calling_user_id UUID;
  is_admin_user BOOLEAN;
BEGIN
  -- Get the calling user's ID
  calling_user_id := auth.uid();
  
  -- Check if the calling user is an admin
  SELECT is_admin INTO is_admin_user
  FROM user_profiles
  WHERE id = calling_user_id;
  
  -- Only allow admins to update
  IF NOT is_admin_user THEN
    RAISE EXCEPTION 'Only admins can update important links';
  END IF;
  
  -- Update the important links
  UPDATE user_profiles
  SET important_links = new_important_links
  WHERE id = target_user_id;
END;
$$;