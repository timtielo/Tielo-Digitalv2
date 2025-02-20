export const defaultSEO = {
  title: 'Tielo Digital - AI & Automatisering',
  description: 'Transformeer jouw bedrijf met AI-gedreven oplossingen en automatisering. Verhoog efficiency, verminder kosten en blijf voorop in innovatie.',
  keywords: [
    'AI',
    'Automatisering',
    'Bedrijfsprocessen',
    'Digitale Transformatie',
    'Machine Learning',
    'Workflow Optimalisatie'
  ],
  ogType: 'website',
  ogImage: 'https://www.tielo-digital.nl/social/og-image.jpg',
  twitterCard: 'summary_large_image',
  twitterCreator: '@TieloDigital',
  twitterSite: '@TieloDigital'
};

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
}

export function generateSEO(props: SEOProps) {
  return {
    title: props.title || defaultSEO.title,
    description: props.description || defaultSEO.description,
    keywords: props.keywords || defaultSEO.keywords,
    ogImage: props.ogImage || defaultSEO.ogImage,
    ogType: defaultSEO.ogType,
    twitterCard: defaultSEO.twitterCard,
    twitterCreator: defaultSEO.twitterCreator,
    twitterSite: defaultSEO.twitterSite,
    canonical: props.canonical
  };
}