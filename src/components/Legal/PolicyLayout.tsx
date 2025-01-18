import React from 'react';
import { Link } from '../Link';

interface PolicyLayoutProps {
  children: React.ReactNode;
  title: string;
  lastUpdated: string;
}

export function PolicyLayout({ children, title, lastUpdated }: PolicyLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-4xl font-bold mb-6 font-rubik">{title}</h1>
          <p className="text-sm text-gray-500 mb-8">Laatst bijgewerkt: {lastUpdated}</p>
          
          <div className="prose max-w-none">
            {children}
          </div>

          <div className="mt-12 pt-8 border-t">
            <p className="text-gray-600 mb-4">Gerelateerde documenten:</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
              <Link href="/terms" className="text-primary hover:underline">Algemene Voorwaarden</Link>
              <Link href="/cookies" className="text-primary hover:underline">Cookie Beleid</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}