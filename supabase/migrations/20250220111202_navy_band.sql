/*
  # Add SEO Settings for Remaining Pages

  1. Changes
    - Add SEO settings for:
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

-- Insert SEO settings for remaining pages
INSERT INTO seo_settings (
  internal_name, 
  page_title, 
  page_description,
  noindex,
  nofollow
) VALUES
  (
    'Contact SEO',
    'Contact - Gratis AI & Automation Analyse',
    'Plan een gratis analyse en ontdek hoe AI en automatisering jouw bedrijf kan helpen groeien. Direct persoonlijk contact met een expert.',
    false,
    false
  ),
  (
    'Gratis Guide SEO',
    'Gratis AI & Automation Guide',
    'Download onze gratis guide over AI en automatisering. Praktische tips om direct mee aan de slag te gaan met Make en Zapier voor jouw automatisering.',
    false,
    false
  ),
  (
    'Privacy Policy SEO',
    'Privacy Policy - Tielo Digital',
    'Lees ons privacybeleid en hoe wij omgaan met jouw gegevens. Transparant en duidelijk uitgelegd.',
    false,
    false
  ),
  (
    'Terms SEO',
    'Algemene Voorwaarden - Tielo Digital',
    'Lees onze algemene voorwaarden voor het gebruik van onze diensten. Duidelijke afspraken voor een goede samenwerking.',
    false,
    false
  ),
  (
    'Cookies SEO',
    'Cookie Beleid - Tielo Digital',
    'Lees ons cookiebeleid en hoe wij cookies gebruiken op onze website. Transparant en volgens de AVG-richtlijnen.',
    false,
    false
  ),
  (
    'Business Card SEO',
    'Tim Tielkemeijer - Digital Business Card',
    'Digitaal visitekaartje van Tim Tielkemeijer - AI & Automation Expert bij Tielo Digital.',
    true, -- noindex
    true  -- nofollow
  ),
  (
    'Call SEO',
    'Plan een Gesprek - Tielo Digital',
    'Plan direct een vrijblijvend gesprek over AI en automatisering voor jouw bedrijf. Ontdek de mogelijkheden in een persoonlijk gesprek.',
    false,
    false
  ),
  (
    'Guide Thank You SEO',
    'Bedankt voor je aanmelding - Tielo Digital',
    'Je gratis AI & Automation guide is onderweg naar je inbox. Check je email voor de download link.',
    true, -- noindex
    true  -- nofollow
  ),
  (
    'Analysis Thank You SEO',
    'Bedankt voor je aanvraag - Tielo Digital',
    'Bedankt voor je interesse in een gratis AI & Automation analyse. We nemen binnen 48 uur contact met je op.',
    true, -- noindex
    true  -- nofollow
  );