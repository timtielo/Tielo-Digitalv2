import React, { useState } from 'react';
import { BlogNewsletter } from '../components/blog/BlogNewsletter';
import { useSupabaseBlogPosts } from '../hooks/useSupabaseBlogPosts';
import { Loader, Calendar } from 'lucide-react';
import { SEO } from '../components/SEO';
import { Link } from '../components/Link';
import { motion } from 'framer-motion';

export function Blog() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { posts, isLoading, error, totalPages } = useSupabaseBlogPosts(selectedCategory, currentPage, 12);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-tielo-orange" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <p className="text-gray-600">Er is een fout opgetreden bij het laden van de blogs</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Blog"
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
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4 font-rubik text-tielo-navy">
                Blog
              </h1>
              <p className="text-xl text-gray-600">
                Inzichten en nieuws over AI en automatisering
              </p>
            </div>

            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">
                  Nog geen blogs beschikbaar. Check later terug!
                </p>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {posts.map((post, index) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-td overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group"
                    >
                      <Link href={`/blog/${post.slug}`} className="block">
                        {post.featured_image_url && (
                          <div className="aspect-video overflow-hidden bg-gray-100">
                            <img
                              src={post.featured_image_url}
                              alt={post.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          {post.categories.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {post.categories.slice(0, 2).map((category) => (
                                <span
                                  key={category}
                                  className="px-3 py-1 text-xs font-medium rounded-full bg-tielo-orange/10 text-tielo-orange"
                                >
                                  {category}
                                </span>
                              ))}
                            </div>
                          )}
                          <h2 className="text-xl font-bold mb-3 text-tielo-navy group-hover:text-tielo-orange transition-colors line-clamp-2">
                            {post.title}
                          </h2>
                          {post.excerpt && (
                            <p className="text-gray-600 mb-4 line-clamp-3">
                              {post.excerpt}
                            </p>
                          )}
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <time dateTime={post.published_at || post.created_at}>
                                {new Date(post.published_at || post.created_at).toLocaleDateString('nl-NL')}
                              </time>
                            </div>
                            <span>{post.reading_time} min leestijd</span>
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
                        className={`px-4 py-2 rounded-td font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-tielo-orange text-white'
                            : 'bg-white text-tielo-navy hover:bg-tielo-orange/10'
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
      </div>

      <BlogNewsletter />
    </div>
  );
}