import React, { useState } from 'react';
import { motion } from 'framer-motion';

const websites = [
  {
    name: 'Meer Impact Marketing',
    url: 'https://www.meerimpactmarketing.nl',
    logo: '/assets/Meerimpactmarketinglogo.png',
    nofollow: true
  },
  {
    name: 'TG Ilde Gevelwerken',
    url: 'https://www.tgildegevelwerken.nl',
    logo: '/logo/tgildegevelwerkenlogo-transparant.svg',
    nofollow: true
  },
  {
    name: 'Praktijk Tielo',
    url: 'https://praktijk-tielo.nl',
    logo: '/assets/Praktijk Tielo 169.svg',
    nofollow: true
  },
  {
    name: 'Her Horizon',
    url: 'https://www.herhorizon.nl',
    logo: 'https://herhorizonv4.tielo-digital.nl/images/Logofulltrans.svg',
    nofollow: true
  },
  {
    name: 'MrClogged',
    url: 'https://www.mrclogged247.nl',
    logo: '/assets/mrclogged.jpg',
    nofollow: true
  },
  {
    name: 'I-Lizard',
    url: 'http://www.i-lizard.nl',
    logo: '/assets/Fulllogo.png',
    nofollow: true
  },
  {
    name: 'Allround Klusbedrijf Specht',
    url: 'https://www.spechtbouwt.nl',
    logo: '/assets/spechttrans.png',
    nofollow: true
  },
  {
    name: 'Bouw Kliniek',
    url: 'https://www.bouwkliniek.nl',
    logo: '/assets/bouwklinieklogo.png',
    nofollow: true
  }
];

export function WebsiteShowcase() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section className="py-16 sm:py-24 bg-tielo-offwhite overflow-hidden relative">
      <div className="absolute inset-0 td-micro-grid opacity-20" />
      <div className="container mx-auto px-4 sm:px-6 text-center relative">
        <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-3 block">
          Portfolio
        </span>
        <h2 className="text-3xl font-bold text-tielo-navy mb-8 sm:mb-10">
          Websites die we hebben gebouwd
        </h2>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-tielo-offwhite to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-tielo-offwhite to-transparent z-10 pointer-events-none" />

          <div
            className="overflow-hidden whitespace-nowrap py-6 sm:py-8 bg-white rounded-xl"
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <motion.div
              animate={{
                x: [-100, -2500],
              }}
              transition={{
                duration: isPaused ? 200 : 45,
                repeat: Infinity,
                ease: "linear"
              }}
              className="inline-block"
            >
              {websites.map((site, index) => (
                <a
                  key={index}
                  href={site.url}
                  target="_blank"
                  rel={site.nofollow ? "nofollow noopener noreferrer" : "noopener noreferrer"}
                  className="inline-block mx-4 sm:mx-6 hover:opacity-75 transition-all duration-200 touch-manipulation"
                >
                  <div className="h-16 sm:h-24 flex items-center justify-center">
                    <img
                      src={site.logo}
                      alt={site.name}
                      className="h-full w-auto object-contain"
                    />
                  </div>
                </a>
              ))}
              {websites.map((site, index) => (
                <a
                  key={`duplicate-${index}`}
                  href={site.url}
                  target="_blank"
                  rel={site.nofollow ? "nofollow noopener noreferrer" : "noopener noreferrer"}
                  className="inline-block mx-4 sm:mx-6 hover:opacity-75 transition-all duration-200 touch-manipulation"
                >
                  <div className="h-16 sm:h-24 flex items-center justify-center">
                    <img
                      src={site.logo}
                      alt={site.name}
                      className="h-full w-auto object-contain"
                    />
                  </div>
                </a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
