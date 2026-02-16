import React from 'react';
import { SuccesverhalenHero } from '../components/Succesverhalen/SuccesverhalenHero';
import { SuccesverhalenCTA } from '../components/Succesverhalen/SuccesverhalenCTA';
import { WebsiteShowcase } from '../components/Websites/WebsiteShowcase';
import { SEO } from '../components/SEO';
import { Star, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Iris Achtereekte',
    role: 'Eigenaar',
    company: 'Her Horizon',
    quote: 'Binnen een week stond mijn hele website herhorizon.nl live. Inclusief logo, teksten en design. Tim dacht mee over de vormgeving en hielp ook bij het uitwerken van mijn businessidee en het scherpstellen van de boodschap richting mijn doelgroep. Daarnaast heeft hij alles technisch goed ingericht: het content management systeem, de Google Business-vermelding, de vindbaarheid in Google en de juiste DNS-instellingen. Wat ik vooral waardeerde, is hoe snel alles geregeld was en hoe duidelijk de communicatie verliep. Ik had veel controle over de inhoud en voelde me echt meegenomen in het proces. Binnen enkele dagen stond alles online! Kortom, een fantastische service die ik van harte aanbeveel!',
    rating: 5
  },
  {
    name: "Job 't Gilde",
    role: 'Eigenaar',
    company: "'t Gilde Gevelwerken",
    quote: 'Tim heeft in enkele dagen een mooie website voor mij gebouwd. De communicatie was helder en enkele aanpassingen waren snel gedaan. Ik kan zelf makkelijk mijn portfolio bijwerken. Daarnaast heeft hij mij geholpen met de DNS instellingen en het logo. De prijs was ook prima. Kortom, snelle en zorgeloze ervaring, dikke aanrader.',
    rating: 5
  },
  {
    name: 'Lars van der Meer',
    role: 'Eigenaar',
    company: 'Meer Impact Marketing',
    quote: 'Tim heeft een geweldige website voor mij gebouwd! Professioneel, supersnel en helemaal naar wens. Dingen waar ik normaal mee worstel, zoals DNS-settings en beveiliging, werden volledig geregeld. De integraties werken perfect, en dankzij het dashboard heb ik eindelijk inzicht in mijn bezoekersaantallen en populairste pagina\'s. Binnen een paar dagen was alles geregeld, van ons eerste contact tot het online-gaan van de site. Het contact verliep soepel, en aanpassingen werden direct doorgevoerd. Ik ben enorm tevreden en heb Tim al aan meerdere mensen in mijn netwerk aanbevolen. Als je een professionele, snelle, en goed presterende website wilt, ben je hier aan het juiste adres!',
    rating: 5
  }
];

export function Succesverhalen() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Succesverhalen - Tevreden Klanten"
        description="Lees wat klanten zeggen over hun ervaring met Tielo Digital. Van websites voor bouwbedrijven tot automatisering van bedrijfsprocessen. 3 tevreden klanten met 5-sterren reviews."
        keywords={[
          'Succesverhalen',
          'Klant Reviews',
          'Testimonials',
          'Tevreden Klanten',
          'Website Reviews',
          'Tielo Digital Reviews'
        ]}
        canonical="https://www.tielo-digital.nl/succesverhalen"
      />

      <SuccesverhalenHero />

      {/* Tevreden Klanten Metric */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto text-center"
          >
            <div className="bg-gray-50 rounded-2xl p-8 shadow-sm">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <div className="text-5xl font-bold text-gray-900 mb-2">3</div>
              <div className="text-xl font-semibold text-gray-900 mb-1">Tevreden Klanten</div>
              <div className="text-gray-600">Met 5-sterren reviews</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 font-rubik text-center">
              Wat Onze Klanten Zeggen
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} fill="currentColor" className="w-5 h-5 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role} bij {testimonial.company}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Website Showcase Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <WebsiteShowcase />
          </div>
        </div>
      </section>

      <SuccesverhalenCTA />
    </div>
  );
}