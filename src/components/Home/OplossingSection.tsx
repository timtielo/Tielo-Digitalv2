import React from 'react';
import { Gift, Zap, Globe, MapPin, MessageCircle, Server } from 'lucide-react';
import { motion } from 'framer-motion';
import { BenefitCard } from './BenefitCard';

const features = [
  {
    icon: Gift,
    title: 'Gratis website-opzetje',
    description: 'Voor websites: eerst zie je precies hoe het eruit komt te zien. Helemaal gratis, geen verplichtingen.'
  },
  {
    icon: Zap,
    title: 'Automatisering van processen',
    description: 'Van offertes tot facturatie. Ik kijk wat handmatig werk je kan besparen en automatiseer het.'
  },
  {
    icon: Globe,
    title: 'Volledige DNS & domeinconfiguratie',
    description: 'Van domeinregistratie tot technische instellingen. Alles wordt voor je geregeld.'
  },
  {
    icon: MapPin,
    title: 'Google Business opzetten',
    description: 'Ik zorg dat je zichtbaar bent op Google Maps met de juiste informatie.'
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp & communicatie-integraties',
    description: 'Klanten kunnen je direct bereiken, en ik kan automatische antwoorden inrichten.'
  },
  {
    icon: Server,
    title: 'Hosting & onderhoud',
    description: 'Snelle, veilige hosting en doorlopend onderhoud zonder omkijken.'
  }
];

export function OplossingSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-4 font-rubik"
          >
            Ik regel het voor je
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Van website tot automatisering. Ik maak een gratis opzetje en regel daarna alle techniek. Jij hoeft niets te doen.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <BenefitCard key={index} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
