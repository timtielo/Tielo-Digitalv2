import React from 'react';
import { Clock, Building2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

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
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-green-light/10 rounded-lg flex items-center justify-center mb-6">
                <option.icon className="w-8 h-8 text-green-dark" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{option.title}</h3>
              <p className="text-gray-600 leading-relaxed">{option.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}