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
  Target,
  Home,
  ListTodo,
  FileText,
  Smartphone
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabase/client';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage: 'home' | 'tasks' | 'portfolio' | 'werkspot' | 'reviews' | 'leads' | 'profile' | 'admin' | 'mcc' | 'blogs' | 'mobile_photos';
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
  FileText,
  Smartphone,
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
        .from('user_modules')
        .select(`
          module_key,
          dashboard_modules (
            display_name,
            icon_name,
            route_path
          )
        `)
        .eq('user_id', user?.id);

      if (error) throw error;

      const modules = data?.map((item, index) => ({
        module_key: item.module_key,
        display_name: (item.dashboard_modules as any)?.display_name || '',
        icon_name: (item.dashboard_modules as any)?.icon_name || '',
        route_path: (item.dashboard_modules as any)?.route_path || '',
        sort_order: index,
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
    <div className="min-h-screen bg-tielo-offwhite">
      <AnimatePresence>
        {isImpersonating && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 bg-tielo-orange text-white px-4 py-3 rounded-td shadow-lg flex items-center gap-3 max-w-md"
          >
            <UserCog className="h-5 w-5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold">Impersonating User</p>
              <p className="text-xs opacity-90 truncate">{impersonatedUserEmail}</p>
            </div>
            <button
              onClick={returnToAdmin}
              className="flex-shrink-0 hover:bg-white/20 rounded p-1 transition-colors"
              title="Return to admin"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex h-screen overflow-hidden">
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-tielo-navy border-r border-tielo-steel/20 transform transition-transform duration-200 ease-in-out
          lg:relative lg:translate-x-0
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex flex-col h-full relative overflow-hidden">
            <div className="absolute inset-0 td-striped opacity-5" />
            <div className="flex items-center justify-between h-20 px-6 border-b border-white/10 relative">
              <button
                onClick={() => handleNavigation('/dashboard')}
                className="text-2xl font-bold font-rubik text-white hover:text-tielo-orange transition-all"
              >
                Dashboard
              </button>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden p-2 hover:bg-white/10 rounded-td transition-colors"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto relative">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tielo-orange"></div>
                </div>
              ) : (
                <>
                  <div className="mb-4 px-3">
                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">Menu</p>
                  </div>
                  <button
                    onClick={() => handleNavigation('/dashboard')}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3.5 rounded-td text-sm font-bold transition-all duration-200 relative
                      ${currentPage === 'home'
                        ? 'bg-tielo-orange text-white shadow-lg'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    <Home className="h-4 w-4" />
                    <span className="flex-1 text-left">Home</span>
                    {currentPage === 'home' && <ChevronRight className="h-4 w-4 ml-auto" />}
                  </button>
                  {!isAdmin && (
                    <button
                      onClick={() => handleNavigation('/dashboard/tasks')}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3.5 rounded-td text-sm font-bold transition-all duration-200
                        ${currentPage === 'tasks'
                          ? 'bg-tielo-orange text-white shadow-lg'
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                        }
                      `}
                    >
                      <ListTodo className="h-4 w-4" />
                      <span className="flex-1 text-left">Taken</span>
                      {currentPage === 'tasks' && <ChevronRight className="h-4 w-4 ml-auto" />}
                    </button>
                  )}
                  {navigation.map((item) => {
                    const Icon = iconMap[item.icon_name] || User;
                    const isActive = currentPage === item.module_key;
                    return (
                      <button
                        key={item.module_key}
                        onClick={() => handleNavigation(item.route_path)}
                        className={`
                          w-full flex items-center gap-3 px-4 py-3.5 rounded-td text-sm font-bold transition-all duration-200
                          ${isActive
                            ? 'bg-tielo-orange text-white shadow-lg'
                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                          }
                        `}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="flex-1 text-left">{item.display_name}</span>
                        {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
                      </button>
                    );
                  })}

                  {isAdmin && (
                    <>
                      <div className="border-t border-white/10 my-4" />
                      <div className="mb-3 px-3">
                        <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Beheer</p>
                      </div>
                      <button
                        onClick={() => handleNavigation('/dashboard/admin')}
                        className={`
                          w-full flex items-center gap-3 px-4 py-3.5 rounded-td text-sm font-bold transition-all duration-200
                          ${currentPage === 'admin'
                            ? 'bg-tielo-orange text-white shadow-lg'
                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                          }
                        `}
                      >
                        <Shield className="h-4 w-4" />
                        <span className="flex-1 text-left">Admin</span>
                        {currentPage === 'admin' && <ChevronRight className="h-4 w-4 ml-auto" />}
                      </button>
                      <button
                        onClick={() => handleNavigation('/dashboard/mcc')}
                        className={`
                          w-full flex items-center gap-3 px-4 py-3.5 rounded-td text-sm font-bold transition-all duration-200
                          ${currentPage === 'mcc'
                            ? 'bg-tielo-orange text-white shadow-lg'
                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                          }
                        `}
                      >
                        <Target className="h-4 w-4" />
                        <span className="flex-1 text-left">Mission Control</span>
                        {currentPage === 'mcc' && <ChevronRight className="h-4 w-4 ml-auto" />}
                      </button>
                    </>
                  )}
                </>
              )}
            </nav>

            <div className="border-t border-white/10 p-4 relative">
              {userProfile && (
                <button
                  onClick={() => handleNavigation('/dashboard/profile')}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-td hover:bg-white/10 transition-colors mb-3"
                >
                  <div className="relative flex-shrink-0">
                    {userProfile.profile_picture_url ? (
                      <img
                        src={userProfile.profile_picture_url}
                        alt={userProfile.name || 'Profile'}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-tielo-orange/50"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-tielo-orange/20 flex items-center justify-center">
                        <User className="h-6 w-6 text-tielo-orange" />
                      </div>
                    )}
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-tielo-navy"></div>
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-bold text-white truncate">
                      {userProfile.name || 'User'}
                    </p>
                    <p className="text-xs text-white/60 truncate">
                      {userProfile.business_name || 'Bekijk profiel'}
                    </p>
                  </div>
                </button>
              )}
              <button
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-td font-bold bg-tielo-orange/10 text-tielo-orange border-2 border-tielo-orange/30 hover:bg-tielo-orange hover:text-white hover:border-tielo-orange transition-all"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                Uitloggen
              </button>
            </div>
          </div>
        </aside>

        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-tielo-navy/80 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <div className="flex-1 flex flex-col overflow-hidden bg-tielo-offwhite">
          <header className="h-16 md:h-20 bg-white border-b border-tielo-steel/20 flex items-center px-4 md:px-6 lg:px-8 shadow-sm flex-shrink-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden mr-3 p-2 hover:bg-tielo-orange/10 rounded-td transition-colors flex-shrink-0"
            >
              <Menu className="h-5 w-5 md:h-6 md:w-6 text-tielo-navy" />
            </button>
            <div className="flex-1 min-w-0">
              <div className="hidden sm:flex items-center gap-2 text-xs md:text-sm text-tielo-navy/60 mb-1">
                <button
                  onClick={() => handleNavigation('/dashboard')}
                  className="hover:text-tielo-orange transition-colors font-medium"
                >
                  Dashboard
                </button>
                <ChevronRight className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                <span className="text-tielo-navy font-bold capitalize truncate">
                  {currentPage === 'home' ? 'Home' : currentPage === 'tasks' ? 'Taken' : currentPage === 'admin' ? 'Admin' : currentPage === 'mcc' ? 'Mission Control' : currentPage === 'mobile_photos' ? "Foto's Mobiel" : navigation.find(n => n.module_key === currentPage)?.display_name || currentPage}
                </span>
              </div>
              <h2 className="text-lg md:text-2xl font-bold font-rubik text-tielo-navy truncate">
                {currentPage === 'home' ? 'Home' : currentPage === 'tasks' ? 'Taken' : currentPage === 'admin' ? 'Admin' : currentPage === 'mcc' ? 'Mission Control' : currentPage === 'mobile_photos' ? "Foto's Mobiel" : navigation.find(n => n.module_key === currentPage)?.display_name || currentPage}
              </h2>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto bg-tielo-offwhite">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
