import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ListTodo } from 'lucide-react';
import { ProtectedRoute } from '../../components/Dashboard/ProtectedRoute';
import { DashboardLayout } from '../../components/Dashboard/DashboardLayout';
import { ProjectProgressCard } from '../../components/Dashboard/ProjectProgressCard';
import { ProjectTasksList } from '../../components/Dashboard/ProjectTasksList';

function TasksPageContent() {
  return (
    <DashboardLayout currentPage="tasks">
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-8 text-white shadow-xl"
        >
          <div className="flex items-start gap-6">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
              <ListTodo className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">
                Jouw Taken
              </h1>
              <p className="text-blue-100 text-lg">
                Bekijk alle openstaande en afgeronde taken voor jouw project
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ProjectProgressCard />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ProjectTasksList />
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

export function TasksPage() {
  return (
    <ProtectedRoute>
      <TasksPageContent />
    </ProtectedRoute>
  );
}
