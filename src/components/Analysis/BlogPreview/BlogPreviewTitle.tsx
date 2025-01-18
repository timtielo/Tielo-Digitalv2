import React from 'react';
import { Calendar } from 'lucide-react';

export function BlogPreviewTitle() {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold mb-6 font-rubik text-center">
        Laatste Blogs
      </h2>
      <div className="bg-blue-50 p-6 rounded-xl inline-flex items-start gap-4 text-left mx-auto">
        <Calendar className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
        <p className="text-blue-900">
          In de tussentijd kun je hieronder onze laatste blogs lezen over AI en automatisering.
        </p>
      </div>
    </div>
  );
}