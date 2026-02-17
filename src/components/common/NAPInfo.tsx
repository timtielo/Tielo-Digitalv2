import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { BUSINESS_INFO } from '../../config/business';

interface NAPInfoProps {
  variant?: 'full' | 'minimal' | 'inline';
  showIcons?: boolean;
  className?: string;
}

export function NAPInfo({
  variant = 'full',
  showIcons = true,
  className = ''
}: NAPInfoProps) {
  const address = BUSINESS_INFO.address;
  const fullAddress = `${address.streetAddress}, ${address.postalCode} ${address.addressLocality}`;

  if (variant === 'minimal') {
    return (
      <div className={`space-y-2 ${className}`}>
        <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
          <span itemProp="addressLocality">{address.addressLocality}</span>,{' '}
          <span itemProp="addressCountry">Nederland</span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`mailto:${BUSINESS_INFO.email}`}
            itemProp="email"
            className="hover:text-primary transition-colors"
          >
            {BUSINESS_INFO.email}
          </a>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`flex flex-wrap gap-4 text-sm ${className}`}>
        <span itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
          <span itemProp="addressLocality">{address.addressLocality}</span>, NL
        </span>
        <a
          href={`mailto:${BUSINESS_INFO.email}`}
          itemProp="email"
          className="hover:underline"
        >
          {BUSINESS_INFO.email}
        </a>
        <a
          href={`tel:${BUSINESS_INFO.phone}`}
          itemProp="telephone"
          className="hover:underline"
        >
          {BUSINESS_INFO.phone}
        </a>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`} itemScope itemType="https://schema.org/LocalBusiness">
      <meta itemProp="name" content={BUSINESS_INFO.name} />
      <meta itemProp="url" content={BUSINESS_INFO.url} />

      <div className="flex items-start gap-3">
        {showIcons && <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />}
        <address
          itemProp="address"
          itemScope
          itemType="https://schema.org/PostalAddress"
          className="not-italic"
        >
          <span itemProp="streetAddress">{address.streetAddress}</span><br />
          <span itemProp="postalCode">{address.postalCode}</span>{' '}
          <span itemProp="addressLocality">{address.addressLocality}</span><br />
          <span itemProp="addressCountry">Nederland</span>
        </address>
      </div>

      <div className="flex items-center gap-3">
        {showIcons && <Mail className="w-5 h-5 flex-shrink-0" />}
        <a
          href={`mailto:${BUSINESS_INFO.email}`}
          itemProp="email"
          className="hover:text-primary transition-colors"
        >
          {BUSINESS_INFO.email}
        </a>
      </div>

      <div className="flex items-center gap-3">
        {showIcons && <Phone className="w-5 h-5 flex-shrink-0" />}
        <a
          href={`tel:${BUSINESS_INFO.phone}`}
          itemProp="telephone"
          className="hover:text-primary transition-colors"
        >
          {BUSINESS_INFO.phone}
        </a>
      </div>
    </div>
  );
}
