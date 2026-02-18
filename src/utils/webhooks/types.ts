export interface WebhookPayload {
  submittedAt: string;
  formType: string;
  sourcePage: string;
  firstName?: string;
  name?: string;
  email: string;
  lastName?: string;
  phone?: string;
  company?: string;
  website?: string;
  message?: string;
  subject?: string;
  mainQuestion?: string;
  automationTasks?: string;
  timeSpent?: string;
  foundUs?: string;
}