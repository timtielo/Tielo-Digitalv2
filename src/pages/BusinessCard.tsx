import React from 'react';
import { BusinessCardHero } from '../components/BusinessCard/BusinessCardHero';
import { SocialButtons } from '../components/BusinessCard/SocialButtons';
import { SEO } from '../components/SEO';

export function BusinessCard() {
  return (
    <>
      <SEO
        title="Tim Tielkemeijer - Digital Business Card"
        description="Digitaal visitekaartje van Tim Tielkemeijer, oprichter van Tielo Digital. Gratis website-opzetjes voor bouwbedrijven. Specialist in domein, hosting & online zichtbaarheid voor starters."
        keywords={[
          'Tim Tielkemeijer',
          'Tielo Digital',
          'Digital Business Card',
          'Website Specialist',
          'Bouwbedrijf Expert',
          'Visitekaartje'
        ]}
        canonical="https://www.tielo-digital.nl/visitekaartje"
      />
      <div className="min-h-screen bg-gray-50">
        <BusinessCardHero />
        <section className="py-12">
          <div className="container mx-auto px-4">
            <SocialButtons />
          </div>
        </section>
      </div>
    </>
  );
}
