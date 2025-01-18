import { contentfulClient } from '../client';
import type { ContentfulLandingPage } from '../types';
import { ContentfulError } from '../errors';

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