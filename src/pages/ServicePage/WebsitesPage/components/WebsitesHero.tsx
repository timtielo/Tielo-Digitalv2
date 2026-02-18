import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Wrench, Zap, PaintBucket, HardHat, Hammer, Layers } from 'lucide-react';
import { Link } from '../../../../components/Link';

const trades = [
  { label: 'Loodgieter', href: '/diensten/websites/loodgieter', icon: Wrench },
  { label: 'Elektricien', href: '/diensten/websites/elektricien', icon: Zap },
  { label: 'Schilder', href: '/diensten/websites/schilder', icon: PaintBucket },
  { label: 'Aannemer', href: '/diensten/websites/aannemer', icon: HardHat },
  { label: 'Metselaar', href: '/diensten/websites/metselaar', icon: Layers },
  { label: 'Klusbedrijf', href: '/diensten/websites/klusbedrijf', icon: Hammer },
];

export function WebsitesHero() {
  return (
    <section className="pt-28 sm:pt-32 pb-16 sm:pb-20 bg-tielo-offwhite relative overflow-hidden">
      <div className="absolute inset-0 td-micro-grid opacity-40" />
      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-3 block">
              Websites
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-tielo-navy tracking-tight leading-[1.15]">
              Website laten maken{' '}
              <span className="text-tielo-orange">als vakman?</span>
            </h1>
            <p className="text-lg text-tielo-navy/70 mb-8 leading-relaxed max-w-2xl">
              Ik bouw complete websites voor vakmensen. Professioneel ontwerp, Google vindbaar, WhatsApp integratie en alles geregeld. Binnen 2 weken live.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10">
              <Link
                href="/contact"
                className="bg-tielo-orange hover:bg-[#d85515] text-white px-6 py-3 rounded-td font-medium shadow-sm hover:shadow-sharp transition-all duration-200 active:scale-[0.98] min-h-[48px] touch-manipulation inline-flex items-center gap-2 justify-center"
              >
                Plan een gesprek
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-3">
                Kies jouw vak
              </p>
              <div className="flex flex-wrap gap-2">
                {trades.map((trade) => (
                  <Link
                    key={trade.href}
                    href={trade.href}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-td text-sm font-medium text-tielo-navy hover:border-tielo-orange hover:text-tielo-orange transition-all duration-150 shadow-sm"
                  >
                    <trade.icon className="w-3.5 h-3.5" />
                    {trade.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
