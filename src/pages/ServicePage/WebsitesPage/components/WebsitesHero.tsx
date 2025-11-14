import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from '../../../../components/Link';

export function WebsitesHero() {
  const scrollToForm = () => {
    document.getElementById('website-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="pt-32 pb-20 bg-gradient-to-br from-slate-50 via-white to-orange-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">Gratis website-opzetje — geen risico</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 font-rubik leading-tight">
              Laat mij jouw website regelen zodat jij jouw werk kan blijven doen
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-4 leading-relaxed">
              Je krijgt eerst een gratis opzetje. Daarna regel ik alles technisch voor je.
            </p>

            <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto">
              Volledig ontzorgd. Je wordt niet lastiggevallen met ontwerpkeuzes of technische vragen. Jij werkt, ik bouw.
            </p>

            <motion.button
              onClick={scrollToForm}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white rounded-lg
                       font-semibold text-lg hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Vraag jouw gratis opzetje aan
              <ArrowRight className="ml-2 w-6 h-6" />
            </motion.button>

            <p className="text-sm text-gray-500 mt-4">
              ✓ Volledig hands-off voor jou  ✓ Geen verplichtingen  ✓ Eerst zien, dan beslissen
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
