import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { render } from './dist/server/entry-server.js';
import { routes } from './src/router/routes.js';
import { generateSitemap } from './src/utils/sitemap.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function prerender() {
  const template = await fs.readFile(path.resolve(__dirname, 'dist/client/index.html'), 'utf-8');
  const routesToPrerender = routes.filter(route => !route.redirect);

  await fs.mkdir(path.resolve(__dirname, 'dist/client'), { recursive: true });

  for (const route of routesToPrerender) {
    const url = route.path;
    const { html: appHtml, seo } = await render(url);

    const html = template
      .replace('<!--app-html-->', appHtml)
      .replace('<!--seo-tags-->', `
        <!-- Primary Meta Tags -->
        <title>${seo.title}</title>
        <meta name="title" content="${seo.title}">
        <meta name="description" content="${seo.description}">
        ${seo.keywords ? `<meta name="keywords" content="${seo.keywords.join(', ')}">` : ''}
        
        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="${seo.ogType || 'website'}">
        <meta property="og:url" content="https://tielo-digital.nl${url}">
        <meta property="og:title" content="${seo.title}">
        <meta property="og:description" content="${seo.description}">
        ${seo.ogImage ? `<meta property="og:image" content="${seo.ogImage}">` : ''}
        
        <!-- Twitter -->
        <meta property="twitter:card" content="${seo.twitterCard || 'summary_large_image'}">
        <meta property="twitter:url" content="https://tielo-digital.nl${url}">
        <meta property="twitter:title" content="${seo.title}">
        <meta property="twitter:description" content="${seo.description}">
        ${seo.ogImage ? `<meta property="twitter:image" content="${seo.ogImage}">` : ''}
        ${seo.twitterCreator ? `<meta name="twitter:creator" content="${seo.twitterCreator}">` : ''}
        ${seo.twitterSite ? `<meta name="twitter:site" content="${seo.twitterSite}">` : ''}
        
        <!-- Canonical -->
        ${seo.canonical ? `<link rel="canonical" href="${seo.canonical}">` : ''}
      `);

    const filePath = path.join(
      __dirname,
      'dist/client',
      url === '/' ? 'index.html' : `${url}/index.html`
    );
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, html);
  }

  // Generate sitemap
  const sitemap = generateSitemap();
  await fs.writeFile(
    path.resolve(__dirname, 'dist/client/sitemap.xml'),
    sitemap
  );

  console.log('Prerendering complete!');
}

prerender().catch(console.error);