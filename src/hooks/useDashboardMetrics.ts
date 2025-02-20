import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase/client';

export interface DashboardMetric {
  metric_key: string;
  value: string;
  title: string;
  subtitle: string;
}

export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase
          .from('dashboard_metrics')
          .select('*')
          .order('metric_key');

        if (supabaseError) {
          throw supabaseError;
        }

        setMetrics(data || []);
      } catch (err) {
        console.error('Error fetching dashboard metrics:', err);
        setError('Failed to load dashboard metrics');
      } finally {
        setIsLoading(false);
      }
    }

    fetchMetrics();
  }, []);

  return { metrics, isLoading, error };
}