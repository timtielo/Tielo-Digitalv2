// Import contentful as a CommonJS module
import * as contentful from 'contentful';
import { CONTENTFUL_CONFIG } from '../../config/contentful';

export const contentfulClient = contentful.createClient({
  space: CONTENTFUL_CONFIG.space,
  accessToken: CONTENTFUL_CONFIG.accessToken,
  environment: CONTENTFUL_CONFIG.environment
});