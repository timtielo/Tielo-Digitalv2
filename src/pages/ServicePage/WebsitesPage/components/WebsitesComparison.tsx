import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, CheckCircle } from 'lucide-react';

const comparisons = [
  { werkspot: 'Leadkosten per klus', website: 'Geen leadkosten' },
  { werkspot: 'Concurrentie op dezelfde klus', website: 'Klanten komen direct bij jou' },
  { werkspot: 'Geen eigen klantenbestand', website: 'Eigen klantenbestand opbouwen' },
  { werkspot: 'Platform bepaalt je zichtbaarheid', website: 'Professionele eigen uitstraling' },
];

export function WebsitesComparison() {
  return (
    <section className="py-16 sm:py-24 bg-tielo-navy relative overflow-hidden">
      <div className="absolute inset-0 td-striped opacity-30" />
      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-white">
              Waarom beter dan Werkspot?
            </h2>
          </motion.div>

          <div className="space-y-4">
            {comparisons.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="bg-white/5 rounded-td p-4 flex items-center gap-3 border border-white/10">
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <span className="text-white/70 text-sm">{item.werkspot}</span>
                </div>
                <div className="bg-tielo-orange/10 rounded-td p-4 flex items-center gap-3 border border-tielo-orange/20">
                  <CheckCircle className="w-5 h-5 text-tielo-orange flex-shrink-0" />
                  <span className="text-white text-sm font-medium">{item.website}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
