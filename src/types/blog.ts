export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  categories: string[];
  seo: {
    slug: string;
    metaTitle: string;
    metaDescription: string;
  };
  image: {
    url: string;
    alt: string;
  } | null;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}