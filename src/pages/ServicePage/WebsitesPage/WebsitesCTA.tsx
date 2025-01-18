import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from '../../../components/Link';

export function WebsitesCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold mb-6 font-rubik">
            Klaar voor een nieuwe website?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Laten we bespreken hoe we jouw online aanwezigheid kunnen versterken
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white rounded-lg 
                     font-semibold text-lg hover:bg-primary/90 transition-all duration-300
                     hover:scale-[1.02] active:scale-[0.98]"
          >
            Plan een gesprek
            <ArrowRight className="ml-2 w-6 h-6" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}