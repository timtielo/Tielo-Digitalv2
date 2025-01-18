import { contentfulClient } from '../lib/contentful/client';
import type { ContentfulBlogPost } from '../lib/contentful/types';
import type { ContentfulOplossing } from '../lib/contentful/types/oplossingen';
import fs from 'node:fs/promises';
import path from 'node:path';

const baseUrl = 'https://www.tielo-digital.nl';
const currentDate = new Date().toISOString().split('T')[0];

async function generateBlogSitemap() {
  try {
    const response = await contentfulClient.getEntries<ContentfulBlogPost>({
      content_type: 'blog',
      limit: 1000,
      include: 2,
      order: '-sys.createdAt'
    });

    const blogPosts = response.items;

    let blogSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;

    for (const post of blogPosts) {
      if (post.fields?.slug) {
        const lastmod = post.sys.updatedAt.split('T')[0];
        blogSitemap += `
  <url>
    <loc>${baseUrl}/blog/${post.fields.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
      }
    }

    blogSitemap += '\n</urlset>';

    await fs.writeFile(
      path.resolve(process.cwd(), 'public/blog-sitemap.xml'),
      blogSitemap
    );

    return blogPosts.length;
  } catch (error) {
    console.error('Error generating blog sitemap:', error);
    throw error;
  }
}

async function generateOplossingenSitemap() {
  try {
    const response = await contentfulClient.getEntries<ContentfulOplossing>({
      content_type: 'oplossing',
      limit: 1000,
      include: 2,
      order: '-sys.createdAt'
    });

    const oplossingen = response.items;

    let oplossingenSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/oplossingen</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;

    for (const oplossing of oplossingen) {
      if (oplossing.fields?.slug) {
        const lastmod = oplossing.sys.updatedAt.split('T')[0];
        oplossingenSitemap += `
  <url>
    <loc>${baseUrl}/oplossingen/${oplossing.fields.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
      }
    }

    oplossingenSitemap += '\n</urlset>';

    await fs.writeFile(
      path.resolve(process.cwd(), 'public/oplossingen-sitemap.xml'),
      oplossingenSitemap
    );

    return oplossingen.length;
  } catch (error) {
    console.error('Error generating oplossingen sitemap:', error);
    throw error;
  }
}

export async function generateSitemap() {
  try {
    const [blogPostCount, oplossingenCount] = await Promise.all([
      generateBlogSitemap(),
      generateOplossingenSitemap()
    ]);

    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/pages-sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/blog-sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/oplossingen-sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/diensten-sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`;

    await fs.writeFile(
      path.resolve(process.cwd(), 'public/sitemap.xml'),
      sitemapIndex
    );

    return {
      success: true,
      blogPostsCount: blogPostCount,
      oplossingenCount: oplossingenCount
    };
  } catch (error) {
    console.error('Error generating sitemaps:', error);
    throw error;
  }
}