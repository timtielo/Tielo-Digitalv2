import React from 'react';
import { GoogleTagManager } from '../Analytics/GoogleTagManager';

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export function SEO({ 
  title, 
  description, 
  keywords, 
  ogImage, 
  ogType = 'website',
  canonical,
  noindex = false,
  nofollow = false
}: SEOProps) {
  const siteTitle = `${title} | Tielo Digital`;
  const robotsContent = [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow'
  ].join(', ');
  
  return (
    <>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robotsContent} />
      {keywords && <meta name="keywords" content={keywords.join(', ')} />}
      
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:type" content={ogType} />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      
      {canonical && <link rel="canonical" href={canonical} />}

      <GoogleTagManager />
    </>
  );
}