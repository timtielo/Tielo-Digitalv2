import React from 'react';
import { motion } from 'framer-motion';
import { ConsultButton } from './common/ConsultButton';

export function CTASection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold mb-6 font-rubik text-gray-900">
            Klaar om je bedrijf te transformeren?
          </h2>
          <p className="text-xl mb-8 text-gray-600">
            Plan een gratis consultgesprek en ontdek hoe AI je bedrijf kan laten groeien
          </p>
          <ConsultButton>
            Plan je gratis analyse
          </ConsultButton>
        </motion.div>
      </div>
    </section>
  );
}