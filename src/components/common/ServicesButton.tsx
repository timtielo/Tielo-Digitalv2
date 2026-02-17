import React from 'react';

interface ServicesButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function ServicesButton({ className = '', children }: ServicesButtonProps) {
  const scrollToVoorbeelden = () => {
    const element = document.getElementById('voorbeelden');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <button
      onClick={scrollToVoorbeelden}
      className={`bg-white border border-gray-300 text-tielo-navy px-6 py-3 rounded-td font-medium
                 hover:border-tielo-navy hover:bg-gray-50 transition-all duration-200
                 active:scale-[0.98] text-base
                 min-h-[48px] touch-manipulation ${className}`}
    >
      {children || 'Voorbeelden bekijken'}
    </button>
  );
}
