import React from 'react';
import { ContentfulImage } from '../../../lib/contentful/types/common';

interface BlogImageProps {
  image?: ContentfulImage | null;
  title: string;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=800&h=450';

export function BlogImage({ image, title }: BlogImageProps) {
  const imageUrl = image?.fields?.file?.url;
  
  return (
    <div className="aspect-[16/9] overflow-hidden">
      <img
        src={imageUrl ? `https:${imageUrl}?w=800&h=450&fit=fill` : FALLBACK_IMAGE}
        alt={title}
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src = FALLBACK_IMAGE;
        }}
      />
    </div>
  );
}