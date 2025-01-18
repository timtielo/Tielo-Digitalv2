import { useState, useEffect } from 'react';
import { routes } from './routes';
import { NotFound } from './components/NotFound';
import { matchRoute } from './utils/matchRoute';
import type { RouterResult } from './types/route';

export function useRouter(
  initialUrl?: string,
  initialParams?: Record<string, string>
): RouterResult {
  const [currentRoute, setCurrentRoute] = useState<RouterResult>(() => {
    if (initialUrl) {
      const { route, params } = matchRoute(initialUrl, routes);
      return {
        Component: route?.component || NotFound,
        params: initialParams || params,
        useLayout: route?.layout !== false
      };
    }
    
    const path = typeof window !== 'undefined' ? window.location.pathname : '/';
    const { route, params } = matchRoute(path, routes);
    return {
      Component: route?.component || NotFound,
      params,
      useLayout: route?.layout !== false
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleRoute = () => {
      const path = window.location.pathname;
      const { route, params } = matchRoute(path, routes);

      if (route?.redirect) {
        window.history.replaceState({}, '', route.redirect);
        window.dispatchEvent(new PopStateEvent('popstate'));
        return;
      }

      // Always scroll to top when route changes
      window.scrollTo({ top: 0, behavior: 'smooth' });

      setCurrentRoute({
        Component: route?.component || NotFound,
        params,
        useLayout: route?.layout !== false
      });
    };

    // Handle both navigation events and manual URL changes
    window.addEventListener('popstate', handleRoute);
    window.addEventListener('pushstate', handleRoute);
    
    return () => {
      window.removeEventListener('popstate', handleRoute);
      window.removeEventListener('pushstate', handleRoute);
    };
  }, []);

  return currentRoute;
}