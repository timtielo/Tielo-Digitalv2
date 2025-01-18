import React from 'react';
import { PolicyLayout } from '../components/Legal/PolicyLayout';

export function Terms() {
  return (
    <PolicyLayout title="Algemene Voorwaarden" lastUpdated="3 januari 2025">
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">1. Algemeen</h2>
        <p className="mb-4">Deze algemene voorwaarden zijn van toepassing op alle diensten van Tielo Digital.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">2. Dienstverlening</h2>
        <p className="mb-4">Wij bieden AI en automatisering oplossingen aan bedrijven. Onze diensten omvatten:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>AI-implementaties</li>
          <li>Procesautomatisering</li>
          <li>Consultancy</li>
          <li>Training en ondersteuning</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">3. Intellectueel Eigendom</h2>
        <p className="mb-4">Alle intellectuele eigendomsrechten met betrekking tot onze diensten blijven bij Tielo Digital of onze licentiegevers.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">4. Aansprakelijkheid</h2>
        <p className="mb-4">Tielo Digital is niet aansprakelijk voor indirecte schade, waaronder gevolgschade, gederfde winst, gemiste besparingen en schade door bedrijfsstagnatie.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">5. Toepasselijk Recht</h2>
        <p className="mb-4">Op alle rechtsbetrekkingen waarbij Tielo Digital partij is, is uitsluitend het Nederlands recht van toepassing.</p>
      </section>
    </PolicyLayout>
  );
}