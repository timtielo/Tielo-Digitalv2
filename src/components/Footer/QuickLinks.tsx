import React from 'react';
import { Link } from '../Link';

export function QuickLinks() {
  return (
    <div>
      <h4 className="text-white font-semibold mb-4">Links</h4>
      <ul className="space-y-2">
        <li><Link href="/over-ons" className="text-white/80 hover:text-tielo-orange transition-colors">Over ons</Link></li>
        <li><Link href="/cases" className="text-white/80 hover:text-tielo-orange transition-colors">Cases</Link></li>
        <li><Link href="/blog" className="text-white/80 hover:text-tielo-orange transition-colors">Blog</Link></li>
        <li><Link href="/contact" className="text-white/80 hover:text-tielo-orange transition-colors">Contact</Link></li>
      </ul>
    </div>
  );
}
