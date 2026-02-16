import React from 'react';
import { NAPInfo } from '../common/NAPInfo';

export function ContactInfo() {
  return (
    <div>
      <h4 className="text-white font-semibold mb-4">Contact</h4>
      <div className="text-white/80 space-y-3">
        <NAPInfo variant="minimal" showIcons={false} />
      </div>
    </div>
  );
}