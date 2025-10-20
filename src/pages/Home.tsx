import React from 'react';
import { Hero } from '../components/Hero';
import { MetricsDashboard } from '../components/Dashboard';
import { ProblemSolveSection } from '../components/Home/ProblemSolveSection';
import { Benefits } from '../components/Home/Benefits';
import { Services } from '../components/Services';
import { Testimonials } from '../components/Testimonials';
import { CTASection } from '../components/CTASection';
import { ContentfulSEO } from '../components/SEO/ContentfulSEO';

export function Home() {
  return (
    <>
      <ContentfulSEO 
        internalName="Home page SEO"
        fallback={{
          title: "AI & Automatisering voor Bedrijven",
          description: "Transformeer jouw bedrijf met AI-gedreven oplossingen en automatisering. Verhoog efficiency, verminder kosten en blijf voorop in innovatie."
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