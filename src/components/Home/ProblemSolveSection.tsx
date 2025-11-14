import React from 'react';
import { Clock, Building2, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from './Card';
import { Link } from '../Link';

const options = [
  {
    icon: Clock,
    title: 'Klanten zoeken je online maar vinden niets',
    description: 'Zonder website ben je onzichtbaar voor potentiële klanten die naar jouw diensten zoeken.',
  },
  {
    icon: Building2,
    title: 'Geen professionele uitstraling',
    description: 'Je wilt serieus overkomen, maar zonder online aanwezigheid loop je opdrachten mis.',
  },
  {
    icon: AlertCircle,
    title: 'Afhankelijk van dure leads',
    description: 'Je betaalt veel voor onzekere Werkspot-leads, terwijl je eigen website stabielere resultaten oplevert.',
  },
];

export function ProblemSolveSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 font-rubik"
        >
          Veel bouwbedrijven lopen werk mis zonder website
        </motion.h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {options.map((option, index) => (
            <Card key={index} {...option} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-lg
                     font-semibold text-lg hover:bg-primary/90 transition-all duration-300
                     hover:scale-[1.02] active:scale-[0.98]"
          >
            Vraag een gratis opzetje aan
            <ArrowRight className="w-6 h-6" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}