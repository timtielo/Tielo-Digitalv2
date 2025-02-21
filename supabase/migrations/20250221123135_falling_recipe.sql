/*
  # Update SEO settings with canonical URLs and share image

  1. Changes
    - Updates existing SEO settings with canonical URLs
    - Adds share image URL to all entries
*/

DO $$
BEGIN
  -- Update Home page SEO
  UPDATE seo_settings 
  SET canonical_url = 'https://tielo-digital.nl/',
      share_image_url = '/public/logo/tdlogo'
  WHERE internal_name = 'Home page SEO';

  -- Update Website Development SEO
  UPDATE seo_settings 
  SET canonical_url = 'https://tielo-digital.nl/diensten/websites',
      share_image_url = '/public/logo/tdlogo'
  WHERE internal_name = 'Website Development SEO';

  -- Update Diensten SEO
  UPDATE seo_settings 
  SET canonical_url = 'https://tielo-digital.nl/diensten',
      share_image_url = '/public/logo/tdlogo'
  WHERE internal_name = 'Diensten SEO';

  -- Update Workflow SEO
  UPDATE seo_settings 
  SET canonical_url = 'https://tielo-digital.nl/diensten/workflow',
      share_image_url = '/public/logo/tdlogo'
  WHERE internal_name = 'Diensten Workflow';

  -- Update Outreach SEO
  UPDATE seo_settings 
  SET canonical_url = 'https://tielo-digital.nl/diensten/outreach',
      share_image_url = '/public/logo/tdlogo'
  WHERE internal_name = 'Diensten Outreach';

  -- Update Email Automatisering SEO
  UPDATE seo_settings 
  SET canonical_url = 'https://tielo-digital.nl/diensten/email-handling',
      share_image_url = '/public/logo/tdlogo'
  WHERE internal_name = 'Email Automatisering SEO';

  -- Update Klantenservice SEO
  UPDATE seo_settings 
  SET canonical_url = 'https://tielo-digital.nl/diensten/customer-service',
      share_image_url = '/public/logo/tdlogo'
  WHERE internal_name = 'AI Klantenservice SEO';

  -- Update Content Creation SEO
  UPDATE seo_settings 
  SET canonical_url = 'https://tielo-digital.nl/diensten/content-creation',
      share_image_url = '/public/logo/tdlogo'
  WHERE internal_name = 'AI Content Creation SEO';

  -- Update Succesverhalen SEO
  UPDATE seo_settings 
  SET canonical_url = 'https://tielo-digital.nl/succesverhalen',
      share_image_url = '/public/logo/tdlogo'
  WHERE internal_name = 'Succesverhalen SEO';

  -- Update Contact SEO
  UPDATE seo_settings 
  SET canonical_url = 'https://tielo-digital.nl/contact',
      share_image_url = '/public/logo/tdlogo'
  WHERE internal_name = 'Contact SEO';

  -- Update Gratis Guide SEO
  UPDATE seo_settings 
  SET canonical_url = 'https://tielo-digital.nl/gratis-guide',
      share_image_url = '/public/logo/tdlogo'
  WHERE internal_name = 'Gratis Guide SEO';

  -- Update Privacy Policy SEO
  UPDATE seo_settings 
  SET canonical_url = 'https://tielo-digital.nl/privacy',
      share_image_url = '/public/logo/tdlogo'
  WHERE internal_name = 'Privacy Policy SEO';

  -- Update Terms SEO
  UPDATE seo_settings 
  SET canonical_url = 'https://tielo-digital.nl/terms',
      share_image_url = '/public/logo/tdlogo'
  WHERE internal_name = 'Terms SEO';

  -- Update Cookies SEO
  UPDATE seo_settings 
  SET canonical_url = 'https://tielo-digital.nl/cookies',
      share_image_url = '/public/logo/tdlogo'
  WHERE internal_name = 'Cookies SEO';

  -- Update Business Card SEO
  UPDATE seo_settings 
  SET canonical_url = 'https://tielo-digital.nl/visitekaartje',
      share_image_url = '/public/logo/tdlogo'
  WHERE internal_name = 'Business Card SEO';

  -- Update Call SEO
  UPDATE seo_settings 
  SET canonical_url = 'https://tielo-digital.nl/call',
      share_image_url = '/public/logo/tdlogo'
  WHERE internal_name = 'Call SEO';
END $$;