import React from 'react';
import { motion } from 'framer-motion';
import { ContentfulBlogPost } from '../../../lib/contentful/types/blog';
import { BlogCard } from '../BlogCard';

interface RelatedPostsProps {
  posts?: ContentfulBlogPost[] | null;
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts?.length) return null;

  return (
    <section className="mt-16 pt-8 border-t">
      <h2 className="text-2xl font-bold mb-8 font-rubik">Gerelateerde artikelen</h2>
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
    </section>
  );
}