import React from 'react';
import { ContactHero } from '../components/Contact/ContactHero';
import { AutomationAnalysisForm } from '../components/Guide/AutomationAnalysisForm';
import { SupabaseSEO } from '../components/SEO/SupabaseSEO';

export function Contact() {
  return (
    <div className="min-h-screen bg-white">
      <SupabaseSEO 
        internalName="Contact SEO"
        fallback={{
          title: "Contact - Gratis AI & Automation Analyse",
          description: "Plan een gratis analyse en ontdek hoe AI en automatisering jouw bedrijf kan helpen groeien. Direct persoonlijk contact met een expert."
        }}
      />
      <ContactHero />
      <AutomationAnalysisForm />
    </div>
  );
}