/*
  # Update SEO settings with correct image and canonical URLs

  1. Changes
    - Update share_image_url to use absolute URL
    - Ensure consistent canonical URL format
    - Fix domain name format (www vs non-www)

  2. Security
    - No changes to RLS policies
    - Safe updates only
*/

DO $$
BEGIN
  -- Update all SEO settings to use absolute URL for share_image_url
  UPDATE seo_settings 
  SET share_image_url = 'https://www.tielo-digital.nl/logo/tdlogo',
      canonical_url = REPLACE(canonical_url, 'tielo-digital.nl', 'www.tielo-digital.nl')
  WHERE share_image_url = '/public/logo/tdlogo';

  -- Ensure all canonical URLs use www
  UPDATE seo_settings
  SET canonical_url = REPLACE(canonical_url, 'https://tielo-digital.nl', 'https://www.tielo-digital.nl')
  WHERE canonical_url LIKE 'https://tielo-digital.nl%';
END $$;