// Configuration file for form-related settings
export const FORM_CONFIG = {
  // Webhook URL for form submissions
  WEBHOOK_URL: 'https://script.google.com/macros/s/AKfycbyOkkAsLHS-TOLbfGiJKJPQ1ApvIuNaEj09o76EEIRRBsozzaXSImMXAtb6p682I8QGNw/exec',
  
  // Form types
  FORM_TYPES: {
    GUIDE: 'guide',
    ANALYSIS: 'analysis'
  } as const,

  // Sheet names
  SHEET_NAMES: {
    GUIDE: 'Guide',
    ANALYSIS: 'Analysis'
  } as const
} as const;