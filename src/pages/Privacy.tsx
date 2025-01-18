import React from 'react';
import { PolicyLayout } from '../components/Legal/PolicyLayout';

export function Privacy() {
  return (
    <PolicyLayout title="Privacy Policy" lastUpdated="3 januari 2025">
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">1. Gegevensverzameling</h2>
        <p className="mb-4">Wij verzamelen de volgende persoonlijke gegevens:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Naam en contactgegevens (e-mail, telefoonnummer)</li>
          <li>Bedrijfsinformatie</li>
          <li>Website gegevens en gebruiksstatistieken</li>
          <li>Communicatie voorkeuren</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">2. Gebruik van Gegevens</h2>
        <p className="mb-4">Uw gegevens worden gebruikt voor:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Het leveren van onze diensten</li>
          <li>Communicatie over onze producten en diensten</li>
          <li>Het verbeteren van onze website en dienstverlening</li>
          <li>Het naleven van wettelijke verplichtingen</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">3. Gegevensbescherming</h2>
        <p className="mb-4">Wij nemen de bescherming van uw gegevens serieus en nemen passende maatregelen om misbruik, verlies, onbevoegde toegang, ongewenste openbaarmaking en ongeoorloofde wijziging tegen te gaan.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">4. Uw Rechten</h2>
        <p className="mb-4">U heeft de volgende rechten met betrekking tot uw persoonsgegevens:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Recht op inzage</li>
          <li>Recht op correctie</li>
          <li>Recht op verwijdering</li>
          <li>Recht op dataportabiliteit</li>
          <li>Recht om een klacht in te dienen</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">5. Contact</h2>
        <p className="mb-4">Voor vragen over ons privacybeleid kunt u contact opnemen via:</p>
        <p className="mb-2">Email: <a href="mailto:info@tielo-digital.nl" className="text-primary hover:underline">info@tielo-digital.nl</a></p>
      </section>
    </PolicyLayout>
  );
}