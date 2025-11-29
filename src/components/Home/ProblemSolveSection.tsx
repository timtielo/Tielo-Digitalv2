import React from 'react';
import { Search, Phone, AlertCircle, MapPin, MessageCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from './Card';
import { Link } from '../Link';

const options = [
  {
    icon: Search,
    title: 'Klanten zoeken je online maar vinden niets',
    description: 'Zonder website ben je onzichtbaar voor potentiële klanten.',
  },
  {
    icon: Phone,
    title: 'Geen contactgegevens online',
    description: 'Klanten kunnen je niet makkelijk vinden of bereiken.',
  },
  {
    icon: AlertCircle,
    title: 'Afhankelijk van dure en onzekere Werkspot-leads',
    description: 'Je betaalt veel voor leads die niet altijd betrouwbaar zijn.',
  },
  {
    icon: MessageCircle,
    title: 'Geen makkelijke manier voor klanten om je te bereiken',
    description: 'Zonder WhatsApp of contactformulier loop je kansen mis.',
  },
  {
    icon: MapPin,
    title: 'Geen Google Business vermelding',
    description: 'Je bent niet zichtbaar op Google Maps waar klanten zoeken.',
  },
];

export function ProblemSolveSection() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 font-rubik"
        >
          Veel bouwbedrijven lopen werk mis zonder website
        </motion.h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {options.map((option, index) => (
            <Card key={index} {...option} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 sm:mt-12 text-center"
        >
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-primary text-white rounded-lg
                     font-semibold text-base sm:text-lg hover:bg-primary/90 transition-all duration-300
                     hover:scale-[1.02] active:scale-[0.98] min-h-[48px] touch-manipulation"
          >
            Vraag een gratis opzetje aan
            <ArrowRight className="w-6 h-6" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}