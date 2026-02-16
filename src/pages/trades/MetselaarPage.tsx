import React from 'react';
import { TradePage } from '../TradePage';

export function MetselaarPage() {
  return (
    <TradePage
      trade="Metselaar"
      slug="metselaar"
      heroTitle="Website voor metselaar"
      heroDescription="Als metselaar wil je vakmanschap tonen. Ik zorg voor een website die jouw werk laat spreken."
      features={[
        { text: 'Foto\'s van projecten in een strak portfolio' },
        { text: 'Lokale vindbaarheid in Google' },
        { text: 'Direct contact via WhatsApp' },
        { text: 'Strakke, professionele uitstraling' },
      ]}
      closingLine="Je vakmanschap verdient een website die dat laat zien."
      seoTitle="Website voor metselaar | Tielo Digital"
      seoDescription="Website voor metselaars. Portfolio, lokale vindbaarheid, WhatsApp contact. Professionele uitstraling online."
      seoKeywords={['website metselaar', 'metselaar website laten maken', 'metselaarsbedrijf online', 'metselaar Google']}
    />
  );
}
