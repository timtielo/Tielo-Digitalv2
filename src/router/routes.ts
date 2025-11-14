import { ComponentType } from 'react';
import { Home } from '../pages/Home';
import { Blog } from '../pages/Blog';
import { BlogPost } from '../pages/BlogPost';
import { Services } from '../pages/Services';
import { ServicePage } from '../pages/ServicePage';
import { WebsitesPage } from '../pages/ServicePage/WebsitesPage';
import { WorkflowPage } from '../pages/ServicePage/WorkflowPage';
import { OutreachPage } from '../pages/ServicePage/OutreachPage';
import { CustomerServicePage } from '../pages/ServicePage/CustomerServicePage';
import { CustomPage } from '../pages/ServicePage/CustomPage';
import { Contact } from '../pages/Contact';
import { GratisGuide } from '../pages/GratisGuide';
import { GuideThankYou } from '../pages/GuideThankYou';
import { AnalysisThankYou } from '../pages/AnalysisThankYou';
import { Call } from '../pages/Call';
import { BusinessCard } from '../pages/BusinessCard';
import { Privacy } from '../pages/Privacy';
import { Terms } from '../pages/Terms';
import { Cookies } from '../pages/Cookies';
import { Oplossingen } from '../pages/Oplossingen';
import { OplossingPage } from '../pages/OplossingPage';
import { ShowcaseCompanyPage } from '../pages/ShowcaseCompanyPage';
import { MetselaarShowcase } from '../pages/MetselaarShowcase';

export interface Route {
  path: string;
  component: ComponentType<any>;
  layout?: boolean;
  params?: string[];
  redirect?: string;
}

export const routes: Route[] = [
  { path: '/', component: Home },
  { path: '/blog', component: Blog },
  { path: '/blog/:slug', component: BlogPost, params: ['slug'] },
  { path: '/diensten', component: Services },
  // Specific service routes
  { path: '/diensten/websites', component: WebsitesPage },
  { path: '/diensten/websites/metselaar', component: MetselaarShowcase },
  { path: '/diensten/workflow', component: WorkflowPage },
  { path: '/diensten/outreach', component: OutreachPage },
  { path: '/diensten/customer-service', component: CustomerServicePage },
  { path: '/diensten/custom', component: CustomPage },
  // Showcase company routes - must come before generic service route (no layout)
  { path: '/diensten/websites/:businessType/:slug', component: ShowcaseCompanyPage, params: ['businessType', 'slug'], layout: false },
  // Generic service route should come after specific routes
  { path: '/diensten/:serviceId', component: ServicePage, params: ['serviceId'] },
  { path: '/contact', component: Contact },
  { path: '/gratis-guide', component: GratisGuide },
  { path: '/gratis-guide/bedankt', component: GuideThankYou },
  { path: '/analysis-thank-you', component: AnalysisThankYou },
  { path: '/call', component: Call },
  { path: '/visitekaartje', component: BusinessCard },
  { path: '/privacy', component: Privacy },
  { path: '/terms', component: Terms },
  { path: '/cookies', component: Cookies },
  { path: '/oplossingen', component: Oplossingen },
  { path: '/oplossingen/:slug', component: OplossingPage, params: ['slug'] }
];