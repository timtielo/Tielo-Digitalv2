import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Upload, Check, Briefcase, Tag, Image as ImageIcon } from 'lucide-react';
import { ProtectedRoute } from '../../components/Dashboard/ProtectedRoute';
import { AuroraBackground } from '../../components/ui/aurora-bento-grid';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Label } from '../../components/ui/Label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '../../components/ui/Dialog';
import { supabase } from '../../lib/supabase/client';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  location: string;
  date: string;
  description: string;
  before_image: string | null;
  after_image: string | null;
  featured: boolean;
}

interface Category {
  id: string;
  name: string;
}

function PortfolioContent() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<{ before?: string; after?: string }>({});
  const [imageDimensions, setImageDimensions] = useState<{ before?: { width: number; height: number }; after?: { width: number; height: number } }>({});
  const [newCategoryName, setNewCategoryName] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    before_image: '',
    after_image: '',
    featured: false,
  });

  useEffect(() => {
    if (user) {
      fetchItems();
      fetchCategories();
      subscribeToChanges();
    }
  }, [user]);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_categories')
        .select('*')
        .eq('user_id', user?.id)
        .order('name', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const subscribeToChanges = () => {
    const channel = supabase
      .channel('portfolio_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'portfolio_items',
          filter: `user_id=eq.${user?.id}`,
        },
        () => {
          fetchItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleImageSelect = (file: File, type: 'before' | 'after') => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImageDimensions(prev => ({
          ...prev,
          [type]: { width: img.width, height: img.height }
        }));
      };
      img.src = e.target?.result as string;
      setImagePreview(prev => ({ ...prev, [type]: e.target?.result as string }));
    };
    reader.readAsDataURL(file);
    uploadImage(file, type);
  };

  const uploadImage = async (file: File, type: 'before' | 'after') => {
    if (!user) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${type}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(fileName);

      setFormData(prev => ({
        ...prev,
        [`${type}_image`]: publicUrl,
      }));
      showToast('Afbeelding succesvol geüpload', 'success');
    } catch (error) {
      console.error('Error uploading image:', error);
      showToast('Fout bij uploaden van afbeelding', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      if (editingItem) {
        const { error } = await supabase
          .from('portfolio_items')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingItem.id)
          .eq('user_id', user.id);

        if (error) throw error;
        showToast('Project succesvol bijgewerkt', 'success');
      } else {
        const { error } = await supabase
          .from('portfolio_items')
          .insert([{
            ...formData,
            user_id: user.id,
          }]);

        if (error) throw error;
        showToast('Project succesvol toegevoegd', 'success');
      }

      setDialogOpen(false);
      resetForm();
      await fetchItems();
    } catch (error) {
      console.error('Error saving portfolio item:', error);
      showToast('Fout bij opslaan', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      location: item.location,
      date: item.date,
      description: item.description || '',
      before_image: item.before_image || '',
      after_image: item.after_image || '',
      featured: item.featured,
    });
    setImagePreview({
      before: item.before_image || undefined,
      after: item.after_image || undefined,
    });
    setImageDimensions({});
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Weet je zeker dat je dit item wilt verwijderen?')) return;
    if (!user) return;

    try {
      const { error } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      showToast('Project succesvol verwijderd', 'success');
      await fetchItems();
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
      showToast('Fout bij verwijderen', 'error');
    }
  };

  const addCategory = async () => {
    if (!newCategoryName.trim()) {
      showToast('Voer een categorienaam in', 'error');
      return;
    }

    try {
      const { error } = await supabase
        .from('portfolio_categories')
        .insert([{ user_id: user?.id, name: newCategoryName.trim() }]);

      if (error) throw error;

      showToast('Categorie toegevoegd', 'success');
      setNewCategoryName('');
      await fetchCategories();
    } catch (error: any) {
      console.error('Error adding category:', error);
      if (error.code === '23505') {
        showToast('Deze categorie bestaat al', 'error');
      } else {
        showToast('Fout bij toevoegen categorie', 'error');
      }
    }
  };

  const deleteCategory = async (id: string, name: string) => {
    if (!confirm(`Weet je zeker dat je de categorie "${name}" wilt verwijderen?`)) return;

    try {
      const { error } = await supabase
        .from('portfolio_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      showToast('Categorie verwijderd', 'success');
      await fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      showToast('Fout bij verwijderen categorie', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: categories.length > 0 ? categories[0].name : '',
      location: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      before_image: '',
      after_image: '',
      featured: false,
    });
    setImagePreview({});
    setImageDimensions({});
    setEditingItem(null);
  };

  const openNewDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleBackToDashboard = () => {
    window.history.pushState({}, '', '/dashboard');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

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
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Portfolio</h1>
                <p className="text-gray-300">Beheer je projecten en referenties</p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCategoryDialogOpen(true)}
                  className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                >
                  <Tag className="h-4 w-4 mr-2" />
                  Categorieën
                </Button>
                <Button
                  onClick={openNewDialog}
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 border-0"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nieuw Project
                </Button>
              </div>
            </div>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto border border-white/10">
                <Briefcase className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-2xl font-bold text-white mb-2">Nog geen portfolio items</h3>
                <p className="text-gray-400 mb-6">Begin met het toevoegen van je eerste project</p>
                <Button
                  onClick={openNewDialog}
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 border-0"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Voeg je eerste project toe
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative bg-gradient-to-br from-blue-500/20 to-cyan-400/20 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300"
                  >
                    <div className="aspect-video relative overflow-hidden bg-gray-900/50">
                      {item.after_image || item.before_image ? (
                        <img
                          src={item.after_image || item.before_image || ''}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-gray-600" />
                        </div>
                      )}
                      {item.featured && (
                        <div className="absolute top-3 right-3 bg-yellow-500/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                          <Check className="h-3 w-3 text-white" />
                          <span className="text-xs font-semibold text-white">Featured</span>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-white mb-1 truncate">{item.title}</h3>
                          <p className="text-sm text-gray-400">{item.category}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-gray-300">{item.location}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(item.date).toLocaleDateString('nl-NL', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item)}
                          className="flex-1 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Bewerken
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-500/20 backdrop-blur-sm border-red-500/30 text-red-400 hover:bg-red-500/30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Project Bewerken' : 'Nieuw Project'}
            </DialogTitle>
            <DialogClose onClose={() => setDialogOpen(false)} />
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="title">Titel *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Categorie *</Label>
              <Select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                {categories.length === 0 ? (
                  <option value="">Geen categorieën - Voeg eerst categorieën toe</option>
                ) : (
                  categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))
                )}
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Locatie *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
            </div>

            <div>
              <Label htmlFor="description">Beschrijving</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Voor Foto</Label>
                {imagePreview.before || formData.before_image ? (
                  <div className="mt-2">
                    <img
                      src={imagePreview.before || formData.before_image}
                      alt="Voor"
                      className="w-full h-48 object-contain bg-gray-50 rounded mb-2 border border-gray-200"
                    />
                    {imageDimensions.before && (
                      <p className="text-xs text-gray-600 mb-2">
                        Afmetingen: {imageDimensions.before.width} × {imageDimensions.before.height}px
                      </p>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFormData({ ...formData, before_image: '' });
                        setImagePreview(prev => ({ ...prev, before: undefined }));
                        setImageDimensions(prev => ({ ...prev, before: undefined }));
                      }}
                    >
                      Verwijderen
                    </Button>
                  </div>
                ) : (
                  <label className="mt-2 flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Upload foto</span>
                    <span className="text-xs text-gray-400 mt-1">Aanbevolen: 1200×800px</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageSelect(file, 'before');
                        e.target.value = '';
                      }}
                      disabled={uploading}
                    />
                  </label>
                )}
              </div>

              <div>
                <Label>Na Foto</Label>
                {imagePreview.after || formData.after_image ? (
                  <div className="mt-2">
                    <img
                      src={imagePreview.after || formData.after_image}
                      alt="Na"
                      className="w-full h-48 object-contain bg-gray-50 rounded mb-2 border border-gray-200"
                    />
                    {imageDimensions.after && (
                      <p className="text-xs text-gray-600 mb-2">
                        Afmetingen: {imageDimensions.after.width} × {imageDimensions.after.height}px
                      </p>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFormData({ ...formData, after_image: '' });
                        setImagePreview(prev => ({ ...prev, after: undefined }));
                        setImageDimensions(prev => ({ ...prev, after: undefined }));
                      }}
                    >
                      Verwijderen
                    </Button>
                  </div>
                ) : (
                  <label className="mt-2 flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Upload foto</span>
                    <span className="text-xs text-gray-400 mt-1">Aanbevolen: 1200×800px</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageSelect(file, 'after');
                        e.target.value = '';
                      }}
                      disabled={uploading}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 text-primary rounded focus:ring-primary"
              />
              <Label htmlFor="featured">Featured (uitgelicht op homepage)</Label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={uploading || saving}>
                {saving ? 'Opslaan...' : uploading ? 'Uploaden...' : editingItem ? 'Bijwerken' : 'Toevoegen'}
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

      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Categorieën Beheren</DialogTitle>
            <DialogClose onClose={() => setCategoryDialogOpen(false)} />
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="flex gap-2">
              <Input
                placeholder="Nieuwe categorie..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCategory();
                  }
                }}
              />
              <Button onClick={addCategory} disabled={!newCategoryName.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Toevoegen
              </Button>
            </div>

            <div className="border rounded-lg divide-y max-h-96 overflow-y-auto">
              {categories.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <Tag className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">Nog geen categorieën</p>
                  <p className="text-xs text-gray-400 mt-1">Voeg je eerste categorie toe</p>
                </div>
              ) : (
                categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-3 hover:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteCategory(category.id, category.name)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-4">
              <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>
                Sluiten
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function PortfolioPage() {
  return (
    <ProtectedRoute>
      <PortfolioContent />
    </ProtectedRoute>
  );
}
