import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

export function ServicesHero() {
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
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-rubik">
              AI & Automatisering Oplossingen
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Ontdek hoe onze diensten jouw bedrijf kunnen transformeren met slimme AI-oplossingen en efficiënte automatisering
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}