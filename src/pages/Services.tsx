import React from 'react';
import { ServicesHero } from '../components/Services/ServicesHero';
import { ServicesList } from '../components/Services/ServicesList';
import { ServicesProcess } from '../components/Services/ServicesProcess';
import { ServicesCTA } from '../components/Services/ServicesCTA';
import { WebsitesSection } from '../components/Services/WebsitesSection';

export function Services() {
  return (
    <div className="min-h-screen bg-white">
      <ServicesHero />
      <ServicesList />
      <ServicesProcess />
      <WebsitesSection />
      <ServicesCTA />
    </div>
  );
}