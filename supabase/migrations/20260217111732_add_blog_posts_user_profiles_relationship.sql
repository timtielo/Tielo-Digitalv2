/*
  # Add Foreign Key Relationship Between blog_posts and user_profiles

  1. Changes
    - Drop existing foreign key from blog_posts.user_id to auth.users
    - Add new foreign key from blog_posts.user_id to user_profiles.id
    - This allows Supabase PostgREST to join blog_posts with user_profiles
  
  2. Notes
    - user_profiles.id references auth.users.id, so referential integrity is maintained
    - This enables automatic joins for author information
*/

-- Drop existing constraint
ALTER TABLE blog_posts 
DROP CONSTRAINT IF EXISTS blog_posts_user_id_fkey;

-- Add new constraint to user_profiles
ALTER TABLE blog_posts
ADD CONSTRAINT blog_posts_user_id_fkey
FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE;
