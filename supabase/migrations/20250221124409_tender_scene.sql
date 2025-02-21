/*
  # Add canonical URLs for remaining pages

  1. Changes
    - Add canonical URLs for thank you pages
    - Add canonical URLs for any other missing pages
*/

DO $$
BEGIN
  -- Update Guide Thank You SEO
  UPDATE seo_settings 
  SET canonical_url = 'https://tielo-digital.nl/gratis-guide/bedankt',
      share_image_url = '/public/logo/tdlogo'
  WHERE internal_name = 'Guide Thank You SEO';

  -- Update Analysis Thank You SEO
  UPDATE seo_settings 
  SET canonical_url = 'https://tielo-digital.nl/analysis-thank-you',
      share_image_url = '/public/logo/tdlogo'
  WHERE internal_name = 'Analysis Thank You SEO';
END $$;