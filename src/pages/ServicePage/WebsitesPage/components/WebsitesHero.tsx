import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from '../../../../components/Link';

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
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href="/contact"
                className="bg-tielo-orange hover:bg-[#d85515] text-white px-6 py-3 rounded-td font-medium shadow-sm hover:shadow-sharp transition-all duration-200 active:scale-[0.98] min-h-[48px] touch-manipulation inline-flex items-center gap-2 justify-center"
              >
                Plan een gesprek
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
