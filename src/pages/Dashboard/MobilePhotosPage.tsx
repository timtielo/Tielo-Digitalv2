import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, Trash2, Eye, EyeOff, GripVertical, Plus, Image as ImageIcon, Loader2, X, RotateCcw } from 'lucide-react';
import { supabase } from '../../lib/supabase/client';
import { useAuth } from '../../contexts/AuthContext';
import { ProtectedRoute } from '../../components/Dashboard/ProtectedRoute';
import { DashboardLayout } from '../../components/Dashboard/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { useToast } from '../../components/ui/Toast';

const CANVAS_SIZE = 2000;
const RECT_W = 914;
const RECT_H = 1847;
const RECT_X = (CANVAS_SIZE - RECT_W) / 2;
const RECT_Y = (CANVAS_SIZE - RECT_H) / 2;
const CORNER_RADIUS = 80;

interface PhoneImage {
  id: string;
  image_url: string;
  alt_text: string;
  sort_order: number;
  active: boolean;
  created_at: string;
}

interface EditorState {
  zoom: number;
  panX: number;
  panY: number;
  rotation: number;
  brightness: number;
  contrast: number;
  saturation: number;
}

const defaultEditor: EditorState = {
  zoom: 1,
  panX: 0,
  panY: 0,
  rotation: 0,
  brightness: 100,
  contrast: 100,
  saturation: 100,
};

function SliderControl({
  label, value, min, max, step = 1, unit = '', onChange, onReset,
}: {
  label: string; value: number; min: number; max: number;
  step?: number; unit?: string; onChange: (v: number) => void; onReset: () => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-tielo-navy/60 uppercase tracking-wide">{label}</label>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-tielo-navy tabular-nums">{value}{unit}</span>
          <button onClick={onReset} className="p-0.5 hover:text-tielo-orange text-tielo-navy/30 transition-colors">
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 appearance-none bg-tielo-steel/30 rounded-full accent-tielo-orange cursor-pointer"
      />
    </div>
  );
}

function PhonePreview({ imageUrl, editorState }: { imageUrl: string | null; editorState: EditorState }) {
  const { zoom, panX, panY, rotation, brightness, contrast, saturation } = editorState;

  return (
    <div className="relative mx-auto" style={{ width: 220, height: 220 }}>
      <div className="absolute inset-0 overflow-hidden rounded-xl bg-gray-100">
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Preview"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              transform: `translate(${panX}px, ${panY}px) scale(${zoom}) rotate(${rotation}deg)`,
              filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
              transformOrigin: 'center center',
            }}
          />
        )}
        {!imageUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageIcon className="w-10 h-10 text-gray-300" />
          </div>
        )}
      </div>
      <img
        src="/assets/phone_1.png"
        alt="Phone frame"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ zIndex: 10 }}
      />
    </div>
  );
}

function PhotoEditor({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: () => void;
}) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [altText, setAltText] = useState('');
  const [editor, setEditor] = useState<EditorState>(defaultEditor);
  const [exporting, setExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setEditor(defaultEditor);
  };

  const set = (key: keyof EditorState) => (v: number) =>
    setEditor(prev => ({ ...prev, [key]: v }));

  const reset = (key: keyof EditorState) => () =>
    setEditor(prev => ({ ...prev, [key]: defaultEditor[key] }));

  const drawRoundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
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
  };

  const exportAndUpload = async () => {
    if (!selectedFile || !user) return;
    if (!altText.trim()) {
      showToast('Vul een alt-tekst in', 'error');
      return;
    }

    setExporting(true);
    try {
      const img = await createImageBitmap(selectedFile);
      const canvas = document.createElement('canvas');
      canvas.width = CANVAS_SIZE;
      canvas.height = CANVAS_SIZE;
      const ctx = canvas.getContext('2d')!;

      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      const { zoom, panX, panY, rotation, brightness, contrast, saturation } = editor;
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;

      drawRoundedRect(ctx, RECT_X, RECT_Y, RECT_W, RECT_H, CORNER_RADIUS);
      ctx.save();
      ctx.clip();

      const cx = CANVAS_SIZE / 2;
      const cy = CANVAS_SIZE / 2;
      ctx.translate(cx + panX * (CANVAS_SIZE / 220), cy + panY * (CANVAS_SIZE / 220));
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);

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

      const blob: Blob = await new Promise(resolve => canvas.toBlob(b => resolve(b!), 'image/png'));
      const filename = `${user.id}/${Date.now()}.png`;

      const { error: uploadError } = await supabase.storage
        .from('hero-images')
        .upload(filename, blob, { contentType: 'image/png', upsert: false });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('hero-images').getPublicUrl(filename);
      const publicUrl = urlData.publicUrl;

      const { data: maxOrder } = await supabase
        .from('hero_phone_images')
        .select('sort_order')
        .eq('user_id', user.id)
        .order('sort_order', { ascending: false })
        .limit(1)
        .maybeSingle();

      const nextOrder = (maxOrder?.sort_order ?? -1) + 1;

      const { error: insertError } = await supabase.from('hero_phone_images').insert({
        user_id: user.id,
        image_url: publicUrl,
        alt_text: altText.trim(),
        sort_order: nextOrder,
        active: true,
      });

      if (insertError) throw insertError;

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

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto bg-tielo-navy/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-3xl my-8 bg-white rounded-td shadow-2xl"
      >
        <div className="flex items-center justify-between p-6 border-b border-tielo-steel/20">
          <h2 className="text-xl font-bold font-rubik text-tielo-navy">Foto Bewerken & Uploaden</h2>
          <button onClick={onClose} className="p-2 hover:bg-tielo-orange/10 rounded-td transition-colors">
            <X className="w-5 h-5 text-tielo-navy" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-tielo-steel/40 hover:border-tielo-orange rounded-td p-8 text-center cursor-pointer transition-colors group"
            >
              <div className="p-3 bg-tielo-orange/10 rounded-td w-fit mx-auto mb-3 group-hover:bg-tielo-orange/20 transition-colors">
                <Upload className="w-6 h-6 text-tielo-orange" />
              </div>
              <p className="text-sm font-bold text-tielo-navy">
                {selectedFile ? selectedFile.name : 'Klik om foto te selecteren'}
              </p>
              <p className="text-xs text-tielo-navy/40 mt-1">PNG, JPG of WebP</p>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            </div>

            <div>
              <label className="text-xs font-bold text-tielo-navy/60 uppercase tracking-wide block mb-1.5">
                Alt-tekst *
              </label>
              <input
                type="text"
                value={altText}
                onChange={e => setAltText(e.target.value)}
                placeholder="Beschrijf de afbeelding..."
                className="w-full px-3 py-2.5 text-sm border border-tielo-steel/30 rounded-td bg-tielo-offwhite focus:outline-none focus:border-tielo-orange transition-colors text-tielo-navy placeholder-tielo-navy/30"
              />
            </div>

            <div className="bg-tielo-offwhite rounded-td p-4 space-y-4">
              <p className="text-xs font-bold text-tielo-navy/50 uppercase tracking-widest">Bewerkingen</p>

              <SliderControl label="Zoom" value={editor.zoom} min={0.5} max={3} step={0.05} unit="x"
                onChange={set('zoom')} onReset={reset('zoom')} />
              <SliderControl label="Pan X" value={editor.panX} min={-200} max={200} unit="px"
                onChange={set('panX')} onReset={reset('panX')} />
              <SliderControl label="Pan Y" value={editor.panY} min={-200} max={200} unit="px"
                onChange={set('panY')} onReset={reset('panY')} />
              <SliderControl label="Rotatie" value={editor.rotation} min={-45} max={45} unit="°"
                onChange={set('rotation')} onReset={reset('rotation')} />
              <SliderControl label="Helderheid" value={editor.brightness} min={0} max={200} unit="%"
                onChange={set('brightness')} onReset={reset('brightness')} />
              <SliderControl label="Contrast" value={editor.contrast} min={0} max={200} unit="%"
                onChange={set('contrast')} onReset={reset('contrast')} />
              <SliderControl label="Verzadiging" value={editor.saturation} min={0} max={200} unit="%"
                onChange={set('saturation')} onReset={reset('saturation')} />
            </div>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div>
              <p className="text-xs font-bold text-tielo-navy/50 uppercase tracking-widest mb-3 text-center">Live Preview</p>
              <PhonePreview imageUrl={previewUrl} editorState={editor} />
            </div>

            <div className="w-full bg-tielo-offwhite rounded-td p-4">
              <p className="text-xs font-bold text-tielo-navy/50 uppercase tracking-widest mb-2">Exportformaat</p>
              <p className="text-xs text-tielo-navy/60 leading-relaxed">
                2000 × 2000 px PNG met transparante achtergrond.<br />
                Foto wordt geclipped in een 914 × 1847 px portret-rechthoek met afgeronde hoeken (r=80px).
              </p>
            </div>

            <button
              onClick={exportAndUpload}
              disabled={!selectedFile || exporting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-tielo-orange hover:bg-tielo-orange/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-td transition-all shadow-md"
            >
              {exporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Exporteren & Uploaden...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Exporteren & Uploaden
                </>
              )}
            </button>
          </div>
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </motion.div>
    </div>
  );
}

function ImageCard({
  image,
  onToggle,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  image: PhoneImage;
  onToggle: () => void;
  onDelete: () => void;
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
      <div className="flex flex-col gap-1">
        <button onClick={onMoveUp} disabled={isFirst} className="p-1 rounded hover:bg-tielo-orange/10 text-tielo-navy/40 hover:text-tielo-orange disabled:opacity-20 transition-colors">
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor"><path d="M6 2l4 5H2l4-5z" /></svg>
        </button>
        <button onClick={onMoveDown} disabled={isLast} className="p-1 rounded hover:bg-tielo-orange/10 text-tielo-navy/40 hover:text-tielo-orange disabled:opacity-20 transition-colors">
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor"><path d="M6 10L2 5h8l-4 5z" /></svg>
        </button>
      </div>

      <div className="relative w-16 h-16 flex-shrink-0 rounded-td overflow-hidden bg-gray-100">
        <img
          src={image.image_url}
          alt={image.alt_text}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: image.active ? 1 : 0.4 }}
        />
        <img
          src="/assets/phone_1.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-tielo-navy truncate">{image.alt_text || 'Geen beschrijving'}</p>
        <p className="text-xs text-tielo-navy/40 mt-0.5">Volgorde: {image.sort_order + 1}</p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onToggle}
          title={image.active ? 'Verbergen' : 'Tonen'}
          className="p-2 rounded-td border border-tielo-steel/20 hover:border-tielo-orange/40 hover:bg-tielo-orange/5 text-tielo-navy/50 hover:text-tielo-orange transition-all"
        >
          {image.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
        <button
          onClick={onDelete}
          title="Verwijderen"
          className="p-2 rounded-td border border-red-200 hover:bg-red-50 text-red-400 hover:text-red-600 transition-all"
        >
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
  const [showEditor, setShowEditor] = useState(false);

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
    } catch (err: any) {
      showToast('Fout bij laden van foto\'s', 'error');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const toggleActive = async (image: PhoneImage) => {
    try {
      const { error } = await supabase
        .from('hero_phone_images')
        .update({ active: !image.active })
        .eq('id', image.id);
      if (error) throw error;
      setImages(prev => prev.map(i => i.id === image.id ? { ...i, active: !i.active } : i));
    } catch {
      showToast('Fout bij bijwerken', 'error');
    }
  };

  const deleteImage = async (image: PhoneImage) => {
    if (!confirm(`Weet je zeker dat je "${image.alt_text}" wilt verwijderen?`)) return;
    try {
      const { error } = await supabase
        .from('hero_phone_images')
        .delete()
        .eq('id', image.id);
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
      await Promise.all(
        updated.map(img =>
          supabase.from('hero_phone_images').update({ sort_order: img.sort_order }).eq('id', img.id)
        )
      );
    } catch {
      showToast('Fout bij opslaan volgorde', 'error');
      fetchImages();
    }
  };

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
              onClick={() => setShowEditor(true)}
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
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold font-rubik text-tielo-navy">
                Geüploade Foto's
                <span className="ml-2 text-sm font-normal text-tielo-navy/40">({images.length})</span>
              </h2>
            </div>

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
                  onClick={() => setShowEditor(true)}
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
              <h3 className="text-sm font-bold font-rubik text-tielo-navy mb-3">Telefoon Preview</h3>
              <PhonePreview
                imageUrl={images.find(i => i.active)?.image_url || null}
                editorState={defaultEditor}
              />
              <p className="text-xs text-tielo-navy/40 text-center mt-3">
                Eerste actieve foto wordt getoond
              </p>
            </Card>

            <Card className="td-card p-5 space-y-3">
              <h3 className="text-sm font-bold font-rubik text-tielo-navy">Afbeeldingsformaat</h3>
              <div className="space-y-2 text-xs text-tielo-navy/60 leading-relaxed">
                <div className="flex justify-between">
                  <span className="font-bold">Canvas</span>
                  <span>2000 × 2000 px</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Foto-gebied</span>
                  <span>914 × 1847 px</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Hoekradius</span>
                  <span>80 px</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Formaat</span>
                  <span>PNG (transparant)</span>
                </div>
              </div>
            </Card>

            <Card className="td-card p-5">
              <h3 className="text-sm font-bold font-rubik text-tielo-navy mb-2">Statistieken</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-tielo-offwhite rounded-td p-3 text-center">
                  <p className="text-2xl font-bold font-rubik text-tielo-navy">{images.length}</p>
                  <p className="text-[10px] uppercase font-bold text-tielo-navy/40 tracking-wide mt-0.5">Totaal</p>
                </div>
                <div className="bg-tielo-offwhite rounded-td p-3 text-center">
                  <p className="text-2xl font-bold font-rubik text-tielo-navy">{images.filter(i => i.active).length}</p>
                  <p className="text-[10px] uppercase font-bold text-tielo-navy/40 tracking-wide mt-0.5">Actief</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {showEditor && (
        <PhotoEditor
          onClose={() => setShowEditor(false)}
          onSaved={fetchImages}
        />
      )}
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
