/*
  # Fix Security Issues - Part 7: Function Search Path Security

  Add SECURITY DEFINER and explicit search_path to admin functions.
  Trigger functions already have SECURITY DEFINER, so we just ensure
  they have proper search_path set.
*/

-- Admin functions with secure search paths

CREATE OR REPLACE FUNCTION delete_user(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'Only admins can delete users';
  END IF;

  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot delete your own account';
  END IF;

  DELETE FROM auth.users WHERE id = target_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION update_user_business_type(
  target_user_id uuid,
  new_business_type text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'Only admins can update business type';
  END IF;

  UPDATE user_profiles
  SET business_type = new_business_type
  WHERE id = target_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION update_user_admin_status(
  target_user_id uuid,
  new_admin_status boolean
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'Only admins can update admin status';
  END IF;

  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot change your own admin status';
  END IF;

  UPDATE user_profiles
  SET is_admin = new_admin_status
  WHERE id = target_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION update_user_website_url(
  target_user_id uuid,
  new_website_url text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'Only admins can update website URL';
  END IF;

  UPDATE user_profiles
  SET website_url = new_website_url
  WHERE id = target_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION update_user_details(
  target_user_id uuid,
  new_name text,
  new_business_name text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'Only admins can update user details';
  END IF;

  UPDATE user_profiles
  SET
    name = new_name,
    business_name = new_business_name
  WHERE id = target_user_id;
END;
$$;

-- Update trigger functions with explicit search_path
-- These already return TRIGGER and have SECURITY DEFINER, just add search_path

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION update_portfolio_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- sync_user_dashboard_modules is a trigger function, update with search_path
CREATE OR REPLACE FUNCTION sync_user_dashboard_modules()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  module_record RECORD;
BEGIN
  -- Delete existing config for this user
  DELETE FROM user_dashboard_config WHERE user_id = NEW.id;

  -- Insert modules based on business_type
  IF NEW.business_type = 'bouw' THEN
    -- Bouw gets all modules
    FOR module_record IN
      SELECT module_key FROM dashboard_modules
      ORDER BY 
        CASE module_key
          WHEN 'portfolio' THEN 1
          WHEN 'werkspot' THEN 2
          WHEN 'reviews' THEN 3
          WHEN 'leads' THEN 4
          WHEN 'profile' THEN 5
          ELSE 99
        END
    LOOP
      INSERT INTO user_dashboard_config (user_id, module_key, enabled, sort_order)
      VALUES (
        NEW.id,
        module_record.module_key,
        true,
        CASE module_record.module_key
          WHEN 'portfolio' THEN 1
          WHEN 'werkspot' THEN 2
          WHEN 'reviews' THEN 3
          WHEN 'leads' THEN 4
          WHEN 'profile' THEN 5
          ELSE 99
        END
      );
    END LOOP;
  ELSE
    -- Basis gets limited modules
    INSERT INTO user_dashboard_config (user_id, module_key, enabled, sort_order)
    VALUES
      (NEW.id, 'reviews', true, 1),
      (NEW.id, 'leads', true, 2),
      (NEW.id, 'profile', true, 3);
  END IF;

  RETURN NEW;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION delete_user(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION update_user_business_type(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION update_user_admin_status(uuid, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION update_user_website_url(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION update_user_details(uuid, text, text) TO authenticated;
