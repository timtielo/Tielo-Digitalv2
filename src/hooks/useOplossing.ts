import { useState, useEffect } from 'react';
import { ContentfulOplossing } from '../lib/contentful/types/oplossingen';
import { getOplossing } from '../lib/contentful/queries/oplossingen';
import { ContentfulError } from '../lib/contentful/errors';

export function useOplossing(slug: string) {
  const [oplossing, setOplossing] = useState<ContentfulOplossing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOplossing() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getOplossing(slug);
        setOplossing(data);
      } catch (err) {
        const message = err instanceof ContentfulError 
          ? 'Er ging iets mis bij het laden van de oplossing'
          : 'Er is een onverwachte fout opgetreden';
        setError(message);
        console.error('Error fetching oplossing:', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      fetchOplossing();
    }
  }, [slug]);

  return { oplossing, isLoading, error };
}