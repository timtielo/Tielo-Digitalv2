import React from 'react';
import { MessageCircle } from 'lucide-react';

export function ContactWidget() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <div className="bg-white rounded-lg shadow-lg px-4 py-2 border border-gray-100">
        <p className="text-sm text-gray-700 font-medium whitespace-nowrap">
          Benieuwd naar de mogelijkheden?
        </p>
        <p className="text-xs text-gray-600 mt-1">
          Stuur mij een appje:
        </p>
      </div>

      <a
        href="https://wa.me/31611223766?text=Hey%20Tim,"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg
                 hover:bg-[#20BD5A] transition-all duration-300
                 hover:scale-110 active:scale-95"
        aria-label="WhatsApp contact"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  );
}
