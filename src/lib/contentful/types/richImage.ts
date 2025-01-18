import { ContentfulImage } from './common';

export interface ContentfulRichImage {
  fields: {
    internalName: string;
    image: ContentfulImage;
    caption?: string;
    fullWidth: boolean;
  };
}