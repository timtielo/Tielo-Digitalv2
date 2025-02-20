import React from 'react';
import { Loader, Users, TrendingUp, Clock, Award } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { useDashboardMetrics } from '../../hooks/useDashboardMetrics';

const metricIcons = {
  satisfied_clients: Users,
  average_roi: TrendingUp,
  extra_revenue: Clock,
  hours_saved: Award
} as const;

export function MetricsDashboard() {
  const { metrics, isLoading } = useDashboardMetrics();

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50/50">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50/50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {metrics.map((metric, index) => (
            <MetricCard
              key={metric.metric_key}
              icon={metricIcons[metric.metric_key as keyof typeof metricIcons] || Users}
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