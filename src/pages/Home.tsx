import React from 'react';
import { Hero } from '../components/Hero';
import { MetricsDashboard } from '../components/Dashboard';
import { ProblemSolveSection } from '../components/Home/ProblemSolveSection';
import { Benefits } from '../components/Home/Benefits';
import { Services } from '../components/Services';
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
          title: "AI & Automatisering voor Bedrijven in Utrecht | Tielo Digital",
          description: "Tielo Digital - AI-gedreven automatisering en digitale oplossingen voor bedrijven in Utrecht en heel Nederland. Verhoog efficiency, verminder kosten met slimme workflow automation. ✓ 1189% ROI ✓ 200+ uren bespaard."
        }}
      />
      <LocalBusinessSchema
        aggregateRating={{
          ratingValue: 5,
          reviewCount: 6
        }}
      />
      <Hero />
      <MetricsDashboard />
      <ProblemSolveSection />
      <Benefits />
      <Services />
      <Testimonials />
      <CTASection />
    </>
  );
}