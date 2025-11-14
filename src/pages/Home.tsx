import React from 'react';
import { Hero } from '../components/Hero';
import { ProblemSolveSection } from '../components/Home/ProblemSolveSection';
import { OplossingSection } from '../components/Home/OplossingSection';
import { Benefits } from '../components/Home/Benefits';
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
          title: "Websites & Automatisering | Van Idee naar Online | Tielo Digital",
          description: "Van websites voor bouwbedrijven tot automatisering van bedrijfsprocessen. Gratis opzetje, snel resultaat. Ik regel alle techniek: DNS, hosting, Google Business, WhatsApp en meer."
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
      <OplossingSection />
      <Benefits />
      <Testimonials />
      <CTASection />
    </>
  );
}