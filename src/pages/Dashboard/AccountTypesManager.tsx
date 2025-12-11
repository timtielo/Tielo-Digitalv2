import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Plus, Edit2, Trash2, Check, X, GripVertical } from 'lucide-react';
import { supabase } from '../../lib/supabase/client';
import { useToast } from '../../components/ui/Toast';

interface AccountType {
  id: string;
  name: string;
  description: string;
  is_system: boolean;
}

interface DashboardModule {
  module_key: string;
  display_name: string;
  description: string;
}

interface AccountTypeModule {
  module_key: string;
  enabled: boolean;
  sort_order: number;
}

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-2xl border-2 border-gray-300 bg-white shadow-sm p-6 ${className}`}>
    {children}
  </div>
);

export function AccountTypesManager() {
  const [accountTypes, setAccountTypes] = useState<AccountType[]>([]);
  const [modules, setModules] = useState<DashboardModule[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [typeModules, setTypeModules] = useState<AccountTypeModule[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeDescription, setNewTypeDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedType) {
      fetchTypeModules(selectedType);
    }
  }, [selectedType]);

  const fetchData = async () => {
    try {
      const [typesRes, modulesRes] = await Promise.all([
        supabase.from('account_types').select('*').order('name'),
        supabase.from('dashboard_modules').select('module_key, display_name, description')
      ]);

      if (typesRes.error) throw typesRes.error;
      if (modulesRes.error) throw modulesRes.error;

      setAccountTypes(typesRes.data || []);
      setModules(modulesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('Fout bij ophalen van gegevens', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchTypeModules = async (typeId: string) => {
    try {
      const { data, error } = await supabase
        .from('account_type_modules')
        .select('module_key, enabled, sort_order')
        .eq('account_type_id', typeId)
        .order('sort_order');

      if (error) throw error;

      const modulesMap = new Map(data?.map(m => [m.module_key, m]) || []);
      const allTypeModules = modules.map(m => ({
        module_key: m.module_key,
        enabled: modulesMap.get(m.module_key)?.enabled || false,
        sort_order: modulesMap.get(m.module_key)?.sort_order || 0
      }));

      setTypeModules(allTypeModules);
    } catch (error) {
      console.error('Error fetching type modules:', error);
      showToast('Fout bij ophalen van modules', 'error');
    }
  };

  const createAccountType = async () => {
    if (!newTypeName.trim()) {
      showToast('Vul een naam in', 'error');
      return;
    }

    try {
      const { error } = await supabase
        .from('account_types')
        .insert({
          name: newTypeName,
          description: newTypeDescription,
          is_system: false
        });

      if (error) throw error;

      showToast('Account type aangemaakt', 'success');
      setIsCreating(false);
      setNewTypeName('');
      setNewTypeDescription('');
      fetchData();
    } catch (error) {
      console.error('Error creating account type:', error);
      showToast('Fout bij aanmaken van account type', 'error');
    }
  };

  const deleteAccountType = async (typeId: string) => {
    if (!confirm('Weet je zeker dat je dit account type wilt verwijderen? Alle gebruikers met dit type moeten handmatig een nieuw type krijgen.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('account_types')
        .delete()
        .eq('id', typeId);

      if (error) throw error;

      showToast('Account type verwijderd', 'success');
      if (selectedType === typeId) {
        setSelectedType(null);
      }
      fetchData();
    } catch (error) {
      console.error('Error deleting account type:', error);
      showToast('Fout bij verwijderen van account type', 'error');
    }
  };

  const toggleModule = async (moduleKey: string, enabled: boolean) => {
    if (!selectedType) return;

    try {
      if (enabled) {
        const maxOrder = Math.max(...typeModules.map(m => m.sort_order), 0);
        const { error } = await supabase
          .from('account_type_modules')
          .upsert({
            account_type_id: selectedType,
            module_key: moduleKey,
            enabled: true,
            sort_order: maxOrder + 1
          });

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('account_type_modules')
          .delete()
          .eq('account_type_id', selectedType)
          .eq('module_key', moduleKey);

        if (error) throw error;
      }

      showToast('Module bijgewerkt', 'success');
      fetchTypeModules(selectedType);
    } catch (error) {
      console.error('Error toggling module:', error);
      showToast('Fout bij bijwerken van module', 'error');
    }
  };

  const updateModuleOrder = async (moduleKey: string, newOrder: number) => {
    if (!selectedType) return;

    try {
      const { error } = await supabase
        .from('account_type_modules')
        .update({ sort_order: newOrder })
        .eq('account_type_id', selectedType)
        .eq('module_key', moduleKey);

      if (error) throw error;

      fetchTypeModules(selectedType);
    } catch (error) {
      console.error('Error updating module order:', error);
      showToast('Fout bij bijwerken van volgorde', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const enabledModules = typeModules.filter(m => m.enabled).sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-7 h-7" />
            Account Types Beheer
          </h2>
          <p className="text-gray-600 mt-1">
            Maak custom account types en configureer welke modules elke type krijgt
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 border-2 border-green-300 text-green-700 rounded-xl transition-all font-medium"
        >
          <Plus className="w-4 h-4" />
          Nieuw Type
        </button>
      </div>

      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Nieuw Account Type</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Naam</label>
                  <input
                    type="text"
                    value={newTypeName}
                    onChange={(e) => setNewTypeName(e.target.value)}
                    placeholder="bijv. Marketing Plus"
                    className="w-full bg-gray-50 border-2 border-gray-300 rounded-xl px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Beschrijving</label>
                  <textarea
                    value={newTypeDescription}
                    onChange={(e) => setNewTypeDescription(e.target.value)}
                    placeholder="Beschrijf wat dit account type inhoudt..."
                    rows={3}
                    className="w-full bg-gray-50 border-2 border-gray-300 rounded-xl px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={createAccountType}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-all shadow-md"
                  >
                    <Check className="w-4 h-4" />
                    Aanmaken
                  </button>
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setNewTypeName('');
                      setNewTypeDescription('');
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 border-2 border-gray-300 text-gray-700 font-medium rounded-xl transition-all"
                  >
                    <X className="w-4 h-4" />
                    Annuleren
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Types</h3>
            <div className="space-y-2">
              {accountTypes.map((type) => (
                <motion.div
                  key={type.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedType(type.id)}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    selectedType === type.id
                      ? 'bg-blue-100 border-2 border-blue-500 shadow-md'
                      : 'bg-gray-50 border-2 border-gray-300 hover:bg-gray-100 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {type.name}
                      </h4>
                      {type.description && (
                        <p className="text-sm mt-1 text-gray-600">
                          {type.description}
                        </p>
                      )}
                      {type.is_system && (
                        <span className={`inline-block mt-2 text-xs px-2 py-1 rounded font-medium ${
                          selectedType === type.id
                            ? 'bg-blue-200 text-blue-800'
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          Systeem Type
                        </span>
                      )}
                    </div>
                    {!type.is_system && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAccountType(type.id);
                        }}
                        className="ml-2 p-1 rounded transition-colors hover:bg-red-100 text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedType ? (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Module Configuratie voor {accountTypes.find(t => t.id === selectedType)?.name}
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Actieve Modules</h4>
                  <div className="space-y-2">
                    {enabledModules.length > 0 ? (
                      enabledModules.map((tm) => {
                        const module = modules.find(m => m.module_key === tm.module_key);
                        if (!module) return null;

                        return (
                          <div
                            key={tm.module_key}
                            className="flex items-center gap-3 p-3 bg-green-50 border-2 border-green-300 rounded-xl"
                          >
                            <GripVertical className="w-4 h-4 text-gray-500" />
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{module.display_name}</div>
                              <div className="text-sm text-gray-600">{module.description}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={tm.sort_order}
                                onChange={(e) => updateModuleOrder(tm.module_key, parseInt(e.target.value))}
                                className="w-16 bg-white border-2 border-gray-300 rounded px-2 py-1 text-gray-900 text-sm focus:outline-none focus:border-blue-500"
                              />
                              <button
                                onClick={() => toggleModule(tm.module_key, false)}
                                className="p-2 hover:bg-red-100 text-red-600 rounded transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-gray-600 text-sm">Geen modules actief</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Beschikbare Modules</h4>
                  <div className="space-y-2">
                    {typeModules.filter(tm => !tm.enabled).map((tm) => {
                      const module = modules.find(m => m.module_key === tm.module_key);
                      if (!module) return null;

                      return (
                        <div
                          key={tm.module_key}
                          className="flex items-center justify-between p-3 bg-gray-50 border-2 border-gray-300 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                          <div>
                            <div className="font-medium text-gray-900">{module.display_name}</div>
                            <div className="text-sm text-gray-600">{module.description}</div>
                          </div>
                          <button
                            onClick={() => toggleModule(tm.module_key, true)}
                            className="p-2 hover:bg-green-100 text-green-600 rounded transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Selecteer een account type om de modules te configureren</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
