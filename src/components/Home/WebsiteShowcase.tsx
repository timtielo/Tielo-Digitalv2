import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const websites = [
  {
    name: 'Terrasboot',
    url: 'https://terrasboot.nl',
    description: 'Boekingssysteem & Website'
  },
  {
    name: 'Sloepverhuur Amsterdam',
    url: 'https://sloepverhuuramsterdam.com',
    description: 'Boekingssysteem & Website'
  },
  {
    name: 'Bootje Huren Amsterdam',
    url: 'https://bootjehuurenamsterdam.nl',
    description: 'Boekingssysteem & Website'
  }
];

export function WebsiteShowcase() {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4 font-rubik">
            Websites die we hebben gebouwd
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Bekijk enkele van onze recente projecten
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="grid gap-6">
            {websites.map((website, index) => (
              <motion.a
                key={website.url}
                href={website.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-xl p-6 flex items-center justify-between
                         border-2 border-transparent hover:border-blue-600
                         shadow-[0_2px_10px_rgba(0,0,0,0.06)] 
                         hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]
                         transform hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  <h3 className="text-xl font-semibold mb-1 group-hover:text-blue-600 transition-colors">
                    {website.name}
                  </h3>
                  <p className="text-gray-600">{website.description}</p>
                </div>
                <ExternalLink className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}