import React from 'react';
import { Link } from '../Link';

export function ServiceLinks() {
  return (
    <div>
      <h4 className="text-white font-semibold mb-4">Diensten</h4>
      <ul className="space-y-2">
        <li><Link href="/diensten/websites" className="text-white/80 hover:text-white">Websites voor vaklui</Link></li>
        <li><Link href="/diensten/maatwerk" className="text-white/80 hover:text-white">Maatwerk & automatisering</Link></li>
      </ul>
    </div>
  );
}
