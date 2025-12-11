import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Trash2, Image as ImageIcon, Download, Loader } from 'lucide-react';
import { supabase } from '../../lib/supabase/client';
import { useAuth } from '../../contexts/AuthContext';

interface PhotoGalleryProps {
  leadId: string;
  leadName: string;
  onClose: () => void;
  isAdmin?: boolean;
}

interface Photo {
  name: string;
  url: string;
  fullPath: string;
}

export function PhotoGallery({ leadId, leadName, onClose, isAdmin = false }: PhotoGalleryProps) {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    loadPhotos();
  }, [leadId]);

  const loadPhotos = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('lead-photos')
        .list(leadId, {
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('Error listing photos:', error);
        setPhotos([]);
        setLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        setPhotos([]);
        setLoading(false);
        return;
      }

      const photoUrls = await Promise.all(
        data.map(async (file) => {
          const { data: urlData, error: urlError } = await supabase.storage
            .from('lead-photos')
            .createSignedUrl(`${leadId}/${file.name}`, 3600);

          if (urlError) {
            console.error('Error creating signed URL:', urlError);
            return null;
          }

          return {
            name: file.name,
            url: urlData?.signedUrl || '',
            fullPath: `${leadId}/${file.name}`
          };
        })
      );

      setPhotos(photoUrls.filter((p): p is Photo => p !== null && !!p.url));
    } catch (error) {
      console.error('Error loading photos:', error);
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${leadId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('lead-photos')
          .upload(filePath, file);

        if (uploadError) throw uploadError;
      }

      const { data: lead } = await supabase
        .from('leads')
        .select('photo_count')
        .eq('id', leadId)
        .single();

      const newCount = (lead?.photo_count || 0) + files.length;

      await supabase
        .from('leads')
        .update({
          photo_count: newCount,
          photo_folder: leadId
        })
        .eq('id', leadId);

      await loadPhotos();
    } catch (error) {
      console.error('Error uploading photos:', error);
      alert('Er is een fout opgetreden bij het uploaden van de fotos');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (photo: Photo) => {
    if (!confirm('Weet je zeker dat je deze foto wilt verwijderen?')) return;

    try {
      const { error } = await supabase.storage
        .from('lead-photos')
        .remove([photo.fullPath]);

      if (error) throw error;

      const { data: lead } = await supabase
        .from('leads')
        .select('photo_count')
        .eq('id', leadId)
        .single();

      const newCount = Math.max(0, (lead?.photo_count || 1) - 1);

      await supabase
        .from('leads')
        .update({ photo_count: newCount })
        .eq('id', leadId);

      await loadPhotos();
      setSelectedPhoto(null);
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('Er is een fout opgetreden bij het verwijderen van de foto');
    }
  };

  const handleDownload = async (photo: Photo) => {
    try {
      const response = await fetch(photo.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = photo.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading photo:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Foto's</h2>
            <p className="text-gray-600">{leadName}</p>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <label className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-2">
                {uploading ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    Uploaden...
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5" />
                    Upload Foto's
                  </>
                )}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader className="h-12 w-12 animate-spin text-blue-600" />
            </div>
          ) : photos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <ImageIcon className="h-16 w-16 mb-4 text-gray-400" />
              <p className="text-lg font-medium">Nog geen foto's</p>
              {isAdmin && (
                <p className="text-sm">Upload foto's om te beginnen</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo, index) => (
                <motion.div
                  key={photo.fullPath}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer group relative"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-5xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.name}
                className="max-w-full max-h-[80vh] object-contain rounded-xl"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => handleDownload(selectedPhoto)}
                  className="p-3 bg-white/90 hover:bg-white rounded-xl transition-colors"
                >
                  <Download className="h-5 w-5 text-gray-900" />
                </button>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(selectedPhoto)}
                    className="p-3 bg-red-600 hover:bg-red-700 rounded-xl transition-colors"
                  >
                    <Trash2 className="h-5 w-5 text-white" />
                  </button>
                )}
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="p-3 bg-white/90 hover:bg-white rounded-xl transition-colors"
                >
                  <X className="h-5 w-5 text-gray-900" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}