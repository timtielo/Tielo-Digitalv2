import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, Trash2, Eye, EyeOff, Plus, Image as ImageIcon,
  Loader2, X, ZoomIn, ZoomOut, RotateCw, Pencil, Check, Move,
} from 'lucide-react';
import { supabase } from '../../lib/supabase/client';
import { useAuth } from '../../contexts/AuthContext';
import { ProtectedRoute } from '../../components/Dashboard/ProtectedRoute';
import { DashboardLayout } from '../../components/Dashboard/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { useToast } from '../../components/ui/Toast';

const EXPORT_W = 937;
const EXPORT_H = 1937;

interface PhoneImage {
  id: string;
  image_url: string;
  alt_text: string;
  sort_order: number;
  active: boolean;
  created_at: string;
}

/* ─── Canvas Photo Editor ───────────────────────────────────────────────────── */
function PhotoEditor({
  existingImage,
  onClose,
  onSaved,
}: {
  existingImage?: PhoneImage;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [altText, setAltText] = useState(existingImage?.alt_text ?? '');
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const DISPLAY_W = 400;
  const DISPLAY_H = Math.round(DISPLAY_W * (EXPORT_H / EXPORT_W));

  const loadImage = useCallback((file: File) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      setImage(img);
      const initialScale = Math.max(DISPLAY_W / img.width, DISPLAY_H / img.height);
      setScale(initialScale);
      setPosition({ x: 0, y: 0 });
      setRotation(0);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, [DISPLAY_W, DISPLAY_H]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    loadImage(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleFileSelect(file);
  };

  useEffect(() => {
    if (!existingImage?.image_url || selectedFile) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImage(img);
      const initialScale = Math.max(DISPLAY_W / img.width, DISPLAY_H / img.height);
      setScale(initialScale);
      setPosition({ x: 0, y: 0 });
    };
    img.src = existingImage.image_url;
  }, [existingImage?.image_url, selectedFile, DISPLAY_W, DISPLAY_H]);

  useEffect(() => {
    if (!image || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = DISPLAY_W;
    canvas.height = DISPLAY_H;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, DISPLAY_W, DISPLAY_H);

    ctx.save();
    ctx.translate(DISPLAY_W / 2 + position.x, DISPLAY_H / 2 + position.y);
    ctx.rotate((rotation * Math.PI) / 180);
    const sw = image.width * scale;
    const sh = image.height * scale;
    ctx.drawImage(image, -sw / 2, -sh / 2, sw, sh);
    ctx.restore();

    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(1, 1, DISPLAY_W - 2, DISPLAY_H - 2);
    ctx.setLineDash([]);
  }, [image, scale, rotation, position, DISPLAY_W, DISPLAY_H]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!image) return;
    setIsDragging(true);
    setDragStart({ x: e.nativeEvent.offsetX - position.x, y: e.nativeEvent.offsetY - position.y });
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setPosition({ x: e.nativeEvent.offsetX - dragStart.x, y: e.nativeEvent.offsetY - dragStart.y });
  };
  const handleMouseUp = () => setIsDragging(false);

  const handleZoomIn  = () => setScale(p => Math.min(p * 1.2, 10));
  const handleZoomOut = () => setScale(p => Math.max(p / 1.2, 0.05));
  const handleRotate  = () => setRotation(p => (p + 90) % 360);
  const handleReset   = () => {
    if (!image) return;
    setScale(Math.max(DISPLAY_W / image.width, DISPLAY_H / image.height));
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleSave = async () => {
    if (!user) return;
    if (!altText.trim()) { showToast('Vul een omschrijving in', 'error'); return; }

    setSaving(true);
    try {
      if (!selectedFile && existingImage && !image) {
        const { error } = await supabase
          .from('hero_phone_images')
          .update({ alt_text: altText.trim() })
          .eq('id', existingImage.id);
        if (error) throw error;
        showToast('Opgeslagen!', 'success');
        onSaved(); onClose();
        return;
      }

      if (!image) { showToast('Selecteer eerst een foto', 'error'); return; }

      const outputCanvas = document.createElement('canvas');
      outputCanvas.width  = EXPORT_W;
      outputCanvas.height = EXPORT_H;
      const ctx = outputCanvas.getContext('2d')!;

      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, EXPORT_W, EXPORT_H);

      const scaleX = EXPORT_W / DISPLAY_W;
      const scaleY = EXPORT_H / DISPLAY_H;

      ctx.save();
      ctx.translate(EXPORT_W / 2 + position.x * scaleX, EXPORT_H / 2 + position.y * scaleY);
      ctx.rotate((rotation * Math.PI) / 180);
      const exportScale = scale * scaleX;
      ctx.drawImage(image, -(image.width * exportScale) / 2, -(image.height * exportScale) / 2, image.width * exportScale, image.height * exportScale);
      ctx.restore();

      const blob: Blob = await new Promise(res => outputCanvas.toBlob(b => res(b!), 'image/jpeg', 0.92));
      const filename = `${user.id}/${Date.now()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from('hero-images')
        .upload(filename, blob, { contentType: 'image/jpeg', upsert: false });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('hero-images').getPublicUrl(filename);
      const publicUrl = urlData.publicUrl;

      if (existingImage) {
        const { error } = await supabase
          .from('hero_phone_images')
          .update({ image_url: publicUrl, alt_text: altText.trim() })
          .eq('id', existingImage.id);
        if (error) throw error;
      } else {
        const { data: maxOrder } = await supabase
          .from('hero_phone_images')
          .select('sort_order')
          .eq('user_id', user.id)
          .order('sort_order', { ascending: false })
          .limit(1)
          .maybeSingle();

        const { error } = await supabase.from('hero_phone_images').insert({
          user_id: user.id,
          image_url: publicUrl,
          alt_text: altText.trim(),
          sort_order: (maxOrder?.sort_order ?? -1) + 1,
          active: true,
        });
        if (error) throw error;
      }

      showToast('Foto succesvol opgeslagen!', 'success');
      onSaved(); onClose();
    } catch (err: any) {
      showToast(err.message || 'Fout bij opslaan', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden"
    >
      <motion.div
        initial={{ scale: 0.92, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 16 }}
        className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-5xl h-[95vh] flex flex-col"
      >
        <div className="p-5 flex-shrink-0 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white font-rubik">
              {existingImage ? 'Foto Bewerken' : 'Nieuwe Foto'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Exportformaat: {EXPORT_W} × {EXPORT_H} px</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col lg:flex-row gap-6 p-6 h-full">
            {/* Canvas preview */}
            <div className="flex-1 flex flex-col items-center">
              <div className="bg-gray-950 rounded-xl p-4 w-full flex justify-center">
                {image ? (
                  <canvas
                    ref={canvasRef}
                    className="border-2 border-white/20 rounded-lg"
                    style={{
                      width: `${DISPLAY_W}px`,
                      height: `${DISPLAY_H}px`,
                      maxWidth: '100%',
                      cursor: isDragging ? 'grabbing' : 'grab',
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  />
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setIsDraggingFile(true); }}
                    onDragLeave={() => setIsDraggingFile(false)}
                    onDrop={handleDrop}
                    className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                      isDraggingFile
                        ? 'border-tielo-orange bg-tielo-orange/10'
                        : 'border-white/20 hover:border-tielo-orange hover:bg-tielo-orange/5'
                    }`}
                    style={{ width: DISPLAY_W, height: DISPLAY_H, maxWidth: '100%' }}
                  >
                    <div className="p-4 bg-white/10 rounded-full mb-3">
                      <ImageIcon className="w-8 h-8 text-white/40" />
                    </div>
                    <p className="text-white/60 font-medium text-sm">
                      {isDraggingFile ? 'Laat los' : 'Klik of sleep een foto'}
                    </p>
                    <p className="text-white/30 text-xs mt-1">PNG, JPG of WebP</p>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }} className="hidden" />
                  </div>
                )}
              </div>

              {image && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mt-3 w-full max-w-[400px]">
                  <div className="flex items-start gap-2">
                    <Move className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-200">Sleep de afbeelding om te positioneren · Exportformaat: {EXPORT_W}×{EXPORT_H}px</p>
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="w-full lg:w-72 flex flex-col gap-4 flex-shrink-0">
              {/* File picker when image already loaded */}
              {image && (
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block mb-2">Foto</label>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setIsDraggingFile(true); }}
                    onDragLeave={() => setIsDraggingFile(false)}
                    onDrop={handleDrop}
                    className={`w-full border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                      isDraggingFile ? 'border-tielo-orange bg-tielo-orange/10' : 'border-white/20 hover:border-tielo-orange hover:bg-white/5'
                    }`}
                  >
                    <Upload className="w-4 h-4 text-white/40 mx-auto mb-1" />
                    <p className="text-xs text-white/50">{selectedFile ? selectedFile.name : 'Andere foto kiezen'}</p>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }} className="hidden" />
                  </button>
                </div>
              )}

              {/* Omschrijving */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block mb-2">Omschrijving *</label>
                <input
                  type="text"
                  value={altText}
                  onChange={e => setAltText(e.target.value)}
                  placeholder="bijv. Badkamer renovatie Amersfoort"
                  className="w-full px-3 py-2.5 text-sm border border-white/20 rounded-lg bg-white/5 focus:outline-none focus:border-tielo-orange transition-colors text-white placeholder-white/30"
                />
              </div>

              {/* Zoom / rotate controls */}
              {image && (
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block mb-2">Aanpassen</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleZoomIn}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-all"
                    >
                      <ZoomIn className="w-3.5 h-3.5" /> Zoom In
                    </button>
                    <button
                      onClick={handleZoomOut}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-all"
                    >
                      <ZoomOut className="w-3.5 h-3.5" /> Zoom Out
                    </button>
                    <button
                      onClick={handleRotate}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-all"
                    >
                      <RotateCw className="w-3.5 h-3.5" /> Roteren
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-3 py-2 text-xs font-medium bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-all"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-5 flex-shrink-0 border-t border-white/10 bg-gray-900 flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving || (!image && !existingImage)}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-tielo-orange hover:bg-tielo-orange/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-md"
          >
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Opslaan...</> : <><Check className="w-4 h-4" />Opslaan</>}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl transition-all"
          >
            Annuleren
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Thumbnail ─────────────────────────────────────────────────────────────── */
function ImageThumbnail({ image, onClick }: { image: PhoneImage; onClick?: () => void }) {
  return (
    <div
      className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer group bg-gray-900"
      onClick={onClick}
    >
      <img
        src={image.image_url}
        alt={image.alt_text}
        className="w-full h-full object-cover transition-transform group-hover:scale-105"
        style={{ opacity: image.active ? 1 : 0.4 }}
      />
      {onClick && (
        <div className="absolute inset-0 bg-tielo-navy/0 group-hover:bg-tielo-navy/30 transition-colors flex items-center justify-center">
          <Pencil className="w-3.5 h-3.5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}
    </div>
  );
}

/* ─── List row ──────────────────────────────────────────────────────────────── */
function ImageCard({
  image, onToggle, onDelete, onEdit, onMoveUp, onMoveDown, isFirst, isLast,
}: {
  image: PhoneImage;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 p-4 bg-white border border-tielo-steel/20 rounded-td hover:border-tielo-orange/30 transition-all"
    >
      <div className="flex flex-col gap-1 flex-shrink-0">
        <button onClick={onMoveUp} disabled={isFirst} className="p-1 rounded hover:bg-tielo-orange/10 text-tielo-navy/40 hover:text-tielo-orange disabled:opacity-20 transition-colors">
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor"><path d="M6 2l4 5H2l4-5z" /></svg>
        </button>
        <button onClick={onMoveDown} disabled={isLast} className="p-1 rounded hover:bg-tielo-orange/10 text-tielo-navy/40 hover:text-tielo-orange disabled:opacity-20 transition-colors">
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor"><path d="M6 10L2 5h8l-4 5z" /></svg>
        </button>
      </div>

      <ImageThumbnail image={image} onClick={onEdit} />

      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-tielo-navy truncate">{image.alt_text || 'Geen beschrijving'}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${image.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            {image.active ? 'Actief' : 'Verborgen'}
          </span>
          <span className="text-xs text-tielo-navy/40">#{image.sort_order + 1}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button onClick={onEdit} title="Bewerken" className="p-2 rounded-td border border-tielo-steel/20 hover:border-tielo-orange/50 hover:bg-tielo-orange/5 text-tielo-navy/50 hover:text-tielo-orange transition-all">
          <Pencil className="w-4 h-4" />
        </button>
        <button onClick={onToggle} title={image.active ? 'Verbergen' : 'Tonen'} className="p-2 rounded-td border border-tielo-steel/20 hover:border-tielo-orange/40 hover:bg-tielo-orange/5 text-tielo-navy/50 hover:text-tielo-orange transition-all">
          {image.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
        <button onClick={onDelete} title="Verwijderen" className="p-2 rounded-td border border-red-200 hover:bg-red-50 text-red-400 hover:text-red-600 transition-all">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Sidebar square thumb ──────────────────────────────────────────────────── */
function SidebarThumb({ image, onClick }: { image: PhoneImage; onClick: () => void }) {
  return (
    <div className="flex flex-col items-center cursor-pointer group" onClick={onClick}>
      <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-900">
        <img src={image.image_url} alt={image.alt_text} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        <div className="absolute inset-0 bg-tielo-navy/0 group-hover:bg-tielo-navy/20 transition-colors" />
      </div>
      <p className="text-xs text-tielo-navy/50 text-center mt-1.5 truncate max-w-[96px]">{image.alt_text}</p>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────────── */
function MobilePhotosContent() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [images, setImages] = useState<PhoneImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editorTarget, setEditorTarget] = useState<PhoneImage | 'new' | null>(null);
  const [previewImage, setPreviewImage] = useState<PhoneImage | null>(null);

  const fetchImages = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('hero_phone_images')
        .select('*')
        .eq('user_id', user.id)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      setImages(data || []);
    } catch {
      showToast("Fout bij laden van foto's", 'error');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const toggleActive = async (image: PhoneImage) => {
    const next = !image.active;
    setImages(prev => prev.map(i => i.id === image.id ? { ...i, active: next } : i));
    try {
      const { error } = await supabase.from('hero_phone_images').update({ active: next }).eq('id', image.id);
      if (error) throw error;
    } catch {
      setImages(prev => prev.map(i => i.id === image.id ? { ...i, active: !next } : i));
      showToast('Fout bij bijwerken', 'error');
    }
  };

  const deleteImage = async (image: PhoneImage) => {
    if (!confirm(`Weet je zeker dat je "${image.alt_text || 'deze foto'}" wilt verwijderen?`)) return;
    try {
      const { error } = await supabase.from('hero_phone_images').delete().eq('id', image.id);
      if (error) throw error;
      setImages(prev => prev.filter(i => i.id !== image.id));
      showToast('Foto verwijderd', 'success');
    } catch {
      showToast('Fout bij verwijderen', 'error');
    }
  };

  const moveImage = async (index: number, direction: 'up' | 'down') => {
    const newImages = [...images];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newImages.length) return;
    [newImages[index], newImages[swapIndex]] = [newImages[swapIndex], newImages[index]];
    const updated = newImages.map((img, i) => ({ ...img, sort_order: i }));
    setImages(updated);
    try {
      await Promise.all(updated.map(img =>
        supabase.from('hero_phone_images').update({ sort_order: img.sort_order }).eq('id', img.id)
      ));
    } catch {
      showToast('Fout bij opslaan volgorde', 'error');
      fetchImages();
    }
  };

  const activeImages = images.filter(i => i.active);

  return (
    <DashboardLayout currentPage="mobile_photos">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-tielo-navy rounded-td p-6 text-white shadow-xl relative overflow-hidden"
        >
          <div className="absolute inset-0 td-striped opacity-10" />
          <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold font-rubik mb-1">Foto's Mobiel Websites</h1>
              <p className="text-white/70">Upload en beheer foto's voor jouw website · {EXPORT_W} × {EXPORT_H} px</p>
            </div>
            <button
              onClick={() => setEditorTarget('new')}
              className="flex items-center gap-2 px-5 py-3 bg-tielo-orange hover:bg-tielo-orange/90 text-white font-bold rounded-td shadow-lg transition-all flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              Nieuwe Foto
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-3"
          >
            <h2 className="text-lg font-bold font-rubik text-tielo-navy">
              Geüploade Foto's
              <span className="ml-2 text-sm font-normal text-tielo-navy/40">({images.length})</span>
            </h2>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-tielo-orange" />
              </div>
            ) : images.length === 0 ? (
              <Card className="td-card p-12 text-center">
                <div className="p-4 bg-tielo-orange/10 rounded-td w-fit mx-auto mb-4">
                  <ImageIcon className="w-8 h-8 text-tielo-orange" />
                </div>
                <p className="text-tielo-navy font-bold mb-1">Nog geen foto's</p>
                <p className="text-sm text-tielo-navy/50 mb-4">Upload je eerste foto</p>
                <button
                  onClick={() => setEditorTarget('new')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-tielo-orange hover:bg-tielo-orange/90 text-white font-bold rounded-td transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Foto Toevoegen
                </button>
              </Card>
            ) : (
              <div className="space-y-2">
                {images.map((image, index) => (
                  <ImageCard
                    key={image.id}
                    image={image}
                    onToggle={() => toggleActive(image)}
                    onDelete={() => deleteImage(image)}
                    onEdit={() => setEditorTarget(image)}
                    onMoveUp={() => moveImage(index, 'up')}
                    onMoveDown={() => moveImage(index, 'down')}
                    isFirst={index === 0}
                    isLast={index === images.length - 1}
                  />
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <Card className="td-card p-5">
              <h3 className="text-sm font-bold font-rubik text-tielo-navy mb-4">Actieve Foto's</h3>
              {activeImages.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {activeImages.slice(0, 4).map(img => (
                    <SidebarThumb key={img.id} image={img} onClick={() => setPreviewImage(img)} />
                  ))}
                  {activeImages.length > 4 && (
                    <p className="text-xs text-tielo-navy/40 w-full text-center">+{activeImages.length - 4} meer</p>
                  )}
                </div>
              ) : (
                <p className="text-xs text-tielo-navy/40 text-center py-4">Geen actieve foto's</p>
              )}
            </Card>

            <Card className="td-card p-5">
              <h3 className="text-sm font-bold font-rubik text-tielo-navy mb-2">Statistieken</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-tielo-offwhite rounded-td p-3 text-center">
                  <p className="text-2xl font-bold font-rubik text-tielo-navy">{images.length}</p>
                  <p className="text-[10px] uppercase font-bold text-tielo-navy/40 tracking-wide mt-0.5">Totaal</p>
                </div>
                <div className="bg-tielo-offwhite rounded-td p-3 text-center">
                  <p className="text-2xl font-bold font-rubik text-tielo-navy">{activeImages.length}</p>
                  <p className="text-[10px] uppercase font-bold text-tielo-navy/40 tracking-wide mt-0.5">Actief</p>
                </div>
              </div>
            </Card>

            <Card className="td-card p-5 space-y-2">
              <h3 className="text-sm font-bold font-rubik text-tielo-navy">Exportformaat</h3>
              <p className="text-xs text-tielo-navy/50 leading-relaxed">
                Foto's worden opgeslagen als <strong className="text-tielo-navy/70">{EXPORT_W} × {EXPORT_H} px</strong> (staand formaat).
              </p>
            </Card>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {editorTarget !== null && (
          <PhotoEditor
            existingImage={editorTarget === 'new' ? undefined : editorTarget}
            onClose={() => setEditorTarget(null)}
            onSaved={fetchImages}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-tielo-navy/85 backdrop-blur-sm p-4"
            onClick={() => setPreviewImage(null)}
          >
            <motion.div
              initial={{ scale: 0.88 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.88 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="relative max-w-sm w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: `${EXPORT_W}/${EXPORT_H}` }}>
                <img src={previewImage.image_url} alt={previewImage.alt_text} className="w-full h-full object-cover" />
              </div>
              <p className="text-white/80 text-center mt-3 text-sm font-medium">{previewImage.alt_text}</p>
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute -top-3 -right-3 bg-white rounded-full p-1.5 shadow-xl hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 text-tielo-navy" />
              </button>
            </motion.div>
          </motion.div>
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
