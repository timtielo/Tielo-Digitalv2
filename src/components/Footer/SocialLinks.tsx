import React from 'react';
import { Linkedin, Facebook, Instagram, Mail } from 'lucide-react';

export function SocialLinks() {
  return (
    <div className="flex space-x-4 mt-4">
      <a 
        href="https://www.linkedin.com/in/tim-tielkemeijer/" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-white/70 hover:text-white transition-colors"
        aria-label="LinkedIn"
      >
        <Linkedin className="w-6 h-6" />
      </a>
      <a 
        href="https://www.facebook.com/tielodigital/" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-white/70 hover:text-white transition-colors"
        aria-label="Facebook"
      >
        <Facebook className="w-6 h-6" />
      </a>
      <a 
        href="https://www.instagram.com/tielodigital/" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-white/70 hover:text-white transition-colors"
        aria-label="Instagram"
      >
        <Instagram className="w-6 h-6" />
      </a>
      <a 
        href="mailto:info@tielo-digital.nl" 
        className="text-white/70 hover:text-white transition-colors"
        aria-label="Email"
      >
        <Mail className="w-6 h-6" />
      </a>
    </div>
  );
}