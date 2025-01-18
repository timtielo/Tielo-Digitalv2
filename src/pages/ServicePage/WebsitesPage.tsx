import React from 'react';
import { SEO } from '../../components/SEO';
import { WebsitesHero } from './WebsitesPage/components/WebsitesHero';
import { WebsitesBenefits } from './WebsitesPage/components/WebsitesBenefits';
import { WebsitesFeatures } from './WebsitesPage/components/WebsitesFeatures';
import { WebsitesTechnologies } from './WebsitesPage/components/WebsitesTechnologies';
import { WebsitesExtras } from './WebsitesPage/components/WebsitesExtras';
import { WebsitesShowcase } from './WebsitesPage/components/WebsitesShowcase';
import { WebsitesPortfolio } from './WebsitesPage/components/WebsitesPortfolio';
import { WebsitesCTA } from './WebsitesPage/components/WebsitesCTA';

export function WebsitesPage() {
  return (
    <div className="min-h-screen">
      <SEO 
        title="Website Development | Professionele Websites"
        description="Laat jouw bedrijf online groeien met een professionele website. Modern design, snelle performance en optimale conversie - wij bouwen websites die resultaat leveren."
        keywords={[
          'Website Development',
          'Webdesign',
          'SEO-Optimalisatie',
          'Responsive Design',
          'Maatwerk Websites'
        ]}
        ogType="website"
        canonical="https://tielo-digital.nl/diensten/websites"
      />
      <WebsitesHero />
      <WebsitesBenefits />
      <WebsitesFeatures />
      <WebsitesTechnologies />
      <WebsitesExtras />
      <WebsitesShowcase />
      <WebsitesPortfolio />
      <WebsitesCTA />
    </div>
  );
}