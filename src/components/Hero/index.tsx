import React from 'react';
import { HeroContent } from './HeroContent';
import { HeroAnimation } from './HeroAnimation';
import { HeroBackground } from './HeroBackground';

export function Hero() {
  return (
    <section className="min-h-screen flex items-center relative overflow-hidden">
      <HeroBackground />
      <div className="container mx-auto px-4 pt-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <HeroContent />
          <div className="relative hidden md:block">
            <HeroAnimation />
          </div>
        </div>
      </div>
    </section>
  );
}