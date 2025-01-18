import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader } from 'lucide-react';
import { useMailchimpForm } from '../../hooks/useMailchimpForm';

export function NewsletterForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    email: ''
  });

  const { isLoading, error, submitForm } = useMailchimpForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await submitForm(formData);
    if (success) {
      window.history.pushState({}, '', '/gratis-guide/bedankt');
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold mb-6 font-rubik">
            Blijf op de hoogte
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Blijf op de hoogte van de nieuwste ontwikkelingen en hoe jij dit toepast in jouw bedrijf.
            Meld je aan voor de nieuwsbrief en ontvang gratis onze AI + Automation guide.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                id="firstName"
                name="firstName"
                required
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="Voornaam"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Email"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-primary text-white rounded-lg font-semibold
                       hover:bg-primary/90 transition-all duration-300
                       hover:scale-[1.02] active:scale-[0.98]
                       flex items-center justify-center gap-2
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Even geduld...
                </>
              ) : (
                <>
                  Aanmelden voor de nieuwsbrief
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}