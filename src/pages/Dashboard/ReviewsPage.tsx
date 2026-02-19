import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, MessageSquare, Star, X, Loader2 } from 'lucide-react';
import { ProtectedRoute } from '../../components/Dashboard/ProtectedRoute';
import { DashboardLayout } from '../../components/Dashboard/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { supabase } from '../../lib/supabase/client';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';

interface Review {
  id: string;
  name: string;
  review: string;
  date: string;
}

function ReviewsContent() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    review: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (user) {
      fetchReviews();
      subscribeToChanges();
    }
  }, [user]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToChanges = () => {
    const channel = supabase
      .channel('reviews_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reviews',
          filter: `user_id=eq.${user?.id}`,
        },
        () => {
          fetchReviews();
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
      if (editingReview) {
        const { error } = await supabase
          .from('reviews')
          .update(formData)
          .eq('id', editingReview.id)
          .eq('user_id', user.id);

        if (error) throw error;
        showToast('Review succesvol bijgewerkt', 'success');
      } else {
        const { error } = await supabase
          .from('reviews')
          .insert([{
            ...formData,
            user_id: user.id,
          }]);

        if (error) throw error;
        showToast('Review succesvol toegevoegd', 'success');
      }

      setDialogOpen(false);
      resetForm();
      await fetchReviews();
    } catch (error) {
      console.error('Error saving review:', error);
      showToast('Fout bij opslaan', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setFormData({
      name: review.name,
      review: review.review,
      date: review.date,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Weet je zeker dat je deze review wilt verwijderen?')) return;
    if (!user) return;

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      showToast('Review succesvol verwijderd', 'success');
      await fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      showToast('Fout bij verwijderen', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      review: '',
      date: new Date().toISOString().split('T')[0],
    });
    setEditingReview(null);
  };

  const openNewDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  return (
    <DashboardLayout currentPage="reviews">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-tielo-navy rounded-td p-6 text-white shadow-xl relative overflow-hidden"
        >
          <div className="absolute inset-0 td-striped opacity-10" />
          <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold font-rubik mb-1">Reviews</h1>
              <p className="text-white/70">Beheer klantbeoordelingen</p>
            </div>
            <button
              onClick={openNewDialog}
              className="flex items-center gap-2 px-5 py-3 bg-tielo-orange hover:bg-tielo-orange/90 text-white font-bold rounded-td shadow-lg transition-all flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              Nieuwe Review
            </button>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-tielo-orange" />
          </div>
        ) : reviews.length === 0 ? (
          <Card className="td-card p-12 text-center max-w-md mx-auto">
            <div className="p-4 bg-tielo-orange/10 rounded-td w-fit mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-tielo-orange" />
            </div>
            <h3 className="text-xl font-bold font-rubik text-tielo-navy mb-2">Nog geen reviews</h3>
            <p className="text-sm text-tielo-navy/50 mb-6">Begin met het toevoegen van je eerste klantbeoordeling</p>
            <button
              onClick={openNewDialog}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-tielo-orange hover:bg-tielo-orange/90 text-white font-bold rounded-td transition-all"
            >
              <Plus className="w-4 h-4" />
              Eerste Review Toevoegen
            </button>
          </Card>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <AnimatePresence>
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="td-card overflow-hidden hover:border-tielo-orange/30 transition-all duration-200">
                    <div className="p-5">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 bg-tielo-orange rounded-td flex items-center justify-center flex-shrink-0">
                          <Star className="w-5 h-5 text-white" fill="white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-tielo-navy truncate">{review.name}</h3>
                          <p className="text-xs text-tielo-navy/40 mt-0.5">
                            {new Date(review.date).toLocaleDateString('nl-NL', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-tielo-navy/70 leading-relaxed line-clamp-4 min-h-[80px] mb-4">
                        "{review.review}"
                      </p>

                      <div className="flex gap-2 pt-4 border-t border-tielo-steel/15">
                        <button
                          onClick={() => handleEdit(review)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-tielo-steel/20 hover:border-tielo-orange/50 hover:bg-tielo-orange/5 text-tielo-navy/60 hover:text-tielo-orange rounded-td text-xs font-bold transition-all"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Bewerken
                        </button>
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="p-2 border border-red-200 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-td transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {dialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-tielo-navy/75 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-td shadow-2xl w-full max-w-md"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-tielo-steel/20">
                <h2 className="text-xl font-bold font-rubik text-tielo-navy">
                  {editingReview ? 'Review Bewerken' : 'Nieuwe Review'}
                </h2>
                <button onClick={() => setDialogOpen(false)} className="p-2 hover:bg-tielo-orange/10 rounded-td transition-colors">
                  <X className="w-5 h-5 text-tielo-navy" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-bold text-tielo-navy/60 uppercase tracking-wide block mb-1.5">Naam *</label>
                  <input
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Naam klant"
                    className="w-full px-3 py-2.5 text-sm border border-tielo-steel/30 rounded-td bg-tielo-offwhite focus:outline-none focus:border-tielo-orange transition-colors text-tielo-navy placeholder-tielo-navy/30"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-tielo-navy/60 uppercase tracking-wide block mb-1.5">Review *</label>
                  <textarea
                    value={formData.review}
                    onChange={e => setFormData({ ...formData, review: e.target.value })}
                    required
                    rows={4}
                    placeholder="Wat zei de klant?"
                    className="w-full px-3 py-2.5 text-sm border border-tielo-steel/30 rounded-td bg-tielo-offwhite focus:outline-none focus:border-tielo-orange transition-colors text-tielo-navy placeholder-tielo-navy/30 resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-tielo-navy/60 uppercase tracking-wide block mb-1.5">Datum *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="w-full px-3 py-2.5 text-sm border border-tielo-steel/30 rounded-td bg-tielo-offwhite focus:outline-none focus:border-tielo-orange transition-colors text-tielo-navy"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setDialogOpen(false)}
                    className="flex-1 px-4 py-2.5 border border-tielo-steel/20 hover:bg-tielo-offwhite text-tielo-navy/70 font-bold text-sm rounded-td transition-all"
                  >
                    Annuleren
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-tielo-orange hover:bg-tielo-orange/90 disabled:opacity-50 text-white font-bold text-sm rounded-td transition-all"
                  >
                    {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Opslaan...</> : editingReview ? 'Bijwerken' : 'Toevoegen'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}

export function ReviewsPage() {
  return (
    <ProtectedRoute>
      <ReviewsContent />
    </ProtectedRoute>
  );
}
