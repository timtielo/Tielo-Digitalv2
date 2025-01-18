import { useState } from 'react';
import { FormData } from '../types/forms';
import { submitToGoogleSheets } from '../utils/forms';

interface UseMailchimpFormReturn {
  isLoading: boolean;
  error: string | null;
  submitForm: (data: Pick<FormData, 'firstName' | 'email'>) => Promise<boolean>;
}

export function useMailchimpForm(): UseMailchimpFormReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitForm = async (data: Pick<FormData, 'firstName' | 'email'>) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData: FormData = {
        ...data,
        submittedAt: new Date().toISOString(),
        formType: 'guide'
      };

      const success = await submitToGoogleSheets(formData);
      
      if (!success) {
        throw new Error('Er is iets misgegaan bij het versturen van het formulier');
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is iets misgegaan');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    submitForm
  };
}