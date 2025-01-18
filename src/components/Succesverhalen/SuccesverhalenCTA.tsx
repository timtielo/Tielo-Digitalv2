import React from 'react';
import { motion } from 'framer-motion';
import { ConsultButton } from '../common/ConsultButton';

export function SuccesverhalenCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold mb-6 font-rubik">
            En jij bent de volgende!
          </h2>
          <ConsultButton>
            Klik hier om contact op te nemen
          </ConsultButton>
        </motion.div>
      </div>
    </section>
  );
}