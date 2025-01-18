import React from 'react';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from '../Link';
import { ContentfulBlogPost } from '../../lib/contentful/types/blog';
import { Author } from './Author';

interface BlogCardProps {
  post: ContentfulBlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const { fields } = post;
  const imageUrl = fields.featuredImage?.fields.file.url;

  return (
    <Link href={`/blog/${fields.slug}`}>
      <motion.article 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group"
      >
        {/* Featured Image */}
        <div className="aspect-w-16 aspect-h-9 overflow-hidden">
          <img
            src={imageUrl || 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=800&h=400'}
            alt={fields.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="p-6">
          {/* Meta Info */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center text-gray-500 text-sm">
              <Clock className="w-4 h-4 mr-1" />
              {fields.readingTime || '5'} min
            </div>
            <time dateTime={fields.publishedDate} className="text-sm text-gray-500">
              {new Date(fields.publishedDate).toLocaleDateString('nl-NL')}
            </time>
          </div>

          {/* Content */}
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
            {fields.title}
          </h3>
          {fields.shortDescription && (
            <p className="text-gray-600 line-clamp-2">
              {fields.shortDescription}
            </p>
          )}

          {/* Author */}
          {fields.author && (
            <div className="mt-4">
              <Author author={fields.author} />
            </div>
          )}
        </div>
      </motion.article>
    </Link>
  );
}