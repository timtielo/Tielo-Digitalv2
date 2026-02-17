import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Brain, ArrowRight } from 'lucide-react';
import { Link } from '../components/Link';
import { SEO } from '../components/SEO';

export function Diensten() {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Diensten - Websites & Maatwerk | Tielo Digital"
        description="Ik doe twee dingen: websites voor vakmensen en maatwerk AI & automatisering voor groeiende bedrijven."
        keywords={['Diensten', 'Websites vakmensen', 'Maatwerk automatisering', 'AI implementatie']}
        canonical="https://www.tielo-digital.nl/diensten"
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
              Diensten
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-tielo-navy mb-6 tracking-tight leading-[1.15]">
              Ik doe twee dingen
            </h1>
            <p className="text-lg text-tielo-navy/70 leading-relaxed max-w-2xl mx-auto">
              Websites voor vakmensen (mijn focus) en maatwerk AI & automatisering voor groeiende bedrijven.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="td-card p-8 sm:p-10 shadow-sharp hover:shadow-sharp-hover transition-all duration-200 flex flex-col"
            >
              <div className="w-14 h-14 bg-tielo-orange/10 rounded-td flex items-center justify-center mb-6">
                <Globe className="w-7 h-7 text-tielo-orange" />
              </div>
              <h2 className="text-2xl font-bold text-tielo-navy mb-4">Websites voor vaklui</h2>
              <ul className="space-y-3 text-tielo-navy/70 mb-8 flex-1">
                <li className="flex gap-2">
                  <span className="text-tielo-orange font-bold">-</span>
                  Meer controle over je klanten
                </li>
                <li className="flex gap-2">
                  <span className="text-tielo-orange font-bold">-</span>
                  Meer aanvragen via Google
                </li>
                <li className="flex gap-2">
                  <span className="text-tielo-orange font-bold">-</span>
                  Minder afhankelijkheid van Werkspot
                </li>
              </ul>
              <Link
                href="/diensten/websites"
                className="bg-tielo-orange hover:bg-[#d85515] text-white px-6 py-3 rounded-td font-medium shadow-sm hover:shadow-sharp transition-all duration-200 active:scale-[0.98] min-h-[48px] touch-manipulation inline-flex items-center gap-2 justify-center"
              >
                Bekijk dienst
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="td-card p-8 sm:p-10 shadow-sharp hover:shadow-sharp-hover transition-all duration-200 flex flex-col"
            >
              <div className="w-14 h-14 bg-tielo-teal/10 rounded-td flex items-center justify-center mb-6">
                <Brain className="w-7 h-7 text-tielo-steel" />
              </div>
              <h2 className="text-2xl font-bold text-tielo-navy mb-4">Maatwerk & automatisering</h2>
              <ul className="space-y-3 text-tielo-navy/70 mb-8 flex-1">
                <li className="flex gap-2">
                  <span className="text-tielo-steel font-bold">-</span>
                  Processen slimmer maken
                </li>
                <li className="flex gap-2">
                  <span className="text-tielo-steel font-bold">-</span>
                  Tijd besparen met automatisering
                </li>
                <li className="flex gap-2">
                  <span className="text-tielo-steel font-bold">-</span>
                  Schaalbaar bouwen met AI
                </li>
              </ul>
              <Link
                href="/diensten/maatwerk"
                className="bg-tielo-steel hover:bg-tielo-navy text-white px-6 py-3 rounded-td font-medium shadow-sm hover:shadow-sharp transition-all duration-200 active:scale-[0.98] min-h-[48px] touch-manipulation inline-flex items-center gap-2 justify-center"
              >
                Bekijk maatwerk
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
