import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Clock, Mail, FileText, Layers } from 'lucide-react';
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
              <h2 className="text-2xl font-bold text-tielo-navy mb-1">AI & Automatisering – Accountancy</h2>
              <p className="text-tielo-navy/50 text-sm mb-8">Batist Administratieve Dienstverlening · 5–10 FTE · 300+ klanten</p>

              {/* Situatie */}
              <div className="mb-8">
                <h3 className="font-semibold text-tielo-navy mb-3">Situatie</h3>
                <p className="text-tielo-navy/60 leading-relaxed">
                  Batist Administratieve Dienstverlening is een administratiekantoor met 5–10 FTE en meer dan 300 klanten. Dagelijks vinden er gemiddeld 2 klantmeetings plaats. Daarnaast worden maandelijks circa 10 onboardingtrajecten gestart (bijvoorbeeld eenmanszaak → BV). Tim is hier 1–2 dagen per week fysiek aanwezig op kantoor als AI- en automatiseringsspecialist.
                </p>
              </div>

              {/* Probleem */}
              <div className="mb-8">
                <h3 className="font-semibold text-tielo-navy mb-4">Probleem</h3>
                <div className="space-y-4">
                  {[
                    {
                      icon: Clock,
                      title: 'Vergaderingen',
                      items: [
                        'Klantgesprekken werden handmatig uitgewerkt',
                        'Notities waren afhankelijk van wie ze maakte',
                        'Informatie ging soms verloren',
                        'Uitwerking kostte gemiddeld 1–2 uur per meeting',
                      ],
                    },
                    {
                      icon: Mail,
                      title: 'Interne communicatie & e-mail',
                      items: [
                        'Veel repetitieve handelingen in e-mails',
                        'Steeds opnieuw dezelfde uitleg, instructies en procedures typen',
                        'Tijdverlies en inconsistentie in communicatie',
                      ],
                    },
                    {
                      icon: FileText,
                      title: 'Onboarding nieuwe klanten',
                      items: [
                        'Documenten werden via losse e-mails opgevraagd',
                        'Meerdere mails over en weer',
                        'Onvolledige dossiers',
                        'Geen vaste structuur of workflow',
                      ],
                    },
                  ].map((block, i) => (
                    <div key={i} className="bg-tielo-offwhite rounded-td p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <block.icon className="w-4 h-4 text-tielo-steel" />
                        <p className="font-semibold text-tielo-navy text-sm">{block.title}</p>
                      </div>
                      <ul className="space-y-1.5">
                        {block.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-tielo-navy/60">
                            <span className="w-1 h-1 rounded-full bg-tielo-navy/30 flex-shrink-0 mt-2" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {['Onnodig tijdverlies', 'Frictie bij klanten', 'Geen schaalbare structuur'].map((tag, i) => (
                    <span key={i} className="text-xs font-medium bg-red-50 text-red-600 border border-red-100 px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Oplossing */}
              <div className="mb-8">
                <h3 className="font-semibold text-tielo-navy mb-4">Oplossing</h3>
                <div className="space-y-4">
                  {[
                    {
                      icon: Layers,
                      number: '1',
                      title: 'Automatische meeting-opnames + AI-transcriptie',
                      items: [
                        'Alle klantmeetings worden standaard opgenomen',
                        'Automatische transcriptie en samenvatting via AI',
                        'Direct bruikbare actiepunten',
                      ],
                      result: 'Vrijwel geen uitwerktijd meer. Alleen nog verwerking van daadwerkelijke acties.',
                    },
                    {
                      icon: Mail,
                      number: '2',
                      title: 'TextExpander & slimme templates',
                      items: [
                        'Gestandaardiseerde snelkoppelingen voor interne en externe communicatie',
                        'Templates voor veelvoorkomende vragen en processen',
                      ],
                      result: 'Minimaal 20% tijdswinst op e-mailverkeer.',
                    },
                    {
                      icon: FileText,
                      number: '3',
                      title: 'Custom onboarding-portaal (zelf ontwikkeld)',
                      items: [
                        'Klanten krijgen toegang tot een persoonlijk portaal',
                        'Checklist per type traject (bijv. ZZP → BV)',
                        'Uploadfunctie met naam + omschrijving per document',
                        'Admin kan alles centraal downloaden en beheren',
                        'Standaardprocedures ingebouwd in de flow',
                      ],
                      result: 'Geen ontbrekende documenten meer. Minder mailverkeer. Strakkere interne structuur. Betere klantbeleving.',
                    },
                  ].map((block, i) => (
                    <div key={i} className="border border-gray-200 rounded-td overflow-hidden">
                      <div className="flex items-start gap-4 p-5">
                        <div className="w-7 h-7 bg-tielo-navy rounded-td flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">{block.number}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-tielo-navy text-sm mb-3">{block.title}</p>
                          <ul className="space-y-1.5 mb-4">
                            {block.items.map((item, j) => (
                              <li key={j} className="flex items-start gap-2 text-sm text-tielo-navy/60">
                                <CheckCircle2 className="w-3.5 h-3.5 text-tielo-teal flex-shrink-0 mt-0.5" />
                                {item}
                              </li>
                            ))}
                          </ul>
                          <div className="bg-tielo-teal/10 rounded-td px-4 py-2.5">
                            <p className="text-xs font-semibold text-tielo-teal uppercase tracking-widest mb-0.5">Resultaat</p>
                            <p className="text-sm text-tielo-navy/70">{block.result}</p>
                          </div>
                        </div>
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
                    { value: '1–2 uur', label: 'besparing per meeting' },
                    { value: '±20%', label: 'tijdwinst op e-mail' },
                    { value: '10×/mnd', label: 'onboardings via portaal' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-tielo-navy rounded-td p-5 text-center">
                      <p className="text-2xl font-bold text-tielo-teal mb-1">{stat.value}</p>
                      <p className="text-white/50 text-xs">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <ul className="space-y-2">
                  {[
                    '2 klantmeetings per dag vrijwel zonder uitwerktijd',
                    'Gestandaardiseerde onboarding',
                    'Minder fouten en minder overdrachtsverlies',
                    'Volledig door Tim ontwikkelde software-oplossing',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-tielo-navy/60">
                      <CheckCircle2 className="w-4 h-4 text-tielo-teal flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-tielo-navy/50 text-sm italic">
                  De vrijgekomen tijd wordt ingezet voor advies en groei in plaats van administratie.
                </p>
              </div>

              {/* Vervolg */}
              <div className="bg-tielo-offwhite rounded-td p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-tielo-orange mb-3">In ontwikkeling</p>
                <ul className="space-y-1.5">
                  {[
                    'AI-training voor medewerkers (LLM-gebruik in praktijk)',
                    'Structuur voor een aanvullend verdienmodel binnen het kantoor',
                    'Verdere optimalisatie van interne processen',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-tielo-navy/60">
                      <span className="w-1 h-1 rounded-full bg-tielo-orange/60 flex-shrink-0 mt-2" />
                      {item}
                    </li>
                  ))}
                </ul>
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
