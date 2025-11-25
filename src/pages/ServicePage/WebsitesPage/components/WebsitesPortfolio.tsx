import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Iris Achtereekte',
    company: 'Her Horizon',
    quote: "Binnen een week stond mijn hele website live. Tim dacht mee over de vormgeving en hielp bij het uitwerken van mijn businessidee. Alles was snel geregeld en de communicatie was duidelijk.",
    rating: 5
  },
  {
    name: "Job 't Gilde",
    company: "'t Gilde Gevelwerken",
    quote: "Ik twijfelde lang of ik wel een eigen website nodig had. Ik werk al lang via Werkspot en heb al meer dan 600 reviews. Dat betekent ook hoge kosten en soms onnodig betalen. Verder had ik geen online aanwezigheid. Tim heeft er nu voor gezorgd dat ik direct geappt of gebeld kan worden, zonder dat Werkspot daartussen zit. Hij bouwde een professionele website en regel­de alles eromheen: Google Business, WhatsApp-integratie en het complete domeinbeheer. Ik hoefde nergens zelf achteraan. Het proces was snel, duidelijk en de prijs viel positief mee. Dikke aanrader.",
    rating: 5
  },
  {
    name: 'Lars van der Meer',
    company: 'Meer Impact Marketing',
    quote: "Professioneel, supersnel en helemaal naar wens. Binnen een paar dagen was alles geregeld, van ons eerste contact tot het online-gaan van de site. Alles werd volledig geregeld.",
    rating: 5
  }
];

export function WebsitesPortfolio() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 font-rubik text-center">
            Wat Onze Klanten Zeggen
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-8 shadow-sm"
              >
                <div className="flex gap-8 items-start">
                  <div className="hidden md:block">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Quote className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current text-yellow-400" />
                      ))}
                    </div>
                    <blockquote className="text-gray-600 text-base italic mb-6">
                      "{testimonial.quote}"
                    </blockquote>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-gray-500">Eigenaar bij {testimonial.company}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}