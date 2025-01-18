import React from 'react';
import { motion } from 'framer-motion';
import { OplossingCard } from './OplossingCard';

const oplossingen = [
  {
    title: 'Automatische Email Verwerking',
    description: 'Van handmatig emails beantwoorden naar een geautomatiseerd systeem',
    problem: 'Dagelijks uren kwijt aan het beantwoorden van standaard emails',
    solution: 'AI-gestuurde email verwerking met persoonlijke touch',
    image: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=800&h=400'
  },
  {
    title: 'Factuur Automatisering',
    description: 'Van handmatige boekingen naar volledig geautomatiseerde verwerking',
    problem: 'Tijdrovend proces van handmatig facturen verwerken',
    solution: 'Geautomatiseerde factuurverwerking met accuraatheidscontrole',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&h=400'
  }
];

export function OplossingenList() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {oplossingen.map((oplossing, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <OplossingCard {...oplossing} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}