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

// Cache key for localStorage
const SEO_CACHE_KEY = 'seo_settings_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

function getCachedSEO(internalName: string): { seo: SEOSettings | null; timestamp: number } | null {
  try {
    const cached = localStorage.getItem(`${SEO_CACHE_KEY}_${internalName}`);
    return cached ? JSON.parse(cached) : null;
  } catch (err) {
    console.error('Error reading from cache:', err);
    return null;
  }
}

function setCachedSEO(internalName: string, seo: SEOSettings) {
  try {
    localStorage.setItem(
      `${SEO_CACHE_KEY}_${internalName}`,
      JSON.stringify({
        seo,
        timestamp: Date.now()
      })
    );
  } catch (err) {
    console.error('Error writing to cache:', err);
  }
}

export function useSupabaseSEO(internalName: string) {
  const [seo, setSEO] = useState<SEOSettings | null>(() => {
    const cached = getCachedSEO(internalName);
    return cached && Date.now() - cached.timestamp < CACHE_DURATION ? cached.seo : null;
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchSEO() {
      try {
        // Check cache first
        const cached = getCachedSEO(internalName);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          if (isMounted) {
            setSEO(cached.seo);
            setIsLoading(false);
            return;
          }
        }

        // Fetch from Supabase with retry logic
        let attempts = 0;
        const maxAttempts = 3;
        let lastError: any;

        while (attempts < maxAttempts) {
          try {
            const { data, error: supabaseError } = await supabase
              .from('seo_settings')
              .select('*')
              .eq('internal_name', internalName)
              .single();

            if (supabaseError) throw supabaseError;

            if (isMounted && data) {
              setSEO(data);
              setCachedSEO(internalName, data);
              setError(null);
              break;
            }
          } catch (err) {
            lastError = err;
            attempts++;
            if (attempts < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
            }
          }
        }

        if (attempts === maxAttempts) {
          throw lastError;
        }
      } catch (err) {
        console.error('Error fetching SEO settings:', err);
        if (isMounted) {
          // On error, try to use cached data if available
          const cached = getCachedSEO(internalName);
          if (cached) {
            setSEO(cached.seo);
            setError('Using cached SEO data');
          } else {
            setError('Failed to load SEO settings');
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchSEO();

    return () => {
      isMounted = false;
    };
  }, [internalName]);

  return { seo, isLoading, error };
}