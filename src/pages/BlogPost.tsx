import React from 'react';
import { useSupabaseBlogPost } from '../hooks/useSupabaseBlogPost';
import { Loader, Calendar, User } from 'lucide-react';
import { SEO } from '../components/SEO';
import { BlogNewsletter } from '../components/blog/BlogNewsletter';
import { TipTapRenderer } from '../components/Dashboard/TipTapRenderer';
import { Link } from '../components/Link';
import { motion } from 'framer-motion';

interface BlogPostProps {
  slug: string;
}

export function BlogPost({ slug }: BlogPostProps) {
  const { post, relatedPosts, isLoading, error } = useSupabaseBlogPost(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-tielo-orange" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen pt-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-red-600">{error || 'Blog post niet gevonden'}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt}
        ogType="article"
        ogImage={post.featured_image_url || undefined}
        canonical={`https://www.tielo-digital.nl/blog/${post.slug}`}
      />

      <article className="min-h-screen bg-white">
        <div className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <header className="mb-12">
                {post.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.categories.map((category) => (
                      <span
                        key={category}
                        className="px-3 py-1 text-sm font-medium rounded-full bg-tielo-orange/10 text-tielo-orange"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                )}

                <h1 className="text-4xl md:text-5xl font-bold mb-6 font-rubik text-tielo-navy">
                  {post.title}
                </h1>

                {post.excerpt && (
                  <p className="text-xl text-gray-600 mb-8">
                    {post.excerpt}
                  </p>
                )}

                <div className="flex items-center gap-6 text-sm text-gray-500">
                  {post.author_name && (
                    <div className="flex items-center gap-2">
                      {post.author_avatar_url ? (
                        <img
                          src={post.author_avatar_url}
                          alt={post.author_name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-tielo-orange/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-tielo-orange" />
                        </div>
                      )}
                      <span className="font-medium text-tielo-navy">{post.author_name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={post.published_at || post.created_at}>
                      {new Date(post.published_at || post.created_at).toLocaleDateString('nl-NL', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  </div>
                  <span>{post.reading_time} min leestijd</span>
                </div>
              </header>

              {/* Featured Image */}
              {post.featured_image_url && (
                <div className="mb-12">
                  <img
                    src={post.featured_image_url}
                    alt={post.title}
                    className="w-full rounded-td shadow-md"
                  />
                </div>
              )}

              {/* Content */}
              <div className="prose prose-lg max-w-none">
                <TipTapRenderer content={post.content} />
              </div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="mt-16 pt-16 border-t border-gray-200">
                  <h2 className="text-2xl font-bold mb-8 text-tielo-navy">Gerelateerde artikelen</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {relatedPosts.map((relatedPost) => (
                      <motion.article
                        key={relatedPost.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-gray-50 rounded-td overflow-hidden hover:shadow-md transition-shadow group"
                      >
                        <Link href={`/blog/${relatedPost.slug}`} className="block">
                          {relatedPost.featured_image_url && (
                            <div className="aspect-video overflow-hidden">
                              <img
                                src={relatedPost.featured_image_url}
                                alt={relatedPost.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                              />
                            </div>
                          )}
                          <div className="p-4">
                            <h3 className="font-semibold text-tielo-navy group-hover:text-tielo-orange transition-colors line-clamp-2 mb-2">
                              {relatedPost.title}
                            </h3>
                            {relatedPost.excerpt && (
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {relatedPost.excerpt}
                              </p>
                            )}
                          </div>
                        </Link>
                      </motion.article>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <BlogNewsletter />
      </article>
    </>
  );
}