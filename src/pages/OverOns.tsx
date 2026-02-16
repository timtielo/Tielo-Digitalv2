import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Target, AlertTriangle, Compass, ListChecks, Rocket, TrendingDown } from 'lucide-react';
import { Link } from '../components/Link';
import { SEO } from '../components/SEO';

export function OverOns() {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Over Ons - Tielo Digital | Websites voor Vakmensen"
        description="Ik help vakmensen aan een eigen professionele online basis. Geen afhankelijkheid van Werkspot, maar eigen controle over je klanten."
        keywords={['Over Tielo Digital', 'Websites vakmensen', 'Tim Tielkemeijer']}
        canonical="https://www.tielo-digital.nl/over-ons"
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
              Over Tielo Digital
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-tielo-navy mb-6 tracking-tight leading-[1.15]">
              Ik help vakmensen aan een eigen{' '}
              <span className="text-tielo-orange">professionele online basis</span>
            </h1>
            <p className="text-lg text-tielo-navy/70 leading-relaxed">
              Geen afhankelijkheid van platforms. Geen concurrentie op prijs. Gewoon een sterke website die voor jou werkt.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto space-y-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex gap-5"
            >
              <div className="w-12 h-12 bg-tielo-teal/10 rounded-td flex items-center justify-center flex-shrink-0 mt-1">
                <Target className="w-6 h-6 text-tielo-steel" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-tielo-navy mb-3">De held</h2>
                <p className="text-tielo-navy/70 leading-relaxed text-lg">
                  Jij bent de vakman die meer controle wil. Je bent goed in je vak, maar online zichtbaarheid is niet je ding. Je wilt klanten die direct bij jou komen, niet via een tussenpartij.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex gap-5"
            >
              <div className="w-12 h-12 bg-red-50 rounded-td flex items-center justify-center flex-shrink-0 mt-1">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-tielo-navy mb-3">Het probleem</h2>
                <p className="text-tielo-navy/70 leading-relaxed text-lg">
                  Je bent te afhankelijk van platforms zoals Werkspot. Je betaalt steeds meer voor leads, concurreert op prijs en hebt geen eigen online aanwezigheid. Klanten zoeken je op Google, maar vinden niets.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex gap-5"
            >
              <div className="w-12 h-12 bg-tielo-orange/10 rounded-td flex items-center justify-center flex-shrink-0 mt-1">
                <Compass className="w-6 h-6 text-tielo-orange" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-tielo-navy mb-3">De gids</h2>
                <p className="text-tielo-navy/70 leading-relaxed text-lg">
                  Ik help vakmensen aan een eigen professionele online basis. Een website die er goed uitziet, goed vindbaar is in Google, en waar klanten je direct kunnen bereiken via WhatsApp. Geen gedoe, geen technische kennis nodig.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex gap-5"
            >
              <div className="w-12 h-12 bg-tielo-teal/10 rounded-td flex items-center justify-center flex-shrink-0 mt-1">
                <ListChecks className="w-6 h-6 text-tielo-steel" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-tielo-navy mb-3">Het plan</h2>
                <ol className="space-y-3 text-tielo-navy/70 text-lg">
                  <li className="flex gap-3">
                    <span className="font-bold text-tielo-orange">1.</span>
                    Kort gesprek over jouw bedrijf en wensen
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-tielo-orange">2.</span>
                    Ik bouw je website binnen 2 weken
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-tielo-orange">3.</span>
                    Live gaan en klanten ontvangen
                  </li>
                </ol>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex gap-5"
            >
              <div className="w-12 h-12 bg-green-50 rounded-td flex items-center justify-center flex-shrink-0 mt-1">
                <Rocket className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-tielo-navy mb-3">Succes</h2>
                <p className="text-tielo-navy/70 leading-relaxed text-lg">
                  Meer aanvragen via je eigen website. Klanten die direct bij jou terechtkomen. Minder afhankelijkheid van dure platforms.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex gap-5"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-td flex items-center justify-center flex-shrink-0 mt-1">
                <TrendingDown className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-tielo-navy mb-3">Of...</h2>
                <p className="text-tielo-navy/70 leading-relaxed text-lg">
                  Blijven concurreren op prijs via tussenplatforms. Steeds meer betalen voor leads. Geen eigen klantenbestand opbouwen.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

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
              Klaar om de stap te zetten?
            </h2>
            <p className="text-lg mb-8 text-tielo-navy/60">
              Plan een kort gesprek en ontdek wat ik voor jou kan betekenen
            </p>
            <Link
              href="/contact"
              className="bg-tielo-orange hover:bg-[#d85515] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-td font-medium text-base sm:text-lg shadow-sm hover:shadow-sharp transition-all duration-200 active:scale-[0.98] min-h-[48px] touch-manipulation inline-flex items-center gap-2"
            >
              Plan een gesprek
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
