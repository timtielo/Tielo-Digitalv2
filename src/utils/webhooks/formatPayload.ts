import { FormData } from '../../types/forms';
import { WebhookPayload } from './types';

export function formatWebhookPayload(formData: FormData, sourcePage?: string): WebhookPayload {
  const basePayload: WebhookPayload = {
    submittedAt: new Date().toISOString(),
    formType: formData.formType,
    sourcePage: sourcePage || (typeof window !== 'undefined' ? window.location.pathname : ''),
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

  if (formData.formType === 'websites') {
    return {
      ...basePayload,
      name: (formData as any).name || '',
      phone: (formData as any).phone || '',
      company: (formData as any).company || '',
      website: (formData as any).website || '',
      message: (formData as any).message || '',
    };
  }

  if (formData.formType === 'contact') {
    return {
      ...basePayload,
      name: (formData as any).name || '',
      phone: (formData as any).phone || '',
      company: (formData as any).company || '',
      subject: (formData as any).subject || '',
      message: (formData as any).message || '',
    };
  }

  return basePayload;
}