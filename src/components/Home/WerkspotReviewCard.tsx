import React from 'react';
import { motion } from 'framer-motion';

export function WerkspotReviewCard() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gradient-to-br from-tielo-orange/5 to-tielo-orange/10 rounded-td p-8 sm:p-10 shadow-lg border-l-4 border-tielo-orange">
              <p className="text-2xl sm:text-3xl font-bold text-tielo-navy leading-tight mb-6">
                Heb jij 100+ reviews op Werkspot?
              </p>
              <p className="text-lg sm:text-xl text-tielo-navy/80 leading-relaxed mb-4">
                Dan googelen mensen jouw naam.
                <br />
                Kunnen ze je nu vinden?
              </p>
              <p className="text-lg sm:text-xl text-tielo-navy/90 font-semibold">
                Waarschijnlijk niet. En daarmee loop je opdrachten mis.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
