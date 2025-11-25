import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, Phone, Calendar, TrendingUp } from 'lucide-react';
import { ProtectedRoute } from '../../components/Dashboard/ProtectedRoute';
import { AuroraBackground } from '../../components/ui/aurora-bento-grid';
import { supabase } from '../../lib/supabase/client';
import { useAuth } from '../../contexts/AuthContext';

interface Lead {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  message: string | null;
  date: string;
}

function LeadsContent() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<'date' | 'name'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    if (user) {
      fetchLeads();
      subscribeToChanges();
    }
  }, [user, sortField, sortDirection]);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user?.id)
        .order(sortField, { ascending: sortDirection === 'asc' });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToChanges = () => {
    const channel = supabase
      .channel('leads_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leads',
          filter: `user_id=eq.${user?.id}`,
        },
        () => {
          fetchLeads();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleSort = (field: 'date' | 'name') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleBackToDashboard = () => {
    window.history.pushState({}, '', '/dashboard');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const stats = [
    {
      icon: Users,
      label: 'Totaal Leads',
      value: leads.length,
      gradient: 'from-green-500 to-lime-400',
      iconColor: 'text-green-400',
    },
    {
      icon: Mail,
      label: 'Met Email',
      value: leads.filter(l => l.email).length,
      gradient: 'from-blue-500 to-cyan-400',
      iconColor: 'text-blue-400',
    },
    {
      icon: Phone,
      label: 'Met Telefoon',
      value: leads.filter(l => l.phone).length,
      gradient: 'from-amber-500 to-yellow-400',
      iconColor: 'text-amber-400',
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-950 font-sans antialiased relative">
      <AuroraBackground />

      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={handleBackToDashboard}
              className="text-blue-400 hover:text-blue-300 mb-4 flex items-center gap-2 transition-colors"
            >
              ← Terug naar Dashboard
            </button>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Leads</h1>
              <p className="text-gray-300">Bekijk inkomende aanvragen van potentiële klanten</p>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-br ${stat.gradient} bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                    <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">{stat.label}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : leads.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto border border-white/10">
                <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-2xl font-bold text-white mb-2">Nog geen leads ontvangen</h3>
                <p className="text-gray-400">Nieuwe leads verschijnen hier automatisch</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4">
                        <button
                          onClick={() => handleSort('name')}
                          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors font-medium"
                        >
                          Naam
                          {sortField === 'name' && (
                            <span className="text-blue-400">
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </button>
                      </th>
                      <th className="text-left p-4 text-gray-300 font-medium">Telefoon</th>
                      <th className="text-left p-4 text-gray-300 font-medium">Email</th>
                      <th className="text-left p-4 text-gray-300 font-medium">Bericht</th>
                      <th className="text-left p-4">
                        <button
                          onClick={() => handleSort('date')}
                          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors font-medium"
                        >
                          Datum
                          {sortField === 'date' && (
                            <span className="text-blue-400">
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead, index) => (
                      <motion.tr
                        key={lead.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="p-4">
                          <span className="font-medium text-white">{lead.name}</span>
                        </td>
                        <td className="p-4">
                          {lead.phone ? (
                            <a
                              href={`tel:${lead.phone}`}
                              className="text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-colors"
                            >
                              <Phone className="h-4 w-4" />
                              {lead.phone}
                            </a>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </td>
                        <td className="p-4">
                          {lead.email ? (
                            <a
                              href={`mailto:${lead.email}`}
                              className="text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-colors"
                            >
                              <Mail className="h-4 w-4" />
                              {lead.email}
                            </a>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </td>
                        <td className="p-4 max-w-md">
                          {lead.message ? (
                            <div className="text-gray-300 truncate" title={lead.message}>
                              {lead.message}
                            </div>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-gray-300">
                            <Calendar className="h-4 w-4" />
                            {new Date(lead.date).toLocaleDateString('nl-NL', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 bg-blue-500/10 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-4"
          >
            <p className="text-sm text-blue-300">
              <strong>Let op:</strong> Leads zijn alleen-lezen. Je kunt ze bekijken en sorteren,
              maar niet bewerken of verwijderen. Neem rechtstreeks contact op met je leads via
              de opgegeven contactgegevens.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export function LeadsPage() {
  return (
    <ProtectedRoute>
      <LeadsContent />
    </ProtectedRoute>
  );
}
