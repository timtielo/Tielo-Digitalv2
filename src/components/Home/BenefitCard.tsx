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
      className="p-5 sm:p-6 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 active:scale-[0.98] touch-manipulation"
    >
      <div className="w-16 h-16 bg-green-light/10 rounded-lg flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-green-dark" />
      </div>
      <h3 className="text-lg sm:text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{description}</p>
    </motion.div>
  );
}