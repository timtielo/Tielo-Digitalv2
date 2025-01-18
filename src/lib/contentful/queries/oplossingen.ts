import { contentfulClient } from '../client';
import { ContentfulOplossing } from '../types/oplossingen';
import { ContentfulError } from '../errors';

interface OplossingenResponse {
  oplossingen: ContentfulOplossing[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export async function getOplossingen(page = 1, limit = 12): Promise<OplossingenResponse> {
  try {
    const skip = (page - 1) * limit;
    
    const response = await contentfulClient.getEntries<ContentfulOplossing>({
      content_type: 'pageOplossingen',
      order: '-fields.publishedDate',
      skip,
      limit,
      include: 2
    });

    return {
      oplossingen: response.items,
      total: response.total,
      currentPage: page,
      totalPages: Math.ceil(response.total / limit)
    };
  } catch (error) {
    console.error('Contentful API Error:', error);
    throw new ContentfulError('Failed to fetch oplossingen', error);
  }
}

export async function getOplossing(slug: string): Promise<ContentfulOplossing | null> {
  try {
    const response = await contentfulClient.getEntries<ContentfulOplossing>({
      content_type: 'pageOplossingen',
      'fields.slug': slug,
      include: 2,
      limit: 1
    });

    return response.items[0] || null;
  } catch (error) {
    console.error('Contentful API Error:', error);
    throw new ContentfulError('Failed to fetch oplossing', error);
  }
}