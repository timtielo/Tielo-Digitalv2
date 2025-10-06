import Airtable from 'airtable';
import { airtableConfig } from '../../config/airtable';

let airtableInstance: Airtable | null = null;

export const getAirtableClient = () => {
  if (!airtableInstance) {
    console.log('Initializing Airtable client...');
    console.log('API Key present:', !!airtableConfig.apiKey);
    console.log('Base ID:', airtableConfig.baseId);
    console.log('Table Name:', airtableConfig.tableName);

    if (!airtableConfig.apiKey || !airtableConfig.baseId) {
      throw new Error('Airtable is not configured. Please add VITE_AIRTABLE_API_KEY and VITE_AIRTABLE_BASE_ID to your .env file.');
    }
    airtableInstance = new Airtable({ apiKey: airtableConfig.apiKey });
    console.log('Airtable client initialized successfully');
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
