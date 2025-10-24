import React from 'react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { SupabaseSEO } from '../SEO/SupabaseSEO';
import { ContactWidget } from '../common/ContactWidget';

interface LayoutProps {
  children: React.ReactNode;
  seoInternalName?: string;
}

export function Layout({ children, seoInternalName = 'Home page SEO' }: LayoutProps) {
  const showChatbot = false;

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

      {/* Voiceflow Chatbot Script - Disabled */}
      {showChatbot && (
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function(d, t) {
                var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
                v.onload = function() {
                  window.voiceflow.chat.load({
                    verify: { projectID: '674d9b91083c81389079bb36' },
                    url: 'https://general-runtime.voiceflow.com',
                    versionID: 'production'
                  });
                }
                v.src = "https://cdn.voiceflow.com/widget/bundle.mjs";
                v.type = "text/javascript";
                s.parentNode.insertBefore(v, s);
              })(document, 'script');
            `
          }}
        />
      )}
    </div>
  );
}