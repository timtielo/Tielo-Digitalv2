import React from 'react';
import { Link } from '../Link';

export function QuickLinks() {
  return (
    <div>
      <h4 className="text-white font-semibold mb-4">Links</h4>
      <ul className="space-y-2">
        <li><Link href="/oplossingen" className="text-white/80 hover:text-white">Oplossingen</Link></li>
        <li><Link href="/diensten/websites" className="text-white/80 hover:text-white">Websites</Link></li>
        <li><Link href="/diensten" className="text-white/80 hover:text-white">Alle Diensten</Link></li>
        <li><Link href="/blog" className="text-white/80 hover:text-white">Blog</Link></li>
        <li><Link href="/contact" className="text-white/80 hover:text-white">Contact</Link></li>
        <li><Link href="/contact" className="text-white/80 hover:text-white">Gratis Opzetje</Link></li>
      </ul>
    </div>
  );
}