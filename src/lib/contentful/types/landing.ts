import type { ContentfulSys, ContentfulSEO } from './common';
import type { ContentfulBlogPost } from './blog';

export interface ContentfulLandingPage {
  sys: ContentfulSys;
  fields: {
    internalName: string;
    seoFields?: ContentfulSEO;
    featuredBlogPost?: ContentfulBlogPost;
  };
}