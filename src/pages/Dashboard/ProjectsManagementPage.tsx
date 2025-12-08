import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Rocket, Users, ExternalLink } from 'lucide-react';
import { DashboardLayout } from '../../components/Dashboard/DashboardLayout';
import { supabase } from '../../lib/supabase/client';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Textarea } from '../../components/ui/Textarea';

interface Project {
  id: string;
  client_id: string;
  progress: number;
  status_label: string;
  status_explanation: string;
  is_online: boolean;
  active: boolean;
  created_at: string;
  client_email?: string;
  client_name?: string;
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  business_name: string;
}

export function ProjectsManagementPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    client_id: '',
    progress: 0,
    status_label: '',
    status_explanation: '',
    is_online: false,
    active: true,
  });

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          user_profiles!projects_client_id_fkey (
            email,
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const projectsWithEmail = data?.map(p => ({
        ...p,
        client_email: (p.user_profiles as any)?.email || '',
        client_name: (p.user_profiles as any)?.name || '',
      })) || [];

      setProjects(projectsWithEmail);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, email, name, business_name')
        .order('name', { ascending: true });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleOpenDialog = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        client_id: project.client_id,
        progress: project.progress,
        status_label: project.status_label,
        status_explanation: project.status_explanation,
        is_online: project.is_online,
        active: project.active,
      });
    } else {
      setEditingProject(null);
      setFormData({
        client_id: '',
        progress: 0,
        status_label: 'In voorbereiding',
        status_explanation: 'Het project is aangemaakt en wordt momenteel voorbereid.',
        is_online: false,
        active: true,
      });
    }
    setShowDialog(true);
  };

  const handleSaveProject = async () => {
    try {
      if (editingProject) {
        const { error } = await supabase
          .from('projects')
          .update(formData)
          .eq('id', editingProject.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([formData]);

        if (error) throw error;
      }

      setShowDialog(false);
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Er is een fout opgetreden bij het opslaan van het project');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Weet je zeker dat je dit project wilt verwijderen?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Er is een fout opgetreden bij het verwijderen van het project');
    }
  };

  const handleNavigateToTasks = (projectId: string) => {
    window.history.pushState({}, '', `/dashboard/admin/projects/${projectId}/tasks`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <DashboardLayout title="Project Beheer">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Projecten</h1>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            Nieuw Project
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="w-5 h-5 text-gray-500" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {project.client_name || project.client_email}
                      </h3>
                      {project.is_online && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                          Online
                        </span>
                      )}
                      {!project.active && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                          Inactief
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{project.client_email}</p>
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span className="font-medium">{project.status_label}</span>
                        <span className="font-semibold text-blue-600">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{project.status_explanation}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleNavigateToTasks(project.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Beheer taken"
                    >
                      <Rocket className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleOpenDialog(project)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Bewerk project"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Verwijder project"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {projects.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <Rocket className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Nog geen projecten aangemaakt</p>
                <Button onClick={() => handleOpenDialog()} className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Eerste Project Aanmaken
                </Button>
              </div>
            )}
          </div>
        )}

        {showDialog && (
          <Dialog
            isOpen={showDialog}
            onClose={() => setShowDialog(false)}
            title={editingProject ? 'Project Bewerken' : 'Nieuw Project'}
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="client">Klant</Label>
                <select
                  id="client"
                  value={formData.client_id}
                  onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!!editingProject}
                >
                  <option value="">Selecteer een klant</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="progress">Voortgang (%)</Label>
                <Input
                  id="progress"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div>
                <Label htmlFor="status_label">Status Label</Label>
                <Input
                  id="status_label"
                  value={formData.status_label}
                  onChange={(e) => setFormData({ ...formData, status_label: e.target.value })}
                  placeholder="Bijv. In ontwikkeling"
                />
              </div>

              <div>
                <Label htmlFor="status_explanation">Status Uitleg</Label>
                <Textarea
                  id="status_explanation"
                  value={formData.status_explanation}
                  onChange={(e) => setFormData({ ...formData, status_explanation: e.target.value })}
                  placeholder="Geef een duidelijke uitleg over de huidige status"
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_online}
                    onChange={(e) => setFormData({ ...formData, is_online: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Website is online</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Project actief</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowDialog(false)}>
                  Annuleren
                </Button>
                <Button onClick={handleSaveProject}>
                  {editingProject ? 'Opslaan' : 'Aanmaken'}
                </Button>
              </div>
            </div>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  );
}
