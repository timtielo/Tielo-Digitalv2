import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Star } from 'lucide-react';
import { Link } from '../../components/Link';
import { SEO } from '../../components/SEO';
import { PricingCard } from '../../components/common/PricingCard';
import { WhatsAppButton } from '../../components/common/WhatsAppButton';

const GOOGLE_REVIEWS_URL = 'https://www.google.com/search?sa=X&sca_esv=f2a3ab287e621a42&biw=1710&bih=862&sxsrf=ANbL-n77AWrooKCSmFta4IKSSxntHiUdUg:1771270283560&q=Tielo+Digital+Reviews&rflfq=1&num=20&stick=H4sIAAAAAAAAAONgkxI2MzO2MDMzNzE2NTczNDY3MrC03MDI-IpRNCQzNSdfwSUzPbMkMUchKLUsM7W8eBErdnEAia9Gd0oAAAA&rldimm=6638667435761372099&tbm=lcl&hl=en-NL&ved=2ahUKEwjS6rWA4N6SAxUW1QIHHbqIKQIQ9fQKegQIUhAG#lkt=LocalPoiReviews';

const features = [
  'Voor- en na-foto galerij',
  'Binnen- en buitenschilderwerk apart uitgelicht',
  'Reviews zichtbaar',
  'Vindbaarheid op "schilder + plaatsnaam"',
  'Offerte-aanvraag formulier',
  'Duidelijke uitleg over werkwijze',
];

const idealFor = [
  'Zelfstandige schilders',
  'Bedrijven die particuliere klanten willen',
  'Schilders die professioneel willen overkomen',
];

export function SchilderPage() {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Website laten maken als schilder | Tielo Digital"
        description="Website voor schilders. Voor/na galerij, binnen- en buitenschilderwerk, reviews en vindbaarheid. Laat jouw werk spreken."
        keywords={['website schilder', 'schilder website laten maken', 'schilder online', 'schildersbedrijf website']}
        canonical="https://www.tielo-digital.nl/diensten/websites/schilder"
      />

      <section className="pt-28 sm:pt-32 pb-16 sm:pb-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-3 block">
              Websites voor schilders
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-tielo-navy mb-6 tracking-tight leading-[1.15]">
              Website laten maken als schilder
            </h1>
            <div className="text-lg text-tielo-navy/70 leading-relaxed space-y-4">
              <p>Als schilder verkoop je zichtbare kwaliteit.</p>
              <p>Mensen willen voorbeelden zien voordat ze je bellen.</p>
              <p className="font-semibold text-tielo-navy">Een goede website laat jouw werk spreken.</p>
              <p className="text-tielo-navy/60 italic">Zonder website ben je afhankelijk van mond-tot-mond. Met website word je lokaal beter gevonden.</p>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <WhatsAppButton />
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

      <section className="py-16 sm:py-24 bg-tielo-offwhite">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-3 block">
                Reviews
              </span>
              <h2 className="text-3xl font-bold text-tielo-navy mb-4">
                Wat klanten zeggen
              </h2>
            </motion.div>

            <div className="flex justify-center">
              <motion.a
                href={GOOGLE_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="td-card p-8 sm:p-10 shadow-sharp max-w-sm flex flex-col items-center gap-4 group hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-8 h-8"
                  aria-hidden="true"
                >
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>

                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} fill="currentColor" className="w-5 h-5 text-yellow-400" />
                  ))}
                </div>

                <div className="text-center">
                  <p className="text-2xl font-bold text-tielo-navy">5.0</p>
                  <p className="text-sm text-tielo-navy/60 mt-1">
                    13 reviews op Google
                  </p>
                </div>

                <span className="text-xs font-medium text-tielo-orange group-hover:underline mt-1">
                  Bekijk reviews
                </span>
              </motion.a>
            </div>
          </div>
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
                Wat ik bouw
              </span>
              <h2 className="text-3xl font-bold text-tielo-navy mb-4">
                Wat ik voor schilders bouw
              </h2>
            </motion.div>

            <div className="grid gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="flex items-start gap-4 p-5 bg-tielo-offwhite rounded-td"
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
              className="mt-10 text-xl text-tielo-navy font-semibold text-center"
            >
              Beeld staat centraal.
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
                Ideaal voor
              </h2>
            </motion.div>

            <div className="space-y-3">
              {idealFor.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="flex items-center gap-3 p-4 bg-white rounded-td shadow-sm"
                >
                  <Check className="w-5 h-5 text-tielo-orange flex-shrink-0" />
                  <span className="text-tielo-navy/80 text-lg">{item}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-10 p-6 bg-white rounded-td border border-gray-200"
            >
              <p className="text-tielo-navy/70 leading-relaxed">
                Ik bouw ook websites voor andere bouwvakkers. Zie bijvoorbeeld de pagina's voor{' '}
                <Link href="/diensten/websites/elektricien" className="text-tielo-orange hover:underline font-medium">
                  elektriciens
                </Link>
                {' of '}
                <Link href="/diensten/websites/metselaar" className="text-tielo-orange hover:underline font-medium">
                  metselaars
                </Link>
                . Of bekijk{' '}
                <Link href="/diensten/websites" className="text-tielo-orange hover:underline font-medium">
                  alle diensten
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
              Meer schilderklussen via Google?
            </h2>
            <p className="text-lg mb-8 text-tielo-navy/60">
              Plan een kort gesprek.<br />
              Ik laat zien hoe jouw werk online beter gepresenteerd kan worden.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/contact"
                className="bg-tielo-orange hover:bg-[#d85515] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-td font-medium text-base sm:text-lg shadow-sm hover:shadow-sharp transition-all duration-200 active:scale-[0.98] min-h-[48px] touch-manipulation inline-flex items-center gap-2"
              >
                Plan een gesprek
                <ArrowRight className="w-5 h-5" />
              </Link>
              <WhatsAppButton />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
