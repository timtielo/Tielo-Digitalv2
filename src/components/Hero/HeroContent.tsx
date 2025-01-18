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
        Automatiseer je bedrijf en{' '}
        <span className="text-blue-600">bespaar tijd</span> met slimme oplossingen
      </h1>
      
      <p className="text-xl text-gray-600 mb-8">
        Verbeter bedrijfsprocessen met op maat gemaakte systemen. 
        Verhoog efficiency, verminder kosten en blijf voorop in innovatie. 
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <ConsultButton>
          Vraag een gratis consult aan
        </ConsultButton>
        <ServicesButton>
          Bekijk onze diensten
        </ServicesButton>
      </div>
    </motion.div>
  );
}