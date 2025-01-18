import React from 'react';
import { Link } from '../Link';
import { SocialLinks } from './SocialLinks';
import { ServiceLinks } from './ServiceLinks';
import { QuickLinks } from './QuickLinks';
import { ContactInfo } from './ContactInfo';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-green-dark">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Tielo Digital</h3>
            <p className="text-white/80">
              Verbeter jouw bedrijf met AI-gedreven oplossingen en automatisering.
            </p>
            <SocialLinks />
          </div>
          
          <ServiceLinks />
          <QuickLinks />
          <ContactInfo />
        </div>
        
        {/* Legal Footer */}
        <div className="border-t border-white/10 mt-12 pt-8 text-sm">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/80">
              &copy; {currentYear} Tielo Digital. Alle rechten voorbehouden.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="/privacy" className="text-white/80 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-white/80 hover:text-white">
                Algemene Voorwaarden
              </Link>
              <Link href="/cookies" className="text-white/80 hover:text-white">
                Cookie Beleid
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}