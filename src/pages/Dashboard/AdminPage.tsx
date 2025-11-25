import React, { useState, useEffect } from 'react';
import { Shield, Search, Edit2, Mail, UserPlus } from 'lucide-react';
import { DashboardLayout } from '../../components/Dashboard/DashboardLayout';
import { ProtectedRoute } from '../../components/Dashboard/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Select } from '../../components/ui/Select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Dialog } from '../../components/ui/Dialog';
import { Textarea } from '../../components/ui/Textarea';
import { supabase } from '../../lib/supabase/client';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';

interface UserProfile {
  id: string;
  name: string;
  business_name: string;
  business_type: 'bouw' | 'basis';
  is_admin: boolean;
  created_at: string;
}

interface UserWithEmail extends UserProfile {
  email: string;
}

export function AdminPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [users, setUsers] = useState<UserWithEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithEmail | null>(null);
  const [editForm, setEditForm] = useState({ name: '', business_name: '' });
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    email: '',
    password: '',
    name: '',
    business_name: '',
    business_type: 'basis' as 'bouw' | 'basis'
  });

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

  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    if (userId === user?.id) {
      showToast('Je kunt je eigen admin status niet wijzigen', 'error');
      return;
    }

    setUpdating(userId);
    try {
      const { error } = await supabase.rpc('update_user_admin_status', {
        target_user_id: userId,
        new_admin_status: !currentStatus
      });

      if (error) throw error;

      showToast('Admin status succesvol bijgewerkt', 'success');
      fetchUsers();
    } catch (error) {
      console.error('Error updating admin status:', error);
      showToast('Fout bij bijwerken van admin status', 'error');
    } finally {
      setUpdating(null);
    }
  };

  const openEditDialog = (user: UserWithEmail) => {
    setEditingUser(user);
    setEditForm({
      name: user.name || '',
      business_name: user.business_name || ''
    });
  };

  const closeEditDialog = () => {
    setEditingUser(null);
    setEditForm({ name: '', business_name: '' });
  };

  const openCreateUserDialog = () => {
    setIsCreatingUser(true);
  };

  const closeCreateUserDialog = () => {
    setIsCreatingUser(false);
    setNewUserForm({
      email: '',
      password: '',
      name: '',
      business_name: '',
      business_type: 'basis'
    });
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
      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('Niet ingelogd');
      }

      // Call the Edge Function to create user
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
      closeCreateUserDialog();
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

    setUpdating(editingUser.id);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          name: editForm.name,
          business_name: editForm.business_name
        })
        .eq('id', editingUser.id);

      if (error) throw error;

      showToast('Gebruikersgegevens succesvol bijgewerkt', 'success');
      closeEditDialog();
      fetchUsers();
    } catch (error) {
      console.error('Error updating user details:', error);
      showToast('Fout bij bijwerken van gebruikersgegevens', 'error');
    } finally {
      setUpdating(null);
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin) {
    return (
      <ProtectedRoute>
        <DashboardLayout currentPage="admin">
          <Card>
            <CardContent className="p-8 text-center">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Geen Toegang</h2>
              <p className="text-gray-600">Je hebt geen admin rechten om deze pagina te bekijken.</p>
            </CardContent>
          </Card>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout currentPage="admin">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gebruikersbeheer</h1>
            <p className="text-gray-600 mt-1">Beheer account types en toegangsrechten van gebruikers</p>
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
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Alle Gebruikers
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={openCreateUserDialog}
                      className="flex items-center gap-2"
                    >
                      <UserPlus className="h-4 w-4" />
                      Nieuwe Gebruiker
                    </Button>
                    <div className="relative w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Zoek gebruiker..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Naam</TableHead>
                        <TableHead>E-mail</TableHead>
                        <TableHead>Bedrijf</TableHead>
                        <TableHead>Account Type</TableHead>
                        <TableHead>Admin</TableHead>
                        <TableHead>Acties</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((profile) => (
                        <TableRow key={profile.id}>
                          <TableCell className="font-medium">{profile.name || '-'}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">{profile.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>{profile.business_name || '-'}</TableCell>
                          <TableCell>
                            <Select
                              value={profile.business_type}
                              onChange={(e) => updateBusinessType(profile.id, e.target.value as 'bouw' | 'basis')}
                              disabled={updating === profile.id}
                              className="w-32"
                            >
                              <option value="basis">Basis</option>
                              <option value="bouw">Bouw</option>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                              profile.is_admin ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {profile.is_admin ? 'Ja' : 'Nee'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditDialog(profile)}
                                disabled={updating === profile.id}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleAdminStatus(profile.id, profile.is_admin)}
                                disabled={updating === profile.id || profile.id === user?.id}
                              >
                                {profile.is_admin ? 'Admin verwijderen' : 'Admin maken'}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredUsers.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                            Geen gebruikers gevonden
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Account Types</h3>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li><strong>Basis:</strong> Toegang tot Reviews, Leads en Profiel</li>
                    <li><strong>Bouw:</strong> Volledige toegang inclusief Portfolio en Werkspot</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Dialog
          open={!!editingUser}
          onOpenChange={(open) => !open && closeEditDialog()}
        >
          {editingUser && (
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Gebruiker Bewerken</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">E-mailadres</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editingUser.email}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">E-mailadres kan niet worden gewijzigd</p>
                </div>

                <div>
                  <Label htmlFor="name">Naam</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Voer naam in"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="business_name">Bedrijfsnaam</Label>
                  <Input
                    id="business_name"
                    type="text"
                    placeholder="Voer bedrijfsnaam in"
                    value={editForm.business_name}
                    onChange={(e) => setEditForm({ ...editForm, business_name: e.target.value })}
                  />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={closeEditDialog}
                    disabled={updating === editingUser.id}
                  >
                    Annuleren
                  </Button>
                  <Button
                    onClick={updateUserDetails}
                    disabled={updating === editingUser.id}
                  >
                    {updating === editingUser.id ? 'Opslaan...' : 'Opslaan'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Dialog>

        <Dialog
          open={isCreatingUser}
          onOpenChange={(open) => !open && closeCreateUserDialog()}
        >
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Nieuwe Gebruiker Aanmaken</h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="new_email">E-mailadres *</Label>
                <Input
                  id="new_email"
                  type="email"
                  placeholder="gebruiker@voorbeeld.nl"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="new_password">Wachtwoord *</Label>
                <Input
                  id="new_password"
                  type="password"
                  placeholder="Minimaal 6 tekens"
                  value={newUserForm.password}
                  onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Minimaal 6 tekens</p>
              </div>

              <div>
                <Label htmlFor="new_name">Naam</Label>
                <Input
                  id="new_name"
                  type="text"
                  placeholder="Voer naam in"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="new_business_name">Bedrijfsnaam</Label>
                <Input
                  id="new_business_name"
                  type="text"
                  placeholder="Voer bedrijfsnaam in"
                  value={newUserForm.business_name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, business_name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="new_business_type">Account Type</Label>
                <Select
                  id="new_business_type"
                  value={newUserForm.business_type}
                  onChange={(e) => setNewUserForm({ ...newUserForm, business_type: e.target.value as 'bouw' | 'basis' })}
                  className="w-full"
                >
                  <option value="basis">Basis</option>
                  <option value="bouw">Bouw</option>
                </Select>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={closeCreateUserDialog}
                  disabled={updating === 'creating'}
                >
                  Annuleren
                </Button>
                <Button
                  onClick={createNewUser}
                  disabled={updating === 'creating'}
                >
                  {updating === 'creating' ? 'Aanmaken...' : 'Gebruiker Aanmaken'}
                </Button>
              </div>
            </div>
          </div>
        </Dialog>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
