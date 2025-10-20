import React from 'react';
import { Linkedin, Twitter, Facebook } from 'lucide-react';
import { NAPInfo } from '../common/NAPInfo';

export function ContactInfo() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-6 font-rubik">Contact Informatie</h2>
        <p className="text-gray-600 mb-8">
          Wij staan klaar om alle vragen te beantwoorden en je te helpen met de beste AI en automatisering oplossingen voor uw bedrijf.
        </p>
      </div>

      <NAPInfo variant="full" showIcons={true} />

      <div className="pt-8 border-t">
        <h3 className="font-semibold mb-4">Volg ons</h3>
        <div className="flex space-x-4">
          <a href="#" className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors">
            <Linkedin className="w-5 h-5 text-primary" />
          </a>
          <a href="#" className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors">
            <Twitter className="w-5 h-5 text-primary" />
          </a>
          <a href="#" className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors">
            <Facebook className="w-5 h-5 text-primary" />
          </a>
        </div>
      </div>
    </div>
  );
}