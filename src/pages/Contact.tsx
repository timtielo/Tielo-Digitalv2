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
          title: "Contact - Gratis Website-opzetje voor Bouwbedrijven | Tielo Digital",
          description: "Vraag hier jouw gratis website-opzetje aan. Ik neem dezelfde dag contact op. Volledig ontzorgd voor startende bouwbedrijven."
        }}
      />
      <ContactHero />
      <AutomationAnalysisForm />
    </div>
  );
}