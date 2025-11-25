import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Shield, Search, Edit2, Mail, UserPlus, UserCog, Trash2, X, AlertCircle, Bold, Italic, Link as LinkIcon } from 'lucide-react';
import { ProtectedRoute } from '../../components/Dashboard/ProtectedRoute';
import { supabase } from '../../lib/supabase/client';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { AuroraBackground } from '../../components/ui/aurora-bento-grid';

interface UserProfile {
  id: string;
  name: string;
  business_name: string;
  business_type: 'bouw' | 'basis';
  is_admin: boolean;
  created_at: string;
  website_url?: string;
  important_links?: string;
}

interface UserWithEmail extends UserProfile {
  email: string;
}

const GlassCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl ${className}`}>
    {children}
  </div>
);

const GlassInput = ({ label, ...props }: any) => (
  <div>
    {label && <label className="text-sm font-medium text-gray-300 block mb-2">{label}</label>}
    <div className="rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm transition-all focus-within:border-blue-400/50 focus-within:bg-white/10">
      <input
        {...props}
        className="w-full bg-transparent text-sm p-3 rounded-xl focus:outline-none text-white placeholder-gray-500"
      />
    </div>
  </div>
);

const GlassSelect = ({ label, children, ...props }: any) => (
  <div>
    {label && <label className="text-sm font-medium text-gray-300 block mb-2">{label}</label>}
    <div className="rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm">
      <select
        {...props}
        className="w-full bg-transparent text-sm p-3 rounded-xl focus:outline-none text-white"
      >
        {children}
      </select>
    </div>
  </div>
);

const RichTextEditor = ({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
      styleLinks();
    }
  }, [value]);

  const styleLinks = () => {
    if (editorRef.current) {
      const links = editorRef.current.querySelectorAll('a');
      links.forEach(link => {
        link.style.color = '#60a5fa';
        link.style.textDecoration = 'underline';
        link.style.cursor = 'pointer';
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      });
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      styleLinks();
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'A') {
      e.preventDefault();
      const link = target as HTMLAnchorElement;
      const currentUrl = link.href;
      const currentText = link.textContent;
      const newUrl = prompt('Bewerk URL:', currentUrl);
      if (newUrl !== null) {
        if (newUrl.trim() === '') {
          // Remove link but keep text
          const textNode = document.createTextNode(currentText || '');
          link.parentNode?.replaceChild(textNode, link);
        } else {
          link.href = newUrl;
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        }
        if (editorRef.current) {
          onChange(editorRef.current.innerHTML);
        }
      }
    }
  };

  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      styleLinks();
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertLink = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      alert('Selecteer eerst tekst om een link toe te voegen');
      return;
    }

    const selectedText = selection.toString();
    if (!selectedText) {
      alert('Selecteer eerst tekst om een link toe te voegen');
      return;
    }

    const url = prompt('Voer de URL in:');
    if (url) {
      applyFormat('createLink', url);
      setTimeout(() => {
        styleLinks();
      }, 0);
    }
  };

  return (
    <div>
      {label && <label className="text-sm font-medium text-gray-300 block mb-2">{label}</label>}
      <div className="rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm overflow-hidden">
        <div className="flex gap-1 p-2 border-b border-white/10">
          <button
            type="button"
            onClick={() => applyFormat('bold')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Bold"
          >
            <Bold className="h-4 w-4 text-gray-300" />
          </button>
          <button
            type="button"
            onClick={() => applyFormat('italic')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Italic"
          >
            <Italic className="h-4 w-4 text-gray-300" />
          </button>
          <button
            type="button"
            onClick={insertLink}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Link toevoegen"
          >
            <LinkIcon className="h-4 w-4 text-gray-300" />
          </button>
        </div>
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onClick={handleClick}
          className="w-full min-h-[120px] bg-transparent text-sm p-3 focus:outline-none text-white"
          style={{ wordBreak: 'break-word' }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Selecteer tekst en klik op Link om een hyperlink toe te voegen. Klik op een bestaande link om deze te bewerken.
      </p>
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative z-10 w-full max-w-2xl my-8"
      >
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {children}
        </GlassCard>
      </motion.div>
    </div>
  );
};

export function AdminPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [users, setUsers] = useState<UserWithEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithEmail | null>(null);
  const [editForm, setEditForm] = useState({ email: '', name: '', business_name: '', website_url: '', password: '', important_links: '' });
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    email: '',
    password: '',
    name: '',
    business_name: '',
    business_type: 'basis' as 'bouw' | 'basis'
  });
  const [confirmAdminAction, setConfirmAdminAction] = useState<{ userId: string; makeAdmin: boolean } | null>(null);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<UserWithEmail | null>(null);

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  const checkAdminStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('is_admin')
        .eq('id', user?.id)
        .maybeSingle();

      if (error) throw error;

      if (data?.is_admin) {
        setIsAdmin(true);
        fetchUsers();
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      showToast('Fout bij laden van gebruikers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateBusinessType = async (userId: string, newType: 'bouw' | 'basis') => {
    setUpdating(userId);
    try {
      const { error } = await supabase.rpc('update_user_business_type', {
        target_user_id: userId,
        new_business_type: newType
      });

      if (error) throw error;

      showToast('Account type succesvol bijgewerkt', 'success');
      fetchUsers();
    } catch (error) {
      console.error('Error updating business type:', error);
      showToast('Fout bij bijwerken van account type', 'error');
    } finally {
      setUpdating(null);
    }
  };

  const requestAdminStatusChange = (userId: string, currentStatus: boolean) => {
    if (userId === user?.id) {
      showToast('Je kunt je eigen admin status niet wijzigen', 'error');
      return;
    }

    setConfirmAdminAction({
      userId,
      makeAdmin: !currentStatus
    });
  };

  const toggleAdminStatus = async () => {
    if (!confirmAdminAction) return;

    const { userId, makeAdmin } = confirmAdminAction;

    setUpdating(userId);
    try {
      const { error } = await supabase.rpc('update_user_admin_status', {
        target_user_id: userId,
        new_admin_status: makeAdmin
      });

      if (error) throw error;

      showToast('Admin status succesvol bijgewerkt', 'success');
      setConfirmAdminAction(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating admin status:', error);
      showToast('Fout bij bijwerken van admin status', 'error');
    } finally {
      setUpdating(null);
    }
  };

  const impersonateUser = async (targetUserId: string) => {
    setUpdating(targetUserId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        showToast('Niet ingelogd', 'error');
        return;
      }

      sessionStorage.setItem('admin_session', JSON.stringify({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        user_id: user?.id
      }));
      sessionStorage.setItem('is_impersonating', 'true');

      const targetUser = users.find(u => u.id === targetUserId);
      if (!targetUser) {
        showToast('Gebruiker niet gevonden', 'error');
        return;
      }

      const impersonateUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/impersonate-user`;

      const impersonateResponse = await fetch(impersonateUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target_user_id: targetUserId
        })
      });

      const impersonateResult = await impersonateResponse.json();

      if (!impersonateResponse.ok) {
        throw new Error(impersonateResult.error || 'Fout bij genereren van impersonation token');
      }

      const exchangeUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/exchange-impersonation-token`;

      const exchangeResponse = await fetch(exchangeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          impersonation_token: impersonateResult.impersonation_token
        })
      });

      const exchangeResult = await exchangeResponse.json();

      if (!exchangeResponse.ok) {
        throw new Error(exchangeResult.error || 'Fout bij uitwisselen van token');
      }

      const { error: sessionError } = await supabase.auth.setSession({
        access_token: exchangeResult.access_token,
        refresh_token: exchangeResult.refresh_token
      });

      if (sessionError) {
        throw sessionError;
      }

      showToast(`Nu ingelogd als ${targetUser.email}`, 'success');

      setTimeout(() => {
        window.history.pushState({}, '', '/dashboard');
        window.dispatchEvent(new PopStateEvent('popstate'));
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      console.error('Error impersonating user:', error);
      showToast(error.message || 'Fout bij impersoneren van gebruiker', 'error');
    } finally {
      setUpdating(null);
    }
  };

  const openEditDialog = (user: UserWithEmail) => {
    setEditingUser(user);
    setEditForm({
      email: user.email || '',
      name: user.name || '',
      business_name: user.business_name || '',
      website_url: user.website_url || '',
      password: '',
      important_links: user.important_links || ''
    });
  };

  const closeEditDialog = () => {
    setEditingUser(null);
    setEditForm({ email: '', name: '', business_name: '', website_url: '', password: '', important_links: '' });
  };

  const createNewUser = async () => {
    if (!newUserForm.email || !newUserForm.password) {
      showToast('Email en wachtwoord zijn verplicht', 'error');
      return;
    }

    if (newUserForm.password.length < 6) {
      showToast('Wachtwoord moet minimaal 6 tekens bevatten', 'error');
      return;
    }

    setUpdating('creating');
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('Niet ingelogd');
      }

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-user`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newUserForm.email,
          password: newUserForm.password,
          name: newUserForm.name,
          business_name: newUserForm.business_name,
          business_type: newUserForm.business_type
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Fout bij aanmaken van gebruiker');
      }

      showToast('Nieuwe gebruiker succesvol aangemaakt', 'success');
      setIsCreatingUser(false);
      setNewUserForm({
        email: '',
        password: '',
        name: '',
        business_name: '',
        business_type: 'basis'
      });
      fetchUsers();
    } catch (error: any) {
      console.error('Error creating user:', error);
      showToast(error.message || 'Fout bij aanmaken van gebruiker', 'error');
    } finally {
      setUpdating(null);
    }
  };

  const updateUserDetails = async () => {
    if (!editingUser) return;

    if (editForm.password && editForm.password.length < 6) {
      showToast('Wachtwoord moet minimaal 6 tekens bevatten', 'error');
      return;
    }

    setUpdating(editingUser.id);
    try {
      // Update email if changed
      if (editForm.email && editForm.email !== editingUser.email) {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          throw new Error('Niet ingelogd');
        }

        const emailApiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-user-email`;

        const emailResponse = await fetch(emailApiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: editingUser.id,
            new_email: editForm.email
          })
        });

        const emailResult = await emailResponse.json();

        if (!emailResponse.ok) {
          throw new Error(emailResult.error || 'Fout bij bijwerken van email');
        }
      }

      const { error: detailsError } = await supabase.rpc('update_user_details', {
        target_user_id: editingUser.id,
        new_name: editForm.name,
        new_business_name: editForm.business_name
      });

      if (detailsError) throw detailsError;

      const { error: websiteError } = await supabase.rpc('update_user_website_url', {
        target_user_id: editingUser.id,
        new_website_url: editForm.website_url
      });

      if (websiteError) throw websiteError;

      // Update important links
      const { error: linksError } = await supabase.rpc('update_user_important_links', {
        target_user_id: editingUser.id,
        new_important_links: editForm.important_links
      });

      if (linksError) throw linksError;

      if (editForm.password) {
        console.log('Starting password update...');
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          console.error('No session found');
          throw new Error('Niet ingelogd');
        }

        console.log('Session found:', {
          access_token_length: session.access_token?.length,
          user_id: session.user?.id
        });

        const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-user-password`;
        console.log('API URL:', apiUrl);
        console.log('Request payload:', {
          user_id: editingUser.id,
          password_length: editForm.password.length
        });

        try {
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json',
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            },
            body: JSON.stringify({
              user_id: editingUser.id,
              new_password: editForm.password
            })
          });

          console.log('Response status:', response.status);
          console.log('Response headers:', Object.fromEntries(response.headers.entries()));

          const responseText = await response.text();
          console.log('Response text:', responseText);

          let result;
          try {
            result = JSON.parse(responseText);
          } catch (e) {
            console.error('Failed to parse response as JSON:', e);
            throw new Error(`Server response: ${responseText}`);
          }

          console.log('Response result:', result);

          if (!response.ok) {
            throw new Error(result.error || result.message || 'Fout bij bijwerken van wachtwoord');
          }

          console.log('Password updated successfully');
        } catch (fetchError: any) {
          console.error('Fetch error:', fetchError);
          throw new Error(`Verbindingsfout: ${fetchError.message}`);
        }
      }

      showToast('Gebruikersgegevens succesvol bijgewerkt', 'success');
      closeEditDialog();
      fetchUsers();
    } catch (error: any) {
      console.error('Error updating user details:', error);
      showToast(error.message || 'Fout bij bijwerken van gebruikersgegevens', 'error');
    } finally {
      setUpdating(null);
    }
  };

  const deleteUser = async () => {
    if (!confirmDeleteUser) return;

    setUpdating(confirmDeleteUser.id);
    try {
      const { error } = await supabase.rpc('delete_user', {
        target_user_id: confirmDeleteUser.id
      });

      if (error) throw error;

      showToast('Gebruiker succesvol verwijderd', 'success');
      setConfirmDeleteUser(null);
      fetchUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      showToast(error.message || 'Fout bij verwijderen van gebruiker', 'error');
    } finally {
      setUpdating(null);
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBackToDashboard = () => {
    window.history.pushState({}, '', '/dashboard');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  if (!isAdmin) {
    return (
      <ProtectedRoute>
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
              </motion.div>
              <div className="flex items-center justify-center min-h-[60vh]">
                <GlassCard className="p-12 text-center max-w-md">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3">Geen Toegang</h2>
                  <p className="text-gray-400">Je hebt geen admin rechten om deze pagina te bekijken.</p>
                </GlassCard>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
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
            </motion.div>

            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl font-bold text-white mb-2">Gebruikersbeheer</h1>
                <p className="text-gray-400">Beheer account types en toegangsrechten van gebruikers</p>
              </motion.div>

              {loading ? (
                <GlassCard className="p-16">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
                  </div>
                </GlassCard>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <GlassCard>
                  <div className="p-6 border-b border-white/10">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center flex-shrink-0">
                          <Shield className="h-6 w-6 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Alle Gebruikers</h2>
                      </div>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                        <button
                          onClick={() => setIsCreatingUser(true)}
                          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-medium transition-all shadow-lg hover:shadow-blue-500/30"
                        >
                          <UserPlus className="h-4 w-4" />
                          Nieuwe Gebruiker
                        </button>
                        <div className="relative flex-1 sm:w-64">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <input
                            type="text"
                            placeholder="Zoek gebruiker..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left p-4 text-sm font-semibold text-gray-400">Naam</th>
                          <th className="text-left p-4 text-sm font-semibold text-gray-400">E-mail</th>
                          <th className="text-left p-4 text-sm font-semibold text-gray-400">Bedrijf</th>
                          <th className="text-left p-4 text-sm font-semibold text-gray-400">Type</th>
                          <th className="text-left p-4 text-sm font-semibold text-gray-400">Admin</th>
                          <th className="text-left p-4 text-sm font-semibold text-gray-400">Acties</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((profile, index) => (
                          <motion.tr
                            key={profile.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                          >
                            <td className="p-4 text-white font-medium">{profile.name || '-'}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-300">{profile.email}</span>
                              </div>
                            </td>
                            <td className="p-4 text-gray-300">{profile.business_name || '-'}</td>
                            <td className="p-4">
                              <select
                                value={profile.business_type}
                                onChange={(e) => updateBusinessType(profile.id, e.target.value as 'bouw' | 'basis')}
                                disabled={updating === profile.id}
                                className="px-3 py-1.5 rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm text-white text-sm focus:outline-none focus:border-blue-400/50 disabled:opacity-50"
                              >
                                <option value="basis">Basis</option>
                                <option value="bouw">Bouw</option>
                              </select>
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-lg ${
                                profile.is_admin
                                  ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                  : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                              }`}>
                                {profile.is_admin ? 'Ja' : 'Nee'}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => openEditDialog(profile)}
                                  disabled={updating === profile.id}
                                  title="Bewerk gebruiker"
                                  className="p-2 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all disabled:opacity-50"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => impersonateUser(profile.id)}
                                  disabled={updating === profile.id}
                                  title="Inloggen als deze gebruiker"
                                  className="p-2 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all disabled:opacity-50"
                                >
                                  <UserCog className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => requestAdminStatusChange(profile.id, profile.is_admin)}
                                  disabled={updating === profile.id || profile.id === user?.id}
                                  className="px-3 py-2 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all disabled:opacity-50 text-xs font-medium whitespace-nowrap"
                                >
                                  {profile.is_admin ? 'Verwijder admin' : 'Maak admin'}
                                </button>
                                <button
                                  onClick={() => setConfirmDeleteUser(profile)}
                                  disabled={updating === profile.id || profile.id === user?.id}
                                  title="Verwijder gebruiker"
                                  className="p-2 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all disabled:opacity-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                        {filteredUsers.length === 0 && (
                          <tr>
                            <td colSpan={6} className="text-center text-gray-500 py-12">
                              Geen gebruikers gevonden
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-6 border-t border-white/10">
                    <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm p-4">
                      <h3 className="font-semibold text-blue-300 mb-3 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        Account Types
                      </h3>
                      <ul className="space-y-2 text-sm text-blue-200">
                        <li><strong className="text-blue-100">Basis:</strong> Toegang tot Reviews, Leads en Profiel</li>
                        <li><strong className="text-blue-100">Bouw:</strong> Volledige toegang inclusief Portfolio en Werkspot</li>
                      </ul>
                    </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <Modal
          isOpen={!!editingUser}
          onClose={closeEditDialog}
          title="Gebruiker Bewerken"
        >
            {editingUser && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <GlassInput
                    label="E-mailadres"
                    type="email"
                    placeholder="gebruiker@example.com"
                    value={editForm.email}
                    onChange={(e: any) => setEditForm({ ...editForm, email: e.target.value })}
                  />

                  <GlassInput
                    label="Naam"
                    type="text"
                    placeholder="Voer naam in"
                    value={editForm.name}
                    onChange={(e: any) => setEditForm({ ...editForm, name: e.target.value })}
                  />

                  <GlassInput
                    label="Bedrijfsnaam"
                    type="text"
                    placeholder="Voer bedrijfsnaam in"
                    value={editForm.business_name}
                    onChange={(e: any) => setEditForm({ ...editForm, business_name: e.target.value })}
                  />

                  <GlassInput
                    label="Website URL"
                    type="url"
                    placeholder="https://example.com"
                    value={editForm.website_url}
                    onChange={(e: any) => setEditForm({ ...editForm, website_url: e.target.value })}
                  />
                </div>

                <RichTextEditor
                  label="Belangrijke Links"
                  value={editForm.important_links}
                  onChange={(value) => setEditForm({ ...editForm, important_links: value })}
                />

                <div>
                  <GlassInput
                    label="Nieuw Wachtwoord"
                    type="password"
                    placeholder="Laat leeg om niet te wijzigen"
                    value={editForm.password}
                    onChange={(e: any) => setEditForm({ ...editForm, password: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimaal 6 tekens</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={closeEditDialog}
                    disabled={updating === editingUser.id}
                    className="flex-1 px-4 py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium transition-all disabled:opacity-50"
                  >
                    Annuleren
                  </button>
                  <button
                    onClick={updateUserDetails}
                    disabled={updating === editingUser.id}
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-medium transition-all shadow-lg disabled:opacity-50"
                  >
                    {updating === editingUser.id ? 'Opslaan...' : 'Opslaan'}
                  </button>
                </div>
              </div>
            )}
          </Modal>

          <Modal
            isOpen={isCreatingUser}
            onClose={() => setIsCreatingUser(false)}
            title="Nieuwe Gebruiker"
          >
            <div className="space-y-4">
              <GlassInput
                label="E-mailadres *"
                type="email"
                placeholder="gebruiker@voorbeeld.nl"
                value={newUserForm.email}
                onChange={(e: any) => setNewUserForm({ ...newUserForm, email: e.target.value })}
              />

              <GlassInput
                label="Wachtwoord *"
                type="password"
                placeholder="Minimaal 6 tekens"
                value={newUserForm.password}
                onChange={(e: any) => setNewUserForm({ ...newUserForm, password: e.target.value })}
              />

              <GlassInput
                label="Naam"
                type="text"
                placeholder="Voer naam in"
                value={newUserForm.name}
                onChange={(e: any) => setNewUserForm({ ...newUserForm, name: e.target.value })}
              />

              <GlassInput
                label="Bedrijfsnaam"
                type="text"
                placeholder="Voer bedrijfsnaam in"
                value={newUserForm.business_name}
                onChange={(e: any) => setNewUserForm({ ...newUserForm, business_name: e.target.value })}
              />

              <GlassSelect
                label="Account Type"
                value={newUserForm.business_type}
                onChange={(e: any) => setNewUserForm({ ...newUserForm, business_type: e.target.value })}
              >
                <option value="basis">Basis</option>
                <option value="bouw">Bouw</option>
              </GlassSelect>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsCreatingUser(false)}
                  disabled={updating === 'creating'}
                  className="flex-1 px-4 py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium transition-all disabled:opacity-50"
                >
                  Annuleren
                </button>
                <button
                  onClick={createNewUser}
                  disabled={updating === 'creating'}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-medium transition-all shadow-lg disabled:opacity-50"
                >
                  {updating === 'creating' ? 'Aanmaken...' : 'Aanmaken'}
                </button>
              </div>
            </div>
          </Modal>

          <Modal
            isOpen={!!confirmAdminAction}
            onClose={() => setConfirmAdminAction(null)}
            title="Bevestig Admin Wijziging"
          >
            <div className="space-y-4">
              <p className="text-gray-300">
                {confirmAdminAction?.makeAdmin
                  ? 'Weet je zeker dat je deze gebruiker admin rechten wilt geven?'
                  : 'Weet je zeker dat je de admin rechten wilt verwijderen?'}
              </p>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setConfirmAdminAction(null)}
                  disabled={!!updating}
                  className="flex-1 px-4 py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium transition-all disabled:opacity-50"
                >
                  Annuleren
                </button>
                <button
                  onClick={toggleAdminStatus}
                  disabled={!!updating}
                  className={`flex-1 px-4 py-3 rounded-xl font-medium text-white transition-all shadow-lg disabled:opacity-50 ${
                    confirmAdminAction?.makeAdmin
                      ? 'bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500'
                      : 'bg-gradient-to-r from-red-500 to-rose-400 hover:from-red-600 hover:to-rose-500'
                  }`}
                >
                  {updating ? 'Bezig...' : 'Bevestigen'}
                </button>
              </div>
            </div>
          </Modal>

          <Modal
            isOpen={!!confirmDeleteUser}
            onClose={() => setConfirmDeleteUser(null)}
            title="Gebruiker Verwijderen"
          >
            {confirmDeleteUser && (
              <div className="space-y-4">
                <p className="text-gray-300">
                  Weet je zeker dat je deze gebruiker wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
                </p>

                <div className="rounded-xl border border-red-500/30 bg-red-500/10 backdrop-blur-sm p-4">
                  <p className="text-sm font-semibold text-red-300 mb-2">Te verwijderen:</p>
                  <div className="text-sm text-red-200 space-y-1">
                    <p><strong>Naam:</strong> {confirmDeleteUser.name || 'Geen naam'}</p>
                    <p><strong>Email:</strong> {confirmDeleteUser.email}</p>
                    <p><strong>Bedrijf:</strong> {confirmDeleteUser.business_name || 'Geen bedrijf'}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setConfirmDeleteUser(null)}
                    disabled={!!updating}
                    className="flex-1 px-4 py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium transition-all disabled:opacity-50"
                  >
                    Annuleren
                  </button>
                  <button
                    onClick={deleteUser}
                    disabled={!!updating}
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-400 hover:from-red-600 hover:to-rose-500 text-white font-medium transition-all shadow-lg disabled:opacity-50"
                  >
                    {updating ? 'Verwijderen...' : 'Verwijderen'}
                  </button>
                </div>
              </div>
            )}
          </Modal>
      </div>
    </ProtectedRoute>
  );
}
