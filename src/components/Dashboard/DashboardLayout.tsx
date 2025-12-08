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
  XCircle,
  Target
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabase/client';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage: 'portfolio' | 'werkspot' | 'reviews' | 'leads' | 'profile' | 'admin' | 'mcc';
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
          <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white">
            <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200 bg-white">
              <button
                onClick={() => handleNavigation('/dashboard')}
                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-cyan-700 transition-all"
              >
                Dashboard
              </button>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <>
                  <div className="mb-4 px-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Menu</p>
                  </div>
                  {navigation.map((item) => {
                    const Icon = iconMap[item.icon_name] || User;
                    const isActive = currentPage === item.module_key;
                    return (
                      <button
                        key={item.module_key}
                        onClick={() => handleNavigation(item.route_path)}
                        className={`
                          w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200
                          ${isActive
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30 scale-[1.02]'
                            : 'text-gray-700 hover:bg-white hover:shadow-md'
                          }
                        `}
                      >
                        <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-gray-100'}`}>
                          <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                        </div>
                        <span className="flex-1 text-left">{item.display_name}</span>
                        {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
                      </button>
                    );
                  })}

                  {isAdmin && (
                    <>
                      <div className="border-t border-gray-200 my-4" />
                      <div className="mb-3 px-3">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Beheer</p>
                      </div>
                      <button
                        onClick={() => handleNavigation('/dashboard/admin')}
                        className={`
                          w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200
                          ${currentPage === 'admin'
                            ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-500/30 scale-[1.02]'
                            : 'text-gray-700 hover:bg-white hover:shadow-md'
                          }
                        `}
                      >
                        <div className={`p-2 rounded-lg ${currentPage === 'admin' ? 'bg-white/20' : 'bg-gray-100'}`}>
                          <Shield className={`h-4 w-4 ${currentPage === 'admin' ? 'text-white' : 'text-gray-600'}`} />
                        </div>
                        <span className="flex-1 text-left">Admin</span>
                        {currentPage === 'admin' && <ChevronRight className="h-4 w-4 ml-auto" />}
                      </button>
                      <button
                        onClick={() => handleNavigation('/dashboard/mcc')}
                        className={`
                          w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200
                          ${currentPage === 'mcc'
                            ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-500/30 scale-[1.02]'
                            : 'text-gray-700 hover:bg-white hover:shadow-md'
                          }
                        `}
                      >
                        <div className={`p-2 rounded-lg ${currentPage === 'mcc' ? 'bg-white/20' : 'bg-gray-100'}`}>
                          <Target className={`h-4 w-4 ${currentPage === 'mcc' ? 'text-white' : 'text-gray-600'}`} />
                        </div>
                        <span className="flex-1 text-left">Mission Control</span>
                        {currentPage === 'mcc' && <ChevronRight className="h-4 w-4 ml-auto" />}
                      </button>
                    </>
                  )}
                </>
              )}
            </nav>

            <div className="border-t border-gray-200 p-4 bg-white">
              {userProfile && (
                <button
                  onClick={() => handleNavigation('/dashboard/profile')}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors mb-3"
                >
                  <div className="relative flex-shrink-0">
                    {userProfile.profile_picture_url ? (
                      <img
                        src={userProfile.profile_picture_url}
                        alt={userProfile.name || 'Profile'}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                    )}
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {userProfile.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {userProfile.business_name || 'Bekijk profiel'}
                    </p>
                  </div>
                </button>
              )}
              <Button
                variant="outline"
                className="w-full justify-center gap-2 font-semibold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
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

        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
          <header className="h-20 bg-white border-b border-gray-200 flex items-center px-6 lg:px-8 shadow-sm">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="h-6 w-6 text-gray-600" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <button
                  onClick={() => handleNavigation('/dashboard')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Dashboard
                </button>
                <ChevronRight className="h-4 w-4" />
                <span className="text-gray-900 font-medium capitalize">
                  {currentPage === 'admin' ? 'Admin' : currentPage === 'mcc' ? 'Mission Control Center' : navigation.find(n => n.module_key === currentPage)?.display_name || currentPage}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {currentPage === 'admin' ? 'Admin' : currentPage === 'mcc' ? 'Mission Control Center' : navigation.find(n => n.module_key === currentPage)?.display_name || currentPage}
              </h2>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto bg-gray-50">
            <div className="container mx-auto px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
