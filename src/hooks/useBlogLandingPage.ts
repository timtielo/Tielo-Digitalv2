import { useState, useEffect } from 'react';
import { ContentfulLandingPage } from '../lib/contentful/types';
import { getBlogLandingPage } from '../lib/contentful/queries';
import { ContentfulError } from '../lib/contentful/errors';

export function useBlogLandingPage() {
  const [landingPage, setLandingPage] = useState<ContentfulLandingPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLandingPage() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getBlogLandingPage();
        setLandingPage(data);
      } catch (err) {
        const message = err instanceof ContentfulError 
          ? 'Er ging iets mis bij het laden van de blog pagina'
          : 'Er is een onverwachte fout opgetreden';
        setError(message);
        console.error('Error fetching blog landing page:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLandingPage();
  }, []);

  return { landingPage, isLoading, error };
}