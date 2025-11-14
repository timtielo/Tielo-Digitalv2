import React from 'react';
import { Link } from '../Link';

export function ServiceLinks() {
  return (
    <div>
      <h4 className="text-white font-semibold mb-4">Diensten</h4>
      <ul className="space-y-2">
        <li><Link href="/diensten/websites" className="text-white/80 hover:text-white">Websites voor Bouwbedrijven</Link></li>
        <li><Link href="/diensten/customer-service" className="text-white/80 hover:text-white">Klantenservice Automatisering</Link></li>
        <li><Link href="/diensten/custom" className="text-white/80 hover:text-white">Maatwerk Oplossingen</Link></li>
      </ul>
    </div>
  );
}