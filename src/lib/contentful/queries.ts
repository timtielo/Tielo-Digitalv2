import { contentfulClient } from './client';
import type { 
  ContentfulBlogPost, 
  ContentfulLandingPage, 
  ContentfulResponse 
} from './types';
import { ContentfulError } from './errors';

interface BlogPostsResponse {
  posts: ContentfulBlogPost[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export async function getBlogLandingPage(): Promise<ContentfulLandingPage | null> {
  try {
    const response = await contentfulClient.getEntries<ContentfulLandingPage>({
      content_type: 'pageLanding',
      include: 2,
      limit: 1
    });

    return response.items[0] || null;
  } catch (error) {
    console.error('Contentful API Error:', error);
    throw new ContentfulError('Failed to fetch blog landing page', error);
  }
}

export async function getBlogPosts(page = 1, limit = 9): Promise<BlogPostsResponse> {
  try {
    const skip = (page - 1) * limit;
    
    const response = await contentfulClient.getEntries<ContentfulBlogPost>({
      content_type: 'pageBlogPost',
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
    throw new ContentfulError('Failed to fetch blog posts', error);
  }
}

export async function getBlogPostsByCategory(
  category: string,
  page = 1,
  limit = 9
): Promise<BlogPostsResponse> {
  try {
    const skip = (page - 1) * limit;
    
    const response = await contentfulClient.getEntries<ContentfulBlogPost>({
      content_type: 'pageBlogPost',
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
    throw new ContentfulError('Failed to fetch blog posts by category', error);
  }
}