import React from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Workflow,
  LayoutDashboard,
  ArrowRight,
  Calculator,
  Building2,
  TrendingUp,
  Clock,
  Mail,
  Users,
  Database,
  GitMerge,
  Search,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Link } from '../components/Link';
import { SEO } from '../components/SEO';

const painPoints = [
  { icon: Clock, text: 'Je team doet veel handmatig werk' },
  { icon: Users, text: 'Meetings kosten tijd om uit te werken' },
  { icon: Mail, text: 'Onboarding gaat via losse mails' },
  { icon: Database, text: 'Informatie raakt versnipperd' },
  { icon: GitMerge, text: 'Processen zijn afhankelijk van mensen, niet van systemen' },
];

const aiExamples = [
  'Meetings automatisch opnemen en samenvatten',
  'Documenten automatisch analyseren',
  'Interne kennis makkelijk doorzoekbaar maken',
  'AI die helpt bij e-mails of klantcommunicatie',
];

const automationExamples = [
  'Onboarding via een vast portaal',
  'Automatische workflows tussen systemen',
  'Minder copy-paste',
  'Minder menselijke fouten',
];

const dashboardItems = [
  'Waar klanten in het proces zitten',
  'Wat nog openstaat',
  'Hoe je team presteert',
  'Waar vertraging ontstaat',
];

const results = [
  { value: '1–2 uur', label: 'bespaard per meeting' },
  { value: '±20%', label: 'tijdswinst op e-mail' },
  { value: '100%', label: 'gestructureerde onboarding' },
];

const audiences = [
  { icon: Calculator, label: 'Accountants- en administratiekantoren', fits: true },
  { icon: Building2, label: 'MKB-bedrijven met meerdere medewerkers', fits: true },
  { icon: TrendingUp, label: 'Organisaties die willen groeien zonder chaos', fits: true },
  { icon: Search, label: 'Bedrijven die "gewoon wat tools willen proberen"', fits: false },
];

export function MaatwerkPage() {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Maatwerk AI & Automatisering | Tielo Digital"
        description="Voor bedrijven met medewerkers, processen en groeiambitie. AI-implementatie, automatisering en dashboards die echt werken."
        keywords={['Maatwerk AI', 'Automatisering', 'Make', 'API', 'CRM', 'Dashboard', 'Workflow', 'MKB']}
        canonical="https://www.tielo-digital.nl/diensten/maatwerk"
      />

      {/* Hero */}
      <section className="pt-28 sm:pt-36 pb-20 sm:pb-28 bg-tielo-navy relative overflow-hidden">
        <div className="absolute inset-0 td-micro-grid opacity-20" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-tielo-teal/30 to-transparent" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-tielo-orange mb-5 border border-tielo-orange/30 px-3 py-1.5 rounded-td">
              Maatwerk
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-[1.1]">
              Maatwerk AI &{' '}
              <span className="text-tielo-teal">Automatisering</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/60 leading-relaxed max-w-2xl">
              Dit is voor bedrijven met medewerkers, processen en groeiambitie.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-20 sm:py-28 bg-tielo-offwhite relative overflow-hidden">
        <div className="absolute inset-0 td-micro-grid opacity-30" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-3 block">
                Herkenbaar?
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-tielo-navy">
                Je groeit, maar je structuur groeit niet mee.
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {painPoints.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="bg-white border border-gray-200 rounded-td p-5 flex items-start gap-4 shadow-sm"
                >
                  <div className="w-9 h-9 bg-tielo-steel/10 rounded-td flex items-center justify-center flex-shrink-0 mt-0.5">
                    <item.icon className="w-4 h-4 text-tielo-steel" />
                  </div>
                  <p className="text-tielo-navy/80 text-sm leading-relaxed font-medium">{item.text}</p>
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-10 text-tielo-navy/50 text-base"
            >
              Daar help ik bij.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Process intro */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-3 block">
                Wat ik voor je doe
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-tielo-navy mb-4">
                Ik kijk eerst hoe jullie nu werken.
              </h2>
              <p className="text-tielo-navy/60 text-lg leading-relaxed max-w-2xl">
                Waar lekt tijd? Waar ontstaan fouten? Wat gebeurt er dubbel? Daarna bouwen we het slimmer.
              </p>
            </motion.div>

            {/* Three pillars */}
            <div className="space-y-8">

              {/* AI */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid md:grid-cols-5 gap-0 border border-gray-200 rounded-td overflow-hidden shadow-sm"
              >
                <div className="md:col-span-2 bg-tielo-navy p-8 flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 bg-tielo-teal/20 rounded-td flex items-center justify-center mb-5">
                      <Brain className="w-6 h-6 text-tielo-teal" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">AI slim inzetten</h3>
                    <p className="text-white/50 text-sm leading-relaxed">Geen hype. Gewoon praktisch.</p>
                  </div>
                  <p className="text-tielo-teal/70 text-xs font-semibold uppercase tracking-widest mt-6">
                    Geintegreerd in jullie werkwijze
                  </p>
                </div>
                <div className="md:col-span-3 bg-white p-8">
                  <p className="text-tielo-navy/50 text-xs uppercase tracking-widest font-semibold mb-4">Bijvoorbeeld</p>
                  <ul className="space-y-3">
                    {aiExamples.map((example, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-tielo-teal flex-shrink-0 mt-0.5" />
                        <span className="text-tielo-navy/80 text-sm leading-relaxed">{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* Automatisering */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="grid md:grid-cols-5 gap-0 border border-gray-200 rounded-td overflow-hidden shadow-sm"
              >
                <div className="md:col-span-2 bg-tielo-steel p-8 flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 bg-white/20 rounded-td flex items-center justify-center mb-5">
                      <Workflow className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Automatisering van processen</h3>
                    <p className="text-white/60 text-sm leading-relaxed">
                      Met Make, API-koppelingen en CRM-integraties zorg ik dat systemen met elkaar praten.
                    </p>
                  </div>
                  <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mt-6">
                    Handmatig werk wordt systeemwerk
                  </p>
                </div>
                <div className="md:col-span-3 bg-white p-8">
                  <p className="text-tielo-navy/50 text-xs uppercase tracking-widest font-semibold mb-4">Bijvoorbeeld</p>
                  <ul className="space-y-3">
                    {automationExamples.map((example, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-tielo-teal flex-shrink-0 mt-0.5" />
                        <span className="text-tielo-navy/80 text-sm leading-relaxed">{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* Dashboards */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="grid md:grid-cols-5 gap-0 border border-gray-200 rounded-td overflow-hidden shadow-sm"
              >
                <div className="md:col-span-2 bg-tielo-teal p-8 flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 bg-white/20 rounded-td flex items-center justify-center mb-5">
                      <LayoutDashboard className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Dashboards en overzicht</h3>
                    <p className="text-white/60 text-sm leading-relaxed">
                      Beslissingen op basis van inzicht.
                    </p>
                  </div>
                  <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mt-6">
                    Realtime inzicht
                  </p>
                </div>
                <div className="md:col-span-3 bg-white p-8">
                  <p className="text-tielo-navy/50 text-xs uppercase tracking-widest font-semibold mb-4">Je ziet realtime</p>
                  <ul className="space-y-3">
                    {dashboardItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-tielo-teal flex-shrink-0 mt-0.5" />
                        <span className="text-tielo-navy/80 text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      {/* Case study */}
      <section className="py-20 sm:py-28 bg-tielo-navy relative overflow-hidden">
        <div className="absolute inset-0 td-striped opacity-20" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <span className="text-[10px] uppercase font-bold tracking-widest text-tielo-orange mb-3 block">
                Resultaten in de praktijk
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Batist Administratieve Dienstverlening
              </h2>
              <p className="text-white/50 mt-2 text-sm">5–10 FTE, 300+ klanten</p>
            </motion.div>

            <div className="grid sm:grid-cols-3 gap-px bg-white/10 rounded-td overflow-hidden mb-10">
              {results.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-tielo-navy p-8 text-center"
                >
                  <div className="text-3xl sm:text-4xl font-bold text-tielo-teal mb-2">{result.value}</div>
                  <div className="text-white/50 text-sm">{result.label}</div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid sm:grid-cols-3 gap-6"
            >
              {[
                { label: 'Situatie', text: 'Veel handmatig werk, meetings zonder uitwerking, onboarding via losse mails.' },
                { label: 'Aanpak', text: 'AI voor meeting-transcriptie en samenvatting. Automatische onboarding flow. Koppelingen tussen systemen.' },
                { label: 'Resultaat', text: 'Minder fouten, meer rust in het team. Processen draaien op het systeem, niet op mensen.' },
              ].map((block, index) => (
                <div key={index} className="border border-white/10 rounded-td p-6">
                  <p className="text-tielo-orange text-xs font-bold uppercase tracking-widest mb-3">{block.label}</p>
                  <p className="text-white/70 text-sm leading-relaxed">{block.text}</p>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <Link
                href="/succesverhalen"
                className="inline-flex items-center gap-2 text-tielo-teal hover:text-white text-sm font-medium transition-colors duration-200"
              >
                Bekijk de volledige case
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* For who */}
      <section className="py-20 sm:py-28 bg-tielo-offwhite relative overflow-hidden">
        <div className="absolute inset-0 td-micro-grid opacity-30" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-3 block">
                Voor wie
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-tielo-navy">
                Voor wie dit geschikt is
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-4">
              {audiences.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className={`bg-white border rounded-td p-5 flex items-start gap-4 shadow-sm ${
                    item.fits ? 'border-gray-200' : 'border-gray-200 opacity-60'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-td flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    item.fits ? 'bg-tielo-teal/10' : 'bg-gray-100'
                  }`}>
                    {item.fits
                      ? <CheckCircle2 className="w-4 h-4 text-tielo-teal" />
                      : <XCircle className="w-4 h-4 text-gray-400" />
                    }
                  </div>
                  <p className={`text-sm leading-relaxed font-medium ${
                    item.fits ? 'text-tielo-navy/80' : 'text-tielo-navy/40 line-through'
                  }`}>
                    {item.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 bg-white relative overflow-hidden">
        <div className="absolute inset-0 td-striped opacity-30" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-4 block">
              Bespreek jouw situatie
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-tielo-navy mb-4 leading-tight">
              Vertel me hoe jullie nu werken.
            </h2>
            <p className="text-tielo-navy/60 text-lg mb-8 leading-relaxed">
              Ik laat zien waar winst te behalen is. Plan een gesprek.
            </p>
            <Link
              href="/contact"
              className="bg-tielo-orange hover:bg-[#d85515] text-white px-8 py-4 rounded-td font-medium text-base shadow-sm hover:shadow-sharp transition-all duration-200 active:scale-[0.98] inline-flex items-center gap-2"
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
