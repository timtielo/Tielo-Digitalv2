import React from 'react';
import { Globe, User, Shield, Euro } from 'lucide-react';
import { BenefitCard } from './BenefitCard';

const benefits = [
  {
    icon: Globe,
    title: 'Gespecialiseerd in kleine bouwbedrijven',
    description: 'Ik begrijp precies waar jij als startend bouwbedrijf tegenaan loopt en wat je nodig hebt.'
  },
  {
    icon: User,
    title: 'Volledig ontzorgd',
    description: 'Jij hoeft niets te doen. Ik regel alles technisch voor je zodat jij gewoon kan blijven werken.'
  },
  {
    icon: Shield,
    title: 'Duidelijke communicatie',
    description: 'Geen technische taal of verwarrende concepten. Alles wordt uitgelegd in normale taal.'
  },
  {
    icon: Euro,
    title: 'Vaste, eerlijke prijzen',
    description: 'Je weet precies waar je aan toe bent. Geen verborgen kosten of verrassingen achteraf.'
  }
];

export function Benefits() {
  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-rubik">
            Waarom Tielo Digital
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Eenvoudig, betrouwbaar en gemaakt voor jouw situatie
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} {...benefit} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}