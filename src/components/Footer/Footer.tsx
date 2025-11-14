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
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Tielo Digital</h3>
            <p className="text-white/80">
              Websites voor bouwbedrijven. Snel, professioneel en zonder gedoe.
            </p>
            <SocialLinks />
          </div>
          
          <ServiceLinks />
          <QuickLinks />
          <ContactInfo />
        </div>
        
        {/* Legal Footer */}
        <div className="border-t border-white/10 mt-8 md:mt-12 pt-6 md:pt-8 text-xs md:text-sm">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/80 text-center md:text-left">
              &copy; {currentYear} Tielo Digital. Alle rechten voorbehouden.
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              <Link href="/privacy" className="text-white/80 hover:text-white whitespace-nowrap">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-white/80 hover:text-white whitespace-nowrap">
                Algemene Voorwaarden
              </Link>
              <Link href="/cookies" className="text-white/80 hover:text-white whitespace-nowrap">
                Cookie Beleid
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}