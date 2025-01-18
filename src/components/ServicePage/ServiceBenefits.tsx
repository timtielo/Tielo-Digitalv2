import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Shield, Bot, Brain, MessageSquare, Mail, Workflow, Send } from 'lucide-react';
import { Service } from '../../types/service';

interface ServiceBenefitsProps {
  service: Service;
}

const serviceBenefits = {
  'email-handling': [
    {
      icon: Clock,
      title: 'Tijdwinst',
      description: 'Bespaar uren per dag door geautomatiseerde email verwerking'
    },
    {
      icon: Shield,
      title: 'Consistente Kwaliteit',
      description: 'Elke email wordt met dezelfde hoge standaard beantwoord'
    },
    {
      icon: Brain,
      title: 'Slimme Prioritering',
      description: 'AI categoriseert en prioriteert emails automatisch'
    }
  ],
  'content-creation': [
    {
      icon: TrendingUp,
      title: 'Hogere Output',
      description: 'Produceer meer kwalitatieve content in minder tijd'
    },
    {
      icon: MessageSquare,
      title: 'Diverse Content Types',
      description: 'Van blogs tot social media posts, alles in één oplossing'
    },
    {
      icon: Brain,
      title: 'SEO Optimalisatie',
      description: 'AI zorgt voor zoekmachinevriendelijke content'
    }
  ],
  'customer-service': [
    {
      icon: Bot,
      title: '24/7 Beschikbaarheid',
      description: 'Directe antwoorden op klantvragen, dag en nacht'
    },
    {
      icon: Shield,
      title: 'Consistente Service',
      description: 'Elke klant krijgt dezelfde hoogwaardige ondersteuning'
    },
    {
      icon: TrendingUp,
      title: 'Hogere Klanttevredenheid',
      description: 'Snellere responstijden en betere oplossingen'
    }
  ],
  'workflow': [
    {
      icon: Workflow,
      title: 'Gestroomlijnde Processen',
      description: 'Elimineer handmatige stappen en reduceer fouten'
    },
    {
      icon: Clock,
      title: 'Automatische Dataverwerking',
      description: 'Data wordt automatisch gesynchroniseerd tussen systemen'
    },
    {
      icon: Shield,
      title: 'Betrouwbare Uitvoering',
      description: 'Consistente en foutloze procesuitvoering'
    }
  ],
  'outreach': [
    {
      icon: Send,
      title: 'Gepersonaliseerde Campagnes',
      description: 'Bereik de juiste doelgroep met relevante content'
    },
    {
      icon: TrendingUp,
      title: 'Hogere Conversie',
      description: 'Verbeterde resultaten door AI-gedreven targeting'
    },
    {
      icon: Brain,
      title: 'Slimme Optimalisatie',
      description: 'Continue verbetering van campagne prestaties'
    }
  ],
  'custom': [
    {
      icon: Brain,
      title: 'Op Maat Gemaakt',
      description: 'Oplossingen specifiek voor jouw uitdagingen'
    },
    {
      icon: Shield,
      title: 'Toekomstbestendig',
      description: 'Schaalbare oplossingen die meegroeien'
    },
    {
      icon: TrendingUp,
      title: 'Meetbare Resultaten',
      description: 'Concrete verbeteringen in efficiency en ROI'
    }
  ]
};

export function ServiceBenefits({ service }: ServiceBenefitsProps) {
  const benefits = serviceBenefits[service.id as keyof typeof serviceBenefits] || [];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4 font-rubik">
              Voordelen van {service.title}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-8"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <benefit.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}