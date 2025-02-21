import React, { useEffect } from 'react';
import { ContentfulOplossing } from '../../lib/contentful/types/oplossingen';

interface SolutionSEOProps {
  solution: ContentfulOplossing;
  baseUrl?: string;
}

export function SolutionSEO({ solution, baseUrl = 'https://tielo-digital.nl' }: SolutionSEOProps) {
  const { fields } = solution;
  const canonicalUrl = `${baseUrl}/oplossingen/${fields.slug}`;
  const imageUrl = fields.featuredImage?.fields.file.url 
    ? `https:${fields.featuredImage.fields.file.url}` 
    : `${baseUrl}/logo/og-image.jpg`;

  useEffect(() => {
    const updateMetaTags = () => {
      // Basic meta tags
      document.title = `${fields.title} | Tielo Digital Oplossingen`;
      
      // Update or create meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', fields.shortDescription || '');

      // Update Open Graph tags
      const ogTags = {
        'og:title': fields.title,
        'og:description': fields.shortDescription || '',
        'og:type': 'article',
        'og:url': canonicalUrl,
        'og:image': imageUrl,
        'og:site_name': 'Tielo Digital'
      };

      Object.entries(ogTags).forEach(([property, content]) => {
        let tag = document.querySelector(`meta[property="${property}"]`);
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute('property', property);
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
      });

      // Update Twitter Card tags
      const twitterTags = {
        'twitter:card': 'summary_large_image',
        'twitter:site': '@TieloDigital',
        'twitter:title': fields.title,
        'twitter:description': fields.shortDescription || '',
        'twitter:image': imageUrl
      };

      Object.entries(twitterTags).forEach(([name, content]) => {
        let tag = document.querySelector(`meta[name="${name}"]`);
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute('name', name);
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
      });

      // Update article specific meta tags
      const articleTags = {
        'article:published_time': fields.publishedDate,
        'article:author': fields.author?.fields.name || 'Tielo Digital'
      };

      Object.entries(articleTags).forEach(([property, content]) => {
        let tag = document.querySelector(`meta[property="${property}"]`);
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute('property', property);
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
      });

      // Update canonical URL
      let canonicalTag = document.querySelector('link[rel="canonical"]');
      if (!canonicalTag) {
        canonicalTag = document.createElement('link');
        canonicalTag.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalTag);
      }
      canonicalTag.setAttribute('href', canonicalUrl);
    };

    updateMetaTags();
  }, [fields, canonicalUrl, imageUrl]);

  return null;
}