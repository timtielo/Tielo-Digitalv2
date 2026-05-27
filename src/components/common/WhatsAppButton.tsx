import React from 'react';
import { MessageCircle } from 'lucide-react';
import { trackEvent } from '../../utils/analyticsTracker';

const WHATSAPP_URL = 'https://wa.me/31620948502?text=Hey%20Tim,';

interface WhatsAppButtonProps {
  children?: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'outline';
  eventName?: string;
  buttonLocation?: string;
}

export function WhatsAppButton({
  children,
  className = '',
  variant = 'primary',
  eventName = 'whatsapp_click',
  buttonLocation = 'Algemeen',
}: WhatsAppButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-td font-medium text-base shadow-sm transition-all duration-200 active:scale-[0.98] min-h-[48px] touch-manipulation';

  const variantClasses = variant === 'primary'
    ? 'bg-tielo-orange hover:bg-[#d85515] text-white hover:shadow-sharp'
    : 'bg-white border border-tielo-orange text-tielo-orange hover:bg-tielo-orange hover:text-white';

  const label = typeof children === 'string' ? children : 'WhatsApp';

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClasses} ${variantClasses} ${className}`}
      onClick={() => trackEvent(eventName, label, buttonLocation)}
    >
      <MessageCircle className="w-5 h-5" />
      {children || 'Stuur mij een appje'}
    </a>
  );
}
