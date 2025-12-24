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

interface Debt {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
}

interface PayoffScheduleItem {
  month: number;
  totalBalance: number;
  totalPaid: number;
  totalInterest: number;
  debtsRemaining: number;
}

interface PayoffResult {
  months: number;
  totalInterest: number;
  totalPaid: number;
  schedule: PayoffScheduleItem[];
  debtOrder: string[];
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Debt Payoff Calculator?",
    answer: "A Debt Payoff Calculator is a free online tool designed to help you quickly and accurately calculate debt payoff-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Debt Payoff Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Debt Payoff Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Debt Payoff Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function DebtPayoffClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('debt-payoff-calculator');

  const [debts, setDebts] = useState<Debt[]>([
    { id: '1', name: 'Credit Card 1', balance: 5000, interestRate: 22.99, minimumPayment: 150 },
    { id: '2', name: 'Credit Card 2', balance: 3500, interestRate: 18.99, minimumPayment: 100 },
    { id: '3', name: 'Personal Loan', balance: 8000, interestRate: 12.5, minimumPayment: 200 },
  ]);
  const [extraPayment, setExtraPayment] = useState(200);
  const [strategy, setStrategy] = useState<'avalanche' | 'snowball'>('avalanche');
  const [hoveredDebt, setHoveredDebt] = useState<string | null>(null);
  const [hoveredChart, setHoveredChart] = useState<number | null>(null);

  const totalBalance = useMemo(() => debts.reduce((sum, d) => sum + d.balance, 0), [debts]);
  const totalMinPayment = useMemo(() => debts.reduce((sum, d) => sum + d.minimumPayment, 0), [debts]);
  const weightedAvgRate = useMemo(() => {
    if (totalBalance === 0) return 0;
    return debts.reduce((sum, d) => sum + (d.interestRate * d.balance), 0) / totalBalance;
  }, [debts, totalBalance]);

  const addDebt = () => {
    const newId = (Math.max(...debts.map(d => parseInt(d.id)), 0) + 1).toString();
    setDebts([...debts, {
      id: newId,
      name: `Debt ${newId}`,
      balance: 1000,
      interestRate: 15,
      minimumPayment: 50
    }]);
  };

  const removeDebt = (id: string) => {
    if (debts.length > 1) {
      setDebts(debts.filter(d => d.id !== id));
    }
  };

  const updateDebt = (id: string, field: keyof Debt, value: string | number) => {
    setDebts(debts.map(d =>
      d.id === id ? { ...d, [field]: value } : d
    ));
  };

  const calculatePayoff = (method: 'avalanche' | 'snowball'): PayoffResult => {
    if (debts.length === 0 || totalBalance === 0) {
      return { months: 0, totalInterest: 0, totalPaid: 0, schedule: [], debtOrder: [] };
    }

    const sortedDebts = [...debts].sort((a, b) => {
      if (method === 'avalanche') {
        return b.interestRate - a.interestRate;
      } else {
        return a.balance - b.balance;
      }
    });

    const debtOrder = sortedDebts.map(d => d.name);
    const balances = new Map(sortedDebts.map(d => [d.id, d.balance]));
    const schedule: PayoffScheduleItem[] = [];
    let month = 0;
    let totalInterest = 0;
    let totalPaid = 0;
    const maxMonths = 600;

    while ([...balances.values()].some(b => b > 0.01) && month < maxMonths) {
      month++;
      let monthlyExtra = extraPayment;
      let monthInterest = 0;
      let monthPaid = 0;

      for (const debt of sortedDebts) {
        let balance = balances.get(debt.id) || 0;
        if (balance <= 0) continue;

        const monthlyRate = debt.interestRate / 100 / 12;
        const interest = balance * monthlyRate;
        monthInterest += interest;
        balance += interest;

        let payment = debt.minimumPayment;
        const isTargetDebt = sortedDebts.find(d => (balances.get(d.id) || 0) > 0)?.id === debt.id;
        if (isTargetDebt) {
          payment += monthlyExtra;
        }

        payment = Math.min(payment, balance);
        balance -= payment;
        monthPaid += payment;

        balances.set(debt.id, Math.max(0, balance));
      }

      totalInterest += monthInterest;
      totalPaid += monthPaid;

      schedule.push({
        month,
        totalBalance: [...balances.values()].reduce((a, b) => a + b, 0),
        totalPaid,
        totalInterest,
        debtsRemaining: [...balances.values()].filter(b => b > 0.01).length
      });
    }

    return {
      months: month,
      totalInterest,
      totalPaid,
      schedule,
      debtOrder
    };
  };

  const avalancheResult = useMemo(() => calculatePayoff('avalanche'), [debts, extraPayment]);
  const snowballResult = useMemo(() => calculatePayoff('snowball'), [debts, extraPayment]);
  const currentResult = strategy === 'avalanche' ? avalancheResult : snowballResult;

  const minimumOnlyResult = useMemo(() => {
    const tempExtra = extraPayment;
    const result = (() => {
      if (debts.length === 0 || totalBalance === 0) {
        return { months: 0, totalInterest: 0, totalPaid: 0, schedule: [], debtOrder: [] };
      }

      const balances = new Map(debts.map(d => [d.id, d.balance]));
      const schedule: PayoffScheduleItem[] = [];
      let month = 0;
      let totalInterest = 0;
      let totalPaid = 0;
      const maxMonths = 600;

      while ([...balances.values()].some(b => b > 0.01) && month < maxMonths) {
        month++;
        let monthInterest = 0;
        let monthPaid = 0;

        for (const debt of debts) {
          let balance = balances.get(debt.id) || 0;
          if (balance <= 0) continue;

          const monthlyRate = debt.interestRate / 100 / 12;
          const interest = balance * monthlyRate;
          monthInterest += interest;
          balance += interest;

          let payment = Math.min(debt.minimumPayment, balance);
          balance -= payment;
          monthPaid += payment;

          balances.set(debt.id, Math.max(0, balance));
        }

        totalInterest += monthInterest;
        totalPaid += monthPaid;

        schedule.push({
          month,
          totalBalance: [...balances.values()].reduce((a, b) => a + b, 0),
          totalPaid,
          totalInterest,
          debtsRemaining: [...balances.values()].filter(b => b > 0.01).length
        });
      }

      return { months: month, totalInterest, totalPaid, schedule, debtOrder: [] };
    })();
    return result;
  }, [debts, totalBalance]);

  const formatCurrency = (amount: number): string => {
    if (!isFinite(amount)) return '-';
    return `$${Math.round(amount).toLocaleString('en-US')}`;
  };

  const formatTime = (months: number): string => {
    if (!isFinite(months) || months === 0) return '-';
    const years = Math.floor(months / 12);
    const remainingMonths = Math.round(months % 12);
    if (years === 0) return `${remainingMonths} mo`;
    if (remainingMonths === 0) return `${years} yr${years > 1 ? 's' : ''}`;
    return `${years}y ${remainingMonths}m`;
  };

  const debtColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

  const donutSegments = useMemo(() => {
    if (totalBalance === 0) return [];
    let cumulative = 0;
    return debts.map((debt, i) => {
      const percentage = (debt.balance / totalBalance) * 100;
      const start = cumulative;
      cumulative += percentage;
      return {
        id: debt.id,
        name: debt.name,
        balance: debt.balance,
        percentage,
        color: debtColors[i % debtColors.length],
        strokeDasharray: `${percentage} ${100 - percentage}`,
        strokeDashoffset: 25 - start
      };
    });
  }, [debts, totalBalance]);

  const chartPoints = useMemo(() => {
    if (currentResult.schedule.length === 0) return [];
    const maxMonths = currentResult.months;
    const maxBalance = totalBalance;
    const width = 500;
    const height = 200;
    const padding = 40;

    return currentResult.schedule
      .filter((_, i) => i % Math.max(1, Math.floor(currentResult.schedule.length / 24)) === 0 || i === currentResult.schedule.length - 1)
      .map(item => ({
        x: padding + ((item.month / maxMonths) * (width - 2 * padding)),
        y: padding + ((1 - item.totalBalance / maxBalance) * (height - 2 * padding)),
        month: item.month,
        balance: item.totalBalance
      }));
  }, [currentResult, totalBalance]);

  return (
    <div className="max-w-[1180px] mx-auto p-3 sm:p-4 md:p-6">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Debt Payoff Calculator')}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Calculate how quickly you can become debt-free using the Debt Avalanche or Debt Snowball method. Compare strategies and see how extra payments accelerate your payoff.
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Debt Input Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">

      <div className="flex justify-between items-center mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Your Debts</h2>
          <button
            onClick={addDebt}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            + Add Debt
          </button>
        </div>

        <div className="space-y-4">
          {debts.map((debt, index) => (
            <div key={debt.id} className="border rounded-lg p-4 bg-gray-50">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Debt Name</label>
                  <input
                    type="text"
                    value={debt.name}
                    onChange={(e) => updateDebt(debt.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="e.g., Credit Card"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Balance ($)</label>
                  <input
                    type="number"
                    value={debt.balance}
                    onChange={(e) => updateDebt(debt.id, 'balance', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    min="0"
                    step="100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Interest Rate (%)</label>
                  <input
                    type="number"
                    value={debt.interestRate}
                    onChange={(e) => updateDebt(debt.id, 'interestRate', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Min Payment ($)</label>
                  <input
                    type="number"
                    value={debt.minimumPayment}
                    onChange={(e) => updateDebt(debt.id, 'minimumPayment', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    min="0"
                    step="10"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => removeDebt(debt.id)}
                    disabled={debts.length === 1}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Extra Monthly Payment: <span className="text-blue-600 font-bold">{formatCurrency(extraPayment)}</span>
              </label>
              <input
                type="range"
                min="0"
                max="1000"
                step="25"
                value={extraPayment}
                onChange={(e) => setExtraPayment(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$0</span>
                <span>$500</span>
                <span>$1,000</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payoff Strategy</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setStrategy('avalanche')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    strategy === 'avalanche'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Avalanche (Highest Rate)
                </button>
                <button
                  onClick={() => setStrategy('snowball')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    strategy === 'snowball'
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Snowball (Lowest Balance)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 sm:mb-6 md:mb-8">
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <p className="text-sm text-gray-600 mb-1">Total Debt</p>
          <p className="text-2xl font-bold text-gray-800">{formatCurrency(totalBalance)}</p>
          <p className="text-xs text-gray-500 mt-1">{debts.length} debt{debts.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <p className="text-sm text-gray-600 mb-1">Debt-Free In</p>
          <p className="text-2xl font-bold text-green-600">{formatTime(currentResult.months)}</p>
          <p className="text-xs text-gray-500 mt-1">{strategy === 'avalanche' ? 'Avalanche' : 'Snowball'} method</p>
        </div>
<div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <p className="text-sm text-gray-600 mb-1">Total Interest</p>
          <p className="text-2xl font-bold text-orange-600">{formatCurrency(currentResult.totalInterest)}</p>
          <p className="text-xs text-gray-500 mt-1">Avg rate: {weightedAvgRate.toFixed(1)}%</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <p className="text-sm text-gray-600 mb-1">Interest Saved</p>
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(minimumOnlyResult.totalInterest - currentResult.totalInterest)}
          </p>
          <p className="text-xs text-gray-500 mt-1">vs minimum payments</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8 mb-4 sm:mb-6 md:mb-8">
        {/* Debt Distribution Donut Chart */}
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Debt Distribution</h3>
          <div className="flex flex-col md:flex-row items-center gap-3 sm:gap-4 md:gap-6">
            <div className="relative">
              <svg width="180" height="180" viewBox="0 0 180 180">
                {donutSegments.map((segment) => (
                  <g key={segment.id}>
                    {hoveredDebt === segment.id && (
                      <circle
                        cx="90"
                        cy="90"
                        r="60"
                        fill="none"
                        stroke={segment.color}
                        strokeWidth="28"
                        opacity="0.3"
                        className="pointer-events-none"
                      />
                    )}
                    <circle
                      cx="90"
                      cy="90"
                      r="60"
                      fill="none"
                      stroke={segment.color}
                      strokeWidth={hoveredDebt === segment.id ? 24 : 20}
                      strokeDasharray={segment.strokeDasharray}
                      strokeDashoffset={segment.strokeDashoffset}
                      transform="rotate(-90 90 90)"
                      pathLength="100"
                      className="pointer-events-none transition-all duration-200"
                    />
                    <circle
                      cx="90"
                      cy="90"
                      r="60"
                      fill="transparent"
                      stroke="transparent"
                      strokeWidth="30"
                      strokeDasharray={segment.strokeDasharray}
                      strokeDashoffset={segment.strokeDashoffset}
                      transform="rotate(-90 90 90)"
                      pathLength="100"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredDebt(segment.id)}
                      onMouseLeave={() => setHoveredDebt(null)}
                    />
                  </g>
                ))}
                <text x="90" y="85" textAnchor="middle" className="text-lg font-bold fill-gray-800">
                  {formatCurrency(totalBalance)}
                </text>
                <text x="90" y="105" textAnchor="middle" className="text-xs fill-gray-500">
                  Total Debt
                </text>
              </svg>
            </div>
            <div className="flex-1 space-y-2">
              {donutSegments.map((segment) => (
                <div
                  key={segment.id}
                  className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                    hoveredDebt === segment.id ? 'bg-gray-100' : ''
                  }`}
                  onMouseEnter={() => setHoveredDebt(segment.id)}
                  onMouseLeave={() => setHoveredDebt(null)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }} />
                    <span className="text-sm text-gray-700">{segment.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">{formatCurrency(segment.balance)}</span>
                    <span className="text-xs text-gray-500 ml-2">({segment.percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payoff Progress Chart */}
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Payoff Timeline</h3>
          <div className="relative">
            <svg width="100%" viewBox="0 0 500 200" className="overflow-visible">
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map((pct) => (
                <line
                  key={pct}
                  x1="40"
                  y1={40 + ((100 - pct) / 100) * 120}
                  x2="460"
                  y2={40 + ((100 - pct) / 100) * 120}
                  stroke="#E5E7EB"
                  strokeDasharray="4"
                />
              ))}

              {/* Y-axis labels */}
              <text x="35" y="45" textAnchor="end" className="text-xs fill-gray-500">{formatCurrency(totalBalance)}</text>
              <text x="35" y="165" textAnchor="end" className="text-xs fill-gray-500">$0</text>

              {/* X-axis label */}
              <text x="250" y="195" textAnchor="middle" className="text-xs fill-gray-500">Months</text>

              {/* Area fill */}
              {chartPoints.length > 1 && (
                <path
                  d={`M ${chartPoints[0].x} ${chartPoints[0].y} ${chartPoints.map(p => `L ${p.x} ${p.y}`).join(' ')} L ${chartPoints[chartPoints.length - 1].x} 160 L ${chartPoints[0].x} 160 Z`}
                  fill="url(#areaGradient)"
                  className="pointer-events-none"
                />
              )}

              {/* Line */}
              {chartPoints.length > 1 && (
                <path
                  d={`M ${chartPoints[0].x} ${chartPoints[0].y} ${chartPoints.map(p => `L ${p.x} ${p.y}`).join(' ')}`}
                  fill="none"
                  stroke={strategy === 'avalanche' ? '#8B5CF6' : '#14B8A6'}
                  strokeWidth="2"
                  className="pointer-events-none"
                />
              )}

              {/* Gradient definition */}
              <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={strategy === 'avalanche' ? '#8B5CF6' : '#14B8A6'} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={strategy === 'avalanche' ? '#8B5CF6' : '#14B8A6'} stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {/* Interactive points */}
              {chartPoints.map((point, i) => (
                <g key={i}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={hoveredChart === i ? 6 : 4}
                    fill={strategy === 'avalanche' ? '#8B5CF6' : '#14B8A6'}
                    className="pointer-events-none transition-all duration-200"
                  />
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="15"
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredChart(i)}
                    onMouseLeave={() => setHoveredChart(null)}
                  />
                  {hoveredChart === i && (
                    <g className="pointer-events-none">
                      <rect
                        x={point.x - 50}
                        y={point.y - 45}
                        width="100"
                        height="35"
                        fill="white"
                        stroke="#E5E7EB"
                        rx="4"
                      />
                      <text x={point.x} y={point.y - 30} textAnchor="middle" className="text-xs font-medium fill-gray-800">
                        Month {point.month}
                      </text>
                      <text x={point.x} y={point.y - 17} textAnchor="middle" className="text-xs fill-gray-600">
                        {formatCurrency(point.balance)}
                      </text>
                    </g>
                  )}
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* Strategy Comparison */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Strategy Comparison</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
          <div className="border-2 border-red-200 rounded-lg p-5 bg-red-50">
            <h3 className="text-lg font-medium text-red-800 mb-3">Minimum Payments Only</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Payoff Time:</span>
                <span className="font-bold text-red-700">{formatTime(minimumOnlyResult.months)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Interest:</span>
                <span className="font-bold text-red-700">{formatCurrency(minimumOnlyResult.totalInterest)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Paid:</span>
                <span className="font-bold">{formatCurrency(minimumOnlyResult.totalPaid)}</span>
              </div>
            </div>
          </div>

          <div className={`border-2 rounded-lg p-5 ${strategy === 'avalanche' ? 'border-purple-400 bg-purple-50 ring-2 ring-purple-400' : 'border-purple-200 bg-purple-50'}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-purple-800">Debt Avalanche</h3>
              {avalancheResult.totalInterest < snowballResult.totalInterest && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Saves Most</span>
              )}
            </div>
            <p className="text-xs text-purple-600 mb-3">Pay highest interest rate first</p>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Payoff Time:</span>
                <span className="font-bold text-purple-700">{formatTime(avalancheResult.months)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Interest:</span>
                <span className="font-bold text-purple-700">{formatCurrency(avalancheResult.totalInterest)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">You Save:</span>
                <span className="font-bold text-green-600">{formatCurrency(minimumOnlyResult.totalInterest - avalancheResult.totalInterest)}</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-purple-200">
              <p className="text-xs text-purple-700">Order: {avalancheResult.debtOrder.join(' → ')}</p>
            </div>
          </div>

          <div className={`border-2 rounded-lg p-5 ${strategy === 'snowball' ? 'border-teal-400 bg-teal-50 ring-2 ring-teal-400' : 'border-teal-200 bg-teal-50'}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-teal-800">Debt Snowball</h3>
              {snowballResult.months < avalancheResult.months && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Fastest Win</span>
              )}
            </div>
            <p className="text-xs text-teal-600 mb-3">Pay smallest balance first</p>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Payoff Time:</span>
                <span className="font-bold text-teal-700">{formatTime(snowballResult.months)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Interest:</span>
                <span className="font-bold text-teal-700">{formatCurrency(snowballResult.totalInterest)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">You Save:</span>
                <span className="font-bold text-green-600">{formatCurrency(minimumOnlyResult.totalInterest - snowballResult.totalInterest)}</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-teal-200">
              <p className="text-xs text-teal-700">Order: {snowballResult.debtOrder.join(' → ')}</p>
            </div>
          </div>
        </div>

        {avalancheResult.totalInterest !== snowballResult.totalInterest && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Difference:</strong> The Avalanche method saves you{' '}
              <strong>{formatCurrency(Math.abs(avalancheResult.totalInterest - snowballResult.totalInterest))}</strong> in interest
              compared to the Snowball method. However, the Snowball method provides faster psychological wins as you eliminate smaller debts first.
            </p>
          </div>
        )}
      </div>

      {/* Payment Schedule */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Payment Schedule Preview</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3 text-left">Month</th>
                <th className="px-4 py-3 text-right">Balance</th>
                <th className="px-4 py-3 text-right">Total Paid</th>
                <th className="px-4 py-3 text-right">Interest Paid</th>
                <th className="px-4 py-3 text-center">Debts Left</th>
              </tr>
            </thead>
            <tbody>
              {currentResult.schedule
                .filter((_, i, arr) => {
                  const interval = Math.max(1, Math.floor(arr.length / 12));
                  return i % interval === 0 || i === arr.length - 1;
                })
                .slice(0, 13)
                .map((item, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 font-medium">{item.month}</td>
                    <td className="px-4 py-3 text-right">{formatCurrency(item.totalBalance)}</td>
                    <td className="px-4 py-3 text-right">{formatCurrency(item.totalPaid)}</td>
                    <td className="px-4 py-3 text-right text-orange-600">{formatCurrency(item.totalInterest)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.debtsRemaining === 0
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {item.debtsRemaining}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Financial Calculators</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {relatedCalculators.map((calc, index) => (
            <Link key={index} href={calc.href} className="block p-3 sm:p-4 md:p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-2">{calc.title}</h3>
              <p className="text-sm text-gray-600">{calc.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">How to Pay Off Debt Faster</h2>

        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8 mb-4 sm:mb-6 md:mb-8">
          <div className="border border-purple-200 rounded-lg p-3 sm:p-4 md:p-6 bg-purple-50">
            <h3 className="text-xl font-medium text-purple-800 mb-4">Debt Avalanche Method</h3>
            <p className="text-gray-700 mb-4">
              The debt avalanche method focuses on paying off debts with the <strong>highest interest rates first</strong>.
              This approach minimizes the total interest you pay over time, making it mathematically optimal.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <span>Saves the most money on interest</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <span>Mathematically optimal strategy</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-yellow-500 font-bold mt-0.5">⚠</span>
                <span>May take longer to see early wins</span>
              </div>
            </div>
          </div>

          <div className="border border-teal-200 rounded-lg p-3 sm:p-4 md:p-6 bg-teal-50">
            <h3 className="text-xl font-medium text-teal-800 mb-4">Debt Snowball Method</h3>
            <p className="text-gray-700 mb-4">
              The debt snowball method targets debts with the <strong>smallest balances first</strong>.
              This creates quick wins that build momentum and motivation to stay on track.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <span>Quick psychological victories</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <span>Easier to stay motivated</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-yellow-500 font-bold mt-0.5">⚠</span>
                <span>May cost more in total interest</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Tips for Faster Debt Payoff</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Pay more than the minimum:</strong> Even an extra $50/month can save thousands in interest</li>
              <li><strong>Use windfalls wisely:</strong> Tax refunds, bonuses, and gifts can accelerate payoff</li>
              <li><strong>Negotiate lower rates:</strong> Call creditors to request rate reductions</li>
              <li><strong>Consider balance transfers:</strong> 0% APR offers can provide breathing room</li>
              <li><strong>Automate payments:</strong> Set up auto-pay to never miss a due date</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Interest Calculation Formula</h3>
            <p className="text-gray-700 mb-2">Monthly interest is calculated as:</p>
            <div className="bg-white rounded-lg p-4 font-mono text-sm">
              Monthly Interest = Balance × (Annual Rate ÷ 12 ÷ 100)
            </div>
            <p className="text-gray-600 text-sm mt-2">
              For example, a $5,000 balance at 20% APR accrues $83.33 in interest per month.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Which debt payoff method is best: Avalanche or Snowball?</h3>
            <p className="text-gray-700">
              The Avalanche method is mathematically optimal and saves the most money on interest. However, the Snowball
              method provides faster psychological wins that can help you stay motivated. Choose Avalanche if you are
              disciplined and focused on saving money; choose Snowball if you need quick wins to stay engaged.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">How much should I pay toward my debt each month?</h3>
            <p className="text-gray-700">
              Pay at least the minimum on all debts to avoid penalties and damage to your credit score. Any extra
              money should go toward your target debt (either highest rate or lowest balance, depending on your
              strategy). Even $50-100 extra per month can save thousands in interest and years of payments.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Should I pay off debt or save for emergencies first?</h3>
            <p className="text-gray-700">
              Financial experts generally recommend building a small emergency fund ($1,000-2,000) before aggressively
              paying debt. This prevents you from going further into debt when unexpected expenses arise. Once you have
              that buffer, focus on debt payoff, then build a larger emergency fund of 3-6 months of expenses.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Will paying off debt hurt my credit score?</h3>
            <p className="text-gray-700">
              Paying off debt generally helps your credit score by reducing your credit utilization ratio. However,
              closing credit card accounts after paying them off can temporarily lower your score by reducing your
              available credit. Consider keeping accounts open with zero balance if there are no annual fees.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Can I negotiate with creditors to lower my interest rate?</h3>
            <p className="text-gray-700">
              Yes! Many creditors will lower your interest rate if you ask, especially if you have a good payment
              history. Call your credit card company and ask for a rate reduction. Even a 2-3% reduction can save
              hundreds or thousands of dollars over the life of your debt. You can also explore balance transfer
              offers for 0% introductory rates.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="debt-payoff-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
