import { useState, useEffect } from 'react';
import { ContentfulOplossing } from '../lib/contentful/types/oplossingen';
import { getOplossingen } from '../lib/contentful/queries/oplossingen';
import { ContentfulError } from '../lib/contentful/errors';

export function useOplossingen(page = 1) {
  const [oplossingen, setOplossingen] = useState<ContentfulOplossing[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOplossingen() {
      try {
        setIsLoading(true);
        setError(null);
        const result = await getOplossingen(page);
        setOplossingen(result.oplossingen);
        setTotalPages(result.totalPages);
      } catch (err) {
        const message = err instanceof ContentfulError 
          ? 'Er ging iets mis bij het laden van de oplossingen'
          : 'Er is een onverwachte fout opgetreden';
        setError(message);
        console.error('Error fetching oplossingen:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOplossingen();
  }, [page]);

  return { oplossingen, isLoading, error, totalPages };
}