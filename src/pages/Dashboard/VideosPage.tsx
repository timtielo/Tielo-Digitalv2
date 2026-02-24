import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video,
  Plus,
  Pencil,
  Trash2,
  Upload,
  X,
  Eye,
  EyeOff,
  AlertCircle,
  GripVertical,
  Play,
} from 'lucide-react';
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

interface VideoItem {
  id: string;
  user_id: string;
  title: string;
  description: string;
  video_url: string;
  display_order: number;
  active: boolean;
  created_at: string;
}

const MAX_FILE_SIZE_MB = 50;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];
const ACCEPTED_EXTENSIONS = '.mp4,.mov,.webm';

function VideosContent() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [deletingVideo, setDeletingVideo] = useState<VideoItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    display_order: 0,
    active: true,
  });

  useEffect(() => {
    if (user) fetchVideos();
  }, [user]);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('user_id', user?.id)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setVideos(data || []);
    } catch {
      showToast('Fout bij laden van video\'s', 'error');
    } finally {
      setLoading(false);
    }
  };

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Alleen MP4, MOV en WebM bestanden zijn toegestaan.';
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `Bestand is te groot. Maximum is ${MAX_FILE_SIZE_MB}MB.`;
    }
    return null;
  };

  const handleFileSelect = (file: File) => {
    const error = validateFile(file);
    if (error) {
      setFileError(error);
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }
    setFileError(null);
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    if (!formData.title) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      setFormData(prev => ({ ...prev, title: nameWithoutExt }));
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [formData.title]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const openCreateDialog = () => {
    setEditingVideo(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileError(null);
    setUploadProgress(null);
    setFormData({
      title: '',
      description: '',
      display_order: videos.length,
      active: true,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (video: VideoItem) => {
    setEditingVideo(video);
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileError(null);
    setUploadProgress(null);
    setFormData({
      title: video.title,
      description: video.description,
      display_order: video.display_order,
      active: video.active,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setDialogOpen(false);
    setEditingVideo(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileError(null);
    setUploadProgress(null);
  };

  const uploadVideo = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}.${ext}`;
    const filePath = `${user!.id}/${fileName}`;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const pct = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(pct);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const publicUrl = `${supabaseUrl}/storage/v1/object/public/videos/${filePath}`;
          resolve(publicUrl);
        } else {
          reject(new Error('Upload mislukt'));
        }
      });

      xhr.addEventListener('error', () => reject(new Error('Upload mislukt')));

      const session = supabase.auth.getSession();
      session.then(({ data }) => {
        const token = data.session?.access_token || supabaseKey;
        xhr.open('POST', `${supabaseUrl}/storage/v1/object/videos/${filePath}`);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.setRequestHeader('x-upsert', 'true');
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
      });
    });
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      showToast('Vul een titel in', 'error');
      return;
    }
    if (!editingVideo && !selectedFile) {
      showToast('Selecteer een videobestand', 'error');
      return;
    }

    setSaving(true);
    try {
      if (editingVideo) {
        const { error } = await supabase
          .from('videos')
          .update({
            title: formData.title.trim(),
            description: formData.description.trim(),
            display_order: formData.display_order,
            active: formData.active,
          })
          .eq('id', editingVideo.id);

        if (error) throw error;
        showToast('Video bijgewerkt', 'success');
      } else {
        const videoUrl = await uploadVideo(selectedFile!);

        const { error } = await supabase
          .from('videos')
          .insert({
            user_id: user!.id,
            title: formData.title.trim(),
            description: formData.description.trim(),
            video_url: videoUrl,
            display_order: formData.display_order,
            active: formData.active,
          });

        if (error) throw error;
        showToast('Video geupload', 'success');
      }

      await fetchVideos();
      closeDialog();
    } catch (err: any) {
      showToast(err?.message || 'Fout bij opslaan', 'error');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (video: VideoItem) => {
    try {
      const { error } = await supabase
        .from('videos')
        .update({ active: !video.active })
        .eq('id', video.id);

      if (error) throw error;
      setVideos(prev => prev.map(v => v.id === video.id ? { ...v, active: !v.active } : v));
      showToast(video.active ? 'Video verborgen' : 'Video zichtbaar', 'success');
    } catch {
      showToast('Fout bij bijwerken', 'error');
    }
  };

  const confirmDelete = (video: VideoItem) => {
    setDeletingVideo(video);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingVideo) return;
    setDeleting(true);
    try {
      const url = deletingVideo.video_url;
      const storagePathMatch = url.match(/\/storage\/v1\/object\/public\/videos\/(.+)$/);
      if (storagePathMatch) {
        const storagePath = storagePathMatch[1];
        await supabase.storage.from('videos').remove([storagePath]);
      }

      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', deletingVideo.id);

      if (error) throw error;

      setVideos(prev => prev.filter(v => v.id !== deletingVideo.id));
      showToast('Video verwijderd', 'success');
      setDeleteDialogOpen(false);
      setDeletingVideo(null);
    } catch {
      showToast('Fout bij verwijderen', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-tielo-navy/60 text-sm mt-1">
            {videos.length} video{videos.length !== 1 ? "'s" : ''} geupload
          </p>
        </div>
        <Button onClick={openCreateDialog} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Video uploaden
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-tielo-orange" />
        </div>
      ) : videos.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-tielo-orange/10 flex items-center justify-center mb-5">
            <Video className="h-9 w-9 text-tielo-orange" />
          </div>
          <h3 className="text-xl font-bold text-tielo-navy mb-2">Nog geen video's</h3>
          <p className="text-tielo-navy/60 mb-6 max-w-sm">
            Upload je eerste video. Deze verschijnt automatisch op je website.
          </p>
          <Button onClick={openCreateDialog} className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Video uploaden
          </Button>
        </motion.div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.04 }}
              >
                <Card className="overflow-hidden group">
                  <div className="relative bg-tielo-navy aspect-video flex items-center justify-center">
                    <video
                      src={video.video_url}
                      className="w-full h-full object-cover"
                      preload="metadata"
                      muted
                      playsInline
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="h-10 w-10 text-white fill-white" />
                    </div>
                    {!video.active && (
                      <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                        <EyeOff className="h-3 w-3" />
                        Verborgen
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                      <GripVertical className="h-3 w-3" />
                      #{video.display_order + 1}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-tielo-navy truncate mb-1">{video.title}</h3>
                    {video.description && (
                      <p className="text-sm text-tielo-navy/60 line-clamp-2 mb-3">{video.description}</p>
                    )}

                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => toggleActive(video)}
                        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                          video.active
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-tielo-steel/20 text-tielo-navy/60 hover:bg-tielo-steel/30'
                        }`}
                        title={video.active ? 'Klik om te verbergen' : 'Klik om zichtbaar te maken'}
                      >
                        {video.active ? (
                          <><Eye className="h-3 w-3" /> Actief</>
                        ) : (
                          <><EyeOff className="h-3 w-3" /> Verborgen</>
                        )}
                      </button>
                      <div className="flex-1" />
                      <button
                        onClick={() => openEditDialog(video)}
                        className="p-1.5 rounded-md text-tielo-navy/50 hover:text-tielo-navy hover:bg-tielo-steel/20 transition-colors"
                        title="Bewerken"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => confirmDelete(video)}
                        className="p-1.5 rounded-md text-tielo-navy/50 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Verwijderen"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-tielo-navy font-rubik">
              {editingVideo ? 'Video bewerken' : 'Video uploaden'}
            </DialogTitle>
          </DialogHeader>
          <DialogClose onClose={closeDialog} />

          <div className="mt-4 space-y-5">
            {!editingVideo && (
              <div>
                <Label className="mb-2 block">Videobestand *</Label>
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
                    ${dragOver
                      ? 'border-tielo-orange bg-tielo-orange/5'
                      : selectedFile
                        ? 'border-green-400 bg-green-50'
                        : 'border-tielo-steel/40 hover:border-tielo-orange/50 hover:bg-tielo-orange/5'
                    }
                  `}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED_EXTENSIONS}
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  />

                  {selectedFile ? (
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                        <Video className="h-6 w-6 text-green-600" />
                      </div>
                      <p className="font-medium text-tielo-navy text-sm">{selectedFile.name}</p>
                      <p className="text-xs text-tielo-navy/50">
                        {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                      <p className="text-xs text-green-600">Klik om een ander bestand te kiezen</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-full bg-tielo-orange/10 flex items-center justify-center mx-auto">
                        <Upload className="h-6 w-6 text-tielo-orange" />
                      </div>
                      <p className="font-medium text-tielo-navy text-sm">
                        Sleep je video hierheen of klik om te bladeren
                      </p>
                      <p className="text-xs text-tielo-navy/50">
                        MP4, MOV, WebM — max {MAX_FILE_SIZE_MB}MB
                      </p>
                    </div>
                  )}
                </div>

                {fileError && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 mt-2 text-sm text-red-600"
                  >
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {fileError}
                  </motion.div>
                )}

                {previewUrl && (
                  <video
                    src={previewUrl}
                    controls
                    className="w-full rounded-lg mt-3 max-h-40 bg-black"
                  />
                )}
              </div>
            )}

            {editingVideo && (
              <div className="rounded-lg overflow-hidden bg-tielo-navy aspect-video">
                <video
                  src={editingVideo.video_url}
                  controls
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div>
              <Label htmlFor="title" className="mb-1.5 block">Titel *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Bijv. Werkzaamheden badkamer renovatie"
              />
            </div>

            <div>
              <Label htmlFor="description" className="mb-1.5 block">Beschrijving</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Korte omschrijving van de video (optioneel)"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="display_order" className="mb-1.5 block">Volgorde</Label>
                <Input
                  id="display_order"
                  type="number"
                  min={0}
                  value={formData.display_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label className="mb-1.5 block">Zichtbaarheid</Label>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, active: !prev.active }))}
                  className={`
                    w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border-2 text-sm font-medium transition-all
                    ${formData.active
                      ? 'border-green-300 bg-green-50 text-green-700'
                      : 'border-tielo-steel/30 bg-tielo-steel/10 text-tielo-navy/60'
                    }
                  `}
                >
                  {formData.active ? (
                    <><Eye className="h-4 w-4" /> Actief</>
                  ) : (
                    <><EyeOff className="h-4 w-4" /> Verborgen</>
                  )}
                </button>
              </div>
            </div>

            {uploadProgress !== null && uploadProgress < 100 && (
              <div>
                <div className="flex justify-between text-xs text-tielo-navy/60 mb-1">
                  <span>Uploaden...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-tielo-steel/20 rounded-full h-2">
                  <motion.div
                    className="bg-tielo-orange h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <Button
                variant="outline"
                onClick={closeDialog}
                className="flex-1"
                disabled={saving}
              >
                Annuleren
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1"
                disabled={saving || (!editingVideo && !selectedFile) || !!fileError}
              >
                {saving
                  ? (uploadProgress !== null && uploadProgress < 100 ? `Uploaden ${uploadProgress}%` : 'Opslaan...')
                  : editingVideo ? 'Opslaan' : 'Uploaden'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={(open) => { if (!deleting) setDeleteDialogOpen(open); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-tielo-navy font-rubik">Video verwijderen</DialogTitle>
          </DialogHeader>
          <DialogClose onClose={() => !deleting && setDeleteDialogOpen(false)} />

          <div className="mt-4 space-y-4">
            <p className="text-tielo-navy/70">
              Weet je zeker dat je <strong className="text-tielo-navy">"{deletingVideo?.title}"</strong> wilt verwijderen? Dit kan niet ongedaan gemaakt worden.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                className="flex-1"
                disabled={deleting}
              >
                Annuleren
              </Button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {deleting ? 'Verwijderen...' : 'Verwijderen'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function VideosPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout currentPage="videos">
        <VideosContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
