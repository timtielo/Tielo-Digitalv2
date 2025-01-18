import React from 'react';
import { BlogCard } from './BlogCard';
import { useContentfulBlogPosts } from '../../hooks/useContentfulBlogPosts';
import { Pagination } from './Pagination';
import { Clock, Loader } from 'lucide-react';
import type { ContentfulBlogPost } from '../../lib/contentful/types';
import { Author } from './Author';

interface BlogGridProps {
  selectedCategory: string | null;
  currentPage: number;
  onPageChange: (page: number) => void;
  featuredPost?: ContentfulBlogPost;
}

export function BlogGrid({ 
  selectedCategory, 
  currentPage, 
  onPageChange,
  featuredPost 
}: BlogGridProps) {
  const { posts, isLoading, error, totalPages } = useContentfulBlogPosts(
    selectedCategory, 
    currentPage,
    10 // Set limit to 10 posts per page to account for featured post
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-2">{error}</p>
        <p className="text-gray-600">
          Controleer of je content model in Contentful correct is ingesteld
        </p>
      </div>
    );
  }

  // Filter out the featured post from regular posts to avoid duplication
  const filteredPosts = featuredPost 
    ? posts.filter(post => post.sys.id !== featuredPost.sys.id)
    : posts;

  if (!filteredPosts.length && !featuredPost) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">
          {selectedCategory 
            ? `Geen blogs gevonden in de categorie "${selectedCategory}"`
            : 'Geen blogs gevonden. Voeg eerst wat blogs toe in Contentful.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Featured Post */}
      {featuredPost && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 font-rubik">Uitgelicht</h2>
          <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
            <div className="grid md:grid-cols-2 h-full">
              {/* Featured Image */}
              <div className="relative h-full min-h-[300px]">
                <img
                  src={featuredPost.fields.featuredImage?.fields.file.url 
                    ? `https:${featuredPost.fields.featuredImage.fields.file.url}?w=800&h=600&fit=fill` 
                    : 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=800&h=600'}
                  alt={featuredPost.fields.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              
              {/* Content */}
              <div className="p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <time dateTime={featuredPost.fields.publishedDate}>
                      {new Date(featuredPost.fields.publishedDate).toLocaleDateString('nl-NL')}
                    </time>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {featuredPost.fields.readingTime || '5'} min leestijd
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                    {featuredPost.fields.title}
                  </h3>
                  
                  {featuredPost.fields.shortDescription && (
                    <p className="text-gray-600 mb-6 line-clamp-3">
                      {featuredPost.fields.shortDescription}
                    </p>
                  )}
                </div>
                
                {featuredPost.fields.author && (
                  <div className="mt-auto">
                    <Author author={featuredPost.fields.author} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Regular Posts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.slice(0, 9).map((post) => (
          <BlogCard key={post.sys.id} post={post} />
        ))}
      </div>
      
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}