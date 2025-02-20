import React from 'react';
import { useContentfulSEO } from '../../hooks/useContentfulSEO';

interface ContentfulSEOProps {
  internalName: string;
  fallback?: {
    title: string;
    description: string;
  };
}

export function ContentfulSEO({ internalName, fallback }: ContentfulSEOProps) {
  const { seo, isLoading, error } = useContentfulSEO(internalName);

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
        <title>{fallback.title} | Tielo Digital</title>
        <meta name="description" content={fallback.description} />
      </>
    );
  }

  const { fields } = seo;
  const shareImage = fields.shareImages?.[0]?.fields.file.url;

  return (
    <>
      <title>{fields.pageTitle} | Tielo Digital</title>
      {fields.pageDescription && (
        <meta name="description" content={fields.pageDescription} />
      )}

      {/* Open Graph */}
      <meta property="og:title" content={fields.pageTitle} />
      {fields.pageDescription && (
        <meta property="og:description" content={fields.pageDescription} />
      )}
      <meta property="og:type" content="website" />
      {shareImage && (
        <meta property="og:image" content={`https:${shareImage}`} />
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fields.pageTitle} />
      {fields.pageDescription && (
        <meta name="twitter:description" content={fields.pageDescription} />
      )}
      {shareImage && (
        <meta name="twitter:image" content={`https:${shareImage}`} />
      )}

      {/* Robots */}
      {(fields.noindex || fields.nofollow) && (
        <meta 
          name="robots" 
          content={[
            fields.noindex ? 'noindex' : 'index',
            fields.nofollow ? 'nofollow' : 'follow'
          ].join(',')} 
        />
      )}

      {/* Canonical */}
      {fields.canonicalUrl && (
        <link rel="canonical" href={fields.canonicalUrl} />
      )}
    </>
  );
}