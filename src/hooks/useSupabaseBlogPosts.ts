import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';

const TIELO_USER_ID = 'a3111414-1473-4443-8f6c-2fbdd4fd0c7d';

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
  user_profiles?: {
    name: string;
    business_name: string;
    profile_picture: string | null;
  };
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

      // Build query with user profile join
      let query = supabase
        .from('blog_posts')
        .select(`
          *,
          user_profiles (
            name,
            business_name,
            profile_picture
          )
        `, { count: 'exact' })
        .eq('status', 'published')
        .eq('user_id', TIELO_USER_ID)
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
