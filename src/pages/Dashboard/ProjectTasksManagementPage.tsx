import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Download, ArrowLeft, CheckCircle2, Circle, Clock, Shield } from 'lucide-react';
import { ProtectedRoute } from '../../components/Dashboard/ProtectedRoute';
import { AuroraBackground } from '../../components/ui/aurora-bento-grid';
import { Breadcrumb } from '../../components/Dashboard/Breadcrumb';
import { supabase } from '../../lib/supabase/client';
import { useAuth } from '../../contexts/AuthContext';
import defaultTasksTemplate from '../../../templates/defaultProjectTasks.json';

interface ProjectTask {
  id: string;
  project_id: string;
  title: string;
  description: string;
  phase: string;
  required: boolean;
  visible_to_client: boolean;
  assigned_to_customer: boolean;
  status: 'todo' | 'in_progress' | 'done';
  sort_order: number;
}

interface Project {
  id: string;
  client_id: string;
  progress: number;
  status_label: string;
  client_name?: string;
  client_email?: string;
}

const PHASES = ['Onboarding', 'Design', 'Content', 'Techniek', 'Livegang'];
const STATUSES = [
  { value: 'todo', label: 'Te doen' },
  { value: 'in_progress', label: 'In uitvoering' },
  { value: 'done', label: 'Afgerond' }
];

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
        <GlassCard className="p-6 max-h-[90vh] overflow-y-auto">
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

function ProjectTasksManagementContent() {
  const { user } = useAuth();
  const [projectId, setProjectId] = useState<string>('');
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<ProjectTask | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    phase: 'Onboarding',
    required: true,
    visible_to_client: true,
    assigned_to_customer: false,
    status: 'todo' as 'todo' | 'in_progress' | 'done',
    sort_order: 0,
  });

  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/\/dashboard\/admin\/projects\/([^/]+)\/tasks/);
    if (match) {
      setProjectId(match[1]);
    }
  }, []);

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  useEffect(() => {
    if (projectId && isAdmin) {
      fetchProject();
      fetchTasks();
    }
  }, [projectId, isAdmin]);

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
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setLoading(false);
    }
  };

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          user_profiles!projects_client_id_fkey (
            email,
            name
          )
        `)
        .eq('id', projectId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProject({
          ...data,
          client_name: (data.user_profiles as any)?.name || '',
          client_email: (data.user_profiles as any)?.email || '',
        });
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('project_tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (task?: ProjectTask) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        phase: task.phase,
        required: task.required,
        visible_to_client: task.visible_to_client,
        assigned_to_customer: task.assigned_to_customer,
        status: task.status,
        sort_order: task.sort_order,
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        phase: 'Onboarding',
        required: true,
        visible_to_client: true,
        assigned_to_customer: false,
        status: 'todo',
        sort_order: tasks.length > 0 ? Math.max(...tasks.map(t => t.sort_order)) + 1 : 1,
      });
    }
    setShowDialog(true);
  };

  const handleSaveTask = async () => {
    try {
      if (editingTask) {
        const { error } = await supabase
          .from('project_tasks')
          .update(formData)
          .eq('id', editingTask.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('project_tasks')
          .insert([{ ...formData, project_id: projectId }]);

        if (error) throw error;
      }

      setShowDialog(false);
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Er is een fout opgetreden bij het opslaan van de taak');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Weet je zeker dat je deze taak wilt verwijderen?')) return;

    try {
      const { error } = await supabase
        .from('project_tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Er is een fout opgetreden bij het verwijderen van de taak');
    }
  };

  const handleApplyTemplate = async () => {
    if (!confirm('Weet je zeker dat je de standaard taken wilt toevoegen? Dit voegt alle taken uit de template toe.')) {
      return;
    }

    try {
      const tasksToInsert = defaultTasksTemplate.map(task => ({
        ...task,
        project_id: projectId,
      }));

      const { error } = await supabase
        .from('project_tasks')
        .insert(tasksToInsert);

      if (error) throw error;

      alert('Standaard taken succesvol toegevoegd!');
      fetchTasks();
    } catch (error) {
      console.error('Error applying template:', error);
      alert('Er is een fout opgetreden bij het toevoegen van de standaard taken');
    }
  };

  const handleBack = () => {
    window.history.pushState({}, '', '/dashboard/admin/projects');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  if (!isAdmin && !loading) {
    return (
      <div className="min-h-screen w-full bg-gray-950 font-sans antialiased relative">
        <AuroraBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <GlassCard className="p-12 text-center max-w-md">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Geen Toegang</h2>
            <p className="text-gray-400">Je hebt geen admin rechten om deze pagina te bekijken.</p>
          </GlassCard>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-400" />;
      default:
        return <Circle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'done':
        return <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs font-medium rounded-lg border border-green-500/30">Afgerond</span>;
      case 'in_progress':
        return <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium rounded-lg border border-blue-500/30">Bezig</span>;
      default:
        return <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs font-medium rounded-lg border border-gray-500/30">Te doen</span>;
    }
  };

  const tasksByPhase = PHASES.map(phase => ({
    phase,
    tasks: tasks.filter(t => t.phase === phase)
  }));

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
              <Breadcrumb items={[
                { label: 'Admin', path: '/dashboard/admin' },
                { label: 'Projecten', path: '/dashboard/admin/projects' },
                { label: 'Taken' }
              ]} />

              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={handleBack}
                  className="p-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-4xl font-bold text-white">Taken Beheer</h1>
                  {project && (
                    <p className="text-gray-400 mt-1">
                      Project van {project.client_name || project.client_email}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleApplyTemplate}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-medium transition-all"
                >
                  <Download className="w-5 h-5" />
                  Template Toepassen
                </button>
                <button
                  onClick={() => handleOpenDialog()}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-medium transition-all shadow-lg hover:shadow-blue-500/30"
                >
                  <Plus className="w-5 h-5" />
                  Nieuwe Taak
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
                className="space-y-6"
              >
                {tasksByPhase.map(({ phase, tasks: phaseTasks }) => (
                  <GlassCard key={phase} className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <h2 className="text-2xl font-bold text-white">{phase}</h2>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm font-medium border border-blue-500/30">
                        {phaseTasks.length} {phaseTasks.length === 1 ? 'taak' : 'taken'}
                      </span>
                    </div>

                    {phaseTasks.length === 0 ? (
                      <p className="text-gray-500 text-sm">Nog geen taken in deze fase</p>
                    ) : (
                      <div className="space-y-3">
                        {phaseTasks.map((task, index) => (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className="flex items-start gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                          >
                            <div className="flex-shrink-0 mt-1">
                              {getStatusIcon(task.status)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-white mb-1">{task.title}</h3>
                              {task.description && (
                                <p className="text-sm text-gray-400 mb-2">{task.description}</p>
                              )}
                              <div className="flex flex-wrap gap-2">
                                {getStatusBadge(task.status)}
                                {task.required && (
                                  <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs font-medium rounded-lg border border-red-500/30">
                                    Verplicht
                                  </span>
                                )}
                                {task.visible_to_client && (
                                  <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs font-medium rounded-lg border border-purple-500/30">
                                    Zichtbaar
                                  </span>
                                )}
                                {task.assigned_to_customer && (
                                  <span className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs font-medium rounded-lg border border-orange-500/30">
                                    Klant taak
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleOpenDialog(task)}
                                className="p-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                                title="Bewerk taak"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="p-2 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all"
                                title="Verwijder taak"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </GlassCard>
                ))}

                {tasks.length === 0 && (
                  <GlassCard className="p-16 text-center">
                    <Clock className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">Nog geen taken aangemaakt voor dit project</p>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={handleApplyTemplate}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-medium transition-all"
                      >
                        <Download className="w-5 h-5" />
                        Template Toepassen
                      </button>
                      <button
                        onClick={() => handleOpenDialog()}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-medium transition-all shadow-lg"
                      >
                        <Plus className="w-5 h-5" />
                        Eerste Taak Aanmaken
                      </button>
                    </div>
                  </GlassCard>
                )}
              </motion.div>
            )}

            {showDialog && (
              <Modal
                isOpen={showDialog}
                onClose={() => setShowDialog(false)}
                title={editingTask ? 'Taak Bewerken' : 'Nieuwe Taak'}
              >
                <div className="space-y-4">
                  <GlassInput
                    label="Titel *"
                    value={formData.title}
                    onChange={(e: any) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Bijv. Logo aanleveren"
                  />

                  <div>
                    <label className="text-sm font-medium text-gray-300 block mb-2">Beschrijving</label>
                    <div className="rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm">
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Uitleg over wat er gedaan moet worden"
                        rows={3}
                        className="w-full bg-transparent text-sm p-3 rounded-xl focus:outline-none text-white placeholder-gray-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 block mb-2">Fase *</label>
                    <div className="rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm">
                      <select
                        value={formData.phase}
                        onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
                        className="w-full bg-transparent text-sm p-3 rounded-xl focus:outline-none text-white"
                      >
                        {PHASES.map(phase => (
                          <option key={phase} value={phase}>{phase}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 block mb-2">Status *</label>
                    <div className="rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm">
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full bg-transparent text-sm p-3 rounded-xl focus:outline-none text-white"
                      >
                        {STATUSES.map(status => (
                          <option key={status.value} value={status.value}>{status.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <GlassInput
                    label="Sorteervolgorde"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e: any) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  />

                  <div className="space-y-2 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.required}
                        onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-300">Verplichte taak</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.visible_to_client}
                        onChange={(e) => setFormData({ ...formData, visible_to_client: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-300">Zichtbaar voor klant</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.assigned_to_customer}
                        onChange={(e) => setFormData({ ...formData, assigned_to_customer: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-300">Toegewezen aan klant</span>
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
                      onClick={handleSaveTask}
                      disabled={!formData.title}
                      className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-medium transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {editingTask ? 'Opslaan' : 'Aanmaken'}
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

export function ProjectTasksManagementPage() {
  return (
    <ProtectedRoute>
      <ProjectTasksManagementContent />
    </ProtectedRoute>
  );
}
