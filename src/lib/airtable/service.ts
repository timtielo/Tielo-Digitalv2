import { companiesTable } from './client';
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
    const records = await companiesTable
      .select({
        filterByFormula: `{Slug} = '${slug}'`,
        maxRecords: 1,
      })
      .firstPage();

    if (records.length === 0) {
      return null;
    }

    const company = transformRecord(records[0]);
    setCachedData(cacheKey, company);
    return company;
  } catch (error) {
    console.error('Error fetching company by slug:', error);
    throw new Error('Failed to fetch company data from Airtable');
  }
};

export const getCompaniesByBusinessType = async (businessType: BusinessType): Promise<Company[]> => {
  const cacheKey = `businessType:${businessType}`;

  try {
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
    const records = await companiesTable.select().firstPage();
    return records.map(transformRecord);
  } catch (error) {
    console.error('Error fetching all companies:', error);
    throw new Error('Failed to fetch companies from Airtable');
  }
};
