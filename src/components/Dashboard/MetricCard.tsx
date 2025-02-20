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
    // Extract numeric part and suffix
    const numericMatch = value.match(/^[€]?(\d+)([%+]|\+)?/);
    if (!numericMatch) {
      setDisplayValue(value);
      return;
    }

    const targetNumber = parseInt(numericMatch[1], 10);
    const prefix = value.startsWith('€') ? '€' : '';
    const suffix = numericMatch[2] || '';
    
    // Animate the number
    let start = 0;
    const steps = 500; // Number of steps in animation
    const increment = targetNumber / steps;
    const duration = 5000; // Total animation duration in ms
    const stepDuration = duration / steps;

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        start += increment;
        if (start >= targetNumber) {
          setDisplayValue(value);
          clearInterval(interval);
        } else {
          setDisplayValue(`${prefix}${Math.floor(start)}${suffix}`);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(timer);
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