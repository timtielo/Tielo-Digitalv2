import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Lisa van der Berg',
    role: 'CEO, TechFlow BV',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150',
    quote: 'Dankzij Tielo Digital hebben we onze klantenservice volledig kunnen automatiseren. De chatbot werkt perfect en onze klanten zijn zeer tevreden.',
    rating: 5
  },
  {
    name: 'Mark de Vries',
    role: 'Operations Manager, InnovateCo',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150',
    quote: 'De AI-oplossingen van Tielo Digital hebben onze productiviteit met 40% verhoogd. Een geweldige investering voor ons bedrijf.',
    rating: 5
  },
  {
    name: 'Sophie Jansen',
    role: 'CTO, DataPro Solutions',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150',
    quote: 'Professioneel team met uitstekende kennis van AI en automatisering. Ze denken echt mee met je bedrijf.',
    rating: 5
  }
];

export function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 font-rubik">
            Wat Onze Klanten Zeggen
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ontdek waarom bedrijven kiezen voor Tielo Digital
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-8 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center gap-2 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">"{testimonial.quote}"</p>
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}