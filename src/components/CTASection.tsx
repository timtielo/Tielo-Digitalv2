import React from 'react';
import { motion } from 'framer-motion';
import { WhatsAppButton } from './common/WhatsAppButton';

export function CTASection() {
  return (
    <section className="py-16 sm:py-24 bg-tielo-cream relative overflow-hidden">
      <div className="absolute inset-0 td-striped opacity-40" />
      <div className="container mx-auto px-4 sm:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-tielo-navy tracking-tight">
            Klaar om onafhankelijk te worden van Werkspot?
          </h2>
          <p className="text-lg sm:text-xl mb-8 text-tielo-navy/60">
            Stuur een berichtje en ik laat zien wat ik voor je kan bouwen
          </p>
          <WhatsAppButton className="text-lg sm:px-8 sm:py-4" />
        </motion.div>
      </div>
    </section>
  );
}
