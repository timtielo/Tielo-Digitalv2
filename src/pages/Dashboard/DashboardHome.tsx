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
} from 'lucide-react';
import {
  AuroraBackground,
  BentoGrid,
  BentoGridItem,
} from '../../components/ui/aurora-bento-grid';
import { supabase } from '../../lib/supabase/client';
import { useAuth } from '../../contexts/AuthContext';
import { ProtectedRoute } from '../../components/Dashboard/ProtectedRoute';

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

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('name, business_name, is_admin')
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

      <div className="relative z-10 container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1
            className="
              text-4xl md:text-6xl font-extrabold tracking-tight
              bg-gradient-to-r from-blue-400 via-green-400 to-orange-500
              bg-clip-text text-transparent
            "
          >
            Welkom terug{userProfile?.name ? `, ${userProfile.name}` : ''}
          </h1>
          {userProfile?.business_name && (
            <p className="mt-4 text-xl text-gray-300">
              {userProfile.business_name}
            </p>
          )}
          <p className="mt-2 text-lg text-gray-400">
            Kies een module om te beginnen
          </p>
        </motion.div>

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
                <div className="mb-4">
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <div className="flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {module.display_name}
                  </h3>
                  <p className="text-gray-200 text-sm flex-grow">
                    {module.description}
                  </p>
                </div>
                <div className="mt-4">
                  <span
                    className="
                      text-white font-semibold text-sm inline-flex items-center
                      group/link
                    "
                  >
                    Openen
                    <ArrowRight className="ml-1 w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                  </span>
                </div>
              </BentoGridItem>
            );
          })}
        </BentoGrid>
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
