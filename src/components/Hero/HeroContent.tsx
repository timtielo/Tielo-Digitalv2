import React from 'react';
import { motion } from 'framer-motion';
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
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 font-rubik leading-tight text-gray-900">
        Word zichtbaar voor klanten{' '}
        <span className="text-blue-600">zonder gedoe</span>
      </h1>

      <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 md:mb-8">
        Geen gedoe met Werkspot of DNS settings. Ik maak een gratis website-opzetje voor jouw bouwbedrijf en regel alle techniek, jij hoeft alleen je werk te doen.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
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