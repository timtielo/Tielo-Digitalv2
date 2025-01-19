import React from 'react';
import { ContentfulOplossing } from '../../lib/contentful/types/oplossingen';
import { CONTENTFUL_CONFIG } from '../../config/contentful';

interface OplossingsSEOProps {
  oplossing: ContentfulOplossing;
}

export function OplossingsSEO({ oplossing }: OplossingsSEOProps) {
  const { fields } = oplossing;
  const seoFields = fields.seoFields?.fields;
  const featuredImage = fields.featuredImage?.fields.file.url;
  const imageUrl = featuredImage ? `https:${featuredImage}` : `${CONTENTFUL_CONFIG.baseUrl}/social/og-image.png`;
  const canonicalUrl = seoFields?.canonicalUrl || `${CONTENTFUL_CONFIG.baseUrl}/oplossingen/${fields.slug}`;

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

    // Schema.org markup
    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: fields.title,
      description: fields.shortDescription,
      image: imageUrl,
      datePublished: fields.publishedDate,
      dateModified: oplossing.sys.updatedAt,
      author: fields.author ? {
        '@type': 'Person',
        name: fields.author.fields.name
      } : undefined,
      publisher: {
        '@type': 'Organization',
        name: 'Tielo Digital',
        logo: {
          '@type': 'ImageObject',
          url: `${CONTENTFUL_CONFIG.baseUrl}/logo/android-chrome-512x512.png`
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl
      }
    };
    schemaScript.textContent = JSON.stringify(schemaData);
    document.head.appendChild(schemaScript);

    // Cleanup
    return () => {
      if (canonicalLink) {
        canonicalLink.remove();
      }
      if (schemaScript) {
        schemaScript.remove();
      }
    };
  }, [fields, seoFields, imageUrl, canonicalUrl, oplossing.sys.updatedAt]);

  return null;
}