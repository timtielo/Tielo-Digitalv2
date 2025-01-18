import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

export function ContactHero() {
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
              <MessageSquare className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-rubik">
              Neem Contact Op
            </h1>
            <p className="text-xl text-gray-600">
              Heb je vragen over onze diensten of wil je weten wat wij voor je kunnen betekenen?
              <br />
              Of wil je een gratis analyse?
              <br />
              Neem dan gerust contact met ons op.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}