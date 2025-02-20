import { useState, useEffect } from 'react';

export interface DashboardMetric {
  metric_key: string;
  value: string;
  title: string;
  subtitle: string;
}

// Default metrics as fallback
const DEFAULT_METRICS: DashboardMetric[] = [
  {
    metric_key: 'satisfied_clients',
    value: '3',
    title: 'Tevreden Klanten',
    subtitle: 'Succesvolle samenwerkingen'
  },
  {
    metric_key: 'average_roi',
    value: '300%',
    title: 'Gemiddelde ROI',
    subtitle: 'Return on Investment'
  },
  {
    metric_key: 'extra_revenue',
    value: '€15000+',
    title: 'Extra Omzet',
    subtitle: 'Voor onze klanten in 2024'
  },
  {
    metric_key: 'hours_saved',
    value: '100+',
    title: 'Uren Bespaard',
    subtitle: 'Door blijvende automatisatie'
  }
];

declare global {
  interface Window {
    __INITIAL_METRICS__?: DashboardMetric[];
  }
}

export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetric[]>(() => 
    window.__INITIAL_METRICS__ || DEFAULT_METRICS
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return { metrics, isLoading, error };
}