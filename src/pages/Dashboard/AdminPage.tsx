import React, { useState, useEffect } from 'react';
import { Shield, Search } from 'lucide-react';
import { DashboardLayout } from '../../components/Dashboard/DashboardLayout';
import { ProtectedRoute } from '../../components/Dashboard/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Select } from '../../components/ui/Select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
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

export function AdminPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

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

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.business_name.toLowerCase().includes(searchTerm.toLowerCase())
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
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Naam</TableHead>
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
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleAdminStatus(profile.id, profile.is_admin)}
                              disabled={updating === profile.id || profile.id === user?.id}
                            >
                              {profile.is_admin ? 'Admin verwijderen' : 'Admin maken'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredUsers.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-gray-500 py-8">
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
      </DashboardLayout>
    </ProtectedRoute>
  );
}
