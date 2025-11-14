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
          title: "Website voor Bouwbedrijven | Gratis Opzetje | Tielo Digital",
          description: "Word zichtbaar voor klanten zonder gedoe. Gratis website-opzetje voor startende bouwbedrijven. Ik regel alle techniek: DNS, hosting, Google Business, WhatsApp. Jij hoeft alleen je werk te doen."
        }}
      />
      <LocalBusinessSchema
        aggregateRating={{
          ratingValue: 5,
          reviewCount: 6
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