import React from 'react';
import { Link } from '../Link';
import { ChevronRight } from 'lucide-react';

interface ServiceLayoutProps {
  children: React.ReactNode;
  serviceName: string;
}

export function ServiceLayout({ children, serviceName }: ServiceLayoutProps) {
  return (
    <div className="min-h-screen">
      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="py-4 flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
            <Link href="/diensten" className="hover:text-primary">Diensten</Link>
            <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
            <span className="text-gray-900">{serviceName}</span>
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}