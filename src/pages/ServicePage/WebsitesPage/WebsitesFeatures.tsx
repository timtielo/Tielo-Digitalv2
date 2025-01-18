import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Search, Layout, Code } from 'lucide-react';

const features = [
  {
    icon: Layout,
    title: 'Modern Design',
    description: 'Professionele en aantrekkelijke designs die jouw merk versterken'
  },
  {
    icon: Zap,
    title: 'Snelle Performance',
    description: 'Geoptimaliseerde websites die snel laden op alle apparaten'
  },
  {
    icon: Search,
    title: 'SEO-Optimalisatie',
    description: 'Betere vindbaarheid in zoekmachines voor meer online zichtbaarheid'
  },
  {
    icon: Code,
    title: 'Custom Functionaliteit',
    description: 'Maatwerk features specifiek voor jouw bedrijf'
  }
];

export function WebsitesFeatures() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}