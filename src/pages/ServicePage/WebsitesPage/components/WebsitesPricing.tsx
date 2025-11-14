import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';

export function WebsitesPricing() {
  const scrollToForm = () => {
    document.getElementById('website-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 font-rubik">
            Investering
          </h2>
          <p className="text-xl text-gray-600">
            Duidelijke prijzen, geen verborgen kosten
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-1">Eenmalig</div>
                  <div className="text-4xl font-bold text-gray-900">€750</div>
                  <div className="text-gray-600">Pakketprijs website</div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Gratis opzetje vooraf</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Volledige website op maat</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Domeinregistratie & DNS</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Google Business opzetten</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">WhatsApp integratie</span>
                  </li>
                </ul>
              </div>

              <div>
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-1">Maandelijks</div>
                  <div className="text-4xl font-bold text-gray-900">€25</div>
                  <div className="text-gray-600">Hosting + onderhoud</div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Snelle en veilige hosting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Doorlopend onderhoud</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">SSL certificaat</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Kleine aanpassingen</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Technische ondersteuning</span>
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={scrollToForm}
              className="w-full px-8 py-4 bg-primary text-white rounded-lg
                       font-semibold text-lg hover:bg-primary/90 transition-all duration-300
                       hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl
                       flex items-center justify-center gap-2"
            >
              Vraag jouw gratis opzetje aan
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
