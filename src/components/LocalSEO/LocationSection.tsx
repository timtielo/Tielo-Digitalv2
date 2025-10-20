import React from 'react';
import { MapPin, Users, Building2 } from 'lucide-react';
import { BUSINESS_INFO } from '../../config/business';

export function LocationSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              AI Automatisering in {BUSINESS_INFO.address.addressLocality}
            </h2>
            <p className="text-xl text-gray-600">
              Lokaal gevestigd, landelijk bereikbaar voor digitale transformatie
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lokaal Bereikbaar</h3>
              <p className="text-gray-600">
                Gevestigd in {BUSINESS_INFO.address.addressLocality} voor persoonlijk contact
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Landelijk Actief</h3>
              <p className="text-gray-600">
                Dienstverlening door heel Nederland
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Voor Elk Bedrijf</h3>
              <p className="text-gray-600">
                Van MKB tot enterprise organisaties
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">
              Onze Regio's
            </h3>
            <p className="text-gray-600 mb-6">
              Tielo Digital bedient bedrijven in de volgende steden en regio's:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {BUSINESS_INFO.areaServed.map((area, index) => (
                <div key={index} className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-gray-700">{area}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
