import React from 'react';
import { TradePage } from '../TradePage';

export function LoodgieterPage() {
  return (
    <TradePage
      trade="Loodgieter"
      slug="loodgieter"
      heroTitle="Website laten maken als loodgieter"
      heroDescription="Als loodgieter wil je niet afhankelijk zijn van Werkspot. Ik maak websites voor loodgieters die lokaal gevonden willen worden in Google."
      features={[
        { text: 'Vindbaarheid op "loodgieter + plaats"' },
        { text: 'WhatsApp knop voor spoedklussen' },
        { text: 'Reviews zichtbaar op je website' },
        { text: 'Duidelijke dienstenpagina (lekkage, cv-installatie, etc.)' },
      ]}
      closingLine="Ideaal voor zelfstandige loodgieters die direct gebeld willen worden."
      seoTitle="Website laten maken als loodgieter | Tielo Digital"
      seoDescription="Website voor loodgieters. Lokaal vindbaar in Google, WhatsApp voor spoedklussen, reviews zichtbaar. Geen Werkspot nodig."
      seoKeywords={['website loodgieter', 'loodgieter website laten maken', 'loodgieter Google', 'loodgieter online']}
    />
  );
}
