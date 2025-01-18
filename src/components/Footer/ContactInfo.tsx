import React from 'react';

export function ContactInfo() {
  return (
    <div>
      <h4 className="text-white font-semibold mb-4">Contact</h4>
      <ul className="space-y-2 text-white/80">
        <li>
          <a 
            href="mailto:info@tielo-digital.nl" 
            className="hover:text-white transition-colors"
          >
            info@tielo-digital.nl
          </a>
        </li>
        <li>Utrecht, Nederland</li>
      </ul>
    </div>
  );
}