import React from 'react';
import { Workflow, Send, Mail, Bot, MessageSquare, Brain, ArrowRight } from 'lucide-react';
import { ServiceCard } from './ServiceCard';
import { motion } from 'framer-motion';
import { Link } from './Link';
import { WebsitesSection } from './Services/WebsitesSection';

export const services = [
  {
    id: 'workflow',
    icon: Workflow,
    title: 'Workflow',
    description: 'Data doorsturen van het ene programma naar de andere.',
    features: [
      'Systeem integratie',
      'Automatische dataverwerking',
      'Foutreductie',
      'Tijdbesparing'
    ]
  },
  {
    id: 'outreach',
    icon: Send,
    title: 'Outreach',
    description: 'Meer klanten met geautomatiseerde outreach.',
    features: [
      'Gepersonaliseerde campagnes',
      'Lead nurturing',
      'A/B testing',
      'Conversie optimalisatie'
    ]
  },
  {
    id: 'email-handling',
    icon: Mail,
    title: 'Emails beantwoorden',
    description: 'Een AI die jouw emails schrijft zodat jij deze alleen nog maar hoeft te controleren.',
    features: [
      'Automatische email verwerking',
      'Persoonlijke schrijfstijl',
      'Snelle responstijd',
      'Kwaliteitscontrole'
    ]
  },
  {
    id: 'customer-service',
    icon: Bot,
    title: 'Klantenservice',
    description: 'Bespaar tijd en lever betere klantenservice met AI chatbots.',
    features: [
      '24/7 beschikbaarheid',
      'Snelle antwoorden',
      'Leadgeneratie',
      'Klanttevredenheid verhogen'
    ]
  },
  {
    id: 'content-creation',
    icon: MessageSquare,
    title: 'Content maken',
    description: 'Blogs schrijven, LinkedIn post maken, Instagram en Facebook content, AI kan het allemaal.',
    features: [
      'Blog artikelen',
      'Social media posts',
      'SEO-optimalisatie',
      'Consistente merkstijl'
    ]
  },
  {
    id: 'custom',
    icon: Brain,
    title: 'Maatwerk',
    description: 'Custom oplossingen voor uw specifieke behoeften.',
    features: [
      'Custom oplossingen',
      'Technische analyse',
      'Implementatie begeleiding',
      'Onderhoud en support'
    ]
  }
];

export function Services() {
  return (
    <>
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 font-rubik">
              Onze Diensten
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ontdek hoe wij jouw bedrijf kunnen helpen groeien met AI-gedreven oplossingen
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ServiceCard {...service} showMoreInfo />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-lg 
                       font-semibold text-lg hover:bg-primary/90 transition-all duration-300
                       hover:scale-[1.02] active:scale-[0.98]"
            >
              Neem contact op
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>

      <WebsitesSection />
    </>
  );
}