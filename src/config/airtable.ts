export const airtableConfig = {
  apiKey: import.meta.env.VITE_AIRTABLE_API_KEY,
  baseId: import.meta.env.VITE_AIRTABLE_BASE_ID,
  tableName: 'Table 1',
};

export const validateAirtableConfig = () => {
  if (!airtableConfig.apiKey) {
    throw new Error('Airtable API key is not configured. Please add VITE_AIRTABLE_API_KEY to your .env file.');
  }
  if (!airtableConfig.baseId) {
    throw new Error('Airtable Base ID is not configured. Please add VITE_AIRTABLE_BASE_ID to your .env file.');
  }
};
