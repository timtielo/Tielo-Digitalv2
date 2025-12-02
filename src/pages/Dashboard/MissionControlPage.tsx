import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/client';
import { Plus, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DashboardLayout } from '../../components/Dashboard/DashboardLayout';
import { ProtectedRoute } from '../../components/Dashboard/ProtectedRoute';

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

const CATEGORIES = ['LEADS', 'KLANTEN', 'CASH'];
const CATEGORY_COLORS = {
  LEADS: 'bg-yellow-50 border-yellow-200',
  KLANTEN: 'bg-blue-50 border-blue-200',
  CASH: 'bg-green-50 border-green-200'
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
      <div key={category} className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">{category}</h3>
          <Button
            onClick={() => addItem(category)}
            variant="outline"
            size="sm"
            disabled={!currentMonthData}
          >
            <Plus className="w-4 h-4 mr-2" />
            Item toevoegen
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse hidden md:table">
            <thead className="sticky top-0 bg-white shadow-sm">
              <tr className="border-b-2 border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Item</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Week 1</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Week 2</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Week 3</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Week 4</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Week 5</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Maand</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Target</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Acties</th>
              </tr>
            </thead>
            <tbody>
              {categoryItems.map((item) => (
                <tr key={item.id} className={`border-b border-gray-100 ${CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS]}`}>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={item.item}
                      onChange={(e) => updateItem(item.id, 'item', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </td>
                  {item.scores.map((score) => (
                    <td key={score.week} className="px-4 py-3">
                      <input
                        type="number"
                        value={score.value}
                        onChange={(e) => updateScore(item.id, score.week, parseInt(e.target.value) || 0)}
                        className="w-20 px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </td>
                  ))}
                  <td className="px-4 py-3 text-center font-bold">
                    {calculateMonthTotal(item.scores)}
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={item.target}
                      onChange={(e) => updateItem(item.id, 'target', parseInt(e.target.value) || 0)}
                      className="w-20 px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={item.status}
                      onChange={(e) => updateItem(item.id, 'status', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {STATUS_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {categoryItems.map((item) => (
              <Card key={item.id} className={CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS]}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={item.item}
                      onChange={(e) => updateItem(item.id, 'item', e.target.value)}
                      className="flex-1 px-2 py-1 font-semibold border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="ml-2 text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {item.scores.map((score) => (
                      <div key={score.week}>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Week {score.week}
                        </label>
                        <input
                          type="number"
                          value={score.value}
                          onChange={(e) => updateScore(item.id, score.week, parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-200">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Maand totaal
                      </label>
                      <div className="px-2 py-1 text-center font-bold bg-white rounded">
                        {calculateMonthTotal(item.scores)}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Target
                      </label>
                      <input
                        type="number"
                        value={item.target}
                        onChange={(e) => updateItem(item.id, 'target', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Status
                      </label>
                      <select
                        value={item.status}
                        onChange={(e) => updateItem(item.id, 'status', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {STATUS_OPTIONS.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Laden...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mission Control Center</h1>
        <p className="text-gray-600">Beheer je maandelijkse doelen en voortgang</p>
      </div>

      <Card className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {!currentMonthData && (
            <Button onClick={createMonth}>
              <Plus className="w-4 h-4 mr-2" />
              Nieuwe maand aanmaken
            </Button>
          )}
        </div>
      </Card>

      {currentMonthData ? (
        <div className="space-y-8">
          {CATEGORIES.map(category => renderItemsByCategory(category))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <p className="text-gray-600 mb-4">
            Er is nog geen data voor {MONTHS[selectedMonth - 1]} {selectedYear}
          </p>
          <Button onClick={createMonth}>
            <Plus className="w-4 h-4 mr-2" />
            Maand aanmaken
          </Button>
        </Card>
      )}
    </div>
  );
}

export function MissionControlPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout currentPage="mcc">
        <MissionControlContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
