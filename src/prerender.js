import { generateSitemap } from './utils/sitemap.js';

async function prerender() {
  try {
    // Generate sitemap
    await generateSitemap();
    console.log('Sitemap generated successfully');
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

prerender();