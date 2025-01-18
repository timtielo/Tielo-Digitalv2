import { useState, useEffect } from 'react';
import { ContentfulBlogPost } from '../lib/contentful/types';
import { getBlogPost } from '../lib/contentful/queries/blog';
import { ContentfulError } from '../lib/contentful/errors';

export function useBlogPost(slug: string) {
  const [post, setPost] = useState<ContentfulBlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getBlogPost(slug);
        setPost(data);
      } catch (err) {
        const message = err instanceof ContentfulError 
          ? 'Er ging iets mis bij het laden van het artikel'
          : 'Er is een onverwachte fout opgetreden';
        setError(message);
        console.error('Error fetching blog post:', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  return { post, isLoading, error };
}