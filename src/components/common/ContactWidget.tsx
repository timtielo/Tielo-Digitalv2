import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export function ContactWidget() {
  const [showBalloon, setShowBalloon] = useState(true);

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end gap-3">
      {showBalloon && (
        <div className="bg-white rounded-lg shadow-lg px-3 py-2 md:px-4 md:py-2 border border-gray-100 relative max-w-[200px] md:max-w-none">
          <button
            onClick={() => setShowBalloon(false)}
            className="absolute -top-1 -right-1 w-5 h-5 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
            aria-label="Close message"
          >
            <X className="w-3 h-3 text-gray-600" />
          </button>
          <p className="text-xs md:text-sm text-gray-700 font-medium">
            Benieuwd naar de mogelijkheden?
          </p>
          <p className="text-[10px] md:text-xs text-gray-600 mt-1">
            Stuur mij een appje:
          </p>
        </div>
      )}

      <a
        href="https://wa.me/31620948502?text=Hey%20Tim,"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-[#25D366] text-white rounded-full shadow-lg
                 hover:bg-[#20BD5A] transition-all duration-300
                 hover:scale-110 active:scale-95"
        aria-label="WhatsApp contact"
      >
        <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
      </a>
    </div>
  );
}
