import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Globe, Search, MessageCircle, Settings, Check } from 'lucide-react';
import { Link } from '../components/Link';
import { SEO } from '../components/SEO';

const services = [
  { icon: Globe, text: 'Een duidelijke, professionele website' },
  { icon: Search, text: 'Goede vindbaarheid in Google' },
  { icon: MessageCircle, text: 'Direct contact via WhatsApp' },
  { icon: Settings, text: 'Alles technisch geregeld' },
];

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
              Ik ben{' '}
              <span className="text-tielo-orange">Tim Tielkemeijer</span>.
            </h1>
            <p className="text-lg text-tielo-navy/70 leading-relaxed">
              Ik help vakmensen aan een sterke, professionele website.
              <br />
              Zodat je minder afhankelijk bent van platforms zoals Werkspot en meer controle krijgt over je eigen klanten.
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
            >
              <div className="td-card p-8 sm:p-10 shadow-sharp border-l-4 border-tielo-orange">
                <p className="text-xl sm:text-2xl font-semibold text-tielo-navy leading-relaxed mb-4">
                  Heb jij 100+ reviews op Werkspot?
                </p>
                <p className="text-lg text-tielo-navy/70 leading-relaxed">
                  Dan googelen mensen jouw naam.
                  <br />
                  Kunnen ze je nu vinden?
                </p>
                <p className="text-lg text-tielo-navy/50 mt-4 italic">
                  Waarschijnlijk niet. En daarmee loop je opdrachten mis.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-2xl font-bold text-tielo-navy mb-8">
                Daar kom ik in beeld.
              </p>
              <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-6">
                Ik zorg voor
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {services.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="flex items-center gap-4 bg-tielo-offwhite rounded-td p-4 border border-gray-100"
                  >
                    <div className="w-10 h-10 bg-tielo-orange/10 rounded-td flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-tielo-orange" />
                    </div>
                    <span className="text-tielo-navy font-medium">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-tielo-orange mt-1 flex-shrink-0" />
                <p className="text-lg text-tielo-navy/70 leading-relaxed">
                  Geen ingewikkelde trajecten.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-tielo-orange mt-1 flex-shrink-0" />
                <p className="text-lg text-tielo-navy/70 leading-relaxed">
                  Geen marketingpraat.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-tielo-orange mt-1 flex-shrink-0" />
                <p className="text-lg text-tielo-navy/70 leading-relaxed">
                  Gewoon duidelijkheid en resultaat.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-tielo-navy rounded-td p-8 sm:p-10 text-center"
            >
              <p className="text-white/90 text-lg leading-relaxed mb-2">
                We starten met een kort gesprek.
              </p>
              <p className="text-white font-bold text-xl">
                Binnen twee weken staat je website live.
              </p>
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
              Wil je bouwen aan je eigen online basis?
            </h2>
            <p className="text-lg mb-8 text-tielo-navy/60">
              Stuur mij een appje
            </p>
            <Link
              href="/contact"
              className="bg-tielo-orange hover:bg-[#d85515] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-td font-medium text-base sm:text-lg shadow-sm hover:shadow-sharp transition-all duration-200 active:scale-[0.98] min-h-[48px] touch-manipulation inline-flex items-center gap-2"
            >
              Neem contact op
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
