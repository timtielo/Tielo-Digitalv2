import React from 'react';
import { PolicyLayout } from '../components/Legal/PolicyLayout';

export function Cookies() {
  return (
    <PolicyLayout title="Cookie Beleid" lastUpdated="3 januari 2025">
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">1. Wat zijn Cookies?</h2>
        <p className="mb-4">Cookies zijn kleine tekstbestanden die op uw computer of mobiele apparaat worden opgeslagen wanneer u onze website bezoekt.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">2. Soorten Cookies</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Noodzakelijke cookies</h3>
            <p className="text-gray-600">Deze cookies zijn essentieel voor het functioneren van de website.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Analytische cookies</h3>
            <p className="text-gray-600">Wij gebruiken Google Analytics om inzicht te krijgen in het gebruik van onze website.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Marketing cookies</h3>
            <p className="text-gray-600">Deze cookies worden gebruikt om advertenties relevanter te maken voor u.</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">3. Cookie Instellingen</h2>
        <p className="mb-4">U kunt uw cookie-voorkeuren op elk moment aanpassen via uw browserinstellingen. Let op dat het uitschakelen van cookies de functionaliteit van de website kan beïnvloeden.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">4. Cookies van Derden</h2>
        <p className="mb-4">Wij maken gebruik van diensten van derden die ook cookies plaatsen:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Google Analytics (analytisch)</li>
          <li>Google Tag Manager (functioneel)</li>
          <li>LinkedIn (marketing)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">5. Cookie Duur</h2>
        <p className="mb-4">De bewaartermijn van cookies varieert:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Sessie cookies: worden verwijderd na het sluiten van de browser</li>
          <li>Permanente cookies: maximaal 2 jaar</li>
          <li>Marketing cookies: maximaal 6 maanden</li>
        </ul>
      </section>
    </PolicyLayout>
  );
}