import React from 'react';
import { Link } from './Link';
import { Mail, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-green-dark">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Tielo Digital</h3>
            <p className="text-white/80">
              Word zichtbaar zonder afhankelijk te zijn van platformen.
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="mailto:info@tielo-digital.nl"
                className="text-white/70 hover:text-white transition-colors"
              >
                <Mail className="w-6 h-6" />
              </a>
              <a
                href="https://wa.me/31620948502"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
              >
                <MessageCircle className="w-6 h-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Diensten</h4>
            <ul className="space-y-2">
              <li><Link href="/diensten/websites" className="text-white/80 hover:text-white">Websites</Link></li>
              <li><Link href="/diensten/outreach" className="text-white/80 hover:text-white">Outreach</Link></li>
              <li><Link href="/diensten" className="text-white/80 hover:text-white">Alle diensten</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Links</h4>
            <ul className="space-y-2">
            <li><Link href="/oplossingen" className="text-white/80 hover:text-white">Oplossingen</Link></li>
            <li><Link href="/blog" className="text-white/80 hover:text-white">Blog</Link></li>
            <li><Link href="/contact" className="text-white/80 hover:text-white">Contact</Link></li>
            <li><Link href="/gratis-opzetje" className="text-white/80 hover:text-white">Gratis opzetje</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-white/80">
              <li><a href="mailto:info@tielo-digital.nl" className="hover:text-white">info@tielo-digital.nl</a></li>
              <li>Utrecht, Nederland</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 text-sm">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/80">&copy; 2025 Tielo Digital. Alle rechten voorbehouden. 
              <Link href="/diensten/websites" className="text-white/80 hover:text-white"> Wil jij ook zo'n website?</Link> </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="/privacy" className="text-white/80 hover:text-white">Privacy Policy</Link>
              <Link href="/terms" className="text-white/80 hover:text-white">Algemene Voorwaarden</Link>
              <Link href="/cookies" className="text-white/80 hover:text-white">Cookie Beleid</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}