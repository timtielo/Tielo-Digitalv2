import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { Link } from './Link';

interface ServiceCardProps {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  showMoreInfo?: boolean;
}

export function ServiceCard({ id, icon: Icon, title, description, features, showMoreInfo }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-2xl font-semibold mb-4">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      {showMoreInfo && (
        <Link 
          href={`/diensten/${id}`}
          className="inline-flex items-center text-primary font-medium hover:gap-2 transition-all duration-200"
        >
          Meer informatie
          <ArrowRight className="ml-1 w-4 h-4" />
        </Link>
      )}
    </div>
  );
}