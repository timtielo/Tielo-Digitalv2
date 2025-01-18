import React from 'react';
import { Link } from '../Link';

export function ServiceLinks() {
  return (
    <div>
      <h4 className="text-white font-semibold mb-4">Diensten</h4>
      <ul className="space-y-2">
        <li><Link href="/diensten/websites" className="text-white/80 hover:text-white">Websites</Link></li>
        <li><Link href="/diensten/workflow" className="text-white/80 hover:text-white">Workflow</Link></li>
        <li><Link href="/diensten/email-handling" className="text-white/80 hover:text-white">Emails beantwoorden</Link></li>
        <li><Link href="/diensten/content-creation" className="text-white/80 hover:text-white">Content maken</Link></li>
        <li><Link href="/diensten/customer-service" className="text-white/80 hover:text-white">Klantenservice</Link></li>
        <li><Link href="/diensten/outreach" className="text-white/80 hover:text-white">Outreach</Link></li>
      </ul>
    </div>
  );
}