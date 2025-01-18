import React from 'react';
import { motion } from 'framer-motion';
import { GuideForm } from '../Guide/GuideForm';

export function BlogNewsletter() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold mb-4 font-rubik">
            Wil je op de hoogte blijven van de nieuwste ontwikkelingen en innovaties binnen AI en automation?
          </h2>
          <p className="text-xl text-gray-600 mb-4">
            En wil jij weten hoe je dit zelf kan gebruiken?
          </p>
          <p className="text-xl text-gray-600 mb-12">
            Meld je aan voor de nieuwsbrief en ontvang gratis onze guide.
          </p>
          <GuideForm />
        </motion.div>
      </div>
    </section>
  );
}