import React from 'react';
import { GoogleTagManager } from '../Analytics/GoogleTagManager';
import { BUSINESS_INFO } from '../../config/business';

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  local?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
  };
}

export function SEO({
  title,
  description,
  keywords,
  ogImage,
  ogType = 'website',
  canonical,
  noindex = false,
  nofollow = false,
  article,
  local
}: SEOProps) {
  const siteTitle = `${title} | Tielo Digital`;
  const robotsContent = [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow'
  ].join(', ');

  const defaultOgImage = ogImage || BUSINESS_INFO.image;
  const fullCanonical = canonical || (typeof window !== 'undefined' ? window.location.href : BUSINESS_INFO.url);

  return (
    <>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robotsContent} />
      {keywords && <meta name="keywords" content={keywords.join(', ')} />}

      <meta property="og:site_name" content="Tielo Digital" />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={defaultOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:locale" content="nl_NL" />

      {article && (
        <>
          {article.publishedTime && <meta property="article:published_time" content={article.publishedTime} />}
          {article.modifiedTime && <meta property="article:modified_time" content={article.modifiedTime} />}
          {article.author && <meta property="article:author" content={article.author} />}
          {article.section && <meta property="article:section" content={article.section} />}
          {article.tags && article.tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta property="twitter:domain" content="tielo-digital.nl" />
      <meta property="twitter:url" content={fullCanonical} />
      <meta name="twitter:image" content={defaultOgImage} />

      <meta name="geo.region" content="NL-UT" />
      <meta name="geo.placename" content={local?.addressLocality || BUSINESS_INFO.address.addressLocality} />
      <meta name="geo.position" content={`${BUSINESS_INFO.coordinates.latitude};${BUSINESS_INFO.coordinates.longitude}`} />
      <meta name="ICBM" content={`${BUSINESS_INFO.coordinates.latitude}, ${BUSINESS_INFO.coordinates.longitude}`} />

      <link rel="canonical" href={fullCanonical} />

      <GoogleTagManager />
    </>
  );
}