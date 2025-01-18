import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export function WebsitesPortfolio() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 font-rubik text-center">
            Wat Onze Klanten Zeggen
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl p-8 shadow-sm"
          >
            <div className="flex gap-8 items-start">
              <div className="hidden md:block">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Quote className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <blockquote className="text-gray-600 text-lg italic mb-6">
                  "Tim heeft een geweldige website voor mij gebouwd! Professioneel, supersnel en helemaal naar wens. Dingen waar ik normaal mee worstel, zoals DNS-settings en beveiliging, werden volledig geregeld. De integraties werken perfect, en dankzij het dashboard heb ik eindelijk inzicht in mijn bezoekersaantallen en populairste pagina's.
                  <br /><br />
                  Binnen een paar dagen was alles geregeld, van ons eerste contact tot het online-gaan van de site. Het contact verliep soepel, en aanpassingen werden direct doorgevoerd. Ik ben enorm tevreden en heb Tim al aan meerdere mensen in mijn netwerk aanbevolen. Als je een professionele, snelle, en goed presterende website wilt, ben je hier aan het juiste adres!"
                </blockquote>
                <div>
                  <p className="font-semibold">Lars van der Meer</p>
                  <p className="text-gray-500">Eigenaar bij Meer Impact Marketing</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}