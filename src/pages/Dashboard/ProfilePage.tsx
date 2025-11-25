import React, { useState, useEffect } from 'react';
import { User, Upload, Loader2 } from 'lucide-react';
import { DashboardLayout } from '../../components/Dashboard/DashboardLayout';
import { ProtectedRoute } from '../../components/Dashboard/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
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

export function ProfilePage() {
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
      // Delete old image if exists
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

  return (
    <ProtectedRoute>
      <DashboardLayout currentPage="profile">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mijn Profiel</h1>
            <p className="text-gray-600 mt-1">Beheer je persoonlijke gegevens en bedrijfsinformatie</p>
          </div>

          {loading ? (
            <Card>
              <CardContent className="p-8">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profiel Informatie
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex flex-col items-center gap-4 pb-6 border-b">
                    <div className="relative">
                      {imagePreview || formData.profile_picture_url ? (
                        <div className="space-y-3">
                          <img
                            src={imagePreview || formData.profile_picture_url}
                            alt="Profielfoto"
                            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                          />
                          {imageDimensions && (
                            <p className="text-xs text-gray-600 text-center">
                              {imageDimensions.width} × {imageDimensions.height}px
                            </p>
                          )}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleRemoveImage}
                            className="w-full"
                          >
                            Verwijder foto
                          </Button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-full cursor-pointer hover:bg-gray-50">
                          <Upload className="h-8 w-8 text-gray-400 mb-1" />
                          <span className="text-xs text-gray-500 text-center px-2">Upload foto</span>
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
                    </div>
                    {uploading && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploaden...
                      </div>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Naam *</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Bijv. Jan de Vries"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="business_name">Bedrijfsnaam *</Label>
                      <Input
                        id="business_name"
                        type="text"
                        placeholder="Bijv. Bouwbedrijf De Vries"
                        value={formData.business_name}
                        onChange={(e) =>
                          setFormData({ ...formData, business_name: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Label>Account Type</Label>
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {profile?.business_type === 'bouw' ? 'Bouw Profiel' : 'Basis Profiel'}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {profile?.business_type === 'bouw'
                              ? 'Volledige toegang tot alle dashboard functies inclusief Portfolio en Werkspot'
                              : 'Toegang tot Reviews, Leads en Profiel beheer'}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-3">
                        Neem contact op met een beheerder om je account type te wijzigen.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" disabled={saving || uploading}>
                      {saving ? 'Opslaan...' : 'Profiel Opslaan'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
