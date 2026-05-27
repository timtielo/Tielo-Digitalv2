import { supabase } from '../lib/supabase/client';

const DOMAIN = 'tielo-digital.nl';

function getSessionId(): string {
  let id = sessionStorage.getItem('td_session_id');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('td_session_id', id);
  }
  return id;
}

function getVisitorId(): string {
  let id = localStorage.getItem('td_visitor_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('td_visitor_id', id);
  }
  return id;
}

export async function trackEvent(
  eventName: string,
  buttonName: string,
  buttonLocation: string,
  metadata: Record<string, any> = {}
): Promise<void> {
  try {
    await supabase.from('events').insert({
      session_id: getSessionId(),
      visitor_id: getVisitorId(),
      event_name: eventName,
      event_type: 'click',
      button_name: buttonName,
      button_location: buttonLocation,
      page_path: window.location.pathname,
      domain: DOMAIN,
      metadata,
    });
  } catch {
    // Silently fail — tracking must never break the UX
  }
}
