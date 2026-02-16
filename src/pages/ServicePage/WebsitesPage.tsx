import React from 'react';
import { SEO } from '../../components/SEO';
import { WebsitesHero } from './WebsitesPage/components/WebsitesHero';
import { WebsitesValue } from './WebsitesPage/components/WebsitesValue';
import { WebsitesPricing } from './WebsitesPage/components/WebsitesPricing';
import { WebsitesComparison } from './WebsitesPage/components/WebsitesComparison';
import { WebsitesFAQ } from './WebsitesPage/components/WebsitesFAQ';
import { WebsitesPortfolio } from './WebsitesPage/components/WebsitesPortfolio';
import { WebsitesShowcase } from './WebsitesPage/components/WebsitesShowcase';
import { Link } from '../../components/Link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

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
      <WebsitesPricing />
      <WebsitesComparison />
      <WebsitesFAQ />
      <WebsitesShowcase />
      <WebsitesPortfolio />

      <section className="py-16 sm:py-24 bg-tielo-cream relative overflow-hidden">
        <div className="absolute inset-0 td-striped opacity-40" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-tielo-navy tracking-tight">
              Plan een kort gesprek
            </h2>
            <p className="text-lg mb-8 text-tielo-navy/60">
              Vertel me over je bedrijf en ik laat zien wat ik voor je kan bouwen
            </p>
            <Link
              href="/contact"
              className="bg-tielo-orange hover:bg-[#d85515] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-td font-medium text-base sm:text-lg shadow-sm hover:shadow-sharp transition-all duration-200 active:scale-[0.98] min-h-[48px] touch-manipulation inline-flex items-center gap-2"
            >
              Neem contact op
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
