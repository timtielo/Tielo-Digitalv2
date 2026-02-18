import React from 'react';
import { Link } from '../Link';

export function ServiceLinks() {
  return (
    <div>
      <h4 className="text-white font-semibold mb-4">Diensten</h4>
      <ul className="space-y-2">
        <li><Link href="/diensten/websites" className="text-white/80 hover:text-tielo-orange transition-colors">Websites voor vaklui</Link></li>
        <li><Link href="/diensten/websites/loodgieter" className="text-white/60 hover:text-tielo-orange transition-colors text-sm pl-3">Loodgieter</Link></li>
        <li><Link href="/diensten/websites/elektricien" className="text-white/60 hover:text-tielo-orange transition-colors text-sm pl-3">Elektricien</Link></li>
        <li><Link href="/diensten/websites/schilder" className="text-white/60 hover:text-tielo-orange transition-colors text-sm pl-3">Schilder</Link></li>
        <li><Link href="/diensten/websites/aannemer" className="text-white/60 hover:text-tielo-orange transition-colors text-sm pl-3">Aannemer</Link></li>
        <li><Link href="/diensten/websites/metselaar" className="text-white/60 hover:text-tielo-orange transition-colors text-sm pl-3">Metselaar</Link></li>
        <li><Link href="/diensten/websites/klusbedrijf" className="text-white/60 hover:text-tielo-orange transition-colors text-sm pl-3">Klusbedrijf</Link></li>
        <li className="pt-1"><Link href="/diensten/maatwerk" className="text-white/80 hover:text-tielo-orange transition-colors">Maatwerk & automatisering</Link></li>
      </ul>
    </div>
  );
}
