import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, MapPin, MessageCircle } from 'lucide-react';
import { SEO } from '../components/SEO';
import { LocalBusinessSchema } from '../components/SEO/LocalBusinessSchema';
import { Link } from '../components/Link';
import { WhatsAppButton } from '../components/common/WhatsAppButton';
import { FAQSection } from '../components/common/FAQSection';

const WERKGEBIED = [
  'Utrecht',
  'Nieuwegein',
  'IJsselstein',
  'Woerden',
  'Amersfoort',
  'Zeist',
];

const TRADES = [
  {
    title: 'Loodgieter',
    description:
      'Lokaal gevonden worden bij spoedklussen zoals lekkage of CV-storing. WhatsApp-knop voor direct contact.',
    href: '/diensten/websites/loodgieter',
    keywords: ['loodgieter Utrecht', 'loodgieter website'],
  },
  {
    title: 'Aannemer',
    description:
      'Laat projecten en referenties zien. Klanten zoeken op "aannemer Utrecht" — dan moet jij bovenaan staan.',
    href: '/diensten/websites/aannemer',
    keywords: ['aannemer Utrecht', 'aannemer website'],
  },
  {
    title: 'Elektricien',
    description:
      'Vindbaar bij storingen en nieuwbouw. Klanten bellen de eerste elektricien die ze vinden in Google.',
    href: '/diensten/websites/elektricien',
    keywords: ['elektricien Utrecht', 'elektricien website'],
  },
  {
    title: 'Schilder',
    description:
      "Toon je werk met voor- en nafoto's. Reviews van klanten uit de regio zorgen voor vertrouwen.",
    href: '/diensten/websites/schilder',
    keywords: ['schilder Utrecht', 'schilder website'],
  },
  {
    title: 'Metselaar',
    description:
      'Portfolio van opritten, aanbouwen en renovaties. Gevonden worden op "metselaar + regio".',
    href: '/diensten/websites/metselaar',
    keywords: ['metselaar Utrecht', 'metselaar website'],
  },
  {
    title: 'Klusbedrijf',
    description:
      'Brede diensten, brede zichtbaarheid. Een overzichtelijke site geeft klanten direct vertrouwen.',
    href: '/diensten/websites/klusbedrijf',
    keywords: ['klusbedrijf Utrecht', 'klusbedrijf website'],
  },
];

const INCLUDED = [
  'Eigen domeinnaam (bijv. janssen-loodgieter.nl)',
  'Professionele hosting — altijd snel en veilig',
  'Google Business aanmaken of optimaliseren',
  'WhatsApp-knop voor directe aanvragen',
  'Mobiel-vriendelijk en snel geladen',
  'Lokaal vindbaar in Google voor jouw regio',
  'Binnen 2 weken live',
];

const FAQS = [
  {
    question: 'Werk je alleen in Utrecht?',
    answer:
      'Nee — ik werk door heel Nederland, maar ik ken de markt in de regio Utrecht goed. Veel klanten komen uit Utrecht, Nieuwegein, IJsselstein, Woerden, Amersfoort en Zeist.',
  },
  {
    question: 'Hoe snel staat mijn website online?',
    answer:
      'Binnen 2 weken. Na een kort gesprek lever ik een eerste versie op. Jij geeft feedback en dan gaan we live.',
  },
  {
    question: 'Wat kost een website via Tielo Digital?',
    answer:
      'Vraag een gratis opzetje aan — dan zie je precies hoe jouw website eruit kan zien en wat het kost.',
  },
  {
    question: 'Heb ik al iets nodig om te starten?',
    answer:
      'Nee. Ik regel het domein, de hosting en de Google Business-aanmelding. Jij hoeft alleen je werk te doen.',
  },
  {
    question: 'Kan ik mijn website later aanpassen?',
    answer:
      'Ja. Via het klantendashboard kun je foto\'s, teksten en reviews zelf bijhouden. Geen technische kennis nodig.',
  },
];

export function UtrechtPage() {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Website Laten Maken Utrecht | Vakmensen in de Regio"
        description="Website laten maken Utrecht voor loodgieters, aannemers, elektriciens en klusbedrijven. Lokaal vindbaar in Google. Domein, hosting en Google Business inbegrepen. Binnen 2 weken live."
        keywords={[
          'website laten maken Utrecht',
          'website loodgieter Utrecht',
          'website aannemer Utrecht',
          'website elektricien Utrecht',
          'website klusbedrijf Utrecht',
          'website schilder Utrecht',
          'website metselaar Utrecht',
          'webdesign Utrecht vakmensen',
        ]}
        canonical="https://www.tielo-digital.nl/website-laten-maken-utrecht"
        local={{
          addressLocality: 'Utrecht',
          addressRegion: 'Utrecht',
          postalCode: '3512 AK',
        }}
      />
      <LocalBusinessSchema
        aggregateRating={{ ratingValue: 5, reviewCount: 5 }}
      />

      {/* Hero */}
      <section className="pt-28 sm:pt-36 pb-20 bg-tielo-offwhite relative overflow-hidden">
        <div className="absolute inset-0 td-micro-grid opacity-40" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 text-[11px] uppercase font-bold tracking-widest text-tielo-orange mb-4">
              <MapPin className="w-3.5 h-3.5" />
              Utrecht &amp; omgeving
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-tielo-navy mb-6 tracking-tight leading-[1.15]">
              Website laten maken{' '}
              <span className="text-tielo-orange">Utrecht</span>
            </h1>
            <p className="text-lg text-tielo-navy/70 leading-relaxed mb-4 max-w-2xl">
              Ik help vakmensen in Utrecht en omgeving aan een professionele website waarmee ze direct gevonden worden door klanten uit de eigen regio.
            </p>
            <p className="text-base text-tielo-navy/60 leading-relaxed mb-8 max-w-2xl">
              Geen gedoe met techniek. Ik regel alles: domein, hosting, Google Business en een mobiel-vriendelijke website die converteert. Jij hoeft alleen je werk te doen.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href="/contact"
                className="bg-tielo-orange hover:bg-[#d85515] text-white px-6 py-3.5 rounded-td font-semibold shadow-sm hover:shadow-sharp transition-all duration-200 active:scale-[0.98] min-h-[48px] touch-manipulation inline-flex items-center gap-2 justify-center text-base"
              >
                Gratis opzetje aanvragen
                <ArrowRight className="w-5 h-5" />
              </Link>
              <WhatsAppButton variant="outline" eventName="cta_primary_hero_click" buttonLocation="Utrecht Hero">
                Stuur een appje
              </WhatsAppButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Werkgebied */}
      <section className="py-12 bg-tielo-navy">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-2 text-white/60 text-sm font-medium flex-shrink-0">
              <MapPin className="w-4 h-4 text-tielo-orange" />
              Werkgebied:
            </div>
            <div className="flex flex-wrap gap-2">
              {WERKGEBIED.map((city) => (
                <span
                  key={city}
                  className="px-3 py-1 bg-white/10 text-white text-sm font-medium rounded-td border border-white/10"
                >
                  {city}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vakken grid */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mb-14"
          >
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-3 block">
              Voor welk beroep?
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-tielo-navy tracking-tight leading-tight mb-4">
              Websites voor elke vakman in Utrecht
            </h2>
            <p className="text-tielo-navy/60 text-lg leading-relaxed">
              Of je nu loodgieter, aannemer of schilder bent — ik maak een website die aansluit bij jouw werk en jouw klanten in de regio.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TRADES.map((trade, i) => (
              <motion.div
                key={trade.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  href={trade.href}
                  className="group block h-full p-6 bg-tielo-offwhite rounded-td border border-tielo-steel/10 hover:border-tielo-orange/30 hover:shadow-sharp-hover transition-all duration-200"
                >
                  <h3 className="text-xl font-bold text-tielo-navy mb-3 group-hover:text-tielo-orange transition-colors">
                    {trade.title} Utrecht
                  </h3>
                  <p className="text-tielo-navy/60 text-sm leading-relaxed mb-4">
                    {trade.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {trade.keywords.map((kw) => (
                      <span key={kw} className="text-[11px] text-tielo-navy/40 bg-white px-2 py-0.5 rounded border border-tielo-steel/10">
                        {kw}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-tielo-orange text-sm font-semibold group-hover:gap-2.5 transition-all">
                    Bekijk pagina
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-20 sm:py-28 bg-tielo-offwhite">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-3 block">
                Alles inbegrepen
              </span>
              <h2 className="text-3xl font-bold text-tielo-navy mb-4">
                Wat ik voor jou regel
              </h2>
              <p className="text-tielo-navy/60 leading-relaxed">
                Geen losse rekeningen voor domein, hosting of Google Business. Alles zit in één pakket.
              </p>
            </motion.div>

            <div className="space-y-3">
              {INCLUDED.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-start gap-4 p-4 bg-white rounded-td shadow-sharp"
                >
                  <div className="w-7 h-7 bg-tielo-orange/10 rounded-td flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-tielo-orange" />
                  </div>
                  <span className="text-tielo-navy/80 leading-relaxed">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social proof quote */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto border-l-4 border-tielo-orange pl-6"
          >
            <p className="text-xl text-tielo-navy font-medium leading-relaxed mb-4">
              "Binnen 2 weken had ik een professionele website die ik trots aan klanten kon laten zien. Al na een week mijn eerste aanvraag via de site."
            </p>
            <footer className="text-tielo-navy/50 text-sm font-medium">
              — Vakman uit Utrecht, klant sinds 2024
            </footer>
          </motion.blockquote>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection faqs={FAQS} />

      {/* CTA */}
      <section className="py-20 sm:py-28 bg-tielo-navy relative overflow-hidden">
        <div className="absolute inset-0 td-striped opacity-5" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-1.5 text-tielo-orange text-xs font-bold uppercase tracking-widest mb-5">
              <MapPin className="w-3.5 h-3.5" />
              Utrecht &amp; omgeving
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5 tracking-tight leading-tight">
              Vraag een gratis opzetje aan
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-8">
              Ik laat je zien hoe jouw website eruit kan zien — gratis en vrijblijvend. Speciaal afgestemd op jouw beroep en de regio Utrecht.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/contact"
                className="bg-tielo-orange hover:bg-[#d85515] text-white px-7 py-4 rounded-td font-semibold text-lg shadow-sm hover:shadow-sharp transition-all duration-200 active:scale-[0.98] min-h-[56px] touch-manipulation inline-flex items-center gap-2"
              >
                Gratis opzetje aanvragen
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="https://wa.me/31620948502?text=Hey%20Tim,%20ik%20kom%20uit%20Utrecht%20en%20wil%20graag%20een%20website."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-td font-semibold text-lg border-2 border-white/20 text-white hover:border-white hover:bg-white/5 transition-all duration-200 min-h-[56px] touch-manipulation"
              >
                <MessageCircle className="w-5 h-5" />
                Stuur een appje
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
