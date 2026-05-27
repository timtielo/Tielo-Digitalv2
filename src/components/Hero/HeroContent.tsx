import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { Link } from '../Link';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { trackEvent } from '../../utils/analyticsTracker';

export function HeroContent() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl"
    >
      <div className="inline-flex items-center gap-2 bg-tielo-cream text-tielo-navy px-4 py-2 rounded-td text-sm font-medium mb-6">
        <Zap className="w-4 h-4 text-tielo-orange" />
        Binnen 2 weken live
      </div>

      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-tielo-navy tracking-tight leading-[1.15]">
        Website laten maken{' '}
        <span className="text-tielo-orange">voor vaklui</span>
      </h1>

      <p className="text-base sm:text-lg text-tielo-navy/70 mb-8 leading-relaxed max-w-xl">
        Meer klanten. Professioneel en duidelijk. Vaak binnen een maand terugverdiend.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <WhatsAppButton eventName="cta_primary_hero_click" buttonLocation="Hero">Kom in contact</WhatsAppButton>
        <Link
          href="/diensten/websites"
          className="bg-white border border-gray-300 text-tielo-navy px-6 py-3 rounded-td font-medium
                   hover:border-tielo-navy hover:bg-gray-50 transition-all duration-200
                   active:scale-[0.98] text-base
                   min-h-[48px] touch-manipulation inline-flex items-center justify-center"
          onClick={() => trackEvent('cta_secondary_hero_click', 'Meer informatie', 'Hero')}
        >
          Meer informatie
        </Link>
      </div>
    </motion.div>
  );
}
