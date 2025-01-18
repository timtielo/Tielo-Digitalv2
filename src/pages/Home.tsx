import React from 'react';
import { Hero } from '../components/Hero';
import { MetricsDashboard } from '../components/Dashboard';
import { ProblemSolveSection } from '../components/Home/ProblemSolveSection';
import { Benefits } from '../components/Home/Benefits';
import { Services } from '../components/Services';
import { CaseStudyTestimonial } from '../components/CaseStudyTestimonial';
import { CTASection } from '../components/CTASection';
import { SEO } from '../components/SEO';

export function Home() {
  return (
    <>
      <SEO 
        title="Tielo Digital - AI & Automatisering"
        description="Transformeer jouw bedrijf met AI-gedreven oplossingen en automatisering. Verhoog efficiency, verminder kosten en blijf voorop in innovatie."
        keywords={[
          'AI',
          'Automatisering',
          'Bedrijfsprocessen',
          'Digitale Transformatie',
          'Workflow Optimalisatie',
          'Tielo Digital'
        ]}
        ogType="website"
        canonical="https://tielo-digital.nl"
      />
      <Hero />
      <MetricsDashboard />
      <ProblemSolveSection />
      <Benefits />
      <Services />
      <CaseStudyTestimonial />
      <CTASection />
    </>
  );
}