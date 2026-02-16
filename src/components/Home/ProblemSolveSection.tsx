import React from 'react';
import { AlertCircle, DollarSign, Eye, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const problems = [
  {
    icon: AlertCircle,
    title: 'Te afhankelijk van Werkspot',
    description: 'Elke klus begint met betalen voor leads die je moet delen met andere bedrijven.',
  },
  {
    icon: DollarSign,
    title: 'Concurreren op prijs',
    description: 'Op platforms win je alleen als je de goedkoopste bent. Dat is geen duurzaam model.',
  },
  {
    icon: Eye,
    title: 'Geen professionele uitstraling',
    description: 'Zonder eigen website mis je de geloofwaardigheid die klanten verwachten.',
  },
  {
    icon: Shield,
    title: 'Geen eigen online controle',
    description: 'Je hebt geen eigen plek waar klanten je direct kunnen vinden en bereiken.',
  },
];

export function ProblemSolveSection() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-3 block">
            Het probleem
          </span>
          <h2 className="text-3xl font-bold text-tielo-navy">
            Herkenbaar?
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="td-card p-5 sm:p-6 shadow-sharp"
            >
              <div className="w-12 h-12 bg-red-50 rounded-td flex items-center justify-center mb-4">
                <problem.icon className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-tielo-navy mb-2">{problem.title}</h3>
              <p className="text-tielo-navy/60 text-sm sm:text-base leading-relaxed">{problem.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
