import React from 'react';
import { ContentfulAuthor } from '../../../lib/contentful/types/author';

interface AuthorProps {
  author: ContentfulAuthor;
  className?: string;
}

export function Author({ author, className = '' }: AuthorProps) {
  if (!author?.fields) {
    return null;
  }

  const { fields } = author;
  const avatarUrl = fields.avatar?.fields?.file?.url;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={fields.name}
          className="w-10 h-10 rounded-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500 text-sm">
            {fields.name.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      <div>
        <div className="font-medium text-gray-900">{fields.name}</div>
        <div className="text-sm text-gray-500">Auteur</div>
      </div>
    </div>
  );
}