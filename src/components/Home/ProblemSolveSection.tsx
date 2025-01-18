import React from 'react';
import { Clock, Building2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from './Card';

const options = [
  {
    icon: Clock,
    title: 'Alles zelf doen?',
    description: 'Als je genoeg tijd hebt, is dit een prima optie. Maar als je het al zo druk hebt, wordt dat lastig.',
  },
  {
    icon: Building2,
    title: 'Een grote agency benaderen?',
    description: 'Vaak wacht je lang op reacties en wordt jouw pakket opgepakt door de assistent van de assistent. Dit is inefficiënt en onpersoonlijk.',
  },
  {
    icon: AlertCircle,
    title: 'Niet doen of het uitstellen?',
    description: 'Hierdoor behaal je nooit jouw potentie. En dat zonde. Waarom wachten als het ook nu kan?',
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
          Hoe behaal jij de beste resultaten?
        </motion.h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {options.map((option, index) => (
            <Card key={index} {...option} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}