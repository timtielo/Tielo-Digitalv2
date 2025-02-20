import React from 'react';
import { BusinessCardHero } from '../components/BusinessCard/BusinessCardHero';
import { SocialButtons } from '../components/BusinessCard/SocialButtons';
import { SupabaseSEO } from '../components/SEO/SupabaseSEO';

export function BusinessCard() {
  return (
    <>
      <SupabaseSEO 
        internalName="Business Card SEO"
        fallback={{
          title: "Tim Tielkemeijer - Digital Business Card",
          description: "Digitaal visitekaartje van Tim Tielkemeijer - AI & Automation Expert bij Tielo Digital."
        }}
      />
      <div className="min-h-screen bg-gray-50">
        <BusinessCardHero />
        <section className="py-12">
          <div className="container mx-auto px-4">
            <SocialButtons />
          </div>
        </section>
      </div>
    </>
  );
}