import React from 'react';

export function TDLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* TD Logo */}
      <svg 
        viewBox="0 0 534 172" 
        className="h-10"
        aria-label="Tielo Digital Logo"
      >
        <path
          d="M130 20h274c5.5 0 10 4.5 10 10v112c0 5.5-4.5 10-10 10H130c-5.5 0-10-4.5-10-10V30c0-5.5 4.5-10 10-10z"
          fill="#1E293B"
        />
        <path
          d="M130 20c-5.5 0-10 4.5-10 10v112c0 5.5 4.5 10 10 10h274c5.5 0 10-4.5 10-10V30c0-5.5-4.5-10-10-10H130zm0 0"
          fill="#1E293B"
        />
        <text
          x="150"
          y="100"
          fill="#FFFFFF"
          fontSize="48"
          fontFamily="Rubik, sans-serif"
          fontWeight="600"
        >
          Tielo Digital
        </text>
        <text
          x="150"
          y="140"
          fill="#FFFFFF"
          fontSize="24"
          fontFamily="Rubik, sans-serif"
          fontWeight="500"
        >
          AI + AUTOMATION
        </text>
      </svg>
    </div>
  );
}