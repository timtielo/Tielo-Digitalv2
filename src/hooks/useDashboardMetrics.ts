import { useState, useEffect } from 'react';
import { DEFAULT_METRICS } from '../utils/metrics';
import type { DashboardMetric } from '../utils/metrics';

declare global {
  interface Window {
    __INITIAL_METRICS__?: DashboardMetric[];
  }
}

export function useDashboardMetrics() {
  // Initialize with either injected metrics or defaults
  const [metrics, setMetrics] = useState<DashboardMetric[]>(() => 
    window.__INITIAL_METRICS__ || DEFAULT_METRICS
  );
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If we have injected metrics, no need to load
    if (window.__INITIAL_METRICS__) {
      return;
    }

    // Otherwise show loading state
    setIsLoading(true);
  }, []);

  return { metrics, isLoading, error };
}