import React from 'react';
import { Mail } from 'lucide-react';

export function SocialLinks() {
  return (
    <div className="flex space-x-4 mt-4">
      <a
        href="mailto:tim@tielo-digital.nl"
        className="text-white/70 hover:text-tielo-orange transition-colors"
        aria-label="Email"
      >
        <Mail className="w-6 h-6" />
      </a>
    </div>
  );
}