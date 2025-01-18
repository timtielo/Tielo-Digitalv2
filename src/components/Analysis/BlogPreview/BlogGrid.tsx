import React from 'react';
import { motion } from 'framer-motion';
import { BlogCard } from '../../blog/BlogCard';
import type { ContentfulBlogPost } from '../../../lib/contentful/types';

interface BlogGridProps {
  posts: ContentfulBlogPost[];
}

export function BlogGrid({ posts }: BlogGridProps) {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {posts.map((post, index) => (
        <motion.div
          key={post.sys.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
        >
          <BlogCard post={post} />
        </motion.div>
      ))}
    </div>
  );
}