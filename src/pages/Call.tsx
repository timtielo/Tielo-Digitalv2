import React from 'react';
import { CallHero } from '../components/Call/CallHero';
import { CallCalendar } from '../components/Call/CallCalendar';
import { SupabaseSEO } from '../components/SEO/SupabaseSEO';

export function Call() {
  return (
    <div className="min-h-screen bg-white">
      <SupabaseSEO 
        internalName="Call SEO"
        fallback={{
          title: "Plan een Gesprek - Tielo Digital",
          description: "Plan direct een vrijblijvend gesprek over AI en automatisering voor jouw bedrijf. Ontdek de mogelijkheden in een persoonlijk gesprek."
        }}
      />
      <CallHero />
      <CallCalendar />
    </div>
  );
}