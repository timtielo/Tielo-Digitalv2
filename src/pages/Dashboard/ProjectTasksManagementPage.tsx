import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Download, ArrowLeft, CheckCircle2, Circle, Clock } from 'lucide-react';
import { DashboardLayout } from '../../components/Dashboard/DashboardLayout';
import { supabase } from '../../lib/supabase/client';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
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

export function ProjectTasksManagementPage() {
  const [projectId, setProjectId] = useState<string>('');
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState(true);
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
    if (projectId) {
      fetchProject();
      fetchTasks();
    }
  }, [projectId]);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'done':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">Afgerond</span>;
      case 'in_progress':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">Bezig</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">Te doen</span>;
    }
  };

  const tasksByPhase = PHASES.map(phase => ({
    phase,
    tasks: tasks.filter(t => t.phase === phase)
  }));

  return (
    <DashboardLayout title="Taken Beheer">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Taken</h1>
              {project && (
                <p className="text-sm text-gray-600 mt-1">
                  Project van {project.client_name || project.client_email}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleApplyTemplate}>
              <Download className="w-4 h-4 mr-2" />
              Template Toepassen
            </Button>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Nieuwe Taak
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {tasksByPhase.map(({ phase, tasks: phaseTasks }) => (
              <div key={phase} className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg">{phase}</span>
                  <span className="text-sm text-gray-500">({phaseTasks.length})</span>
                </h2>

                {phaseTasks.length === 0 ? (
                  <p className="text-gray-500 text-sm">Nog geen taken in deze fase</p>
                ) : (
                  <div className="space-y-3">
                    {phaseTasks.map((task) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-shrink-0 mt-1">
                          {getStatusIcon(task.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
                          {task.description && (
                            <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                          )}
                          <div className="flex flex-wrap gap-2">
                            {getStatusBadge(task.status)}
                            {task.required && (
                              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                                Verplicht
                              </span>
                            )}
                            {task.visible_to_client && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                                Zichtbaar voor klant
                              </span>
                            )}
                            {task.assigned_to_customer && (
                              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">
                                Toegewezen aan klant
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenDialog(task)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Bewerk taak"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Verwijder taak"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {tasks.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">Nog geen taken aangemaakt voor dit project</p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={handleApplyTemplate}>
                    <Download className="w-4 h-4 mr-2" />
                    Template Toepassen
                  </Button>
                  <Button onClick={() => handleOpenDialog()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Eerste Taak Aanmaken
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {showDialog && (
          <Dialog
            isOpen={showDialog}
            onClose={() => setShowDialog(false)}
            title={editingTask ? 'Taak Bewerken' : 'Nieuwe Taak'}
          >
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div>
                <Label htmlFor="title">Titel *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Bijv. Logo aanleveren"
                />
              </div>

              <div>
                <Label htmlFor="description">Beschrijving</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Uitleg over wat er gedaan moet worden"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="phase">Fase *</Label>
                <select
                  id="phase"
                  value={formData.phase}
                  onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {PHASES.map(phase => (
                    <option key={phase} value={phase}>{phase}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="status">Status *</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {STATUSES.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="sort_order">Sorteervolgorde</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.required}
                    onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Verplichte taak</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.visible_to_client}
                    onChange={(e) => setFormData({ ...formData, visible_to_client: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Zichtbaar voor klant</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.assigned_to_customer}
                    onChange={(e) => setFormData({ ...formData, assigned_to_customer: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Toegewezen aan klant</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowDialog(false)}>
                  Annuleren
                </Button>
                <Button onClick={handleSaveTask} disabled={!formData.title}>
                  {editingTask ? 'Opslaan' : 'Aanmaken'}
                </Button>
              </div>
            </div>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  );
}
