import React from 'react';
import { Brain, Sparkles, Workflow } from 'lucide-react';
import { motion } from 'framer-motion';

export function HeroAnimation() {
  return (
    <div className="relative w-full h-[400px]">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-24 h-24 bg-green-light rounded-full flex items-center justify-center"
          >
            <Brain className="w-12 h-12 text-white" />
          </motion.div>
          
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 -m-8"
          >
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full">
              <Workflow className="w-8 h-8 text-green-dark" />
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
              <Sparkles className="w-8 h-8 text-green-dark" />
            </div>
          </motion.div>

          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/2 left-1/2 w-full h-full transform -translate-x-1/2 -translate-y-1/2 border-2 border-green-light rounded-full" />
            <div className="absolute top-1/2 left-1/2 w-[120%] h-[120%] transform -translate-x-1/2 -translate-y-1/2 border-2 border-green-dark rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}