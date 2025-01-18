import React, { useState } from 'react';
import { OplossingenHero } from '../components/Oplossingen/OplossingenHero';
import { OplossingenGrid } from '../components/Oplossingen/OplossingenGrid';
import { OplossingenCTA } from '../components/Oplossingen/OplossingenCTA';
import { useOplossingen } from '../hooks/useOplossingen';
import { Loader } from 'lucide-react';
import { SEO } from '../components/SEO';

export function Oplossingen() {
  const [currentPage, setCurrentPage] = useState(1);
  const { oplossingen, isLoading, error, totalPages } = useOplossingen(currentPage);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <p className="text-gray-600">
            Controleer of je content model in Contentful correct is ingesteld
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="Oplossingen - Tielo Digital"
        description="Bekijk onze succesvolle AI en automatisering oplossingen. Concrete voorbeelden van hoe wij bedrijven helpen groeien en efficiënter werken."
        keywords={[
          'AI Oplossingen',
          'Automatisering Oplossingen',
          'Bedrijfsprocessen',
          'Digitale Transformatie',
          'Business Solutions'
        ]}
        ogType="website"
        canonical="https://tielo-digital.nl/oplossingen"
      />
      <OplossingenHero />
      <OplossingenGrid 
        oplossingen={oplossingen}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      <OplossingenCTA />
    </div>
  );
}