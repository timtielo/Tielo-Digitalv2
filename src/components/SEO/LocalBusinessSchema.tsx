import React from 'react';
import { BUSINESS_INFO, SERVICES } from '../../config/business';

interface LocalBusinessSchemaProps {
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
  additionalType?: string;
}

export function LocalBusinessSchema({
  aggregateRating,
  additionalType = 'ProfessionalService'
}: LocalBusinessSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', additionalType],
    '@id': BUSINESS_INFO.url,
    name: BUSINESS_INFO.name,
    legalName: BUSINESS_INFO.legalName,
    description: BUSINESS_INFO.description,
    url: BUSINESS_INFO.url,
    logo: BUSINESS_INFO.logo,
    image: BUSINESS_INFO.image,
    email: BUSINESS_INFO.email,
    telephone: BUSINESS_INFO.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS_INFO.address.streetAddress,
      addressLocality: BUSINESS_INFO.address.addressLocality,
      addressRegion: BUSINESS_INFO.address.addressRegion,
      postalCode: BUSINESS_INFO.address.postalCode,
      addressCountry: BUSINESS_INFO.address.addressCountry
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS_INFO.coordinates.latitude,
      longitude: BUSINESS_INFO.coordinates.longitude
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00'
    },
    priceRange: BUSINESS_INFO.priceRange,
    areaServed: BUSINESS_INFO.areaServed.map(area => ({
      '@type': 'City',
      name: area
    })),
    serviceArea: {
      '@type': BUSINESS_INFO.serviceArea.type,
      name: BUSINESS_INFO.serviceArea.name
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Digitale Diensten',
      itemListElement: SERVICES.map((service, index) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.name,
          description: service.description,
          url: service.url
        },
        position: index + 1
      }))
    },
    founder: {
      '@type': 'Person',
      name: BUSINESS_INFO.founder
    },
    foundingDate: BUSINESS_INFO.foundingDate,
    sameAs: BUSINESS_INFO.sameAs,
    ...(aggregateRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: aggregateRating.ratingValue,
        reviewCount: aggregateRating.reviewCount,
        bestRating: '5',
        worstRating: '1'
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
