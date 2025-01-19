import React from 'react';
import { useOplossing } from '../hooks/useOplossing';
import { Loader } from 'lucide-react';
import { OplossingsSEO } from '../components/SEO/OplossingsSEO';
import { OplossingContent } from '../components/Oplossingen/OplossingContent';
import { OplossingenCTA } from '../components/Oplossingen/OplossingenCTA';

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

  return (
    <div className="min-h-screen">
      <OplossingsSEO oplossing={oplossing} />
      <OplossingContent oplossing={oplossing} />
      <OplossingenCTA />
    </div>
  );
}