import React from 'react';
import { ContentfulBlogPost } from '../../lib/contentful/types/blog';
import { CONTENTFUL_CONFIG } from '../../config/contentful';

interface BlogSEOProps {
  post: ContentfulBlogPost;
}

export function BlogSEO({ post }: BlogSEOProps) {
  const { fields } = post;
  const seoFields = fields.seoFields?.fields;
  const featuredImage = fields.featuredImage?.fields.file.url;
  const imageUrl = featuredImage ? `https:${featuredImage}` : `${CONTENTFUL_CONFIG.baseUrl}/social/og-image.png`;
  const canonicalUrl = seoFields?.canonicalUrl || `${CONTENTFUL_CONFIG.baseUrl}/blog/${fields.slug}`;

  React.useEffect(() => {
    // Primary Meta Tags
    document.title = seoFields?.pageTitle || fields.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', seoFields?.pageDescription || fields.shortDescription || '');
    
    // Open Graph / Facebook
    document.querySelector('meta[property="og:type"]')?.setAttribute('content', 'article');
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', seoFields?.pageTitle || fields.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', seoFields?.pageDescription || fields.shortDescription || '');
    document.querySelector('meta[property="og:image"]')?.setAttribute('content', imageUrl);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', canonicalUrl);
    
    // Twitter
    document.querySelector('meta[name="twitter:card"]')?.setAttribute('content', 'summary_large_image');
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', seoFields?.pageTitle || fields.title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', seoFields?.pageDescription || fields.shortDescription || '');
    document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', imageUrl);

    // Keywords
    if (seoFields?.keywords?.length) {
      document.querySelector('meta[name="keywords"]')?.setAttribute('content', seoFields.keywords.join(', '));
    }

    // Robots
    if (seoFields?.noindex || seoFields?.nofollow) {
      const robotsContent = [
        seoFields.noindex ? 'noindex' : 'index',
        seoFields.nofollow ? 'nofollow' : 'follow'
      ].join(', ');
      document.querySelector('meta[name="robots"]')?.setAttribute('content', robotsContent);
    }

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // Cleanup
    return () => {
      if (canonicalLink) {
        canonicalLink.remove();
      }
    };
  }, [fields, seoFields, imageUrl, canonicalUrl]);

  return null;
}