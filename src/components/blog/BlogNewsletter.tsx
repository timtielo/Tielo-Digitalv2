import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { Link } from '../Link';

export function BlogCTA() {
  return (
    <section className="py-20 bg-tielo-navy relative overflow-hidden">
      <div className="absolute inset-0 td-striped opacity-10" />
      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase font-bold tracking-widest text-tielo-orange mb-3 block">
              Aan de slag
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-rubik text-white">
              Klaar om je bedrijf te laten groeien met AI en automation?
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Ontdek hoe wij jouw bedrijfsprocessen slimmer, sneller en efficiënter maken.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                label: 'Diensten',
                title: 'Onze oplossingen',
                description: 'Websites, AI-automatisering, klantenservice en meer.',
                href: '/diensten',
              },
              {
                label: 'Cases',
                title: 'Succesverhalen',
                description: 'Bekijk hoe wij andere bedrijven hebben geholpen groeien.',
                href: '/succesverhalen',
              },
              {
                label: 'Contact',
                title: 'Neem contact op',
                description: 'Bespreek de mogelijkheden voor jouw bedrijf.',
                href: '/contact',
              },
            ].map((item) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/5 border border-white/10 rounded-td p-6 hover:bg-white/10 transition-all group"
              >
                <Link href={item.href} className="block h-full">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-tielo-orange mb-2 block">
                    {item.label}
                  </span>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-tielo-orange transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-white/60 text-sm mb-4">{item.description}</p>
                  <span className="inline-flex items-center gap-2 text-tielo-orange font-medium text-sm group-hover:gap-3 transition-all">
                    Bekijk meer
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 bg-tielo-orange hover:bg-tielo-orange/90 text-white font-bold px-8 py-4 rounded-td transition-all hover:shadow-lg hover:shadow-tielo-orange/20"
            >
              <MessageSquare className="w-5 h-5" />
              Gratis gesprek inplannen
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}