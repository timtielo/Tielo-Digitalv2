import { useState, useEffect } from 'react';
import { ContentfulBlogPost, getContentfulBlogPost } from '../lib/contentful';

export function useContentfulBlogPost(slug: string) {
  const [post, setPost] = useState<ContentfulBlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getContentfulBlogPost(slug);
        setPost(data);
      } catch (err) {
        setError('Failed to fetch blog post');
        console.error('Error fetching blog post:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  return { post, isLoading, error };
}