import React, { useEffect, useState } from 'react';
import { Rocket, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase/client';

interface Project {
  id: string;
  progress: number;
  status_label: string;
  status_explanation: string;
  is_online: boolean;
  active: boolean;
}

const getStatusColor = (progress: number) => {
  if (progress >= 90) return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', ring: 'ring-green-500', badge: 'bg-green-100 text-green-700' };
  if (progress >= 60) return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', ring: 'ring-blue-500', badge: 'bg-blue-100 text-blue-700' };
  if (progress >= 30) return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', ring: 'ring-yellow-500', badge: 'bg-yellow-100 text-yellow-700' };
  return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', ring: 'ring-gray-500', badge: 'bg-gray-100 text-gray-700' };
};

const getPhaseInfo = (progress: number) => {
  if (progress >= 90) return { phase: 'Bijna Klaar', icon: CheckCircle2 };
  if (progress >= 75) return { phase: 'Oplevering', icon: Rocket };
  if (progress >= 50) return { phase: 'Ontwikkeling', icon: Clock };
  if (progress >= 25) return { phase: 'Ontwerp', icon: Clock };
  return { phase: 'Planning', icon: AlertCircle };
};

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
      <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200 animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
            <div>
              <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="h-7 w-16 bg-gray-200 rounded-full"></div>
        </div>
        <div className="h-3 bg-gray-200 rounded-full mb-2"></div>
        <div className="h-14 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-red-900">Fout bij laden</h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-100 rounded-xl flex-shrink-0">
            <Rocket className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-blue-900">Geen Actief Project</h3>
            <p className="text-xs text-blue-700 mt-0.5">Neem contact op met ons team voor meer informatie.</p>
          </div>
        </div>
      </div>
    );
  }

  const colors = getStatusColor(project.progress);
  const phaseInfo = getPhaseInfo(project.progress);
  const PhaseIcon = phaseInfo.icon;

  return (
    <div className={`bg-white rounded-xl shadow-md p-4 border ${colors.border} transition-all duration-300 hover:shadow-lg`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 ${colors.bg} rounded-xl`}>
            <Rocket className={`w-5 h-5 ${colors.text}`} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Jouw Project</h3>
            <div className="flex items-center gap-1.5">
              <PhaseIcon className={`w-3 h-3 ${colors.text}`} />
              <span className={`text-xs font-semibold ${colors.text}`}>{phaseInfo.phase}</span>
            </div>
          </div>
        </div>
        <div className={`px-3 py-1 ${colors.badge} rounded-full font-bold text-sm`}>
          {project.progress}%
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-gray-600">Voortgang</span>
          <span className={`text-xs font-bold ${colors.text}`}>{project.status_label}</span>
        </div>
        <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <div className={`${colors.bg} rounded-lg px-3 py-2.5 border ${colors.border}`}>
        <h4 className={`text-[10px] font-bold ${colors.text} mb-1 uppercase tracking-wide`}>Status Update</h4>
        <p className="text-xs text-gray-700 leading-relaxed">{project.status_explanation}</p>
      </div>

      {project.is_online && (
        <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
          <span className="text-xs font-semibold text-green-700">Jouw website is live!</span>
        </div>
      )}
    </div>
  );
};
