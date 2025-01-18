import { ContentfulImage } from './common';

export interface ContentfulSEO {
  fields: {
    internalName: string;
    pageTitle: string;
    pageDescription?: string;
    canonicalUrl?: string;
    nofollow: boolean;
    noindex: boolean;
    shareImages?: ContentfulImage[];
  };
}