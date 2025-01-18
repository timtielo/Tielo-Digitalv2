import React from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

export function GuideHero() {
  return (
    <section className="pt-32 pb-20 bg-gradient-to-br from-[#fff5f0] to-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <FileText className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 font-rubik">
              Gratis Guide
            </h1>
            <div className="text-4xl md:text-5xl font-bold mb-8 font-rubik">
              <span className="text-primary">Meer Tijd</span>{' '}
              <span>Met Automatie en AI</span>
            </div>
            <p className="text-xl text-gray-600 mb-4">
              <span className="font-semibold">Make</span> en{' '}
              <span className="font-semibold">Zapier</span> zijn twee bekende tools 
              waarmee jij jouw automatie-reis kan gaan beginnen.
            </p>
            <p className="text-xl text-gray-600">
              In deze gratis guide vertellen we hoe jij dat precies doet. 
              Geen jargon, geen technische onzin, gewoon een simpel-en-makkelijk-te-volgen overzicht.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}