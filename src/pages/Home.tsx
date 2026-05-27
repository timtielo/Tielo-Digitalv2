import React, { useEffect } from 'react';
import { Hero } from '../components/Hero';
import { WerkspotReviewCard } from '../components/Home/WerkspotReviewCard';
import { ProblemSolveSection } from '../components/Home/ProblemSolveSection';
import { DependencyQuote } from '../components/Home/DependencyQuote';
import { OplossingSection } from '../components/Home/OplossingSection';
import { AgitateSection } from '../components/Home/AgitateSection';
import { Benefits } from '../components/Home/Benefits';

import { WebsiteShowcase } from '../components/Websites/WebsiteShowcase';
import { CTASection } from '../components/CTASection';
import { SEO } from '../components/SEO';
import { LocalBusinessSchema } from '../components/SEO/LocalBusinessSchema';

export function Home() {
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get('type');

    if (type === 'recovery') {
      window.location.href = `/reset-password${window.location.hash}`;
    } else if (type === 'signup' || type === 'magiclink') {
      window.location.href = `/login${window.location.hash}`;
    }
  }, []);
  return (
    <>
      <SEO
        title="Website Laten Maken voor Vakmensen | Loodgieter, Aannemer, Klusbedrijf"
        description="Website laten maken voor loodgieters, aannemers, elektriciens en klusbedrijven. Domein, hosting en Google Business inbegrepen. Binnen 2 weken live."
        keywords={[
          'website laten maken vakmensen',
          'website loodgieter',
          'website aannemer',
          'website elektricien',
          'website schilder',
          'website metselaar',
          'website klusbedrijf',
          'werkspot alternatief'
        ]}
        canonical="https://www.tielo-digital.nl/"
      />
      <LocalBusinessSchema
        aggregateRating={{
          ratingValue: 5,
          reviewCount: 5
        }}
      />
      <Hero />
      <WerkspotReviewCard />
      <ProblemSolveSection />
      <DependencyQuote />
      <OplossingSection />
      <AgitateSection />
      <Benefits />
      <div id="voorbeelden">
        <WebsiteShowcase />
      </div>
      <CTASection />
    </>
  );
}
