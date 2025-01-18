import { FormData } from '../types/forms';
import { WEBHOOK_CONFIG } from '../config/webhooks';

export async function submitToWebhook(formData: FormData): Promise<boolean> {
  try {
    // Determine which webhook URL to use based on form type
    const webhookUrl = formData.formType === 'analysis' 
      ? WEBHOOK_CONFIG.URLS.ANALYSIS 
      : WEBHOOK_CONFIG.URLS.GUIDE;

    // Format payload according to Make.com webhook expectations
    const payload = {
      timestamp: formData.submittedAt,
      formType: formData.formType,
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