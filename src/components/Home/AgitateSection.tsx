import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

export function AgitateSection() {
  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
            <TrendingUp className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 leading-relaxed">
            Hierdoor blijf je afhankelijk van Werkspot. En blijf je voor altijd leadvergoedingen betalen, ook als die wéér omhoog gaan.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
