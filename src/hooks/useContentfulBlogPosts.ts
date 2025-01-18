import { useState, useEffect } from 'react';
import { ContentfulBlogPost } from '../lib/contentful/types';
import { getBlogPosts, getBlogPostsByCategory } from '../lib/contentful/queries';
import { ContentfulError } from '../lib/contentful/errors';

export function useContentfulBlogPosts(category: string | null, page = 1, limit = 12) {
  const [posts, setPosts] = useState<ContentfulBlogPost[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchPosts() {
      try {
        setIsLoading(true);
        setError(null);
        
        const result = category 
          ? await getBlogPostsByCategory(category, page, limit)
          : await getBlogPosts(page, limit);
        
        if (isMounted) {
          setPosts(result.posts);
          setTotalPages(result.totalPages);
        }
      } catch (err) {
        if (isMounted) {
          const message = err instanceof ContentfulError 
            ? 'Er ging iets mis bij het laden van de blogs'
            : 'Er is een onverwachte fout opgetreden';
          setError(message);
          console.error('Error fetching blog posts:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchPosts();

    return () => {
      isMounted = false;
    };
  }, [category, page, limit]);

  return { posts, isLoading, error, totalPages };
}