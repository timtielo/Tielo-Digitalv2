import { GuideFormData } from '../types/forms';
import { useFormSubmission } from './useFormSubmission';

type GuideFormState = Pick<GuideFormData, 'firstName' | 'email'>;

export function useGuideForm() {
  return useFormSubmission<GuideFormState>('guide');
}