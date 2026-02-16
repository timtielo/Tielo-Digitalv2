import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { ConsultButton } from '../common/ConsultButton';
import { ServicesButton } from '../common/ServicesButton';

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
        Terugverdiend in een maand
      </div>

      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-tielo-navy tracking-tight leading-[1.15]">
        Word zichtbaar voor klanten{' '}
        <span className="text-tielo-orange">zonder gedoe</span>
      </h1>

      <p className="text-base sm:text-lg text-tielo-navy/70 mb-8 leading-relaxed max-w-xl">
        Geen gedoe met Werkspot of DNS settings. Ik maak een gratis website-opzetje voor jouw bouwbedrijf en regel alle techniek, jij hoeft alleen je werk te doen.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <ConsultButton>
          Gratis opzetje aanvragen
        </ConsultButton>
        <ServicesButton>
          Voorbeelden bekijken
        </ServicesButton>
      </div>
    </motion.div>
  );
}
