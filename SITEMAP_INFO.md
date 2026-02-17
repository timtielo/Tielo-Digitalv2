# Dynamic Sitemap Setup

## Overview

The sitemap is now dynamically generated using a Supabase Edge Function that automatically includes all published blog posts from the database.

## How It Works

1. **Edge Function**: `/supabase/functions/generate-sitemap/index.ts`
   - Fetches all published blog posts from Supabase
   - Generates XML sitemap with all main pages, service pages, and blog posts
   - Caches the result for 1 hour

2. **Netlify Redirect**: `/public/_redirects`
   - Routes `/sitemap.xml` requests to the edge function
   - This ensures the sitemap is always up-to-date with the latest blog posts

3. **Static Fallback**: `/public/sitemap.xml`
   - Kept as a fallback in case the edge function is unavailable
   - Contains core pages only (no dynamic blog posts)

## SEO Benefits

- **Always Current**: New blog posts are automatically included in the sitemap
- **Fresh Last Modified Dates**: Each blog post shows its actual update date
- **Proper Priority**: Blog posts have priority 0.6, main pages 0.9-1.0
- **Fast Response**: 1-hour cache ensures quick load times

## Accessing the Sitemap

- Production: `https://www.tielo-digital.nl/sitemap.xml`
- Edge Function Direct: `https://omdigostmkxeqgwscmpe.supabase.co/functions/v1/generate-sitemap`

## Search Engine Submission

Submit the sitemap to:
- Google Search Console: https://search.google.com/search-console
- Bing Webmaster Tools: https://www.bing.com/webmasters

The sitemap URL to submit is: `https://www.tielo-digital.nl/sitemap.xml`
