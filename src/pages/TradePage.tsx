import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { Link } from '../components/Link';
import { SEO } from '../components/SEO';
import { PricingCard } from '../components/common/PricingCard';

interface TradeFeature {
  text: string;
}

interface TradePageProps {
  trade: string;
  slug: string;
  heroTitle: string;
  heroDescription: string;
  features: TradeFeature[];
  closingLine: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
}

export function TradePage({
  trade,
  slug,
  heroTitle,
  heroDescription,
  features,
  closingLine,
  seoTitle,
  seoDescription,
  seoKeywords,
}: TradePageProps) {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        canonical={`https://www.tielo-digital.nl/diensten/websites/${slug}`}
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
              Websites voor {trade.toLowerCase()}s
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-tielo-navy mb-6 tracking-tight leading-[1.15]">
              {heroTitle}
            </h1>
            <p className="text-lg text-tielo-navy/70 leading-relaxed max-w-2xl">
              {heroDescription}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href="/contact"
                className="bg-tielo-orange hover:bg-[#d85515] text-white px-6 py-3 rounded-td font-medium shadow-sm hover:shadow-sharp transition-all duration-200 active:scale-[0.98] min-h-[48px] touch-manipulation inline-flex items-center gap-2 justify-center"
              >
                Plan een gesprek
                <ArrowRight className="w-5 h-5" />
              </Link>
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
                Wat ik regel
              </span>
              <h2 className="text-3xl font-bold text-tielo-navy">
                Ik zorg voor:
              </h2>
            </motion.div>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="flex items-start gap-4 p-4 rounded-td hover:bg-tielo-offwhite transition-colors"
                >
                  <div className="w-8 h-8 bg-tielo-orange/10 rounded-td flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-tielo-orange" />
                  </div>
                  <span className="text-tielo-navy/80 text-lg leading-relaxed">{feature.text}</span>
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-10 text-lg text-tielo-navy/70 leading-relaxed font-medium"
            >
              {closingLine}
            </motion.p>
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
              Plan een kort gesprek
            </h2>
            <p className="text-lg mb-8 text-tielo-navy/60">
              Vertel me over je bedrijf en ik laat zien wat ik voor je kan bouwen
            </p>
            <Link
              href="/contact"
              className="bg-tielo-orange hover:bg-[#d85515] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-td font-medium text-base sm:text-lg shadow-sm hover:shadow-sharp transition-all duration-200 active:scale-[0.98] min-h-[48px] touch-manipulation inline-flex items-center gap-2"
            >
              Start hier
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
