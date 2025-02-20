import { useState, useEffect } from 'react';
import { contentfulClient } from '../lib/contentful/client';
import { ContentfulSEO } from '../lib/contentful/types/seo';

export function useContentfulSEO(internalName: string) {
  const [seo, setSEO] = useState<ContentfulSEO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSEO() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await contentfulClient.getEntries<ContentfulSEO>({
          content_type: 'componentSeo', // Updated to match the content type ID
          'fields.internalName': internalName,
          limit: 1
        });

        if (response.items.length > 0) {
          setSEO(response.items[0]);
        } else {
          console.warn(`No SEO configuration found for: ${internalName}`);
          setError('SEO configuration not found');
        }
      } catch (err) {
        console.error('Error fetching SEO data:', err);
        setError('Failed to load SEO data');
      } finally {
        setIsLoading(false);
      }
    }

    if (internalName) {
      fetchSEO();
    }
  }, [internalName]);

  return { seo, isLoading, error };
}