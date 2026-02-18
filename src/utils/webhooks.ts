import { FormData } from '../types/forms';
import { WEBHOOK_CONFIG } from '../config/webhooks';

export async function submitToWebhook(formData: FormData): Promise<boolean> {
  try {
    const webhookUrl = WEBHOOK_CONFIG.URLS.ANALYSIS;
    const sourcePage = typeof window !== 'undefined' ? window.location.pathname : '';

    const payload = {
      timestamp: formData.submittedAt,
      formType: formData.formType,
      sourcePage,
      firstName: formData.firstName,
      email: formData.email,
      lastName: formData.formType === 'analysis' ? formData.lastName || '' : '',
      phone: formData.formType === 'analysis' ? formData.phone || '' : '',
      company: formData.formType === 'analysis' ? formData.company || '' : '',
      ...(formData.formType === 'analysis' && {
        website: formData.website || '',
        mainQuestion: formData.mainQuestion || '',
        automationTasks: formData.automationTasks || '',
        timeSpent: formData.timeSpent || '',
        foundUs: formData.foundUs || ''
      }),
      ...((formData.formType === 'websites' || formData.formType === 'contact') && {
        name: (formData as any).name || '',
        phone: (formData as any).phone || '',
        company: (formData as any).company || '',
        website: (formData as any).website || '',
        subject: (formData as any).subject || '',
        message: (formData as any).message || '',
      })
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Error submitting to webhook:', error);
    return false;
  }
}