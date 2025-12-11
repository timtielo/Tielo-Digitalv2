import React from 'react';
import { CallHero } from '../components/Call/CallHero';
import { CallCalendar } from '../components/Call/CallCalendar';
import { SEO } from '../components/SEO';

export function Call() {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Plan een Gratis Gesprek - Website voor Bouwbedrijven"
        description="Plan direct een gratis kennismakingsgesprek. Geen verplichtingen, geen gedoe. We bespreken jouw situatie en kijken of een gratis website-opzetje wat voor jou is. Kies zelf een moment."
        keywords={[
          'Gratis Gesprek',
          'Kennismaking',
          'Website Advies',
          'Bouwbedrijf Consult',
          'Plan Afspraak',
          'Tielo Digital Gesprek'
        ]}
        canonical="https://www.tielo-digital.nl/call"
      />
      <CallHero />
      <CallCalendar />
    </div>
  );
}
