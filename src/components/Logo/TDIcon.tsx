import React from 'react';

interface TDIconProps {
  className?: string;
}

export function TDIcon({ className = '' }: TDIconProps) {
  return (
    <svg 
      width="40" 
      height="40" 
      viewBox="0 0 40 40" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="TD Logo"
    >
      {/* Background Rectangle */}
      <rect width="40" height="40" rx="8" fill="#E96020"/>
      {/* T and D shapes */}
      <path d="M10 12H30V16H10V12Z" fill="#FFFFFF"/>
      <path d="M18 16H22V28H18V16Z" fill="#FFFFFF"/>
    </svg>
  );
}