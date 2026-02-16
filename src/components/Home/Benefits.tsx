import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Hammer, Check } from 'lucide-react';

const steps = [
  { number: '1', title: 'Aanbetaling & intake gesprek', icon: CreditCard },
  { number: '2', title: 'Ik bouw, jij geeft feedback', icon: Hammer },
  { number: '3', title: 'Website live & factuur', icon: Check },
];

export function Benefits() {
  return (
    <section className="py-16 sm:py-24 bg-tielo-navy relative overflow-hidden">
      <div className="absolute inset-0 td-striped opacity-30" />
      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-[10px] uppercase font-bold tracking-widest text-tielo-orange mb-3 block">
            Stappenplan
          </span>
          <h2 className="text-3xl font-bold text-white mb-4">
            Hoe werkt het?
          </h2>
        </div>

        <div className="max-w-2xl mx-auto space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-td p-4 border border-white/10"
            >
              <div className="w-10 h-10 bg-tielo-orange rounded-td flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">{step.number}</span>
              </div>
              <span className="text-white/90 font-medium">{step.title}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
