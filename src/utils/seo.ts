import { routes } from '../router/routes';

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterCreator?: string;
  twitterSite?: string;
}

// Page-specific titles
const pageTitles: Record<string, string> = {
  home: 'AI & Automatisering voor Bedrijven',
  blog: 'Blog - AI & Automatisering Inzichten',
  diensten: 'AI & Automatisering Diensten',
  contact: 'Contact - Plan een Gratis Analyse',
  oplossingen: 'AI & Automatisering Oplossingen',
  succesverhalen: 'Succesverhalen - AI & Automatisering Cases',
  websites: 'Website Development & Design',
  'gratis-guide': 'Gratis AI & Automatisering Guide',
  privacy: 'Privacy Policy',
  terms: 'Algemene Voorwaarden',
  cookies: 'Cookie Beleid',
  visitekaartje: 'Tim Tielkemeijer - Digital Business Card',
  call: 'Plan een Gesprek',
};

// Page-specific descriptions
const pageDescriptions: Record<string, string> = {
  home: 'Transformeer jouw bedrijf met AI en automatisering. Verhoog efficiency, verminder kosten en blijf voorop in innovatie met Tielo Digital.',
  blog: 'Ontdek de laatste inzichten over AI, automatisering en digitale transformatie. Praktische tips en strategieën voor jouw bedrijf.',
  diensten: 'Van workflow automatisering tot AI-implementatie. Ontdek onze diensten die jouw bedrijf helpen groeien en efficiënter maken.',
  contact: 'Neem contact op met Tielo Digital voor een vrijblijvend gesprek over AI en automatisering voor jouw bedrijf.',
  oplossingen: 'Bekijk onze succesvolle AI en automatisering oplossingen. Concrete voorbeelden van hoe wij bedrijven helpen groeien.',
  succesverhalen: 'Lees hoe andere bedrijven succesvol zijn geworden met onze AI en automatisering oplossingen.',
  websites: 'Professionele website development met focus op conversie, gebruiksvriendelijkheid en moderne technologie.',
  'gratis-guide': 'Download onze gratis guide over AI en automatisering. Praktische tips om direct mee aan de slag te gaan.',
  privacy: 'Lees ons privacybeleid en hoe wij omgaan met jouw gegevens.',
  terms: 'Lees onze algemene voorwaarden voor het gebruik van onze diensten.',
  cookies: 'Lees ons cookiebeleid en hoe wij cookies gebruiken op onze website.',
  visitekaartje: 'Digitaal visitekaartje van Tim Tielkemeijer - AI & Automation Expert bij Tielo Digital.',
  call: 'Plan een vrijblijvend gesprek over AI en automatisering voor jouw bedrijf.',
};

export const defaultSEO: SEOProps = {
  title: 'AI & Automatisering',
  description: 'Transformeer jouw bedrijf met AI en automatisering. Verhoog efficiency, verminder kosten en blijf voorop in innovatie met Tielo Digital.',
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

export function generateSEO(props: Partial<SEOProps>): SEOProps {
  const path = typeof window !== 'undefined' ? window.location.pathname : '/';
  const pageKey = path === '/' ? 'home' : path.split('/')[1];
  
  const pageTitle = pageTitles[pageKey] || props.title || defaultSEO.title;
  const description = props.description || pageDescriptions[pageKey] || defaultSEO.description;
  
  return {
    ...defaultSEO,
    ...props,
    title: `${pageTitle} | Tielo Digital`,
    description,
    canonical: props.canonical || `https://www.tielo-digital.nl${path}`
  };
}