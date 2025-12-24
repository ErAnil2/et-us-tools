'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePageSEO, generateWebAppSchema } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
import { SidebarMrec1, SidebarMrec2, MobileBelowSubheadingBanner, GameAppMobileMrec1, GameAppMobileMrec2 } from '@/components/BannerPlacements';

const fallbackFaqs = [
  {
    id: '1',
    question: 'How do I track my expenses?',
    answer: 'Simply add each expense with a description, amount, category, and date. The tracker automatically calculates totals and shows spending breakdowns by category.',
    order: 1
  },
  {
    id: '2',
    question: 'Can I set a monthly budget?',
    answer: 'Yes! Set your monthly budget to see how much you\'ve spent vs. your limit. The tracker shows a progress bar and alerts when you\'re approaching or exceeding your budget.',
    order: 2
  },
  {
    id: '3',
    question: 'What expense categories are available?',
    answer: 'We provide common categories like Food, Transport, Shopping, Bills, Entertainment, Health, and Others. These cover most typical personal expenses.',
    order: 3
  },
  {
    id: '4',
    question: 'Is my financial data secure?',
    answer: 'All data is stored locally in your browser and never sent to any server. Your financial information remains completely private on your device.',
    order: 4
  },
  {
    id: '5',
    question: 'Can I export my expense data?',
    answer: 'Yes! You can export your expenses as a JSON file for backup or analysis in other tools. You can also import previously exported data.',
    order: 5
  },
  {
    id: '6',
    question: 'Does the data sync across devices?',
    answer: 'Data is stored locally, so it doesn\'t automatically sync across devices. Use the export/import feature to transfer your expense history between devices.',
    order: 6
  }
];

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

const CATEGORIES = [
  { name: 'Food', icon: '🍔', color: 'bg-orange-100 text-orange-700' },
  { name: 'Transport', icon: '🚗', color: 'bg-blue-100 text-blue-700' },
  { name: 'Shopping', icon: '🛍️', color: 'bg-pink-100 text-pink-700' },
  { name: 'Bills', icon: '📄', color: 'bg-yellow-100 text-yellow-700' },
  { name: 'Entertainment', icon: '🎬', color: 'bg-purple-100 text-purple-700' },
  { name: 'Health', icon: '🏥', color: 'bg-red-100 text-red-700' },
  { name: 'Other', icon: '📦', color: 'bg-gray-100 text-gray-700' },
];

const relatedTools = [
  { name: 'Basic Calculator', path: '/us/tools/apps/basic-calculator', icon: '🧮', color: 'bg-blue-100' },
  { name: 'Tip Calculator', path: '/us/tools/calculators/tip-calculator', icon: '💵', color: 'bg-green-100' },
  { name: 'Mortgage Calculator', path: '/us/tools/calculators/mortgage-calculator', icon: '🏠', color: 'bg-purple-100' },
  { name: 'Loan Calculator', path: '/us/tools/calculators/loan-calculator', icon: '💰', color: 'bg-orange-100' },
];

export default function ExpenseTrackerClient() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budget, setBudget] = useState(1000);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7));

  const { getH1, getSubHeading, getFaqs, faqSchema } = usePageSEO('expense-tracker');

  const webAppSchema = generateWebAppSchema(
    'Expense Tracker - Free Budget & Spending App',
    'Track your expenses and manage your budget. Free online expense tracker with categories, charts, and export features. No signup required.',
    'https://economictimes.indiatimes.com/us/tools/apps/expense-tracker',
    'FinanceApplication'
  );

  // Load data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('expense-tracker-data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setExpenses(parsed.expenses || []);
        setBudget(parsed.budget || 1000);
      } catch (e) {
        console.error('Failed to load expenses');
      }
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('expense-tracker-data', JSON.stringify({ expenses, budget }));
  }, [expenses, budget]);

  const addExpense = () => {
    if (!description.trim() || !amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid description and amount');
      return;
    }

    const newExpense: Expense = {
      id: Date.now().toString(),
      description: description.trim(),
      amount: parseFloat(amount),
      category,
      date };

    setExpenses([newExpense, ...expenses]);
    setDescription('');
    setAmount('');
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  // Filtered expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const matchesCategory = filterCategory === 'All' || expense.category === filterCategory;
      const matchesMonth = expense.date.startsWith(filterMonth);
      return matchesCategory && matchesMonth;
    });
  }, [expenses, filterCategory, filterMonth]);

  // Calculate totals
  const monthlyTotal = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  const categoryTotals = useMemo(() => {
    const totals: { [key: string]: number } = {};
    filteredExpenses.forEach(e => {
      totals[e.category] = (totals[e.category] || 0) + e.amount;
    });
    return Object.entries(totals)
      .map(([cat, total]) => ({ category: cat, total }))
      .sort((a, b) => b.total - a.total);
  }, [filteredExpenses]);

  const budgetPercentage = Math.min((monthlyTotal / budget) * 100, 100);

  const exportData = () => {
    const data = JSON.stringify({ expenses, budget }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses-${filterMonth}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (imported.expenses) {
          setExpenses([...imported.expenses, ...expenses]);
        }
        if (imported.budget) {
          setBudget(imported.budget);
        }
      } catch (e) {
        alert('Failed to import data. Invalid file format.');
      }
    };
    reader.readAsText(file);
  };

  const getCategoryInfo = (name: string) => {
    return CATEGORIES.find(c => c.name === name) || CATEGORIES[CATEGORIES.length - 1];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-100 to-emerald-100 px-6 py-3 rounded-full mb-4">
          <span className="text-2xl">💰</span>
          <span className="text-green-600 font-semibold">Expense Tracker</span>
        </div>

        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
          {getH1('Expense Tracker')}
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {getSubHeading('Track spending, set budgets, and understand where your money goes. All data stays private in your browser.')}
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Mobile Stats Bar */}
      <div className="lg:hidden mb-6">
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-3 text-center text-white">
            <div className="text-lg font-bold">{formatCurrency(monthlyTotal)}</div>
            <div className="text-xs opacity-80">Spent</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-3 text-center text-white">
            <div className="text-lg font-bold">{formatCurrency(budget)}</div>
            <div className="text-xs opacity-80">Budget</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-3 text-center text-white">
            <div className="text-lg font-bold">{filteredExpenses.length}</div>
            <div className="text-xs opacity-80">Expenses</div>
          </div>
          <div className={`rounded-xl p-3 text-center text-white ${budgetPercentage > 90 ? 'bg-gradient-to-br from-red-500 to-rose-600' : 'bg-gradient-to-br from-orange-500 to-amber-600'}`}>
            <div className="text-lg font-bold">{budgetPercentage.toFixed(0)}%</div>
            <div className="text-xs opacity-80">Used</div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Add Expense Form */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Add Expense</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What did you spend on?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.name} value={cat.name}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
            <button
              onClick={addExpense}
              className="mt-4 w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-[1.02]"
            >
              + Add Expense
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Month</label>
                <input
                  type="month"
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 text-right">
                <div className="text-sm text-gray-500">Filtered Total</div>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(monthlyTotal)}</div>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          {categoryTotals.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Spending by Category</h3>
              <div className="space-y-3">
                {categoryTotals.map(({ category: cat, total }) => {
                  const catInfo = getCategoryInfo(cat);
                  const percentage = (total / monthlyTotal) * 100;
                  return (
                    <div key={cat} className="flex items-center gap-3">
                      <span className="text-2xl w-10">{catInfo.icon}</span>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium text-gray-800">{cat}</span>
                          <span className="text-gray-600">{formatCurrency(total)}</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 w-12 text-right">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Expenses List */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Recent Expenses ({filteredExpenses.length})
            </h3>

            {filteredExpenses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📝</div>
                No expenses for this period. Add one to get started!
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {filteredExpenses.map(expense => {
                  const catInfo = getCategoryInfo(expense.category);
                  return (
                    <div
                      key={expense.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-2xl">{catInfo.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{expense.description}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${catInfo.color}`}>
                            {expense.category}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-800">{formatCurrency(expense.amount)}</div>
                        <button
                          onClick={() => deleteExpense(expense.id)}
                          className="text-sm text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
{/* Sidebar */}
        <div className="w-full lg:w-[320px] flex-shrink-0 space-y-6">
            {/* MREC1 - Top of sidebar (Desktop only) */}
            <SidebarMrec1 />
{/* Desktop Stats */}
          <div className="hidden lg:block bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 text-white">
            <h3 className="font-semibold mb-4 text-green-100">Budget Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-green-100">Monthly Budget</span>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="100"
                  className="w-24 px-2 py-1 bg-white/20 border border-white/30 rounded-lg text-white text-center font-bold"
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-100">Total Spent</span>
                <span className="font-bold text-xl">{formatCurrency(monthlyTotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-100">Remaining</span>
                <span className={`font-bold text-xl ${monthlyTotal > budget ? 'text-red-300' : 'text-green-200'}`}>
                  {formatCurrency(budget - monthlyTotal)}
                </span>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-green-200">Budget Used</span>
                  <span className="text-green-200">{budgetPercentage.toFixed(0)}%</span>
                </div>
                <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      budgetPercentage > 90 ? 'bg-red-400' :
                      budgetPercentage > 70 ? 'bg-yellow-400' : 'bg-green-300'
                    }`}
                    style={{ width: `${budgetPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Data Management</h3>
            <div className="flex gap-2">
              <button
                onClick={exportData}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-xl font-medium hover:from-green-200 hover:to-emerald-200 transition-colors"
              >
                📤 Export
              </button>
              <label className="flex-1 cursor-pointer">
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                />
                <span className="block text-center px-4 py-3 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-xl font-medium hover:from-blue-200 hover:to-indigo-200 transition-colors">
                  📥 Import
                </span>
              </label>
            </div>
          </div>
{/* Related Tools */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Related Tools</h3>
            <div className="space-y-3">
              {relatedTools.map((tool) => (
                <Link
                  key={tool.path}
                  href={tool.path}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className={`w-10 h-10 ${tool.color} rounded-xl flex items-center justify-center text-lg group-hover:scale-110 transition-transform`}>
                    {tool.icon}
                  </div>
                  <span className="font-medium text-gray-700 group-hover:text-green-600 transition-colors">
                    {tool.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
{/* Quick Tips */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6">
            <h3 className="font-semibold text-green-800 mb-3">Budget Tips</h3>
            <ul className="space-y-2 text-sm text-green-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">💡</span>
                <span>Follow the 50/30/20 rule: needs, wants, savings</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">📊</span>
                <span>Review spending weekly to stay on track</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">🎯</span>
                <span>Set realistic budgets based on past spending</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">💾</span>
                <span>Export data regularly for backup</span>
              </li>
            </ul>
          </div>
        </div>

            {/* MREC2 - After 2 widgets (Desktop only) */}
            <SidebarMrec2 />
      </div>

      

      {/* Mobile MREC2 - Before FAQs */}


      

      <GameAppMobileMrec2 />



      

      {/* FAQs Section */}
      <div className="mt-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="expense-tracker" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
