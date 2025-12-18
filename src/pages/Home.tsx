import React, { useEffect } from 'react';
import { Hero } from '../components/Hero';
import { ProblemSolveSection } from '../components/Home/ProblemSolveSection';
import { AgitateSection } from '../components/Home/AgitateSection';
import { OplossingSection } from '../components/Home/OplossingSection';
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
        title="Website voor Bouwbedrijven | Word Zichtbaar Zonder Gedoe"
        description="Geen gedoe met Werkspot of DNS settings. Gratis website-opzetje voor jouw bouwbedrijf. Ik regel alle techniek: domein, hosting, Google Business, WhatsApp. Jij hoeft alleen je werk te doen."
        keywords={[
          'Website Bouwbedrijf',
          'Gratis Website',
          'Bouwbedrijf Online',
          'Google Business',
          'Website Metselaar',
          'Website Aannemer',
          'Domein Registratie'
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
      <AgitateSection />
      <OplossingSection />
      <Benefits />
      <div id="voorbeelden">
        <WebsiteShowcase />
      </div>
      <CTASection />
    </>
  );
}