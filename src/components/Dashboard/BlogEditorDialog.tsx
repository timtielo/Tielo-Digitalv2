import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Save,
  Eye,
  Upload,
  Loader2,
  Calendar,
  Tag,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/Textarea';
import { Card } from '../ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../ui/Toast';
import { supabase } from '../../lib/supabase/client';
import { RichTextEditor } from './RichTextEditor';
import { TipTapRenderer } from './TipTapRenderer';
import { ImageEditor } from './ImageEditor';

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: any;
  featured_image_url: string | null;
  status: 'draft' | 'published';
  categories: string[];
  author_name?: string;
  author_avatar_url?: string;
  meta_title: string;
  meta_description: string;
  reading_time: number;
  published_at?: string | null;
}

interface BlogEditorDialogProps {
  post: any | null;
  onClose: () => void;
  onSave: () => void;
}

export function BlogEditorDialog({ post, onClose, onSave }: BlogEditorDialogProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showSEO, setShowSEO] = useState(false);
  const [imageEditorOpen, setImageEditorOpen] = useState(false);
  const [imageToEdit, setImageToEdit] = useState<File | null>(null);
  const [imageEditMode, setImageEditMode] = useState<'featured' | 'inline'>('featured');

  const [formData, setFormData] = useState<BlogPost>({
    title: '',
    slug: '',
    excerpt: '',
    content: '{"type":"doc","content":[{"type":"paragraph"}]}',
    featured_image_url: null,
    status: 'draft',
    categories: [],
    meta_title: '',
    meta_description: '',
    reading_time: 5,
  });

  const [categoryInput, setCategoryInput] = useState('');
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  useEffect(() => {
    if (post) {
      setFormData({
        ...post,
        content: typeof post.content === 'string' ? post.content : JSON.stringify(post.content),
      });
    }
    fetchCategories();
  }, [post]);

  useEffect(() => {
    if (!post && formData.title && !formData.slug) {
      generateSlug(formData.title);
    }
  }, [formData.title, post]);

  useEffect(() => {
    calculateReadingTime(formData.content);
  }, [formData.content]);

  const fetchCategories = async () => {
    try {
      const { data } = await supabase
        .from('blog_categories')
        .select('name')
        .eq('user_id', user?.id);

      const uniqueCategories = Array.from(new Set(data?.map(c => c.name) || []));
      setAvailableCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const generateSlug = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setFormData(prev => ({ ...prev, slug }));
  };

  const calculateReadingTime = (content: string) => {
    try {
      const parsed = typeof content === 'string' ? JSON.parse(content) : content;
      const text = JSON.stringify(parsed);
      const words = text.split(/\s+/).length;
      const minutes = Math.max(1, Math.ceil(words / 200));
      setFormData(prev => ({ ...prev, reading_time: minutes }));
    } catch (error) {
      console.error('Error calculating reading time:', error);
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    if (!user) throw new Error('Not authenticated');

    return new Promise((resolve, reject) => {
      setImageToEdit(file);
      setImageEditMode('inline');
      setImageEditorOpen(true);

      const handleEditorSave = async (blob: Blob) => {
        setUploading(true);
        try {
          const fileExt = file.name.split('.').pop() || 'jpg';
          const fileName = `${Date.now()}.${fileExt}`;
          const filePath = `${user.id}/blog/inline/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('blog-images')
            .upload(filePath, blob);

          if (uploadError) throw uploadError;

          const { data } = supabase.storage
            .from('blog-images')
            .getPublicUrl(filePath);

          setImageEditorOpen(false);
          setImageToEdit(null);
          resolve(data.publicUrl);
        } catch (error) {
          reject(error);
        } finally {
          setUploading(false);
        }
      };

      (window as any).__inlineImageEditorSaveHandler = handleEditorSave;
    });
  };

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setImageToEdit(file);
    setImageEditMode('featured');
    setImageEditorOpen(true);
  };

  const handleImageEditorSave = async (blob: Blob) => {
    if (!user) return;

    setUploading(true);
    try {
      if (imageEditMode === 'featured') {
        if (formData.featured_image_url) {
          const oldPath = formData.featured_image_url.split('/').pop();
          if (oldPath) {
            await supabase.storage
              .from('blog-images')
              .remove([`${user.id}/blog/featured/${oldPath}`]);
          }
        }

        const fileExt = imageToEdit?.name.split('.').pop() || 'jpg';
        const fileName = `featured-${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/blog/featured/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('blog-images')
          .upload(filePath, blob);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('blog-images')
          .getPublicUrl(filePath);

        setFormData(prev => ({ ...prev, featured_image_url: data.publicUrl }));
        showToast('Afbeelding geüpload', 'success');
        setImageEditorOpen(false);
        setImageToEdit(null);
      } else if (imageEditMode === 'inline') {
        if ((window as any).__inlineImageEditorSaveHandler) {
          await (window as any).__inlineImageEditorSaveHandler(blob);
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      showToast('Fout bij uploaden afbeelding', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleImageEditorCancel = () => {
    setImageEditorOpen(false);
    setImageToEdit(null);
  };

  const handleAddCategory = async () => {
    if (!categoryInput.trim()) return;

    const newCategory = categoryInput.trim();

    if (!availableCategories.includes(newCategory)) {
      try {
        const slug = newCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        await supabase
          .from('blog_categories')
          .insert([{ user_id: user?.id, name: newCategory, slug }]);

        setAvailableCategories(prev => [...prev, newCategory]);
      } catch (error) {
        console.error('Error creating category:', error);
      }
    }

    if (!formData.categories.includes(newCategory)) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory]
      }));
    }

    setCategoryInput('');
  };

  const handleRemoveCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category)
    }));
  };

  const validatePost = (): boolean => {
    if (!formData.title.trim()) {
      showToast('Titel is verplicht', 'error');
      return false;
    }

    if (!formData.slug.trim()) {
      showToast('Slug is verplicht', 'error');
      return false;
    }

    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(formData.slug)) {
      showToast('Slug mag alleen kleine letters, cijfers en streepjes bevatten', 'error');
      return false;
    }

    return true;
  };

  const handleSaveDraft = async () => {
    if (!validatePost()) return;

    setSaving(true);
    try {
      const postData = {
        ...formData,
        user_id: user?.id,
        status: 'draft' as const,
        published_at: null,
      };

      if (post?.id) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', post.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([postData]);

        if (error) throw error;
      }

      showToast('Concept opgeslagen', 'success');
      onSave();
    } catch (error: any) {
      console.error('Error saving draft:', error);
      if (error.code === '23505') {
        showToast('Een post met deze slug bestaat al', 'error');
      } else {
        showToast('Fout bij opslaan', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!validatePost()) return;

    if (!formData.featured_image_url) {
      if (!confirm('Geen uitgelichte afbeelding ingesteld. Toch publiceren?')) {
        return;
      }
    }

    setSaving(true);
    try {
      const postData = {
        ...formData,
        user_id: user?.id,
        status: 'published' as const,
        published_at: formData.published_at || new Date().toISOString(),
        meta_title: formData.meta_title || formData.title,
        meta_description: formData.meta_description || formData.excerpt,
      };

      if (post?.id) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', post.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([postData]);

        if (error) throw error;
      }

      showToast('Bericht gepubliceerd', 'success');
      onSave();
    } catch (error: any) {
      console.error('Error publishing:', error);
      if (error.code === '23505') {
        showToast('Een post met deze slug bestaat al', 'error');
      } else {
        showToast('Fout bij publiceren', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />

        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="absolute right-0 top-0 h-full w-full md:w-4/5 lg:w-3/4 xl:w-2/3 bg-white shadow-xl overflow-y-auto"
        >
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {post ? 'Bericht bewerken' : 'Nieuw bericht'}
              </h2>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <Button
                variant={activeTab === 'edit' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('edit')}
              >
                <FileText className="h-4 w-4 mr-2" />
                Bewerken
              </Button>
              <Button
                variant={activeTab === 'preview' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('preview')}
              >
                <Eye className="h-4 w-4 mr-2" />
                Voorvertoning
              </Button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'edit' ? (
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">
                        Titel *
                        <span className="text-xs text-gray-500 ml-2">
                          ({formData.title.length}/60)
                        </span>
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Voer een pakkende titel in..."
                        maxLength={60}
                      />
                    </div>

                    <div>
                      <Label htmlFor="slug">
                        URL Slug *
                        <span className="text-xs text-gray-500 ml-2">
                          tielo-digital.nl/blog/{formData.slug}
                        </span>
                      </Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="url-vriendelijke-slug"
                      />
                    </div>

                    <div>
                      <Label htmlFor="excerpt">Samenvatting</Label>
                      <Textarea
                        id="excerpt"
                        value={formData.excerpt}
                        onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                        placeholder="Korte beschrijving van je bericht..."
                        rows={3}
                        maxLength={160}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.excerpt.length}/160 tekens
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="published_at">
                        Publicatiedatum
                        <span className="text-xs text-gray-500 ml-2">
                          (laat leeg voor huidige datum)
                        </span>
                      </Label>
                      <Input
                        id="published_at"
                        type="datetime-local"
                        value={formData.published_at ? new Date(formData.published_at).toISOString().slice(0, 16) : ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          published_at: e.target.value ? new Date(e.target.value).toISOString() : null
                        }))}
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <Label className="mb-2 block">Content</Label>
                  <RichTextEditor
                    content={formData.content}
                    onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                    onImageUpload={handleImageUpload}
                    placeholder="Begin met schrijven..."
                  />
                  <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                    <span>{formData.reading_time} min leestijd</span>
                    {uploading && (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Afbeelding uploaden...
                      </span>
                    )}
                  </div>
                </Card>

                <Card className="p-6">
                  <Label className="mb-3 block">Uitgelichte afbeelding</Label>
                  {formData.featured_image_url ? (
                    <div className="relative">
                      <img
                        src={formData.featured_image_url}
                        alt="Featured"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, featured_image_url: null }))}
                        className="absolute top-2 right-2 bg-white"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <Upload className="h-12 w-12 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Klik om afbeelding te uploaden</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFeaturedImageUpload}
                        disabled={uploading}
                      />
                    </label>
                  )}
                </Card>

                <Card className="p-6">
                  <Label className="mb-3 block">Categorieën</Label>
                  <div className="flex gap-2 mb-3">
                    <Input
                      value={categoryInput}
                      onChange={(e) => setCategoryInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                      placeholder="Voeg categorie toe..."
                    />
                    <Button onClick={handleAddCategory} type="button">
                      <Tag className="h-4 w-4 mr-2" />
                      Toevoegen
                    </Button>
                  </div>

                  {availableCategories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {availableCategories.map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            if (formData.categories.includes(cat)) {
                              handleRemoveCategory(cat);
                            } else {
                              setFormData(prev => ({ ...prev, categories: [...prev.categories, cat] }));
                            }
                          }}
                          className={`px-3 py-1 rounded-full text-sm ${
                            formData.categories.includes(cat)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}

                  {formData.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.categories.map(cat => (
                        <span key={cat} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-full text-sm">
                          {cat}
                          <button
                            type="button"
                            onClick={() => handleRemoveCategory(cat)}
                            className="hover:bg-blue-700 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </Card>

                <Card className="p-6">
                  <button
                    type="button"
                    onClick={() => setShowSEO(!showSEO)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <Label className="cursor-pointer">SEO Instellingen</Label>
                    <span className="text-sm text-gray-500">
                      {showSEO ? 'Verbergen' : 'Tonen'}
                    </span>
                  </button>

                  {showSEO && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <Label htmlFor="meta_title">
                          Meta titel
                          <span className={`text-xs ml-2 ${
                            formData.meta_title.length > 60 ? 'text-red-500' :
                            formData.meta_title.length > 50 ? 'text-amber-500' : 'text-green-500'
                          }`}>
                            ({formData.meta_title.length}/60)
                          </span>
                        </Label>
                        <Input
                          id="meta_title"
                          value={formData.meta_title}
                          onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                          placeholder={formData.title || 'SEO titel...'}
                          maxLength={60}
                        />
                      </div>

                      <div>
                        <Label htmlFor="meta_description">
                          Meta beschrijving
                          <span className={`text-xs ml-2 ${
                            formData.meta_description.length > 160 ? 'text-red-500' :
                            formData.meta_description.length > 140 ? 'text-amber-500' : 'text-green-500'
                          }`}>
                            ({formData.meta_description.length}/160)
                          </span>
                        </Label>
                        <Textarea
                          id="meta_description"
                          value={formData.meta_description}
                          onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                          placeholder={formData.excerpt || 'SEO beschrijving...'}
                          rows={3}
                          maxLength={160}
                        />
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto">
                <Card className="p-8">
                  {formData.featured_image_url && (
                    <img
                      src={formData.featured_image_url}
                      alt={formData.title}
                      className="w-full h-96 object-cover rounded-lg mb-8"
                    />
                  )}

                  <h1 className="text-4xl font-bold mb-4">{formData.title || 'Titel'}</h1>

                  {formData.excerpt && (
                    <p className="text-xl text-gray-600 mb-6">{formData.excerpt}</p>
                  )}

                  <div className="flex items-center gap-4 mb-8 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formData.published_at
                        ? new Date(formData.published_at).toLocaleDateString('nl-NL', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : new Date().toLocaleDateString('nl-NL', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                      }
                    </span>
                    <span>{formData.reading_time} min leestijd</span>
                    {formData.categories.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Tag className="h-4 w-4" />
                        {formData.categories.join(', ')}
                      </span>
                    )}
                  </div>

                  <TipTapRenderer content={formData.content} />
                </Card>
              </div>
            )}
          </div>

          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={onClose}>
                Annuleren
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Concept opslaan
                </Button>
                <Button
                  onClick={handlePublish}
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Publiceren
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {imageEditorOpen && imageToEdit && (
        <ImageEditor
          imageFile={imageToEdit}
          aspectRatio={imageEditMode === 'featured' ? '16:9' : '4:3'}
          onSave={handleImageEditorSave}
          onCancel={handleImageEditorCancel}
        />
      )}
    </AnimatePresence>
  );
}
