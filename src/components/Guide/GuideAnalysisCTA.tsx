import React from 'react';
import { motion } from 'framer-motion';
import { ConsultButton } from '../common/ConsultButton';

export function GuideAnalysisCTA() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold mb-4 font-rubik">
            Ben je benieuwd wat we voor jouw bedrijf kunnen betekenen?
          </h2>
          <div className="mb-8">
            <ConsultButton className="text-lg">
              Vraag een gratis AI & Automation analyse aan
            </ConsultButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}