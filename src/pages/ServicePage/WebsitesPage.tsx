import React from 'react';
import { SEO } from '../../components/SEO';
import { WebsitesHero } from './WebsitesPage/components/WebsitesHero';
import { WebsitesValue } from './WebsitesPage/components/WebsitesValue';
import { WebsitesPricing } from './WebsitesPage/components/WebsitesPricing';
import { WebsitesComparison } from './WebsitesPage/components/WebsitesComparison';
import { WebsitesFAQ } from './WebsitesPage/components/WebsitesFAQ';
import { WebsitesPortfolio } from './WebsitesPage/components/WebsitesPortfolio';
import { WebsiteShowcase } from '../../components/Websites/WebsiteShowcase';
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
      <WebsiteShowcase />
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
              Klaar om je eigen website te hebben?
            </h2>
            <p className="text-lg mb-8 text-tielo-navy/60">
              Vertel me over je bedrijf en ik laat zien wat ik voor je kan bouwen
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/contact"
                className="bg-tielo-orange hover:bg-[#d85515] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-td font-medium text-base sm:text-lg shadow-sm hover:shadow-sharp transition-all duration-200 active:scale-[0.98] min-h-[48px] touch-manipulation inline-flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                Neem contact op
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="https://wa.me/31620948502?text=Hey%20Tim,%20ik%20wil%20graag%20een%20website"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-tielo-navy text-tielo-navy hover:text-white border-2 border-tielo-navy px-6 sm:px-8 py-3 sm:py-4 rounded-td font-medium text-base sm:text-lg shadow-sm hover:shadow-sharp transition-all duration-200 active:scale-[0.98] min-h-[48px] touch-manipulation inline-flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
