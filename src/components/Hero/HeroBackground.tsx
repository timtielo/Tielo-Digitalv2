import React from 'react';

export function HeroBackground() {
  return (
    <>
      <div className="absolute inset-0 bg-tielo-offwhite" />
      <div className="absolute inset-0 td-micro-grid opacity-40" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </>
  );
}
