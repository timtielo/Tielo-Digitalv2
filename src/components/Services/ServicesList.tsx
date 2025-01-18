import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ServiceCard } from '../ServiceCard';
import { services } from '../Services';

export function ServicesList() {
  useEffect(() => {
    // Scroll to service section if hash is present
    const hash = window.location.hash;
    if (hash) {
      const element = document.getElementById(hash.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              id={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ServiceCard {...service} showMoreInfo />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}