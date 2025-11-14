import React from 'react';
import { motion } from 'framer-motion';
import { Gift, FileText, Globe, MapPin, MessageCircle, Server } from 'lucide-react';

const features = [
  {
    icon: Gift,
    title: 'Gratis website-opzetje',
    description: 'Ik maak een eerste ontwerp zodat je precies ziet hoe jouw website eruit kan zien.'
  },
  {
    icon: FileText,
    title: 'Jij hoeft geen teksten te schrijven',
    description: 'Ik schrijf alle teksten voor je. Jij hoeft alleen te controleren of het klopt.'
  },
  {
    icon: Globe,
    title: 'Domein & DNS-regeling',
    description: 'Van domeinregistratie tot DNS, SSL, e-mail en koppelingen: alles wordt ingesteld.'
  },
  {
    icon: MapPin,
    title: 'Google Business Profiel',
    description: 'Ik zorg dat je zichtbaar bent op Google Maps, met juiste categorieën en foto\'s.'
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Direct Lead',
    description: 'Een knop waarmee klanten je met één tik kunnen appen.'
  },
  {
    icon: Server,
    title: 'Hosting & onderhoud',
    description: 'Snel, veilig en doorlopend onderhouden. Geen omkijken naar.'
  }
];

export function WebsitesValue() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 font-rubik">
              Wat is er allemaal bij inbegrepen?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Van het eerste opzetje tot hosting en onderhoud. Ik regel alles technisch zodat jij gewoon kan blijven werken.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
