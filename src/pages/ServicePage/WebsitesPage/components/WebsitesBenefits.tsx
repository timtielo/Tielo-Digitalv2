import React from 'react';
import { motion } from 'framer-motion';
import { Check, Globe } from 'lucide-react';

const benefits = [
  'Modern en professioneel design',
  'Volledig responsive op alle apparaten',
  'SEO-geoptimaliseerd voor betere vindbaarheid',
  'Snelle laadtijden voor betere conversie',
  'Ingebouwde koppelingen en integraties',
  'Content Management Systeem'
];

export function WebsitesBenefits() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-8 font-rubik">Wat krijg je?</h2>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="relative"
                >
                  <div className="w-32 h-32 bg-primary rounded-2xl flex items-center justify-center">
                    <Globe className="w-16 h-16 text-white" />
                  </div>
                  
                  <div className="absolute inset-0 -m-8">
                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-[spin_20s_linear_infinite]" />
                    <div className="absolute inset-0 -m-4 border-4 border-primary/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}