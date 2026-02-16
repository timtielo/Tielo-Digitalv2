import React, { useEffect } from 'react';
import { Hero } from '../components/Hero';
import { ProblemSolveSection } from '../components/Home/ProblemSolveSection';
import { OplossingSection } from '../components/Home/OplossingSection';
import { AgitateSection } from '../components/Home/AgitateSection';
import { Benefits } from '../components/Home/Benefits';
import { Testimonials } from '../components/Testimonials';
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
        title="Meer Klussen Zonder Werkspot | Website voor Vakmensen"
        description="Ik maak simpele, sterke websites voor vakmensen die zelf controle willen over hun klanten. Binnen 2 weken live. Loodgieters, aannemers, elektriciens, schilders."
        keywords={[
          'Website vakmensen',
          'Website loodgieter',
          'Website aannemer',
          'Website elektricien',
          'Website schilder',
          'Website metselaar',
          'Werkspot alternatief'
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
      <ProblemSolveSection />
      <OplossingSection />
      <AgitateSection />
      <Benefits />
      <Testimonials />
      <div id="voorbeelden">
        <WebsiteShowcase />
      </div>
      <CTASection />
    </>
  );
}
