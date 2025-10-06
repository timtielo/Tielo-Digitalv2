import { getCompaniesTable } from './client';
import type { AirtableCompanyRecord, Company, BusinessType } from '../../types/airtable';

const transformRecord = (record: any): Company => {
  const fields = record.fields;
  return {
    id: record.id,
    firstName: fields.Voornaam || '',
    slug: fields.Slug || '',
    businessType: fields['Business type'] || '',
    businessName: fields.Bedrijfsnaam || '',
    logoUrl: fields.Logo?.[0]?.url,
    phoneNumber: fields.Telefoonnummer || '',
    email: fields.Email || '',
    createdTime: record._rawJson?.createdTime || new Date().toISOString(),
  };
};

const cache = new Map<string, { data: Company; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000;

const getCachedData = (key: string): Company | null => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

const setCachedData = (key: string, data: Company) => {
  cache.set(key, { data, timestamp: Date.now() });
};

export const getCompanyBySlug = async (slug: string): Promise<Company | null> => {
  const cacheKey = `company:${slug}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const companiesTable = getCompaniesTable();
    const records = await companiesTable
      .select({
        filterByFormula: `{Slug} = '${slug}'`,
        maxRecords: 1,
      })
      .firstPage();

    if (records.length === 0) {
      console.log('No records found for slug:', slug);
      return null;
    }

    const company = transformRecord(records[0]);
    setCachedData(cacheKey, company);
    return company;
  } catch (error) {
    console.error('Error fetching company by slug:', slug, error);
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
};

export const getCompaniesByBusinessType = async (businessType: BusinessType): Promise<Company[]> => {
  const cacheKey = `businessType:${businessType}`;

  try {
    const companiesTable = getCompaniesTable();
    const records = await companiesTable
      .select({
        filterByFormula: `{Business type} = '${businessType}'`,
      })
      .firstPage();

    return records.map(transformRecord);
  } catch (error) {
    console.error('Error fetching companies by business type:', error);
    throw new Error('Failed to fetch companies from Airtable');
  }
};

export const getAllCompanies = async (): Promise<Company[]> => {
  try {
    const companiesTable = getCompaniesTable();
    const records = await companiesTable.select().firstPage();
    return records.map(transformRecord);
  } catch (error) {
    console.error('Error fetching all companies:', error);
    throw new Error('Failed to fetch companies from Airtable');
  }
};
