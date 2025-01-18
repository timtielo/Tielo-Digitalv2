import { ContentfulImage } from './common';

export interface ContentfulAuthor {
  fields: {
    internalName: string;
    name: string;
    avatar?: ContentfulImage | null;
    bio?: string;
  };
}