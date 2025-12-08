import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase/client';
import { Plus, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { ProtectedRoute } from '../../components/Dashboard/ProtectedRoute';
import { DashboardLayout } from '../../components/Dashboard/DashboardLayout';

interface MCCMonth {
  id: string;
  year: number;
  month: number;
  created_at: string;
}

interface MCCItem {
  id: string;
  month_id: string;
  category: string;
  item: string;
  target: number;
  status: 'on-track' | 'at-risk' | 'off-track';
  order_index: number;
  scores: MCCScore[];
}

interface MCCScore {
  id?: string;
  item_id: string;
  week: number;
  value: number;
}

const MONTHS = [
  'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
  'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'
];

const CATEGORIES = ['LEADS', 'KLANTEN', 'FANS', 'CASH', 'TEAM', 'BETROKKENHEID'];
const CATEGORY_COLORS = {
  LEADS: 'bg-yellow-50 border-yellow-200',
  KLANTEN: 'bg-blue-50 border-blue-200',
  FANS: 'bg-pink-50 border-pink-200',
  CASH: 'bg-green-50 border-green-200',
  TEAM: 'bg-purple-50 border-purple-200',
  BETROKKENHEID: 'bg-orange-50 border-orange-200'
};

const CATEGORY_TEXT_COLORS = {
  LEADS: 'text-yellow-700',
  KLANTEN: 'text-blue-700',
  FANS: 'text-pink-700',
  CASH: 'text-green-700',
  TEAM: 'text-purple-700',
  BETROKKENHEID: 'text-orange-700'
};

const STATUS_OPTIONS = [
  { value: 'on-track', label: '🟢 On track', color: 'text-green-600' },
  { value: 'at-risk', label: '🟠 At risk', color: 'text-orange-600' },
  { value: 'off-track', label: '🔴 Off track', color: 'text-red-600' }
];

function MissionControlContent() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [currentMonthData, setCurrentMonthData] = useState<MCCMonth | null>(null);
  const [items, setItems] = useState<MCCItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMonthData();
  }, [selectedYear, selectedMonth]);

  const loadMonthData = async () => {
    setLoading(true);
    try {
      const { data: monthData, error: monthError } = await supabase
        .from('mcc_months')
        .select('*')
        .eq('year', selectedYear)
        .eq('month', selectedMonth)
        .maybeSingle();

      if (monthError) throw monthError;

      if (monthData) {
        setCurrentMonthData(monthData);
        await loadItems(monthData.id);
      } else {
        setCurrentMonthData(null);
        setItems([]);
      }
    } catch (error) {
      console.error('Error loading month data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadItems = async (monthId: string) => {
    try {
      const { data: itemsData, error: itemsError } = await supabase
        .from('mcc_items')
        .select('*')
        .eq('month_id', monthId)
        .order('order_index');

      if (itemsError) throw itemsError;

      const itemsWithScores = await Promise.all(
        (itemsData || []).map(async (item) => {
          const { data: scoresData } = await supabase
            .from('mcc_item_scores')
            .select('*')
            .eq('item_id', item.id)
            .order('week');

          const scores: MCCScore[] = [];
          for (let week = 1; week <= 5; week++) {
            const existingScore = scoresData?.find(s => s.week === week);
            scores.push({
              id: existingScore?.id,
              item_id: item.id,
              week,
              value: existingScore?.value || 0
            });
          }

          return {
            ...item,
            scores
          };
        })
      );

      setItems(itemsWithScores);
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  const createMonth = async () => {
    try {
      const { data, error } = await supabase
        .from('mcc_months')
        .insert({ year: selectedYear, month: selectedMonth })
        .select()
        .single();

      if (error) throw error;
      setCurrentMonthData(data);
      setItems([]);
    } catch (error) {
      console.error('Error creating month:', error);
    }
  };

  const addItem = async (category: string) => {
    if (!currentMonthData) return;

    try {
      const maxOrder = Math.max(...items.map(i => i.order_index), -1);
      const { data, error } = await supabase
        .from('mcc_items')
        .insert({
          month_id: currentMonthData.id,
          category,
          item: 'Nieuw item',
          target: 0,
          status: 'on-track',
          order_index: maxOrder + 1
        })
        .select()
        .single();

      if (error) throw error;

      const newItem: MCCItem = {
        ...data,
        scores: Array.from({ length: 5 }, (_, i) => ({
          item_id: data.id,
          week: i + 1,
          value: 0
        }))
      };

      setItems([...items, newItem]);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const updateItem = async (itemId: string, field: string, value: any) => {
    try {
      const { error } = await supabase
        .from('mcc_items')
        .update({ [field]: value })
        .eq('id', itemId);

      if (error) throw error;

      setItems(items.map(item =>
        item.id === itemId ? { ...item, [field]: value } : item
      ));
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const updateScore = async (itemId: string, week: number, value: number) => {
    try {
      const item = items.find(i => i.id === itemId);
      const score = item?.scores.find(s => s.week === week);

      if (score?.id) {
        const { error } = await supabase
          .from('mcc_item_scores')
          .update({ value, updated_at: new Date().toISOString() })
          .eq('id', score.id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('mcc_item_scores')
          .insert({ item_id: itemId, week, value })
          .select()
          .single();

        if (error) throw error;

        setItems(items.map(item => {
          if (item.id === itemId) {
            return {
              ...item,
              scores: item.scores.map(s =>
                s.week === week ? { ...s, id: data.id, value } : s
              )
            };
          }
          return item;
        }));
        return;
      }

      setItems(items.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            scores: item.scores.map(s =>
              s.week === week ? { ...s, value } : s
            )
          };
        }
        return item;
      }));
    } catch (error) {
      console.error('Error updating score:', error);
    }
  };

  const deleteItem = async (itemId: string) => {
    if (!confirm('Weet je zeker dat je dit item wilt verwijderen?')) return;

    try {
      const { error } = await supabase
        .from('mcc_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      setItems(items.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    let newMonth = selectedMonth + (direction === 'next' ? 1 : -1);
    let newYear = selectedYear;

    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }

    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  const calculateMonthTotal = (scores: MCCScore[]) => {
    return scores.reduce((sum, score) => sum + score.value, 0);
  };

  const renderItemsByCategory = (category: string) => {
    const categoryItems = items.filter(item => item.category === category);

    return (
      <React.Fragment key={category}>
        {/* Category Header Row */}
        <tr className={`${CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS]} border-b border-white/20`}>
          <td colSpan={11} className="px-4 py-2">
            <div className="flex items-center justify-between">
              <h3 className={`text-sm font-bold ${CATEGORY_TEXT_COLORS[category as keyof typeof CATEGORY_TEXT_COLORS]}`}>
                {category}
              </h3>
              <button
                onClick={() => addItem(category)}
                disabled={!currentMonthData}
                className="flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-white/5 hover:bg-white/10 border border-white/20 text-white font-medium transition-all disabled:opacity-50"
              >
                <Plus className="w-3 h-3" />
                Toevoegen
              </button>
            </div>
          </td>
        </tr>
        {/* Category Items */}
        {categoryItems.map((item, index) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors ${CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS]}`}
                  >
                    <td className="px-4 py-1.5">
                      <span className={`text-xs font-semibold ${CATEGORY_TEXT_COLORS[category as keyof typeof CATEGORY_TEXT_COLORS]}`}>
                        {category}
                      </span>
                    </td>
                    <td className="px-4 py-1.5">
                      <input
                        type="text"
                        value={item.item}
                        onChange={(e) => updateItem(item.id, 'item', e.target.value)}
                        className="w-full min-w-[250px] px-3 py-1.5 text-sm rounded-md border border-white/20 bg-white/5 backdrop-blur-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all"
                      />
                    </td>
                    {item.scores.map((score) => (
                      <td key={score.week} className="px-2 py-1.5">
                        <input
                          type="number"
                          value={score.value}
                          onChange={(e) => updateScore(item.id, score.week, parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1.5 text-sm text-center rounded-md border border-white/20 bg-white/5 backdrop-blur-sm text-white focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all"
                        />
                      </td>
                    ))}
                    <td className="px-2 py-1.5 text-center font-bold text-white text-sm">
                      {calculateMonthTotal(item.scores)}
                    </td>
                    <td className="px-2 py-1.5">
                      <input
                        type="number"
                        value={item.target}
                        onChange={(e) => updateItem(item.id, 'target', parseInt(e.target.value) || 0)}
                        className="w-20 px-2 py-1.5 text-sm text-center rounded-md border border-white/20 bg-white/5 backdrop-blur-sm text-white focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all"
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <select
                        value={item.status}
                        onChange={(e) => updateItem(item.id, 'status', e.target.value)}
                        className="w-full min-w-[130px] px-2 py-1.5 text-xs rounded-md border border-white/20 bg-white/5 backdrop-blur-sm text-white focus:outline-none focus:border-blue-400/50"
                      >
                        {STATUS_OPTIONS.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 py-1.5 text-center">
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="p-1.5 rounded-md border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
      </React.Fragment>
    );
  };

  if (loading) {
    return (
      <DashboardLayout currentPage="admin">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPage="admin">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mission Control Center</h1>
          <p className="text-gray-600">Beheer je maandelijkse doelen en voortgang</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 mb-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-300 hover:text-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="px-4 py-2 rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm text-white focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all"
                >
                  {MONTHS.map((month, index) => (
                    <option key={index} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="px-4 py-2 rounded-lg border border-white/20 bg-white/5 backdrop-blur-sm text-white focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all"
                >
                  {[2024, 2025, 2026, 2027].map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-300 hover:text-white"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {!currentMonthData && (
              <button
                onClick={createMonth}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-medium transition-all shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Nieuwe maand aanmaken
              </button>
            )}
          </div>
        </motion.div>

        {currentMonthData ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-black/30 backdrop-blur-sm">
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-1.5 text-left text-xs font-semibold text-gray-300">Categorie</th>
                    <th className="px-4 py-1.5 text-left text-xs font-semibold text-gray-300">Item</th>
                    <th className="px-2 py-1.5 text-center text-xs font-semibold text-gray-300">W1</th>
                    <th className="px-2 py-1.5 text-center text-xs font-semibold text-gray-300">W2</th>
                    <th className="px-2 py-1.5 text-center text-xs font-semibold text-gray-300">W3</th>
                    <th className="px-2 py-1.5 text-center text-xs font-semibold text-gray-300">W4</th>
                    <th className="px-2 py-1.5 text-center text-xs font-semibold text-gray-300">W5</th>
                    <th className="px-2 py-1.5 text-center text-xs font-semibold text-gray-300">Maand</th>
                    <th className="px-2 py-1.5 text-center text-xs font-semibold text-gray-300">Target</th>
                    <th className="px-2 py-1.5 text-center text-xs font-semibold text-gray-300">Status</th>
                    <th className="px-2 py-1.5 text-center text-xs font-semibold text-gray-300">Acties</th>
                  </tr>
                </thead>
                <tbody>
                  {CATEGORIES.map(category => renderItemsByCategory(category))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-gray-200 bg-white shadow-sm p-12 text-center"
          >
            <p className="text-gray-600 mb-6 text-lg">
              Er is nog geen data voor {MONTHS[selectedMonth - 1]} {selectedYear}
            </p>
            <button
              onClick={createMonth}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium transition-all shadow-sm mx-auto"
            >
              <Plus className="w-4 h-4" />
              Maand aanmaken
            </button>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}

export function MissionControlPage() {
  return (
    <ProtectedRoute>
      <MissionControlContent />
    </ProtectedRoute>
  );
}
