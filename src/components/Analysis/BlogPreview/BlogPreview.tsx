import React from 'react';
import { motion } from 'framer-motion';
import { RecentPosts } from './RecentPosts';
import { BlogPreviewTitle } from './BlogPreviewTitle';

export function BlogPreview() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <BlogPreviewTitle />
          <RecentPosts />
        </motion.div>
      </div>
    </section>
  );
}