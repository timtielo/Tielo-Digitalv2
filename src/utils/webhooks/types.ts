export interface WebhookPayload {
  submittedAt: string;
  formType: 'analysis' | 'guide';
  firstName: string;
  email: string;
  lastName?: string;
  phone?: string;
  company?: string;
  website?: string;
  mainQuestion?: string;
  automationTasks?: string;
  timeSpent?: string;
  foundUs?: string;
}