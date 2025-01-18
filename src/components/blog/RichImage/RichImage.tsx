import React from 'react';
import { ContentfulRichImage } from '../../../lib/contentful/types/richImage';

interface RichImageProps {
  image: ContentfulRichImage;
}

export function RichImage({ image }: RichImageProps) {
  const { fields } = image;
  const imageUrl = fields.image.fields.file.url;
  const imageTitle = fields.image.fields.title;

  return (
    <figure className={`my-8 ${fields.fullWidth ? 'w-full' : 'max-w-2xl mx-auto'}`}>
      <img
        src={imageUrl}
        alt={imageTitle}
        className="w-full rounded-lg"
        loading="lazy"
      />
      {fields.caption && (
        <figcaption className="mt-2 text-sm text-gray-500 text-center">
          {fields.caption}
        </figcaption>
      )}
    </figure>
  );
}