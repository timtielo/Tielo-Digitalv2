import { ComponentType } from 'react';
import { Home } from '../pages/Home';
import { Blog } from '../pages/Blog';
import { BlogPost } from '../pages/BlogPost';
import { Diensten } from '../pages/Diensten';
import { WebsitesPage } from '../pages/ServicePage/WebsitesPage';
import { MaatwerkPage } from '../pages/MaatwerkPage';
import { OverOns } from '../pages/OverOns';
import { Cases } from '../pages/Cases';
import { Contact } from '../pages/Contact';
import { LoodgieterPage } from '../pages/trades/LoodgieterPage';
import { SchilderPage } from '../pages/trades/SchilderPage';
import { KlusbedrijfPage } from '../pages/trades/KlusbedrijfPage';
import { ElektricienPage } from '../pages/trades/ElektricienPage';
import { AannemerPage } from '../pages/trades/AannemerPage';
import { MetselaarPage } from '../pages/trades/MetselaarPage';
import { BusinessCard } from '../pages/BusinessCard';
import { Privacy } from '../pages/Privacy';
import { Terms } from '../pages/Terms';
import { Cookies } from '../pages/Cookies';
import { ShowcaseCompanyPage } from '../pages/ShowcaseCompanyPage';
import { Login } from '../pages/Login';
import { ResetPassword } from '../pages/ResetPassword';
import { PortfolioPage } from '../pages/Dashboard/PortfolioPage';
import { WerkspotPage } from '../pages/Dashboard/WerkspotPage';
import { ReviewsPage } from '../pages/Dashboard/ReviewsPage';
import { LeadsPage } from '../pages/Dashboard/LeadsPage';
import { ProfilePage } from '../pages/Dashboard/ProfilePage';
import { AdminPage } from '../pages/Dashboard/AdminPage';
import { DashboardHome } from '../pages/Dashboard/DashboardHome';
import { TasksPage } from '../pages/Dashboard/TasksPage';
import { MissionControlPage } from '../pages/Dashboard/MissionControlPage';
import { ProjectsManagementPage } from '../pages/Dashboard/ProjectsManagementPage';
import { ProjectTasksManagementPage } from '../pages/Dashboard/ProjectTasksManagementPage';
import { BlogsPage } from '../pages/Dashboard/BlogsPage';
import { VideosPage } from '../pages/Dashboard/VideosPage';

export interface Route {
  path: string;
  component: ComponentType<any>;
  layout?: boolean;
  params?: string[];
  redirect?: string;
}

export const routes: Route[] = [
  { path: '/', component: Home },
  { path: '/login', component: Login, layout: false },
  { path: '/reset-password', component: ResetPassword, layout: false },
  { path: '/dashboard', component: DashboardHome, layout: false },
  { path: '/dashboard/tasks', component: TasksPage, layout: false },
  { path: '/dashboard/portfolio', component: PortfolioPage, layout: false },
  { path: '/dashboard/werkspot', component: WerkspotPage, layout: false },
  { path: '/dashboard/reviews', component: ReviewsPage, layout: false },
  { path: '/dashboard/leads', component: LeadsPage, layout: false },
  { path: '/dashboard/profile', component: ProfilePage, layout: false },
  { path: '/dashboard/admin', component: AdminPage, layout: false },
  { path: '/dashboard/admin/projects', component: ProjectsManagementPage, layout: false },
  { path: '/dashboard/admin/projects/:projectId/tasks', component: ProjectTasksManagementPage, params: ['projectId'], layout: false },
  { path: '/dashboard/mcc', component: MissionControlPage, layout: false },
  { path: '/dashboard/blogs', component: BlogsPage, layout: false },
  { path: '/dashboard/videos', component: VideosPage, layout: false },
  { path: '/blog', component: Blog },
  { path: '/blog/:slug', component: BlogPost, params: ['slug'] },
  { path: '/diensten', component: Diensten },
  { path: '/diensten/websites', component: WebsitesPage },
  { path: '/diensten/websites/loodgieter', component: LoodgieterPage },
  { path: '/diensten/websites/schilder', component: SchilderPage },
  { path: '/diensten/websites/klusbedrijf', component: KlusbedrijfPage },
  { path: '/diensten/websites/elektricien', component: ElektricienPage },
  { path: '/diensten/websites/aannemer', component: AannemerPage },
  { path: '/diensten/websites/metselaar', component: MetselaarPage },
  { path: '/diensten/websites/:businessType/:slug', component: ShowcaseCompanyPage, params: ['businessType', 'slug'], layout: false },
  { path: '/diensten/maatwerk', component: MaatwerkPage },
  { path: '/over-ons', component: OverOns },
  { path: '/cases', component: Cases },
  { path: '/contact', component: Contact },
  { path: '/visitekaartje', component: BusinessCard },
  { path: '/privacy', component: Privacy },
  { path: '/terms', component: Terms },
  { path: '/cookies', component: Cookies }
];
