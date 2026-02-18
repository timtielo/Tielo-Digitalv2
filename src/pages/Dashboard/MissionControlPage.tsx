import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase/client';
import { Plus, ChevronLeft, ChevronRight, Trash2, Copy } from 'lucide-react';
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
  LEADS: 'bg-yellow-100 border-2 border-yellow-400',
  KLANTEN: 'bg-blue-100 border-2 border-blue-400',
  FANS: 'bg-pink-100 border-2 border-pink-400',
  CASH: 'bg-green-100 border-2 border-green-400',
  TEAM: 'bg-purple-100 border-2 border-purple-400',
  BETROKKENHEID: 'bg-orange-100 border-2 border-orange-400'
};

const CATEGORY_TEXT_COLORS = {
  LEADS: 'text-yellow-800',
  KLANTEN: 'text-blue-800',
  FANS: 'text-pink-800',
  CASH: 'text-green-800',
  TEAM: 'text-purple-800',
  BETROKKENHEID: 'text-orange-800'
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

  const getPreviousMonthId = async () => {
    let prevMonth = selectedMonth - 1;
    let prevYear = selectedYear;

    if (prevMonth < 1) {
      prevMonth = 12;
      prevYear -= 1;
    }

    const { data, error } = await supabase
      .from('mcc_months')
      .select('*')
      .eq('year', prevYear)
      .eq('month', prevMonth)
      .maybeSingle();

    if (error) throw error;
    return data;
  };

  const createMonthFromLastMonth = async () => {
    try {
      const previousMonth = await getPreviousMonthId();
      if (!previousMonth) {
        alert('Er is geen vorige maand gevonden om te kopieren.');
        return;
      }

      const { data: previousItems, error: itemsError } = await supabase
        .from('mcc_items')
        .select('*')
        .eq('month_id', previousMonth.id)
        .order('order_index');

      if (itemsError) throw itemsError;

      const { data: newMonth, error: monthError } = await supabase
        .from('mcc_months')
        .insert({ year: selectedYear, month: selectedMonth })
        .select()
        .single();

      if (monthError) throw monthError;

      if (previousItems && previousItems.length > 0) {
        const newItems = previousItems.map(item => ({
          month_id: newMonth.id,
          category: item.category,
          item: item.item,
          target: item.target,
          status: 'on-track',
          order_index: item.order_index
        }));

        const { error: insertError } = await supabase
          .from('mcc_items')
          .insert(newItems);

        if (insertError) throw insertError;
      }

      setCurrentMonthData(newMonth);
      await loadItems(newMonth.id);
    } catch (error) {
      console.error('Error creating month from last month:', error);
      alert('Er is een fout opgetreden bij het kopieren van de vorige maand.');
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
        <tr className={`${CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS]}`}>
          <td colSpan={11} className="px-4 py-3">
            <div className="flex items-center justify-between">
              <h3 className={`text-sm font-bold ${CATEGORY_TEXT_COLORS[category as keyof typeof CATEGORY_TEXT_COLORS]}`}>
                {category}
              </h3>
              <button
                onClick={() => addItem(category)}
                disabled={!currentMonthData}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-md bg-white hover:bg-gray-50 border-2 ${
                  category === 'LEADS' ? 'border-yellow-400 text-yellow-800' :
                  category === 'KLANTEN' ? 'border-blue-400 text-blue-800' :
                  category === 'FANS' ? 'border-pink-400 text-pink-800' :
                  category === 'CASH' ? 'border-green-400 text-green-800' :
                  category === 'TEAM' ? 'border-purple-400 text-purple-800' :
                  'border-orange-400 text-orange-800'
                } font-semibold transition-all disabled:opacity-50 shadow-sm`}
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
                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors`}
                  >
                    <td className="px-4 py-2">
                      <span className={`inline-block px-2 py-1 text-xs font-bold rounded ${
                        category === 'LEADS' ? 'bg-yellow-100 text-yellow-800' :
                        category === 'KLANTEN' ? 'bg-blue-100 text-blue-800' :
                        category === 'FANS' ? 'bg-pink-100 text-pink-800' :
                        category === 'CASH' ? 'bg-green-100 text-green-800' :
                        category === 'TEAM' ? 'bg-purple-100 text-purple-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {category}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={item.item}
                        onChange={(e) => updateItem(item.id, 'item', e.target.value)}
                        className="w-full min-w-[250px] px-3 py-2 text-sm rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-tielo-orange focus:ring-2 focus:ring-tielo-orange/20 transition-all"
                      />
                    </td>
                    {item.scores.map((score) => (
                      <td key={score.week} className="px-2 py-2">
                        <input
                          type="number"
                          value={score.value}
                          onChange={(e) => updateScore(item.id, score.week, parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-2 text-sm text-center rounded-md border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-tielo-orange focus:ring-2 focus:ring-tielo-orange/20 transition-all"
                        />
                      </td>
                    ))}
                    <td className="px-2 py-2 text-center font-bold text-gray-900 text-sm">
                      {calculateMonthTotal(item.scores)}
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        value={item.target}
                        onChange={(e) => updateItem(item.id, 'target', parseInt(e.target.value) || 0)}
                        className="w-20 px-2 py-2 text-sm text-center rounded-md border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-tielo-orange focus:ring-2 focus:ring-tielo-orange/20 transition-all"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <select
                        value={item.status}
                        onChange={(e) => updateItem(item.id, 'status', e.target.value)}
                        className="w-full min-w-[130px] px-2 py-2 text-xs rounded-md border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-tielo-orange focus:ring-2 focus:ring-tielo-orange/20"
                      >
                        {STATUS_OPTIONS.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 py-2 text-center">
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="p-1.5 rounded-md border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 transition-all"
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tielo-orange"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPage="mcc">
      <div className="space-y-4 md:space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 md:mb-6"
        >
          <h1 className="text-2xl md:text-3xl font-bold font-rubik text-tielo-navy mb-1 md:mb-2">Mission Control Center</h1>
          <p className="text-sm md:text-base text-tielo-navy/60">Beheer je maandelijkse doelen en voortgang</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl md:rounded-2xl border border-gray-200 bg-white shadow-sm p-4 md:p-6 mb-4 md:mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 md:gap-4 justify-center sm:justify-start">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-900 flex-shrink-0"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="px-2 md:px-4 py-2 text-sm md:text-base rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-tielo-orange focus:ring-2 focus:ring-tielo-orange/20 transition-all"
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
                  className="px-2 md:px-4 py-2 text-sm md:text-base rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-tielo-orange focus:ring-2 focus:ring-tielo-orange/20 transition-all"
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
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-900 flex-shrink-0"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {!currentMonthData && (
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                  onClick={createMonth}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-sm md:text-base rounded-xl bg-tielo-orange hover:bg-tielo-orange/90 text-white font-medium transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Nieuwe lege maand</span>
                  <span className="sm:hidden">Leeg</span>
                </button>
                <button
                  onClick={createMonthFromLastMonth}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-sm md:text-base rounded-xl bg-tielo-navy hover:bg-tielo-navy/90 text-white font-medium transition-all shadow-sm"
                >
                  <Copy className="w-4 h-4" />
                  <span className="hidden sm:inline">Kopieer vorige maand</span>
                  <span className="sm:hidden">Kopieer</span>
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {currentMonthData ? (
          <>
            {/* Mobile Card View */}
            <div className="lg:hidden space-y-6">
              {CATEGORIES.map(category => {
                const categoryItems = items.filter(item => item.category === category);
                return (
                  <div key={category} className="space-y-3">
                    <div className={`rounded-xl p-4 ${CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS]}`}>
                      <div className="flex items-center justify-between">
                        <h3 className={`text-base font-bold ${CATEGORY_TEXT_COLORS[category as keyof typeof CATEGORY_TEXT_COLORS]}`}>
                          {category}
                        </h3>
                        <button
                          onClick={() => addItem(category)}
                          disabled={!currentMonthData}
                          className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-white hover:bg-gray-50 border-2 ${
                            category === 'LEADS' ? 'border-yellow-400 text-yellow-800' :
                            category === 'KLANTEN' ? 'border-blue-400 text-blue-800' :
                            category === 'FANS' ? 'border-pink-400 text-pink-800' :
                            category === 'CASH' ? 'border-green-400 text-green-800' :
                            category === 'TEAM' ? 'border-purple-400 text-purple-800' :
                            'border-orange-400 text-orange-800'
                          } font-semibold transition-all disabled:opacity-50 shadow-sm`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Toevoegen
                        </button>
                      </div>
                    </div>

                    {categoryItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-xl border-2 border-gray-200 p-4 space-y-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Item</label>
                            <input
                              type="text"
                              value={item.item}
                              onChange={(e) => updateItem(item.id, 'item', e.target.value)}
                              className="w-full px-3 py-2 text-sm rounded-lg border-2 border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-blue-500 transition-all"
                            />
                          </div>
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="flex-shrink-0 p-2 rounded-lg border-2 border-red-300 bg-red-50 hover:bg-red-100 text-red-700 transition-all mt-6"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-2">Wekelijkse Scores</label>
                          <div className="grid grid-cols-5 gap-2">
                            {item.scores.map((score) => (
                              <div key={score.week}>
                                <label className="block text-xs text-gray-600 mb-1 text-center font-medium">W{score.week}</label>
                                <input
                                  type="number"
                                  value={score.value}
                                  onChange={(e) => updateScore(item.id, score.week, parseInt(e.target.value) || 0)}
                                  className="w-full px-2 py-2 text-sm text-center rounded-lg border-2 border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-blue-500 transition-all"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Maand</label>
                            <div className="px-3 py-2.5 text-sm font-bold text-center rounded-lg bg-gray-100 text-gray-900 border-2 border-gray-300">
                              {calculateMonthTotal(item.scores)}
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Target</label>
                            <input
                              type="number"
                              value={item.target}
                              onChange={(e) => updateItem(item.id, 'target', parseInt(e.target.value) || 0)}
                              className="w-full px-2 py-2 text-sm text-center rounded-lg border-2 border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-blue-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Status</label>
                            <select
                              value={item.status}
                              onChange={(e) => updateItem(item.id, 'status', e.target.value)}
                              className="w-full px-2 py-2 text-xs rounded-lg border-2 border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-blue-500 transition-all"
                            >
                              {STATUS_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {categoryItems.length === 0 && (
                      <div className="text-center py-6 text-gray-500 text-sm bg-white rounded-xl border-2 border-dashed border-gray-300">
                        Geen items in deze categorie
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-100 border-b-2 border-gray-300">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Categorie</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">Item</th>
                      <th className="px-2 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wide">W1</th>
                      <th className="px-2 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wide">W2</th>
                      <th className="px-2 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wide">W3</th>
                      <th className="px-2 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wide">W4</th>
                      <th className="px-2 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wide">W5</th>
                      <th className="px-2 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wide">Maand</th>
                      <th className="px-2 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wide">Target</th>
                      <th className="px-2 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wide">Status</th>
                      <th className="px-2 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wide">Acties</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CATEGORIES.map(category => renderItemsByCategory(category))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
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
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={createMonth}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-tielo-orange hover:bg-tielo-orange/90 text-white font-medium transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Nieuwe lege maand
              </button>
              <button
                onClick={createMonthFromLastMonth}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-tielo-navy hover:bg-tielo-navy/90 text-white font-medium transition-all shadow-sm"
              >
                <Copy className="w-4 h-4" />
                Kopieer vorige maand
              </button>
            </div>
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
