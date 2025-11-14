import React from 'react';
import { Header } from '../Header';
import { Footer } from '../Footer/Footer';
import { SupabaseSEO } from '../SEO/SupabaseSEO';
import { ContactWidget } from '../common/ContactWidget';

interface LayoutProps {
  children: React.ReactNode;
  seoInternalName?: string;
}

export function Layout({ children, seoInternalName = 'Home page SEO' }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <SupabaseSEO
        internalName={seoInternalName}
        fallback={{
          title: "Tielo Digital - AI & Automatisering",
          description: "Transformeer jouw bedrijf met AI-gedreven oplossingen en automatisering. Verhoog efficiency, verminder kosten en blijf voorop in innovatie."
        }}
      />
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />

      <ContactWidget />
    </div>
  );
}