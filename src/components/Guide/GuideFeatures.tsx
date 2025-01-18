import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock, Target } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Stap-voor-stap Guide',
    description: 'Duidelijke instructies om direct aan de slag te gaan met automatisering'
  },
  {
    icon: Clock,
    title: 'Tijdbesparend',
    description: 'Leer hoe je uren per week kunt besparen met slimme automatisering'
  },
  {
    icon: Target,
    title: 'Direct Toepasbaar',
    description: 'Praktische voorbeelden die je meteen kunt implementeren'
  }
];

export function GuideFeatures() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-8 shadow-sm"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}