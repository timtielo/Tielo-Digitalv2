import React, { useEffect } from 'react';
import { useSupabaseSEO } from '../../hooks/useSupabaseSEO';
import { defaultSEO } from '../../utils/seo';

interface SupabaseSEOProps {
  internalName: string;
  fallback?: {
    title: string;
    description: string;
  };
}

export function SupabaseSEO({ internalName, fallback }: SupabaseSEOProps) {
  const { seo, isLoading, error } = useSupabaseSEO(internalName);
  const baseUrl = 'https://www.tielo-digital.nl';

  useEffect(() => {
    // Function to update meta tags
    const updateMetaTags = (title: string, description: string, image?: string, canonical?: string) => {
      // Default image if none provided
      const ogImage = image || `${baseUrl}/logo/og-image.jpg`;
      const canonicalUrl = canonical || `${baseUrl}${window.location.pathname}`;

      // Update title
      document.title = title;
      
      // Basic meta tags
      const metaTags = {
        'description': description,
        'robots': seo?.noindex || seo?.nofollow ? 
          `${seo.noindex ? 'noindex' : 'index'}, ${seo.nofollow ? 'nofollow' : 'follow'}` : 
          'index, follow'
      };

      // Open Graph tags
      const ogTags = {
        'og:title': title,
        'og:description': description,
        'og:image': ogImage,
        'og:url': canonicalUrl,
        'og:type': 'website',
        'og:site_name': 'Tielo Digital'
      };

      // Twitter Card tags
      const twitterTags = {
        'twitter:card': 'summary_large_image',
        'twitter:site': '@TieloDigital',
        'twitter:title': title,
        'twitter:description': description,
        'twitter:image': ogImage,
        'twitter:url': canonicalUrl
      };

      // Update meta tags
      Object.entries(metaTags).forEach(([name, content]) => {
        let tag = document.querySelector(`meta[name="${name}"]`);
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute('name', name);
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
      });

      // Update OG tags
      Object.entries(ogTags).forEach(([property, content]) => {
        let tag = document.querySelector(`meta[property="${property}"]`);
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute('property', property);
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
      });

      // Update Twitter tags
      Object.entries(twitterTags).forEach(([name, content]) => {
        let tag = document.querySelector(`meta[name="${name}"]`);
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute('name', name);
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

    // Determine which data to use
    if (!isLoading && !error && seo) {
      updateMetaTags(
        seo.page_title,
        seo.page_description || defaultSEO.description,
        seo.share_image_url,
        seo.canonical_url
      );
    } else if (fallback) {
      updateMetaTags(
        fallback.title,
        fallback.description
      );
    } else {
      updateMetaTags(
        defaultSEO.title,
        defaultSEO.description,
        `${baseUrl}/logo/og-image.jpg`,
        `${baseUrl}${window.location.pathname}`
      );
    }
  }, [seo, isLoading, error, fallback]);

  // This component doesn't render anything visible
  return null;
}