export interface ContentfulImage {
  fields: {
    file: {
      url: string;
    };
    title: string;
  };
}

export interface ContentfulBlogPost {
  sys: {
    id: string;
    createdAt: string;
    updatedAt: string;
  };
  fields: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string[];
    featuredImage?: ContentfulImage;
  };
}

export interface ContentfulResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}