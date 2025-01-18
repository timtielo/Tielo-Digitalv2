import React from 'react';
import { Clock } from 'lucide-react';
import { formatDate } from '../../../utils/date';

interface BlogMetaProps {
  readingTime?: number;
  publishedDate?: string;
}

export function BlogMeta({ readingTime = 5, publishedDate }: BlogMetaProps) {
  const formattedDate = publishedDate ? formatDate(publishedDate) : '';

  return (
    <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
      {publishedDate && (
        <time dateTime={publishedDate}>
          {formattedDate}
        </time>
      )}
      <div className="flex items-center">
        <Clock className="w-4 h-4 mr-1" />
        {readingTime} min leestijd
      </div>
    </div>
  );
}