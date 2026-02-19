import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Rocket, Users, ArrowLeft, Shield, X, Loader2 } from 'lucide-react';
import { ProtectedRoute } from '../../components/Dashboard/ProtectedRoute';
import { DashboardLayout } from '../../components/Dashboard/DashboardLayout';
import { Breadcrumb } from '../../components/Dashboard/Breadcrumb';
import { Card } from '../../components/ui/Card';
import { supabase } from '../../lib/supabase/client';
import { useAuth } from '../../contexts/AuthContext';

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

const FormInput = ({ label, ...props }: any) => (
  <div>
    {label && <label className="text-xs font-bold text-tielo-navy/60 uppercase tracking-wide block mb-1.5">{label}</label>}
    <input
      {...props}
      className="w-full px-3 py-2.5 text-sm border border-tielo-steel/30 rounded-td bg-tielo-offwhite focus:outline-none focus:border-tielo-orange transition-colors text-tielo-navy placeholder-tielo-navy/30"
    />
  </div>
);

const FormSelect = ({ label, children, ...props }: any) => (
  <div>
    {label && <label className="text-xs font-bold text-tielo-navy/60 uppercase tracking-wide block mb-1.5">{label}</label>}
    <select
      {...props}
      className="w-full px-3 py-2.5 text-sm border border-tielo-steel/30 rounded-td bg-tielo-offwhite focus:outline-none focus:border-tielo-orange transition-colors text-tielo-navy"
    >
      {children}
    </select>
  </div>
);

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-tielo-navy/75 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 w-full max-w-2xl my-8"
        >
          <div className="bg-white rounded-td shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-tielo-steel/20">
              <h2 className="text-xl font-bold font-rubik text-tielo-navy">{title}</h2>
              <button onClick={onClose} className="p-2 hover:bg-tielo-orange/10 rounded-td transition-colors">
                <X className="w-5 h-5 text-tielo-navy" />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

function ProjectsManagementContent() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
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
        fetchProjects();
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

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          user_profiles (
            email,
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          full: error
        });
        throw error;
      }

      console.log('Fetched projects data:', data);

      const projectsWithEmail = data?.map(p => ({
        ...p,
        client_email: (p.user_profiles as any)?.email || '',
        client_name: (p.user_profiles as any)?.name || '',
      })) || [];

      console.log('Processed projects:', projectsWithEmail);
      setProjects(projectsWithEmail);
    } catch (error: any) {
      console.error('Error fetching projects:', {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
        full: error
      });
      const errorMsg = error?.message || error?.details || 'Unknown error';
      alert(`Error loading projects: ${errorMsg}`);
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

  if (!isAdmin && !loading) {
    return (
      <DashboardLayout currentPage="admin">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="td-card p-12 text-center max-w-md">
            <div className="p-4 bg-tielo-orange/10 rounded-td w-fit mx-auto mb-5">
              <Shield className="w-8 h-8 text-tielo-orange" />
            </div>
            <h2 className="text-2xl font-bold font-rubik text-tielo-navy mb-2">Geen Toegang</h2>
            <p className="text-tielo-navy/60 text-sm">Je hebt geen admin rechten om deze pagina te bekijken.</p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPage="admin">
      <div className="space-y-6">
        <Breadcrumb items={[{ label: 'Admin', path: '/dashboard/admin' }, { label: 'Projecten' }]} />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-tielo-navy rounded-td p-6 text-white shadow-xl relative overflow-hidden"
        >
          <div className="absolute inset-0 td-striped opacity-10" />
          <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-td transition-colors flex-shrink-0"
                title="Terug naar Admin"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div>
                <h1 className="text-3xl font-bold font-rubik mb-1">Projecten Beheer</h1>
                <p className="text-white/70">Beheer website projecten en voortgang</p>
              </div>
            </div>
            <button
              onClick={() => handleOpenDialog()}
              className="flex items-center gap-2 px-5 py-3 bg-tielo-orange hover:bg-tielo-orange/90 text-white font-bold rounded-td shadow-lg transition-all flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              Nieuw Project
            </button>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-tielo-orange" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="td-card p-5 hover:border-tielo-orange/30 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                        <Users className="w-4 h-4 text-tielo-orange flex-shrink-0" />
                        <h3 className="font-bold text-tielo-navy truncate">
                          {project.client_name || project.client_email}
                        </h3>
                        {project.is_online && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase tracking-wide">
                            Online
                          </span>
                        )}
                        {!project.active && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded uppercase tracking-wide">
                            Inactief
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-tielo-navy/40 mb-3">{project.client_email}</p>

                      <div className="mb-2">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-bold text-tielo-orange">{project.status_label}</span>
                          <span className="font-bold text-tielo-navy tabular-nums">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-tielo-steel/20 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-tielo-orange h-2 rounded-full transition-all duration-500"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>

                      <p className="text-xs text-tielo-navy/50 mt-2 leading-relaxed">{project.status_explanation}</p>
                    </div>

                    <div className="flex gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => handleNavigateToTasks(project.id)}
                        className="p-2 rounded-td border border-tielo-steel/20 hover:border-tielo-orange/50 hover:bg-tielo-orange/5 text-tielo-navy/50 hover:text-tielo-orange transition-all"
                        title="Beheer taken"
                      >
                        <Rocket className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenDialog(project)}
                        className="p-2 rounded-td border border-tielo-steel/20 hover:border-tielo-orange/50 hover:bg-tielo-orange/5 text-tielo-navy/50 hover:text-tielo-orange transition-all"
                        title="Bewerk project"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="p-2 rounded-td border border-red-200 hover:bg-red-50 text-red-400 hover:text-red-600 transition-all"
                        title="Verwijder project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}

            {projects.length === 0 && (
              <Card className="td-card p-12 text-center">
                <div className="p-4 bg-tielo-orange/10 rounded-td w-fit mx-auto mb-4">
                  <Rocket className="w-8 h-8 text-tielo-orange" />
                </div>
                <p className="font-bold text-tielo-navy mb-1">Nog geen projecten</p>
                <p className="text-sm text-tielo-navy/50 mb-5">Maak je eerste project aan voor een klant</p>
                <button
                  onClick={() => handleOpenDialog()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-tielo-orange hover:bg-tielo-orange/90 text-white font-bold rounded-td transition-all text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Eerste Project Aanmaken
                </button>
              </Card>
            )}
          </motion.div>
        )}
      </div>

      <Modal
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        title={editingProject ? 'Project Bewerken' : 'Nieuw Project'}
      >
        <div className="space-y-4">
          <FormSelect
            label="Klant"
            value={formData.client_id}
            onChange={(e: any) => setFormData({ ...formData, client_id: e.target.value })}
            disabled={!!editingProject}
          >
            <option value="">Selecteer een klant</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email})
              </option>
            ))}
          </FormSelect>

          <FormInput
            label="Voortgang (%)"
            type="number"
            min="0"
            max="100"
            value={formData.progress}
            onChange={(e: any) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
          />

          <FormInput
            label="Status Label"
            value={formData.status_label}
            onChange={(e: any) => setFormData({ ...formData, status_label: e.target.value })}
            placeholder="Bijv. In ontwikkeling"
          />

          <div>
            <label className="text-xs font-bold text-tielo-navy/60 uppercase tracking-wide block mb-1.5">Status Uitleg</label>
            <textarea
              value={formData.status_explanation}
              onChange={e => setFormData({ ...formData, status_explanation: e.target.value })}
              placeholder="Geef een duidelijke uitleg over de huidige status"
              rows={3}
              className="w-full px-3 py-2.5 text-sm border border-tielo-steel/30 rounded-td bg-tielo-offwhite focus:outline-none focus:border-tielo-orange transition-colors text-tielo-navy placeholder-tielo-navy/30 resize-none"
            />
          </div>

          <div className="flex items-center gap-5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_online}
                onChange={e => setFormData({ ...formData, is_online: e.target.checked })}
                className="w-4 h-4 accent-tielo-orange rounded"
              />
              <span className="text-sm font-medium text-tielo-navy">Website online</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={e => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4 accent-tielo-orange rounded"
              />
              <span className="text-sm font-medium text-tielo-navy">Project actief</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowDialog(false)}
              className="flex-1 px-4 py-2.5 border border-tielo-steel/20 hover:bg-tielo-offwhite text-tielo-navy/70 font-bold text-sm rounded-td transition-all"
            >
              Annuleren
            </button>
            <button
              onClick={handleSaveProject}
              className="flex-1 px-4 py-2.5 bg-tielo-orange hover:bg-tielo-orange/90 text-white font-bold text-sm rounded-td transition-all shadow-md"
            >
              {editingProject ? 'Opslaan' : 'Aanmaken'}
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

export function ProjectsManagementPage() {
  return (
    <ProtectedRoute>
      <ProjectsManagementContent />
    </ProtectedRoute>
  );
}
