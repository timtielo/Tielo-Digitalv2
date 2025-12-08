import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Clock, ListTodo, Sparkles } from 'lucide-react';
import { supabase } from '../../lib/supabase/client';

interface ProjectTask {
  id: string;
  title: string;
  description: string;
  phase: string;
  status: 'todo' | 'in_progress' | 'done';
  assigned_to_customer: boolean;
  visible_to_client: boolean;
}

interface ProjectTasksListProps {
  limit?: number;
}

export const ProjectTasksList: React.FC<ProjectTasksListProps> = ({ limit }) => {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: projectData } = await supabase
        .from('projects')
        .select('id')
        .eq('client_id', user.id)
        .eq('active', true)
        .maybeSingle();

      if (!projectData) {
        setTasks([]);
        return;
      }

      const { data: tasksData, error } = await supabase
        .from('project_tasks')
        .select('*')
        .eq('project_id', projectData.id)
        .eq('visible_to_client', true)
        .eq('assigned_to_customer', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      setTasks(tasksData || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    if (currentStatus === 'done') return;

    try {
      setUpdatingTaskId(taskId);

      const { error } = await supabase
        .from('project_tasks')
        .update({ status: 'done' })
        .eq('id', taskId);

      if (error) throw error;

      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, status: 'done' as const } : task
      ));
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 animate-pulse">
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-8 bg-gray-200 rounded-xl"></div>
            <div className="h-7 w-32 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-8">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="p-4 bg-blue-100 rounded-2xl">
            <ListTodo className="w-10 h-10 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-blue-900 mb-2">Geen Taken</h3>
            <p className="text-blue-700">Er zijn momenteel geen taken toegewezen. We houden je op de hoogte zodra er nieuwe taken zijn!</p>
          </div>
        </div>
      </div>
    );
  }

  const allOpenTasks = tasks.filter(t => t.status !== 'done');
  const openTasks = limit ? allOpenTasks.slice(0, limit) : allOpenTasks;
  const completedTasks = tasks.filter(t => t.status === 'done');

  const tasksByPhase = openTasks.reduce((acc, task) => {
    if (!acc[task.phase]) acc[task.phase] = [];
    acc[task.phase].push(task);
    return acc;
  }, {} as Record<string, ProjectTask[]>);

  const completedByPhase = completedTasks.reduce((acc, task) => {
    if (!acc[task.phase]) acc[task.phase] = [];
    acc[task.phase].push(task);
    return acc;
  }, {} as Record<string, ProjectTask[]>);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-8"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl">
            <Clock className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Jouw Taken</h2>
            <p className="text-sm text-gray-600">Klik op een taak om deze af te vinken</p>
          </div>
        </div>
        {allOpenTasks.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-blue-900 font-bold">{allOpenTasks.length} openstaand</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {Object.entries(tasksByPhase).map(([phase, phaseTasks]) => (
          <div key={phase} className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider">{phase}</h3>
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {phaseTasks.length} {phaseTasks.length === 1 ? 'taak' : 'taken'}
              </span>
            </div>
            <div className="space-y-2">
              <AnimatePresence>
                {phaseTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-cyan-50 border-2 border-gray-200 hover:border-blue-300 rounded-xl p-5 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
                    onClick={() => handleToggleTask(task.id, task.status)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-0.5">
                        {updatingTaskId === task.id ? (
                          <div className="w-7 h-7 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        ) : task.status === 'done' ? (
                          <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 border-3 border-gray-300 group-hover:border-blue-500 rounded-full flex items-center justify-center transition-colors">
                            <Circle className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-gray-900 font-bold text-base mb-1.5 group-hover:text-blue-900 transition-colors">
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-gray-600 text-sm leading-relaxed">{task.description}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}

        {!limit && completedTasks.length > 0 && (
          <div className="pt-6 mt-6 border-t-2 border-gray-200">
            <button
              onClick={() => setExpandedPhase(expandedPhase ? null : 'completed')}
              className="flex items-center justify-between w-full px-2 mb-4 group"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider">
                  Afgerond
                </h3>
              </div>
              <span className="text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                {completedTasks.length} {completedTasks.length === 1 ? 'taak' : 'taken'}
              </span>
            </button>

            {expandedPhase === 'completed' && (
              <div className="space-y-2">
                {completedTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-green-50/50 border-2 border-green-200 rounded-xl p-5 opacity-75"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-gray-600 font-bold text-base mb-1.5 line-through">{task.title}</h3>
                        {task.description && (
                          <p className="text-gray-500 text-sm leading-relaxed line-through">{task.description}</p>
                        )}
                        <div className="mt-2">
                          <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                            {task.phase}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
