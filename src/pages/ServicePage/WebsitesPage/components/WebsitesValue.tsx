import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Paintbrush, BarChart, Smartphone, Lock, Search } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Snel online',
    description: 'Binnen enkele dagen heb je een werkende eerste versie'
  },
  {
    icon: Paintbrush,
    title: 'Modern design',
    description: 'Strak, professioneel en helemaal afgestemd op jouw merk'
  },
  {
    icon: BarChart,
    title: 'Gericht op resultaat',
    description: 'Elke pagina is gebouwd om te converteren'
  },
  {
    icon: Smartphone,
    title: 'Werkt overal',
    description: 'Perfect op desktop, tablet en mobiel'
  },
  {
    icon: Search,
    title: 'SEO-ready',
    description: 'Klaar voor Google vanaf dag één'
  },
  {
    icon: Lock,
    title: 'Alles geregeld',
    description: 'Van hosting tot beveiliging — wij handelen het af'
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
              Websites die werken voor jouw bedrijf
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We bouwen geen standaard templates. Elke website wordt op maat gemaakt:
              snel, modern, en gericht op het behalen van jouw doelen. Van design tot
              technische setup — wij regelen alles.
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
