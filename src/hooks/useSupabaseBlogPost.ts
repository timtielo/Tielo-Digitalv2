import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';
import type { SupabaseBlogPost } from './useSupabaseBlogPosts';

const TIELO_USER_ID = 'a3111414-1473-4443-8f6c-2fbdd4fd0c7d';

export function useSupabaseBlogPost(slug: string) {
  const [post, setPost] = useState<SupabaseBlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<SupabaseBlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .eq('user_id', TIELO_USER_ID)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!data) {
        setError('Blog post niet gevonden');
        return;
      }

      setPost(data);

      // Fetch related posts based on categories
      if (data.categories && data.categories.length > 0) {
        const { data: related } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('status', 'published')
          .eq('user_id', TIELO_USER_ID)
          .neq('id', data.id)
          .overlaps('categories', data.categories)
          .order('published_at', { ascending: false })
          .limit(3);

        setRelatedPosts(related || []);
      }
    } catch (err) {
      console.error('Error fetching blog post:', err);
      setError('Fout bij laden van blog post');
    } finally {
      setIsLoading(false);
    }
  };

  return { post, relatedPosts, isLoading, error };
}
