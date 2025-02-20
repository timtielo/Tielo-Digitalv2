import React from 'react';
import { GuideHero } from '../components/Guide/GuideHero';
import { GuideForm } from '../components/Guide/GuideForm';
import { GuideFeatures } from '../components/Guide/GuideFeatures';
import { SupabaseSEO } from '../components/SEO/SupabaseSEO';

export function GratisGuide() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <SupabaseSEO 
        internalName="Gratis Guide SEO"
        fallback={{
          title: "Gratis AI & Automation Guide",
          description: "Download onze gratis guide over AI en automatisering. Praktische tips om direct mee aan de slag te gaan met Make en Zapier voor jouw automatisering."
        }}
      />
      <GuideHero />
      <GuideFeatures />
      <GuideForm />
    </div>
  );
}