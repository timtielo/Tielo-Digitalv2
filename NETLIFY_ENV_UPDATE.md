# Fix Netlify Environment Variables

## Problem
The production site is using outdated Supabase credentials, causing login failures with `net::ERR_NAME_NOT_RESOLVED`.

## Solution

### Step 1: Update Netlify Environment Variables

1. Go to your Netlify dashboard: https://app.netlify.com
2. Select your site (tielodigital.nl)
3. Navigate to: **Site settings** → **Environment variables**
4. Update or add these variables:

```
VITE_SUPABASE_URL=https://omdigostmkxeqgwscmpe.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tZGlnb3N0bWt4ZXFnd3NjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwMzUyOTIsImV4cCI6MjA3OTYxMTI5Mn0.Fs6L8G6L4mMA2XqeeRo2Jq_LLB0vSVxHyHkVwUXTvrM
```

### Step 2: Trigger New Deploy

After updating the environment variables:

1. Go to **Deploys** tab in Netlify
2. Click **Trigger deploy** → **Clear cache and deploy site**
3. Wait for the build to complete

### Step 3: Verify

1. Visit your site
2. Try to login
3. Check browser console - the old URL should no longer appear

## Why This Happened

Environment variables are baked into the Vite build at build-time. The production build was using old credentials from a previous Supabase project. Updating Netlify's environment variables and redeploying will fix this.

## Current Status

- **Old (broken) URL**: `exdlqpdkfzarcxbmuvgy.supabase.co`
- **New (correct) URL**: `omdigostmkxeqgwscmpe.supabase.co`
