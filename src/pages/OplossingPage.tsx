import React from 'react';
import { useOplossing } from '../hooks/useOplossing';
import { Loader } from 'lucide-react';
import { OplossingContent } from '../components/Oplossingen/OplossingContent';
import { OplossingenCTA } from '../components/Oplossingen/OplossingenCTA';
import { SEO } from '../components/SEO';

interface OplossingPageProps {
  slug: string;
}

export function OplossingPage({ slug }: OplossingPageProps) {
  const { oplossing, isLoading, error } = useOplossing(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !oplossing) {
    return (
      <div className="min-h-screen pt-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-red-600">{error || 'Oplossing niet gevonden'}</p>
        </div>
      </div>
    );
  }

  const { fields } = oplossing;
  const description = fields.shortDescription || 
    `${fields.title} - Een concrete oplossing voor bouwbedrijven. Bekijk hoe we dit succesvol hebben geïmplementeerd en wat de resultaten zijn.`;

  return (
    <div className="min-h-screen">
      <SEO
        title={fields.title}
        description={description}
        keywords={[
          'AI Oplossing',
          'Automatisering',
          'Bouwbedrijf',
          'Succesverhaal',
          'Case Study',
          fields.title
        ]}
        canonical={`https://www.tielo-digital.nl/oplossingen/${slug}`}
        ogImage={fields.featuredImage ? `https:${fields.featuredImage.fields.file.url}` : undefined}
      />
      <OplossingContent oplossing={oplossing} />
      <OplossingenCTA />
    </div>
  );
}
