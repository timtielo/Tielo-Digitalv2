import React from 'react';
import { motion } from 'framer-motion';
import { NewsletterForm } from '../Newsletter/NewsletterForm';

export function BlogNewsletter() {
  return (
    <section className="py-20 bg-tielo-navy relative overflow-hidden">
      <div className="absolute inset-0 td-striped opacity-10" />
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="text-[10px] uppercase font-bold tracking-widest text-tielo-orange mb-3 block">
            Nieuwsbrief
          </span>
          <h2 className="text-3xl font-bold mb-4 font-rubik text-white">
            Wil je op de hoogte blijven van de nieuwste ontwikkelingen en innovaties binnen AI en automation?
          </h2>
          <p className="text-xl text-white/80 mb-12">
            Meld je aan voor de nieuwsbrief en ontvang updates direct in je inbox.
          </p>
          <NewsletterForm />
        </motion.div>
      </div>
    </section>
  );
}