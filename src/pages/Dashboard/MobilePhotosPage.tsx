import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, Trash2, Eye, EyeOff, Plus, Image as ImageIcon,
  Loader2, X, ZoomIn, ZoomOut, RotateCcw, Pencil, Download,
  Move,
} from 'lucide-react';
import { supabase } from '../../lib/supabase/client';
import { useAuth } from '../../contexts/AuthContext';
import { ProtectedRoute } from '../../components/Dashboard/ProtectedRoute';
import { DashboardLayout } from '../../components/Dashboard/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { useToast } from '../../components/ui/Toast';

/*
  Phone frame: phone_1.png is 1024 × 2048 px (1:2 aspect ratio).

  The visible screen area inside the bezel (measured as fractions of image size):
    left:   6.8%   right:  6.8%   → screen width  fraction = 0.864
    top:   11.8%   bottom: 7.5%   → screen height fraction = 0.807

  Screen area pixel dimensions:
    screen_w = 1024 × 0.864 = 884.7 px
    screen_h = 2048 × 0.807 = 1653.1 px
    aspect   = 884.7 / 1653.1 ≈ 0.535 (w:h)  i.e. h/w ≈ 1.8685

  Export canvas: 1080 × 2018 px (maintains exact screen aspect ratio).
    1080 × 1.8685 = 2017.9 → round to 2018

  Saved images have this exact 1080×2018 ratio.
  When the frontend displays them with object-cover inside the screen area,
  they will fill perfectly with no letterboxing.
*/

const PHONE_IMG_ASPECT = 2048 / 1024;   // = 2.0 (height/width)

const SCREEN_LEFT_FRAC   = 0.068;
const SCREEN_TOP_FRAC    = 0.118;
const SCREEN_WIDTH_FRAC  = 0.864;
const SCREEN_HEIGHT_FRAC = 0.807;

// Exact screen aspect ratio (height/width)
const SCREEN_ASPECT_HW = (SCREEN_HEIGHT_FRAC * 2048) / (SCREEN_WIDTH_FRAC * 1024); // ≈ 1.8685

// Export dimensions that exactly match the screen aspect ratio
const EXPORT_W = 1080;
const EXPORT_H = Math.round(EXPORT_W * SCREEN_ASPECT_HW); // 2018

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

/*
  DraggablePhonePreview
  ---------------------
  Renders the phone frame with the photo clipped exactly to the screen area.
  The clip area has the SAME aspect ratio as the export canvas (EXPORT_W × EXPORT_H),
  so what you see in the preview IS what gets exported — true WYSIWYG.

  Pan: drag to reposition.
  Zoom: scroll wheel or buttons (0.5x – 4x).

  At zoom=1, the image covers the screen area (object-cover behaviour):
  the image is scaled so whichever dimension is smaller fills the screen,
  and the larger dimension overflows (and is hidden by clip).
*/
function DraggablePhonePreview({
  imageUrl,
  panZoom,
  onChange,
  width = 260,
  readonly = false,
}: {
  imageUrl: string | null;
  panZoom: PanZoom;
  onChange: (pz: PanZoom) => void;
  width?: number;
  readonly?: boolean;
}) {
  const wrapRef    = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastPos    = useRef({ x: 0, y: 0 });
  const pzRef      = useRef(panZoom);
  const cbRef      = useRef(onChange);

  useEffect(() => { pzRef.current = panZoom; }, [panZoom]);
  useEffect(() => { cbRef.current = onChange; }, [onChange]);

  const phoneH = Math.round(width * PHONE_IMG_ASPECT);

  // Screen area in display pixels
  const sx = Math.round(width * SCREEN_LEFT_FRAC);
  const sy = Math.round(phoneH * SCREEN_TOP_FRAC);
  const sw = Math.round(width * SCREEN_WIDTH_FRAC);
  const sh = Math.round(phoneH * SCREEN_HEIGHT_FRAC);

  // At zoom=1 the image must cover the screen area (object-cover).
  // We compute cover dimensions from the actual image size via an img element,
  // but since we don't have the natural size here we use CSS object-fit instead.

  const startDrag = (cx: number, cy: number) => {
    if (!imageUrl || readonly) return;
    isDragging.current = true;
    lastPos.current = { x: cx, y: cy };
  };

  const moveDrag = useCallback((cx: number, cy: number) => {
    if (!isDragging.current) return;
    const dx = cx - lastPos.current.x;
    const dy = cy - lastPos.current.y;
    lastPos.current = { x: cx, y: cy };
    const cur = pzRef.current;
    cbRef.current({ ...cur, x: cur.x + dx, y: cur.y + dy });
  }, []);

  const endDrag = useCallback(() => { isDragging.current = false; }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    const cur = pzRef.current;
    const next = Math.min(4, Math.max(1, cur.zoom + delta * cur.zoom));
    cbRef.current({ ...cur, zoom: parseFloat(next.toFixed(3)) });
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onMM = (e: MouseEvent) => moveDrag(e.clientX, e.clientY);
    const onTM = (e: TouchEvent) => {
      if (e.touches.length === 1) moveDrag(e.touches[0].clientX, e.touches[0].clientY);
    };
    window.addEventListener('mousemove', onMM);
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchmove', onTM, { passive: false });
    window.addEventListener('touchend', endDrag);
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('mousemove', onMM);
      window.removeEventListener('mouseup', endDrag);
      window.removeEventListener('touchmove', onTM);
      window.removeEventListener('touchend', endDrag);
      el.removeEventListener('wheel', handleWheel);
    };
  }, [moveDrag, endDrag, handleWheel]);

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto select-none flex-shrink-0"
      style={{ width, height: phoneH }}
    >
      {/* Photo layer — clipped to screen area, matching export aspect ratio */}
      <div
        className="absolute overflow-hidden"
        style={{
          left: sx,
          top: sy,
          width: sw,
          height: sh,
          cursor: imageUrl && !readonly ? (isDragging.current ? 'grabbing' : 'grab') : 'default',
          background: '#1a1a2e',
        }}
        onMouseDown={e => { startDrag(e.clientX, e.clientY); e.preventDefault(); }}
        onTouchStart={e => startDrag(e.touches[0].clientX, e.touches[0].clientY)}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Preview"
            draggable={false}
            className="absolute pointer-events-none"
            style={readonly ? {
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            } : {
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `translate(${panZoom.x}px, ${panZoom.y}px) scale(${panZoom.zoom})`,
              transformOrigin: 'center center',
              willChange: 'transform',
            }}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div className="p-3 bg-white/10 rounded-full">
              <ImageIcon className="w-6 h-6 text-white/40" />
            </div>
            <p className="text-[10px] text-white/30 font-medium text-center leading-tight px-2">
              Upload een foto
            </p>
          </div>
        )}
        {imageUrl && !readonly && (
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-10 bg-black/50 text-white text-[9px] font-medium px-2 py-0.5 rounded-full pointer-events-none backdrop-blur-sm whitespace-nowrap flex items-center gap-1">
            <Move className="w-2.5 h-2.5" />
            Sleep · Scroll = zoom
          </div>
        )}
      </div>

      {/* Phone frame overlay — always on top, never blocks interaction */}
      <img
        src="/assets/phone_1.png"
        alt="Phone frame"
        draggable={false}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 10, objectFit: 'contain' }}
      />
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
  const [newFileUrl, setNewFileUrl] = useState<string | null>(null);
  const [altText, setAltText] = useState(existingImage?.alt_text ?? '');
  const [panZoom, setPanZoom] = useState<PanZoom>(DEFAULT_PANZOOM);
  const [exporting, setExporting] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // What to show in the preview panel:
  // - newFileUrl: user just picked a new file → show with pan/zoom (WYSIWYG)
  // - existingImage.image_url: editing mode, no new file → show saved image as-is (already processed)
  const previewUrl = newFileUrl ?? existingImage?.image_url ?? null;
  const isNewFile = !!newFileUrl;

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setNewFileUrl(URL.createObjectURL(file));
    setPanZoom(DEFAULT_PANZOOM);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleFileSelect(file);
  };

  const exportAndSave = async () => {
    if (!user) return;
    if (!altText.trim()) { showToast('Vul een omschrijving in', 'error'); return; }

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
      /*
        Export canvas: EXPORT_W × EXPORT_H (1080 × 2018).
        This exactly matches the phone screen aspect ratio so the image
        fills the screen area with no letterboxing when displayed with object-cover.

        The preview shows the image with CSS object-cover + pan/zoom transforms.
        We replicate the same cover + transform on the canvas:

        1. Load the image and compute cover dimensions for 1080×2018.
        2. Apply pan offset (scaled from preview px → canvas px).
        3. Apply zoom scale.
        4. Draw and export.

        Preview screen area:
          previewW = 260, phoneH = 260*2 = 520
          sw = Math.round(260 * 0.864) = 225
          sh = Math.round(520 * 0.807) = 420

        Scale from preview to canvas:
          scaleX = EXPORT_W / sw  (1080 / 225 ≈ 4.8)
          scaleY = EXPORT_H / sh  (2018 / 420 ≈ 4.8)
        They're approximately equal (screen aspect ratio is consistent).
        Use the average for pan scaling.
      */
      const previewW   = 260;
      const previewH   = Math.round(previewW * PHONE_IMG_ASPECT);
      const sw         = Math.round(previewW * SCREEN_WIDTH_FRAC);
      const sh         = Math.round(previewH * SCREEN_HEIGHT_FRAC);
      const scaleX     = EXPORT_W / sw;
      const scaleY     = EXPORT_H / sh;

      const img = await createImageBitmap(selectedFile);
      const canvas = document.createElement('canvas');
      canvas.width  = EXPORT_W;
      canvas.height = EXPORT_H;
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, EXPORT_W, EXPORT_H);

      // Compute cover dimensions: scale image to cover canvas at zoom=1
      const imgAspect  = img.width / img.height;
      const canvAspect = EXPORT_W / EXPORT_H;
      let drawW: number, drawH: number;
      if (imgAspect > canvAspect) {
        // Image is wider → fit height, overflow width
        drawH = EXPORT_H;
        drawW = drawH * imgAspect;
      } else {
        // Image is taller → fit width, overflow height
        drawW = EXPORT_W;
        drawH = drawW / imgAspect;
      }

      // Apply zoom and pan transforms (same logic as CSS transform on preview)
      const cx = EXPORT_W / 2 + panZoom.x * scaleX;
      const cy = EXPORT_H / 2 + panZoom.y * scaleY;
      ctx.translate(cx, cy);
      ctx.scale(panZoom.zoom, panZoom.zoom);
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

      const blob: Blob = await new Promise(res => canvas.toBlob(b => res(b!), 'image/jpeg', 0.95));
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
  const PREVIEW_W = 240;

  const zoomPresets = [1, 1.25, 1.5, 2];

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-center bg-tielo-navy/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-5xl bg-white flex flex-col md:flex-row shadow-2xl md:my-6 md:mx-4 md:rounded-td overflow-hidden"
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-tielo-steel/20 md:hidden">
          <h2 className="text-lg font-bold font-rubik text-tielo-navy">
            {isEditing ? 'Foto Bewerken' : 'Nieuwe Foto'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-tielo-orange/10 rounded-td transition-colors">
            <X className="w-5 h-5 text-tielo-navy" />
          </button>
        </div>

        {/* Controls panel */}
        <div className="w-full md:w-[300px] border-b md:border-b-0 md:border-r border-tielo-steel/20 flex flex-col overflow-y-auto flex-shrink-0">
          <div className="hidden md:flex items-center justify-between px-6 py-5 border-b border-tielo-steel/20">
            <h2 className="text-xl font-bold font-rubik text-tielo-navy">
              {isEditing ? 'Foto Bewerken' : 'Nieuwe Foto'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-tielo-orange/10 rounded-td transition-colors">
              <X className="w-5 h-5 text-tielo-navy" />
            </button>
          </div>

          <div className="p-6 space-y-5 flex-1">
            {/* File picker — supports drag & drop */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setIsDraggingFile(true); }}
              onDragLeave={() => setIsDraggingFile(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-td p-5 text-center cursor-pointer transition-all group ${
                isDraggingFile
                  ? 'border-tielo-orange bg-tielo-orange/10 scale-[1.01]'
                  : selectedFile
                  ? 'border-tielo-orange bg-tielo-orange/5'
                  : 'border-tielo-steel/40 hover:border-tielo-orange hover:bg-tielo-orange/5'
              }`}
            >
              <div className="p-2.5 bg-tielo-orange/10 rounded-td w-fit mx-auto mb-2 group-hover:bg-tielo-orange/20 transition-colors">
                <Upload className="w-5 h-5 text-tielo-orange" />
              </div>
              <p className="text-sm font-bold text-tielo-navy leading-snug">
                {isDraggingFile
                  ? 'Laat los om te uploaden'
                  : selectedFile
                  ? selectedFile.name
                  : isEditing
                  ? 'Nieuwe foto uploaden'
                  : 'Klik of sleep een foto hier'}
              </p>
              {isEditing && !selectedFile && (
                <p className="text-xs text-tielo-navy/40 mt-1">Laat leeg om huidige foto te behouden</p>
              )}
              <p className="text-[11px] text-tielo-navy/40 mt-1">PNG, JPG of WebP</p>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleInputChange} className="hidden" />
            </div>

            {/* Alt text */}
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

            {/* Zoom/pan controls — only for newly selected files */}
            {isNewFile && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-tielo-navy/60 uppercase tracking-wide">Uitsnede</label>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setPanZoom(p => ({ ...p, zoom: parseFloat(Math.max(1, p.zoom - 0.1).toFixed(2)) }))}
                      className="p-1.5 rounded-td border border-tielo-steel/20 hover:border-tielo-orange/50 hover:bg-tielo-orange/5 text-tielo-navy/50 hover:text-tielo-orange transition-all"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-bold text-tielo-navy w-12 text-center tabular-nums">
                      {panZoom.zoom.toFixed(2)}x
                    </span>
                    <button
                      onClick={() => setPanZoom(p => ({ ...p, zoom: parseFloat(Math.min(4, p.zoom + 0.1).toFixed(2)) }))}
                      className="p-1.5 rounded-td border border-tielo-steel/20 hover:border-tielo-orange/50 hover:bg-tielo-orange/5 text-tielo-navy/50 hover:text-tielo-orange transition-all"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setPanZoom(DEFAULT_PANZOOM)}
                      className="p-1.5 rounded-td border border-tielo-steel/20 hover:border-tielo-orange/50 hover:bg-tielo-orange/5 text-tielo-navy/30 hover:text-tielo-orange transition-all"
                      title="Reset naar standaard"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <input
                  type="range"
                  min={1}
                  max={4}
                  step={0.01}
                  value={panZoom.zoom}
                  onChange={e => setPanZoom(p => ({ ...p, zoom: Number(e.target.value) }))}
                  className="w-full h-2 appearance-none bg-tielo-steel/20 rounded-full accent-tielo-orange cursor-pointer"
                />

                <div className="grid grid-cols-4 gap-1.5 text-center">
                  {zoomPresets.map(z => (
                    <button
                      key={z}
                      onClick={() => setPanZoom(p => ({ ...p, zoom: z }))}
                      className={`text-xs font-bold py-1.5 rounded-td border transition-all ${
                        Math.abs(panZoom.zoom - z) < 0.04
                          ? 'border-tielo-orange bg-tielo-orange/10 text-tielo-orange'
                          : 'border-tielo-steel/20 text-tielo-navy/50 hover:border-tielo-orange/40 hover:text-tielo-orange'
                      }`}
                    >
                      {z}x
                    </button>
                  ))}
                </div>

                <div className="bg-tielo-offwhite rounded-td p-3 text-xs text-tielo-navy/50 leading-relaxed space-y-1">
                  <p><span className="font-bold text-tielo-navy/70">Exportformaat:</span> {EXPORT_W} × {EXPORT_H} px</p>
                  <p className="text-tielo-navy/40">De preview is 1:1 — wat je ziet wordt exact opgeslagen.</p>
                </div>
              </div>
            )}

            {/* Existing image info — shown when editing without a new upload */}
            {!isNewFile && existingImage && (
              <div className="bg-tielo-offwhite rounded-td p-3 text-xs text-tielo-navy/50 leading-relaxed space-y-1">
                <p className="font-bold text-tielo-navy/70 mb-1">Foto wijzigen</p>
                <p>Upload een nieuwe foto om de uitsnede aan te passen. Laat leeg om alleen de omschrijving op te slaan.</p>
              </div>
            )}

            {/* Tips — only when nothing is loaded yet */}
            {!previewUrl && (
              <div className="bg-tielo-offwhite rounded-td p-3 text-xs text-tielo-navy/50 leading-relaxed space-y-1">
                <p className="font-bold text-tielo-navy/70 mb-1">Tips voor de beste uitsnede</p>
                <p>Gebruik een <strong>portretfoto</strong> (hoger dan breed) voor het mooiste resultaat in het telefoon-frame.</p>
                <p>Sleep de foto na upload om de uitsnede te bepalen.</p>
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
                <><Loader2 className="w-4 h-4 animate-spin" />Opslaan...</>
              ) : (
                <><Download className="w-4 h-4" />{selectedFile ? 'Exporteren & Opslaan' : 'Opslaan'}</>
              )}
            </button>
          </div>
        </div>

        {/* Preview panel */}
        <div className="flex-1 bg-[#f0f0ee] flex flex-col items-center justify-center p-8 min-h-[560px]">
          <p className="text-xs font-bold text-tielo-navy/40 uppercase tracking-widest mb-6">
            Live Preview
          </p>
          <DraggablePhonePreview
            imageUrl={previewUrl}
            panZoom={panZoom}
            onChange={setPanZoom}
            width={PREVIEW_W}
            readonly={!isNewFile}
          />
          {previewUrl && isNewFile && (
            <p className="text-[10px] text-tielo-navy/30 mt-4 text-center">
              De uitsnede in het schermgebied is exact wat wordt opgeslagen
            </p>
          )}
          {previewUrl && !isNewFile && (
            <p className="text-[10px] text-tielo-navy/30 mt-4 text-center">
              Huidige opgeslagen foto — upload een nieuwe om aan te passen
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Thumbnail used in the image list ─────────────────────────────────────── */
function PhoneThumbnail({ image, onClick }: { image: PhoneImage; onClick?: () => void }) {
  const W = 64;
  const phoneH = Math.round(W * PHONE_IMG_ASPECT);
  const sw = Math.round(W * SCREEN_WIDTH_FRAC);
  const sh = Math.round(phoneH * SCREEN_HEIGHT_FRAC);
  const sx = Math.round(W * SCREEN_LEFT_FRAC);
  const sy = Math.round(phoneH * SCREEN_TOP_FRAC);

  return (
    <div
      className="relative flex-shrink-0 cursor-pointer group"
      style={{ width: W, height: phoneH }}
      onClick={onClick}
    >
      <div
        className="absolute overflow-hidden bg-gray-900"
        style={{ left: sx, top: sy, width: sw, height: sh }}
      >
        <img
          src={image.image_url}
          alt={image.alt_text}
          className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
          style={{ opacity: image.active ? 1 : 0.4 }}
        />
      </div>
      <img
        src="/assets/phone_1.png"
        alt=""
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 10, objectFit: 'contain' }}
      />
      {onClick && (
        <div className="absolute inset-0 rounded bg-tielo-navy/0 group-hover:bg-tielo-navy/20 transition-colors z-20 flex items-center justify-center">
          <Pencil className="w-3 h-3 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}
    </div>
  );
}

/* ─── Sidebar preview card thumbnail ───────────────────────────────────────── */
function PhoneSidebarThumb({ image, onClick }: { image: PhoneImage; onClick: () => void }) {
  const W = 110;
  const phoneH = Math.round(W * PHONE_IMG_ASPECT);
  const sw = Math.round(W * SCREEN_WIDTH_FRAC);
  const sh = Math.round(phoneH * SCREEN_HEIGHT_FRAC);
  const sx = Math.round(W * SCREEN_LEFT_FRAC);
  const sy = Math.round(phoneH * SCREEN_TOP_FRAC);

  return (
    <div className="flex flex-col items-center cursor-pointer group" onClick={onClick}>
      <div className="relative" style={{ width: W, height: phoneH }}>
        <div className="absolute overflow-hidden bg-gray-900" style={{ left: sx, top: sy, width: sw, height: sh }}>
          <img src={image.image_url} alt={image.alt_text} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform" />
        </div>
        <img src="/assets/phone_1.png" alt="" className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10, objectFit: 'contain' }} />
        <div className="absolute inset-0 bg-tielo-navy/0 group-hover:bg-tielo-navy/15 transition-colors rounded z-20" />
      </div>
      <p className="text-xs text-tielo-navy/50 text-center mt-1.5 truncate max-w-[110px]">{image.alt_text}</p>
    </div>
  );
}

/* ─── Image list row ────────────────────────────────────────────────────────── */
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

      <PhoneThumbnail image={image} onClick={onEdit} />

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
              <h3 className="text-sm font-bold font-rubik text-tielo-navy mb-4">Actieve Foto's</h3>
              {activeImages.length > 0 ? (
                <div className="flex flex-col items-center gap-4">
                  {activeImages.slice(0, 3).map(img => (
                    <PhoneSidebarThumb key={img.id} image={img} onClick={() => setPreviewImage(img)} />
                  ))}
                  {activeImages.length > 3 && (
                    <p className="text-xs text-tielo-navy/40">+{activeImages.length - 3} meer</p>
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
                Foto's worden opgeslagen als <strong className="text-tielo-navy/70">{EXPORT_W} × {EXPORT_H} px</strong> — exact de verhouding van het telefoon-schermgebied.
              </p>
              <p className="text-xs text-tielo-navy/40 leading-relaxed">
                Dit zorgt ervoor dat de foto altijd perfect in het frame past zonder bij te snijden of letterboxing.
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

      {/* Full-screen preview modal */}
      <AnimatePresence>
        {previewImage && (() => {
          const W = 280;
          const pH = Math.round(W * PHONE_IMG_ASPECT);
          const sw = Math.round(W * SCREEN_WIDTH_FRAC);
          const sh = Math.round(pH * SCREEN_HEIGHT_FRAC);
          const sx = Math.round(W * SCREEN_LEFT_FRAC);
          const sy = Math.round(pH * SCREEN_TOP_FRAC);
          return (
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
                <div className="relative" style={{ width: W, height: pH }}>
                  <div className="absolute overflow-hidden bg-gray-900" style={{ left: sx, top: sy, width: sw, height: sh }}>
                    <img src={previewImage.image_url} alt={previewImage.alt_text} className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <img src="/assets/phone_1.png" alt="" className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10, objectFit: 'contain' }} />
                </div>
                <p className="text-white/80 text-center mt-3 text-sm font-medium">{previewImage.alt_text}</p>
                <button
                  onClick={() => setPreviewImage(null)}
                  className="absolute -top-3 -right-3 bg-white rounded-full p-1.5 shadow-xl hover:bg-gray-100 transition-colors z-20"
                >
                  <X className="w-4 h-4 text-tielo-navy" />
                </button>
              </motion.div>
            </motion.div>
          );
        })()}
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
