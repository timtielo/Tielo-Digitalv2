import React from 'react';
import { motion } from 'framer-motion';
import { BlogCard } from '../BlogCard';
import { getAllBlogs } from '../../utils/blogStorage';

export function BlogPreview() {
  const blogs = getAllBlogs()
    .filter(blog => blog.status === 'published')
    .slice(0, 3);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-3xl font-bold mb-12 font-rubik text-center">
            Laatste Blogs
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                title={blog.title}
                excerpt={blog.content.substring(0, 150).replace(/<[^>]*>/g, '') + '...'}
                category={blog.category}
                readTime={`${Math.ceil(blog.content.split(' ').length / 250)} min`}
                date={new Date(blog.createdAt).toLocaleDateString('nl-NL')}
                image={blog.image?.url || 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=800&h=400'}
                slug={blog.seo.slug}
                isNew={new Date().getTime() - new Date(blog.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}