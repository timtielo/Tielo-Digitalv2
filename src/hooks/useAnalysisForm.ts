import { AnalysisFormData } from '../types/forms';
import { useFormSubmission } from './useFormSubmission';

type AnalysisFormState = Omit<AnalysisFormData, 'submittedAt' | 'formType'>;

export function useAnalysisForm() {
  return useFormSubmission<AnalysisFormState>('analysis');
}