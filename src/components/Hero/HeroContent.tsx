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
      <h1 className="text-5xl md:text-6xl font-bold mb-6 font-rubik leading-tight">
        Van idee naar online{' '}
        <span className="text-blue-600">in no-time</span>
      </h1>

      <p className="text-xl text-gray-600 mb-8">
        Website nodig? Ik maak een gratis opzetje. Bevalt het? Dan regel ik de rest. Voor startende bouwbedrijven én voor automatisering van bedrijfsprocessen.
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