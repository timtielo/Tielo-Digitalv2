import React from 'react';
import { AnalysisThankYouHero } from '../components/Analysis/AnalysisThankYouHero';
import { CalendarSection } from '../components/Analysis/Calendar';
import { BlogPreview } from '../components/Analysis/BlogPreview';

export function AnalysisThankYou() {
  return (
    <div className="min-h-screen bg-white">
      <AnalysisThankYouHero />
      <CalendarSection />
      <BlogPreview />
    </div>
  );
}