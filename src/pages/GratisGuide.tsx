import React from 'react';
import { GuideHero } from '../components/Guide/GuideHero';
import { GuideForm } from '../components/Guide/GuideForm';
import { GuideFeatures } from '../components/Guide/GuideFeatures';
import { SEO } from '../components/SEO';

export function GratisGuide() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <SEO 
        title="Gratis AI & Automation Guide"
        description="Download onze gratis guide over AI en automatisering. Praktische tips om direct mee aan de slag te gaan met Make en Zapier voor jouw automatisering."
        keywords={[
          'AI Guide',
          'Automatisering Guide',
          'Make Tutorial',
          'Zapier Tutorial',
          'Gratis AI Guide',
          'Automation Tips'
        ]}
        ogType="article"
      />
      <GuideHero />
      <GuideFeatures />
      <GuideForm />
    </div>
  );
}