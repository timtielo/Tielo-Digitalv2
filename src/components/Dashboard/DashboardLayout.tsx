import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Star,
  MessageSquare,
  Users,
  LogOut,
  Menu,
  X,
  ChevronRight,
  User,
  Shield,
  UserCog,
  XCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabase/client';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage: 'portfolio' | 'werkspot' | 'reviews' | 'leads' | 'profile' | 'admin';
}

interface DashboardModule {
  module_key: string;
  display_name: string;
  icon_name: string;
  route_path: string;
  sort_order: number;
}

interface UserProfile {
  name: string;
  business_name: string;
  profile_picture_url?: string;
}

const iconMap: Record<string, any> = {
  Briefcase,
  Star,
  MessageSquare,
  Users,
  User,
  Shield,
};

export function DashboardLayout({ children, currentPage }: DashboardLayoutProps) {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navigation, setNavigation] = useState<DashboardModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [impersonatedUserEmail, setImpersonatedUserEmail] = useState('');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserModules();
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

      // Restore admin session
      const { error } = await supabase.auth.setSession({
        access_token: adminSession.access_token,
        refresh_token: adminSession.refresh_token
      });

      if (error) throw error;

      // Clear impersonation data
      sessionStorage.removeItem('admin_session');
      sessionStorage.removeItem('is_impersonating');

      // Redirect to admin page
      window.history.pushState({}, '', '/dashboard/admin');
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.location.reload();
    } catch (error) {
      console.error('Error returning to admin:', error);
    }
  };

  const fetchUserModules = async () => {
    try {
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('is_admin, name, business_name, profile_picture_url')
        .eq('id', user?.id)
        .maybeSingle();

      setIsAdmin(profileData?.is_admin || false);
      setUserProfile({
        name: profileData?.name || '',
        business_name: profileData?.business_name || '',
        profile_picture_url: profileData?.profile_picture_url || undefined
      });

      const { data, error } = await supabase
        .from('user_dashboard_config')
        .select(`
          module_key,
          sort_order,
          dashboard_modules (
            display_name,
            icon_name,
            route_path
          )
        `)
        .eq('user_id', user?.id)
        .eq('enabled', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      const modules = data?.map(item => ({
        module_key: item.module_key,
        display_name: (item.dashboard_modules as any)?.display_name || '',
        icon_name: (item.dashboard_modules as any)?.icon_name || '',
        route_path: (item.dashboard_modules as any)?.route_path || '',
        sort_order: item.sort_order,
      })) || [];

      setNavigation(modules);
    } catch (error) {
      console.error('Error fetching user modules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (href: string) => {
    window.history.pushState({}, '', href);
    window.dispatchEvent(new PopStateEvent('popstate'));
    setMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    window.history.pushState({}, '', '/login');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
      <div className="flex h-screen overflow-hidden">
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out
          lg:relative lg:translate-x-0
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
              <button
                onClick={() => handleNavigation('/dashboard')}
                className="text-xl font-bold text-gray-900 hover:text-primary transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  {navigation.map((item) => {
                    const Icon = iconMap[item.icon_name] || User;
                    const isActive = currentPage === item.module_key;
                    return (
                      <button
                        key={item.module_key}
                        onClick={() => handleNavigation(item.route_path)}
                        className={`
                          w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                          ${isActive
                            ? 'bg-primary text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                          }
                        `}
                      >
                        <Icon className="h-5 w-5" />
                        {item.display_name}
                        {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
                      </button>
                    );
                  })}

                  {isAdmin && (
                    <>
                      <div className="border-t border-gray-200 my-2 pt-2" />
                      <button
                        onClick={() => handleNavigation('/dashboard/admin')}
                        className={`
                          w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                          ${currentPage === 'admin'
                            ? 'bg-primary text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                          }
                        `}
                      >
                        <Shield className="h-5 w-5" />
                        Admin
                        {currentPage === 'admin' && <ChevronRight className="h-4 w-4 ml-auto" />}
                      </button>
                    </>
                  )}
                </>
              )}
            </nav>

            <div className="border-t border-gray-200 p-4 space-y-4">
              {userProfile && (
                <div className="flex items-center gap-3 px-2">
                  <div className="relative flex-shrink-0">
                    {userProfile.profile_picture_url ? (
                      <img
                        src={userProfile.profile_picture_url}
                        alt={userProfile.name || 'Profile'}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {userProfile.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {userProfile.business_name || 'No business'}
                    </p>
                  </div>
                </div>
              )}
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                Uitloggen
              </Button>
            </div>
          </div>
        </aside>

        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 lg:px-8">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden mr-4"
            >
              <Menu className="h-6 w-6 text-gray-500" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900 capitalize">
              {currentPage === 'admin' ? 'Admin' : navigation.find(n => n.module_key === currentPage)?.display_name || currentPage}
            </h2>
          </header>

          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
