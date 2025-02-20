import { supabase } from '../lib/supabase/client';

export interface DashboardMetric {
  metric_key: string;
  value: string;
  title: string;
  subtitle: string;
}

export const DEFAULT_METRICS: DashboardMetric[] = [
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

export async function fetchMetrics(): Promise<DashboardMetric[]> {
  try {
    const { data, error } = await supabase
      .from('dashboard_metrics')
      .select('*')
      .order('metric_key');

    if (error) throw error;
    return data || DEFAULT_METRICS;
  } catch (err) {
    console.error('Error fetching metrics:', err);
    return DEFAULT_METRICS;
  }
}