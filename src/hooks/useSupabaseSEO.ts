import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase/client';

export interface SEOSettings {
  internal_name: string;
  page_title: string;
  page_description: string | null;
  canonical_url: string | null;
  nofollow: boolean;
  noindex: boolean;
  share_image_url: string | null;
}

export function useSupabaseSEO(internalName: string) {
  const [seo, setSEO] = useState<SEOSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSEO() {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase
          .from('seo_settings')
          .select('*')
          .eq('internal_name', internalName)
          .single();

        if (supabaseError) {
          throw supabaseError;
        }

        setSEO(data);
      } catch (err) {
        console.error('Error fetching SEO settings:', err);
        setError('Failed to load SEO settings');
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