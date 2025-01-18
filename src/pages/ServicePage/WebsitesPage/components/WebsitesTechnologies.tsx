import React from 'react';
import { motion } from 'framer-motion';

const technologies = [
  {
    name: 'React',
    description: 'Voor snelle, interactieve interfaces'
  },
  {
    name: 'Next.js',
    description: 'Voor optimale performance en SEO'
  },
  {
    name: 'Tailwind CSS',
    description: 'Voor modern, responsive design'
  },
  {
    name: 'Contentful',
    description: 'Voor eenvoudig content beheer'
  }
];

export function WebsitesTechnologies() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 font-rubik text-center">
            Moderne Technologieën
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {technologies.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-6 text-center"
              >
                <h3 className="text-xl font-semibold mb-2 text-primary">
                  {tech.name}
                </h3>
                <p className="text-gray-600">{tech.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}