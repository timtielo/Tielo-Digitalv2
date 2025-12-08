import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Rocket, Users, ArrowLeft } from 'lucide-react';
import { ProtectedRoute } from '../../components/Dashboard/ProtectedRoute';
import { AuroraBackground } from '../../components/ui/aurora-bento-grid';
import { Breadcrumb } from '../../components/Dashboard/Breadcrumb';
import { supabase } from '../../lib/supabase/client';

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
              ×
            </button>
          </div>
          {children}
        </GlassCard>
      </motion.div>
    </div>
  );
};

function ProjectsManagementContent() {
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

  const handleBack = () => {
    window.history.pushState({}, '', '/dashboard/admin');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="min-h-screen w-full bg-gray-950 font-sans antialiased relative">
      <AuroraBackground />

      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Breadcrumb items={[{ label: 'Admin', path: '/dashboard/admin' }, { label: 'Projecten' }]} />

              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={handleBack}
                  className="p-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-4xl font-bold text-white">Projecten Beheer</h1>
                  <p className="text-gray-400 mt-1">Beheer website projecten en voortgang</p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleOpenDialog()}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-medium transition-all shadow-lg hover:shadow-blue-500/30"
                >
                  <Plus className="w-5 h-5" />
                  Nieuw Project
                </button>
              </div>
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
                className="space-y-4"
              >
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <GlassCard className="p-6 hover:bg-white/10 transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Users className="w-5 h-5 text-blue-400" />
                            <h3 className="text-lg font-semibold text-white">
                              {project.client_name || project.client_email}
                            </h3>
                            {project.is_online && (
                              <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs font-medium rounded-lg border border-green-500/30">
                                Online
                              </span>
                            )}
                            {!project.active && (
                              <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs font-medium rounded-lg border border-gray-500/30">
                                Inactief
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 mb-3">{project.client_email}</p>
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
                              <span className="font-medium text-blue-300">{project.status_label}</span>
                              <span className="font-semibold text-blue-400">{project.progress}%</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-300">{project.status_explanation}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleNavigateToTasks(project.id)}
                            className="p-2 rounded-xl border border-white/20 bg-white/5 hover:bg-blue-500/20 text-blue-400 transition-all"
                            title="Beheer taken"
                          >
                            <Rocket className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleOpenDialog(project)}
                            className="p-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                            title="Bewerk project"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="p-2 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all"
                            title="Verwijder project"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}

                {projects.length === 0 && (
                  <GlassCard className="p-16 text-center">
                    <Rocket className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">Nog geen projecten aangemaakt</p>
                    <button
                      onClick={() => handleOpenDialog()}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-medium transition-all shadow-lg"
                    >
                      <Plus className="w-5 h-5" />
                      Eerste Project Aanmaken
                    </button>
                  </GlassCard>
                )}
              </motion.div>
            )}

            {showDialog && (
              <Modal
                isOpen={showDialog}
                onClose={() => setShowDialog(false)}
                title={editingProject ? 'Project Bewerken' : 'Nieuw Project'}
              >
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 block mb-2">Klant</label>
                    <div className="rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm">
                      <select
                        value={formData.client_id}
                        onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                        className="w-full bg-transparent text-sm p-3 rounded-xl focus:outline-none text-white"
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
                  </div>

                  <GlassInput
                    label="Voortgang (%)"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={(e: any) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
                  />

                  <GlassInput
                    label="Status Label"
                    value={formData.status_label}
                    onChange={(e: any) => setFormData({ ...formData, status_label: e.target.value })}
                    placeholder="Bijv. In ontwikkeling"
                  />

                  <div>
                    <label className="text-sm font-medium text-gray-300 block mb-2">Status Uitleg</label>
                    <div className="rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm">
                      <textarea
                        value={formData.status_explanation}
                        onChange={(e) => setFormData({ ...formData, status_explanation: e.target.value })}
                        placeholder="Geef een duidelijke uitleg over de huidige status"
                        rows={3}
                        className="w-full bg-transparent text-sm p-3 rounded-xl focus:outline-none text-white placeholder-gray-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_online}
                        onChange={(e) => setFormData({ ...formData, is_online: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-300">Website is online</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.active}
                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-300">Project actief</span>
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setShowDialog(false)}
                      className="flex-1 px-4 py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium transition-all"
                    >
                      Annuleren
                    </button>
                    <button
                      onClick={handleSaveProject}
                      className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-medium transition-all shadow-lg"
                    >
                      {editingProject ? 'Opslaan' : 'Aanmaken'}
                    </button>
                  </div>
                </div>
              </Modal>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProjectsManagementPage() {
  return (
    <ProtectedRoute>
      <ProjectsManagementContent />
    </ProtectedRoute>
  );
}
