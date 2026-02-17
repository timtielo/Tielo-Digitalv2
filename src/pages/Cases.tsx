import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from '../components/Link';
import { SEO } from '../components/SEO';

export function Cases() {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Cases | Tielo Digital"
        description="Bekijk onze cases. Van situatie tot resultaat - zo helpen we vakmensen en bedrijven."
        keywords={['Cases', 'Succesverhalen', 'Portfolio', 'Tielo Digital']}
        canonical="https://www.tielo-digital.nl/cases"
      />

      <section className="pt-28 sm:pt-32 pb-16 sm:pb-20 bg-tielo-offwhite relative overflow-hidden">
        <div className="absolute inset-0 td-micro-grid opacity-40" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-3 block">
              Cases
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-tielo-navy mb-6 tracking-tight leading-[1.15]">
              Resultaten die spreken
            </h1>
            <p className="text-lg text-tielo-navy/70 leading-relaxed">
              Per case: situatie, probleem, oplossing en resultaat.
            </p>
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
              className="td-card p-8 shadow-sharp"
            >
              <span className="text-[10px] uppercase font-bold tracking-widest text-tielo-orange mb-4 block">
                Case 1
              </span>
              <h2 className="text-2xl font-bold text-tielo-navy mb-6">Automatisering - Finance</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-tielo-navy mb-2">Situatie</h3>
                  <p className="text-tielo-navy/60 leading-relaxed">
                    Een bedrijf met honderden handmatige boekingen per maand vanuit een boekingssysteem naar een boekhoudsysteem.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-tielo-navy mb-2">Probleem</h3>
                  <p className="text-tielo-navy/60 leading-relaxed">
                    Honderden keren dezelfde handeling: copy-paste van het ene systeem naar het andere. Tijdrovend en foutgevoelig.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-tielo-navy mb-2">Oplossing</h3>
                  <p className="text-tielo-navy/60 leading-relaxed">
                    Een geautomatiseerde koppeling die betalingen automatisch factureert en inboekt.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-tielo-navy mb-2">Resultaat</h3>
                  <p className="text-tielo-navy/60 leading-relaxed">
                    Uren tijd bespaard per week. De investering was binnen korte tijd terugverdiend.
                  </p>
                </div>

                <div className="bg-tielo-offwhite rounded-td p-6 mt-6">
                  <p className="text-tielo-navy/70 italic mb-4 leading-relaxed">
                    "Tim zorgt ervoor dat doelen snel bereikt worden. De koppeling bespaart ons uren tijd en hiermee heeft Tim zich dubbel en dwars terugverdiend."
                  </p>
                  <div>
                    <p className="font-semibold text-tielo-navy text-sm">Quinten Grundmeijer</p>
                    <p className="text-tielo-navy/50 text-sm">Directeur bij Terrasboot</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 text-center text-tielo-navy/40"
            >
              <p className="text-lg">Meer cases volgen binnenkort.</p>
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
              Jouw verhaal hier?
            </h2>
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
