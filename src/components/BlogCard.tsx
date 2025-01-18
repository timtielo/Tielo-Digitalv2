import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from './Link';

interface BlogCardProps {
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  slug: string;
  isNew?: boolean;
}

export function BlogCard({ 
  title, 
  excerpt, 
  category, 
  readTime, 
  date, 
  image, 
  slug,
  isNew 
}: BlogCardProps) {
  // Clean excerpt from HTML tags and limit length
  const cleanExcerpt = excerpt
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .substring(0, 150) // Limit to 150 characters
    .trim();

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${
        isNew ? 'ring-2 ring-primary' : ''
      }`}
    >
      <div className="aspect-w-16 aspect-h-9 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=800&h=400';
          }}
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
            {category}
          </span>
          <div className="flex items-center text-gray-500 text-sm">
            <Clock className="w-4 h-4 mr-1" />
            {readTime}
          </div>
          {isNew && (
            <span className="text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
              Nieuw
            </span>
          )}
        </div>
        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-200">
          <Link href={`/blog/${slug}`}>{title}</Link>
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{cleanExcerpt}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{date}</span>
          <Link
            href={`/blog/${slug}`}
            className="inline-flex items-center text-primary font-medium group-hover:gap-2 transition-all duration-200"
          >
            Lees meer
            <ArrowRight className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}