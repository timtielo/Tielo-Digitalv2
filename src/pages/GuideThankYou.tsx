import React from 'react';
import { ThankYouHero } from '../components/Guide/ThankYouHero';
import { GuideAnalysisCTA } from '../components/Guide/GuideAnalysisCTA';
import { SEO } from '../components/SEO';

export function GuideThankYou() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <SEO
        title="Bedankt voor je Aanmelding - Guide Onderweg"
        description="Bedankt voor je aanmelding! De gratis guide 'In 7 dagen online zichtbaar' is onderweg naar je inbox. Check je email (ook spam) voor de download link. Direct aan de slag!"
        keywords={[
          'Guide Gedownload',
          'Bevestiging',
          'Email Verzonden',
          'Bedankt',
          'Tielo Digital Guide'
        ]}
        canonical="https://www.tielo-digital.nl/gratis-guide/bedankt"
        noindex={true}
      />
      <ThankYouHero />
      <GuideAnalysisCTA />
    </div>
  );
}
