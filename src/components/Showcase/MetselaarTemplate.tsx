import { motion } from 'framer-motion';
import { CheckCircle2, Award, Clock, Shield, Phone, Mail } from 'lucide-react';
import type { Company } from '../../types/airtable';

interface MetselaarTemplateProps {
  company: Company;
}

export const MetselaarTemplate = ({ company }: MetselaarTemplateProps) => {
  const services = [
    {
      title: 'Gevelmetselwerk',
      description: 'Vakkundig metselwerk voor nieuwbouw en renovatie. Van moderne gevels tot klassieke baksteen.',
    },
    {
      title: 'Restauratie & voegwerk',
      description: 'Herstel van historische gebouwen en professioneel voegwerk dat generaties meegaat.',
    },
    {
      title: 'Schoorsteenbouw',
      description: 'Bouwen en herstellen van schoorstenen volgens traditionele ambachtelijke methoden.',
    },
    {
      title: 'Tuinmuren & erfafscheidingen',
      description: 'Duurzame tuinmuren en siermetselen die uw buitenruimte compleet maken.',
    },
    {
      title: 'Natuursteen & klinkers',
      description: 'Bestraten met natuursteen, klinkers en sierstenen voor een tijdloos resultaat.',
    },
    {
      title: 'Speciaalbouw',
      description: 'Barbecues, pizza-ovens en maatwerk metselconstructies voor binnen en buiten.',
    },
  ];

  const benefits = [
    {
      icon: Award,
      title: 'Erkend vakmanschap',
      description: '20+ jaar ervaring met traditioneel en modern metselwerk'
    },
    {
      icon: Shield,
      title: 'Volledige garantie',
      description: 'Uitgebreide garantie op materiaal en vakkundig uitgevoerd werk'
    },
    {
      icon: Clock,
      title: 'Betrouwbaar & netjes',
      description: 'Op tijd, volgens planning en met oog voor detail en netheid op locatie'
    },
  ];

  const projects = [
    {
      image: 'https://images.pexels.com/photos/1106386/pexels-photo-1106386.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      title: 'Gevelrenovatie woonhuis',
      description: 'Complete gevelrenovatie met handvorm bakstenen in halfsteensverband',
    },
    {
      image: 'https://images.pexels.com/photos/259958/pexels-photo-259958.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      title: 'Nieuwbouw luxe villa',
      description: 'Hoogwaardig metselwerk met speciale voegafwerking',
    },
    {
      image: 'https://images.pexels.com/photos/164522/pexels-photo-164522.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      title: 'Historische restauratie',
      description: 'Herstel monumentaal pand met originele materialen',
    },
    {
      image: 'https://images.pexels.com/photos/271667/pexels-photo-271667.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      title: 'Tuinmuur met sierboog',
      description: 'Traditionele tuinmuur met decoratieve boogconstructie',
    },
    {
      image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      title: 'Schoorsteen nieuwbouw',
      description: 'Massieve schoorsteen met klassieke detaillering',
    },
    {
      image: 'https://images.pexels.com/photos/1838640/pexels-photo-1838640.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      title: 'Bestrating natuursteen',
      description: 'Oprit en terras in grijze natuursteen met accenten',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1106386/pexels-photo-1106386.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-800/80 to-slate-700/85" />
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
                className="h-28 w-auto mx-auto drop-shadow-2xl"
              />
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg"
          >
            {company.businessName}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-slate-200 mb-4 max-w-3xl mx-auto font-medium"
          >
            Vakkundig metselwerk sinds 2003
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto"
          >
            Hallo, ik ben {company.firstName}. Met mijn team lever ik hoogwaardig metselwerk voor particulieren en bedrijven. Van gevelmetselwerk tot complete restauraties.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="#contact"
              className="group px-8 py-4 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-all shadow-2xl hover:shadow-amber-500/50 hover:scale-105"
            >
              <span className="flex items-center justify-center gap-2">
                Gratis offerte aanvragen
                <Phone className="h-5 w-5 group-hover:rotate-12 transition-transform" />
              </span>
            </a>
            <a
              href="#portfolio"
              className="px-8 py-4 bg-white/95 backdrop-blur text-slate-900 font-semibold rounded-lg hover:bg-white transition-all shadow-2xl hover:scale-105"
            >
              Bekijk ons werk
            </a>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Onze diensten</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Van traditioneel ambacht tot moderne technieken - compleet metselwerk onder één dak
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-amber-200 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl flex items-center justify-center group-hover:from-amber-200 group-hover:to-amber-100 transition-colors">
                      <CheckCircle2 className="h-6 w-6 text-amber-700" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-900 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Waarom kiezen voor ons?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Kwaliteit, betrouwbaarheid en vakmanschap staan bij ons voorop
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="portfolio" className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Recent afgeronde projecten</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Een selectie van ons vakwerk - van nieuwbouw tot restauratie
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-amber-500/20 transition-all duration-500"
              >
                <div className="aspect-[4/3] overflow-hidden bg-gray-800">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-gray-200 text-sm leading-relaxed opacity-90">{project.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-gray-400 text-lg">
              Wilt u ook zo'n mooi resultaat? Neem contact op voor de mogelijkheden
            </p>
          </motion.div>
        </div>
      </section>

      <section id="contact" className="py-24 bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1106386/pexels-photo-1106386.jpeg?auto=compress&cs=tinysrgb&w=1920')] opacity-10 bg-cover bg-center" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Vraag een gratis offerte aan</h2>
            <p className="text-xl text-amber-50 mb-4 max-w-2xl mx-auto leading-relaxed">
              Heeft u een metselproject? {company.firstName} komt graag vrijblijvend bij u langs voor een persoonlijk advies en een scherpe offerte.
            </p>
            <p className="text-lg text-amber-100">
              Bel, mail of WhatsApp voor een snelle reactie
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto"
          >
            <a
              href={`tel:${company.phoneNumber || '+31612345678'}`}
              className="group flex items-center justify-center gap-3 bg-white text-slate-900 px-8 py-5 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-2xl hover:scale-105 hover:shadow-white/20"
            >
              <Phone className="h-6 w-6 group-hover:rotate-12 transition-transform" />
              <span>Bel direct</span>
            </a>
            <a
              href={`mailto:${company.email || 'info@example.com'}`}
              className="flex items-center justify-center gap-3 bg-amber-950 text-white px-8 py-5 rounded-xl font-bold hover:bg-black transition-all shadow-2xl hover:scale-105"
            >
              <Mail className="h-6 w-6" />
              <span>Stuur email</span>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-amber-100 text-sm">
              ✓ Gratis advies en offerte  ✓ Snelle reactietijd  ✓ Geen verrassingen achteraf
            </p>
          </motion.div>
        </div>
      </section>

      <footer className="bg-gray-950 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {company.logoUrl && (
              <img
                src={company.logoUrl}
                alt={`${company.businessName} logo`}
                className="h-16 w-auto mx-auto mb-6 opacity-80"
              />
            )}
            <h3 className="text-2xl font-bold text-white mb-2">{company.businessName}</h3>
            <p className="text-gray-400 mb-8">
              Professioneel metselwerk door {company.firstName} en zijn ervaren team
            </p>

            <div className="border-t border-gray-800 pt-8">
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} {company.businessName}. Alle rechten voorbehouden.
              </p>
              <p className="text-sm text-gray-600 mt-3">
                Website ontwikkeld door{' '}
                <a
                  href="https://tielodigital.nl"
                  className="text-amber-500 hover:text-amber-400 font-medium transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Tielo Digital
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
