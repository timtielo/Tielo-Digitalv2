import { createClient } from 'contentful';

export const contentfulClient = createClient({
  space: 'bjddw3q5ide3',
  accessToken: 'Ug6b-CA-VbG1H4S0gwZ9tOLrhNtKcM1XZxfJCDnnu9c',
  environment: 'master'
});

export interface ContentfulBlogPost {
  sys: {
    id: string;
    createdAt: string;
    updatedAt: string;
  };
  fields: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string[];
    featuredImage?: {
      fields: {
        file: {
          url: string;
        };
        title: string;
      };
    };
  };
}

export async function getContentfulBlogPosts(page = 1, limit = 9) {
  try {
    const skip = (page - 1) * limit;
    
    const response = await contentfulClient.getEntries<ContentfulBlogPost>({
      content_type: 'blog', // Changed from 'blogPost' to 'blog'
      order: '-sys.createdAt',
      skip,
      limit,
      include: 2
    });

    return {
      posts: response.items,
      total: response.total,
      currentPage: page,
      totalPages: Math.ceil(response.total / limit)
    };
  } catch (error) {
    console.error('Contentful API Error:', error);
    throw new Error('Failed to fetch blog posts');
  }
}

export async function getContentfulBlogPostsByCategory(category: string, page = 1, limit = 9) {
  try {
    const skip = (page - 1) * limit;
    
    const response = await contentfulClient.getEntries<ContentfulBlogPost>({
      content_type: 'blog', // Changed from 'blogPost' to 'blog'
      'fields.category': category,
      order: '-sys.createdAt',
      skip,
      limit,
      include: 2
    });

    return {
      posts: response.items,
      total: response.total,
      currentPage: page,
      totalPages: Math.ceil(response.total / limit)
    };
  } catch (error) {
    console.error('Contentful API Error:', error);
    throw new Error('Failed to fetch blog posts');
  }
}