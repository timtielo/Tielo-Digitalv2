import { useState } from 'react';

export interface DashboardMetric {
  metric_key: string;
  value: string;
  title: string;
  subtitle: string;
}

const DASHBOARD_METRICS: DashboardMetric[] = [
  {
    metric_key: 'extra_revenue',
    value: '€50000+',
    title: 'Extra Omzet',
    subtitle: 'Voor onze klanten'
  },
  {
    metric_key: 'hours_saved',
    value: '200+',
    title: 'Uren Bespaard',
    subtitle: 'Door blijvende automatisatie'
  },
  {
    metric_key: 'average_roi',
    value: '1189%',
    title: 'Gemiddelde ROI',
    subtitle: 'Return on Investment'
  },
  {
    metric_key: 'satisfied_clients',
    value: '6',
    title: 'Tevreden Klanten',
    subtitle: 'Succesvolle samenwerkingen'
  }
];

export function useDashboardMetrics() {
  const [metrics] = useState<DashboardMetric[]>(DASHBOARD_METRICS);
  return { metrics };
}