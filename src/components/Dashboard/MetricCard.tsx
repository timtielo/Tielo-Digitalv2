import React, { useEffect, useState } from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface MetricCardProps {
  icon: LucideIcon;
  value: string;
  title: string;
  subtitle: string;
  delay?: number;
}

export function MetricCard({ icon: Icon, value, title, subtitle, delay = 0 }: MetricCardProps) {
  const [displayValue, setDisplayValue] = useState('0');
  
  useEffect(() => {
    const numericMatch = value.match(/^[€]?(\d+(?:\.\d+)?)([%+]|\+)?/);
    if (!numericMatch) {
      setDisplayValue(value);
      return;
    }

    const targetNumber = parseInt(numericMatch[1].replace(/\./g, ''), 10);
    const prefix = value.startsWith('€') ? '€' : '';
    const suffix = numericMatch[2] || '';

    let start = 0;
    const duration = 2000;
    const startTime = Date.now() + (delay * 1000);

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;

      if (elapsed < 0) {
        requestAnimationFrame(animate);
        return;
      }

      if (elapsed < duration) {
        const progress = elapsed / duration;
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeProgress * targetNumber);

        if (targetNumber >= 1000) {
          setDisplayValue(`${prefix}${current.toLocaleString('nl-NL')}${suffix}`);
        } else {
          setDisplayValue(`${prefix}${current}${suffix}`);
        }
        requestAnimationFrame(animate);
      } else {
        if (targetNumber >= 1000) {
          setDisplayValue(`${prefix}${targetNumber.toLocaleString('nl-NL')}${suffix}`);
        } else {
          setDisplayValue(`${prefix}${targetNumber}${suffix}`);
        }
      }
    };

    requestAnimationFrame(animate);
  }, [value, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="relative bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.06)]
                hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300
                transform hover:-translate-y-1 group"
    >
      {/* Border overlay */}
      <div className="absolute inset-0 rounded-xl md:rounded-2xl border-2 border-transparent group-hover:border-blue-600 transition-colors duration-300" />

      <div className="flex items-start gap-3 md:gap-4">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{displayValue}</div>
          <div className="text-sm md:text-base font-medium text-gray-800 mb-0.5 truncate">{title}</div>
          <div className="text-xs md:text-sm text-gray-500 truncate">{subtitle}</div>
        </div>
      </div>
      <div className="absolute top-3 md:top-4 right-3 md:right-4">
        <div className="w-8 md:w-12 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  );
}