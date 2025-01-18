import React from 'react';
import { FileCheck, Clock, Award } from 'lucide-react';

interface CaseStudy {
  project: {
    title: string;
    description: string;
  };
  background: {
    challenge: string;
    solution: string;
  };
  testimonial: {
    quote: string;
    author: string;
    role: string;
    company: string;
  };
}

const caseStudy: CaseStudy = {
  project: {
    title: 'Automatisering - Finance',
    description: 'Honderden handmatige boekingen vanuit een boekingssysteem naar een boekhoudsysteem. Niet alleen heel tijdrovend, ook worden er gemakkelijk fouten gemaakt. In de boekhouding is dat niet handig.'
  },
  background: {
    challenge: 'Bij deze klant werden er handmatig honderden facturen handmatig geboekt. Informatie uit het boekprogramma moest naar het boekhoudprogramma. Honderden keren dezelfde handeling, copy-paste.',
    solution: 'Dit process is nu succesvol geautomatiseerd.'
  },
  testimonial: {
    quote: 'Tim is een all-round IT & finance professional waarmee je snel kan schakelen. Van advies tot implementatie: Tim zorgt ervoor dat doelen snel bereikt worden. Nieuwe uitdagingen grijpt hij direct aan en hij is hierin erg nieuwsgierig en leergierig. Voor Terrasboot heeft hij onder andere een koppeling ontwikkeld en geïmplementeerd om betalingen automatisch te factureren en in te boeken. Dit bespaart ons uren tijd en hiermee heeft Tim zich dubbel en dwars terugverdiend. Wij zullen Tim vaker benaderen voor complexe vraagstukken.',
    author: 'Quinten Grundmeijer',
    role: 'Eigenaar',
    company: 'Terrasboot'
  }
};

export function CaseStudyTestimonial() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 font-rubik">
              Succesverhalen
            </h2>
            <p className="text-xl text-gray-600">
              Ontdek hoe wij bedrijven helpen groeien met automatisering
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 p-8">
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-blue-600">
                    {caseStudy.project.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {caseStudy.project.description}
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">De Uitdaging</h4>
                      <p className="text-gray-600">{caseStudy.background.challenge}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileCheck className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">De Oplossing</h4>
                      <p className="text-gray-600">{caseStudy.background.solution}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-8 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <blockquote className="text-gray-600 italic mb-6">
                  "{caseStudy.testimonial.quote}"
                </blockquote>
                <div>
                  <p className="font-semibold">{caseStudy.testimonial.author}</p>
                  <p className="text-gray-500">
                    {caseStudy.testimonial.role} bij {caseStudy.testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}