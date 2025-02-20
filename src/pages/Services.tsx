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
          title: "AI & Automatisering Diensten",
          description: "Van workflow automatisering tot AI-implementatie. Ontdek onze diensten die jouw bedrijf helpen groeien en efficiënter maken."
        }}
      />
      <ServicesHero />
      <ServicesList />
      <ServicesProcess />
      <WebsitesSection />
      <ServicesCTA />
    </div>
  );
}