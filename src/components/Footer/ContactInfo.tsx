import React from 'react';
import { MessageCircle } from 'lucide-react';
import { NAPInfo } from '../common/NAPInfo';

const WHATSAPP_URL = 'https://wa.me/31620948502?text=Hey%20Tim,';

export function ContactInfo() {
  return (
    <div>
      <h4 className="text-white font-semibold mb-4">Contact</h4>
      <div className="text-white/80 space-y-3">
        <NAPInfo variant="minimal" showIcons={false} />
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white px-4 py-2 rounded-td font-medium transition-all duration-200 active:scale-[0.98] mt-3"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
}