import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from '../Link';

export function WebsitesSection() {
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 font-rubik">
              Websites voor Bouwbedrijven
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Geen gedoe met Werkspot of DNS settings. Ik regel alles voor je
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 md:p-8 lg:p-12">
            <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-center">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 md:mb-4">
                  Jij doet jouw werk gewoon, ik regel de rest
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 md:mb-6">
                  Ik maak een gratis website-opzetje voor jouw bouwbedrijf. Geen gedoe, geen technische rompslomp.
                  Jij hoeft alleen te vertellen wat je doet, de rest regel ik.
                </p>
                <div className="space-y-4 mb-8">
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Wat ik voor je regel:</p>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span>Domein + hosting volledig geregeld</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span>Google Business Profiel aanmaken en optimaliseren</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span>WhatsApp knop voor directe klantcontact</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span>Contact formulier dat naar je mail komt</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span>Klaar om te gebruiken zonder technische kennis</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <Link
                  href="/diensten/websites"
                  className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all duration-200"
                >
                  Meer informatie
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&h=600"
                  alt="Website Development"
                  className="rounded-lg shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}