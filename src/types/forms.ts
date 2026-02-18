export interface BaseFormData {
  firstName: string;
  email: string;
  submittedAt: string;
  formType: 'analysis' | 'websites' | 'contact';
}

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

// Websites form - contact form for website requests
export interface WebsitesFormData {
  name: string;
  email: string;
  phone?: string;
  company: string;
  website?: string;
  message: string;
  submittedAt: string;
  formType: 'websites';
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  submittedAt: string;
  formType: 'contact';
}

export type FormData = AnalysisFormData | WebsitesFormData | ContactFormData;