import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Mail, Phone, Calendar, TrendingUp, ExternalLink, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
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
  drive_url: string | null;
  postcode: string | null;
  place: string | null;
}

function LeadsContent() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<'date' | 'name'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [expandedLeads, setExpandedLeads] = useState<Set<string>>(new Set());

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

  const toggleExpanded = (leadId: string) => {
    setExpandedLeads(prev => {
      const newSet = new Set(prev);
      if (newSet.has(leadId)) {
        newSet.delete(leadId);
      } else {
        newSet.add(leadId);
      }
      return newSet;
    });
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
            <div className="space-y-4">
              <div className="flex justify-end gap-2 mb-4">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all"
                >
                  Sorteer op naam
                  {sortField === 'name' && (
                    <span className="text-blue-400">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => handleSort('date')}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all"
                >
                  Sorteer op datum
                  {sortField === 'date' && (
                    <span className="text-blue-400">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              </div>

              {leads.map((lead, index) => {
                const isExpanded = expandedLeads.has(lead.id);
                return (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all"
                  >
                    <div
                      className="p-6 cursor-pointer"
                      onClick={() => toggleExpanded(lead.id)}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white mb-2">{lead.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Calendar className="h-4 w-4" />
                            {new Date(lead.date).toLocaleDateString('nl-NL', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-white transition-colors">
                          {isExpanded ? (
                            <ChevronUp className="h-6 w-6" />
                          ) : (
                            <ChevronDown className="h-6 w-6" />
                          )}
                        </button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          {lead.phone ? (
                            <a
                              href={`tel:${lead.phone}`}
                              className="text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Phone className="h-5 w-5" />
                              <span className="font-medium">{lead.phone}</span>
                            </a>
                          ) : (
                            <div className="flex items-center gap-2 text-gray-500">
                              <Phone className="h-5 w-5" />
                              <span>Geen telefoon</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          {lead.email ? (
                            <a
                              href={`mailto:${lead.email}`}
                              className="text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Mail className="h-5 w-5" />
                              <span className="font-medium">{lead.email}</span>
                            </a>
                          ) : (
                            <div className="flex items-center gap-2 text-gray-500">
                              <Mail className="h-5 w-5" />
                              <span>Geen email</span>
                            </div>
                          )}
                        </div>

                        {(lead.postcode || lead.place) && (
                          <div className="flex items-center gap-3">
                            <MapPin className="h-5 w-5 text-gray-400" />
                            <span className="text-gray-300 font-medium">
                              {lead.postcode && lead.place
                                ? `${lead.postcode}, ${lead.place}`
                                : lead.postcode || lead.place}
                            </span>
                          </div>
                        )}

                        {lead.drive_url && (
                          <div className="flex items-center gap-3">
                            <a
                              href={lead.drive_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="h-5 w-5" />
                              <span className="font-medium">Open Drive</span>
                            </a>
                          </div>
                        )}
                      </div>

                      <AnimatePresence>
                        {isExpanded && lead.message && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-4 border-t border-white/10">
                              <h4 className="text-sm font-semibold text-gray-400 mb-2">Bericht:</h4>
                              <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                                {lead.message}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </div>
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
