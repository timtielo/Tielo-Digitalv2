import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const GOOGLE_REVIEWS_URL = 'https://www.google.com/search?sa=X&sca_esv=f2a3ab287e621a42&biw=1710&bih=862&sxsrf=ANbL-n77AWrooKCSmFta4IKSSxntHiUdUg:1771270283560&q=Tielo+Digital+Reviews&rflfq=1&num=20&stick=H4sIAAAAAAAAAONgkxI2MzO2MDMzNzE2NTczNDY3MrC03MDI-IpRNCQzNSdfwSUzPbMkMUchKLUsM7W8eBErdnEAia9Gd0oAAAA&rldimm=6638667435761372099&tbm=lcl&hl=en-NL&ved=2ahUKEwjS6rWA4N6SAxUW1QIHHbqIKQIQ9fQKegQIUhAG#lkt=LocalPoiReviews';

export function Testimonials() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.a
          href={GOOGLE_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="td-card p-8 sm:p-10 shadow-sharp max-w-md mx-auto flex flex-col items-center gap-4 group hover:shadow-lg transition-shadow duration-300 cursor-pointer"
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
    </section>
  );
}
