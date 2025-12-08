import React, { useEffect, useState } from 'react';
import { Vo2MaxCard } from '../ui/Vo2MaxCard';
import { Rocket } from 'lucide-react';
import { supabase } from '../../lib/supabase/client';

interface Project {
  id: string;
  progress: number;
  status_label: string;
  status_explanation: string;
  is_online: boolean;
  active: boolean;
}

export const ProjectProgressCard: React.FC = () => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProject();
  }, []);

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Gebruiker niet ingelogd');
      }

      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', user.id)
        .eq('active', true)
        .maybeSingle();

      if (fetchError) throw fetchError;

      setProject(data);
    } catch (err) {
      console.error('Error fetching project:', err);
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            <div>
              <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="h-8 w-16 bg-gray-200 rounded"></div>
        </div>
        <div className="h-3 bg-gray-200 rounded mb-4"></div>
        <div className="h-16 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <p className="text-red-600 text-sm">Fout bij laden van project: {error}</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <Rocket className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="font-semibold text-blue-900">Geen actief project</h3>
            <p className="text-sm text-blue-700">Er is momenteel geen actief project voor jouw account.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Vo2MaxCard
      title="Voortgang Website"
      value={project.progress}
      progress={project.progress}
      status={project.status_label}
      description={project.status_explanation}
      icon={Rocket}
    />
  );
};
