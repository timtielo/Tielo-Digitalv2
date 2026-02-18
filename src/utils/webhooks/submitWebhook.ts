import { FormData } from '../../types/forms';
import { WEBHOOK_URL } from './config';
import { formatWebhookPayload } from './formatPayload';

export async function submitWebhook(formData: FormData, sourcePage?: string): Promise<boolean> {
  try {
    const payload = formatWebhookPayload(formData, sourcePage);

    const response = await fetch(WEBHOOK_URL, {
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