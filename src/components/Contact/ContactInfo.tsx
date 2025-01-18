import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from 'lucide-react';

export function ContactInfo() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-6 font-rubik">Contact Informatie</h2>
        <p className="text-gray-600 mb-8">
          Wij staan klaar om alle vragen te beantwoorden en je te helpen met de beste AI en automatisering oplossingen voor uw bedrijf.
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Email</h3>
            <a href="mailto:info@tielo-digital.nl" className="text-gray-600 hover:text-primary">
              info@tielo-digital.nl
            </a>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Phone className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Telefoon</h3>
            <a href="tel:+31201234567" className="text-gray-600 hover:text-primary">
              +31 (0)20 123 4567
            </a>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <MapPin className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Locatie</h3>
            <p className="text-gray-600">Utrecht, Nederland</p>
          </div>
        </div>
      </div>

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