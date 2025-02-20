/*
  # SEO Migration

  1. New Tables
    - `seo_settings`
      - Stores SEO configuration for each page
      - Includes meta tags, social sharing, and robots directives
  
  2. Security
    - Enable RLS
    - Allow public read access
    - Restrict write access to authenticated users
*/

CREATE TABLE IF NOT EXISTS seo_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  internal_name text UNIQUE NOT NULL,
  page_title text NOT NULL,
  page_description text,
  canonical_url text,
  nofollow boolean NOT NULL DEFAULT false,
  noindex boolean NOT NULL DEFAULT false,
  share_image_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read SEO settings
CREATE POLICY "Anyone can read SEO settings"
  ON seo_settings
  FOR SELECT
  TO anon
  USING (true);

-- Allow authenticated users to manage SEO settings
CREATE POLICY "Authenticated users can manage SEO settings"
  ON seo_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default SEO settings
INSERT INTO seo_settings (internal_name, page_title, page_description) VALUES
  ('Home page SEO', 'AI & Automatisering voor Bedrijven', 'Transformeer jouw bedrijf met AI-gedreven oplossingen en automatisering. Verhoog efficiency, verminder kosten en blijf voorop in innovatie.'),
  ('Website Development SEO', 'Website Development | Professionele Websites', 'Laat jouw bedrijf online groeien met een professionele website. Modern design, snelle performance en optimale conversie - wij bouwen websites die resultaat leveren.'),
  ('Diensten SEO', 'AI & Automatisering Diensten', 'Van workflow automatisering tot AI-implementatie. Ontdek onze diensten die jouw bedrijf helpen groeien en efficiënter maken.'),
  ('Diensten Workflow', 'Workflow Automatisering | Systeem Integratie & Procesoptimalisatie', 'Optimaliseer jouw bedrijfsprocessen met professionele workflow automatisering. Verbind systemen, elimineer handmatig werk en verhoog efficiency.'),
  ('Diensten Outreach', 'Outreach Automatisering | Lead Generation & Nurturing', 'Bereik meer potentiële klanten met geautomatiseerde outreach. Personaliseer je benadering, volg leads automatisch op en verhoog je conversies.'),
  ('Email Automatisering SEO', 'Email Automatisering | AI Email Management', 'Automatiseer je email communicatie met AI. Laat kunstmatige intelligentie je emails schrijven en beheren, terwijl jij alleen nog hoeft te controleren.'),
  ('AI Klantenservice SEO', 'AI Klantenservice | Chatbot & Support Automatisering', 'Verbeter je klantenservice met AI-gedreven oplossingen. 24/7 beschikbaar voor je klanten met intelligente chatbots en geautomatiseerde support.'),
  ('AI Content Creation SEO', 'AI Content Creation | Blog & Social Media Content', 'Laat AI je content schrijven. Van blog artikelen tot social media posts - creëer hoogwaardige content die converteert en je merk versterkt.'),
  ('Succesverhalen SEO', 'Succesverhalen - Tielo Digital Cases', 'Ontdek hoe andere bedrijven succesvol zijn geworden met onze AI en automatisering oplossingen. Concrete resultaten en ervaringen van klanten.');

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_seo_settings_updated_at
  BEFORE UPDATE ON seo_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();