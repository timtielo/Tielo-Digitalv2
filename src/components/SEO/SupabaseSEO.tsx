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

  useEffect(() => {
    // Function to update meta tags
    const updateMetaTags = (title: string, description: string, image?: string, canonical?: string) => {
      // Update title
      document.title = title;
      
      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', description);

      // Update Open Graph tags
      const ogTags = {
        'og:title': title,
        'og:description': description,
        'og:image': image || 'https://www.tielo-digital.nl/logo/og-image.jpg',
        'og:url': canonical || window.location.href
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

      // Update Twitter tags
      const twitterTags = {
        'twitter:title': title,
        'twitter:description': description,
        'twitter:image': image || 'https://www.tielo-digital.nl/logo/og-image.jpg',
        'twitter:url': canonical || window.location.href
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

      // Update canonical URL
      let canonicalTag = document.querySelector('link[rel="canonical"]');
      if (!canonicalTag) {
        canonicalTag = document.createElement('link');
        canonicalTag.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalTag);
      }
      canonicalTag.setAttribute('href', canonical || window.location.href);

      // Update robots meta tag if needed
      if (seo?.noindex || seo?.nofollow) {
        let robotsTag = document.querySelector('meta[name="robots"]');
        if (!robotsTag) {
          robotsTag = document.createElement('meta');
          robotsTag.setAttribute('name', 'robots');
          document.head.appendChild(robotsTag);
        }
        const robotsContent = [
          seo.noindex ? 'noindex' : 'index',
          seo.nofollow ? 'nofollow' : 'follow'
        ].join(', ');
        robotsTag.setAttribute('content', robotsContent);
      }
    };

    // Determine which data to use
    if (!isLoading && !error && seo) {
      updateMetaTags(
        seo.page_title,
        seo.page_description || '',
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
        defaultSEO.description
      );
    }
  }, [seo, isLoading, error, fallback]);

  // This component doesn't render anything visible
  return null;
}