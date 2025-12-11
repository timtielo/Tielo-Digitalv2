export interface BlogPost {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: any;
  featured_image_url: string | null;
  status: 'draft' | 'published';
  categories: string[];
  author_name?: string;
  author_avatar_url?: string;
  meta_title: string;
  meta_description: string;
  reading_time: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogCategory {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface BlogPostFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string | null;
  status: 'draft' | 'published';
  categories: string[];
  meta_title: string;
  meta_description: string;
}
