import React from 'react';

interface BlogContentProps {
  title: string;
  description?: string;
}

export function BlogContent({ title, description }: BlogContentProps) {
  return (
    <div className="flex-1">
      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      
      {description && (
        <p className="text-gray-600 line-clamp-2">
          {description}
        </p>
      )}
    </div>
  );
}