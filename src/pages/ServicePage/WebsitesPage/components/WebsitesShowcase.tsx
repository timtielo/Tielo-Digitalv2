import React from 'react';
import { motion } from 'framer-motion';

const websites = [
  {
    name: 'Meer Impact Marketing',
    url: 'https://meerimpactmarketing.tielo-digital.nl',
    logo: '/logo/MIM 169 svg trans.svg'
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
                x: [-100, -800], // Adjusted for single logo
              }}
              transition={{
                duration: 20,
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
                  rel="noopener noreferrer"
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
            
            {/* Duplicate for seamless loop */}
            <motion.div
              animate={{
                x: [800, 100], // Adjusted for single logo
              }}
              transition={{
                duration: 20,
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
                  rel="noopener noreferrer"
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