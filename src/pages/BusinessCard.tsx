import React from 'react';
import { BusinessCardHero } from '../components/BusinessCard/BusinessCardHero';
import { SocialButtons } from '../components/BusinessCard/SocialButtons';
import { SEO } from '../components/SEO';

export function BusinessCard() {
  return (
    <>
      <SEO 
        title="Tim Tielkemeijer - Digital Business Card"
        description="Connect with Tim Tielkemeijer"
        noindex={true}
        nofollow={true}
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