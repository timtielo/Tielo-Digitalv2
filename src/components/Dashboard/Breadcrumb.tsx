import React from 'react';
import { Home, ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const handleNavigate = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <nav className="flex items-center space-x-2 text-sm mb-4">
      <button
        onClick={() => handleNavigate('/dashboard')}
        className="flex items-center text-gray-400 hover:text-white transition-colors"
        aria-label="Dashboard Home"
      >
        <Home className="w-4 h-4" />
      </button>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-gray-600" />
          {item.path ? (
            <button
              onClick={() => handleNavigate(item.path)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-blue-400 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
