import React from 'react';
import { Users, TrendingUp, Clock, Award } from 'lucide-react';
import { MetricCard } from './MetricCard';

const metrics = [
  {
    icon: Users,
    value: '3',
    title: 'Tevreden Klanten',
    subtitle: 'Succesvolle samenwerkingen'
  },
  {
    icon: TrendingUp,
    value: '300%',
    title: 'Gemiddelde ROI',
    subtitle: 'Return on Investment'
  },
  {
    icon: Clock,
    value: '€15000+',
    title: 'Extra Omzet',
    subtitle: 'Voor onze klanten in 2024'
  },
  {
    icon: Award,
    value: '100+',
    title: 'Uren Bespaard',
    subtitle: 'Door blijvende automatisatie'
  }
];

export function MetricsDashboard() {
  return (
    <section className="py-20 bg-gray-50/50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {metrics.map((metric, index) => (
            <MetricCard
              key={index}
              icon={metric.icon}
              value={metric.value}
              title={metric.title}
              subtitle={metric.subtitle}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}