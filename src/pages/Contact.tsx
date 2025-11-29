import React from 'react';
import { ContactHero } from '../components/Contact/ContactHero';
import { AutomationAnalysisForm } from '../components/Guide/AutomationAnalysisForm';
import { SEO } from '../components/SEO';

export function Contact() {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Contact - Gratis Website-opzetje voor Bouwbedrijven"
        description="Vraag hier jouw gratis website-opzetje aan. Ik neem dezelfde dag contact op. Volledig ontzorgd: domein, hosting, DNS, Google Business, WhatsApp integratie. Voor startende bouwbedrijven."
        keywords={[
          'Contact',
          'Gratis Website Bouwbedrijf',
          'Website Aanvragen',
          'Bouwbedrijf Online',
          'Tielo Digital Contact',
          'Domein Registratie',
          'Website Hosting'
        ]}
        canonical="https://www.tielo-digital.nl/contact"
      />
      <ContactHero />
      <AutomationAnalysisForm />
    </div>
  );
}
