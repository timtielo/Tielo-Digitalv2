import React from 'react';
import { ServicesHero } from '../components/Services/ServicesHero';
import { ServicesList } from '../components/Services/ServicesList';
import { ServicesProcess } from '../components/Services/ServicesProcess';
import { ServicesCTA } from '../components/Services/ServicesCTA';
import { WebsitesSection } from '../components/Services/WebsitesSection';
import { ContentfulSEO } from '../components/SEO/ContentfulSEO';

export function Services() {
  return (
    <div className="min-h-screen bg-white">
      <ContentfulSEO
        internalName="Diensten SEO"
        fallback={{
          title: "Websites en Diensten voor Bouwbedrijven | Tielo Digital",
          description: "Professionele websites, klantenservice automatisering en maatwerk oplossingen voor bouwbedrijven. Snel, professioneel en zonder gedoe."
        }}
      />
      <ServicesHero />
      <WebsitesSection />
      <ServicesList />
      <ServicesProcess />
      <ServicesCTA />
    </div>
  );
}