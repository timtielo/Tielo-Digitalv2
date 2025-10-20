import React from 'react';
import { CheckCircle2, ExternalLink } from 'lucide-react';

export function GoogleBusinessProfileGuide() {
  const steps = [
    {
      title: 'Claim Your Business',
      description: 'Verifieer je bedrijfsprofiel via Google Business Profile',
      action: 'https://business.google.com',
      items: [
        'Zoek je bedrijf op Google Maps',
        'Claim eigenaarschap',
        'Verificatie via postcode of telefoon'
      ]
    },
    {
      title: 'Complete Your Profile',
      description: 'Vul alle bedrijfsinformatie volledig in',
      items: [
        'NAP (Name, Address, Phone) consistent houden',
        'Bedrijfscategorie: "Software bedrijf" of "IT diensten"',
        'Openingstijden: Ma-Vr 09:00-18:00',
        'Website URL en email adres',
        'Bedrijfsbeschrijving met focus op AI en automatisering'
      ]
    },
    {
      title: 'Add Rich Content',
      description: 'Maak je profiel aantrekkelijk met media',
      items: [
        'Logo en cover foto uploaden',
        'Foto\'s van team en kantoor',
        'Video over je diensten',
        'Regelmatige posts over projecten en updates'
      ]
    },
    {
      title: 'Collect Reviews',
      description: 'Bouw vertrouwen op met klantbeoordelingen',
      items: [
        'Vraag tevreden klanten om reviews',
        'Reageer op alle reviews (positief en negatief)',
        'Deel review links na succesvolle projecten',
        'Monitor en beheer je online reputatie'
      ]
    },
    {
      title: 'Use Google Posts',
      description: 'Blijf actief met regelmatige updates',
      items: [
        'Deel nieuwe blogposts en artikelen',
        'Kondig speciale aanbiedingen aan',
        'Update over nieuwe diensten',
        'Events en webinars promoten'
      ]
    },
    {
      title: 'Track Insights',
      description: 'Monitor prestaties en optimaliseer',
      items: [
        'Bekijk hoe klanten je vinden',
        'Analyseer zoekwoorden',
        'Check foto weergaven',
        'Monitor website clicks en bel acties'
      ]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Google Business Profile Optimalisatie
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              Maximaliseer je lokale vindbaarheid met deze essentiële stappen
            </p>
            <a
              href="https://business.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Open Google Business Profile
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    {step.action && (
                      <a
                        href={step.action}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:underline mb-4"
                      >
                        Start hier
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <ul className="space-y-2">
                      {step.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-primary/5 border-2 border-primary/20 rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">Pro Tips</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  <strong>Consistentie is key:</strong> Zorg dat NAP informatie overal identiek is (website, social media, directories)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  <strong>Wekelijkse updates:</strong> Post minimaal 1x per week om actief te blijven
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  <strong>Lokale keywords:</strong> Gebruik "Utrecht", "Nederland" in posts en beschrijvingen
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">
                  <strong>Q&A sectie:</strong> Beantwoord veelgestelde vragen proactief
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
