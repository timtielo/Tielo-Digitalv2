import type { ContentfulSys, ContentfulImage, ContentfulAuthor } from './common';

export interface ContentfulBlogPost {
  sys: ContentfulSys;
  fields: {
    title: string;
    slug: string;
    shortDescription?: string;
    content: any; // Rich text content
    publishedDate: string;
    readingTime?: number;
    featuredImage?: ContentfulImage;
    author?: ContentfulAuthor;
    relatedBlogPosts?: ContentfulBlogPost[];
  };
}