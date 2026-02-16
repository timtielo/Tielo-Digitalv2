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
          >
            <div className="td-card p-8 sm:p-10 shadow-sharp border-l-4 border-tielo-orange">
              <p className="text-xl sm:text-2xl font-semibold text-tielo-navy leading-relaxed mb-4">
                Heb jij 100+ reviews op Werkspot?
              </p>
              <p className="text-lg text-tielo-navy/70 leading-relaxed">
                Dan googelen mensen jouw naam.
                <br />
                Kunnen ze je nu vinden?
              </p>
              <p className="text-lg text-tielo-navy/50 mt-4 italic">
                Waarschijnlijk niet. En daarmee loop je opdrachten mis.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
