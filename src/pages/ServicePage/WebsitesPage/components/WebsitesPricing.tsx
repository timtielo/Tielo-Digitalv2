import React from 'react';
import { motion } from 'framer-motion';

export function WebsitesPricing() {
  return (
    <section className="py-16 sm:py-24 bg-tielo-offwhite relative">
      <div className="absolute inset-0 td-micro-grid opacity-30" />
      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-3 block">
              Investering
            </span>
            <h2 className="text-3xl font-bold text-tielo-navy">
              Wat kost het?
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="td-card p-8 sm:p-10 shadow-sharp text-center"
          >
            <div className="flex flex-col sm:flex-row justify-center gap-8 sm:gap-16 mb-8">
              <div>
                <span className="text-4xl font-bold text-tielo-navy">&euro;975</span>
                <p className="text-tielo-navy/60 mt-1">eenmalig</p>
              </div>
              <div className="hidden sm:block w-px bg-gray-200" />
              <div>
                <span className="text-4xl font-bold text-tielo-navy">&euro;165</span>
                <p className="text-tielo-navy/60 mt-1">per jaar</p>
              </div>
            </div>
            <p className="text-tielo-navy/60">Geen verborgen kosten.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
