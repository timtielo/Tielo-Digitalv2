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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tielo-orange"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (userProfile?.is_admin) {
    return (
      <DashboardLayout currentPage="home">
        <div className="space-y-6 md:space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-tielo-navy rounded-td p-6 md:p-8 text-white shadow-xl relative overflow-hidden"
          >
            <div className="absolute inset-0 td-striped opacity-10" />
            <div className="flex items-start justify-between gap-4 relative">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl md:text-3xl font-bold font-rubik mb-2">
                  Welkom terug, {userProfile.name || 'Admin'}
                </h1>
                <p className="text-white/80 text-base md:text-lg">
                  Admin Dashboard - Beheer en Overzicht
                </p>
              </div>
              <Shield className="h-12 w-12 md:h-16 md:w-16 text-tielo-orange/30 flex-shrink-0" />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card
                className="td-card p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 group"
                onClick={() => handleNavigation('/dashboard/admin')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-tielo-orange/10 rounded-td group-hover:bg-tielo-orange/20 transition-colors">
                    <Users className="h-6 w-6 text-tielo-orange" />
                  </div>
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <h3 className="text-xs font-bold text-tielo-navy/60 mb-1 uppercase tracking-wide">Total Clients</h3>
                {loading ? (
                  <div className="h-9 w-16 bg-tielo-steel/20 rounded animate-pulse"></div>
                ) : (
                  <p className="text-3xl font-bold font-rubik text-tielo-navy">{adminMetrics.totalUsers}</p>
                )}
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card
                className="td-card p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 group"
                onClick={() => handleNavigation('/dashboard/admin/projects')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-tielo-orange/10 rounded-td group-hover:bg-tielo-orange/20 transition-colors">
                    <CheckCircle className="h-6 w-6 text-tielo-orange" />
                  </div>
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <h3 className="text-xs font-bold text-tielo-navy/60 mb-1 uppercase tracking-wide">Active Projects</h3>
                {loading ? (
                  <div className="h-9 w-16 bg-tielo-steel/20 rounded animate-pulse"></div>
                ) : (
                  <p className="text-3xl font-bold font-rubik text-tielo-navy">{adminMetrics.activeProjects}</p>
                )}
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card
                className="td-card p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 group"
                onClick={() => handleNavigation('/dashboard/tasks')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-tielo-orange/10 rounded-td group-hover:bg-tielo-orange/20 transition-colors">
                    <AlertCircle className="h-6 w-6 text-tielo-orange" />
                  </div>
                  <Calendar className="h-5 w-5 text-tielo-navy/40" />
                </div>
                <h3 className="text-xs font-bold text-tielo-navy/60 mb-1 uppercase tracking-wide">Pending Tasks</h3>
                {loading ? (
                  <div className="h-9 w-16 bg-tielo-steel/20 rounded animate-pulse"></div>
                ) : (
                  <p className="text-3xl font-bold font-rubik text-tielo-navy">{adminMetrics.pendingTasks}</p>
                )}
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card
                className="td-card p-6 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 group"
                onClick={() => handleNavigation('/dashboard/leads')}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-tielo-orange/10 rounded-td group-hover:bg-tielo-orange/20 transition-colors">
                    <MessageSquare className="h-6 w-6 text-tielo-orange" />
                  </div>
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <h3 className="text-xs font-bold text-tielo-navy/60 mb-1 uppercase tracking-wide">New Leads (7d)</h3>
                {loading ? (
                  <div className="h-9 w-16 bg-tielo-steel/20 rounded animate-pulse"></div>
                ) : (
                  <p className="text-3xl font-bold font-rubik text-tielo-navy">{adminMetrics.newLeads}</p>
                )}
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl md:text-2xl font-bold font-rubik text-tielo-navy mb-4 md:mb-6">Quick Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => handleNavigation('/dashboard/admin')}
                className="w-full text-left flex items-center gap-4 bg-white border border-tielo-navy/10 rounded-td px-5 py-4 group hover:border-tielo-orange/40 hover:bg-tielo-orange/5 transition-all"
              >
                <div className="p-2.5 bg-tielo-orange/10 rounded-td group-hover:bg-tielo-orange/20 transition-colors flex-shrink-0">
                  <Shield className="h-5 w-5 text-tielo-orange" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-tielo-orange mb-0.5">Beheer</p>
                  <p className="text-tielo-navy font-semibold text-sm leading-snug">User Management</p>
                </div>
                <span className="flex items-center gap-1 text-tielo-orange font-medium text-sm whitespace-nowrap group-hover:gap-2 transition-all flex-shrink-0">
                  Open <ArrowRight className="w-4 h-4" />
                </span>
              </button>

              <button
                onClick={() => handleNavigation('/dashboard/mcc')}
                className="w-full text-left flex items-center gap-4 bg-white border border-tielo-navy/10 rounded-td px-5 py-4 group hover:border-tielo-orange/40 hover:bg-tielo-orange/5 transition-all"
              >
                <div className="p-2.5 bg-tielo-orange/10 rounded-td group-hover:bg-tielo-orange/20 transition-colors flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-tielo-orange" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-tielo-orange mb-0.5">Projecten</p>
                  <p className="text-tielo-navy font-semibold text-sm leading-snug">Mission Control</p>
                </div>
                <span className="flex items-center gap-1 text-tielo-orange font-medium text-sm whitespace-nowrap group-hover:gap-2 transition-all flex-shrink-0">
                  Open <ArrowRight className="w-4 h-4" />
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPage="home">
      <div className="space-y-6 md:space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-tielo-navy rounded-td p-6 md:p-8 text-white shadow-xl relative overflow-hidden"
        >
          <div className="absolute inset-0 td-striped opacity-10" />
          <div className="flex items-start gap-4 md:gap-6 relative">
            {userProfile?.profile_picture_url && (
              <img
                src={userProfile.profile_picture_url}
                alt="Profile"
                className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-4 border-tielo-orange/30 shadow-lg flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold font-rubik mb-2">
                Welkom terug, {userProfile?.name || 'User'}
              </h1>
              {userProfile?.business_name && (
                <p className="text-white/80 text-base md:text-lg mb-3 truncate">
                  {userProfile.business_name}
                </p>
              )}
              {userProfile?.website_url && (
                <a
                  href={userProfile.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-tielo-orange hover:bg-tielo-orange/90 rounded-td text-sm font-bold transition-colors"
                >
                  <ExternalLink className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{userProfile.website_url.replace(/^https?:\/\//, '')}</span>
                </a>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-xl md:text-2xl font-bold font-rubik text-tielo-navy">Jouw Taken</h2>
                <button
                  onClick={() => handleNavigation('/dashboard/tasks')}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-tielo-orange hover:bg-tielo-orange/90 text-white rounded-td transition-all font-bold text-sm md:text-base w-full sm:w-auto shadow-md hover:shadow-lg"
                >
                  Alle taken bekijken
                  <ArrowRight className="h-4 w-4 flex-shrink-0" />
                </button>
              </div>
              <ProjectTasksList limit={2} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-xl md:text-2xl font-bold font-rubik text-tielo-navy mb-4 md:mb-6">Jouw Dashboard Modules</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {modules.map((module) => {
                  const Icon = iconMap[module.icon_name] || User;
                  return (
                    <button
                      key={module.module_key}
                      onClick={() => handleNavigation(module.route_path)}
                      className="w-full text-left flex items-center gap-4 bg-white border border-tielo-navy/10 rounded-td px-5 py-4 group hover:border-tielo-orange/40 hover:bg-tielo-orange/5 transition-all"
                    >
                      <div className="p-2.5 bg-tielo-orange/10 rounded-td group-hover:bg-tielo-orange/20 transition-colors flex-shrink-0">
                        <Icon className="h-5 w-5 text-tielo-orange" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] uppercase font-bold tracking-widest text-tielo-orange mb-0.5">{module.module_key.replace(/_/g, ' ')}</p>
                        <p className="text-tielo-navy font-semibold text-sm leading-snug truncate">{module.display_name}</p>
                      </div>
                      <span className="flex items-center gap-1 text-tielo-orange font-medium text-sm whitespace-nowrap group-hover:gap-2 transition-all flex-shrink-0">
                        Open <ArrowRight className="w-4 h-4" />
                      </span>
                    </button>
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
              <Card className="td-card p-6 sticky top-24 border-2 border-tielo-orange/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-tielo-orange/10 rounded-td">
                    <LinkIcon className="w-5 h-5 text-tielo-orange" />
                  </div>
                  <h2 className="text-xl font-bold font-rubik text-tielo-navy">Belangrijke Links</h2>
                </div>
                <div
                  className="space-y-2 [&_*]:!text-tielo-navy [&_*]:!bg-transparent [&_a]:!text-tielo-orange [&_a]:!font-bold [&_a]:!hover:text-tielo-orange/80 [&_a]:!transition-colors [&_a]:!underline [&_a]:!decoration-tielo-orange/30 [&_a]:!underline-offset-2 [&_ul]:!space-y-2 [&_li]:!text-sm [&_li]:!leading-relaxed [&_strong]:!text-tielo-navy [&_strong]:!font-bold [&_b]:!text-tielo-navy [&_b]:!font-bold [&_p]:!text-tielo-navy [&_span]:!text-tielo-navy [&_div]:!text-tielo-navy"
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
