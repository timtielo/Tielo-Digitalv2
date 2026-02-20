import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
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

            {/* Case 2 */}
            <motion.div
              id="case-batist"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 td-card p-8 shadow-sharp"
            >
              <span className="text-[10px] uppercase font-bold tracking-widest text-tielo-orange mb-4 block">
                Case 2
              </span>
              <h2 className="text-2xl font-bold text-tielo-navy mb-1">Batist Administratieve Dienstverlening</h2>
              <p className="text-tielo-navy/40 text-sm mt-4 italic">Binnenkort meer</p>
            </motion.div>

            {/* Case 3 */}
            <motion.div
              id="case-gilde"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 td-card p-8 shadow-sharp"
            >
              <span className="text-[10px] uppercase font-bold tracking-widest text-tielo-orange mb-4 block">
                Case 3
              </span>
              <h2 className="text-2xl font-bold text-tielo-navy mb-1">Website & Leadgeneratie – 't Gilde Gevelwerken</h2>
              <p className="text-tielo-navy/50 text-sm mb-8">Zelfstandig gevelspecialist · Gevelreiniging & -renovatie</p>

              {/* Situatie */}
              <div className="mb-8">
                <h3 className="font-semibold text-tielo-navy mb-3">Situatie</h3>
                <p className="text-tielo-navy/60 leading-relaxed">
                  Job van 't Gilde Gevelwerken werkte via Werkspot. Er was geen eigen website — en dus geen centrale plek waar grotere opdrachtgevers zijn werk konden bekijken.
                </p>
              </div>

              {/* Probleem */}
              <div className="mb-8">
                <h3 className="font-semibold text-tielo-navy mb-4">Probleem</h3>
                <div className="bg-tielo-offwhite rounded-td p-5 space-y-2">
                  {[
                    'Volledig afhankelijk van Werkspot',
                    'Geen directe aanvragen via eigen kanaal',
                    'Moeilijker om grotere partijen (zoals VvE\'s) te overtuigen',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-tielo-navy/60">
                      <span className="w-1 h-1 rounded-full bg-tielo-navy/30 flex-shrink-0 mt-2" />
                      {item}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {['Platform-afhankelijkheid', 'Geen eigen kanaal', 'Moeilijk schaalbaar'].map((tag, i) => (
                    <span key={i} className="text-xs font-medium bg-red-50 text-red-600 border border-red-100 px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Oplossing */}
              <div className="mb-8">
                <h3 className="font-semibold text-tielo-navy mb-4">Oplossing</h3>
                <div className="space-y-3">
                  {[
                    { number: '1', title: 'Professionele website binnen enkele dagen', desc: 'Snel gebouwd, direct online — geen lang traject.' },
                    { number: '2', title: 'Portfolio-structuur die Job zelf bijwerkt', desc: 'Eenvoudig beheer, zodat nieuwe klussen direct zichtbaar zijn.' },
                    { number: '3', title: 'Snelle communicatie & directe aanpassingen', desc: 'Kort lijntje en geen gedoe — aanpassingen doorvoeren wanneer nodig.' },
                  ].map((block, i) => (
                    <div key={i} className="border border-gray-200 rounded-td p-5 flex items-start gap-4">
                      <div className="w-7 h-7 bg-tielo-navy rounded-td flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">{block.number}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-tielo-navy text-sm mb-1">{block.title}</p>
                        <p className="text-sm text-tielo-navy/60">{block.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resultaat */}
              <div className="mb-8">
                <h3 className="font-semibold text-tielo-navy mb-4">Resultaat</h3>
                <div className="grid sm:grid-cols-3 gap-3 mb-5">
                  {[
                    { value: '1 maand', label: 'terugverdiend' },
                    { value: '2 VvE\'s', label: 'aanvragen binnen maand' },
                    { value: '>€10.000', label: 'per opdracht' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-tielo-navy rounded-td p-5 text-center">
                      <p className="text-2xl font-bold text-tielo-teal mb-1">{stat.value}</p>
                      <p className="text-white/50 text-xs">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-tielo-navy/60 text-sm leading-relaxed">
                  Van 100% afhankelijk van Werkspot naar directe aanvragen via eigen kanaal. De website was binnen één maand volledig terugverdiend.
                </p>
              </div>

              {/* Review */}
              <div className="bg-tielo-offwhite rounded-td p-6">
                <p className="text-tielo-navy/70 italic mb-4 leading-relaxed">
                  "Tim heeft in enkele dagen een mooie website voor mij gebouwd. De communicatie was helder en enkele aanpassingen waren snel gedaan. Ik kan zelf makkelijk mijn portfolio bijwerken. Daarnaast heeft hij mij geholpen met de DNS instellingen en het logo. De prijs was ook prima. Kortom, snelle en zorgeloze ervaring, dikke aanrader."
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src="/assets/tgildegevelwerkenlogo-transparant.svg"
                    alt="'t Gilde Gevelwerken"
                    className="h-8 w-auto opacity-70"
                  />
                  <div>
                    <p className="font-semibold text-tielo-navy text-sm">Job 't Gilde</p>
                    <p className="text-tielo-navy/50 text-sm">'t Gilde Gevelwerken</p>
                  </div>
                </div>
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
