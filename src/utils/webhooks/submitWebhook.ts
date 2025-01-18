import { FormData } from '../../types/forms';
import { WEBHOOK_URLS } from './config';
import { formatWebhookPayload } from './formatPayload';

export async function submitWebhook(formData: FormData): Promise<boolean> {
  try {
    const webhookUrl = formData.formType === 'analysis' 
      ? WEBHOOK_URLS.ANALYSIS 
      : WEBHOOK_URLS.GUIDE;

    const payload = formatWebhookPayload(formData);

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