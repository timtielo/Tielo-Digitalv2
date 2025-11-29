import React from 'react';
import { Header } from '../Header';
import { Footer } from '../Footer/Footer';
import { ContactWidget } from '../common/ContactWidget';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />

      <ContactWidget />
    </div>
  );
}