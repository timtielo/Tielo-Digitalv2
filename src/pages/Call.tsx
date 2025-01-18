import React from 'react';
import { CallHero } from '../components/Call/CallHero';
import { CallCalendar } from '../components/Call/CallCalendar';

export function Call() {
  return (
    <div className="min-h-screen bg-white">
      <CallHero />
      <CallCalendar />
    </div>
  );
}