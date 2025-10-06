import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Eye, Phone, Mail } from 'lucide-react';
import { MetselaarTemplate } from '../components/Showcase/MetselaarTemplate';
import { SEO } from '../components/SEO/SEO';
import type { Company } from '../types/airtable';

const demoCompany: Company = {
  id: 'demo',
  businessName: 'Metselwerken Van der Berg',
  slug: 'demo',
  businessType: 'Metselaar',
  firstName: 'Jan',
  logoUrl: '',
  phoneNumber: '+31612345678',
  email: 'info@metselwerken.nl',
};

export const MetselaarShowcase = () => {
  return (
    <>
      <SEO
        title="Website Voorbeeld voor Metselaars - Tielo Digital"
        description="Bekijk een voorbeeld van een professionele website voor metselaars. Moderne, responsive design geoptimaliseerd voor lokale SEO en klantacquisitie."
        noindex={true}
      />

      <div className="min-h-screen bg-white">
        <section className="bg-gradient-to-br from-orange-600 via-red-600 to-red-700 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Eye className="h-4 w-4" />
                <span>Website Voorbeeld - Metselaar</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Professionele Website voor Metselaars
              </h1>
              <p className="text-xl text-orange-100 max-w-3xl mx-auto mb-8 leading-relaxed">
                Dit is een voorbeeld van hoe uw metselaarsbedrijf online kan stralen. Modern design,
                geoptimaliseerd voor mobiel en klaar om klanten aan te trekken.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#demo"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-orange-900 font-semibold rounded-lg hover:bg-orange-50 transition-all shadow-2xl hover:scale-105"
                >
                  Bekijk Het Voorbeeld
                  <ArrowRight className="h-5 w-5" />
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-orange-700 text-white font-semibold rounded-lg hover:bg-orange-800 transition-all shadow-xl"
                >
                  Vraag Uw Eigen Website Aan
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Wat Zit Er In Uw Website?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Alles wat u nodig heeft om online klanten te winnen
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Moderne Hero Sectie',
                  description: 'Imposante eerste indruk met uw logo en bedrijfsnaam',
                },
                {
                  title: 'Diensten Overzicht',
                  description: 'Duidelijke presentatie van al uw metselwerk diensten',
                },
                {
                  title: 'Project Portfolio',
                  description: 'Showcase van afgeronde projecten met mooie foto\'s',
                },
                {
                  title: 'USP\'s & Voordelen',
                  description: 'Waarom klanten voor uw bedrijf moeten kiezen',
                },
                {
                  title: 'Contact Formulier',
                  description: 'Directe telefoon en email knoppen voor contact',
                },
                {
                  title: 'Mobiel Responsive',
                  description: 'Perfect zichtbaar op alle apparaten en schermformaten',
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-xl shadow-lg"
                >
                  <CheckCircle2 className="h-10 w-10 text-orange-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="demo" className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Live Voorbeeld
              </h2>
              <p className="text-lg text-gray-600">
                Scroll door de website hieronder (dit is een voorbeeld met demo content)
              </p>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-2xl border-8 border-gray-200">
              <MetselaarTemplate company={demoCompany} />
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-orange-600 to-red-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Klaar Om Uw Eigen Website Te Krijgen?
              </h2>
              <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
                Neem contact op en binnen enkele dagen heeft u een professionele website
                die klanten aantrekt en conversies verhoogt.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+31612345678"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-orange-900 font-semibold rounded-lg hover:bg-orange-50 transition-all shadow-2xl hover:scale-105"
                >
                  <Phone className="h-5 w-5" />
                  Bel Direct
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-orange-700 text-white font-semibold rounded-lg hover:bg-orange-800 transition-all shadow-xl"
                >
                  <Mail className="h-5 w-5" />
                  Stuur Bericht
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};
