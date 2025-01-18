import React from 'react';
import { Link } from '../Link';

interface ServicesButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function ServicesButton({ className = '', children }: ServicesButtonProps) {
  return (
    <Link 
      href="/diensten"
      className={`bg-gray-50 hover:bg-gray-100 text-gray-900 px-6 py-3 rounded-lg font-semibold 
                 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${className}`}
    >
      {children || 'Bekijk onze diensten'}
    </Link>
  );
}