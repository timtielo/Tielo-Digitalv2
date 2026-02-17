import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader } from 'lucide-react';
import { useGuideForm } from '../../hooks/useGuideForm';

export function GuideForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    email: ''
  });

  const { isLoading, error, submitForm } = useGuideForm();

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-bold text-white mb-2 uppercase tracking-wide">
            Voornaam *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            className="w-full px-4 py-3 bg-white border border-tielo-steel/20 rounded-td
                     focus:outline-none focus:ring-2 focus:ring-tielo-orange focus:border-transparent
                     text-tielo-navy placeholder:text-tielo-navy/30"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-bold text-white mb-2 uppercase tracking-wide">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-4 py-3 bg-white border border-tielo-steel/20 rounded-td
                     focus:outline-none focus:ring-2 focus:ring-tielo-orange focus:border-transparent
                     text-tielo-navy placeholder:text-tielo-navy/30"
          />
        </div>

        {error && (
          <div className="text-tielo-orange text-sm font-medium">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3 bg-tielo-orange text-white rounded-td font-bold
                   hover:bg-tielo-orange/90 transition-all duration-300
                   hover:scale-[1.02] active:scale-[0.98]
                   flex items-center justify-center gap-2
                   disabled:opacity-50 disabled:cursor-not-allowed
                   shadow-lg hover:shadow-xl"
        >
          {isLoading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Even geduld...
            </>
          ) : (
            <>
              Stuur mij de guide
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}