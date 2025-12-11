import React from 'react';
import { MessageCircle } from 'lucide-react';
import { NAPInfo } from '../common/NAPInfo';

export function ContactInfo() {
  return (
    <div>
      <h4 className="text-white font-semibold mb-4">Contact</h4>
      <div className="text-white/80 space-y-3">
        <NAPInfo variant="minimal" showIcons={false} />
        <a
          href="https://wa.me/31620948502?text=Hey%20Tim,"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
}