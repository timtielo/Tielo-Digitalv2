# Blog CMS Module - User Guide

## Overview

The Blog CMS module provides a complete content management system for creating, editing, and publishing blog posts directly from your dashboard.

## Features

### 📝 Rich Text Editor
- **Formatting**: Bold, italic, underline, strikethrough, code
- **Headings**: H1, H2, H3 for content structure
- **Lists**: Bullet points and numbered lists
- **Blockquotes**: For highlighting important content
- **Alignment**: Left, center, right text alignment
- **Links**: Add hyperlinks to external resources
- **Images**: Inline image uploads with drag-and-drop
- **Horizontal Rules**: Visual separators
- **Undo/Redo**: Full history support

### 📊 Dashboard Features
- **Statistics Cards**: View total posts, published posts, drafts, and categories at a glance
- **Search**: Find posts by title or excerpt
- **Filters**: Filter by status (all, published, draft) and category
- **Sorting**: Sort by newest, oldest, or alphabetically by title
- **Card View**: Visual grid layout with featured images
- **Quick Actions**: Edit, duplicate, or delete posts directly from cards

### ✏️ Blog Editor
- **Title & Slug**: Auto-generate SEO-friendly slugs from titles
- **Excerpt**: Write short summaries (max 160 characters)
- **Rich Content**: Full-featured rich text editor with image support
- **Featured Image**: Upload and display prominent post images
- **Categories**: Create and assign multiple categories to posts
- **Reading Time**: Automatically calculated based on content length
- **SEO Settings**:
  - Meta title with character counter (optimal: 50-60 chars)
  - Meta description with character counter (optimal: 140-160 chars)
  - Live URL preview
- **Preview Mode**: See exactly how your post will look before publishing
- **Auto-save**: (Consider implementing this feature)

### 🎨 Image Management
- **Featured Images**: Upload images up to full resolution
- **Inline Images**: Add images directly in content via toolbar
- **Storage**: All images stored securely in Supabase Storage
- **Organization**: Images organized by user and type (featured/inline)

### 🏷️ Category Management
- **Create Categories**: Add new categories on-the-fly while editing
- **Quick Select**: Choose from existing categories with one click
- **Visual Tags**: See assigned categories as colored badges
- **Filter by Category**: Find all posts in a specific category

### 📱 User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Framer Motion transitions for modern feel
- **Loading States**: Clear feedback during operations
- **Toast Notifications**: Success and error messages
- **Confirmation Dialogs**: Prevent accidental deletions
- **Keyboard Shortcuts** (Future enhancement):
  - `Cmd/Ctrl + S`: Save draft
  - `Cmd/Ctrl + P`: Publish
  - `Cmd/Ctrl + K`: Toggle preview

## Getting Started

### Accessing the Blog CMS

1. Log into your dashboard
2. Look for "Blog CMS" in the sidebar navigation (available for admin users)
3. Click to view your blog posts

### Creating Your First Post

1. Click the **"Nieuw bericht"** button
2. Enter a compelling title (max 60 characters for SEO)
3. The URL slug will auto-generate (you can edit it)
4. Write your content using the rich text editor
5. Upload a featured image (recommended)
6. Add an excerpt (short summary)
7. Assign categories
8. Fill in SEO settings (optional but recommended)
9. Click **"Preview"** to see how it looks
10. Click **"Concept opslaan"** to save as draft or **"Publiceren"** to publish

### Editing Existing Posts

1. Find the post in the dashboard
2. Click the **"Bewerken"** button
3. Make your changes
4. Save as draft or publish

### Managing Categories

1. While editing a post, go to the Categories section
2. Type a new category name in the input field
3. Click "Toevoegen" or press Enter
4. The category is automatically saved and available for all posts
5. Click existing category badges to toggle assignment

### SEO Best Practices

1. **Title**: Keep it under 60 characters, include main keyword
2. **Slug**: Use lowercase letters, numbers, and hyphens only
3. **Meta Title**: Can differ from post title, optimize for search
4. **Meta Description**: Write compelling 140-160 character summary
5. **Featured Image**: Always include for better engagement
6. **Excerpt**: Write clear, engaging summaries
7. **Categories**: Use 2-3 relevant categories per post

### Publishing Workflow

1. **Draft Mode**: Work on posts without publishing
2. **Preview**: Check how post looks before going live
3. **Publish**: Make post visible on your website
4. **Edit Published**: Update published posts anytime
5. **Unpublish**: Change status back to draft if needed

## Database Structure

### Tables Created

- **blog_posts**: Main table storing all blog content
- **blog_categories**: User-defined categories
- **Storage bucket**: blog-images (for featured and inline images)

### Security

- **Row Level Security (RLS)**: Enabled on all tables
- **User Isolation**: Users can only see/edit their own posts
- **Published Posts**: Visible to everyone when published
- **Image Access**: Authenticated users can upload, everyone can view

## Troubleshooting

### Slug Already Exists Error
- Each slug must be unique
- Try adding a number or date to make it unique
- Example: `my-post-2024` instead of `my-post`

### Image Upload Fails
- Check file size (recommended max: 5MB)
- Ensure file is a valid image format (JPG, PNG, GIF, WebP)
- Check your internet connection
- Verify you're logged in

### Post Won't Publish
- Ensure title is filled in
- Ensure slug is valid (lowercase, numbers, hyphens only)
- Check for duplicate slugs
- Fill in required fields

### Editor Not Loading
- Refresh the page
- Clear browser cache
- Check browser console for errors
- Ensure you have a stable internet connection

## Tips & Tricks

1. **Use Headings Wisely**: Structure content with H2 and H3 headings
2. **Break Up Text**: Use shorter paragraphs for better readability
3. **Add Images**: Visual content increases engagement
4. **Internal Links**: Link to your other blog posts or pages
5. **Categories**: Create a consistent category structure
6. **SEO First**: Always fill in meta fields before publishing
7. **Preview Everything**: Always preview before publishing
8. **Draft Often**: Save drafts frequently to avoid losing work

## Future Enhancements (Roadmap)

- [ ] Auto-save functionality
- [ ] Version history
- [ ] Scheduled publishing
- [ ] Tag system (in addition to categories)
- [ ] Image editing tools
- [ ] Collaborative editing
- [ ] Comment management
- [ ] Analytics integration
- [ ] Social media auto-posting
- [ ] Content calendar view
- [ ] Bulk actions (delete, publish multiple)
- [ ] Export/Import functionality

## Support

For issues or feature requests, contact your system administrator or check the project repository.
