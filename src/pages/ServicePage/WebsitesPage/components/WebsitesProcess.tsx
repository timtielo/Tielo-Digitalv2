import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Hammer, Eye, Rocket } from 'lucide-react';

const steps = [
  {
    number: '1',
    icon: MessageSquare,
    title: 'Jij vraagt je gratis versie aan',
    description: 'Vul het formulier in met wat info over je bedrijf en wensen. Simpel en snel.'
  },
  {
    number: '2',
    icon: Hammer,
    title: 'Wij bouwen een eerste versie',
    description: 'Binnen enkele dagen bouwen we een preview om te laten zien wat mogelijk is. Zonder betaling vooraf, zonder gedoe.'
  },
  {
    number: '3',
    icon: Eye,
    title: 'Jij bekijkt de preview',
    description: 'Je ontvangt een preview-link. Bekijk het design en de opzet rustig en beoordeel of het bij je past.'
  },
  {
    number: '4',
    icon: Rocket,
    title: 'Tevreden? Dan maken we het af',
    description: 'We plannen een call om jouw wensen door te nemen. Daarna maken we alles werkend en lanceren we de site.'
  }
];

export function WebsitesProcess() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 font-rubik">
              Zo werkt het, stap voor stap
            </h2>
            <p className="text-xl text-gray-600">
              Van aanvraag tot lancering in vier simpele stappen
            </p>
          </motion.div>

          <div className="space-y-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="flex gap-6 items-start">
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {step.number}
                      </div>
                      {index < steps.length - 1 && (
                        <div className="absolute top-16 left-8 w-0.5 h-16 bg-gradient-to-b from-primary/50 to-transparent" />
                      )}
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-gray-600 text-lg">{step.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
