import React from 'react';
import { motion } from 'framer-motion';
import { WhatsAppButton } from '../common/WhatsAppButton';

export function ServiceCTA() {
  return (
    <section className="py-16 sm:py-20 bg-tielo-cream relative overflow-hidden">
      <div className="absolute inset-0 td-striped opacity-40" />
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-tielo-navy tracking-tight">
            Klaar om te beginnen?
          </h2>
          <p className="text-lg sm:text-xl text-tielo-navy/60 mb-8">
            Stuur een berichtje en ontdek hoe ik je bedrijf kan helpen groeien
          </p>
          <WhatsAppButton className="text-lg sm:px-8 sm:py-4" />
        </motion.div>
      </div>
    </section>
  );
}
