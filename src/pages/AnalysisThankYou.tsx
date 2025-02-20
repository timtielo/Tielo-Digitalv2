import React from 'react';
import { AnalysisThankYouHero } from '../components/Analysis/AnalysisThankYouHero';
import { CalendarSection } from '../components/Analysis/Calendar';
import { BlogPreview } from '../components/Analysis/BlogPreview';
import { SupabaseSEO } from '../components/SEO/SupabaseSEO';

export function AnalysisThankYou() {
  return (
    <div className="min-h-screen bg-white">
      <SupabaseSEO 
        internalName="Analysis Thank You SEO"
        fallback={{
          title: "Bedankt voor je aanvraag - Tielo Digital",
          description: "Bedankt voor je interesse in een gratis AI & Automation analyse. We nemen binnen 48 uur contact met je op."
        }}
      />
      <AnalysisThankYouHero />
      <CalendarSection />
      <BlogPreview />
    </div>
  );
}