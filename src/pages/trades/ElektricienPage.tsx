import React from 'react';
import { TradePage } from '../TradePage';

export function ElektricienPage() {
  return (
    <TradePage
      trade="Elektricien"
      slug="elektricien"
      heroTitle="Website voor elektricien"
      heroDescription="Voor elektriciens is vertrouwen belangrijk. Ik bouw websites die professionaliteit uitstralen en spoedaanvragen mogelijk maken."
      features={[
        { text: '24/7 contact zichtbaar' },
        { text: 'Google optimalisatie voor jouw regio' },
        { text: 'Diensten zoals groepenkast, storingen, laadpalen' },
        { text: 'Reviews prominent in beeld' },
      ]}
      closingLine="Bereikbaar wanneer klanten je nodig hebben."
      seoTitle="Website voor elektricien | Tielo Digital"
      seoDescription="Professionele website voor elektriciens. 24/7 contact, Google optimalisatie, diensten en reviews. Direct bereikbaar voor klanten."
      seoKeywords={['website elektricien', 'elektricien website laten maken', 'elektricien online', 'installateur website']}
    />
  );
}
