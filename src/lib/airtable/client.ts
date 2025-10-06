import Airtable from 'airtable';
import { airtableConfig, validateAirtableConfig } from '../../config/airtable';

validateAirtableConfig();

const airtable = new Airtable({ apiKey: airtableConfig.apiKey });
export const base = airtable.base(airtableConfig.baseId);
export const companiesTable = base(airtableConfig.tableName);
