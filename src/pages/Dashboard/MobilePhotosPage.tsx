import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, Trash2, Eye, EyeOff, Plus, Image as ImageIcon,
  Loader2, X, ZoomIn, ZoomOut, RotateCcw, Pencil, Download,
} from 'lucide-react';
import { supabase } from '../../lib/supabase/client';
import { useAuth } from '../../contexts/AuthContext';
import { ProtectedRoute } from '../../components/Dashboard/ProtectedRoute';
import { DashboardLayout } from '../../components/Dashboard/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { useToast } from '../../components/ui/Toast';

const CANVAS_SIZE = 2000;
const RECT_W = 914;
const RECT_H = 1847;
const CORNER_RADIUS = 80;
const PHONE_ASPECT = RECT_H / RECT_W;

interface PhoneImage {
  id: string;
  image_url: string;
  alt_text: string;
  sort_order: number;
  active: boolean;
  created_at: string;
}

interface PanZoom {
  x: number;
  y: number;
  zoom: number;
}

const DEFAULT_PANZOOM: PanZoom = { x: 0, y: 0, zoom: 1 };

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function DraggablePhonePreview({
  imageUrl,
  panZoom,
  onChange,
  width = 340,
}: {
  imageUrl: string | null;
  panZoom: PanZoom;
  onChange: (pz: PanZoom) => void;
  width?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const panZoomRef = useRef(panZoom);
  const onChangeRef = useRef(onChange);

  useEffect(() => { panZoomRef.current = panZoom; }, [panZoom]);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  const phoneH = Math.round(width * PHONE_ASPECT * 0.72);

  const startDrag = (clientX: number, clientY: number) => {
    if (!imageUrl) return;
    isDragging.current = true;
    lastPos.current = { x: clientX, y: clientY };
  };

  const moveDrag = useCallback((clientX: number, clientY: number) => {
    if (!isDragging.current) return;
    const dx = clientX - lastPos.current.x;
    const dy = clientY - lastPos.current.y;
    lastPos.current = { x: clientX, y: clientY };
    const cur = panZoomRef.current;
    onChangeRef.current({ ...cur, x: cur.x + dx, y: cur.y + dy });
  }, []);

  const endDrag = useCallback(() => { isDragging.current = false; }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    const cur = panZoomRef.current;
    const next = Math.min(4, Math.max(0.5, cur.zoom + delta * cur.zoom));
    onChangeRef.current({ ...cur, zoom: next });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onMouseMove = (e: MouseEvent) => moveDrag(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) moveDrag(e.touches[0].clientX, e.touches[0].clientY);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', endDrag);
    el.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', endDrag);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', endDrag);
      el.removeEventListener('wheel', handleWheel);
    };
  }, [moveDrag, endDrag, handleWheel]);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto select-none flex-shrink-0"
      style={{ width, height: phoneH }}
    >
      <div
        className="absolute inset-0 overflow-hidden rounded-[36px] bg-gray-100"
        style={{ cursor: imageUrl ? 'grab' : 'default' }}
        onMouseDown={e => { startDrag(e.clientX, e.clientY); e.preventDefault(); }}
        onTouchStart={e => startDrag(e.touches[0].clientX, e.touches[0].clientY)}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Preview"
            draggable={false}
            className="absolute w-full h-full object-cover pointer-events-none"
            style={{
              transform: `translate(${panZoom.x}px, ${panZoom.y}px) scale(${panZoom.zoom})`,
              transformOrigin: 'center center',
              willChange: 'transform',
            }}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <ImageIcon className="w-12 h-12 text-gray-300" />
            <p className="text-sm text-gray-400 font-medium">Upload een foto</p>
          </div>
        )}
      </div>
      <img
        src="/assets/phone_1.png"
        alt="Phone frame"
        draggable={false}
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        style={{ zIndex: 10 }}
      />
      {imageUrl && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-black/50 text-white text-[11px] font-medium px-3 py-1 rounded-full pointer-events-none backdrop-blur-sm">
          Sleep · Scroll om te zoomen
        </div>
      )}
    </div>
  );
}

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingImage?.image_url ?? null);
  const [altText, setAltText] = useState(existingImage?.alt_text ?? '');
  const [panZoom, setPanZoom] = useState<PanZoom>(DEFAULT_PANZOOM);
  const [exporting, setExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setPanZoom(DEFAULT_PANZOOM);
  };

  const exportAndSave = async () => {
    if (!user) return;
    if (!altText.trim()) { showToast('Vul een alt-tekst in', 'error'); return; }

    if (!selectedFile && existingImage) {
      setExporting(true);
      try {
        const { error } = await supabase
          .from('hero_phone_images')
          .update({ alt_text: altText.trim() })
          .eq('id', existingImage.id);
        if (error) throw error;
        showToast('Opgeslagen!', 'success');
        onSaved();
        onClose();
      } catch (err: any) {
        showToast(err.message || 'Fout bij opslaan', 'error');
      } finally {
        setExporting(false);
      }
      return;
    }

    if (!selectedFile) return;
    setExporting(true);

    try {
      const img = await createImageBitmap(selectedFile);
      const canvas = document.createElement('canvas');
      canvas.width = CANVAS_SIZE;
      canvas.height = CANVAS_SIZE;
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      const RECT_X = (CANVAS_SIZE - RECT_W) / 2;
      const RECT_Y = (CANVAS_SIZE - RECT_H) / 2;

      drawRoundedRect(ctx, RECT_X, RECT_Y, RECT_W, RECT_H, CORNER_RADIUS);
      ctx.save();
      ctx.clip();

      const previewW = 340;
      const previewH = Math.round(previewW * PHONE_ASPECT * 0.72);
      const scaleX = RECT_W / previewW;
      const scaleY = RECT_H / previewH;

      const cx = CANVAS_SIZE / 2;
      const cy = CANVAS_SIZE / 2;
      ctx.translate(cx + panZoom.x * scaleX, cy + panZoom.y * scaleY);
      ctx.scale(panZoom.zoom, panZoom.zoom);

      const imgAspect = img.width / img.height;
      const rectAspect = RECT_W / RECT_H;
      let drawW: number, drawH: number;
      if (imgAspect > rectAspect) {
        drawH = RECT_H;
        drawW = drawH * imgAspect;
      } else {
        drawW = RECT_W;
        drawH = drawW / imgAspect;
      }

      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();

      const blob: Blob = await new Promise(res => canvas.toBlob(b => res(b!), 'image/png'));
      const filename = `${user.id}/${Date.now()}.png`;

      const { error: uploadError } = await supabase.storage
        .from('hero-images')
        .upload(filename, blob, { contentType: 'image/png', upsert: false });
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
      onSaved();
      onClose();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Fout bij opslaan', 'error');
    } finally {
      setExporting(false);
    }
  };

  const isEditing = !!existingImage;

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-center bg-tielo-navy/75 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-5xl bg-white flex flex-col md:flex-row shadow-2xl md:my-6 md:mx-4 md:rounded-td overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-tielo-steel/20 md:hidden">
          <h2 className="text-lg font-bold font-rubik text-tielo-navy">
            {isEditing ? 'Foto Bewerken' : 'Nieuwe Foto'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-tielo-orange/10 rounded-td transition-colors">
            <X className="w-5 h-5 text-tielo-navy" />
          </button>
        </div>

        <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-tielo-steel/20 flex flex-col overflow-y-auto flex-shrink-0">
          <div className="hidden md:flex items-center justify-between px-6 py-5 border-b border-tielo-steel/20">
            <h2 className="text-xl font-bold font-rubik text-tielo-navy">
              {isEditing ? 'Foto Bewerken' : 'Nieuwe Foto'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-tielo-orange/10 rounded-td transition-colors">
              <X className="w-5 h-5 text-tielo-navy" />
            </button>
          </div>

          <div className="p-6 space-y-5 flex-1">
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-td p-5 text-center cursor-pointer transition-all group ${
                selectedFile
                  ? 'border-tielo-orange bg-tielo-orange/5'
                  : 'border-tielo-steel/40 hover:border-tielo-orange hover:bg-tielo-orange/3'
              }`}
            >
              <div className="p-2.5 bg-tielo-orange/10 rounded-td w-fit mx-auto mb-2 group-hover:bg-tielo-orange/20 transition-colors">
                <Upload className="w-5 h-5 text-tielo-orange" />
              </div>
              <p className="text-sm font-bold text-tielo-navy leading-snug">
                {selectedFile ? selectedFile.name : isEditing ? 'Nieuwe foto uploaden' : 'Klik om foto te selecteren'}
              </p>
              {isEditing && !selectedFile && (
                <p className="text-xs text-tielo-navy/40 mt-1">Laat leeg om huidige foto te behouden</p>
              )}
              <p className="text-[11px] text-tielo-navy/40 mt-1">PNG, JPG of WebP</p>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            </div>

            <div>
              <label className="text-xs font-bold text-tielo-navy/60 uppercase tracking-wide block mb-1.5">
                Omschrijving *
              </label>
              <input
                type="text"
                value={altText}
                onChange={e => setAltText(e.target.value)}
                placeholder="bijv. Badkamer renovatie Amersfoort"
                className="w-full px-3 py-2.5 text-sm border border-tielo-steel/30 rounded-td bg-tielo-offwhite focus:outline-none focus:border-tielo-orange transition-colors text-tielo-navy placeholder-tielo-navy/30"
              />
            </div>

            {previewUrl && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-tielo-navy/60 uppercase tracking-wide">Zoom</label>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setPanZoom(p => ({ ...p, zoom: Math.max(0.5, +(p.zoom - 0.1).toFixed(2)) }))}
                      className="p-1.5 rounded-td border border-tielo-steel/20 hover:border-tielo-orange/50 hover:bg-tielo-orange/5 text-tielo-navy/50 hover:text-tielo-orange transition-all"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-bold text-tielo-navy w-12 text-center tabular-nums">
                      {panZoom.zoom.toFixed(2)}x
                    </span>
                    <button
                      onClick={() => setPanZoom(p => ({ ...p, zoom: Math.min(4, +(p.zoom + 0.1).toFixed(2)) }))}
                      className="p-1.5 rounded-td border border-tielo-steel/20 hover:border-tielo-orange/50 hover:bg-tielo-orange/5 text-tielo-navy/50 hover:text-tielo-orange transition-all"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setPanZoom(DEFAULT_PANZOOM)}
                      className="p-1.5 rounded-td border border-tielo-steel/20 hover:border-tielo-orange/50 hover:bg-tielo-orange/5 text-tielo-navy/30 hover:text-tielo-orange transition-all"
                      title="Reset positie"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={4}
                  step={0.01}
                  value={panZoom.zoom}
                  onChange={e => setPanZoom(p => ({ ...p, zoom: Number(e.target.value) }))}
                  className="w-full h-2 appearance-none bg-tielo-steel/20 rounded-full accent-tielo-orange cursor-pointer"
                />
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[1, 1.5, 2].map(z => (
                    <button
                      key={z}
                      onClick={() => setPanZoom(p => ({ ...p, zoom: z }))}
                      className={`text-xs font-bold py-1.5 rounded-td border transition-all ${
                        Math.abs(panZoom.zoom - z) < 0.05
                          ? 'border-tielo-orange bg-tielo-orange/10 text-tielo-orange'
                          : 'border-tielo-steel/20 text-tielo-navy/50 hover:border-tielo-orange/40 hover:text-tielo-orange'
                      }`}
                    >
                      {z}x
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-tielo-steel/20">
            <button
              onClick={exportAndSave}
              disabled={(!selectedFile && !existingImage) || exporting}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-tielo-orange hover:bg-tielo-orange/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-td transition-all shadow-md text-sm"
            >
              {exporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Opslaan...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  {selectedFile ? 'Exporteren & Opslaan' : 'Opslaan'}
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex-1 bg-[#f4f4f2] flex flex-col items-center justify-center p-8 min-h-[500px]">
          <p className="text-xs font-bold text-tielo-navy/40 uppercase tracking-widest mb-6">
            {previewUrl ? 'Sleep · Scroll om te zoomen' : 'Preview'}
          </p>
          <DraggablePhonePreview
            imageUrl={previewUrl}
            panZoom={panZoom}
            onChange={setPanZoom}
            width={340}
          />
        </div>
      </motion.div>
    </div>
  );
}

function ImageCard({
  image,
  onToggle,
  onDelete,
  onEdit,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
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

      <div className="relative w-16 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 cursor-pointer group" onClick={onEdit}>
        <img
          src={image.image_url}
          alt={image.alt_text}
          className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
          style={{ opacity: image.active ? 1 : 0.4 }}
        />
        <img src="/assets/phone_1.png" alt="" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
        <div className="absolute inset-0 bg-tielo-navy/0 group-hover:bg-tielo-navy/30 transition-colors flex items-center justify-center">
          <Pencil className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

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
              <p className="text-white/70">Upload en beheer foto's voor het telefoon-frame op jouw website</p>
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
                <p className="text-sm text-tielo-navy/50 mb-4">Upload je eerste foto voor het telefoon-frame</p>
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
              <h3 className="text-sm font-bold font-rubik text-tielo-navy mb-3">Actieve Foto's Preview</h3>
              {activeImages.length > 0 ? (
                <div className="space-y-4">
                  {activeImages.slice(0, 3).map(img => (
                    <div key={img.id} className="relative cursor-pointer group" onClick={() => setPreviewImage(img)}>
                      <div className="relative mx-auto" style={{ width: 120, height: Math.round(120 * PHONE_ASPECT * 0.72) }}>
                        <div className="absolute inset-0 overflow-hidden rounded-[14px] bg-gray-100">
                          <img src={img.image_url} alt={img.alt_text} className="absolute inset-0 w-full h-full object-cover" />
                        </div>
                        <img src="/assets/phone_1.png" alt="" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
                        <div className="absolute inset-0 bg-tielo-navy/0 group-hover:bg-tielo-navy/20 rounded-[14px] transition-colors" />
                      </div>
                      <p className="text-xs text-tielo-navy/50 text-center mt-1 truncate max-w-[120px] mx-auto">{img.alt_text}</p>
                    </div>
                  ))}
                  {activeImages.length > 3 && (
                    <p className="text-xs text-tielo-navy/40 text-center">+{activeImages.length - 3} meer</p>
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
              className="relative"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative" style={{ width: 300, height: Math.round(300 * PHONE_ASPECT * 0.72) }}>
                <div className="absolute inset-0 overflow-hidden rounded-[32px] bg-gray-100">
                  <img src={previewImage.image_url} alt={previewImage.alt_text} className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <img src="/assets/phone_1.png" alt="" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
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
