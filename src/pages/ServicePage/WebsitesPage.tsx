import React from 'react';
import { SEO } from '../../components/SEO';
import { WebsitesHero } from './WebsitesPage/components/WebsitesHero';
import { WebsitesShowcase } from './WebsitesPage/components/WebsitesShowcase';
import { WebsitesOffer } from './WebsitesPage/components/WebsitesOffer';
import { WebsitesValue } from './WebsitesPage/components/WebsitesValue';
import { WebsitesPricing } from './WebsitesPage/components/WebsitesPricing';
import { WebsitesPortfolio } from './WebsitesPage/components/WebsitesPortfolio';
import { WebsitesForm } from './WebsitesPage/components/WebsitesForm';

export function WebsitesPage() {
  return (
    <div className="min-h-screen">
      <SEO
        title="Website voor Bouwbedrijven | Gratis Opzetje"
        description="Gratis website-opzetje voor bouwbedrijven. Volledig ontzorgd: domein, hosting, DNS, Google Business, WhatsApp integratie. Jij werkt, ik bouw. €750 + €25/maand."
        keywords={[
          'Website Bouwbedrijf',
          'Gratis Website',
          'Website Metselaar',
          'Website Aannemer',
          'Google Business',
          'Domein Hosting',
          'Website Maken'
        ]}
        canonical="https://www.tielo-digital.nl/diensten/websites"
      />
      <WebsitesHero />
      <WebsitesShowcase />
      <WebsitesOffer />
      <WebsitesValue />
      <WebsitesPricing />
      <WebsitesPortfolio />
      <WebsitesForm />
    </div>
  );
}
