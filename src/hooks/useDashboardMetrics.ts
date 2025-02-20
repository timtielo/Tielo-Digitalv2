import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase/client';

export interface DashboardMetric {
  metric_key: string;
  value: string;
  title: string;
  subtitle: string;
}

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

// Cache key for localStorage
const METRICS_CACHE_KEY = 'dashboard_metrics_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

function getCachedMetrics(): { metrics: DashboardMetric[] | null; timestamp: number } | null {
  const cached = localStorage.getItem(METRICS_CACHE_KEY);
  return cached ? JSON.parse(cached) : null;
}

function setCachedMetrics(metrics: DashboardMetric[]) {
  localStorage.setItem(
    METRICS_CACHE_KEY,
    JSON.stringify({
      metrics,
      timestamp: Date.now()
    })
  );
}

export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetric[]>(() => {
    // Initialize with cached data if available and not expired
    const cached = getCachedMetrics();
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.metrics;
    }
    return DEFAULT_METRICS;
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 1000; // Start with 1 second delay

    async function fetchMetrics() {
      try {
        // Check cache first
        const cached = getCachedMetrics();
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          if (isMounted) {
            setMetrics(cached.metrics);
            setIsLoading(false);
            return;
          }
        }

        const { data, error: supabaseError } = await supabase
          .from('dashboard_metrics')
          .select('*')
          .order('metric_key');

        if (supabaseError) throw supabaseError;

        if (isMounted) {
          const metricsData = data || DEFAULT_METRICS;
          setMetrics(metricsData);
          setCachedMetrics(metricsData);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching dashboard metrics:', err);
        
        if (isMounted) {
          // On error, try to use cached data if available
          const cached = getCachedMetrics();
          if (cached) {
            setMetrics(cached.metrics);
            setError('Using cached data - Could not refresh metrics');
          } else if (retryCount < maxRetries) {
            retryCount++;
            // Exponential backoff retry
            setTimeout(fetchMetrics, retryDelay * Math.pow(2, retryCount - 1));
          } else {
            setMetrics(DEFAULT_METRICS);
            setError('Could not load metrics - Using default values');
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchMetrics();

    return () => {
      isMounted = false;
    };
  }, []);

  return { metrics, isLoading, error };
}