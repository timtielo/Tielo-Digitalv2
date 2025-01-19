import React from 'react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { SEO, SEOProps } from '../SEO';

interface LayoutProps {
  children: React.ReactNode;
  seo?: SEOProps;
}

export function Layout({ children, seo }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {seo && <SEO {...seo} />}
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}