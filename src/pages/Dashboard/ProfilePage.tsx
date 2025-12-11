import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Upload, Loader2, Camera, Building2, Shield, Lock, Eye, EyeOff } from 'lucide-react';
import { ProtectedRoute } from '../../components/Dashboard/ProtectedRoute';
import { DashboardLayout } from '../../components/Dashboard/DashboardLayout';
import { Card } from '../../components/ui/Card';
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
  important_links?: string;
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
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const linksContainerRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    business_name: '',
    profile_picture_url: '',
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('Wachtwoorden komen niet overeen', 'error');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showToast('Wachtwoord moet minimaal 6 tekens zijn', 'error');
      return;
    }

    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      showToast('Wachtwoord succesvol gewijzigd', 'success');
      setPasswordData({ newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      showToast('Fout bij wijzigen van wachtwoord', 'error');
    } finally {
      setChangingPassword(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  useEffect(() => {
    if (linksContainerRef.current && profile?.important_links) {
      const links = linksContainerRef.current.querySelectorAll('a');
      links.forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      });
    }
  }, [profile?.important_links]);

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

      await fetchProfile();
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

  return (
    <DashboardLayout currentPage="profile">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-6 text-white shadow-xl"
        >
          <h1 className="text-3xl font-bold mb-2">Mijn Profiel</h1>
          <p className="text-blue-100">Beheer je persoonlijke gegevens en bedrijfsinformatie</p>
          <p className="text-sm text-blue-200 mt-2">⚠️ Deze gegevens zijn alleen intern zichtbaar en worden niet publiek getoond</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="overflow-hidden">
                <div className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="flex flex-col items-center gap-6 pb-8 border-b border-gray-200">
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
                              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
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
                          <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-full cursor-pointer hover:bg-gray-50 transition-colors">
                            <Upload className="h-8 w-8 text-gray-400 mb-1" />
                            <span className="text-xs text-gray-600 text-center px-2">Upload foto</span>
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
                          className="flex items-center gap-2 text-sm text-gray-700"
                        >
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Uploaden...
                        </motion.div>
                      )}

                      {imageDimensions && (
                        <p className="text-xs text-gray-600">
                          Afmetingen: {imageDimensions.width} × {imageDimensions.height}px
                        </p>
                      )}

                      {(imagePreview || formData.profile_picture_url) && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleRemoveImage}
                          className="bg-red-50 border-red-300 text-red-700 hover:bg-red-100"
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
                        <Label htmlFor="name" className="text-gray-900">
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
                          className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                        />
                      </div>

                      <div>
                        <Label htmlFor="business_name" className="text-gray-900">
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
                          className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="pt-6 border-t border-gray-200"
                    >
                      <div className="flex items-center gap-2 mb-4 text-gray-700">
                        <Shield className="h-5 w-5" />
                        <span className="font-medium">Account Type</span>
                      </div>
                      <div className={`p-6 rounded-2xl border-2 ${
                        profile?.business_type === 'bouw'
                          ? 'bg-blue-50 border-blue-300'
                          : 'bg-gray-100 border-gray-300'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-gray-900 text-lg">
                              {profile?.business_type === 'bouw' ? 'Bouw Profiel' : 'Basis Profiel'}
                            </p>
                            <p className="text-sm text-gray-700 mt-2">
                              {profile?.business_type === 'bouw'
                                ? 'Volledige toegang tot alle dashboard functies inclusief Portfolio en Werkspot'
                                : 'Toegang tot Reviews, Leads en Profiel beheer'}
                            </p>
                          </div>
                          <div className={`p-3 rounded-xl ${
                            profile?.business_type === 'bouw'
                              ? 'bg-blue-200'
                              : 'bg-gray-300'
                          }`}>
                            <Shield className={`h-8 w-8 ${
                              profile?.business_type === 'bouw'
                                ? 'text-blue-700'
                                : 'text-gray-700'
                            }`} />
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mt-4 pt-4 border-t border-gray-300">
                          Neem contact op met een beheerder om je account type te wijzigen.
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <svg className="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-amber-800">
                            Wijzigingen opslaan
                          </p>
                          <p className="text-sm text-amber-700 mt-1">
                            Vergeet niet om je wijzigingen op te slaan voordat je de pagina verlaat
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex gap-3 pt-4"
                    >
                      <Button
                        type="submit"
                        disabled={saving || uploading}
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border-0 shadow-lg"
                      >
                        {saving ? 'Opslaan...' : 'Profiel Opslaan'}
                      </Button>
                    </motion.div>
                  </form>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <Lock className="h-5 w-5 text-gray-700" />
                    <h3 className="text-2xl font-bold text-gray-900">Wachtwoord Wijzigen</h3>
                  </div>

                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div>
                      <Label htmlFor="new_password" className="text-gray-900">
                        Nieuw Wachtwoord *
                      </Label>
                      <div className="relative">
                        <Input
                          id="new_password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Minimaal 6 tekens"
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, newPassword: e.target.value })
                          }
                          required
                          minLength={6}
                          className="bg-white border-gray-300 text-gray-900 placeholder-gray-500 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="confirm_password" className="text-gray-900">
                        Bevestig Wachtwoord *
                      </Label>
                      <Input
                        id="confirm_password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Herhaal nieuw wachtwoord"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                        }
                        required
                        minLength={6}
                        className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={changingPassword}
                      className="bg-gradient-to-r from-purple-500 to-pink-400 hover:from-purple-600 hover:to-pink-500 border-0"
                    >
                      {changingPassword ? 'Wijzigen...' : 'Wachtwoord Wijzigen'}
                    </Button>
                  </form>
                </div>
              </Card>
            </motion.div>

            {profile?.important_links && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
              >
                <Card className="overflow-hidden bg-white">
                  <div className="p-8 bg-white">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Belangrijke Links</h3>
                    <div
                      ref={linksContainerRef}
                      className="prose max-w-none text-gray-900 bg-white [&_*]:!text-gray-900 [&_a]:!text-blue-600 [&_a]:!underline [&_a:hover]:!text-blue-800 [&_strong]:!text-gray-900 [&_strong]:!font-bold [&_b]:!text-gray-900 [&_b]:!font-bold [&_p]:!text-gray-900 [&_li]:!text-gray-900 [&_span]:!text-gray-900 [&_div]:!text-gray-900 [&_h1]:!text-gray-900 [&_h2]:!text-gray-900 [&_h3]:!text-gray-900 [&_h4]:!text-gray-900 [&_h5]:!text-gray-900 [&_h6]:!text-gray-900 [&_ul]:!text-gray-900 [&_ol]:!text-gray-900"
                      dangerouslySetInnerHTML={{ __html: profile.important_links }}
                    />
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
