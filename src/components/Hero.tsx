import React from 'react';
import { HeroContent } from './Hero/HeroContent';
import { HeroReviews } from './Hero/HeroReviews';
import { HeroBackground } from './Hero/HeroBackground';

export function Hero() {
  return (
    <section className="min-h-screen flex items-center relative overflow-hidden">
      <HeroBackground />
      <div className="container mx-auto px-4 pt-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <HeroContent />
          <div className="relative hidden md:block">
            <HeroReviews />
          </div>
        </div>
      </div>
    </section>
  );
}