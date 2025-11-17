import React from 'react';
import { ServicesHero } from '../components/Services/ServicesHero';
import { ServicesList } from '../components/Services/ServicesList';
import { ServicesCTA } from '../components/Services/ServicesCTA';
import { WebsitesSection } from '../components/Services/WebsitesSection';
import { SEO } from '../components/SEO';

export function Services() {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Websites en Maatwerk voor Bouwbedrijven"
        description="Professionele websites en maatwerk oplossingen voor bouwbedrijven. Snel online met domein, hosting en Google Business. Geen technische kennis nodig, volledig ontzorgd."
        keywords={[
          'Website Bouwbedrijf',
          'Maatwerk Website',
          'Professionele Website',
          'Website Maken',
          'Bouwbedrijf Diensten',
          'Online Marketing Bouw'
        ]}
        canonical="https://www.tielo-digital.nl/diensten"
      />
      <ServicesHero />
      <WebsitesSection />
      <ServicesList />
      <ServicesCTA />
    </div>
  );
}