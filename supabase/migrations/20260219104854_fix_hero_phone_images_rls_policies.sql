/*
  # Fix RLS policies for hero_phone_images

  ## Changes
  - Drop the public-only SELECT policy that only showed active images
  - Add proper authenticated SELECT policy so users can see all their own images
  - Keep public read for active images (for frontend display)
  - Fix all ownership checks to use correct cast
*/

DROP POLICY IF EXISTS "Anyone can view active hero phone images" ON hero_phone_images;
DROP POLICY IF EXISTS "Authenticated users can delete own hero phone images" ON hero_phone_images;
DROP POLICY IF EXISTS "Authenticated users can insert own hero phone images" ON hero_phone_images;
DROP POLICY IF EXISTS "Authenticated users can update own hero phone images" ON hero_phone_images;
DROP POLICY IF EXISTS "Users can view own phone images" ON hero_phone_images;
DROP POLICY IF EXISTS "Users can insert own phone images" ON hero_phone_images;
DROP POLICY IF EXISTS "Users can update own phone images" ON hero_phone_images;
DROP POLICY IF EXISTS "Users can delete own phone images" ON hero_phone_images;

CREATE POLICY "Authenticated users can view own hero phone images"
  ON hero_phone_images FOR SELECT
  TO authenticated
  USING (user_id = (auth.uid())::text);

CREATE POLICY "Public can view active hero phone images"
  ON hero_phone_images FOR SELECT
  TO anon
  USING (active = true);

CREATE POLICY "Authenticated users can insert own hero phone images"
  ON hero_phone_images FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (auth.uid())::text);

CREATE POLICY "Authenticated users can update own hero phone images"
  ON hero_phone_images FOR UPDATE
  TO authenticated
  USING (user_id = (auth.uid())::text)
  WITH CHECK (user_id = (auth.uid())::text);

CREATE POLICY "Authenticated users can delete own hero phone images"
  ON hero_phone_images FOR DELETE
  TO authenticated
  USING (user_id = (auth.uid())::text);
