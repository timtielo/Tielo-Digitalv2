import { ContentfulSys, ContentfulImage, ContentfulAuthor } from './common';

export interface ContentfulOplossing {
  sys: ContentfulSys;
  fields: {
    internalName: string;
    title: string;
    slug: string;
    shortDescription?: string;
    content: any; // Rich text content
    publishedDate: string;
    readingTime: number;
    featuredImage: ContentfulImage;
    author?: ContentfulAuthor;
    relatedBlogPosts?: ContentfulOplossing[];
  };
}