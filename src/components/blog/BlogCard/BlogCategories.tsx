import React from 'react';

interface BlogCategoriesProps {
  categories: string[];
}

export function BlogCategories({ categories }: BlogCategoriesProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {categories.map((category) => (
        <span
          key={category}
          className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full"
        >
          {category}
        </span>
      ))}
    </div>
  );
}