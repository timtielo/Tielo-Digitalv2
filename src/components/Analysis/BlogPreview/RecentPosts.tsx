import React from 'react';
import { motion } from 'framer-motion';
import { useContentfulBlogPosts } from '../../../hooks/useContentfulBlogPosts';
import { BlogCard } from '../../blog/BlogCard';
import { Loader } from 'lucide-react';

export function RecentPosts() {
  const { posts, isLoading, error } = useContentfulBlogPosts(null, 1, 2); // Get 2 most recent posts

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !posts.length) {
    return null;
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {posts.map((post) => (
        <motion.div
          key={post.sys.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <BlogCard post={post} />
        </motion.div>
      ))}
    </div>
  );
}