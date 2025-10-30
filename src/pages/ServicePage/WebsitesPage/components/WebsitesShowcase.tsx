import React from 'react';
import { motion } from 'framer-motion';

const websites = [
  {
    name: 'Meer Impact Marketing',
    url: 'https://meerimpactmarketing.tielo-digital.nl',
    logo: '/assets/Meerimpactmarketinglogo.png'
  },
  {
    name: 'TG Ilde Gevelwerken',
    url: 'https://tgildegevelwerken.tielo-digital.nl/',
    logo: '/logo/tgildegevelwerkenlogo-transparant.svg'
  },
  {
    name: 'Praktijk Tielo',
    url: 'https://praktijk-tielo.nl/',
    logo: '/assets/Praktijk Tielo 169.svg'
  },
  {
    name: 'Her Horizon',
    url: 'https://herhorizonv4.tielo-digital.nl',
    logo: 'https://herhorizonv4.tielo-digital.nl/images/Logofulltrans.svg'
  },
  {
    name: 'MrClogged',
    url: 'https://www.mrclogged247.nl',
    logo: '/assets/mrclogged.jpg',
    nofollow: true
  }
];

export function WebsitesShowcase() {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-8 font-rubik">
          Websites die we hebben gebouwd
        </h2>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />
          
          {/* Scrolling container */}
          <div className="overflow-hidden whitespace-nowrap py-8">
            <motion.div
              animate={{
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
                  className="inline-block mx-12 hover:opacity-75 transition-all duration-300"
                >
                  <div className="h-24 flex items-center justify-center">
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
                  className="inline-block mx-12 hover:opacity-75 transition-all duration-300"
                >
                  <div className="h-24 flex items-center justify-center">
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
