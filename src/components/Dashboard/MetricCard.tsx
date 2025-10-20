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
      className="relative bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.06)] 
                hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300
                transform hover:-translate-y-1 group"
    >
      {/* Border overlay */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-600 transition-colors duration-300" />
      
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{displayValue}</div>
          <div className="text-base font-medium text-gray-800 mb-0.5">{title}</div>
          <div className="text-sm text-gray-500">{subtitle}</div>
        </div>
      </div>
      <div className="absolute top-4 right-4">
        <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  );
}