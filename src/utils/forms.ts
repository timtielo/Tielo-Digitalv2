import { FormData } from '../types/forms';
import { FORM_CONFIG } from '../config/forms';
import { supabase } from '../lib/supabase/client';
import { submitToWebhook } from './webhooks';

export async function submitForm(formData: FormData): Promise<boolean> {
  try {
    // Submit to both webhook and Supabase in parallel
    const [webhookResult, { error: supabaseError }] = await Promise.all([
      submitToWebhook(formData),
      supabase.from('form_submissions').insert({
        form_type: formData.formType,
        first_name: formData.firstName,
        email: formData.email,
        submitted_at: formData.submittedAt,
        ...(formData.formType === 'analysis' && {
          last_name: formData.lastName,
          phone: formData.phone,
          company: formData.company,
          website: formData.website,
          main_question: formData.mainQuestion,
          automation_tasks: formData.automationTasks,
          time_spent: formData.timeSpent,
          found_us: formData.foundUs
        })
      })
    ]);

    if (supabaseError) {
      console.error('Supabase error:', supabaseError);
      return false;
    }

    return webhookResult;
  } catch (error) {
    console.error('Error submitting form:', error);
    return false;
  }
}