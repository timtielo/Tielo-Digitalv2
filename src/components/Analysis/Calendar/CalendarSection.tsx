import React from 'react';
import { motion } from 'framer-motion';
import { CalendarFrame } from './CalendarFrame';

export function CalendarSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <CalendarFrame />
        </motion.div>
      </div>
    </section>
  );
}