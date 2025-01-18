import React from 'react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { SEO, SEOProps } from '../SEO';

interface LayoutProps {
  children: React.ReactNode;
  seo?: SEOProps;
}

export function Layout({ children, seo }: LayoutProps) {
  // Get current route to determine if we should show the chatbot
  const isBlogOrOplossing = window.location.pathname.includes('/blog') || 
                           window.location.pathname.includes('/oplossingen');

  return (
    <div className="min-h-screen flex flex-col">
      {seo && <SEO {...seo} />}
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      
      {/* Voiceflow Chatbot Script - Only on main pages */}
      {!isBlogOrOplossing && (
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