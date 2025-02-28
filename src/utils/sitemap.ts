import { contentfulClient } from '../lib/contentful/client';
import type { ContentfulBlogPost } from '../lib/contentful/types';
import type { ContentfulOplossing } from '../lib/contentful/types/oplossingen';
import fs from 'node:fs/promises';
import path from 'node:path';

const baseUrl = 'https://www.tielo-digital.nl';
const currentDate = new Date().toISOString().split('T')[0];

export async function generateSitemap() {
  try {
    // Fetch all blog posts
    const blogResponse = await contentfulClient.getEntries<ContentfulBlogPost>({
      content_type: 'pageBlogPost',
      limit: 1000,
      include: 2,
      order: '-sys.createdAt'
    });

    // Fetch all solutions
    const oplossingenResponse = await contentfulClient.getEntries<ContentfulOplossing>({
      content_type: 'pageOplossingen',
      limit: 1000,
      include: 2,
      order: '-sys.createdAt'
    });

    // Start building the sitemap
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Main Pages -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/succesverhalen</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/oplossingen</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/gratis-guide</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/privacy</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${baseUrl}/terms</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${baseUrl}/cookies</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>

  <!-- Blog Pages -->
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;

    // Add all blog posts
    for (const post of blogResponse.items) {
      if (post.fields?.slug) {
        const lastmod = post.sys.updatedAt.split('T')[0];
        sitemap += `
  <url>
    <loc>${baseUrl}/blog/${post.fields.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
      }
    }

    // Add all solutions
    for (const oplossing of oplossingenResponse.items) {
      if (oplossing.fields?.slug) {
        const lastmod = oplossing.sys.updatedAt.split('T')[0];
        sitemap += `
  <url>
    <loc>${baseUrl}/oplossingen/${oplossing.fields.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      }
    }

    // Add service pages
    sitemap += `
  <!-- Services Pages -->
  <url>
    <loc>${baseUrl}/diensten</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/diensten/workflow</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/diensten/outreach</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/diensten/email-handling</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/diensten/customer-service</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/diensten/content-creation</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/diensten/custom</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/diensten/websites</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;

    // Close the sitemap
    sitemap += '\n</urlset>';

    // Write the sitemap file
    await fs.writeFile(
      path.resolve(process.cwd(), 'public/sitemap.xml'),
      sitemap
    );

    return {
      success: true,
      blogPostsCount: blogResponse.items.length,
      oplossingenCount: oplossingenResponse.items.length,
      servicesCount: 8,
      mainPagesCount: 8
    };
  } catch (error) {
    console.error('Error generating sitemap:', error);
    throw error;
  }
}