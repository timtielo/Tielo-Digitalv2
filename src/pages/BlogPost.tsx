import React from 'react';
import { useSupabaseBlogPost } from '../hooks/useSupabaseBlogPost';
import { Loader, Calendar, User, Clock, ChevronRight, ArrowLeft } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center bg-tielo-offwhite">
        <Loader className="w-8 h-8 animate-spin text-tielo-orange" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen pt-32 px-4 bg-tielo-offwhite">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-red-600 mb-4">{error || 'Blog post niet gevonden'}</p>
          <Link href="/blog" className="inline-flex items-center gap-2 text-tielo-orange hover:text-tielo-orange/80 font-medium">
            <ArrowLeft className="w-4 h-4" />
            Terug naar blog
          </Link>
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

      <article className="min-h-screen bg-tielo-offwhite">
        {/* Header */}
        <header className="bg-tielo-navy pt-32 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 td-striped opacity-30" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Terug naar blog
                </Link>

                {post.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.categories.map((category) => (
                      <span
                        key={category}
                        className="px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-full bg-tielo-orange text-white"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                )}

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 font-rubik text-white">
                  {post.title}
                </h1>

                {post.excerpt && (
                  <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-6 text-sm text-white/70">
                  {(post.user_profiles?.name || post.author_name) && (
                    <div className="flex items-center gap-3">
                      {(post.user_profiles?.profile_picture || post.author_avatar_url) ? (
                        <img
                          src={post.user_profiles?.profile_picture || post.author_avatar_url || ''}
                          alt={post.user_profiles?.name || post.author_name}
                          className="w-10 h-10 rounded-full border-2 border-white/20 object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-tielo-orange/20 flex items-center justify-center border-2 border-tielo-orange/30">
                          <User className="w-5 h-5 text-tielo-orange" />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="font-medium text-white">
                          {post.user_profiles?.name || post.author_name}
                        </span>
                        {post.user_profiles?.business_name && (
                          <span className="text-xs text-white/60">
                            {post.user_profiles.business_name}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={post.published_at || post.created_at}>
                      {new Date(post.published_at || post.created_at).toLocaleDateString('nl-NL', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{post.reading_time} min leestijd</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Featured Image */}
              {post.featured_image_url && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-12 -mt-32 relative z-10"
                >
                  <div className="rounded-td overflow-hidden shadow-lg">
                    <img
                      src={post.featured_image_url}
                      alt={post.title}
                      className="w-full"
                    />
                  </div>
                </motion.div>
              )}

              {/* Article Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="td-card p-8 md:p-12 mb-12"
              >
                <div className="prose prose-lg max-w-none
                  prose-headings:text-tielo-navy prose-headings:font-rubik
                  prose-p:text-tielo-navy/80 prose-p:leading-relaxed
                  prose-a:text-tielo-orange prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-tielo-navy
                  prose-ul:text-tielo-navy/80
                  prose-ol:text-tielo-navy/80
                  prose-blockquote:border-l-tielo-orange prose-blockquote:text-tielo-navy/70
                  prose-img:rounded-td
                ">
                  <TipTapRenderer content={post.content} />
                </div>
              </motion.div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-16 pt-16 border-t border-tielo-navy/10"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-tielo-navy">
                      Gerelateerde artikelen
                    </h2>
                    <Link
                      href="/blog"
                      className="text-tielo-orange hover:text-tielo-orange/80 font-medium inline-flex items-center gap-2"
                    >
                      Alle blogs
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    {relatedPosts.map((relatedPost, index) => (
                      <motion.article
                        key={relatedPost.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="td-card overflow-hidden hover:shadow-lg transition-all group"
                      >
                        <Link href={`/blog/${relatedPost.slug}`} className="block">
                          {relatedPost.featured_image_url && (
                            <div className="aspect-video overflow-hidden bg-tielo-steel/10">
                              <img
                                src={relatedPost.featured_image_url}
                                alt={relatedPost.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                              />
                            </div>
                          )}
                          <div className="p-4">
                            {relatedPost.categories.length > 0 && (
                              <span className="inline-block px-2 py-1 text-xs font-bold uppercase rounded-full bg-tielo-orange/10 text-tielo-orange mb-2">
                                {relatedPost.categories[0]}
                              </span>
                            )}
                            <h3 className="font-bold text-tielo-navy group-hover:text-tielo-orange transition-colors line-clamp-2 mb-2">
                              {relatedPost.title}
                            </h3>
                            {relatedPost.excerpt && (
                              <p className="text-sm text-tielo-navy/70 line-clamp-2 mb-3">
                                {relatedPost.excerpt}
                              </p>
                            )}
                            <div className="text-sm text-tielo-navy/50 flex items-center gap-2">
                              <Clock className="w-3 h-3" />
                              {relatedPost.reading_time} min
                            </div>
                          </div>
                        </Link>
                      </motion.article>
                    ))}
                  </div>
                </motion.div>
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
