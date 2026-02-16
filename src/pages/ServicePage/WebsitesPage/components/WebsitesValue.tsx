import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Smartphone, MessageCircle, Search, Star, Server } from 'lucide-react';

const features = [
  { icon: Globe, title: 'Complete website', description: 'Professioneel ontwerp op maat voor jouw vak.' },
  { icon: Smartphone, title: 'Mobiel geoptimaliseerd', description: 'Perfect op telefoon, tablet en desktop.' },
  { icon: MessageCircle, title: 'WhatsApp integratie', description: 'Klanten bereiken je met een klik.' },
  { icon: Search, title: 'Google optimalisatie', description: 'Vindbaar in jouw regio op relevante zoekwoorden.' },
  { icon: Star, title: 'Reviews zichtbaar', description: 'Laat zien wat klanten over je zeggen.' },
  { icon: Server, title: 'Hosting + onderhoud', description: 'Snel, veilig en altijd up-to-date.' },
];

export function WebsitesValue() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-3 block">
              Wat krijg je
            </span>
            <h2 className="text-3xl font-bold text-tielo-navy">
              Alles inbegrepen
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="td-card p-5 sm:p-6 shadow-sharp"
              >
                <div className="w-12 h-12 bg-tielo-teal/10 rounded-td flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-tielo-steel" />
                </div>
                <h3 className="text-lg font-semibold text-tielo-navy mb-2">{feature.title}</h3>
                <p className="text-tielo-navy/60 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
