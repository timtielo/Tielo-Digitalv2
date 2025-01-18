// Base interfaces for common fields
export interface ContentfulSys {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContentfulImage {
  fields: {
    file: {
      url: string;
    };
    title: string;
  };
}

// SEO Component
export interface ContentfulSEO {
  fields: {
    pageTitle: string;
    pageDescription: string;
    canonicalUrl?: string;
    shareImage?: ContentfulImage;
  };
}

// Blog Post
export interface ContentfulBlogPost {
  sys: ContentfulSys;
  fields: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string[];
    featuredImage?: ContentfulImage;
  };
}

// Landing Page
export interface ContentfulLandingPage {
  sys: ContentfulSys;
  fields: {
    internalName: string;
    seoFields?: ContentfulSEO;
    featuredBlogPost?: ContentfulBlogPost;
  };
}

export interface ContentfulResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
  includes?: {
    Entry: any[];
    Asset: any[];
  };
}