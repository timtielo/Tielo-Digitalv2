import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, MessageSquare, Star } from 'lucide-react';
import { ProtectedRoute } from '../../components/Dashboard/ProtectedRoute';
import { DashboardLayout } from '../../components/Dashboard/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Label } from '../../components/ui/Label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '../../components/ui/Dialog';
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-6 text-white shadow-xl"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Reviews</h1>
              <p className="text-blue-100">Beheer klantbeoordelingen</p>
            </div>
            <Button
              onClick={openNewDialog}
              className="bg-white text-blue-700 hover:bg-white/95 border-2 border-white font-semibold shadow-lg"
            >
                <Plus className="h-4 w-4 mr-2" />
                Nieuwe Review
              </Button>
            </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : reviews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <Card className="p-12 max-w-md mx-auto">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Nog geen reviews</h3>
              <p className="text-gray-600 mb-6">Begin met het toevoegen van je eerste review</p>
              <Button
                onClick={openNewDialog}
                className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 border-0"
              >
                <Plus className="h-5 w-5 mr-2" />
                Voeg je eerste review toe
              </Button>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center flex-shrink-0">
                            <Star className="h-6 w-6 text-white" fill="white" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-lg font-bold text-gray-900 truncate">{review.name}</h3>
                            <p className="text-xs text-gray-600">
                              {new Date(review.date).toLocaleDateString('nl-NL', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4 min-h-[100px]">
                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-4">
                          "{review.review}"
                        </p>
                      </div>

                      <div className="flex gap-2 pt-4 border-t border-gray-200">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(review)}
                          className="flex-1 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Bewerken
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(review.id)}
                          className="bg-red-50 border-red-300 text-red-700 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingReview ? 'Review Bewerken' : 'Nieuwe Review'}
            </DialogTitle>
            <DialogClose onClose={() => setDialogOpen(false)} />
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="name">Naam *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="review">Review *</Label>
              <Textarea
                id="review"
                value={formData.review}
                onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="date">Datum *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={saving}>
                {saving ? 'Opslaan...' : editingReview ? 'Bijwerken' : 'Toevoegen'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Annuleren
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
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
