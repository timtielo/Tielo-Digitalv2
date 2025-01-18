import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardCheck, MessageSquare, Settings, Zap } from 'lucide-react';

const steps = [
  {
    icon: MessageSquare,
    title: 'Vrijblijvend gesprek',
    description: 'We bespreken jouw uitdagingen en doelen tijdens een eerste kennismaking.'
  },
  {
    icon: ClipboardCheck,
    title: 'Plan van aanpak',
    description: 'We stellen een gedetailleerd plan op met concrete doelstellingen en tijdlijnen.'
  },
  {
    icon: Settings,
    title: 'Implementatie',
    description: 'We implementeren de oplossing en zorgen voor een soepele integratie.'
  },
  {
    icon: Zap,
    title: 'Optimalisatie',
    description: 'Continue monitoring en verbetering voor optimale resultaten.'
  }
];

export function ServicesProcess() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 font-rubik">
              Hoe wij werken
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Een transparant proces voor het beste resultaat
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}