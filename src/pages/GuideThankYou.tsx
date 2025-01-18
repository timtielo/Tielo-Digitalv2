import React from 'react';
import { ThankYouHero } from '../components/Guide/ThankYouHero';
import { GuideAnalysisCTA } from '../components/Guide/GuideAnalysisCTA';

export function GuideThankYou() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <ThankYouHero />
      <GuideAnalysisCTA />
    </div>
  );
}