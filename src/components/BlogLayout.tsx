import React from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { NewsletterForm } from './Newsletter/NewsletterForm';

const categories = [
  'Customer Service',
  'Content Creation',
  'Innovaties',
  'Artificial Intelligence',
  'Automatisering',
  'Marketing'
];

interface BlogLayoutProps {
  children: React.ReactNode;
}

export function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <div className="min-h-screen bg-offWhite pt-24">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-rubik">
              Onze Blogs
            </h1>
            <p className="text-xl text-gray-600">
              Blijf op de hoogte van de laatste trends en inzichten in AI en automatisering
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Zoek blogs..."
                className="w-full pl-12 pr-4 py-3 bg-white rounded-lg border border-gray-200 
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 bg-white rounded-lg border border-gray-200 whitespace-nowrap
                           hover:border-primary hover:text-primary transition-colors duration-200"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Content */}
          {children}

          {/* Newsletter Signup */}
          <NewsletterForm />
        </motion.div>
      </div>
    </div>
  );
}