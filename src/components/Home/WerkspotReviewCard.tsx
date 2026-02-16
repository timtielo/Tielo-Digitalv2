import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

export function WerkspotReviewCard() {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-tielo-offwhite to-white relative overflow-hidden">
      <div className="absolute inset-0 td-micro-grid opacity-30" />
      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-tielo-orange/20 to-tielo-orange/10 rounded-td blur-xl"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.7, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <div className="relative bg-white rounded-td p-8 sm:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-2 border-tielo-orange">
                <div className="flex items-start gap-4 sm:gap-6 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-tielo-orange rounded-td flex items-center justify-center shadow-sharp">
                    <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-2xl sm:text-3xl font-bold text-tielo-navy leading-tight mb-6">
                      Heb jij 100+ reviews op Werkspot?
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pl-0 sm:pl-20">
                  <p className="text-lg sm:text-xl text-tielo-navy/80 leading-relaxed font-medium">
                    Dan googelen mensen jouw naam.
                    <br />
                    Kunnen ze je nu vinden?
                  </p>
                  <div className="bg-tielo-orange/10 border-l-4 border-tielo-orange rounded-r-td p-4 sm:p-5">
                    <p className="text-lg sm:text-xl text-tielo-navy font-semibold">
                      Waarschijnlijk niet. En daarmee loop je opdrachten mis.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
