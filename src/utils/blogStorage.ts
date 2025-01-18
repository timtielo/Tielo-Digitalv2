import { BlogPost } from '../types/blog';

const BLOGS_KEY = 'tielo_digital_blogs';

export function getAllBlogs(): BlogPost[] {
  const blogsJson = localStorage.getItem(BLOGS_KEY);
  return blogsJson ? JSON.parse(blogsJson) : [];
}

export function getBlogBySlug(slug: string): BlogPost | undefined {
  const blogs = getAllBlogs();
  return blogs.find(blog => blog.seo?.slug === slug && blog.status === 'published');
}

export function validateBlog(blog: Partial<BlogPost>): { valid: boolean; error?: string } {
  if (!blog.title?.trim()) {
    return { valid: false, error: 'Titel is verplicht' };
  }

  if (!blog.content?.trim()) {
    return { valid: false, error: 'Content is verplicht' };
  }

  if (!blog.seo?.slug?.trim()) {
    return { valid: false, error: 'URL slug is verplicht' };
  }

  // Validate slug format
  const validSlug = /^[a-z0-9-]+$/.test(blog.seo.slug);
  if (!validSlug) {
    return { valid: false, error: 'URL slug mag alleen kleine letters, cijfers en koppeltekens bevatten' };
  }

  return { valid: true };
}

export function saveAsDraft(blogData: Partial<BlogPost>): BlogPost {
  const blogs = getAllBlogs();
  
  const newBlog: BlogPost = {
    id: blogData.id || crypto.randomUUID(),
    title: blogData.title || '',
    excerpt: blogData.excerpt || '',
    content: blogData.content || '',
    categories: blogData.categories || [],
    seo: {
      slug: blogData.seo?.slug || '',
      metaTitle: blogData.seo?.metaTitle || '',
      metaDescription: blogData.seo?.metaDescription || ''
    },
    image: blogData.image || null,
    status: 'draft',
    createdAt: blogData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (blogData.id) {
    // Update existing blog
    const index = blogs.findIndex(b => b.id === blogData.id);
    if (index !== -1) {
      blogs[index] = newBlog;
    } else {
      blogs.push(newBlog);
    }
  } else {
    // Add new blog
    blogs.push(newBlog);
  }

  localStorage.setItem(BLOGS_KEY, JSON.stringify(blogs));
  return newBlog;
}

export function publishBlog(blogData: Partial<BlogPost>): BlogPost {
  const validation = validateBlog(blogData);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const blogs = getAllBlogs();
  
  // Check for duplicate slugs
  const slugExists = blogs.some(existingBlog => 
    existingBlog.seo?.slug === blogData.seo?.slug && 
    existingBlog.status === 'published' &&
    existingBlog.id !== blogData.id
  );

  if (slugExists) {
    throw new Error('Er bestaat al een blog met deze URL slug');
  }

  const newBlog: BlogPost = {
    id: blogData.id || crypto.randomUUID(),
    title: blogData.title!,
    excerpt: blogData.excerpt || '',
    content: blogData.content!,
    categories: blogData.categories || [],
    seo: {
      slug: blogData.seo!.slug,
      metaTitle: blogData.seo!.metaTitle || blogData.title!,
      metaDescription: blogData.seo!.metaDescription || ''
    },
    image: blogData.image || null,
    status: 'published',
    createdAt: blogData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (blogData.id) {
    // Update existing blog
    const index = blogs.findIndex(b => b.id === blogData.id);
    if (index !== -1) {
      blogs[index] = newBlog;
    } else {
      blogs.push(newBlog);
    }
  } else {
    // Add new blog
    blogs.push(newBlog);
  }

  localStorage.setItem(BLOGS_KEY, JSON.stringify(blogs));
  return newBlog;
}

export function updateBlog(id: string, blogData: Partial<BlogPost>): BlogPost {
  const blogs = getAllBlogs();
  const index = blogs.findIndex(b => b.id === id);
  
  if (index === -1) {
    throw new Error('Blog niet gevonden');
  }

  const existingBlog = blogs[index];
  const updatedBlog: BlogPost = {
    ...existingBlog,
    ...blogData,
    id,
    updatedAt: new Date().toISOString()
  };

  blogs[index] = updatedBlog;
  localStorage.setItem(BLOGS_KEY, JSON.stringify(blogs));
  
  return updatedBlog;
}

export function deleteBlog(id: string): void {
  const blogs = getAllBlogs();
  const filteredBlogs = blogs.filter(blog => blog.id !== id);
  localStorage.setItem(BLOGS_KEY, JSON.stringify(filteredBlogs));
}