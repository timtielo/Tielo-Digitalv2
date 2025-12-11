import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { Progress } from './Progress';
import { LucideIcon } from 'lucide-react';

interface Vo2MaxCardProps {
  title: string;
  value: number;
  progress: number;
  status: string;
  description: string;
  icon: LucideIcon;
}

export const Vo2MaxCard: React.FC<Vo2MaxCardProps> = ({
  title,
  value,
  progress,
  status,
  description,
  icon: Icon
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  const springValue = useSpring(0, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const displayProgress = useTransform(springValue, (latest) => Math.round(latest));

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  useEffect(() => {
    const unsubscribe = displayProgress.on('change', (latest) => {
      setDisplayValue(latest);
    });

    return () => unsubscribe();
  }, [displayProgress]);

  const getStatusColor = () => {
    if (progress >= 75) return 'text-green-600';
    if (progress >= 50) return 'text-blue-600';
    if (progress >= 25) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getProgressColor = () => {
    if (progress >= 75) return 'from-green-500 to-green-600';
    if (progress >= 50) return 'from-blue-500 to-blue-600';
    if (progress >= 25) return 'from-yellow-500 to-yellow-600';
    return 'from-orange-500 to-orange-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className={`text-sm font-medium ${getStatusColor()}`}>{status}</p>
          </div>
        </div>
        <motion.div
          className="text-right"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <div className={`text-3xl font-bold ${getStatusColor()}`}>
            {displayValue}%
          </div>
        </motion.div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Voortgang</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <div className="relative">
          <Progress
            value={progress}
            className={`h-3 bg-gradient-to-r ${getProgressColor()}`}
          />
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-sm text-gray-600 leading-relaxed"
      >
        {description}
      </motion.p>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Laatste update</span>
          <span>{new Date().toLocaleDateString('nl-NL')}</span>
        </div>
      </div>
    </motion.div>
  );
};
