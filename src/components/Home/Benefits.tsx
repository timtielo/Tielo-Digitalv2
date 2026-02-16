import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Hammer, Check, Star } from 'lucide-react';
import { WhatsAppButton } from '../common/WhatsAppButton';

const GOOGLE_REVIEWS_URL = 'https://www.google.com/search?sa=X&sca_esv=f2a3ab287e621a42&biw=1710&bih=862&sxsrf=ANbL-n77AWrooKCSmFta4IKSSxntHiUdUg:1771270283560&q=Tielo+Digital+Reviews&rflfq=1&num=20&stick=H4sIAAAAAAAAAONgkxI2MzO2MDMzNzE2NTczNDY3MrC03MDI-IpRNCQzNSdfwSUzPbMkMUchKLUsM7W8eBErdnEAia9Gd0oAAAA&rldimm=6638667435761372099&tbm=lcl&hl=en-NL&ved=2ahUKEwjS6rWA4N6SAxUW1QIHHbqIKQIQ9fQKegQIUhAG#lkt=LocalPoiReviews';

const steps = [
  { number: '1', title: 'Aanbetaling & intake gesprek', icon: CreditCard },
  { number: '2', title: 'Ik bouw, jij geeft feedback', icon: Hammer },
  { number: '3', title: 'Website live & factuur', icon: Check },
];

export function Benefits() {
  return (
    <section className="py-16 sm:py-24 bg-tielo-navy relative overflow-hidden">
      <div className="absolute inset-0 td-striped opacity-30" />
      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-[10px] uppercase font-bold tracking-widest text-tielo-orange mb-3 block">
            Stappenplan
          </span>
          <h2 className="text-3xl font-bold text-white mb-4">
            Hoe werkt het?
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-4">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-td p-4 border border-white/10"
              >
                <div className="w-10 h-10 bg-tielo-orange rounded-td flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">{step.number}</span>
                </div>
                <span className="text-white/90 font-medium">{step.title}</span>
              </motion.div>
            ))}
          </div>

          <motion.a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="td-card p-8 sm:p-10 shadow-sharp max-w-sm mx-auto lg:mx-auto flex flex-col items-center gap-4 group hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-8 h-8"
              aria-hidden="true"
            >
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>

            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} fill="currentColor" className="w-5 h-5 text-yellow-400" />
              ))}
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold text-tielo-navy">5.0</p>
              <p className="text-sm text-tielo-navy/60 mt-1">
                13 reviews op Google
              </p>
            </div>

            <span className="text-xs font-medium text-tielo-orange group-hover:underline mt-1">
              Bekijk reviews
            </span>
          </motion.a>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <WhatsAppButton className="bg-white text-tielo-navy border-2 border-white hover:bg-tielo-orange hover:text-white hover:border-tielo-orange" />
        </motion.div>
      </div>
    </section>
  );
}
