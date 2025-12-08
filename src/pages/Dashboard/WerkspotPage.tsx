import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, Edit } from 'lucide-react';
import { ProtectedRoute } from '../../components/Dashboard/ProtectedRoute';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
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

  const handleBackToDashboard = () => {
    window.history.pushState({}, '', '/dashboard');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 font-sans antialiased">
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={handleBackToDashboard}
              className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2 transition-colors"
            >
              ← Terug naar Dashboard
            </button>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Werkspot Gegevens</h1>
              <p className="text-gray-600">Beheer je Werkspot statistieken</p>
            </div>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-4 bg-amber-50 rounded-2xl">
                      <Star className="h-8 w-8 text-amber-500" fill="currentColor" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Gemiddelde Sterren</p>
                      <p className="text-5xl font-bold text-gray-900">
                        {editing && formData.avgstars
                          ? parseFloat(formData.avgstars).toFixed(1)
                          : data?.avgstars?.toFixed(1) || '0.0'}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm">van de 5.0</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-4 bg-blue-50 rounded-2xl">
                      <TrendingUp className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Aantal Reviews</p>
                      <p className="text-5xl font-bold text-gray-900">
                        {editing && formData.reviewamount
                          ? formData.reviewamount
                          : data?.reviewamount || 0}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm">totaal ontvangen</p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
              >
                {editing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="avgstars" className="text-gray-700">
                          Gemiddelde Sterren (0-5)
                        </Label>
                        <Input
                          id="avgstars"
                          type="text"
                          inputMode="decimal"
                          placeholder="Bijv. 4.5"
                          value={formData.avgstars}
                          onChange={(e) =>
                            setFormData({ ...formData, avgstars: e.target.value })
                          }
                          required
                          className="bg-white border-gray-300 text-gray-900"
                        />
                      </div>

                      <div>
                        <Label htmlFor="reviewamount" className="text-gray-700">
                          Aantal Reviews
                        </Label>
                        <Input
                          id="reviewamount"
                          type="text"
                          inputMode="numeric"
                          placeholder="Bijv. 25"
                          value={formData.reviewamount}
                          onChange={(e) =>
                            setFormData({ ...formData, reviewamount: e.target.value.replace(/\D/g, '') })
                          }
                          required
                          className="bg-white border-gray-300 text-gray-900"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        type="submit"
                        disabled={saving}
                        className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0"
                      >
                        {saving ? 'Opslaan...' : 'Opslaan'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditing(false);
                          if (data) {
                            setFormData({
                              reviewamount: String(data.reviewamount || ''),
                              avgstars: String(data.avgstars || ''),
                            });
                          }
                        }}
                        className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Annuleren
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600">
                      Klik op bewerken om je Werkspot gegevens bij te werken
                    </p>
                    <Button
                      onClick={() => setEditing(true)}
                      className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Bewerken
                    </Button>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function WerkspotPage() {
  return (
    <ProtectedRoute>
      <WerkspotContent />
    </ProtectedRoute>
  );
}
