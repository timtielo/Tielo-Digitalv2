/*
  # Add Remaining SEO Settings

  1. Changes
    - Add SEO settings for remaining pages:
      - Contact page
      - Gratis Guide page
      - Privacy Policy page
      - Terms page
      - Cookies page
      - Business Card page
      - Call page
      - Guide Thank You page
      - Analysis Thank You page

  2. Security
    - Uses existing RLS policies from previous migration
*/

-- Use DO block to safely insert records
DO $$
BEGIN
  -- Contact SEO
  IF NOT EXISTS (SELECT 1 FROM seo_settings WHERE internal_name = 'Contact SEO') THEN
    INSERT INTO seo_settings (internal_name, page_title, page_description, noindex, nofollow)
    VALUES (
      'Contact SEO',
      'Contact - Gratis AI & Automation Analyse',
      'Plan een gratis analyse en ontdek hoe AI en automatisering jouw bedrijf kan helpen groeien. Direct persoonlijk contact met een expert.',
      false,
      false
    );
  END IF;

  -- Gratis Guide SEO
  IF NOT EXISTS (SELECT 1 FROM seo_settings WHERE internal_name = 'Gratis Guide SEO') THEN
    INSERT INTO seo_settings (internal_name, page_title, page_description, noindex, nofollow)
    VALUES (
      'Gratis Guide SEO',
      'Gratis AI & Automation Guide',
      'Download onze gratis guide over AI en automatisering. Praktische tips om direct mee aan de slag te gaan met Make en Zapier voor jouw automatisering.',
      false,
      false
    );
  END IF;

  -- Privacy Policy SEO
  IF NOT EXISTS (SELECT 1 FROM seo_settings WHERE internal_name = 'Privacy Policy SEO') THEN
    INSERT INTO seo_settings (internal_name, page_title, page_description, noindex, nofollow)
    VALUES (
      'Privacy Policy SEO',
      'Privacy Policy - Tielo Digital',
      'Lees ons privacybeleid en hoe wij omgaan met jouw gegevens. Transparant en duidelijk uitgelegd.',
      false,
      false
    );
  END IF;

  -- Terms SEO
  IF NOT EXISTS (SELECT 1 FROM seo_settings WHERE internal_name = 'Terms SEO') THEN
    INSERT INTO seo_settings (internal_name, page_title, page_description, noindex, nofollow)
    VALUES (
      'Terms SEO',
      'Algemene Voorwaarden - Tielo Digital',
      'Lees onze algemene voorwaarden voor het gebruik van onze diensten. Duidelijke afspraken voor een goede samenwerking.',
      false,
      false
    );
  END IF;

  -- Cookies SEO
  IF NOT EXISTS (SELECT 1 FROM seo_settings WHERE internal_name = 'Cookies SEO') THEN
    INSERT INTO seo_settings (internal_name, page_title, page_description, noindex, nofollow)
    VALUES (
      'Cookies SEO',
      'Cookie Beleid - Tielo Digital',
      'Lees ons cookiebeleid en hoe wij cookies gebruiken op onze website. Transparant en volgens de AVG-richtlijnen.',
      false,
      false
    );
  END IF;

  -- Business Card SEO
  IF NOT EXISTS (SELECT 1 FROM seo_settings WHERE internal_name = 'Business Card SEO') THEN
    INSERT INTO seo_settings (internal_name, page_title, page_description, noindex, nofollow)
    VALUES (
      'Business Card SEO',
      'Tim Tielkemeijer - Digital Business Card',
      'Digitaal visitekaartje van Tim Tielkemeijer - AI & Automation Expert bij Tielo Digital.',
      true,
      true
    );
  END IF;

  -- Call SEO
  IF NOT EXISTS (SELECT 1 FROM seo_settings WHERE internal_name = 'Call SEO') THEN
    INSERT INTO seo_settings (internal_name, page_title, page_description, noindex, nofollow)
    VALUES (
      'Call SEO',
      'Plan een Gesprek - Tielo Digital',
      'Plan direct een vrijblijvend gesprek over AI en automatisering voor jouw bedrijf. Ontdek de mogelijkheden in een persoonlijk gesprek.',
      false,
      false
    );
  END IF;

  -- Guide Thank You SEO
  IF NOT EXISTS (SELECT 1 FROM seo_settings WHERE internal_name = 'Guide Thank You SEO') THEN
    INSERT INTO seo_settings (internal_name, page_title, page_description, noindex, nofollow)
    VALUES (
      'Guide Thank You SEO',
      'Bedankt voor je aanmelding - Tielo Digital',
      'Je gratis AI & Automation guide is onderweg naar je inbox. Check je email voor de download link.',
      true,
      true
    );
  END IF;

  -- Analysis Thank You SEO
  IF NOT EXISTS (SELECT 1 FROM seo_settings WHERE internal_name = 'Analysis Thank You SEO') THEN
    INSERT INTO seo_settings (internal_name, page_title, page_description, noindex, nofollow)
    VALUES (
      'Analysis Thank You SEO',
      'Bedankt voor je aanvraag - Tielo Digital',
      'Bedankt voor je interesse in een gratis AI & Automation analyse. We nemen binnen 48 uur contact met je op.',
      true,
      true
    );
  END IF;
END $$;