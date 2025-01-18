import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from '../Link';

export function WebsitesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 font-rubik">
              Website Development
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Naast AI en automatisering, bouwen wij ook professionele websites die jouw bedrijf online laten groeien
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">
                  Moderne websites voor jouw bedrijf
                </h3>
                <p className="text-gray-600 mb-6">
                  Wij ontwikkelen websites die niet alleen mooi zijn, maar ook resultaten leveren. Met focus op gebruiksvriendelijkheid, 
                  snelheid en conversie helpen we jouw bedrijf online succesvol te zijn.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Modern en professioneel design</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>SEO-geoptimaliseerd voor betere vindbaarheid</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Volledig responsive op alle apparaten</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Snelle laadtijden voor betere conversie</span>
                  </li>
                   <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Met ingebouwde koppelingen en integraties</span>
                  </li>
                </ul>
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