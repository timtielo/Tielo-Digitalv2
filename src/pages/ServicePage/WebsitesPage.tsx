import React from 'react';
import { ContentfulSEO } from '../../components/SEO/ContentfulSEO';
import { WebsitesHero } from './WebsitesPage/components/WebsitesHero';
import { WebsitesBenefits } from './WebsitesPage/components/WebsitesBenefits';
import { WebsitesFeatures } from './WebsitesPage/components/WebsitesFeatures';
import { WebsitesExtras } from './WebsitesPage/components/WebsitesExtras';
import { WebsitesShowcase } from './WebsitesPage/components/WebsitesShowcase';
import { WebsitesPortfolio } from './WebsitesPage/components/WebsitesPortfolio';
import { WebsitesCTA } from './WebsitesPage/components/WebsitesCTA';

export function WebsitesPage() {
  return (
    <div className="min-h-screen">
      <ContentfulSEO 
        internalName="Website Development SEO"
        fallback={{
          title: "Website Development | Professionele Websites",
          description: "Laat jouw bedrijf online groeien met een professionele website. Modern design, snelle performance en optimale conversie - wij bouwen websites die resultaat leveren."
        }}
      />
      <WebsitesHero />
      <WebsitesBenefits />
      <WebsitesFeatures />
      <WebsitesExtras />
      <WebsitesShowcase />
      <WebsitesPortfolio />
      <WebsitesCTA />
    </div>
  );
}