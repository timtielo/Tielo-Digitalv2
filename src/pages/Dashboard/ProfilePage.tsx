import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Upload, Loader2, Camera, Building2, Shield } from 'lucide-react';
import { ProtectedRoute } from '../../components/Dashboard/ProtectedRoute';
import { AuroraBackground } from '../../components/ui/aurora-bento-grid';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { supabase } from '../../lib/supabase/client';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';

interface UserProfile {
  id: string;
  name: string;
  business_name: string;
  profile_picture: string | null;
  profile_picture_url: string | null;
  business_type: 'bouw' | 'basis';
  is_admin: boolean;
}

function ProfileContent() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    business_name: '',
    profile_picture_url: '',
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setProfile(data);
        setFormData({
          name: data.name || '',
          business_name: data.business_name || '',
          profile_picture_url: data.profile_picture_url || '',
        });
        if (data.profile_picture_url) {
          setImagePreview(data.profile_picture_url);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      showToast('Fout bij laden van profiel', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
      };
      img.src = e.target?.result as string;
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    uploadImage(file);
  };

  const uploadImage = async (file: File) => {
    if (!user) return;

    setUploading(true);
    try {
      if (formData.profile_picture_url) {
        const oldPath = formData.profile_picture_url.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('profile-pictures')
            .remove([`${user.id}/${oldPath}`]);
        }
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(fileName);

      setFormData(prev => ({
        ...prev,
        profile_picture_url: publicUrl,
      }));
      showToast('Profielfoto succesvol geüpload', 'success');
    } catch (error) {
      console.error('Error uploading image:', error);
      showToast('Fout bij uploaden van profielfoto', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      if (profile) {
        const { error } = await supabase
          .from('user_profiles')
          .update({
            name: formData.name,
            business_name: formData.business_name,
            profile_picture_url: formData.profile_picture_url,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);

        if (error) throw error;
        showToast('Profiel succesvol bijgewerkt', 'success');
      } else {
        const { error } = await supabase
          .from('user_profiles')
          .insert([{
            id: user.id,
            name: formData.name,
            business_name: formData.business_name,
            profile_picture_url: formData.profile_picture_url,
          }]);

        if (error) throw error;
        showToast('Profiel succesvol aangemaakt', 'success');
      }

      fetchProfile();
    } catch (error) {
      console.error('Error saving profile:', error);
      showToast('Fout bij opslaan van profiel', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!user || !formData.profile_picture_url) return;

    try {
      const oldPath = formData.profile_picture_url.split('/').pop();
      if (oldPath) {
        await supabase.storage
          .from('profile-pictures')
          .remove([`${user.id}/${oldPath}`]);
      }

      setFormData(prev => ({ ...prev, profile_picture_url: '' }));
      setImagePreview('');
      setImageDimensions(null);
      showToast('Profielfoto verwijderd', 'success');
    } catch (error) {
      console.error('Error removing image:', error);
      showToast('Fout bij verwijderen van profielfoto', 'error');
    }
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
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Mijn Profiel</h1>
              <p className="text-gray-300">Beheer je persoonlijke gegevens en bedrijfsinformatie</p>
            </div>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden"
              >
                <div className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="flex flex-col items-center gap-6 pb-8 border-b border-white/10">
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="relative"
                      >
                        {imagePreview || formData.profile_picture_url ? (
                          <div className="relative group">
                            <img
                              src={imagePreview || formData.profile_picture_url}
                              alt="Profielfoto"
                              className="w-32 h-32 rounded-full object-cover border-4 border-white/20"
                            />
                            <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                              <Camera className="h-8 w-8 text-white" />
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleImageSelect(file);
                                  e.target.value = '';
                                }}
                                disabled={uploading}
                              />
                            </label>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-white/30 rounded-full cursor-pointer hover:bg-white/5 transition-colors">
                            <Upload className="h-8 w-8 text-gray-400 mb-1" />
                            <span className="text-xs text-gray-400 text-center px-2">Upload foto</span>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageSelect(file);
                                e.target.value = '';
                              }}
                              disabled={uploading}
                            />
                          </label>
                        )}
                      </motion.div>

                      {uploading && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-2 text-sm text-gray-300"
                        >
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Uploaden...
                        </motion.div>
                      )}

                      {imageDimensions && (
                        <p className="text-xs text-gray-400">
                          Afmetingen: {imageDimensions.width} × {imageDimensions.height}px
                        </p>
                      )}

                      {(imagePreview || formData.profile_picture_url) && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleRemoveImage}
                          className="bg-red-500/20 backdrop-blur-sm border-red-500/30 text-red-400 hover:bg-red-500/30"
                        >
                          Verwijder foto
                        </Button>
                      )}
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="grid md:grid-cols-2 gap-6"
                    >
                      <div>
                        <Label htmlFor="name" className="text-gray-300">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="h-4 w-4" />
                            Naam *
                          </div>
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Bijv. Jan de Vries"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required
                          className="bg-white/5 border-white/20 text-white placeholder-gray-500"
                        />
                      </div>

                      <div>
                        <Label htmlFor="business_name" className="text-gray-300">
                          <div className="flex items-center gap-2 mb-2">
                            <Building2 className="h-4 w-4" />
                            Bedrijfsnaam *
                          </div>
                        </Label>
                        <Input
                          id="business_name"
                          type="text"
                          placeholder="Bijv. Bouwbedrijf De Vries"
                          value={formData.business_name}
                          onChange={(e) =>
                            setFormData({ ...formData, business_name: e.target.value })
                          }
                          required
                          className="bg-white/5 border-white/20 text-white placeholder-gray-500"
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="pt-6 border-t border-white/10"
                    >
                      <div className="flex items-center gap-2 mb-4 text-gray-300">
                        <Shield className="h-5 w-5" />
                        <span className="font-medium">Account Type</span>
                      </div>
                      <div className={`p-6 rounded-2xl border ${
                        profile?.business_type === 'bouw'
                          ? 'bg-gradient-to-br from-blue-500/20 to-cyan-400/20 border-blue-500/30'
                          : 'bg-gradient-to-br from-gray-500/20 to-slate-400/20 border-gray-500/30'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-white text-lg">
                              {profile?.business_type === 'bouw' ? 'Bouw Profiel' : 'Basis Profiel'}
                            </p>
                            <p className="text-sm text-gray-300 mt-2">
                              {profile?.business_type === 'bouw'
                                ? 'Volledige toegang tot alle dashboard functies inclusief Portfolio en Werkspot'
                                : 'Toegang tot Reviews, Leads en Profiel beheer'}
                            </p>
                          </div>
                          <div className={`p-3 rounded-xl ${
                            profile?.business_type === 'bouw'
                              ? 'bg-blue-500/30'
                              : 'bg-gray-500/30'
                          }`}>
                            <Shield className={`h-8 w-8 ${
                              profile?.business_type === 'bouw'
                                ? 'text-blue-300'
                                : 'text-gray-300'
                            }`} />
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-4 pt-4 border-t border-white/10">
                          Neem contact op met een beheerder om je account type te wijzigen.
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex gap-3 pt-6"
                    >
                      <Button
                        type="submit"
                        disabled={saving || uploading}
                        className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 border-0"
                      >
                        {saving ? 'Opslaan...' : 'Profiel Opslaan'}
                      </Button>
                    </motion.div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
