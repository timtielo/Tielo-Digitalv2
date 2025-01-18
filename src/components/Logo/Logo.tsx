import React from 'react';
import { Link } from '../Link';

interface LogoProps {
  className?: string;
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <Link href="/" className={`inline-flex items-center gap-3 group ${className}`}>
      <svg 
        width="40" 
        height="40" 
        viewBox="0 0 40 40" 
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 group-hover:scale-105"
      >
        {/* Background Rectangle */}
        <rect width="40" height="40" rx="8" fill="#E96020"/>
        {/* T and D shapes */}
        <path d="M10 12H30V16H10V12Z" fill="#FFFFFF"/>
        <path d="M18 16H22V28H18V16Z" fill="#FFFFFF"/>
      </svg>
      
      <div className="flex flex-col">
        <span className="text-xl font-bold text-gray-900 font-rubik transition-colors duration-300 group-hover:text-primary">
          Tielo Digital
        </span>
        <span className="text-xs text-gray-600 tracking-wider">
          AI + AUTOMATION
        </span>
      </div>
    </Link>
  );
}