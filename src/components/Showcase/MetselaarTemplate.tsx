import { motion } from 'framer-motion';
import { CheckCircle2, Award, Clock, Shield, Phone, Mail } from 'lucide-react';
import type { Company } from '../../types/airtable';

interface MetselaarTemplateProps {
  company: Company;
}

export const MetselaarTemplate = ({ company }: MetselaarTemplateProps) => {
  const services = [
    'Gevelmetselwerk',
    'Restauratie & Renovatie',
    'Schoorsteenbouw',
    'Tuinmuren & Siermetselwerk',
    'Voegwerk & Onderhoud',
    'Nieuwbouw Metselwerk',
  ];

  const benefits = [
    { icon: Award, title: 'Vakmanschap', description: 'Hoogwaardige kwaliteit door ervaren vakmensen' },
    { icon: Shield, title: 'Garantie', description: 'Uitgebreide garantie op al ons werk' },
    { icon: Clock, title: 'Op Tijd', description: 'Altijd binnen de afgesproken planning' },
  ];

  const projects = [
    {
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop',
      title: 'Woning Renovatie',
      description: 'Compleet gevelmetselwerk',
    },
    {
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop',
      title: 'Nieuwbouw Project',
      description: 'Traditioneel metselwerk',
    },
    {
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      title: 'Siermetselwerk',
      description: 'Handgemaakte tuinmuur',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1920&h=1080&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/95 to-stone-900/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {company.logoUrl && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <img
                src={company.logoUrl}
                alt={`${company.businessName} logo`}
                className="h-24 w-auto mx-auto"
              />
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            {company.businessName}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-amber-100 mb-8 max-w-3xl mx-auto"
          >
            Hallo, ik ben {company.firstName}. Vakkundig metselwerk met oog voor detail en duurzaamheid.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="#contact"
              className="px-8 py-4 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors shadow-xl"
            >
              Direct Contact
            </a>
            <a
              href="#portfolio"
              className="px-8 py-4 bg-white text-amber-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-xl"
            >
              Bekijk Ons Werk
            </a>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Onze Diensten</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Van traditioneel metselwerk tot moderne geveloplossingen
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <CheckCircle2 className="h-10 w-10 text-amber-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{service}</h3>
                <p className="text-gray-600">
                  Professioneel en met jarenlange ervaring uitgevoerd
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-6">
                    <Icon className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="portfolio" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Onze Projecten</h2>
            <p className="text-xl text-gray-600">
              Bekijk enkele van onze recent afgeronde projecten
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-gray-200">{project.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 bg-amber-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Neem Contact Op</h2>
          <p className="text-xl text-amber-100 mb-12">
            Wilt u meer weten over onze diensten? {company.firstName} helpt u graag verder!
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <a
              href="tel:+31612345678"
              className="flex items-center justify-center gap-3 bg-white text-amber-900 px-6 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <Phone className="h-5 w-5" />
              Bel Direct
            </a>
            <a
              href="mailto:info@example.com"
              className="flex items-center justify-center gap-3 bg-amber-800 text-white px-6 py-4 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
            >
              <Mail className="h-5 w-5" />
              Stuur Email
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="mb-2">{company.businessName}</p>
          <p className="text-sm text-gray-500">
            Professioneel metselwerk door {company.firstName} en zijn team
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Website ontwikkeld door <a href="/" className="text-amber-500 hover:text-amber-400">Tielo Digital</a>
          </p>
        </div>
      </footer>
    </div>
  );
};
