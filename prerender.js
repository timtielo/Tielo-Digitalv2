import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || ''
);

async function fetchMetrics() {
  try {
    const { data, error } = await supabase
      .from('dashboard_metrics')
      .select('*')
      .order('metric_key');

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error fetching metrics during build:', err);
    return null;
  }
}

async function prerender() {
  try {
    // Ensure dist/client directory exists
    await fs.mkdir(path.resolve(__dirname, 'dist/client'), { recursive: true });

    // Read the template after build
    const template = await fs.readFile(
      path.resolve(__dirname, 'dist/client/index.html'), 
      'utf-8'
    );

    // Fetch metrics during build
    const metrics = await fetchMetrics();
    
    // Create metrics script to inject into HTML
    const metricsScript = `<script>window.__INITIAL_METRICS__ = ${JSON.stringify(metrics)}</script>`;

    // Update the template with metrics
    const updatedTemplate = template.replace('</head>', `${metricsScript}</head>`);

    // Write the updated template back
    await fs.writeFile(
      path.resolve(__dirname, 'dist/client/index.html'),
      updatedTemplate
    );

    console.log('Prerendering complete!');
  } catch (error) {
    console.error('Error during prerendering:', error);
    process.exit(1);
  }
}

prerender().catch(console.error);