import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';

export interface SupabaseBlogPost {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: any;
  featured_image_url: string | null;
  status: 'draft' | 'published';
  categories: string[];
  author_name: string;
  author_avatar_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  reading_time: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export function useSupabaseBlogPosts(
  selectedCategory: string | null = null,
  currentPage: number = 1,
  limit: number = 10
) {
  const [posts, setPosts] = useState<SupabaseBlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, currentPage, limit]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Build query
      let query = supabase
        .from('blog_posts')
        .select('*', { count: 'exact' })
        .eq('status', 'published')
        .order('published_at', { ascending: false, nullsFirst: false });

      // Filter by category if selected
      if (selectedCategory) {
        query = query.contains('categories', [selectedCategory]);
      }

      // Apply pagination
      const from = (currentPage - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error: fetchError, count } = await query;

      if (fetchError) throw fetchError;

      setPosts(data || []);
      setTotalPages(Math.ceil((count || 0) / limit));
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError('Fout bij laden van blogs');
    } finally {
      setIsLoading(false);
    }
  };

  return { posts, isLoading, error, totalPages };
}
