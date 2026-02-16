import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export function DependencyQuote() {
  return (
    <section className="py-12 sm:py-16 bg-red-50/60">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-5" />
          <blockquote className="text-xl sm:text-2xl md:text-[1.7rem] font-semibold leading-snug text-tielo-navy">
            Hierdoor blijf je afhankelijk van Werkspot. En blijf je voor altijd leadvergoedingen betalen, ook als die w&eacute;&eacute;r omhoog gaan.
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
}
