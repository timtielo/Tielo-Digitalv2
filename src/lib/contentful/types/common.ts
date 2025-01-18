export interface ContentfulSys {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContentfulImage {
  fields: {
    file: {
      url: string;
      details?: {
        size: number;
        image?: {
          width: number;
          height: number;
        };
      };
      fileName: string;
      contentType: string;
    };
    title: string;
    description?: string;
  };
}

export interface ContentfulAsset {
  sys: ContentfulSys;
  fields: ContentfulImage['fields'];
}