import React from 'react';
import { Clock, FileCheck } from 'lucide-react';
import { CaseCard } from './CaseCard';
import { motion } from 'framer-motion';

interface Metric {
  value: string;
  label: string;
  description: string;
}

interface CaseStudyProps {
  project: {
    title: string;
    description: string;
  };
  background: {
    challenge: string;
    solution: string;
  };
  metrics: Metric[];
  testimonial: {
    quote: string;
    author: string;
    role: string;
    company: string;
  };
}

export function CaseStudy({ project, background, metrics, testimonial }: CaseStudyProps) {
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

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-4">
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 p-4 rounded-xl text-center"
              >
                <div className="text-2xl font-bold text-primary mb-1">
                  {metric.value}
                </div>
                <div className="font-medium text-gray-900 mb-1">
                  {metric.label}
                </div>
                <div className="text-sm text-gray-600">
                  {metric.description}
                </div>
              </motion.div>
            ))}
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