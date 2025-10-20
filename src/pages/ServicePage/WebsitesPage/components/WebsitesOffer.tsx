import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Eye, ThumbsUp, ArrowRight } from 'lucide-react';

const offerPoints = [
  {
    icon: Gift,
    title: 'Gratis eerste versie',
    description: 'Geen betaling, geen verplichtingen. We bouwen een werkende versie om te laten zien wat mogelijk is.'
  },
  {
    icon: Eye,
    title: 'Preview binnen enkele dagen',
    description: 'Snel resultaat. Je ziet binnen korte tijd hoe jouw website eruit komt te zien.'
  },
  {
    icon: ThumbsUp,
    title: 'Alleen doorgaan als je tevreden bent',
    description: 'Bevalt het niet? Geen probleem. Je betaalt alleen als je 100% tevreden bent met het resultaat.'
  }
];

export function WebsitesOffer() {
  const scrollToForm = () => {
    document.getElementById('website-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 font-rubik">
              Hoe werkt het?
            </h2>
            <p className="text-xl text-gray-600">
              Simpel: wij bouwen, jij beoordeelt, dan beslissen we samen
            </p>
          </motion.div>

          <div className="space-y-6 mb-12">
            {offerPoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{point.title}</h3>
                      <p className="text-gray-600">{point.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <button
              onClick={scrollToForm}
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white rounded-lg
                       font-semibold text-lg hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl
                       hover:scale-[1.02] active:scale-[0.98]"
            >
              Gratis eerste versie aanvragen
              <ArrowRight className="ml-2 w-6 h-6" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
