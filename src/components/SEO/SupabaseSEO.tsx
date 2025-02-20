import React from 'react';
import { useSupabaseSEO } from '../../hooks/useSupabaseSEO';

interface SupabaseSEOProps {
  internalName: string;
  fallback?: {
    title: string;
    description: string;
  };
}

export function SupabaseSEO({ internalName, fallback }: SupabaseSEOProps) {
  const { seo, isLoading, error } = useSupabaseSEO(internalName);

  if (isLoading) {
    return null;
  }

  if (error || !seo) {
    if (!fallback) {
      console.error('SEO Error:', error);
      return null;
    }

    return (
      <>
        <title>{fallback.title}</title>
        <meta name="description" content={fallback.description} />
      </>
    );
  }

  return (
    <>
      <title>{seo.page_title}</title>
      {seo.page_description && (
        <meta name="description" content={seo.page_description} />
      )}

      {/* Open Graph */}
      <meta property="og:title" content={seo.page_title} />
      {seo.page_description && (
        <meta property="og:description" content={seo.page_description} />
      )}
      <meta property="og:type" content="website" />
      {seo.share_image_url && (
        <meta property="og:image" content={seo.share_image_url} />
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.page_title} />
      {seo.page_description && (
        <meta name="twitter:description" content={seo.page_description} />
      )}
      {seo.share_image_url && (
        <meta name="twitter:image" content={seo.share_image_url} />
      )}

      {/* Robots */}
      {(seo.noindex || seo.nofollow) && (
        <meta 
          name="robots" 
          content={[
            seo.noindex ? 'noindex' : 'index',
            seo.nofollow ? 'nofollow' : 'follow'
          ].join(',')} 
        />
      )}

      {/* Canonical */}
      {seo.canonical_url && (
        <link rel="canonical" href={seo.canonical_url} />
      )}
    </>
  );
}