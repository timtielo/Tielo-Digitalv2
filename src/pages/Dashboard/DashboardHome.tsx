import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Star,
  MessageSquare,
  Users,
  User,
  Shield,
  ArrowRight,
  ExternalLink,
  Link as LinkIcon,
  TrendingUp,
  Calendar,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { supabase } from '../../lib/supabase/client';
import { useAuth } from '../../contexts/AuthContext';
import { ProtectedRoute } from '../../components/Dashboard/ProtectedRoute';
import { DashboardLayout } from '../../components/Dashboard/DashboardLayout';
import { ProjectProgressCard } from '../../components/Dashboard/ProjectProgressCard';
import { ProjectTasksList } from '../../components/Dashboard/ProjectTasksList';
import { Card } from '../../components/ui/Card';

interface DashboardModule {
  module_key: string;
  display_name: string;
  icon_name: string;
  route_path: string;
  description: string;
  sort_order: number;
}

interface UserProfile {
  name: string;
  business_name: string;
  is_admin: boolean;
  profile_picture_url: string | null;
  website_url: string | null;
  important_links: string | null;
}

const iconMap: Record<string, any> = {
  Briefcase,
  Star,
  MessageSquare,
  Users,
  User,
  Shield,
};

interface AdminMetrics {
  totalUsers: number;
  activeProjects: number;
  pendingTasks: number;
  newLeads: number;
}

function DashboardHomeContent() {
  const { user } = useAuth();
  const [modules, setModules] = useState<DashboardModule[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminMetrics, setAdminMetrics] = useState<AdminMetrics>({
    totalUsers: 0,
    activeProjects: 0,
    pendingTasks: 0,
    newLeads: 0,
  });

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchAdminMetrics = async () => {
    try {
      const { count: usersCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_admin', false);

      const { count: projectsCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('active', true);

      const { count: tasksCount } = await supabase
        .from('project_tasks')
        .select('*', { count: 'exact', head: true })
        .in('status', ['todo', 'in_progress']);

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { count: leadsCount } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .gte('date', sevenDaysAgo.toISOString())
        .eq('archived', false);

      setAdminMetrics({
        totalUsers: usersCount || 0,
        activeProjects: projectsCount || 0,
        pendingTasks: tasksCount || 0,
        newLeads: leadsCount || 0,
      });
    } catch (error) {
      console.error('Error fetching admin metrics:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('name, business_name, is_admin, profile_picture_url, website_url, important_links')
        .eq('id', user?.id)
        .maybeSingle();

      setUserProfile(profileData);

      if (profileData?.is_admin) {
        await fetchAdminMetrics();
      }

      const { data, error } = await supabase
        .from('user_dashboard_config')
        .select(`
          module_key,
          sort_order,
          dashboard_modules (
            display_name,
            icon_name,
            route_path,
            description
          )
        `)
        .eq('user_id', user?.id)
        .eq('enabled', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      const modulesList = data?.map(item => ({
        module_key: item.module_key,
        display_name: (item.dashboard_modules as any)?.display_name || '',
        icon_name: (item.dashboard_modules as any)?.icon_name || '',
        route_path: (item.dashboard_modules as any)?.route_path || '',
        description: (item.dashboard_modules as any)?.description || '',
        sort_order: item.sort_order,
      })) || [];

      setModules(modulesList);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  if (loading) {
    return (
      <DashboardLayout currentPage="home">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (userProfile?.is_admin) {
    return (
      <DashboardLayout currentPage="home">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-8 text-white shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">
                  Welkom terug, {userProfile.name || 'Admin'}
                </h1>
                <p className="text-blue-100 text-lg">
                  Admin Dashboard - Beheer en Overzicht
                </p>
              </div>
              <Shield className="h-16 w-16 text-white/30" />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card
                className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 border-blue-500 hover:scale-105"
                onClick={() => handleNavigation('/dashboard/admin')}
              >
                <div className="flex items-center justify-between mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Total Clients</h3>
                {loading ? (
                  <div className="h-9 w-16 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <p className="text-3xl font-bold text-gray-900">{adminMetrics.totalUsers}</p>
                )}
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card
                className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 border-green-500 hover:scale-105"
                onClick={() => handleNavigation('/dashboard/admin/projects')}
              >
                <div className="flex items-center justify-between mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Active Projects</h3>
                {loading ? (
                  <div className="h-9 w-16 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <p className="text-3xl font-bold text-gray-900">{adminMetrics.activeProjects}</p>
                )}
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card
                className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 border-amber-500 hover:scale-105"
                onClick={() => handleNavigation('/dashboard/tasks')}
              >
                <div className="flex items-center justify-between mb-4">
                  <AlertCircle className="h-8 w-8 text-amber-600" />
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Pending Tasks</h3>
                {loading ? (
                  <div className="h-9 w-16 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <p className="text-3xl font-bold text-gray-900">{adminMetrics.pendingTasks}</p>
                )}
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card
                className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 border-rose-500 hover:scale-105"
                onClick={() => handleNavigation('/dashboard/leads')}
              >
                <div className="flex items-center justify-between mb-4">
                  <MessageSquare className="h-8 w-8 text-rose-600" />
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">New Leads (7d)</h3>
                {loading ? (
                  <div className="h-9 w-16 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <p className="text-3xl font-bold text-gray-900">{adminMetrics.newLeads}</p>
                )}
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card
                className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-rose-500"
                onClick={() => handleNavigation('/dashboard/admin')}
              >
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-rose-100 rounded-xl group-hover:bg-rose-200 transition-colors">
                    <Shield className="h-8 w-8 text-rose-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      User Management
                    </h3>
                    <p className="text-gray-600">
                      Beheer gebruikers, rollen en toegangsrechten
                    </p>
                  </div>
                  <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
                </div>
              </Card>

              <Card
                className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-teal-500"
                onClick={() => handleNavigation('/dashboard/mcc')}
              >
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-teal-100 rounded-xl group-hover:bg-teal-200 transition-colors">
                    <CheckCircle className="h-8 w-8 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      Mission Control
                    </h3>
                    <p className="text-gray-600">
                      Projecten en taken beheer systeem
                    </p>
                  </div>
                  <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPage="home">
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-8 text-white shadow-xl"
        >
          <div className="flex items-start gap-6">
            {userProfile?.profile_picture_url && (
              <img
                src={userProfile.profile_picture_url}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-4 border-white/30 shadow-lg"
              />
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">
                Welkom terug, {userProfile?.name || 'User'}
              </h1>
              {userProfile?.business_name && (
                <p className="text-blue-100 text-lg mb-3">
                  {userProfile.business_name}
                </p>
              )}
              {userProfile?.website_url && (
                <a
                  href={userProfile.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm"
                >
                  <ExternalLink className="h-4 w-4" />
                  {userProfile.website_url.replace(/^https?:\/\//, '')}
                </a>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <ProjectProgressCard />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Jouw Taken</h2>
                <button
                  onClick={() => handleNavigation('/dashboard/tasks')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 border-2 border-blue-300 text-blue-700 rounded-xl transition-all font-medium"
                >
                  Alle taken bekijken
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <ProjectTasksList limit={2} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Jouw Dashboard Modules</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modules.map((module) => {
                  const Icon = iconMap[module.icon_name] || User;
                  return (
                    <Card
                      key={module.module_key}
                      className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-blue-500"
                      onClick={() => handleNavigation(module.route_path)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                          <Icon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {module.display_name}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {module.description}
                          </p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </div>
                    </Card>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {userProfile?.important_links && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-1"
            >
              <Card className="p-6 sticky top-24 border-2 border-blue-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <LinkIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Belangrijke Links</h2>
                </div>
                <div
                  className="prose prose-sm max-w-none [&_a]:text-blue-600 [&_a]:font-semibold [&_a]:hover:text-blue-800 [&_a]:transition-colors [&_a]:underline [&_a]:decoration-blue-300 [&_a]:underline-offset-2 [&_ul]:space-y-2 [&_li]:text-sm [&_li]:leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: userProfile.important_links }}
                  onClick={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.tagName === 'A') {
                      const link = target as HTMLAnchorElement;
                      link.setAttribute('target', '_blank');
                      link.setAttribute('rel', 'noopener noreferrer');
                    }
                  }}
                />
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export function DashboardHome() {
  return (
    <ProtectedRoute>
      <DashboardHomeContent />
    </ProtectedRoute>
  );
}
