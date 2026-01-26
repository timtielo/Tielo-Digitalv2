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
    name: 'Allround Klusbedrijf Specht'',
    url: 'hhttps://www.spechtbouwt.nl',
    logo: '/assets/spechttrans.png',
    nofollow: true
  }
];

export function WebsiteShowcase() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section className="py-16 sm:py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 font-rubik">
          Websites die we hebben gebouwd
        </h2>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          
          {/* Scrolling container */}
          <div
            className="overflow-hidden whitespace-nowrap py-6 sm:py-8"
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <motion.div
              animate={isPaused ? {} : {
                x: [-100, -2200],
              }}
              transition={{
                duration: 40,
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
                  className="inline-block mx-4 sm:mx-6 hover:opacity-75 transition-all duration-300 touch-manipulation"
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
              {/* Duplicate for seamless loop */}
              {websites.map((site, index) => (
                <a
                  key={`duplicate-${index}`}
                  href={site.url}
                  target="_blank"
                  rel={site.nofollow ? "nofollow noopener noreferrer" : "noopener noreferrer"}
                  className="inline-block mx-4 sm:mx-6 hover:opacity-75 transition-all duration-300 touch-manipulation"
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