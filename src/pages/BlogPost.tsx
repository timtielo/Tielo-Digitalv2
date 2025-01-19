import React from 'react';
import { useBlogPost } from '../hooks/useBlogPost';
import { Loader } from 'lucide-react';
import { RichTextRenderer } from '../components/blog/RichTextRenderer';
import { Author } from '../components/blog/Author';
import { RelatedPosts } from '../components/blog/RelatedPosts';
import { BlogNewsletter } from '../components/blog/BlogNewsletter';

interface BlogPostProps {
  slug: string;
}

export function BlogPost({ slug }: BlogPostProps) {
  const { post, isLoading, error } = useBlogPost(slug);

  // Update meta tags when post data changes
  React.useEffect(() => {
    if (!post) return;

    const seoFields = post.fields.seoFields?.fields;
    const featuredImage = post.fields.featuredImage?.fields.file.url;
    const imageUrl = featuredImage ? `https:${featuredImage}` : 'https://tielo-digital.nl/social/og-image.png';

    // Primary Meta Tags
    document.title = seoFields?.pageTitle || post.fields.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', seoFields?.pageDescription || '');
    
    // Open Graph / Facebook / WhatsApp
    document.querySelector('meta[property="og:type"]')?.setAttribute('content', 'article');
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', seoFields?.pageTitle || post.fields.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', seoFields?.pageDescription || '');
    document.querySelector('meta[property="og:image"]')?.setAttribute('content', imageUrl);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', `https://tielo-digital.nl/blog/${post.fields.slug}`);
    
    // Twitter
    document.querySelector('meta[name="twitter:card"]')?.setAttribute('content', 'summary_large_image');
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', seoFields?.pageTitle || post.fields.title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', seoFields?.pageDescription || '');
    document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', imageUrl);

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', `https://tielo-digital.nl/blog/${post.fields.slug}`);

    // Cleanup function
    return () => {
      // Reset meta tags to default values when component unmounts
      document.title = 'Tielo Digital - AI & Automatisering';
      document.querySelector('meta[name="description"]')?.setAttribute('content', 'Verbeter jouw bedrijf met AI-gedreven oplossingen en automatisering. Verhoog efficiency, verminder kosten en blijf voorop in innovatie.');
      document.querySelector('meta[property="og:type"]')?.setAttribute('content', 'website');
      document.querySelector('meta[property="og:title"]')?.setAttribute('content', 'Tielo Digital - AI & Automatisering');
      document.querySelector('meta[property="og:description"]')?.setAttribute('content', 'Verbeter jouw bedrijf met AI-gedreven oplossingen en automatisering. Verhoog efficiency, verminder kosten en blijf voorop in innovatie.');
      document.querySelector('meta[property="og:image"]')?.setAttribute('content', 'https://tielo-digital.nl/social/og-image.png');
      document.querySelector('meta[property="og:url"]')?.setAttribute('content', 'https://tielo-digital.nl');
      if (canonicalLink) {
        canonicalLink.remove();
      }
    };
  }, [post]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary" />
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
    <article className="min-h-screen">
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <header className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 font-rubik">
                {post.fields.title}
              </h1>
              {post.fields.shortDescription && (
                <p className="text-xl text-gray-600 mb-6">
                  {post.fields.shortDescription}
                </p>
              )}
              <div className="flex items-center justify-between">
                {post.fields.author && (
                  <Author author={post.fields.author} />
                )}
                <div className="text-sm text-gray-500">
                  <time dateTime={post.fields.publishedDate}>
                    {new Date(post.fields.publishedDate).toLocaleDateString('nl-NL')}
                  </time>
                  <span className="mx-2">•</span>
                  <span>{post.fields.readingTime || '5'} min leestijd</span>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            {post.fields.featuredImage && (
              <div className="mb-12">
                <img
                  src={`https:${post.fields.featuredImage.fields.file.url}`}
                  alt={post.fields.featuredImage.fields.title}
                  className="w-full rounded-xl"
                />
              </div>
            )}

            {/* Content */}
            <RichTextRenderer content={post.fields.content} />

            {/* Related Posts */}
            {post.fields.relatedBlogPosts && (
              <RelatedPosts posts={post.fields.relatedBlogPosts} />
            )}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <BlogNewsletter />
    </article>
  );
}