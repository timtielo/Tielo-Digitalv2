import React from 'react';
import { GuideHero } from '../components/Guide/GuideHero';
import { GuideForm } from '../components/Guide/GuideForm';
import { GuideFeatures } from '../components/Guide/GuideFeatures';
import { SEO } from '../components/SEO';

export function GratisGuide() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <SEO
        title="Gratis Guide: Online Zichtbaar voor Bouwbedrijven"
        description="Download gratis: 'In 7 dagen online zichtbaar' - De complete gids voor bouwbedrijven die snel klanten willen vinden via internet. Stap-voor-stap uitgelegd, geen technische kennis nodig."
        keywords={[
          'Gratis Guide Bouwbedrijf',
          'Online Marketing Bouwbedrijf',
          'Klanten Vinden Online',
          'Bouwbedrijf Zichtbaarheid',
          'Google Business',
          'Website Tips Bouwbedrijf'
        ]}
        canonical="https://www.tielo-digital.nl/gratis-guide"
      />
      <GuideHero />
      <GuideFeatures />
      <GuideForm />
    </div>
  );
}
