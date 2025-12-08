import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Star,
  MessageSquare,
  Users,
  User,
  Shield,
  ArrowRight,
  LogOut,
  ExternalLink,
  Link as LinkIcon,
  UserCog,
  XCircle,
} from 'lucide-react';
import {
  AuroraBackground,
  BentoGrid,
  BentoGridItem,
} from '../../components/ui/aurora-bento-grid';
import { supabase } from '../../lib/supabase/client';
import { useAuth } from '../../contexts/AuthContext';
import { ProtectedRoute } from '../../components/Dashboard/ProtectedRoute';
import { ProjectProgressCard } from '../../components/Dashboard/ProjectProgressCard';
import { ProjectTasksList } from '../../components/Dashboard/ProjectTasksList';

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

const gradientMap: Record<string, { from: string; to: string; span: string }> = {
  portfolio: {
    from: 'from-blue-500',
    to: 'to-cyan-400',
    span: 'md:col-span-3',
  },
  werkspot: {
    from: 'from-amber-500',
    to: 'to-yellow-400',
    span: 'md:col-span-3',
  },
  reviews: {
    from: 'from-teal-500',
    to: 'to-emerald-400',
    span: 'md:col-span-2',
  },
  leads: {
    from: 'from-green-500',
    to: 'to-lime-400',
    span: 'md:col-span-2',
  },
  profile: {
    from: 'from-orange-500',
    to: 'to-amber-400',
    span: 'md:col-span-2',
  },
  admin: {
    from: 'from-red-500',
    to: 'to-rose-400',
    span: 'md:col-span-2',
  },
};

function DashboardHomeContent() {
  const { user } = useAuth();
  const [modules, setModules] = useState<DashboardModule[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [impersonatedUserEmail, setImpersonatedUserEmail] = useState('');

  useEffect(() => {
    if (user) {
      fetchUserData();
      checkImpersonation();
    }
  }, [user]);

  const checkImpersonation = () => {
    const isImpersonatingFlag = sessionStorage.getItem('is_impersonating');
    const adminSessionStr = sessionStorage.getItem('admin_session');

    if (isImpersonatingFlag === 'true' && adminSessionStr) {
      try {
        const adminSession = JSON.parse(adminSessionStr);
        // Only show impersonation banner if the current user is different from the admin
        if (adminSession.user_id && adminSession.user_id !== user?.id) {
          setIsImpersonating(true);
          setImpersonatedUserEmail(user?.email || '');
        } else {
          // Clear stale impersonation flags
          sessionStorage.removeItem('is_impersonating');
          sessionStorage.removeItem('admin_session');
        }
      } catch (error) {
        // Invalid session data, clear it
        sessionStorage.removeItem('is_impersonating');
        sessionStorage.removeItem('admin_session');
      }
    }
  };

  const returnToAdmin = async () => {
    const adminSessionStr = sessionStorage.getItem('admin_session');
    if (!adminSessionStr) return;

    try {
      const adminSession = JSON.parse(adminSessionStr);

      const { error } = await supabase.auth.setSession({
        access_token: adminSession.access_token,
        refresh_token: adminSession.refresh_token
      });

      if (error) throw error;

      sessionStorage.removeItem('admin_session');
      sessionStorage.removeItem('is_impersonating');

      window.history.pushState({}, '', '/dashboard/admin');
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.location.reload();
    } catch (error) {
      console.error('Error returning to admin:', error);
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

  const handleLogout = async () => {
    try {
      sessionStorage.removeItem('admin_session');
      sessionStorage.removeItem('is_impersonating');
      await supabase.auth.signOut();
      window.location.href = '/login';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  const allModules = [...modules];

  if (userProfile?.is_admin) {
    allModules.push({
      module_key: 'admin',
      display_name: 'Admin',
      icon_name: 'Shield',
      route_path: '/dashboard/admin',
      description: 'Beheer gebruikers en systeem instellingen',
      sort_order: 999,
    });
  }

  return (
    <div className="min-h-screen w-full bg-gray-950 font-sans antialiased relative">
      <AuroraBackground />

      <AnimatePresence>
        {isImpersonating && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 bg-amber-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-md"
          >
            <UserCog className="h-5 w-5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">Impersonating User</p>
              <p className="text-xs opacity-90 truncate">{impersonatedUserEmail}</p>
            </div>
            <button
              onClick={returnToAdmin}
              className="flex-shrink-0 hover:bg-amber-600 rounded p-1 transition-colors"
              title="Return to admin"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 container mx-auto px-4 py-4">
        <div className="flex justify-end mb-4">
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 rounded-xl transition-all duration-300"
          >
            <LogOut className="h-4 w-4" />
            Uitloggen
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          {userProfile?.profile_picture_url && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center mb-3"
            >
              <img
                src={userProfile.profile_picture_url}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-4 border-white/20 shadow-lg"
              />
            </motion.div>
          )}

          <h1
            className="
              text-4xl md:text-5xl font-extrabold tracking-tight
              bg-gradient-to-r from-blue-400 via-green-400 to-orange-500
              bg-clip-text text-transparent
            "
          >
            Welkom terug{userProfile?.name ? `, ${userProfile.name}` : ''}
          </h1>
          {userProfile?.business_name && (
            <p className="mt-2 text-xl text-gray-300 font-medium">
              {userProfile.business_name}
            </p>
          )}
          {userProfile?.website_url && (
            <motion.a
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              href={userProfile.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
            >
              <ExternalLink className="h-4 w-4" />
              {userProfile.website_url.replace(/^https?:\/\//, '')}
            </motion.a>
          )}
          <p className="mt-4 text-lg text-gray-400">
            Kies een module om te beginnen
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto mb-8 space-y-6">
          <ProjectProgressCard />
          <ProjectTasksList />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <BentoGrid>
              {allModules.map((module) => {
                const Icon = iconMap[module.icon_name] || User;
                const gradient = gradientMap[module.module_key] || {
                  from: 'from-gray-500',
                  to: 'to-gray-400',
                  span: 'md:col-span-2',
                };

                return (
                  <BentoGridItem
                    key={module.module_key}
                    className={gradient.span}
                    gradientFrom={gradient.from}
                    gradientTo={gradient.to}
                    onClick={() => handleNavigation(module.route_path)}
                  >
                    <div className="mb-2">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex flex-col flex-grow">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {module.display_name}
                      </h3>
                      <p className="text-gray-200 text-base leading-snug flex-grow">
                        {module.description}
                      </p>
                    </div>
                    <div className="mt-3">
                      <span
                        className="
                          text-white font-semibold text-base inline-flex items-center
                          group/link
                        "
                      >
                        Openen
                        <ArrowRight className="ml-1 w-5 h-5 transition-transform duration-300 group-hover/link:translate-x-1" />
                      </span>
                    </div>
                  </BentoGridItem>
                );
              })}
            </BentoGrid>
          </div>

          {userProfile?.important_links && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
                <div className="flex items-center gap-2 mb-4">
                  <LinkIcon className="w-6 h-6 text-blue-400 flex-shrink-0" />
                  <h2 className="text-xl font-bold text-white">Belangrijke Links</h2>
                </div>
                <div
                  className="prose prose-invert prose-sm max-w-none text-gray-200 [&_a]:text-blue-400 [&_a]:hover:text-blue-300 [&_a]:transition-colors [&_a]:underline [&_a]:decoration-blue-400/30 [&_ul]:space-y-2 [&_li]:text-sm"
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
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export function DashboardHome() {
  return (
    <ProtectedRoute>
      <DashboardHomeContent />
    </ProtectedRoute>
  );
}
