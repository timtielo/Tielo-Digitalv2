import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, Edit, Loader2, Save, X } from 'lucide-react';
import { ProtectedRoute } from '../../components/Dashboard/ProtectedRoute';
import { DashboardLayout } from '../../components/Dashboard/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { supabase } from '../../lib/supabase/client';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';

interface WerkspotData {
  id: string;
  reviewamount: number;
  avgstars: number;
}

function WerkspotContent() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [data, setData] = useState<WerkspotData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    reviewamount: '',
    avgstars: '',
  });

  useEffect(() => {
    if (user) {
      fetchData();
      subscribeToChanges();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const { data: werkspotData, error } = await supabase
        .from('werkspot_data')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (werkspotData) {
        setData(werkspotData);
        setFormData({
          reviewamount: String(werkspotData.reviewamount || ''),
          avgstars: String(werkspotData.avgstars || ''),
        });
      }
    } catch (error) {
      console.error('Error fetching werkspot data:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToChanges = () => {
    const channel = supabase
      .channel('werkspot_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'werkspot_data',
          filter: `user_id=eq.${user?.id}`,
        },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const reviewAmount = parseInt(formData.reviewamount) || 0;
      const avgStars = parseFloat(formData.avgstars) || 0;

      if (data) {
        const { error } = await supabase
          .from('werkspot_data')
          .update({
            reviewamount: reviewAmount,
            avgstars: avgStars,
          })
          .eq('id', data.id)
          .eq('user_id', user.id);

        if (error) throw error;
        showToast('Werkspot gegevens bijgewerkt', 'success');
      } else {
        const { error } = await supabase
          .from('werkspot_data')
          .insert([{
            user_id: user.id,
            reviewamount: reviewAmount,
            avgstars: avgStars,
          }]);

        if (error) throw error;
        showToast('Werkspot gegevens toegevoegd', 'success');
      }

      setEditing(false);
      await fetchData();
    } catch (error) {
      console.error('Error saving werkspot data:', error);
      showToast('Fout bij opslaan', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-tielo-navy rounded-td p-6 text-white shadow-xl relative overflow-hidden"
      >
        <div className="absolute inset-0 td-striped opacity-10" />
        <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold font-rubik mb-1">Werkspot</h1>
            <p className="text-white/70">Beheer je Werkspot statistieken</p>
          </div>
          {!editing && !loading && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-5 py-3 bg-tielo-orange hover:bg-tielo-orange/90 text-white font-bold rounded-td shadow-lg transition-all flex-shrink-0"
            >
              <Edit className="w-4 h-4" />
              Bewerken
            </button>
          )}
        </div>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-tielo-orange" />
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="td-card p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-tielo-orange/10 rounded-td flex-shrink-0">
                    <Star className="w-7 h-7 text-tielo-orange" fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-tielo-navy/50 uppercase tracking-wide mb-0.5">Gemiddelde Sterren</p>
                    <p className="text-4xl font-bold font-rubik text-tielo-navy tabular-nums">
                      {editing && formData.avgstars
                        ? parseFloat(formData.avgstars || '0').toFixed(1)
                        : data?.avgstars?.toFixed(1) || '0.0'}
                    </p>
                    <p className="text-xs text-tielo-navy/40 mt-0.5">van de 5.0</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="td-card p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-tielo-navy/10 rounded-td flex-shrink-0">
                    <TrendingUp className="w-7 h-7 text-tielo-navy" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-tielo-navy/50 uppercase tracking-wide mb-0.5">Aantal Reviews</p>
                    <p className="text-4xl font-bold font-rubik text-tielo-navy tabular-nums">
                      {editing && formData.reviewamount
                        ? formData.reviewamount
                        : data?.reviewamount || 0}
                    </p>
                    <p className="text-xs text-tielo-navy/40 mt-0.5">totaal ontvangen</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {editing && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card className="td-card p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="text-base font-bold font-rubik text-tielo-navy">Gegevens bijwerken</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-tielo-navy/60 uppercase tracking-wide block mb-1.5">
                        Gemiddelde Sterren (0-5) *
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        placeholder="Bijv. 4.5"
                        value={formData.avgstars}
                        onChange={e => setFormData({ ...formData, avgstars: e.target.value })}
                        required
                        className="w-full px-3 py-2.5 text-sm border border-tielo-steel/30 rounded-td bg-tielo-offwhite focus:outline-none focus:border-tielo-orange transition-colors text-tielo-navy placeholder-tielo-navy/30"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-tielo-navy/60 uppercase tracking-wide block mb-1.5">
                        Aantal Reviews *
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Bijv. 25"
                        value={formData.reviewamount}
                        onChange={e => setFormData({ ...formData, reviewamount: e.target.value.replace(/\D/g, '') })}
                        required
                        className="w-full px-3 py-2.5 text-sm border border-tielo-steel/30 rounded-td bg-tielo-offwhite focus:outline-none focus:border-tielo-orange transition-colors text-tielo-navy placeholder-tielo-navy/30"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        if (data) {
                          setFormData({
                            reviewamount: String(data.reviewamount || ''),
                            avgstars: String(data.avgstars || ''),
                          });
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 border border-tielo-steel/20 hover:bg-tielo-offwhite text-tielo-navy/70 font-bold text-sm rounded-td transition-all"
                    >
                      <X className="w-4 h-4" />
                      Annuleren
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center gap-2 px-5 py-2.5 bg-tielo-orange hover:bg-tielo-orange/90 disabled:opacity-50 text-white font-bold text-sm rounded-td transition-all shadow-md"
                    >
                      {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Opslaan...</> : <><Save className="w-4 h-4" />Opslaan</>}
                    </button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}

          {!editing && !data && (
            <Card className="td-card p-8 text-center">
              <p className="text-tielo-navy/50 text-sm mb-4">Nog geen Werkspot gegevens ingesteld</p>
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-tielo-orange hover:bg-tielo-orange/90 text-white font-bold rounded-td transition-all text-sm"
              >
                <Edit className="w-4 h-4" />
                Gegevens Instellen
              </button>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

function WerkspotPageInner() {
  return (
    <DashboardLayout currentPage="werkspot">
      <WerkspotContent />
    </DashboardLayout>
  );
}

export function WerkspotPage() {
  return (
    <ProtectedRoute>
      <WerkspotPageInner />
    </ProtectedRoute>
  );
}
