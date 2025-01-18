import React from 'react';
import { services } from '../components/Services';
import { ServiceHero } from '../components/ServicePage/ServiceHero';
import { ServiceDetails } from '../components/ServicePage/ServiceDetails';
import { ServiceBenefits } from '../components/ServicePage/ServiceBenefits';
import { ServiceCTA } from '../components/ServicePage/ServiceCTA';
import { SEO } from '../components/SEO';

interface ServicePageProps {
  serviceId: string;
}

export function ServicePage({ serviceId }: ServicePageProps) {
  const service = services.find(s => s.id === serviceId);

  if (!service) {
    return (
      <div className="min-h-screen pt-32">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl">Service niet gevonden</h1>
        </div>
      </div>
    );
  }

  // Generate service-specific metadata
  const title = `${service.title} - Tielo Digital`;
  const description = `${service.description} Ontdek hoe wij jouw bedrijf kunnen helpen met professionele ${service.title.toLowerCase()} oplossingen.`;

  // Generate schema markup for service
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": service.description,
    "provider": {
      "@type": "Organization",
      "name": "Tielo Digital",
      "url": "https://tielo-digital.nl"
    },
    "serviceType": "AI & Automatisering",
    "areaServed": "Netherlands",
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <div className="min-h-screen">
      <SEO 
        title={title}
        description={description}
        keywords={[
          service.title,
          'AI',
          'Automatisering',
          'Bedrijfsprocessen',
          service.title.toLowerCase(),
          'Tielo Digital'
        ]}
        ogType="website"
        canonical={`https://tielo-digital.nl/diensten/${serviceId}`}
      />
      
      {/* Add schema markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      <ServiceHero service={service} />
      <ServiceDetails service={service} />
      <ServiceBenefits service={service} />
      <ServiceCTA />
    </div>
  );
}