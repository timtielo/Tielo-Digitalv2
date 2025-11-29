import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from '../Link';

interface ConsultButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function ConsultButton({ className = '', children }: ConsultButtonProps) {
  return (
    <Link
      href="/contact"
      className={`bg-primary text-white px-6 py-3 rounded-lg font-semibold
                 hover:bg-primary/90 transition-all duration-300
                 hover:scale-[1.02] active:scale-[0.98]
                 inline-flex items-center justify-center gap-2 text-base
                 min-h-[48px] touch-manipulation ${className}`}
    >
      {children || 'Plan een gratis analyse'}
      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
    </Link>
  );
}