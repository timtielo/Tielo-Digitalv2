import React from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import { Link } from '../Link';
import { formatDate } from '../../utils/date';

interface OplossingCardProps {
  title: string;
  description: string;
  image: string;
  slug: string;
  date: string;
  readTime: number;
}

export function OplossingCard({ 
  title, 
  description, 
  image, 
  slug,
  date,
  readTime 
}: OplossingCardProps) {
  return (
    <Link 
      href={`/oplossingen/${slug}`}
      className="block h-full"
    >
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group h-full flex flex-col">
        <div className="aspect-w-16 aspect-h-9 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <time dateTime={date}>{formatDate(date)}</time>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {readTime} min leestijd
            </div>
          </div>
          
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          {description && (
            <p className="text-gray-600 mb-4 flex-1">
              {description}
            </p>
          )}

          <div className="inline-flex items-center text-primary font-medium group-hover:gap-2 transition-all duration-200 mt-4">
            Lees meer
            <ArrowRight className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}