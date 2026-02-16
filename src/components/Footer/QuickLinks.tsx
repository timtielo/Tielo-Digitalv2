import React from 'react';
import { Link } from '../Link';

export function QuickLinks() {
  return (
    <div>
      <h4 className="text-white font-semibold mb-4">Links</h4>
      <ul className="space-y-2">
        <li><Link href="/over-ons" className="text-white/80 hover:text-white">Over ons</Link></li>
        <li><Link href="/cases" className="text-white/80 hover:text-white">Cases</Link></li>
        <li><Link href="/blog" className="text-white/80 hover:text-white">Blog</Link></li>
        <li><Link href="/contact" className="text-white/80 hover:text-white">Contact</Link></li>
      </ul>
    </div>
  );
}
