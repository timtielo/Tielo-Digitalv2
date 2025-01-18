import { Route } from '../types/route';

interface MatchResult {
  route: Route | null;
  params: Record<string, string>;
}

export function matchRoute(path: string, routes: Route[]): MatchResult {
  // First try exact matches
  const exactMatch = routes.find(route => route.path === path);
  if (exactMatch) {
    return { route: exactMatch, params: {} };
  }

  // Then try parameterized routes
  for (const route of routes) {
    if (!route.params) continue;

    const pathParts = path.split('/').filter(Boolean);
    const routeParts = route.path.split('/').filter(Boolean);

    if (pathParts.length !== routeParts.length) continue;

    const params: Record<string, string> = {};
    let matches = true;

    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(':')) {
        const paramName = routeParts[i].slice(1);
        params[paramName] = pathParts[i];
      } else if (routeParts[i] !== pathParts[i]) {
        matches = false;
        break;
      }
    }

    if (matches) {
      return { route, params };
    }
  }

  return { route: null, params: {} };
}