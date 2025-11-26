import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Iris Achtereekte',
    role: 'Eigenaar bij Her Horizon',
    quote: 'Binnen een week stond mijn hele website herhorizon.nl live. Inclusief logo, teksten en design. Tim dacht mee over de vormgeving en hielp ook bij het uitwerken van mijn businessidee en het scherpstellen van de boodschap richting mijn doelgroep. Daarnaast heeft hij alles technisch goed ingericht: het content management systeem, de Google Business-vermelding, de vindbaarheid in Google en de juiste DNS-instellingen. Wat ik vooral waardeerde, is hoe snel alles geregeld was en hoe duidelijk de communicatie verliep. Ik had veel controle over de inhoud en voelde me echt meegenomen in het proces. Binnen enkele dagen stond alles online! Kortom, een fantastische service die ik van harte aanbeveel!',
    rating: 5
  },
  {
    name: "Job 't Gilde",
    role: "Eigenaar bij 't Gilde Gevelwerken",
    quote: 'Tim heeft in enkele dagen een mooie website voor mij gebouwd. De communicatie was helder en enkele aanpassingen waren snel gedaan. Ik kan zelf makkelijk mijn portfolio bijwerken. Daarnaast heeft hij mij geholpen met de DNS instellingen en het logo. De prijs was ook prima. Kortom, snelle en zorgeloze ervaring, dikke aanrader.',
    rating: 5
  },
  {
    name: 'Youssef Fazazi',
    role: 'Eigenaar',
    quote: 'Ik twijfelde lang of ik wel een eigen website nodig had. Ik werk al lang via Werkspot en heb al meer dan 600 reviews. Dat betekent ook hoge kosten en soms onnodig betalen. Verder had ik geen online aanwezigheid. Tim heeft er nu voor gezorgd dat ik direct geappt of gebeld kan worden, zonder dat Werkspot daartussen zit. Hij bouwde een professionele website en regel­de alles eromheen: Google Business, WhatsApp-integratie en het complete domeinbeheer. Ik hoefde nergens zelf achteraan. Het proces was snel, duidelijk en de prijs viel positief mee. Dikke aanrader.',
    rating: 5
  },
  {
    name: 'Lars van der Meer',
    role: 'Eigenaar bij Meer Impact Marketing',
    quote: 'Tim heeft een geweldige website voor mij gebouwd! Professioneel, supersnel en helemaal naar wens. Dingen waar ik normaal mee worstel, zoals DNS-settings en beveiliging, werden volledig geregeld. De integraties werken perfect, en dankzij het dashboard heb ik eindelijk inzicht in mijn bezoekersaantallen en populairste pagina\'s. Binnen een paar dagen was alles geregeld, van ons eerste contact tot het online-gaan van de site. Het contact verliep soepel, en aanpassingen werden direct doorgevoerd. Ik ben enorm tevreden en heb Tim al aan meerdere mensen in mijn netwerk aanbevolen. Als je een professionele, snelle, en goed presterende website wilt, ben je hier aan het juiste adres!',
    rating: 5
  }
];

export function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 font-rubik">
            Wat Onze Klanten Zeggen
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ontdek waarom bedrijven kiezen voor Tielo Digital
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-8 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center gap-2 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">"{testimonial.quote}"</p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}