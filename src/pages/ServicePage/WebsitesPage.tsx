import React from 'react';
import { ContentfulSEO } from '../../components/SEO/ContentfulSEO';
import { WebsitesHero } from './WebsitesPage/components/WebsitesHero';
import { WebsitesValue } from './WebsitesPage/components/WebsitesValue';
import { WebsitesOffer } from './WebsitesPage/components/WebsitesOffer';
import { WebsitesShowcase } from './WebsitesPage/components/WebsitesShowcase';
import { WebsitesPortfolio } from './WebsitesPage/components/WebsitesPortfolio';
import { WebsitesProcess } from './WebsitesPage/components/WebsitesProcess';
import { WebsitesForm } from './WebsitesPage/components/WebsitesForm';

export function WebsitesPage() {
  return (
    <div className="min-h-screen">
      <ContentfulSEO
        internalName="Website Development SEO"
        fallback={{
          title: "Gratis eerste websiteversie – Website laten maken door Tielo Digital",
          description: "Laat gratis een eerste versie van je website bouwen door Tielo Digital. Bevalt het resultaat? Dan plannen we een korte call om te lanceren. Geen risico, geen verplichtingen."
        }}
      />
      <WebsitesHero />
      <WebsitesValue />
      <WebsitesOffer />
      <WebsitesShowcase />
      <WebsitesPortfolio />
      <WebsitesProcess />
      <WebsitesForm />
    </div>
  );
}
