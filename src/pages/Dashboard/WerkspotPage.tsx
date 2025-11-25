import React, { useState, useEffect } from 'react';
import { Star, TrendingUp } from 'lucide-react';
import { DashboardLayout } from '../../components/Dashboard/DashboardLayout';
import { ProtectedRoute } from '../../components/Dashboard/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
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

export function WerkspotPage() {
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
    } catch (error) {
      console.error('Error saving werkspot data:', error);
      showToast('Fout bij opslaan', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout currentPage="werkspot">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Werkspot Gegevens</h1>
            <p className="text-gray-600 mt-1">Beheer je Werkspot statistieken</p>
          </div>

          {loading ? (
            <Card>
              <CardContent className="p-8">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Gemiddelde Sterren
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {editing ? (
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder="Bijv. 4.5"
                      value={formData.avgstars}
                      onChange={(e) =>
                        setFormData({ ...formData, avgstars: e.target.value })
                      }
                    />
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-gray-900">
                        {data?.avgstars?.toFixed(1) || '0.0'}
                      </span>
                      <span className="text-gray-500">/ 5.0</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Aantal Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {editing ? (
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="Bijv. 25"
                      value={formData.reviewamount}
                      onChange={(e) =>
                        setFormData({ ...formData, reviewamount: e.target.value.replace(/\D/g, '') })
                      }
                    />
                  ) : (
                    <div className="text-4xl font-bold text-gray-900">
                      {data?.reviewamount || 0}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {!loading && (
            <Card>
              <CardContent className="p-6">
                {editing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="avgstars">Gemiddelde Sterren (0-5)</Label>
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
                        />
                      </div>

                      <div>
                        <Label htmlFor="reviewamount">Aantal Reviews</Label>
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
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" disabled={saving}>
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
                    <Button onClick={() => setEditing(true)}>Bewerken</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
