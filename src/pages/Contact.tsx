import React from 'react';
import { ContactHero } from '../components/Contact/ContactHero';
import { AutomationAnalysisForm } from '../components/Guide/AutomationAnalysisForm';
import { SEO } from '../components/SEO';

export function Contact() {
  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Contact - Gratis AI & Automation Analyse"
        description="Plan een gratis analyse en ontdek hoe AI en automatisering jouw bedrijf kan helpen groeien. Direct persoonlijk contact met een expert."
        keywords={[
          'Contact',
          'AI Analyse',
          'Automation Consult',
          'Gratis Analyse',
          'Bedrijfsadvies'
        ]}
        ogType="website"
        canonical="https://tielo-digital.nl/contact"
      />
      <ContactHero />
      <AutomationAnalysisForm />
    </div>
  );
}