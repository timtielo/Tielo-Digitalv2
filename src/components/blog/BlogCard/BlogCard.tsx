import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from '../../Link';
import { ContentfulBlogPost } from '../../../lib/contentful/types/blog';
import { BlogMeta } from './BlogMeta';
import { BlogImage } from './BlogImage';
import { BlogContent } from './BlogContent';
import { BlogCategories } from './BlogCategories';

interface BlogCardProps {
  post?: ContentfulBlogPost | null;
}

export function BlogCard({ post }: BlogCardProps) {
  if (!post?.fields?.title || !post?.fields?.slug) {
    return null;
  }

  const { fields } = post;

  return (
    <Link href={`/blog/${fields.slug}`}>
      <motion.article 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group h-full flex flex-col"
      >
        <BlogImage 
          image={fields.featuredImage} 
          title={fields.title} 
        />
        <div className="p-6 flex-1 flex flex-col">
          {fields.categories && (
            <BlogCategories categories={fields.categories} />
          )}
          <BlogMeta 
            readingTime={fields.readingTime} 
            publishedDate={fields.publishedDate} 
          />
          <BlogContent
            title={fields.title}
            description={fields.shortDescription}
          />
          <div className="mt-auto pt-4 flex items-center text-primary font-medium group-hover:gap-2 transition-all duration-200">
            Lees meer
            <ArrowRight className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </motion.article>
    </Link>
  );
}