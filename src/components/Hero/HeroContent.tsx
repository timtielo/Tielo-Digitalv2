import React from 'react';
import { motion } from 'framer-motion';
import { ConsultButton } from '../common/ConsultButton';
import { ServicesButton } from '../common/ServicesButton';
import { FADE_IN_LEFT } from '../../utils/animations';

export function HeroContent() {
  return (
    <motion.div
      {...FADE_IN_LEFT}
      className="max-w-2xl"
    >
      <h1 className="text-5xl md:text-6xl font-bold mb-6 font-rubik leading-tight text-gray-900">
        Word zichtbaar voor klanten{' '}
        <span className="text-orange-600">zonder gedoe</span>
      </h1>

      <p className="text-xl text-gray-600 mb-8">
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