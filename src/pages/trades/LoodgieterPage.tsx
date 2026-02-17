import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Phone, MessageCircle } from 'lucide-react';
import { Link } from '../../components/Link';
import { SEO } from '../../components/SEO';
import { PricingCard } from '../../components/common/PricingCard';
import { WhatsAppButton } from '../../components/common/WhatsAppButton';

const features = [
  'Vindbaarheid op "loodgieter + plaatsnaam"',
  'Directe WhatsApp-knop voor spoed',
  'Klikbare telefoonknop bovenaan',
  'Overzicht van diensten (lekkage, sanitair, CV, verstopping)',
  'Reviews zichtbaar op je eigen website',
  'Google Maps integratie',
];

const idealFor = [
  'Zelfstandige loodgieters',
  'Spoedgerichte bedrijven',
  'Loodgieters die minder afhankelijk willen zijn van Werkspot',
  'Vakmannen die lokaal beter gevonden willen worden',
];

export function LoodgieterPage() {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Website laten maken als loodgieter | Tielo Digital"
        description="Website voor loodgieters. Lokaal vindbaar in Google, WhatsApp voor spoedklussen, reviews zichtbaar. Geen Werkspot nodig."
        keywords={['website loodgieter', 'loodgieter website laten maken', 'loodgieter Google', 'loodgieter online']}
        canonical="https://www.tielo-digital.nl/diensten/websites/loodgieter"
      />

      <section className="pt-28 sm:pt-32 pb-16 sm:pb-20 bg-tielo-offwhite relative overflow-hidden">
        <div className="absolute inset-0 td-micro-grid opacity-40" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-3 block">
              Websites voor loodgieters
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-tielo-navy mb-6 tracking-tight leading-[1.15]">
              Website laten maken als loodgieter
            </h1>
            <div className="text-lg text-tielo-navy/70 leading-relaxed space-y-4">
              <p>Als loodgieter draait alles om snelheid en vertrouwen.</p>
              <p>Mensen zoeken pas wanneer er een probleem is. Lekkage. Verstopping. CV-storing.</p>
              <p className="font-medium">Op dat moment moet jij zichtbaar zijn in Google.</p>
              <p>Zonder eigen website ben je afhankelijk van platforms waar je per lead betaalt en moet concurreren met tien anderen.</p>
              <p className="font-semibold text-tielo-navy">Een eigen website zorgt ervoor dat klanten jou direct bellen.</p>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href="/contact"
                className="bg-tielo-orange hover:bg-[#d85515] text-white px-6 py-3 rounded-td font-medium shadow-sm hover:shadow-sharp transition-all duration-200 active:scale-[0.98] min-h-[48px] touch-manipulation inline-flex items-center gap-2 justify-center"
              >
                Plan een gesprek
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/diensten/websites"
                className="bg-white border border-gray-300 text-tielo-navy px-6 py-3 rounded-td font-medium hover:border-tielo-navy hover:bg-gray-50 transition-all duration-200 active:scale-[0.98] min-h-[48px] touch-manipulation inline-flex items-center gap-2 justify-center"
              >
                Meer over websites
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-3 block">
                Wat ik regel
              </span>
              <h2 className="text-3xl font-bold text-tielo-navy mb-4">
                Wat ik voor loodgieters regel
              </h2>
            </motion.div>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="flex items-start gap-4 p-4 rounded-td hover:bg-tielo-offwhite transition-colors"
                >
                  <div className="w-8 h-8 bg-tielo-orange/10 rounded-td flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-tielo-orange" />
                  </div>
                  <span className="text-tielo-navy/80 text-lg leading-relaxed">{feature}</span>
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-10 text-lg text-tielo-navy/70 leading-relaxed font-medium"
            >
              De focus ligt op directe aanvragen.
            </motion.p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-tielo-offwhite">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-3 block">
                Voor wie
              </span>
              <h2 className="text-3xl font-bold text-tielo-navy mb-4">
                Voor wie dit ideaal is
              </h2>
            </motion.div>

            <div className="space-y-4">
              {idealFor.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="flex items-start gap-4 p-4 bg-white rounded-td shadow-sharp"
                >
                  <div className="w-8 h-8 bg-tielo-orange/10 rounded-td flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-tielo-orange" />
                  </div>
                  <span className="text-tielo-navy/80 text-lg leading-relaxed">{item}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-10 p-6 bg-tielo-navy/5 rounded-td border-l-4 border-tielo-orange"
            >
              <p className="text-tielo-navy/70 leading-relaxed">
                Ook voor andere vakmensen beschikbaar. Bekijk onze pagina's voor{' '}
                <Link href="/diensten/websites/aannemer" className="text-tielo-orange hover:underline font-medium">
                  aannemers
                </Link>
                {', '}
                <Link href="/diensten/websites/elektricien" className="text-tielo-orange hover:underline font-medium">
                  elektriciens
                </Link>
                {' en '}
                <Link href="/diensten/websites/schilder" className="text-tielo-orange hover:underline font-medium">
                  schilders
                </Link>
                .
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <PricingCard />

      <section className="py-16 sm:py-24 bg-tielo-cream relative overflow-hidden">
        <div className="absolute inset-0 td-striped opacity-40" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-tielo-navy tracking-tight">
              Klaar om lokaal zichtbaar te worden?
            </h2>
            <p className="text-lg mb-8 text-tielo-navy/60">
              Vertel me waar je actief bent.<br />
              Ik laat je zien hoe jouw website eruit kan zien.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <WhatsAppButton />
              <Link
                href="/contact"
                className="bg-white border-2 border-tielo-orange text-tielo-orange hover:bg-tielo-orange hover:text-white px-6 sm:px-8 py-3 sm:py-4 rounded-td font-medium text-base sm:text-lg shadow-sm hover:shadow-sharp transition-all duration-200 active:scale-[0.98] min-h-[48px] touch-manipulation inline-flex items-center gap-2"
              >
                Plan een gesprek
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
