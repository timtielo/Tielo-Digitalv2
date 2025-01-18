import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Bot, MessageSquare, Workflow, Send, Brain } from 'lucide-react';

interface ServiceVisualProps {
  serviceId: string;
}

export function ServiceVisual({ serviceId }: ServiceVisualProps) {
  const visualConfigs = {
    'email-handling': {
      icon: Mail,
      color: 'bg-blue-500',
      animation: {
        y: [0, -10, 0],
        transition: { duration: 2, repeat: Infinity }
      }
    },
    'customer-service': {
      icon: Bot,
      color: 'bg-green-500',
      animation: {
        rotate: [0, 10, -10, 0],
        transition: { duration: 3, repeat: Infinity }
      }
    },
    'content-creation': {
      icon: MessageSquare,
      color: 'bg-purple-500',
      animation: {
        scale: [1, 1.1, 1],
        transition: { duration: 2, repeat: Infinity }
      }
    },
    'workflow': {
      icon: Workflow,
      color: 'bg-orange-500',
      animation: {
        rotate: [0, 360],
        transition: { duration: 20, repeat: Infinity, ease: "linear" }
      }
    },
    'outreach': {
      icon: Send,
      color: 'bg-teal-500',
      animation: {
        x: [0, 10, 0],
        transition: { duration: 2, repeat: Infinity }
      }
    },
    'custom': {
      icon: Brain,
      color: 'bg-indigo-500',
      animation: {
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0],
        transition: { duration: 3, repeat: Infinity }
      }
    }
  };

  const config = visualConfigs[serviceId as keyof typeof visualConfigs];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <div className="relative w-full h-[400px] hidden md:block">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <motion.div
            animate={config.animation}
            className={`w-32 h-32 ${config.color} rounded-2xl flex items-center justify-center`}
          >
            <Icon className="w-16 h-16 text-white" />
          </motion.div>
          
          {/* Decorative circles */}
          <div className="absolute inset-0 -m-8">
            <div className="absolute inset-0 border-4 border-gray-100 rounded-full animate-[spin_20s_linear_infinite]" />
            <div className="absolute inset-0 -m-4 border-4 border-gray-50 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
          </div>

          {/* Particles */}
          <div className="absolute inset-0 -m-16">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-3 h-3 ${config.color} rounded-full opacity-20`}
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}