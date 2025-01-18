import React from 'react';
import { motion } from 'framer-motion';
import { ConsultButton } from '../common/ConsultButton';

export function ServiceCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold mb-6 font-rubik">
            Klaar om te beginnen?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Plan een vrijblijvend gesprek en ontdek hoe wij je bedrijf kunnen helpen groeien
          </p>
          <ConsultButton>
            Plan je gratis analyse
          </ConsultButton>
        </motion.div>
      </div>
    </section>
  );
}