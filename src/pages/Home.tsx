import React from 'react';
import { Hero } from '../components/Hero';
import { ProblemSolveSection } from '../components/Home/ProblemSolveSection';
import { AgitateSection } from '../components/Home/AgitateSection';
import { OplossingSection } from '../components/Home/OplossingSection';
import { Benefits } from '../components/Home/Benefits';
import { WebsiteShowcase } from '../components/Websites/WebsiteShowcase';
import { Testimonials } from '../components/Testimonials';
import { CTASection } from '../components/CTASection';
import { ContentfulSEO } from '../components/SEO/ContentfulSEO';
import { LocalBusinessSchema } from '../components/SEO/LocalBusinessSchema';

export function Home() {
  return (
    <>
      <ContentfulSEO
        internalName="Home page SEO"
        fallback={{
          title: "Website voor Bouwbedrijven | Word Zichtbaar Zonder Gedoe | Tielo Digital",
          description: "Geen gedoe met Werkspot of DNS settings. Gratis website-opzetje voor jouw bouwbedrijf. Ik regel alle techniek: domein, hosting, Google Business, WhatsApp. Jij hoeft alleen je werk te doen."
        }}
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
      <Testimonials />
      <CTASection />
    </>
  );
}