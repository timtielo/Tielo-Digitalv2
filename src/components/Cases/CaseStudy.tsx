import React from 'react';
import { Clock, FileCheck } from 'lucide-react';
import { CaseCard } from './CaseCard';

interface CaseStudyProps {
  project: {
    title: string;
    description: string;
  };
  background: {
    challenge: string;
    solution: string;
  };
  testimonial: {
    quote: string;
    author: string;
    role: string;
    company: string;
  };
}

export function CaseStudy({ project, background, testimonial }: CaseStudyProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="grid md:grid-cols-2 gap-8 p-8">
        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-primary">
              {project.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {project.description}
            </p>
          </div>

          <div className="space-y-6">
            <CaseCard
              icon={Clock}
              title="De Uitdaging"
              description={background.challenge}
              iconBgColor="bg-red-100"
              iconColor="text-red-600"
            />

            <CaseCard
              icon={FileCheck}
              title="De Oplossing"
              description={background.solution}
              iconBgColor="bg-green-100"
              iconColor="text-green-600"
            />
          </div>
        </div>

        <div className="bg-gray-50 p-8 rounded-xl">
          <blockquote className="text-gray-600 italic mb-6">
            "{testimonial.quote}"
          </blockquote>
          <div>
            <p className="font-semibold">{testimonial.author}</p>
            <p className="text-gray-500">
              {testimonial.role} bij {testimonial.company}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}