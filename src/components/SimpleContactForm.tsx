import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface FormData {
  firstName: string;
  email: string;
  question?: string;
}

export function SimpleContactForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    email: '',
    question: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission logic here
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Voornaam"
                required
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg 
                         placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
              />
            </div>

            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg 
                         placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
              />
            </div>

            <div>
              <textarea
                name="question"
                value={formData.question}
                onChange={handleChange}
                placeholder="Belangrijkste vraag (optioneel)"
                rows={3}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg 
                         placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-primary text-white rounded-lg font-semibold
                       hover:bg-primary/90 transition-all duration-300
                       hover:scale-[1.02] active:scale-[0.98]
                       flex items-center justify-center gap-2"
            >
              Verstuur
              <Send className="w-5 h-5" />
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}