import React from 'react';
import { TradePage } from '../TradePage';

export function KlusbedrijfPage() {
  return (
    <TradePage
      trade="Klusbedrijf"
      slug="klusbedrijf"
      heroTitle="Website voor klusbedrijf"
      heroDescription="Als klusbedrijf doe je van alles. Daarom bouw ik een duidelijke website met overzicht van diensten en directe contactmogelijkheden."
      features={[
        { text: 'Duidelijke dienstenstructuur' },
        { text: 'WhatsApp knop voor snelle aanvragen' },
        { text: 'Lokale vindbaarheid in Google' },
        { text: 'Snelle laadtijd op elk apparaat' },
      ]}
      closingLine="Meer directe aanvragen. Minder concurrentie."
      seoTitle="Website voor klusbedrijf | Tielo Digital"
      seoDescription="Website voor klusbedrijven. Duidelijke diensten, WhatsApp contact, lokale vindbaarheid. Meer directe aanvragen."
      seoKeywords={['website klusbedrijf', 'klusbedrijf website laten maken', 'klusjesman website', 'klusbedrijf online']}
    />
  );
}
