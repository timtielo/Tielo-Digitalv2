/*
  # Add Public Read Access to User Profiles for Blog Authors

  1. Changes
    - Add RLS policy to allow public read access to user_profiles
    - This enables displaying author information on public blog posts
  
  2. Security
    - Only SELECT operations are allowed
    - Users can still only modify their own profiles
    - Public can only read, not modify
*/

-- Allow public to view user profiles (needed for blog author information)
CREATE POLICY "User profiles are publicly readable"
  ON user_profiles
  FOR SELECT
  TO public
  USING (true);
