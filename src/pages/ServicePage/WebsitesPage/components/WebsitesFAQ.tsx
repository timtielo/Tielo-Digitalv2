import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'Hoe snel sta ik live?',
    answer: 'Gemiddeld binnen 2 weken. Na de eerste call bouw ik versie 1, jij geeft feedback, en na akkoord gaat de website live.',
  },
  {
    question: 'Moet ik teksten aanleveren?',
    answer: 'Nee. Ik schrijf alle teksten voor je op basis van ons gesprek. Jij hoeft ze alleen te controleren.',
  },
  {
    question: 'Wat als ik later wil uitbreiden?',
    answer: 'Dat kan altijd. Extra pagina\'s, functies of aanpassingen bespreek ik graag met je. De website groeit mee met je bedrijf.',
  },
  {
    question: 'Zit ik ergens aan vast?',
    answer: 'Nee. Het jaarlijkse hosting- en onderhoudspakket is maandelijks opzegbaar. De website blijft altijd van jou.',
  },
];

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="td-card shadow-sharp overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4"
      >
        <span className="font-semibold text-tielo-navy">{question}</span>
        <ChevronDown className={`w-5 h-5 text-tielo-navy/40 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 sm:px-6 pb-5 sm:pb-6">
              <p className="text-tielo-navy/60 leading-relaxed">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function WebsitesFAQ() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-3 block">
              Veelgestelde vragen
            </span>
            <h2 className="text-3xl font-bold text-tielo-navy">FAQ</h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <FAQItem key={index} {...faq} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
