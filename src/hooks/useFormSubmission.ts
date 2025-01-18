import { useState } from 'react';
import { FormData } from '../types/forms';
import { submitToWebhook } from '../utils/webhooks';

interface UseFormSubmissionReturn<T> {
  isLoading: boolean;
  error: string | null;
  submitForm: (data: T) => Promise<boolean>;
}

export function useFormSubmission<T extends Partial<FormData>>(
  formType: FormData['formType']
): UseFormSubmissionReturn<T> {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitForm = async (data: T) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = {
        ...data,
        submittedAt: new Date().toISOString(),
        formType
      } as FormData;

      const success = await submitToWebhook(formData);
      
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