import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

const WHATSAPP_URL = 'https://wa.me/31620948502?text=Hey%20Tim,';

export function ContactWidget() {
  const [showBalloon, setShowBalloon] = useState(true);

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end gap-3">
      {showBalloon && (
        <div className="bg-tielo-navy rounded-lg shadow-lg px-3 py-2 md:px-4 md:py-3 border border-tielo-navy/80 relative max-w-[220px] md:max-w-none">
          <button
            onClick={() => setShowBalloon(false)}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-tielo-navy border border-white/20 hover:bg-tielo-navy/80 rounded-full flex items-center justify-center transition-colors"
            aria-label="Close message"
          >
            <X className="w-3 h-3 text-white" />
          </button>
          <p className="text-xs md:text-sm text-white font-medium">
            Benieuwd naar de mogelijkheden?
          </p>
          <p className="text-[10px] md:text-xs text-white/70 mt-1">
            Stuur mij een appje
          </p>
        </div>
      )}

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-tielo-orange text-white rounded-full shadow-lg
                 hover:bg-[#d85515] transition-all duration-300
                 hover:scale-110 active:scale-95 ring-4 ring-tielo-orange/20"
        aria-label="WhatsApp contact"
      >
        <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
      </a>
    </div>
  );
}
