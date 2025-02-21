import React from 'react';
import { ContentfulBlogPost } from '../../lib/contentful/types/blog';

interface BlogSEOProps {
  post: ContentfulBlogPost;
  baseUrl?: string;
}

export function BlogSEO({ post, baseUrl = 'https://tielo-digital.nl' }: BlogSEOProps) {
  const { fields } = post;
  const canonicalUrl = `${baseUrl}/blog/${fields.slug}`;
  const imageUrl = fields.featuredImage?.fields.file.url;

  return (
    <>
      <title>{`${fields.title} | Tielo Digital Blog`}</title>
      <meta name="description" content={fields.shortDescription || ''} />
      <meta name="author" content={fields.author?.fields.name || 'Tielo Digital'} />
      <meta name="robots" content="index, follow" />
      
      {/* Open Graph */}
      <meta property="og:title" content={fields.title} />
      <meta property="og:description" content={fields.shortDescription || ''} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={canonicalUrl} />
      {imageUrl && <meta property="og:image" content={`https:${imageUrl}`} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fields.title} />
      <meta name="twitter:description" content={fields.shortDescription || ''} />
      {imageUrl && <meta name="twitter:image" content={`https:${imageUrl}`} />}
      
      {/* Article specific */}
      <meta property="article:published_time" content={fields.publishedDate} />
      <meta property="article:author" content={fields.author?.fields.name || 'Tielo Digital'} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
    </>
  );
}