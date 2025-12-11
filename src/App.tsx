import React, { useEffect } from 'react';
import { useRouter } from './router/useRouter';
import { Layout } from './components/Layout/Layout';

interface AppProps {
  initialUrl?: string;
  routeParams?: Record<string, string>;
}

export default function App({ initialUrl, routeParams }: AppProps) {
  const { Component, params, useLayout } = useRouter(initialUrl, routeParams);

  useEffect(() => {
    const hostname = window.location.hostname;
    const isSubdomain = hostname !== 'www.tielo-digital.nl' &&
                       hostname !== 'tielo-digital.nl' &&
                       hostname.includes('tielo-digital.nl');

    if (isSubdomain) {
      const metaRobots = document.querySelector('meta[name="robots"]');
      if (metaRobots) {
        metaRobots.setAttribute('content', 'noindex, nofollow');
      } else {
        const meta = document.createElement('meta');
        meta.name = 'robots';
        meta.content = 'noindex, nofollow';
        document.head.appendChild(meta);
      }

      const metaGooglebot = document.querySelector('meta[name="googlebot"]');
      if (metaGooglebot) {
        metaGooglebot.setAttribute('content', 'noindex, nofollow');
      } else {
        const meta = document.createElement('meta');
        meta.name = 'googlebot';
        meta.content = 'noindex, nofollow';
        document.head.appendChild(meta);
      }
    }
  }, []);

  if (!Component) {
    return null;
  }

  if (!useLayout) {
    return <Component {...params} />;
  }

  return (
    <Layout>
      <Component {...params} />
    </Layout>
  );
}