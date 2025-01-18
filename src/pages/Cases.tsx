import React from 'react';
import { CasesHero } from '../components/Cases/CasesHero';
import { CaseStudy } from '../components/Cases/CaseStudy';
import { CasesCTA } from '../components/Cases/CasesCTA';

const caseStudies = [
  {
    project: {
      title: 'Automatisering - Finance',
      description: 'Honderden handmatige boekingen vanuit een boekingssysteem naar een boekhoudsysteem. Niet alleen heel tijdrovend, ook worden er gemakkelijk fouten gemaakt. In de boekhouding is dat niet handig.'
    },
    background: {
      challenge: 'Bij deze klant werden er handmatig honderden facturen handmatig geboekt. Informatie uit het boekprogramma moest naar het boekhoudprogramma. Honderden keren dezelfde handeling, copy-paste.',
      solution: 'Dit process is nu succesvol geautomatiseerd.'
    },
    testimonial: {
      quote: 'Tim is een all-round IT & finance professional waarmee je snel kan schakelen. Van advies tot implementatie: Tim zorgt ervoor dat doelen snel bereikt worden. Nieuwe uitdagingen grijpt hij direct aan en hij is hierin erg nieuwsgierig en leergierig. Voor Terrasboot heeft hij onder andere een koppeling ontwikkeld en geïmplementeerd om betalingen automatisch te factureren en in te boeken. Dit bespaart ons uren tijd en hiermee heeft Tim zich dubbel en dwars terugverdiend. Wij zullen Tim vaker benaderen voor complexe vraagstukken.',
      author: 'Quinten Grundmeijer',
      role: 'Directeur',
      company: 'Terrasboot'
    }
  }
];

export function Cases() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CasesHero />
      
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-12">
            {caseStudies.map((caseStudy, index) => (
              <CaseStudy key={index} {...caseStudy} />
            ))}
          </div>
        </div>
      </section>

      <CasesCTA />
    </div>
  );
}