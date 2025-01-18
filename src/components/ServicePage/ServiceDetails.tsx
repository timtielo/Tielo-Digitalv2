import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Service } from '../../types/service';
import { ServiceVisual } from './ServiceVisual';

interface ServiceDetailsProps {
  service: Service;
}

export function ServiceDetails({ service }: ServiceDetailsProps) {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl p-8 shadow-sm"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 font-rubik">
                  Wat krijg je?
                </h2>
                <ul className="space-y-4">
                  {service.features.map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4"
                    >
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">{feature}</h3>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
              
              {service.id !== 'websites' && (
                <div className="h-[400px] relative">
                  <ServiceVisual serviceId={service.id} />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}