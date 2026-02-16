import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from './Link';

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
            Plan een kort gesprek en ik laat zien wat ik voor je kan bouwen
          </p>
          <Link
            href="/contact"
            className="bg-tielo-orange hover:bg-[#d85515] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-td font-medium text-base sm:text-lg shadow-sm hover:shadow-sharp transition-all duration-200 active:scale-[0.98] min-h-[48px] touch-manipulation inline-flex items-center gap-2"
          >
            Start hier
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
