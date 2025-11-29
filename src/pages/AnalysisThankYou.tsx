import React from 'react';
import { AnalysisThankYouHero } from '../components/Analysis/AnalysisThankYouHero';
import { CalendarSection } from '../components/Analysis/Calendar';
import { BlogPreview } from '../components/Analysis/BlogPreview';
import { SEO } from '../components/SEO';

export function AnalysisThankYou() {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Aanvraag Ontvangen - We Nemen Contact Op"
        description="Bedankt voor je aanvraag! Ik neem binnen 1 werkdag contact met je op om je gratis website-opzetje te bespreken. In de tussentijd: plan alvast een gesprek of bekijk onze blog."
        keywords={[
          'Aanvraag Bevestiging',
          'Contact Opnemen',
          'Website Aangevraagd',
          'Bedankt',
          'Tielo Digital'
        ]}
        canonical="https://www.tielo-digital.nl/analysis-thank-you"
        noindex={true}
      />
      <AnalysisThankYouHero />
      <CalendarSection />
      <BlogPreview />
    </div>
  );
}
