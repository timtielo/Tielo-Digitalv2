import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface BenefitCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

export function BenefitCard({ icon: Icon, title, description, index }: BenefitCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="td-card p-5 sm:p-6 shadow-sharp active:scale-[0.98] touch-manipulation"
    >
      <div className="w-12 h-12 bg-tielo-teal/10 rounded-td flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-tielo-steel" />
      </div>
      <h3 className="text-lg sm:text-xl font-semibold text-tielo-navy mb-2">{title}</h3>
      <p className="text-tielo-navy/60 text-sm sm:text-base leading-relaxed">{description}</p>
    </motion.div>
  );
}
