import fs from 'node:fs/promises';
import express from 'express';
import compression from 'compression';
import sirv from 'sirv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';

async function createServer() {
  const app = express();

  // Compression middleware
  app.use(compression());

  let vite;
  // Static file serving
  if (isProduction) {
    app.use(sirv('dist/client', { extensions: [] }));
  } else {
    // Development: Create Vite dev server
    const { createServer: createViteServer } = await import('vite');
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom'
    });
    app.use(vite.middlewares);
  }

  // Main SSR handler
  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl;
      let template;
      let render;

      if (isProduction) {
        template = await fs.readFile(resolve('dist/client/index.html'), 'utf-8');
        render = (await import('./dist/server/entry-server.js')).render;
      } else {
        template = await fs.readFile(resolve('index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render;
      }

      const { html: appHtml, seo } = await render(url);

      // Inject SEO tags and rendered app HTML
      const html = template
        .replace('<!--app-html-->', appHtml)
        .replace('<!--seo-tags-->', `
          <title>${seo.title}</title>
          <meta name="description" content="${seo.description}">
          ${seo.keywords ? `<meta name="keywords" content="${seo.keywords.join(', ')}">` : ''}
          <meta property="og:title" content="${seo.title}">
          <meta property="og:description" content="${seo.description}">
          ${seo.ogImage ? `<meta property="og:image" content="${seo.ogImage}">` : ''}
          <meta property="og:type" content="${seo.ogType || 'website'}">
          ${seo.canonical ? `<link rel="canonical" href="${seo.canonical}">` : ''}
        `);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      const err = e;
      if (!isProduction && vite) {
        vite.ssrFixStacktrace(err);
      }
      console.error(err.stack);
      res.status(500).end(err.stack);
    }
  });

  // Start server
  const port = process.env.PORT || 5173;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

createServer();