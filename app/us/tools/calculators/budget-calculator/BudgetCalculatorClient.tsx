'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color?: string;
  icon?: string;
}

interface Props {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '%' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

interface ExpenseCategory {
  name: string;
  value: number;
  color: string;
  bgColor: string;
  textColor: string;
  category: 'needs' | 'wants' | 'savings';
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Budget Calculator?",
    answer: "A Budget Calculator is a free online tool that helps you calculate and analyze budget-related financial metrics quickly and accurately. It provides instant results to help you make informed financial decisions.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is this Budget Calculator?",
    answer: "Our Budget Calculator uses standard financial formulas and provides highly accurate results. However, actual results may vary based on specific terms, conditions, and market factors. Always consult with a financial advisor for major decisions.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Budget Calculator free to use?",
    answer: "Yes, this Budget Calculator is completely free to use. There are no hidden charges or registration required. You can use it as many times as you need.",
    order: 3
  },
  {
    id: '4',
    question: "Can I save my Budget calculations?",
    answer: "The calculator displays results instantly on screen. You can take a screenshot or note down the results for your records. Some browsers also allow you to print the page.",
    order: 4
  },
  {
    id: '5',
    question: "What information do I need for this calculator?",
    answer: "You'll need basic information related to budget such as amounts, rates, time periods, or other relevant values. The calculator will guide you through each required field.",
    order: 5
  }
];

export default function BudgetCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('budget-calculator');

  const [monthlyIncome, setMonthlyIncome] = useState(5000);
  const [housing, setHousing] = useState(1500);
  const [transportation, setTransportation] = useState(500);
  const [food, setFood] = useState(600);
  const [utilities, setUtilities] = useState(200);
  const [insurance, setInsurance] = useState(300);
  const [healthcare, setHealthcare] = useState(150);
  const [entertainment, setEntertainment] = useState(200);
  const [diningOut, setDiningOut] = useState(150);
  const [subscriptions, setSubscriptions] = useState(50);
  const [savings, setSavings] = useState(400);
  const [debtPayment, setDebtPayment] = useState(200);
  const [other, setOther] = useState(150);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const expenses: ExpenseCategory[] = useMemo(() => [
    { name: 'Housing', value: housing, color: '#3B82F6', bgColor: 'bg-blue-100', textColor: 'text-blue-700', category: 'needs' },
    { name: 'Transportation', value: transportation, color: '#8B5CF6', bgColor: 'bg-purple-100', textColor: 'text-purple-700', category: 'needs' },
    { name: 'Groceries', value: food, color: '#F97316', bgColor: 'bg-orange-100', textColor: 'text-orange-700', category: 'needs' },
    { name: 'Utilities', value: utilities, color: '#EAB308', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700', category: 'needs' },
    { name: 'Insurance', value: insurance, color: '#EC4899', bgColor: 'bg-pink-100', textColor: 'text-pink-700', category: 'needs' },
    { name: 'Healthcare', value: healthcare, color: '#14B8A6', bgColor: 'bg-teal-100', textColor: 'text-teal-700', category: 'needs' },
    { name: 'Entertainment', value: entertainment, color: '#06B6D4', bgColor: 'bg-cyan-100', textColor: 'text-cyan-700', category: 'wants' },
    { name: 'Dining Out', value: diningOut, color: '#F43F5E', bgColor: 'bg-rose-100', textColor: 'text-rose-700', category: 'wants' },
    { name: 'Subscriptions', value: subscriptions, color: '#6366F1', bgColor: 'bg-indigo-100', textColor: 'text-indigo-700', category: 'wants' },
    { name: 'Savings', value: savings, color: '#22C55E', bgColor: 'bg-green-100', textColor: 'text-green-700', category: 'savings' },
    { name: 'Debt Payment', value: debtPayment, color: '#EF4444', bgColor: 'bg-red-100', textColor: 'text-red-700', category: 'savings' },
    { name: 'Other', value: other, color: '#6B7280', bgColor: 'bg-gray-100', textColor: 'text-gray-700', category: 'wants' },
  ], [housing, transportation, food, utilities, insurance, healthcare, entertainment, diningOut, subscriptions, savings, debtPayment, other]);

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.value, 0);
  const remaining = monthlyIncome - totalExpenses;
  const savingsRate = monthlyIncome > 0 ? ((remaining + savings) / monthlyIncome * 100) : 0;

  // 50/30/20 Analysis
  const needsTotal = expenses.filter(e => e.category === 'needs').reduce((sum, e) => sum + e.value, 0);
  const wantsTotal = expenses.filter(e => e.category === 'wants').reduce((sum, e) => sum + e.value, 0);
  const savingsTotal = expenses.filter(e => e.category === 'savings').reduce((sum, e) => sum + e.value, 0) + remaining;

  const needsPercent = monthlyIncome > 0 ? (needsTotal / monthlyIncome * 100) : 0;
  const wantsPercent = monthlyIncome > 0 ? (wantsTotal / monthlyIncome * 100) : 0;
  const savingsPercent = monthlyIncome > 0 ? (savingsTotal / monthlyIncome * 100) : 0;

  // What-if scenarios
  const whatIfScenarios = useMemo(() => {
    const scenarios = [];

    // If you cut entertainment by 50%
    const cutEntertainment = entertainment * 0.5;
    scenarios.push({
      title: 'Cut entertainment by 50%',
      monthlyExtra: cutEntertainment,
      yearlyExtra: cutEntertainment * 12,
      icon: '🎬'
    });

    // If you cut dining out by 50%
    const cutDining = diningOut * 0.5;
    scenarios.push({
      title: 'Cut dining out by 50%',
      monthlyExtra: cutDining,
      yearlyExtra: cutDining * 12,
      icon: '🍽️'
    });

    // If you cancel subscriptions
    scenarios.push({
      title: 'Cancel all subscriptions',
      monthlyExtra: subscriptions,
      yearlyExtra: subscriptions * 12,
      icon: '📺'
    });

    // Combined savings
    const combined = cutEntertainment + cutDining + subscriptions;
    scenarios.push({
      title: 'All of the above',
      monthlyExtra: combined,
      yearlyExtra: combined * 12,
      icon: '💰'
    });

    return scenarios;
  }, [entertainment, diningOut, subscriptions]);

  // Donut Chart
  const donutChart = useMemo(() => {
    const activeExpenses = expenses.filter(e => e.value > 0);
    const total = activeExpenses.reduce((sum, e) => sum + e.value, 0);
    if (total === 0) return { segments: [], total: 0 };

    let currentAngle = -90;
    const segments = activeExpenses.map((expense) => {
      const percentage = (expense.value / total) * 100;
      const angle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      currentAngle += angle;

      const startRad = (startAngle * Math.PI) / 180;
      const endRad = ((startAngle + angle) * Math.PI) / 180;

      const x1 = 100 + 80 * Math.cos(startRad);
      const y1 = 100 + 80 * Math.sin(startRad);
      const x2 = 100 + 80 * Math.cos(endRad);
      const y2 = 100 + 80 * Math.sin(endRad);

      const largeArc = angle > 180 ? 1 : 0;

      return {
        name: expense.name,
        value: expense.value,
        percentage,
        color: expense.color,
        path: `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`
      };
    });

    return { segments, total };
  }, [expenses]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const budgetTemplates = [
    { name: 'Entry Level', income: 3500, housing: 1000, transport: 300, food: 400, utilities: 150, insurance: 200, healthcare: 100, entertainment: 100, dining: 100, subs: 30, savings: 200, debt: 100, other: 100 },
    { name: 'Mid Career', income: 6000, housing: 1800, transport: 500, food: 600, utilities: 200, insurance: 350, healthcare: 200, entertainment: 250, dining: 200, subs: 60, savings: 600, debt: 300, other: 200 },
    { name: 'High Earner', income: 12000, housing: 3000, transport: 800, food: 800, utilities: 300, insurance: 500, healthcare: 300, entertainment: 500, dining: 400, subs: 100, savings: 2000, debt: 500, other: 300 },
    { name: 'Aggressive Saver', income: 5000, housing: 1200, transport: 300, food: 400, utilities: 150, insurance: 200, healthcare: 100, entertainment: 50, dining: 50, subs: 20, savings: 1500, debt: 200, other: 50 },
  ];

  const applyTemplate = (template: typeof budgetTemplates[0]) => {
    setMonthlyIncome(template.income);
    setHousing(template.housing);
    setTransportation(template.transport);
    setFood(template.food);
    setUtilities(template.utilities);
    setInsurance(template.insurance);
    setHealthcare(template.healthcare);
    setEntertainment(template.entertainment);
    setDiningOut(template.dining);
    setSubscriptions(template.subs);
    setSavings(template.savings);
    setDebtPayment(template.debt);
    setOther(template.other);
  };

  const faqItems = [
    { id: 'faq-' + Math.random().toString(36).substr(2, 9), question: "What is the 50/30/20 budget rule?",
      answer: "The 50/30/20 rule is a simple budgeting guideline that suggests allocating 50% of your after-tax income to needs (housing, utilities, groceries, insurance), 30% to wants (entertainment, dining out, subscriptions), and 20% to savings and debt repayment. This framework helps create a balanced budget that covers essentials while still allowing for enjoyment and financial growth."
    },
    { id: 'faq-' + Math.random().toString(36).substr(2, 9), question: "How much should I spend on housing?",
      answer: "Financial experts generally recommend spending no more than 28-30% of your gross monthly income on housing costs, including rent or mortgage, property taxes, and homeowner's insurance. If you live in a high cost-of-living area, you may need to allocate more, but try to compensate by reducing spending in other categories."
    },
    { id: 'faq-' + Math.random().toString(36).substr(2, 9), question: "What percentage of my income should I save?",
      answer: "A common recommendation is to save at least 20% of your income, but this varies based on your goals and circumstances. If you're paying off high-interest debt, you might prioritize that first. If you're saving for retirement, aim for 15% minimum including employer contributions. For emergency funds, aim for 3-6 months of expenses."
    },
    { id: 'faq-' + Math.random().toString(36).substr(2, 9), question: "How can I reduce my monthly expenses?",
      answer: "Start by reviewing subscriptions and memberships you don't use regularly. Consider meal planning to reduce food waste and dining out expenses. Shop around for better insurance rates annually. Use energy-efficient practices to lower utility bills. Consider carpooling or public transit to reduce transportation costs. Small changes across multiple categories can add up significantly."
    },
    { id: 'faq-' + Math.random().toString(36).substr(2, 9), question: "What's the difference between a budget and a spending plan?",
      answer: "While often used interchangeably, a budget typically focuses on limiting spending within set categories, while a spending plan takes a more positive approach by prioritizing where your money goes based on your values and goals. A spending plan emphasizes intentional spending rather than restriction, which can make it easier to stick with long-term."
    }
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-2 sm:px-2 py-4 sm:py-6 md:py-8">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Budget Calculator')}</h1>
        <p className="text-lg text-gray-600">Plan your monthly budget, track expenses, and analyze your spending patterns</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Budget Templates */}

      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Quick Budget Templates</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {budgetTemplates.map((template) => (
            <button
              key={template.name}
              onClick={() => applyTemplate(template)}
              className="p-3 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-left"
            >
              <div className="font-semibold text-gray-800">{template.name}</div>
              <div className="text-sm text-gray-500">{formatCurrency(template.income)}/mo</div>
            </button>
          ))}
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />


      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Income & Expenses</h2>

            {/* Income */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <label className="block text-sm font-medium text-green-700 mb-2">
                Monthly Income: {formatCurrency(monthlyIncome)}
              </label>
              <input
                type="range"
                min="1000"
                max="25000"
                step="100"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(parseInt(e.target.value))}
                className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-green-600 mt-1">
                <span>$1K</span>
                <span>$25K</span>
              </div>
            </div>

            {/* Needs Section */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-blue-700 mb-3">Needs (Essential)</h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Housing: {formatCurrency(housing)}
                  </label>
                  <input
                    type="range" min="0" max="6000" step="50" value={housing}
                    onChange={(e) => setHousing(parseInt(e.target.value))}
                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Transportation: {formatCurrency(transportation)}
                  </label>
                  <input
                    type="range" min="0" max="1500" step="25" value={transportation}
                    onChange={(e) => setTransportation(parseInt(e.target.value))}
                    className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Groceries: {formatCurrency(food)}
                  </label>
                  <input
                    type="range" min="0" max="1500" step="25" value={food}
                    onChange={(e) => setFood(parseInt(e.target.value))}
                    className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Utilities: {formatCurrency(utilities)}
                  </label>
                  <input
                    type="range" min="0" max="500" step="25" value={utilities}
                    onChange={(e) => setUtilities(parseInt(e.target.value))}
                    className="w-full h-2 bg-yellow-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Insurance: {formatCurrency(insurance)}
                  </label>
                  <input
                    type="range" min="0" max="1000" step="25" value={insurance}
                    onChange={(e) => setInsurance(parseInt(e.target.value))}
                    className="w-full h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Healthcare: {formatCurrency(healthcare)}
                  </label>
                  <input
                    type="range" min="0" max="500" step="25" value={healthcare}
                    onChange={(e) => setHealthcare(parseInt(e.target.value))}
                    className="w-full h-2 bg-teal-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Wants Section */}
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-semibold text-orange-700 mb-3">Wants (Discretionary)</h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Entertainment: {formatCurrency(entertainment)}
                  </label>
                  <input
                    type="range" min="0" max="500" step="25" value={entertainment}
                    onChange={(e) => setEntertainment(parseInt(e.target.value))}
                    className="w-full h-2 bg-cyan-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Dining Out: {formatCurrency(diningOut)}
                  </label>
                  <input
                    type="range" min="0" max="500" step="25" value={diningOut}
                    onChange={(e) => setDiningOut(parseInt(e.target.value))}
                    className="w-full h-2 bg-rose-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Subscriptions: {formatCurrency(subscriptions)}
                  </label>
                  <input
                    type="range" min="0" max="200" step="10" value={subscriptions}
                    onChange={(e) => setSubscriptions(parseInt(e.target.value))}
                    className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Other: {formatCurrency(other)}
                  </label>
                  <input
                    type="range" min="0" max="500" step="25" value={other}
                    onChange={(e) => setOther(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Savings Section */}
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-green-700 mb-3">Savings & Debt</h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Savings/Investments: {formatCurrency(savings)}
                  </label>
                  <input
                    type="range" min="0" max="3000" step="50" value={savings}
                    onChange={(e) => setSavings(parseInt(e.target.value))}
                    className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Debt Payment: {formatCurrency(debtPayment)}
                  </label>
                  <input
                    type="range" min="0" max="1500" step="50" value={debtPayment}
                    onChange={(e) => setDebtPayment(parseInt(e.target.value))}
                    className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Budget Summary</h2>

            {/* Donut Chart */}
            <div className="mb-3 sm:mb-4 md:mb-6 flex flex-col items-center">
              <div className="relative">
                <svg width="200" height="200" viewBox="0 0 200 200">
                  {donutChart.segments.map((segment, index) => (
                    <path
                      key={index}
                      d={segment.path}
                      fill={segment.color}
                      opacity={hoveredCategory === segment.name || !hoveredCategory ? 1 : 0.4}
                      onMouseEnter={() => setHoveredCategory(segment.name)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      className="cursor-pointer transition-opacity duration-200"
                    />
                  ))}
                  <circle cx="100" cy="100" r="50" fill="white" />
                  <text x="100" y="95" textAnchor="middle" className="text-sm font-bold fill-gray-700">
                    {hoveredCategory || 'Total'}
                  </text>
                  <text x="100" y="115" textAnchor="middle" className="text-lg font-bold fill-gray-800">
                    {formatCurrency(hoveredCategory ? expenses.find(e => e.name === hoveredCategory)?.value || 0 : totalExpenses)}
                  </text>
                </svg>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-3 gap-2 mt-4 w-full">
                {expenses.filter(e => e.value > 0).map((expense) => (
                  <div
                    key={expense.name}
                    className={`flex items-center gap-1 p-1 rounded cursor-pointer transition-all ${hoveredCategory === expense.name ? 'bg-gray-100' : ''}`}
                    onMouseEnter={() => setHoveredCategory(expense.name)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: expense.color }}></div>
                    <span className="text-xs text-gray-600 truncate">{expense.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Cards */}
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="text-sm text-green-600 mb-1">Monthly Income</div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-700">{formatCurrency(monthlyIncome)}</div>
              </div>

              <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
                <div className="text-sm text-red-600 mb-1">Total Expenses</div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-red-700">{formatCurrency(totalExpenses)}</div>
              </div>

              <div className={`p-4 rounded-lg border ${remaining >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-red-100 border-red-300'}`}>
                <div className={`text-sm mb-1 ${remaining >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {remaining >= 0 ? 'Unallocated / Extra Savings' : 'Over Budget'}
                </div>
                <div className={`text-3xl font-bold ${remaining >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                  {formatCurrency(Math.abs(remaining))}
                </div>
                {remaining >= 0 && (
                  <div className="text-sm text-blue-600 mt-1">
                    Total savings rate: {savingsRate.toFixed(1)}%
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 50/30/20 Analysis */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">50/30/20 Budget Analysis</h2>
        <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6">Compare your spending to the recommended 50/30/20 rule</p>

        <div className="grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-blue-700">Needs</h3>
              <span className={`text-xs px-2 py-1 rounded ${needsPercent <= 50 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {needsPercent <= 50 ? 'On Track' : 'Over'}
              </span>
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-700">{needsPercent.toFixed(1)}%</div>
            <div className="text-sm text-blue-600">{formatCurrency(needsTotal)} / {formatCurrency(monthlyIncome * 0.5)} target</div>
            <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full ${needsPercent <= 50 ? 'bg-blue-600' : 'bg-red-500'}`}
                style={{ width: `${Math.min(needsPercent * 2, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-orange-700">Wants</h3>
              <span className={`text-xs px-2 py-1 rounded ${wantsPercent <= 30 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {wantsPercent <= 30 ? 'On Track' : 'Over'}
              </span>
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-700">{wantsPercent.toFixed(1)}%</div>
            <div className="text-sm text-orange-600">{formatCurrency(wantsTotal)} / {formatCurrency(monthlyIncome * 0.3)} target</div>
            <div className="w-full bg-orange-200 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full ${wantsPercent <= 30 ? 'bg-orange-600' : 'bg-red-500'}`}
                style={{ width: `${Math.min(wantsPercent * 3.33, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-green-700">Savings</h3>
              <span className={`text-xs px-2 py-1 rounded ${savingsPercent >= 20 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {savingsPercent >= 20 ? 'On Track' : 'Below'}
              </span>
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-700">{savingsPercent.toFixed(1)}%</div>
            <div className="text-sm text-green-600">{formatCurrency(savingsTotal)} / {formatCurrency(monthlyIncome * 0.2)} target</div>
            <div className="w-full bg-green-200 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full ${savingsPercent >= 20 ? 'bg-green-600' : 'bg-yellow-500'}`}
                style={{ width: `${Math.min(savingsPercent * 5, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
{/* What-If Scenarios */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">What If Scenarios</h2>
        <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6">See how small changes could impact your savings</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {whatIfScenarios.map((scenario, index) => (
            <div key={index} className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
              <div className="text-2xl mb-2">{scenario.icon}</div>
              <h3 className="font-semibold text-purple-800 mb-2">{scenario.title}</h3>
              <div className="text-sm text-purple-600">
                <div>+{formatCurrency(scenario.monthlyExtra)}/month</div>
                <div className="font-bold text-purple-700">+{formatCurrency(scenario.yearlyExtra)}/year</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Expense Breakdown Table */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Detailed Expense Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 font-semibold text-gray-700">Category</th>
                <th className="text-right py-2 px-3 font-semibold text-gray-700">Amount</th>
                <th className="text-right py-2 px-3 font-semibold text-gray-700">% of Income</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-700">Type</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.name} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: expense.color }}></div>
                      {expense.name}
                    </div>
                  </td>
                  <td className="text-right py-2 px-3 font-medium">{formatCurrency(expense.value)}</td>
                  <td className="text-right py-2 px-3">{monthlyIncome > 0 ? ((expense.value / monthlyIncome) * 100).toFixed(1) : 0}%</td>
                  <td className="py-2 px-3">
                    <span className={`text-xs px-2 py-1 rounded ${
                      expense.category === 'needs' ? 'bg-blue-100 text-blue-700' :
                      expense.category === 'wants' ? 'bg-orange-100 text-orange-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-semibold">
                <td className="py-2 px-3">Total</td>
                <td className="text-right py-2 px-3">{formatCurrency(totalExpenses)}</td>
                <td className="text-right py-2 px-3">{monthlyIncome > 0 ? ((totalExpenses / monthlyIncome) * 100).toFixed(1) : 0}%</td>
                <td className="py-2 px-3"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Related Calculators - Moved above SEO and FAQs */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Budget Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-lg p-4 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <div className="text-2xl mb-2">💰</div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {calc.title}
                </h3>
                <p className="text-xs text-gray-600">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8 prose prose-gray max-w-none">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">The Complete Guide to Personal Budgeting</h2>
        <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
          Creating and maintaining a budget is the foundation of financial health. A well-designed budget helps you understand where your money goes, identify opportunities to save, and work toward your financial goals. Whether you're managing a tight income or optimizing a generous salary, budgeting principles remain the same: track every dollar, prioritize needs over wants, and pay yourself first through savings.
        </p>

        <div className="grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
          <div className="bg-blue-50 rounded-xl p-5">
            <h3 className="font-semibold text-blue-800 mb-2">The 50/30/20 Rule</h3>
            <p className="text-sm text-gray-600 mb-3">A simple framework for balanced budgeting:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li><strong>50%</strong> - Needs (housing, food, utilities)</li>
              <li><strong>30%</strong> - Wants (entertainment, dining)</li>
              <li><strong>20%</strong> - Savings & debt repayment</li>
            </ul>
          </div>
          <div className="bg-green-50 rounded-xl p-5">
            <h3 className="font-semibold text-green-800 mb-2">Zero-Based Budgeting</h3>
            <p className="text-sm text-gray-600 mb-3">Every dollar has a job:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>Income minus expenses equals zero</li>
              <li>Assign purpose to all income</li>
              <li>Adjust categories as needed</li>
              <li>No "leftover" money floating around</li>
            </ul>
          </div>
          <div className="bg-purple-50 rounded-xl p-5">
            <h3 className="font-semibold text-purple-800 mb-2">Pay Yourself First</h3>
            <p className="text-sm text-gray-600 mb-3">Prioritize savings before spending:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>Automate savings transfers</li>
              <li>Treat savings as non-negotiable</li>
              <li>Build emergency fund first</li>
              <li>Increase savings with raises</li>
            </ul>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommended Budget Percentages by Category</h2>
        <div className="overflow-x-auto mb-4 sm:mb-6 md:mb-8">
          <table className="w-full border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-4 py-3 text-left font-semibold">Category</th>
                <th className="border border-gray-200 px-4 py-3 text-center font-semibold">Recommended %</th>
                <th className="border border-gray-200 px-4 py-3 text-center font-semibold">$5,000 Income</th>
                <th className="border border-gray-200 px-4 py-3 text-center font-semibold">$8,000 Income</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-4 py-3">Housing (rent/mortgage)</td>
                <td className="border border-gray-200 px-4 py-3 text-center">25-30%</td>
                <td className="border border-gray-200 px-4 py-3 text-center">$1,250-$1,500</td>
                <td className="border border-gray-200 px-4 py-3 text-center">$2,000-$2,400</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-200 px-4 py-3">Transportation</td>
                <td className="border border-gray-200 px-4 py-3 text-center">10-15%</td>
                <td className="border border-gray-200 px-4 py-3 text-center">$500-$750</td>
                <td className="border border-gray-200 px-4 py-3 text-center">$800-$1,200</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-4 py-3">Food (groceries + dining)</td>
                <td className="border border-gray-200 px-4 py-3 text-center">10-15%</td>
                <td className="border border-gray-200 px-4 py-3 text-center">$500-$750</td>
                <td className="border border-gray-200 px-4 py-3 text-center">$800-$1,200</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-200 px-4 py-3">Insurance & Healthcare</td>
                <td className="border border-gray-200 px-4 py-3 text-center">5-10%</td>
                <td className="border border-gray-200 px-4 py-3 text-center">$250-$500</td>
                <td className="border border-gray-200 px-4 py-3 text-center">$400-$800</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-4 py-3">Utilities</td>
                <td className="border border-gray-200 px-4 py-3 text-center">5-10%</td>
                <td className="border border-gray-200 px-4 py-3 text-center">$250-$500</td>
                <td className="border border-gray-200 px-4 py-3 text-center">$400-$800</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-200 px-4 py-3">Savings & Investments</td>
                <td className="border border-gray-200 px-4 py-3 text-center font-semibold text-green-600">15-20%</td>
                <td className="border border-gray-200 px-4 py-3 text-center">$750-$1,000</td>
                <td className="border border-gray-200 px-4 py-3 text-center">$1,200-$1,600</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-4 py-3">Debt Repayment</td>
                <td className="border border-gray-200 px-4 py-3 text-center">5-10%</td>
                <td className="border border-gray-200 px-4 py-3 text-center">$250-$500</td>
                <td className="border border-gray-200 px-4 py-3 text-center">$400-$800</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-200 px-4 py-3">Personal & Entertainment</td>
                <td className="border border-gray-200 px-4 py-3 text-center">5-10%</td>
                <td className="border border-gray-200 px-4 py-3 text-center">$250-$500</td>
                <td className="border border-gray-200 px-4 py-3 text-center">$400-$800</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8 mb-4 sm:mb-6 md:mb-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Tips for Sticking to Your Budget</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span><strong>Track Everything:</strong> Use apps or spreadsheets to record every expense, no matter how small</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span><strong>Use Cash Envelopes:</strong> Allocate physical cash for discretionary spending to avoid overspending</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span><strong>Review Weekly:</strong> Check your spending every week to catch problems early</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span><strong>Build in Buffer:</strong> Include a small "miscellaneous" category for unexpected expenses</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span><strong>Automate Savings:</strong> Set up automatic transfers on payday before you can spend the money</span>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Common Budgeting Mistakes</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span><strong>Being Too Restrictive:</strong> Budgets that leave no room for fun are hard to maintain</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span><strong>Forgetting Irregular Expenses:</strong> Annual subscriptions, car maintenance, and gifts need planning</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span><strong>No Emergency Fund:</strong> Without savings, unexpected costs derail your entire budget</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span><strong>Not Adjusting:</strong> Life changes require budget adjustments - review quarterly at minimum</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span><strong>Ignoring Small Expenses:</strong> Daily coffee, subscriptions, and impulse buys add up quickly</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-amber-50 rounded-xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
          <h3 className="font-semibold text-amber-800 mb-3">The Power of Small Savings: Real Numbers</h3>
          <div className="grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 text-sm text-gray-700">
            <div>
              <p className="font-medium mb-2">Daily Coffee ($5/day)</p>
              <ul className="space-y-1">
                <li>Weekly: $35</li>
                <li>Monthly: $150</li>
                <li>Yearly: <strong>$1,825</strong></li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-2">Lunch Out ($15/day)</p>
              <ul className="space-y-1">
                <li>Weekly: $75</li>
                <li>Monthly: $325</li>
                <li>Yearly: <strong>$3,900</strong></li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-2">Streaming Services ($50/mo)</p>
              <ul className="space-y-1">
                <li>Quarterly: $150</li>
                <li>Yearly: <strong>$600</strong></li>
                <li>5 Years: $3,000</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqItems.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg">
              <button
                className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50"
                onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
              >
                <span className="font-medium text-gray-800">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${openFaqIndex === index ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaqIndex === index && (
                <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="budget-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
