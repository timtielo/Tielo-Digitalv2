import React from 'react';
import { motion } from 'framer-motion';
import { Brain, ArrowRight, Wrench, Settings, Zap, Shield, Check } from 'lucide-react';
import { Link } from '../../components/Link';
import { SEO } from '../../components/SEO';

const features = [
  {
    icon: Wrench,
    title: 'Op Maat Ontwikkeling',
    description: 'Custom oplossingen specifiek voor jouw uitdagingen'
  },
  {
    icon: Settings,
    title: 'Naadloze Integratie',
    description: 'Perfect passend in je bestaande systemen'
  },
  {
    icon: Zap,
    title: 'Snelle Implementatie',
    description: 'Efficiënte ontwikkeling en deployment'
  },
  {
    icon: Shield,
    title: 'Toekomstbestendig',
    description: 'Schaalbare oplossingen die meegroeien'
  }
];

const benefits = [
  'Volledig op maat gemaakte oplossingen',
  'Technische analyse en advies',
  'Persoonlijke implementatie begeleiding',
  'Continue support en onderhoud'
];

export function CustomPage() {
  return (
    <div className="min-h-screen">
      <SEO 
        title="Custom AI & Automatisering Oplossingen"
        description="Maatwerk AI en automatisering oplossingen voor jouw specifieke bedrijfsuitdagingen. Van analyse tot implementatie - wij ontwikkelen precies wat jij nodig hebt."
        keywords={[
          'Maatwerk AI',
          'Custom Automatisering',
          'Op Maat Ontwikkeling',
          'Bedrijfsspecifieke AI',
          'Custom Solutions',
          'AI Implementatie'
        ]}
        ogType="website"
        canonical="https://tielo-digital.nl/diensten/custom"
      />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-[#fff5f0] to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-8">
                <Brain className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 font-rubik">
                Custom AI & Automatisering
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Sommige uitdagingen vragen om een unieke aanpak. Onze custom oplossingen 
                worden volledig op maat ontwikkeld voor jouw specifieke behoeften. Van 
                complexe systeemintegraties tot custom AI-modellen - wij bouwen precies 
                wat jij nodig hebt om je bedrijf naar het volgende niveau te tillen.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-8 font-rubik">Wat krijg je?</h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                      scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="relative"
                  >
                    <div className="w-32 h-32 bg-primary rounded-2xl flex items-center justify-center">
                      <Brain className="w-16 h-16 text-white" />
                    </div>
                    
                    <div className="absolute inset-0 -m-8">
                      <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-[spin_20s_linear_infinite]" />
                      <div className="absolute inset-0 -m-4 border-4 border-primary/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 font-rubik text-center">
              Ons Ontwikkelproces
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: '01',
                  title: 'Analyse',
                  description: 'We analyseren je huidige processen en identificeren verbeterpunten'
                },
                {
                  step: '02',
                  title: 'Ontwerp',
                  description: 'We ontwerpen een oplossing die perfect aansluit bij jouw behoeften'
                },
                {
                  step: '03',
                  title: 'Ontwikkeling',
                  description: 'We bouwen je custom oplossing met de nieuwste technologieën'
                },
                {
                  step: '04',
                  title: 'Implementatie',
                  description: 'We zorgen voor een soepele implementatie en uitgebreide training'
                }
              ].map((phase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="bg-white rounded-xl p-6 relative z-10">
                    <div className="text-4xl font-bold text-primary/20 mb-4">
                      {phase.step}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{phase.title}</h3>
                    <p className="text-gray-600">{phase.description}</p>
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-1/2 right-0 w-full h-0.5 bg-gradient-to-r from-primary/20 to-transparent transform translate-x-1/2" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold mb-6 font-rubik">
              Klaar voor een oplossing op maat?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Plan een gratis analyse en ontdek hoe we jouw specifieke uitdagingen kunnen oplossen
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white rounded-lg 
                       font-semibold text-lg hover:bg-primary/90 transition-all duration-300
                       hover:scale-[1.02] active:scale-[0.98]"
            >
              Plan je gratis analyse
              <ArrowRight className="ml-2 w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}