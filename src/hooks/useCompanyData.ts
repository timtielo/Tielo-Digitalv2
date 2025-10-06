import { useState, useEffect } from 'react';
import { getCompanyBySlug } from '../lib/airtable';
import type { Company } from '../types/airtable';

interface UseCompanyDataResult {
  company: Company | null;
  loading: boolean;
  error: string | null;
}

export const useCompanyData = (slug: string | undefined): UseCompanyDataResult => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setError('No slug provided');
      return;
    }

    const fetchCompany = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCompanyBySlug(slug);

        if (!data) {
          setError('Company not found');
          setCompany(null);
        } else {
          setCompany(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load company data');
        setCompany(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [slug]);

  return { company, loading, error };
};
