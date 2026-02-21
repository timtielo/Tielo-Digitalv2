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

export function WebsitesShowcase() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section className="py-10 bg-white overflow-hidden border-y border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-5">
          <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 whitespace-nowrap">Onze klanten</span>
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400 whitespace-nowrap">{websites.length} websites gebouwd</span>
        </div>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div
            className="overflow-hidden whitespace-nowrap py-2"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            <motion.div
              animate={{ x: [-100, -2500] }}
              transition={{
                duration: isPaused ? 200 : 40,
                repeat: Infinity,
                ease: 'linear'
              }}
              className="inline-block"
            >
              {[...websites, ...websites].map((site, index) => (
                <a
                  key={index}
                  href={site.url}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="inline-block mx-5 hover:opacity-60 transition-opacity duration-200 touch-manipulation"
                >
                  <div className="h-12 flex items-center justify-center">
                    <img
                      src={site.logo}
                      alt={site.name}
                      className="h-full w-auto object-contain max-w-[120px]"
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
