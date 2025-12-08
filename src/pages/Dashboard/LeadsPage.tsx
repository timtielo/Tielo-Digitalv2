import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Mail, Phone, Calendar, TrendingUp, ExternalLink, MapPin, ChevronDown, ChevronUp, Search, Archive, ArchiveRestore } from 'lucide-react';
import { ProtectedRoute } from '../../components/Dashboard/ProtectedRoute';
import { DashboardLayout } from '../../components/Dashboard/DashboardLayout';
import { Card } from '../../components/ui/Card';
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
  archived: boolean;
}

function LeadsContent() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<'date' | 'name'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [expandedLeads, setExpandedLeads] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);

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

  const toggleArchive = async (leadId: string, currentArchived: boolean) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ archived: !currentArchived })
        .eq('id', leadId);

      if (error) throw error;
      await fetchLeads();
    } catch (error) {
      console.error('Error toggling archive:', error);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.place?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.postcode?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesArchived = showArchived ? lead.archived : !lead.archived;

    return matchesSearch && matchesArchived;
  });

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
      borderColor: 'border-green-500',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      icon: Mail,
      label: 'Met Email',
      value: leads.filter(l => l.email).length,
      borderColor: 'border-blue-500',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      icon: Phone,
      label: 'Met Telefoon',
      value: leads.filter(l => l.phone).length,
      borderColor: 'border-amber-500',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
  ];

  return (
    <DashboardLayout currentPage="leads">
      <div className="space-y-8">
        <div className="grid md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`p-6 border-l-4 ${stat.borderColor}`}>
                <div className="flex items-center gap-4">
                  <div className={`p-3 ${stat.iconBg} rounded-xl`}>
                    <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Zoek op naam, email, telefoon, plaats of postcode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
            />
          </div>
          <button
            onClick={() => setShowArchived(!showArchived)}
            className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
              showArchived
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {showArchived ? <ArchiveRestore className="h-5 w-5" /> : <Archive className="h-5 w-5" />}
            {showArchived ? 'Toon Actieve' : 'Toon Gearchiveerde'}
          </button>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredLeads.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <Card className="p-12 max-w-md mx-auto">
              <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Nog geen leads ontvangen</h3>
              <p className="text-gray-600">Nieuwe leads verschijnen hier automatisch</p>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-end gap-2">
              <button
                onClick={() => handleSort('name')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl text-gray-700 transition-all font-medium"
              >
                Sorteer op naam
                {sortField === 'name' && (
                  <span className="text-blue-600">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
              <button
                onClick={() => handleSort('date')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl text-gray-700 transition-all font-medium"
              >
                Sorteer op datum
                {sortField === 'date' && (
                  <span className="text-blue-600">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
            </div>

            {filteredLeads.map((lead, index) => {
              const isExpanded = expandedLeads.has(lead.id);
              return (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-all">
                    <div
                      className="p-6 cursor-pointer"
                      onClick={() => toggleExpanded(lead.id)}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{lead.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
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
                        <button className="text-gray-400 hover:text-gray-900 transition-colors">
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
                              className="text-blue-600 hover:text-blue-700 flex items-center gap-2 transition-colors font-medium"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Phone className="h-5 w-5" />
                              <span>{lead.phone}</span>
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
                              className="text-blue-600 hover:text-blue-700 flex items-center gap-2 transition-colors font-medium"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Mail className="h-5 w-5" />
                              <span>{lead.email}</span>
                            </a>
                          ) : (
                            <div className="flex items-center gap-2 text-gray-500">
                              <Mail className="h-5 w-5" />
                              <span>Geen email</span>
                            </div>
                          )}
                        </div>

                        {lead.place && (
                          <div className="flex items-center gap-3">
                            <MapPin className="h-5 w-5 text-gray-600" />
                            <span className="text-gray-900 font-medium">
                              {lead.place}
                            </span>
                          </div>
                        )}

                        {lead.drive_url && (
                          <div className="flex items-center gap-3">
                            <a
                              href={lead.drive_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 flex items-center gap-2 transition-colors font-medium"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="h-5 w-5" />
                              <span>Open Drive</span>
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
                            <div className="pt-4 border-t border-gray-200">
                              <h4 className="text-sm font-semibold text-gray-600 mb-2">Bericht:</h4>
                              <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                                {lead.message}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="px-6 pb-6">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleArchive(lead.id, lead.archived);
                        }}
                        className="w-full px-4 py-2 rounded-xl bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-all flex items-center justify-center gap-2 font-medium"
                      >
                        {lead.archived ? (
                          <>
                            <ArchiveRestore className="h-5 w-5" />
                            Herstellen
                          </>
                        ) : (
                          <>
                            <Archive className="h-5 w-5" />
                            Archiveren
                          </>
                        )}
                      </button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-4 bg-blue-50 border-blue-200">
            <p className="text-sm text-blue-900">
              <strong>Let op:</strong> Leads zijn alleen-lezen. Je kunt ze bekijken en sorteren,
              maar niet bewerken of verwijderen. Neem rechtstreeks contact op met je leads via
              de opgegeven contactgegevens.
            </p>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

export function LeadsPage() {
  return (
    <ProtectedRoute>
      <LeadsContent />
    </ProtectedRoute>
  );
}
