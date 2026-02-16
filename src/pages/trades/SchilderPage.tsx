import React from 'react';
import { TradePage } from '../TradePage';

export function SchilderPage() {
  return (
    <TradePage
      trade="Schilder"
      slug="schilder"
      heroTitle="Website voor schilders"
      heroDescription="Als schilder draait het om uitstraling. Ik maak websites die jouw werk professioneel tonen, inclusief portfolio en voor/na-foto's."
      features={[
        { text: 'Portfolio pagina voor je projecten' },
        { text: 'Google vindbaarheid in jouw regio' },
        { text: 'Offerte-aanvraag knop' },
        { text: 'Reviews zichtbaar op je website' },
      ]}
      closingLine="Zo trek je particuliere klanten aan zonder tussenpartij."
      seoTitle="Website voor schilders | Tielo Digital"
      seoDescription="Professionele website voor schilders. Portfolio, Google vindbaarheid, offerte-aanvraag knop en reviews. Zonder Werkspot."
      seoKeywords={['website schilder', 'schilder website laten maken', 'schilder online', 'schildersbedrijf website']}
    />
  );
}
