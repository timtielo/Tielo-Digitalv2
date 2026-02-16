import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Cpu, LayoutDashboard, Workflow, ArrowRight, Building2, Calculator, TrendingUp } from 'lucide-react';
import { Link } from '../components/Link';
import { SEO } from '../components/SEO';

const services = [
  { icon: Cpu, title: 'AI-implementatie', description: 'Slimme AI-tools integreren in je bestaande werkwijze' },
  { icon: Workflow, title: 'Automatisering', description: 'Make, API-koppelingen en CRM-integraties' },
  { icon: LayoutDashboard, title: 'Interne dashboards', description: 'Realtime inzicht in je bedrijfsdata' },
  { icon: TrendingUp, title: 'Workflow optimalisatie', description: 'Processen stroomlijnen en versnellen' },
];

const audiences = [
  { icon: Calculator, label: 'Accountants' },
  { icon: Building2, label: 'MKB-bedrijven' },
  { icon: TrendingUp, label: 'Groeiende organisaties' },
];

export function MaatwerkPage() {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Maatwerk AI & Automatisering | Tielo Digital"
        description="Slimmere processen, minder handwerk. AI-implementatie, automatisering en interne dashboards voor groeiende bedrijven."
        keywords={['Maatwerk AI', 'Automatisering', 'Make', 'API', 'CRM', 'Dashboard', 'Workflow']}
        canonical="https://www.tielo-digital.nl/diensten/maatwerk"
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
              Maatwerk
            </span>
            <p className="text-sm text-tielo-navy/50 mb-4">
              Dit is niet voor vaklui. Dit is voor bedrijven waar ik AI en automatisering op hoog niveau implementeer.
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-tielo-navy mb-6 tracking-tight leading-[1.15]">
              Slimmere processen.{' '}
              <span className="text-tielo-steel">Minder handwerk.</span>
            </h1>
          </motion.div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-3 block">
                Wat doe ik
              </span>
              <h2 className="text-3xl font-bold text-tielo-navy">
                Van analyse tot implementatie
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="td-card p-6 shadow-sharp"
                >
                  <div className="w-12 h-12 bg-tielo-teal/10 rounded-td flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-tielo-steel" />
                  </div>
                  <h3 className="text-lg font-semibold text-tielo-navy mb-2">{service.title}</h3>
                  <p className="text-tielo-navy/60 text-sm leading-relaxed">{service.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-tielo-navy relative overflow-hidden">
        <div className="absolute inset-0 td-striped opacity-30" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[10px] uppercase font-bold tracking-widest text-tielo-orange mb-3 block">
                Casus
              </span>
              <h2 className="text-3xl font-bold text-white mb-8">Batist</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white/90 mb-2">Probleem</h3>
                  <p className="text-white/70 leading-relaxed">Veel handmatig werk en repetitieve taken die tijd kosten en foutgevoelig zijn.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white/90 mb-2">Oplossing</h3>
                  <p className="text-white/70 leading-relaxed">Automatisering van workflows gecombineerd met AI-integratie voor slimmere dataverwerking.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white/90 mb-2">Resultaat</h3>
                  <p className="text-white/70 leading-relaxed">Significante tijdswinst en schaalbaarheid. Medewerkers kunnen zich richten op werk dat ertoe doet.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-tielo-offwhite relative">
        <div className="absolute inset-0 td-micro-grid opacity-30" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-3 block">
                Voor wie
              </span>
              <h2 className="text-3xl font-bold text-tielo-navy mb-10">
                Voor bedrijven die willen groeien
              </h2>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-6">
              {audiences.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="td-card px-6 py-4 shadow-sharp inline-flex items-center gap-3"
                >
                  <item.icon className="w-5 h-5 text-tielo-steel" />
                  <span className="font-medium text-tielo-navy">{item.label}</span>
                </motion.div>
              ))}
            </div>
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
              Bespreek jouw proces
            </h2>
            <p className="text-lg mb-8 text-tielo-navy/60">
              Vertel me over je huidige werkwijze en ik laat zien wat er mogelijk is
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
