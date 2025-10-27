import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Iris Achtereekte',
    company: 'Her Horizon',
    quote: "Binnen een week stond mijn hele website herhorizon.nl live. Inclusief logo, teksten en design. Tim dacht mee over de vormgeving en hielp ook bij het uitwerken van mijn businessidee en het scherpstellen van de boodschap richting mijn doelgroep. Daarnaast heeft hij alles technisch goed ingericht: het content management systeem, de Google Business-vermelding, de vindbaarheid in Google en de juiste DNS-instellingen. Wat ik vooral waardeerde, is hoe snel alles geregeld was en hoe duidelijk de communicatie verliep. Ik had veel controle over de inhoud en voelde me echt meegenomen in het proces. Binnen enkele dagen stond alles online! Kortom, een fantastische service die ik van harte aanbeveel!",
    rating: 5
  },
  {
    name: "Job 't Gilde",
    company: "'t Gilde Gevelwerken",
    quote: "Tim heeft in enkele dagen een mooie website voor mij gebouwd. De communicatie was helder en enkele aanpassingen waren snel gedaan. Ik kan zelf makkelijk mijn portfolio bijwerken. Daarnaast heeft hij mij geholpen met de DNS instellingen en het logo. De prijs was ook prima. Kortom, snelle en zorgeloze ervaring, dikke aanrader.",
    rating: 5
  },
  {
    name: 'Lars van der Meer',
    company: 'Meer Impact Marketing',
    quote: "Tim heeft een geweldige website voor mij gebouwd! Professioneel, supersnel en helemaal naar wens. Dingen waar ik normaal mee worstel, zoals DNS-settings en beveiliging, werden volledig geregeld. De integraties werken perfect, en dankzij het dashboard heb ik eindelijk inzicht in mijn bezoekersaantallen en populairste pagina's. Binnen een paar dagen was alles geregeld, van ons eerste contact tot het online-gaan van de site. Het contact verliep soepel, en aanpassingen werden direct doorgevoerd. Ik ben enorm tevreden en heb Tim al aan meerdere mensen in mijn netwerk aanbevolen. Als je een professionele, snelle, en goed presterende website wilt, ben je hier aan het juiste adres!",
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