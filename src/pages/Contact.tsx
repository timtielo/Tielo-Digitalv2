import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight, Loader, CheckCircle } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useFormSubmission } from '../hooks/useFormSubmission';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const { submitForm, isLoading, error } = useFormSubmission('contact');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await submitForm(formData);
    if (success) setIsSuccess(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Contact | Tielo Digital"
        description="Neem contact op via WhatsApp of het formulier. Reactie binnen 1 werkdag."
        keywords={['Contact', 'Tielo Digital', 'Website aanvragen', 'WhatsApp']}
        canonical="https://www.tielo-digital.nl/contact"
      />

      <section className="pt-28 sm:pt-32 pb-16 sm:pb-20 bg-tielo-offwhite relative overflow-hidden">
        <div className="absolute inset-0 td-micro-grid opacity-40" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-3 block">
              Contact
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-tielo-navy mb-6 tracking-tight leading-[1.15]">
              Laten we praten
            </h1>
            <p className="text-lg text-tielo-navy/70 leading-relaxed mb-8">
              Reactie binnen 1 werkdag.
            </p>
            <a
              href="https://wa.me/31612345678"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20BD5A] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-td font-medium text-base sm:text-lg shadow-sm hover:shadow-sharp transition-all duration-200 active:scale-[0.98] min-h-[48px] touch-manipulation inline-flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </a>
          </motion.div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="td-card p-10 shadow-sharp text-center"
              >
                <div className="w-16 h-16 bg-green-50 rounded-td flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-tielo-navy mb-4">Bericht ontvangen!</h2>
                <p className="text-tielo-navy/60">
                  Ik neem binnen 1 werkdag contact met je op.
                </p>
              </motion.div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-10"
                >
                  <h2 className="text-3xl font-bold text-tielo-navy">
                    Of stuur een bericht
                  </h2>
                </motion.div>

                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  onSubmit={handleSubmit}
                  className="td-card p-8 shadow-sharp space-y-6"
                >
                  {error && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-td text-sm">
                      {error}
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-tielo-navy mb-2">Naam *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-td focus:outline-none focus:ring-2 focus:ring-tielo-orange focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-tielo-navy mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-td focus:outline-none focus:ring-2 focus:ring-tielo-orange focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-tielo-navy mb-2">Telefoon</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-td focus:outline-none focus:ring-2 focus:ring-tielo-orange focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-tielo-navy mb-2">Bedrijf</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-td focus:outline-none focus:ring-2 focus:ring-tielo-orange focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-tielo-navy mb-2">Bericht</label>
                    <textarea
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-td focus:outline-none focus:ring-2 focus:ring-tielo-orange focus:border-transparent"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-tielo-orange hover:bg-[#d85515] text-white px-6 py-3 rounded-td font-medium shadow-sm hover:shadow-sharp transition-all duration-200 active:scale-[0.98] min-h-[48px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Even geduld...
                      </>
                    ) : (
                      <>
                        Verstuur
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </motion.form>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
