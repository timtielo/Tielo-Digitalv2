import React from 'react';
import { motion } from 'framer-motion';
import { Wrench, Hammer, Zap, PaintBucket, HardHat, Building2 } from 'lucide-react';
import { Link } from '../Link';

const trades = [
  { icon: Wrench, label: 'Loodgieters', href: '/diensten/websites/loodgieter' },
  { icon: Building2, label: 'Aannemers', href: '/diensten/websites/aannemer' },
  { icon: Zap, label: 'Elektriciens', href: '/diensten/websites/elektricien' },
  { icon: PaintBucket, label: 'Schilders', href: '/diensten/websites/schilder' },
  { icon: HardHat, label: 'Metselaars', href: '/diensten/websites/metselaar' },
  { icon: Hammer, label: 'Klusbedrijven', href: '/diensten/websites/klusbedrijf' },
];

export function AgitateSection() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-3 block">
            Voor wie
          </span>
          <h2 className="text-3xl font-bold text-tielo-navy mb-4">
            Ik werk voor:
          </h2>
          <p className="text-tielo-navy/60 text-lg">
            Voor lokale vaklui.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
          {trades.map((trade, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <Link
                href={trade.href}
                className="td-card p-4 sm:p-5 shadow-sharp hover:shadow-sharp-hover transition-all duration-200 flex flex-col items-center gap-3 text-center group"
              >
                <div className="w-12 h-12 bg-tielo-orange/10 rounded-td flex items-center justify-center group-hover:bg-tielo-orange/20 transition-colors">
                  <trade.icon className="w-6 h-6 text-tielo-orange" />
                </div>
                <span className="font-medium text-tielo-navy text-sm">{trade.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
