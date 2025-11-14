import React from 'react';
import { Clock, Building2, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from './Card';
import { Link } from '../Link';

const options = [
  {
    icon: Clock,
    title: 'Te weinig tijd voor alles',
    description: 'Je wilt een website of automatisering, maar je hebt geen tijd om het zelf uit te zoeken.',
  },
  {
    icon: Building2,
    title: 'Geen professionele online aanwezigheid',
    description: 'Je wilt serieus overkomen, maar zonder website of moderne bedrijfsvoering loop je kansen mis.',
  },
  {
    icon: AlertCircle,
    title: 'Handmatige taken kosten te veel tijd',
    description: 'Repetitieve taken zoals offertes maken, facturen versturen of klantcontact kosten onnodige uren.',
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
          Herken je dit?
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