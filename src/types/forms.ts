// Base form interface with common fields
export interface BaseFormData {
  firstName: string;
  email: string;
  submittedAt: string;
  formType: 'analysis' | 'guide';
}

// Guide form - simple form with just name and email
export interface GuideFormData extends BaseFormData {
  formType: 'guide';
}

// Analysis form - full contact form with additional fields
export interface AnalysisFormData extends BaseFormData {
  formType: 'analysis';
  lastName?: string;
  phone?: string;
  company?: string;
  website?: string;
  mainQuestion?: string;
  automationTasks?: string;
  timeSpent?: string;
  foundUs?: string;
}

export type FormData = GuideFormData | AnalysisFormData;