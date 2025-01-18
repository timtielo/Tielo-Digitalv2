import React from 'react';

export function HeroBackground() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-[#fff5f0] to-white" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
    </>
  );
}