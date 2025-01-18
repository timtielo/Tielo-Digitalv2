import React from 'react';
import { Link } from './Link';

interface LogoProps {
  className?: string;
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <Link href="/" className={`inline-block ${className}`}>
      <div className="flex items-center">
        <div className="w-8 h-8">
          <svg viewBox="0 0 1000 1000" fill="currentColor" className="text-blue-600">
            <path d="M500 0C223.9 0 0 223.9 0 500s223.9 500 500 500 500-223.9 500-500S776.1 0 500 0zm0 900c-221.8 0-400-178.2-400-400s178.2-400 400-400 400 178.2 400 400-178.2 400-400 400zm50-600h-100v300h100V300zm0 400h-100v100h100V700z"/>
          </svg>
        </div>
        <span className="ml-2 text-xl font-bold text-gray-900">Tielo Digital</span>
      </div>
    </Link>
  );
}