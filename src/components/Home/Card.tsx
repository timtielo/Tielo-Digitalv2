import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

export function Card({ icon: Icon, title, description, index }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="td-card td-tech-corner p-6 sm:p-8 shadow-sharp relative overflow-hidden active:scale-[0.98] touch-manipulation"
    >
      <div className="absolute inset-0 td-micro-grid opacity-20 pointer-events-none" />
      <div className="relative">
        <div className="w-12 h-12 bg-tielo-teal/10 rounded-td flex items-center justify-center mb-5">
          <Icon className="w-6 h-6 text-tielo-steel" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-tielo-navy mb-3">{title}</h3>
        <p className="text-tielo-navy/60 leading-relaxed text-sm sm:text-base">{description}</p>
      </div>
    </motion.div>
  );
}
