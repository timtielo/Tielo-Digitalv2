import React from 'react';
import { motion } from 'framer-motion';
import { Globe, BarChart, RefreshCw, Plug } from 'lucide-react';

const extras = [
  {
    icon: Globe,
    title: 'Hosting & DNS',
    description: 'Volledig ontzorgd. Nooit meer gedoe met je DNS settings',
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    icon: BarChart,
    title: 'Analytics Dashboard',
    description: 'Dashboard waarin je de traffic op jouw website ziet, en waar ze vandaan komen',
    gradient: 'from-green-500 to-green-600'
  },
  {
    icon: RefreshCw,
    title: 'Wekelijkse Updates',
    description: 'Wekelijkse updates over jouw website',
    gradient: 'from-purple-500 to-purple-600'
  },
  {
    icon: Plug,
    title: 'Systeem Integraties',
    description: 'Integratie met systemen als Mailchimp, email, Hubspot etc.',
    gradient: 'from-orange-500 to-orange-600'
  }
];

export function WebsitesExtras() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 font-rubik">
              Wat Je Ook Krijgt
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Naast een professionele website ontvang je ook deze extra's om jouw online succes te garanderen
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {extras.map((extra, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white rounded-xl p-8 shadow-sm hover:shadow-xl 
                          transition-all duration-500 hover:-translate-y-1"
              >
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 group-hover:opacity-100 
                              transition-opacity duration-500 -z-10 blur-xl" />
                
                {/* Icon with gradient background */}
                <div className="relative mb-6 w-16 h-16">
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${extra.gradient} 
                                opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />
                  <div className="relative w-full h-full flex items-center justify-center">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      <extra.icon className={`w-8 h-8 text-primary group-hover:scale-110 
                                         transition-transform duration-500`} />
                    </motion.div>
                  </div>
                </div>

                {/* Content */}
                <motion.div
                  initial={{ y: 0 }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary 
                               transition-colors duration-300">
                    {extra.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 
                               transition-colors duration-300">
                    {extra.description}
                  </p>
                </motion.div>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-12 h-1 bg-gradient-to-r from-primary/20 
                              to-transparent rounded-full opacity-0 group-hover:opacity-100 
                              transition-opacity duration-500" />
                <div className="absolute bottom-4 left-4 w-1 h-12 bg-gradient-to-b from-primary/20 
                              to-transparent rounded-full opacity-0 group-hover:opacity-100 
                              transition-opacity duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}