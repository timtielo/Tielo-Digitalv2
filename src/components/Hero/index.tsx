import React from 'react';
import { HeroContent } from './HeroContent';
import { HeroBackground } from './HeroBackground';

export function Hero() {
  return (
    <section className="min-h-[calc(100vh-72px)] md:min-h-screen flex items-center relative overflow-hidden">
      <HeroBackground />
      <div className="container mx-auto px-4 sm:px-6 pt-20 pb-8 md:pt-20 md:pb-12">
        <div className="max-w-2xl mx-auto text-center md:text-left">
          <HeroContent />
        </div>
      </div>
    </section>
  );
}
