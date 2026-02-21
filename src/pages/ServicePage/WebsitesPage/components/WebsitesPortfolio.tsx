import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { Link } from '../../../../components/Link';

const testimonials: { name: string; company: string; quote: string; rating: number; caseTeaser?: string; caseLink?: string }[] = [
  {
    name: 'Jack van Eijk',
    company: 'Allround Klusbedrijf Specht',
    quote: "Ik haalde mijn werk vooral uit mond-tot-mondreclame en via Werkspot en had geen website. Dat ging op zich wel, maar ik had zelf geen controle op hoe mijn bedrijf online overkwam en was afhankelijk van andere platforms. Toen Tim mij via WhatsApp benaderde, was ik wat sceptisch. Wat voor mij het verschil maakte, was dat Tim niet met een vaag verhaal kwam, maar direct een website opzetje stuurde. Dat gaf vertrouwen. Ook de prijs was zo geregeld. Alles werd duidelijk afgesproken, zonder gedoe. Daarna werd eigenlijk alles uit handen genomen. Domein, e-mail, hosting, teksten, portfolio en de basis voor Google. Ik hoefde me nergens druk om te maken. Door mijn drukke planning, ziekte en vakantie was het fijn dat ik alleen input hoefde te geven wanneer het mij uitkwam. Aanpassingen werden snel opgepakt en echt doorgevoerd. De website staat nu live en ik ben er gewoon heel tevreden over. Het ziet er professioneel uit, laat mijn werk goed zien en klanten kunnen me direct via WhatsApp bereiken. Ondanks mijn twijfel in het begin kijk ik terug op een prettig en soepel traject. Aanrader.",
    rating: 5
  },
  {
    name: 'Youssef Fazazi',
    company: 'Mr. Clogged 24/7',
    quote: "Ik twijfelde lang of ik wel een eigen website nodig had. Ik werk al lang via Werkspot en heb al meer dan 600 reviews. Dat betekent ook hoge kosten en soms onnodig betalen. Verder had ik geen online aanwezigheid. Tim heeft er nu voor gezorgd dat ik direct geappt of gebeld kan worden, zonder dat Werkspot daartussen zit. Hij bouwde een professionele website en regelde alles eromheen: Google Business, WhatsApp-integratie en het complete domeinbeheer. Ik hoefde nergens zelf achteraan. Het proces was snel, duidelijk en de prijs viel positief mee. Dikke aanrader.",
    rating: 5
  },
  {
    name: "Job 't Gilde",
    company: "'t Gilde Gevelwerken",
    quote: "Tim heeft in enkele dagen een mooie website voor mij gebouwd. De communicatie was helder en enkele aanpassingen waren snel gedaan. Ik kan zelf makkelijk mijn portfolio bijwerken. Daarnaast heeft hij mij geholpen met de DNS instellingen en het logo. De prijs was ook prima. Kortom, snelle en zorgeloze ervaring, dikke aanrader.",
    rating: 5,
    caseTeaser: "Metselaar Job had zijn website in een maand terugverdiend.",
    caseLink: "/cases#case-gilde"
  },
  {
    name: 'Lars van der Meer',
    company: 'Meer Impact Marketing',
    quote: "Professioneel, supersnel en helemaal naar wens. Binnen een paar dagen was alles geregeld, van ons eerste contact tot het online-gaan van de site. Alles werd volledig geregeld.",
    rating: 5
  },
  {
    name: 'Iris Achtereekte',
    company: 'Her Horizon',
    quote: "Binnen een week stond mijn hele website live. Tim dacht mee over de vormgeving en hielp bij het uitwerken van mijn businessidee. Alles was snel geregeld en de communicatie was duidelijk.",
    rating: 5
  },
  {
    name: 'Bart Vermeulen',
    company: 'i-Lizard',
    quote: "Tim introduceerde zichzelf middels een handgeschreven kaartje welke ik ontving via PostNL. Door het aantal positieve reviews op Werkspot te benoemen, en de mogelijkheid te benoemen meer \"los te komen\" van Werkspot, was ik meteen geïnteresseerd. Daarnaast deelde Tim een link naar een 1e opzet van een op maat gesneden website. Deze 1e opzet sloot meer dan verwacht aan op mijn wensen. Na een 1e persoonlijk contact, waarin er goed geluisterd werd naar mijn wensen, heeft Tim een op maat gesneden website aangeleverd waarin foto's, recensies, werkgebieden en motivatie duidelijk naar voren kwamen. Middels video-instructies werd aangegeven hoe ik de inhoud van mijn portfolio zelf kan aanpassen en mijn website up-to-date kan houden. Ik ben ook blij met de vertaalslag die Tim kon maken tussen mijn ideeën en wensen naar een \"marketing-proof\" web-ingang. Erg tevreden met Tim's persoonlijke benadering, zijn betrokkenheid, de kwaliteit en relevantie van het eindproduct, en de schappelijke ontwikkelings- en beheer-kosten.",
    rating: 5
  },
  {
    name: 'Ömer Cetin',
    company: 'Bouw Kliniek',
    quote: "Tim heeft mijn website gemaakt voor mijn bouw bedrijf. Hij had mij benaderd via een handgeschreven briefje omdat ik actief ben op Werkspot.\n\nIn het begin was ik niet blij met de communicatie. Via telefoon was Tim niet altijd bereikbaar en voor mij is dat belangrijk. Ik hou van snel schakelen. Via WhatsApp kreeg ik wel altijd reactie en daar werd netjes op geantwoord. Nadat ik mijn mening heb gegeven, is de communicatie duidelijker gegaan.\n\nDe prijs was duidelijk. Geen verrassingen. Wat we hebben afgesproken, is zo gebleven. Dat vind ik belangrijk in zaken doen.\n\nDe website is netjes gemaakt, net zoals het logo. Ik kan zelf de foto's en projecten toevoegen en de website is goed persoonlijk. Hij denkt ook mee over bijvoorbeeld een Engelse versie en reviews verzamelen. Dat is goed. De website stond binnen 10 dagen na akkoord al online. Top.\n\nAanrader.",
    rating: 5
  }
];

const MAX_LENGTH = 180;

function TestimonialCard({ testimonial, index }: { testimonial: (typeof testimonials)[0], index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = testimonial.quote.length > MAX_LENGTH;
  const displayQuote = shouldTruncate && !isExpanded
    ? testimonial.quote.slice(0, MAX_LENGTH) + '...'
    : testimonial.quote;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col gap-3 shadow-sm"
    >
      <div className="flex items-center gap-0.5">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-current text-yellow-400" />
        ))}
      </div>

      <blockquote className="text-gray-600 text-sm italic leading-relaxed">
        "{displayQuote}"
      </blockquote>

      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-tielo-navy/50 hover:text-tielo-navy text-xs font-medium flex items-center gap-1 transition-colors self-start"
        >
          {isExpanded ? (
            <><ChevronUp className="w-3.5 h-3.5" />Lees minder</>
          ) : (
            <><ChevronDown className="w-3.5 h-3.5" />Lees meer</>
          )}
        </button>
      )}

      <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-sm text-tielo-navy leading-none mb-0.5">{testimonial.name}</p>
          <p className="text-xs text-gray-400">{testimonial.company}</p>
        </div>
        {testimonial.caseTeaser && testimonial.caseLink && (
          <Link
            href={testimonial.caseLink}
            className="flex items-center gap-1 text-xs font-semibold text-tielo-orange hover:text-[#d85515] whitespace-nowrap transition-colors flex-shrink-0"
          >
            Lees case
            <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
    </motion.div>
  );
}

export function WebsitesPortfolio() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-7">
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 whitespace-nowrap">Klantreviews</span>
            <div className="flex-1 h-px bg-gray-200" />
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-current text-yellow-400" />
              ))}
              <span className="text-xs text-gray-400 ml-1">{testimonials.length} reviews</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
