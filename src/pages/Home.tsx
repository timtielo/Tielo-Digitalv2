import React from 'react';
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
          reviewCount: 3
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