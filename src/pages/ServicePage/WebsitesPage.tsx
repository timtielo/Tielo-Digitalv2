import React from 'react';
import { SEO } from '../../components/SEO';
import { WebsitesHero } from './WebsitesPage/components/WebsitesHero';
import { WebsitesValue } from './WebsitesPage/components/WebsitesValue';
import { WebsitesPricing } from './WebsitesPage/components/WebsitesPricing';
import { WebsitesComparison } from './WebsitesPage/components/WebsitesComparison';
import { WebsitesFAQ } from './WebsitesPage/components/WebsitesFAQ';
import { WebsitesPortfolio } from './WebsitesPage/components/WebsitesPortfolio';
import { WebsiteShowcase } from '../../components/Websites/WebsiteShowcase';
import { WebsitesCTA } from './WebsitesPage/components/WebsitesCTA';

export function WebsitesPage() {
  return (
    <div className="min-h-screen">
      <SEO
        title="Website laten maken als vakman | Tielo Digital"
        description="Complete website voor vakmensen. Professioneel ontwerp, Google vindbaar, WhatsApp integratie, reviews en hosting. Eenmalig €975, jaarlijks €165."
        keywords={[
          'Website vakman',
          'Website loodgieter',
          'Website aannemer',
          'Website elektricien',
          'Website schilder',
          'Website metselaar',
          'Website klusbedrijf'
        ]}
        canonical="https://www.tielo-digital.nl/diensten/websites"
      />
      <WebsitesHero />
      <WebsitesValue />

      <WebsitesCTA
        variant="minimal"
        title="Interesse?"
        description="Laten we kennismaken en bespreken wat een professionele website voor jouw bedrijf kan betekenen"
      />

      <WebsitesPricing />
      <WebsitesComparison />

      <WebsitesCTA
        variant="secondary"
        title="Wil je meer weten over de prijzen?"
        description="Plan een kort gesprek en ik leg je precies uit wat je krijgt en waarom dit de beste investering is"
      />

      <WebsitesFAQ />
      <WebsiteShowcase />
      <WebsitesPortfolio />

      <WebsitesCTA variant="primary" />
    </div>
  );
}
