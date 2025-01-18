import { FormData } from '../../types/forms';
import { WebhookPayload } from './types';

export function formatWebhookPayload(formData: FormData): WebhookPayload {
  const basePayload = {
    submittedAt: new Date().toISOString(),
    formType: formData.formType,
    firstName: formData.firstName,
    email: formData.email,
  };

  if (formData.formType === 'analysis') {
    return {
      ...basePayload,
      lastName: formData.lastName || '',
      phone: formData.phone || '',
      company: formData.company || '',
      website: formData.website || '',
      mainQuestion: formData.mainQuestion || '',
      automationTasks: formData.automationTasks || '',
      timeSpent: formData.timeSpent || '',
      foundUs: formData.foundUs || ''
    };
  }

  return basePayload;
}