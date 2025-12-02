import React from 'react';
import { motion } from 'framer-motion';
import { ConsultButton } from './common/ConsultButton';

export function CTASection() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 font-rubik text-gray-900">
            Wil je zien hoe jouw website eruit kan zien?
          </h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-gray-700">
            Vraag een gratis opzetje aan en ontdek hoe je zichtbaar wordt voor klanten
          </p>
          <ConsultButton>
            Vraag een gratis opzetje aan
          </ConsultButton>
        </motion.div>
      </div>
    </section>
  );
}