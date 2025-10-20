import React from 'react';
import { BUSINESS_INFO } from '../../config/business';

interface ServiceSchemaProps {
  name: string;
  description: string;
  url: string;
  serviceType?: string;
  areaServed?: string[];
  offers?: {
    price?: string;
    priceCurrency?: string;
    description?: string;
  };
}

export function ServiceSchema({
  name,
  description,
  url,
  serviceType = 'ProfessionalService',
  areaServed = BUSINESS_INFO.areaServed,
  offers
}: ServiceSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType,
    name,
    description,
    url,
    provider: {
      '@type': 'LocalBusiness',
      '@id': BUSINESS_INFO.url,
      name: BUSINESS_INFO.name,
      url: BUSINESS_INFO.url,
      telephone: BUSINESS_INFO.phone,
      email: BUSINESS_INFO.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: BUSINESS_INFO.address.streetAddress,
        addressLocality: BUSINESS_INFO.address.addressLocality,
        addressRegion: BUSINESS_INFO.address.addressRegion,
        postalCode: BUSINESS_INFO.address.postalCode,
        addressCountry: BUSINESS_INFO.address.addressCountry
      }
    },
    areaServed: areaServed.map(area => ({
      '@type': 'City',
      name: area
    })),
    ...(offers && {
      offers: {
        '@type': 'Offer',
        ...offers,
        priceCurrency: offers.priceCurrency || 'EUR'
      }
    })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
