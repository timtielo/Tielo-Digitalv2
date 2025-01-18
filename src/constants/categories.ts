export const BLOG_CATEGORIES = [
  'AI',
  'Automatisering',
  'Customer Service',
  'Content Creation',
  'Marketing',
  'Innovatie'
] as const;

export type BlogCategory = typeof BLOG_CATEGORIES[number];