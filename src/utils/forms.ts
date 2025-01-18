import { FormData } from '../types/forms';
import { FORM_CONFIG } from '../config/forms';

export async function submitToGoogleSheets(formData: FormData): Promise<boolean> {
  try {
    // Format data based on form type
    const payload = {
      // Common fields for all forms
      timestamp: formData.submittedAt,
      firstName: formData.firstName,
      email: formData.email,
      formType: formData.formType,

      // Add analysis-specific fields only if it's an analysis form
      ...(formData.formType === 'analysis' && {
        lastName: formData.lastName || '',
        phone: formData.phone || '',
        company: formData.company || '',
        website: formData.website || '',
        mainQuestion: formData.mainQuestion || '',
        automationTasks: formData.automationTasks || '',
        timeSpent: formData.timeSpent || '',
        foundUs: formData.foundUs || ''
      })
    };

    const response = await fetch(FORM_CONFIG.WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors', // Required for Google Scripts
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    // Since we're using no-cors mode, we can't read the response
    // We'll consider it successful if we get here without an error
    return true;
  } catch (error) {
    console.error('Error submitting form:', error);
    return false;
  }
}