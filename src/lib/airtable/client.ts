import Airtable from 'airtable';
import { airtableConfig } from '../../config/airtable';

let airtableInstance: Airtable | null = null;

export const getAirtableClient = () => {
  if (!airtableInstance) {
    if (!airtableConfig.apiKey || !airtableConfig.baseId) {
      throw new Error('Airtable is not configured. Please add VITE_AIRTABLE_API_KEY and VITE_AIRTABLE_BASE_ID to your .env file.');
    }
    airtableInstance = new Airtable({ apiKey: airtableConfig.apiKey });
  }
  return airtableInstance;
};

export const getBase = () => {
  const airtable = getAirtableClient();
  return airtable.base(airtableConfig.baseId);
};

export const getCompaniesTable = () => {
  const base = getBase();
  return base(airtableConfig.tableName);
};
