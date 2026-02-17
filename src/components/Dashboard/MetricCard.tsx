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
      className="relative td-card p-4 md:p-6 hover:shadow-xl transition-all duration-300
                transform hover:-translate-y-1 group overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 td-striped opacity-5" />

      {/* Border overlay */}
      <div className="absolute inset-0 rounded-td border-2 border-transparent group-hover:border-tielo-orange transition-colors duration-300" />

      <div className="flex items-start gap-3 md:gap-4 relative">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-tielo-orange/10 rounded-td flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 md:w-6 md:h-6 text-tielo-orange" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-2xl md:text-3xl font-bold font-rubik text-tielo-navy mb-1">{displayValue}</div>
          <div className="text-sm md:text-base font-bold text-tielo-navy mb-0.5 truncate">{title}</div>
          <div className="text-xs md:text-sm text-tielo-navy/60 truncate">{subtitle}</div>
        </div>
      </div>
      <div className="absolute top-3 md:top-4 right-3 md:right-4">
        <div className="w-8 md:w-12 h-1 bg-tielo-orange rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  );
}