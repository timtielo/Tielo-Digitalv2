import React, { useState } from 'react';
import { BlogNewsletter } from '../components/blog/BlogNewsletter';
import { useSupabaseBlogPosts } from '../hooks/useSupabaseBlogPosts';
import { Loader, Calendar, Clock, ChevronRight, User } from 'lucide-react';
import { SEO } from '../components/SEO';
import { Link } from '../components/Link';
import { motion } from 'framer-motion';

export function Blog() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { posts, isLoading, error, totalPages } = useSupabaseBlogPosts(selectedCategory, currentPage, 12);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-tielo-offwhite">
        <Loader className="w-8 h-8 animate-spin text-tielo-orange" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-32 px-4 bg-tielo-offwhite">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <p className="text-tielo-navy/60">Er is een fout opgetreden bij het laden van de blogs</p>
        </div>
      </div>
    );
  }

  const allCategories = Array.from(
    new Set(posts.flatMap(post => post.categories))
  ).sort();

  return (
    <div className="min-h-screen bg-tielo-offwhite">
      <SEO
        title="Blog - Inzichten & Tips"
        description="Ontdek de laatste inzichten over AI, automatisering en digitale transformatie. Praktische tips en strategieën voor jouw bedrijf."
        keywords={[
          'AI Blog',
          'Automatisering Blog',
          'Digitale Transformatie',
          'Tech Nieuws',
          'Business Innovation',
          'Bouwbedrijf Automatisering',
          'Website Tips'
        ]}
        ogType="website"
        canonical="https://www.tielo-digital.nl/blog"
      />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-tielo-navy relative overflow-hidden">
        <div className="absolute inset-0 td-striped opacity-30" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-[10px] uppercase font-bold tracking-widest text-tielo-orange mb-3 block">
                Kennisbank
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 font-rubik text-white">
                Blog & Inzichten
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
                Praktische tips, strategieën en inzichten over digitalisering, automatisering en online groeien.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      {allCategories.length > 0 && (
        <section className="py-8 border-b border-tielo-navy/10">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-td font-medium transition-all ${
                    selectedCategory === null
                      ? 'bg-tielo-orange text-white shadow-sm'
                      : 'bg-white text-tielo-navy hover:bg-tielo-steel/10 border border-tielo-navy/10'
                  }`}
                >
                  Alles
                </button>
                {allCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-td font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-tielo-orange text-white shadow-sm'
                        : 'bg-white text-tielo-navy hover:bg-tielo-steel/10 border border-tielo-navy/10'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {posts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20 td-card max-w-md mx-auto"
              >
                <p className="text-tielo-navy/60 mb-4">
                  {selectedCategory
                    ? `Geen blogs gevonden in deze categorie.`
                    : 'Nog geen blogs beschikbaar. Check later terug!'
                  }
                </p>
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-tielo-orange hover:text-tielo-orange/80 font-medium"
                  >
                    Bekijk alle blogs
                  </button>
                )}
              </motion.div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {posts.map((post, index) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="td-card overflow-hidden hover:shadow-lg transition-all duration-300 group"
                    >
                      <Link href={`/blog/${post.slug}`} className="block h-full flex flex-col">
                        {post.featured_image_url && (
                          <div className="aspect-video overflow-hidden bg-tielo-steel/10">
                            <img
                              src={post.featured_image_url}
                              alt={post.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <div className="p-6 flex-1 flex flex-col">
                          {post.categories.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {post.categories.slice(0, 2).map((category) => (
                                <span
                                  key={category}
                                  className="px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-full bg-tielo-orange/10 text-tielo-orange"
                                >
                                  {category}
                                </span>
                              ))}
                            </div>
                          )}
                          <h2 className="text-xl font-bold mb-3 text-tielo-navy group-hover:text-tielo-orange transition-colors line-clamp-2 flex-shrink-0">
                            {post.title}
                          </h2>
                          {post.excerpt && (
                            <p className="text-tielo-navy/70 mb-4 line-clamp-3 flex-grow">
                              {post.excerpt}
                            </p>
                          )}

                          {(post.user_profiles?.name || post.author_name) && (
                            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-tielo-navy/5">
                              {(post.user_profiles?.profile_picture || post.author_avatar_url) ? (
                                <img
                                  src={post.user_profiles?.profile_picture || post.author_avatar_url || ''}
                                  alt={post.user_profiles?.name || post.author_name}
                                  className="w-8 h-8 rounded-full object-cover border border-tielo-navy/10"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-tielo-orange/10 flex items-center justify-center">
                                  <User className="w-4 h-4 text-tielo-orange" />
                                </div>
                              )}
                              <div className="flex flex-col text-xs">
                                <span className="font-medium text-tielo-navy">
                                  {post.user_profiles?.name || post.author_name}
                                </span>
                                {post.user_profiles?.business_name && (
                                  <span className="text-tielo-navy/50">
                                    {post.user_profiles.business_name}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-sm text-tielo-navy/50 border-t border-tielo-navy/5 pt-4 mt-auto">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <time dateTime={post.published_at || post.created_at}>
                                {new Date(post.published_at || post.created_at).toLocaleDateString('nl-NL', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </time>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{post.reading_time} min</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-tielo-orange font-medium mt-4 group-hover:gap-3 transition-all">
                            Lees meer
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-td font-bold transition-all ${
                          currentPage === page
                            ? 'bg-tielo-orange text-white shadow-sm'
                            : 'bg-white text-tielo-navy hover:bg-tielo-steel/10 border border-tielo-navy/10'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <BlogNewsletter />
    </div>
  );
}
