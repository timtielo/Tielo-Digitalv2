import React from 'react';
import { SuccesverhalenHero } from '../components/Succesverhalen/SuccesverhalenHero';
import { CaseStudy } from '../components/Succesverhalen/CaseStudy';
import { SuccesverhalenCTA } from '../components/Succesverhalen/SuccesverhalenCTA';
import { MetricsDashboard } from '../components/Dashboard';
import { WebsiteShowcase } from '../components/Websites/WebsiteShowcase';
import { SEO } from '../components/SEO';

const succesverhalen = [
  {
    project: {
      title: 'Website Development - Meer Impact Marketing',
      description: 'Een professionele website met focus op performance, gebruiksvriendelijkheid en conversie.'
    },
    background: {
      challenge: 'Een nieuwe website bouwen die de professionaliteit van het bedrijf uitstraalt, met goede technische basis en alle benodigde integraties.',
      solution: 'Een volledig geoptimaliseerde website met perfecte technische setup en alle gewenste functionaliteiten.'
    },
    metrics: [
      {
        value: '6',
        label: 'Dagen',
        description: 'Van eerste contact tot live'
      },
      {
        value: '100%',
        label: 'Tevreden',
        description: 'Met het eindresultaat'
      },
      {
        value: '24/7',
        label: 'Inzicht',
        description: 'Via het analytics dashboard'
      }
    ],
    testimonial: {
      quote: 'Tim heeft een geweldige website voor mij gebouwd! Professioneel, supersnel en helemaal naar wens. Dingen waar ik normaal mee worstel, zoals DNS-settings en beveiliging, werden volledig geregeld. De integraties werken perfect, en dankzij het dashboard heb ik eindelijk inzicht in mijn bezoekersaantallen en populairste pagina\'s. Binnen een paar dagen was alles geregeld, van ons eerste contact tot het online-gaan van de site. Het contact verliep soepel, en aanpassingen werden direct doorgevoerd. Ik ben enorm tevreden en heb Tim al aan meerdere mensen in mijn netwerk aanbevolen. Als je een professionele, snelle, en goed presterende website wilt, ben je hier aan het juiste adres!',
      author: 'Lars van der Meer',
      role: 'Eigenaar',
      company: 'Meer Impact Marketing'
    }
  },
  {
    project: {
      title: 'Automatisering - Finance',
      description: 'Honderden handmatige boekingen vanuit een boekingssysteem naar een boekhoudsysteem. Niet alleen heel tijdrovend, ook worden er gemakkelijk fouten gemaakt. In de boekhouding is dat niet handig.'
    },
    background: {
      challenge: 'Bij deze klant werden er handmatig honderden facturen handmatig geboekt. Informatie uit het boekprogramma moest naar het boekhoudprogramma. Honderden keren dezelfde handeling, copy-paste.',
      solution: 'Dit process is nu succesvol geautomatiseerd.'
    },
    metrics: [
      {
        value: '10+',
        label: 'Uur per maand bespaard',
        description: 'Door automatisering van het facturatieproces'
      },
      {
        value: '100%',
        label: 'Foutreductie',
        description: 'Geen handmatige invoerfouten meer'
      },
      {
        value: '150+',
        label: 'Facturen per maand',
        description: 'Automatisch verwerkt en geboekt'
      }
    ],
    testimonial: {
      quote: 'Tim is een all-round IT & finance professional waarmee je snel kan schakelen. Van advies tot implementatie: Tim zorgt ervoor dat doelen snel bereikt worden. Nieuwe uitdagingen grijpt hij direct aan en hij is hierin erg nieuwsgierig en leergierig. Voor Terrasboot heeft hij onder andere een koppeling ontwikkeld en geïmplementeerd om betalingen automatisch te factureren en in te boeken. Dit bespaart ons uren tijd en hiermee heeft Tim zich dubbel en dwars terugverdiend. Wij zullen Tim vaker benaderen voor complexe vraagstukken.',
      author: 'Quinten Grundmeijer',
      role: 'Eigenaar',
      company: 'Terrasboot'
    }
  }
];

export function Succesverhalen() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="Succesverhalen - Tielo Digital Cases"
        description="Ontdek hoe andere bedrijven succesvol zijn geworden met onze AI en automatisering oplossingen. Concrete resultaten en ervaringen van klanten."
        keywords={[
          'Succesverhalen',
          'Case Studies',
          'Klantresultaten',
          'AI Implementatie',
          'Automatisering Cases'
        ]}
        ogType="website"
        canonical="https://tielo-digital.nl/succesverhalen"
      />
      
      <SuccesverhalenHero />
      
      <MetricsDashboard />
      
      {/* Case Studies Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 font-rubik text-center">
              Wat Onze Klanten Zeggen
            </h2>
            <div className="space-y-12">
              {succesverhalen.map((verhaal, index) => (
                <CaseStudy key={index} {...verhaal} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Website Showcase Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <WebsiteShowcase />
          </div>
        </div>
      </section>

      <SuccesverhalenCTA />
    </div>
  );
}