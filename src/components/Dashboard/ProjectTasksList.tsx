import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
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

export const ProjectTasksList: React.FC = () => {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

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
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-6 w-32 bg-white/10 rounded"></div>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-white/10 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return null;
  }

  const openTasks = tasks.filter(t => t.status !== 'done');
  const completedTasks = tasks.filter(t => t.status === 'done');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-6 h-6 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Jouw Taken</h2>
        {openTasks.length > 0 && (
          <span className="ml-auto bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
            {openTasks.length} open
          </span>
        )}
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {openTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-all duration-300 cursor-pointer"
              onClick={() => handleToggleTask(task.id, task.status)}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {updatingTaskId === task.id ? (
                    <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                  ) : task.status === 'done' ? (
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400 group-hover:text-blue-400 transition-colors" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-base mb-1">{task.title}</h3>
                  {task.description && (
                    <p className="text-gray-400 text-sm leading-relaxed">{task.description}</p>
                  )}
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-md">
                      {task.phase}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {completedTasks.length > 0 && (
          <>
            <div className="pt-4 mt-4 border-t border-white/10">
              <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
                Afgerond ({completedTasks.length})
              </h3>
            </div>
            {completedTasks.map((task) => (
              <motion.div
                key={task.id}
                className="bg-white/5 border border-white/5 rounded-xl p-4 opacity-60"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-base mb-1 line-through">{task.title}</h3>
                    {task.description && (
                      <p className="text-gray-500 text-sm leading-relaxed line-through">{task.description}</p>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      <span className="inline-block px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-md">
                        Gedaan
                      </span>
                      <span className="inline-block px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-md">
                        {task.phase}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </>
        )}
      </div>
    </motion.div>
  );
};
