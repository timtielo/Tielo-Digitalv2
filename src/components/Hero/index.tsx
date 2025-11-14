import React from 'react';
import { HeroContent } from './HeroContent';
import { HeroReviews } from './HeroReviews';
import { HeroBackground } from './HeroBackground';

export function Hero() {
  return (
    <section className="min-h-[calc(100vh-80px)] md:min-h-screen flex items-center relative overflow-hidden">
      <HeroBackground />
      <div className="container mx-auto px-4 pt-24 pb-12 md:pt-20">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <HeroContent />
          <div className="relative hidden md:block">
            <HeroReviews />
          </div>
        </div>
      </div>
    </section>
  );
}