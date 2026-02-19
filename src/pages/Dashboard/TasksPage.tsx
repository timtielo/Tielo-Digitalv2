import React from 'react';
import { motion } from 'framer-motion';
import { ListTodo } from 'lucide-react';
import { ProtectedRoute } from '../../components/Dashboard/ProtectedRoute';
import { DashboardLayout } from '../../components/Dashboard/DashboardLayout';
import { ProjectProgressCard } from '../../components/Dashboard/ProjectProgressCard';
import { ProjectTasksList } from '../../components/Dashboard/ProjectTasksList';

function TasksPageContent() {
  return (
    <DashboardLayout currentPage="tasks">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-tielo-navy rounded-td p-6 text-white shadow-xl relative overflow-hidden"
        >
          <div className="absolute inset-0 td-striped opacity-10" />
          <div className="relative flex items-start gap-5">
            <div className="p-3 bg-white/10 rounded-td flex-shrink-0">
              <ListTodo className="w-8 h-8 text-tielo-orange" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-rubik mb-1">Jouw Taken</h1>
              <p className="text-white/70">Bekijk alle openstaande en afgeronde taken voor jouw project</p>
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
