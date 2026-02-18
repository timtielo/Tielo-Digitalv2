import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function PricingCard() {
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
            <p className="text-tielo-navy/40 text-xs mt-4">*voor een standaard website voor een vakman. Neem contact op voor maatwerk.</p>

            <a
              href="/cases"
              className="mt-8 flex items-center justify-center gap-3 bg-tielo-offwhite border border-tielo-navy/10 rounded-td px-6 py-4 group hover:border-tielo-orange/40 hover:bg-tielo-orange/5 transition-all"
            >
              <div className="text-left flex-1">
                <p className="text-xs uppercase font-bold tracking-widest text-tielo-orange mb-0.5">Case</p>
                <p className="text-tielo-navy font-semibold text-sm leading-snug">
                  Metselaar Job had zijn website in een maand terugverdiend
                </p>
              </div>
              <span className="flex items-center gap-1 text-tielo-orange font-medium text-sm whitespace-nowrap group-hover:gap-2 transition-all">
                Lees meer <ArrowRight className="w-4 h-4" />
              </span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
