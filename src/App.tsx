import React from 'react';
import { useRouter } from './router/useRouter';
import { Layout } from './components/Layout/Layout';

interface AppProps {
  initialUrl?: string;
  routeParams?: Record<string, string>;
}

export default function App({ initialUrl, routeParams }: AppProps) {
  const { Component, params, useLayout } = useRouter(initialUrl, routeParams);

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