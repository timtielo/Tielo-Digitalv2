import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

export function AgitateSection() {
  return (
    <section className="py-12 sm:py-16 bg-tielo-navy relative overflow-hidden">
      <div className="absolute inset-0 td-striped opacity-30" />
      <div className="container mx-auto px-4 sm:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 bg-tielo-orange/20 rounded-td mb-6">
            <TrendingUp className="w-7 h-7 text-tielo-orange" />
          </div>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed">
            Hierdoor blijf je afhankelijk van Werkspot. En blijf je voor altijd leadvergoedingen betalen, ook als die weer omhoog gaan.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
