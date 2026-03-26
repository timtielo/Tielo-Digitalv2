import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone,
  Plus,
  Pencil,
  Trash2,
  Upload,
  X,
  Eye,
  EyeOff,
  GripVertical,
  Image,
} from 'lucide-react';
import { ProtectedRoute } from '../../components/Dashboard/ProtectedRoute';
import { DashboardLayout } from '../../components/Dashboard/DashboardLayout';
import { ImageEditor } from '../../components/Dashboard/ImageEditor';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '../../components/ui/Dialog';
import { supabase } from '../../lib/supabase/client';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';

interface HeroPhoneImage {
  id: string;
  user_id: string;
  image_url: string;
  alt_text: string;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ACCEPTED_EXTENSIONS = '.jpg,.jpeg,.png,.webp,.gif';

function MobilePhotosContent() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [photos, setPhotos] = useState<HeroPhoneImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageEditorOpen, setImageEditorOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<HeroPhoneImage | null>(null);
  const [deletingPhoto, setDeletingPhoto] = useState<HeroPhoneImage | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [editedBlob, setEditedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    alt_text: '',
    sort_order: 0,
    active: true,
  });

  useEffect(() => {
    if (user) fetchPhotos();
  }, [user]);

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_phone_images')
        .select('*')
        .eq('user_id', user?.id)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setPhotos(data || []);
    } catch {
      showToast('Fout bij laden van fotos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      showToast('Alleen JPG, PNG, WebP en GIF bestanden zijn toegestaan.', 'error');
      return;
    }
    if (!formData.alt_text) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      setFormData(prev => ({ ...prev, alt_text: nameWithoutExt }));
    }
    setPendingFile(file);
    setImageEditorOpen(true);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [formData.alt_text]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleImageEditorSave = (blob: Blob) => {
    setEditedBlob(blob);
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);
    setImageEditorOpen(false);
    setPendingFile(null);
  };

  const handleImageEditorCancel = () => {
    setImageEditorOpen(false);
    setPendingFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openCreateDialog = () => {
    setEditingPhoto(null);
    setEditedBlob(null);
    setPreviewUrl(null);
    setPendingFile(null);
    setUploadProgress(null);
    setFormData({
      alt_text: '',
      sort_order: photos.length,
      active: true,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (photo: HeroPhoneImage) => {
    setEditingPhoto(photo);
    setEditedBlob(null);
    setPendingFile(null);
    setUploadProgress(null);
    setPreviewUrl(photo.image_url);
    setFormData({
      alt_text: photo.alt_text,
      sort_order: photo.sort_order,
      active: photo.active,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingPhoto && !editedBlob) {
      showToast('Selecteer en bewerk een afbeelding om te uploaden.', 'error');
      return;
    }

    setSaving(true);
    setUploadProgress(null);

    try {
      let imageUrl = editingPhoto?.image_url || '';
      let storagePath = '';

      if (editedBlob) {
        const fileName = `${user?.id}/${Date.now()}.jpg`;

        setUploadProgress(10);

        const { error: uploadError } = await supabase.storage
          .from('hero-images')
          .upload(fileName, editedBlob, { upsert: false, contentType: 'image/jpeg' });

        if (uploadError) throw uploadError;

        setUploadProgress(80);

        const { data: urlData } = supabase.storage
          .from('hero-images')
          .getPublicUrl(fileName);

        imageUrl = urlData.publicUrl;
        storagePath = fileName;

        setUploadProgress(100);
      }

      if (editingPhoto) {
        const updatePayload: Record<string, unknown> = {
          alt_text: formData.alt_text,
          sort_order: formData.sort_order,
          active: formData.active,
          updated_at: new Date().toISOString(),
        };
        if (imageUrl && imageUrl !== editingPhoto.image_url) {
          updatePayload.image_url = imageUrl;
        }

        const { error } = await supabase
          .from('hero_phone_images')
          .update(updatePayload)
          .eq('id', editingPhoto.id);

        if (error) throw error;
        showToast('Foto bijgewerkt', 'success');
      } else {
        const { error } = await supabase
          .from('hero_phone_images')
          .insert({
            user_id: user?.id,
            image_url: imageUrl,
            alt_text: formData.alt_text || 'Hero phone image',
            sort_order: formData.sort_order,
            active: formData.active,
          });

        if (error) throw error;
        showToast('Foto toegevoegd', 'success');
      }

      setDialogOpen(false);
      fetchPhotos();
    } catch {
      showToast('Fout bij opslaan van foto', 'error');
    } finally {
      setSaving(false);
      setUploadProgress(null);
    }
  };

  const handleDelete = async () => {
    if (!deletingPhoto) return;
    setDeleting(true);
    try {
      const { error } = await supabase
        .from('hero_phone_images')
        .delete()
        .eq('id', deletingPhoto.id);

      if (error) throw error;
      showToast('Foto verwijderd', 'success');
      setDeleteDialogOpen(false);
      setDeletingPhoto(null);
      fetchPhotos();
    } catch {
      showToast('Fout bij verwijderen van foto', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const toggleActive = async (photo: HeroPhoneImage) => {
    try {
      const { error } = await supabase
        .from('hero_phone_images')
        .update({ active: !photo.active, updated_at: new Date().toISOString() })
        .eq('id', photo.id);

      if (error) throw error;
      setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, active: !p.active } : p));
    } catch {
      showToast('Fout bij bijwerken van foto', 'error');
    }
  };

  if (loading) {
    return (
      <DashboardLayout currentPage="mobile-photos">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPage="mobile-photos">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fotos Mobiel Websites</h1>
            <p className="text-gray-500 mt-1">Beheer de fotos die worden weergegeven in het telefoon-frame op je website. Fotos worden automatisch bijgesneden naar 937×1937px (9:16).</p>
          </div>
          <Button onClick={openCreateDialog} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Foto toevoegen
          </Button>
        </div>

        {photos.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Smartphone className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Geen fotos gevonden</h3>
                <p className="text-gray-500 mt-1">Voeg je eerste foto toe voor het mobiele telefoon-frame op je website.</p>
              </div>
              <Button onClick={openCreateDialog} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Eerste foto toevoegen
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {photos.map((photo) => (
                <motion.div
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="overflow-hidden group">
                    <div className="relative aspect-[9/16] bg-gray-100">
                      <img
                        src={photo.image_url}
                        alt={photo.alt_text || 'Mobiele foto'}
                        className="w-full h-full object-cover"
                      />
                      {!photo.active && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white text-sm font-medium bg-black/60 px-2 py-1 rounded">Verborgen</span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => toggleActive(photo)}
                          className="w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-50 transition-colors"
                          title={photo.active ? 'Verbergen' : 'Zichtbaar maken'}
                        >
                          {photo.active ? (
                            <Eye className="w-4 h-4 text-gray-600" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                        <button
                          onClick={() => openEditDialog(photo)}
                          className="w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-50 transition-colors"
                          title="Bewerken"
                        >
                          <Pencil className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => { setDeletingPhoto(photo); setDeleteDialogOpen(true); }}
                          className="w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-50 transition-colors"
                          title="Verwijderen"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical className="w-4 h-4 text-white drop-shadow" />
                        <span className="text-white text-xs drop-shadow font-medium">#{photo.sort_order + 1}</span>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {photo.alt_text || 'Naamloos'}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {photo.active ? 'Zichtbaar' : 'Verborgen'}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingPhoto ? 'Foto bewerken' : 'Foto toevoegen'}</DialogTitle>
            <DialogClose />
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div>
              <Label>Afbeelding (9:16 — 937×1937px)</Label>
              {previewUrl ? (
                <div className="mt-2 flex flex-col items-center gap-2">
                  <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50" style={{ width: '112px', height: '200px' }}>
                    <img
                      src={previewUrl}
                      alt="Voorvertoning"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setEditedBlob(null);
                      setPreviewUrl(editingPhoto?.image_url || null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                      if (fileInputRef.current) fileInputRef.current.click();
                    }}
                    className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> Andere afbeelding kiezen
                  </button>
                </div>
              ) : (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`mt-2 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Image className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Klik of sleep een afbeelding hier</p>
                      <p className="text-xs text-gray-400 mt-0.5">JPG, PNG of WebP — wordt bijgesneden naar 9:16</p>
                    </div>
                    <Button variant="outline" size="sm" className="mt-1 pointer-events-none">
                      <Upload className="w-3 h-3 mr-1.5" />
                      Bestand kiezen
                    </Button>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_EXTENSIONS}
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
              />
            </div>

            <div>
              <Label htmlFor="alt_text">Titel (optioneel)</Label>
              <Input
                id="alt_text"
                value={formData.alt_text}
                onChange={(e) => setFormData(prev => ({ ...prev, alt_text: e.target.value }))}
                placeholder="Bijv. Badkamer renovatie"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="sort_order">Volgorde</Label>
              <Input
                id="sort_order"
                type="number"
                min={0}
                value={formData.sort_order}
                onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                className="mt-1"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, active: !prev.active }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.active ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.active ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
              <Label className="cursor-pointer" onClick={() => setFormData(prev => ({ ...prev, active: !prev.active }))}>
                Zichtbaar op website
              </Label>
            </div>

            {uploadProgress !== null && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Uploaden...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} disabled={saving} className="flex-1">
                {saving ? 'Opslaan...' : editingPhoto ? 'Bijwerken' : 'Toevoegen'}
              </Button>
              <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
                Annuleren
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Foto verwijderen</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-gray-600 text-sm">
              Weet je zeker dat je <strong>{deletingPhoto?.alt_text || 'deze foto'}</strong> wilt verwijderen? Dit kan niet ongedaan worden gemaakt.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Verwijderen...' : 'Verwijderen'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={deleting}
                className="flex-1"
              >
                Annuleren
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AnimatePresence>
        {imageEditorOpen && pendingFile && (
          <ImageEditor
            imageFile={pendingFile}
            aspectRatio="9:16"
            onSave={handleImageEditorSave}
            onCancel={handleImageEditorCancel}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}

export function MobilePhotosPage() {
  return (
    <ProtectedRoute>
      <MobilePhotosContent />
    </ProtectedRoute>
  );
}
