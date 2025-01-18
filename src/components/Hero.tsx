import React from 'react';
import { ArrowRight, Brain, Sparkles, Workflow } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from './Link';

export function Hero() {
  return (
    <div className="min-h-screen flex items-center relative overflow-hidden bg-gradient-to-br from-blue-50 to-white">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="container mx-auto px-4 pt-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 font-rubik leading-tight">
              Automatiseer jouw bedrijf en{' '}
              <span className="text-blue-600">bespaar tijd</span> met slimme oplossingen
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Transformeer bedrijfsprocessen met op maat gemaakte systemen. 
              Verhoog efficiency, verminder kosten en blijf voorop in innovatie.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/contact"
                className="btn-primary flex items-center justify-center"
              >
                Vraag een gratis consult aan
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="/diensten"
                className="btn-secondary"
              >
                Bekijk onze diensten
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative hidden md:block"
          >
            <div className="relative w-full h-[400px]">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center"
                  >
                    <Brain className="w-12 h-12 text-white" />
                  </motion.div>
                  
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 -m-8"
                  >
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full">
                      <Workflow className="w-8 h-8 text-blue-500" />
                    </div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                      <Sparkles className="w-8 h-8 text-blue-500" />
                    </div>
                  </motion.div>

                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-1/2 left-1/2 w-full h-full transform -translate-x-1/2 -translate-y-1/2 border-2 border-blue-400 rounded-full" />
                    <div className="absolute top-1/2 left-1/2 w-[120%] h-[120%] transform -translate-x-1/2 -translate-y-1/2 border-2 border-blue-300 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}