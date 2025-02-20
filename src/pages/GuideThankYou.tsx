import React from 'react';
import { ThankYouHero } from '../components/Guide/ThankYouHero';
import { GuideAnalysisCTA } from '../components/Guide/GuideAnalysisCTA';
import { SupabaseSEO } from '../components/SEO/SupabaseSEO';

export function GuideThankYou() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <SupabaseSEO 
        internalName="Guide Thank You SEO"
        fallback={{
          title: "Bedankt voor je aanmelding - Tielo Digital",
          description: "Je gratis AI & Automation guide is onderweg naar je inbox. Check je email voor de download link."
        }}
      />
      <ThankYouHero />
      <GuideAnalysisCTA />
    </div>
  );
}