/*
  # Update Blog Public Access
  
  1. Changes
    - Update SELECT policy on blog_posts to allow public viewing of all published posts
    - Previously only allowed viewing own posts or published posts
    - Now allows anyone (including unauthenticated users) to view all published posts
  
  2. Security
    - Maintains security: users can still only edit/delete their own posts
    - Public can only view posts with status = 'published'
*/

-- Drop the old policy
DROP POLICY IF EXISTS "Users can view all published blog posts" ON blog_posts;

-- Create new policy that allows public access to published posts
CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts FOR SELECT
  USING (status = 'published');

-- Create policy for authenticated users to view their own drafts
CREATE POLICY "Users can view their own drafts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id AND status = 'draft');