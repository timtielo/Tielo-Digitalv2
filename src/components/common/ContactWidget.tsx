import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { Link } from '../Link';

export function ContactWidget() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasShownMessage, setHasShownMessage] = useState(false);

  useEffect(() => {
    const messageShown = sessionStorage.getItem('contactWidgetMessageShown');

    if (!messageShown) {
      const timer = setTimeout(() => {
        setIsExpanded(true);
        setHasShownMessage(true);
        sessionStorage.setItem('contactWidgetMessageShown', 'true');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsExpanded(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl p-6 w-80 border border-gray-100"
          >
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Sluiten"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-3 mb-4">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-50 rounded-lg p-3"
              >
                <p className="text-gray-800 font-medium">
                  Benieuwd naar de mogelijkheden?
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-50 rounded-lg p-3"
              >
                <p className="text-gray-800">
                  Klik op de button en neem contact op.
                </p>
              </motion.div>
            </div>

            <Link
              href="/contact"
              className="block w-full px-4 py-3 bg-primary text-white rounded-lg font-semibold text-center
                       hover:bg-primary/90 transition-all duration-300
                       hover:scale-[1.02] active:scale-[0.98]"
            >
              Neem contact op
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-lg shadow-lg px-4 py-2 border border-gray-100">
        <p className="text-sm text-gray-700 font-medium whitespace-nowrap">
          Neem contact op:
        </p>
      </div>

      <Link
        href="/contact"
        className="flex items-center justify-center w-14 h-14 bg-primary text-white rounded-full shadow-lg
                 hover:bg-primary/90 transition-all duration-300
                 hover:scale-110 active:scale-95"
        aria-label="Contact opnemen"
      >
        <MessageCircle className="w-6 h-6" />
      </Link>
    </div>
  );
}
