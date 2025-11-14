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
      className={`bg-gray-50 hover:bg-gray-100 text-gray-900 px-6 py-3 rounded-lg font-semibold
                 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-base
                 min-h-[48px] touch-manipulation ${className}`}
    >
      {children || 'Voorbeelden bekijken'}
    </button>
  );
}