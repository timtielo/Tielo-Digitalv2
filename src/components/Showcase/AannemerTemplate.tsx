import { motion } from 'framer-motion';
import { Building2, Hammer, Users, TrendingUp, Phone, Mail, CheckCircle } from 'lucide-react';
import type { Company } from '../../types/airtable';

interface AannemerTemplateProps {
  company: Company;
}

export const AannemerTemplate = ({ company }: AannemerTemplateProps) => {
  const services = [
    { title: 'Nieuwbouw', description: 'Volledige nieuwbouwprojecten van A tot Z' },
    { title: 'Verbouwingen', description: 'Aanpassingen en uitbreidingen aan bestaande panden' },
    { title: 'Renovaties', description: 'Modernisering en verbetering van oudere woningen' },
    { title: 'Onderhoud', description: 'Regelmatig onderhoud en herstelwerkzaamheden' },
    { title: 'Projectmanagement', description: 'Coördinatie van complexe bouwprojecten' },
    { title: 'Advies', description: 'Deskundig advies voor elk bouwproject' },
  ];

  const features = [
    {
      icon: Building2,
      title: 'Ervaring',
      description: 'Meer dan 15 jaar ervaring in de bouwsector',
    },
    {
      icon: Users,
      title: 'Deskundig Team',
      description: 'Gecertificeerde professionals met passie voor bouwen',
    },
    {
      icon: TrendingUp,
      title: 'Kwaliteit',
      description: 'Hoogste kwaliteit materialen en afwerking',
    },
    {
      icon: CheckCircle,
      title: 'Betrouwbaar',
      description: 'Transparante communicatie en duidelijke afspraken',
    },
  ];

  const portfolio = [
    {
      image: 'https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=800&h=600&fit=crop',
      title: 'Moderne Villa',
      category: 'Nieuwbouw',
    },
    {
      image: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&h=600&fit=crop',
      title: 'Bedrijfspand',
      category: 'Renovatie',
    },
    {
      image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop',
      title: 'Woonhuis',
      category: 'Verbouwing',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-screen flex items-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&h=1080&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 to-blue-900/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {company.logoUrl && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-8"
              >
                <img
                  src={company.logoUrl}
                  alt={`${company.businessName} logo`}
                  className="h-20 w-auto"
                />
              </motion.div>
            )}

            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6"
            >
              {company.businessName}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-blue-100 mb-8"
            >
              Welkom! Ik ben {company.firstName}, uw betrouwbare aannemer voor al uw bouwprojecten.
              Van nieuwbouw tot renovatie, wij realiseren uw droomproject.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#contact"
                className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-xl"
              >
                Vraag Offerte Aan
              </a>
              <a
                href="#diensten"
                className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-xl"
              >
                Bekijk Diensten
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="diensten" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Onze Diensten</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Totaaloplossingen voor al uw bouwprojecten
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-blue-600"
              >
                <Hammer className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Gerealiseerde Projecten</h2>
            <p className="text-xl text-gray-300">
              Een selectie van onze succesvolle projecten
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {portfolio.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-xl shadow-2xl"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
                  <span className="inline-block px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full mb-3 w-fit">
                    {project.category}
                  </span>
                  <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-600 to-slate-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Waarom Kiezen Voor {company.businessName}?</h2>
          <p className="text-xl text-blue-100 mb-12">
            Bij {company.businessName} staat kwaliteit voorop. {company.firstName} en zijn team zorgen
            ervoor dat elk project met zorg en precisie wordt uitgevoerd, van begin tot eind.
          </p>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            {[
              'Transparante prijzen en duidelijke offertes',
              'Persoonlijk contact en maatwerk oplossingen',
              'Alle werkzaamheden onder één dak',
            ].map((point, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-blue-300 flex-shrink-0 mt-1" />
                <p className="text-blue-50">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Start Uw Project</h2>
          <p className="text-xl text-gray-600 mb-12">
            Neem vandaag nog contact op met {company.firstName} voor een vrijblijvend gesprek
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <a
              href="tel:+31612345678"
              className="flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-5 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
            >
              <Phone className="h-6 w-6" />
              <span>Bel Direct</span>
            </a>
            <a
              href="mailto:info@example.com"
              className="flex items-center justify-center gap-3 bg-slate-700 text-white px-8 py-5 rounded-lg font-semibold hover:bg-slate-800 transition-colors shadow-lg"
            >
              <Mail className="h-6 w-6" />
              <span>Email Ons</span>
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg font-semibold mb-2">{company.businessName}</p>
          <p className="text-sm text-gray-400">
            Uw betrouwbare partner in de bouw - geleid door {company.firstName}
          </p>
          <p className="text-sm text-gray-500 mt-6">
            Website ontwikkeld door <a href="/" className="text-blue-400 hover:text-blue-300">Tielo Digital</a>
          </p>
        </div>
      </footer>
    </div>
  );
};
