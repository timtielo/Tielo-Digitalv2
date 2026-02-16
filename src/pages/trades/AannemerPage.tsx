import React from 'react';
import { TradePage } from '../TradePage';

export function AannemerPage() {
  return (
    <TradePage
      trade="Aannemer"
      slug="aannemer"
      heroTitle="Website voor aannemer"
      heroDescription="Als aannemer werk je aan grotere projecten. Ik maak websites die betrouwbaarheid en kwaliteit uitstralen."
      features={[
        { text: 'Projectpagina\'s met foto\'s en details' },
        { text: 'Portfolio om je werk te laten zien' },
        { text: 'Heldere contactmogelijkheden' },
        { text: 'SEO voor jouw regio' },
      ]}
      closingLine="Laat je projecten voor zich spreken."
      seoTitle="Website voor aannemer | Tielo Digital"
      seoDescription="Website voor aannemers. Projectpagina's, portfolio, contactmogelijkheden en lokale SEO. Betrouwbaar online."
      seoKeywords={['website aannemer', 'aannemer website laten maken', 'aannemersbedrijf website', 'bouwbedrijf online']}
    />
  );
}
