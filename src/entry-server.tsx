import React from 'react';
import ReactDOMServer from 'react-dom/server';
import App from './App';
import { generateSEO } from './utils/seo';
import { matchRoute } from './router/utils/matchRoute';
import { routes } from './router/routes';

export function render(url: string) {
  const { route, params } = matchRoute(url, routes);
  
  // Generate SEO data based on the current route
  const seo = generateSEO({
    title: route?.title || 'Tielo Digital',
    description: route?.description || 'AI & Automatisering oplossingen voor jouw bedrijf',
    canonical: `https://tielo-digital.nl${url}`,
    ogImage: route?.ogImage || 'https://tielo-digital.nl/social/og-image.jpg'
  });
  
  const html = ReactDOMServer.renderToString(
    <App initialUrl={url} routeParams={params} />
  );

  return {
    html,
    seo
  };
}