import React, { useState } from 'react';
import { BlogGrid } from '../components/blog/BlogGrid';
import { BlogNewsletter } from '../components/blog/BlogNewsletter';
import { useBlogLandingPage } from '../hooks/useBlogLandingPage';
import { Loader } from 'lucide-react';
import { SEO } from '../components/SEO';

export function Blog() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { landingPage, isLoading, error } = useBlogLandingPage();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <p className="text-gray-600">Controleer of je content model in Contentful correct is ingesteld</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="Blog - Tielo Digital"
        description="Ontdek de laatste inzichten over AI, automatisering en digitale transformatie. Praktische tips en strategieën voor jouw bedrijf."
        keywords={[
          'AI Blog',
          'Automatisering Blog',
          'Digitale Transformatie',
          'Tech Nieuws',
          'Business Innovation'
        ]}
        ogType="blog"
        canonical="https://tielo-digital.nl/blog"
      />
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4 font-rubik">
                Blog
              </h1>
              <p className="text-xl text-gray-600">
                Inzichten en nieuws over AI en automatisering
              </p>
            </div>

            <BlogGrid
              selectedCategory={selectedCategory}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              featuredPost={landingPage?.fields.featuredBlogPost}
            />
          </div>
        </div>
      </div>
      
      <BlogNewsletter />
    </div>
  );
}