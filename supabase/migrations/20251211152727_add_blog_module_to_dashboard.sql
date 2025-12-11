/*
  # Add Blog Module to Dashboard

  1. Changes
    - Insert blog module into dashboard_modules table
    - Enable blog module for admin users by default

  2. Details
    - Module key: 'blogs'
    - Display name: 'Blog CMS'
    - Icon: FileText
    - Route: /dashboard/blogs
*/

-- Insert blog module if it doesn't exist
INSERT INTO dashboard_modules (module_key, display_name, icon_name, route_path, description)
VALUES (
  'blogs',
  'Blog CMS',
  'FileText',
  '/dashboard/blogs',
  'Beheer en publiceer blogberichten'
)
ON CONFLICT (module_key) DO NOTHING;

-- Enable blog module for all admin users
INSERT INTO user_dashboard_config (user_id, module_key, enabled, sort_order)
SELECT 
  up.id,
  'blogs',
  true,
  (
    SELECT COALESCE(MAX(sort_order), 0) + 1
    FROM user_dashboard_config
    WHERE user_id = up.id
  )
FROM user_profiles up
WHERE up.is_admin = true
ON CONFLICT (user_id, module_key) DO NOTHING;
