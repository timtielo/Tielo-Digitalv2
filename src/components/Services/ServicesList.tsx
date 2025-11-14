import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Brain } from 'lucide-react';
import { Link } from '../Link';

export function ServicesList() {
  useEffect(() => {
    // Scroll to service section if hash is present
    const hash = window.location.hash;
    if (hash) {
      const element = document.getElementById(hash.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 font-rubik">
              Maatwerk Oplossingen
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Heeft u specifieke behoeften die standaard oplossingen niet dekken? Wij ontwikkelen custom oplossingen op maat
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl p-8 md:p-12 shadow-sm"
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative order-2 md:order-1">
                <img
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&h=600"
                  alt="Maatwerk Oplossingen"
                  className="rounded-lg shadow-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
              </div>
              <div className="order-1 md:order-2">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  Custom oplossingen voor uw specifieke behoeften
                </h3>
                <p className="text-gray-600 mb-6">
                  Elk bedrijf is uniek en heeft soms specifieke uitdagingen die standaard software niet kan oplossen.
                  Wij bedenken en bouwen custom oplossingen die perfect aansluiten bij uw bedrijfsprocessen.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Technische analyse van uw situatie</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Op maat gemaakte software oplossingen</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Begeleiding bij implementatie</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Doorlopend onderhoud en support</span>
                  </li>
                </ul>
                <Link
                  href="/diensten/custom"
                  className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all duration-200"
                >
                  Meer informatie
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}