import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextType {
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[300px] max-w-md
                ${toast.type === 'success' ? 'bg-green-50 border border-green-200' : ''}
                ${toast.type === 'error' ? 'bg-red-50 border border-red-200' : ''}
                ${toast.type === 'info' ? 'bg-blue-50 border border-blue-200' : ''}
              `}
            >
              {toast.type === 'success' && <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />}
              {toast.type === 'error' && <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />}
              {toast.type === 'info' && <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />}

              <p className={`
                text-sm flex-1
                ${toast.type === 'success' ? 'text-green-900' : ''}
                ${toast.type === 'error' ? 'text-red-900' : ''}
                ${toast.type === 'info' ? 'text-blue-900' : ''}
              `}>
                {toast.message}
              </p>

              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 opacity-70 hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
