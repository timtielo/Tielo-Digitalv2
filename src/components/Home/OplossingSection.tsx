import React from 'react';
import { Palette, Smartphone, MessageCircle, Search, Star, Server } from 'lucide-react';
import { motion } from 'framer-motion';
import { BenefitCard } from './BenefitCard';
import { WhatsAppButton } from '../common/WhatsAppButton';

const features = [
  { icon: Palette, title: 'Professioneel ontwerp', description: 'Een website die er strak uitziet en vertrouwen wekt bij klanten.' },
  { icon: Search, title: 'Google vindbaar', description: 'Lokale SEO zodat klanten jou vinden in jouw regio.' },
  { icon: MessageCircle, title: 'WhatsApp knop', description: 'Klanten bereiken je direct met een klik.' },
  { icon: Star, title: 'Reviews geintegreerd', description: 'Laat zien wat andere klanten over je zeggen.' },
  { icon: Server, title: 'Alles geregeld', description: 'Domein, mail, hosting. Jij hoeft niets te doen.' },
  { icon: Smartphone, title: 'Mobiel geoptimaliseerd', description: 'Perfect zichtbaar op telefoon, tablet en desktop.' },
];

export function OplossingSection() {
  return (
    <section className="py-16 sm:py-24 bg-tielo-offwhite relative">
      <div className="absolute inset-0 td-micro-grid opacity-30" />
      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="text-center mb-12 sm:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-3 block"
          >
            De oplossing
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-tielo-navy mb-4"
          >
            Ik bouw binnen 2 weken een complete website
          </motion.h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <BenefitCard key={index} {...feature} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <WhatsAppButton />
        </motion.div>
      </div>
    </section>
  );
}
