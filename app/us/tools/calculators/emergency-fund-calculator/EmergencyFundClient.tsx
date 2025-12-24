'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
}

interface Props {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '%' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

interface Template {
  housing: number;
  utilities: number;
  groceries: number;
  transportation: number;
  insurance: number;
  debt: number;
  stability: 'stable' | 'moderate' | 'unstable';
  dependents: number;
}

const templates: Record<string, Template> = {
  singlePro: { housing: 1500, utilities: 200, groceries: 400, transportation: 300, insurance: 300, debt: 500, stability: 'stable', dependents: 0 },
  family: { housing: 2500, utilities: 300, groceries: 800, transportation: 500, insurance: 400, debt: 800, stability: 'moderate', dependents: 2 },
  youngGrad: { housing: 800, utilities: 150, groceries: 250, transportation: 200, insurance: 200, debt: 300, stability: 'stable', dependents: 0 },
  highEarner: { housing: 3000, utilities: 400, groceries: 600, transportation: 700, insurance: 500, debt: 1200, stability: 'moderate', dependents: 1 },
  freelancer: { housing: 1200, utilities: 180, groceries: 350, transportation: 150, insurance: 250, debt: 400, stability: 'unstable', dependents: 0 },
  dualIncome: { housing: 2000, utilities: 250, groceries: 500, transportation: 400, insurance: 350, debt: 600, stability: 'stable', dependents: 0 }
};

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Emergency Fund Calculator?",
    answer: "A Emergency Fund Calculator is a free online tool designed to help you quickly and accurately calculate emergency fund-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Emergency Fund Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Emergency Fund Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Emergency Fund Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function EmergencyFundClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('emergency-fund-calculator');

  const [housing, setHousing] = useState(1500);
  const [utilities, setUtilities] = useState(200);
  const [groceries, setGroceries] = useState(400);
  const [transportation, setTransportation] = useState(300);
  const [insurance, setInsurance] = useState(300);
  const [debtPayments, setDebtPayments] = useState(500);
  const [otherExpenses, setOtherExpenses] = useState(200);
  const [jobStability, setJobStability] = useState<'stable' | 'moderate' | 'unstable'>('moderate');
  const [dependents, setDependents] = useState(0);

  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [emergencyFund, setEmergencyFund] = useState(0);
  const [monthsCoverage, setMonthsCoverage] = useState(0);
  const [monthlySavings, setMonthlySavings] = useState(0);
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  useEffect(() => {
    calculateEmergencyFund();
  }, [housing, utilities, groceries, transportation, insurance, debtPayments, otherExpenses, jobStability, dependents]);

  const calculateEmergencyFund = () => {
    const monthly = housing + utilities + groceries + transportation + insurance + debtPayments + otherExpenses;
    setMonthlyExpenses(monthly);

    if (monthly <= 0) {
      return;
    }

    // Calculate recommended months of coverage
    let baseMonths = 3;

    // Adjust based on job stability
    if (jobStability === 'stable') baseMonths = 3;
    else if (jobStability === 'moderate') baseMonths = 6;
    else if (jobStability === 'unstable') baseMonths = 9;

    // Adjust based on dependents
    if (dependents > 0) baseMonths += 1;
    if (dependents > 2) baseMonths += 1;

    // Cap at reasonable limits
    baseMonths = Math.max(3, Math.min(12, baseMonths));

    const fund = monthly * baseMonths;
    setEmergencyFund(fund);
    setMonthsCoverage(baseMonths);
    setMonthlySavings(fund / 10); // 10-month build period
  };

  const formatCurrency = (amount: number): string => {
    return `$${Math.round(amount).toLocaleString()}`;
  };

  const applyTemplate = (templateKey: string) => {
    const template = templates[templateKey];
    if (template) {
      setHousing(template.housing);
      setUtilities(template.utilities);
      setGroceries(template.groceries);
      setTransportation(template.transportation);
      setInsurance(template.insurance);
      setDebtPayments(template.debt);
      setJobStability(template.stability);
      setDependents(template.dependents);
    }
  };

  // What-if scenarios
  const scenario1Amount = monthlyExpenses * 9; // Job loss (9 months)
  const scenario1Extra = scenario1Amount - emergencyFund;

  const scenario2Amount = monthlyExpenses * 0.8 * 6; // Reduce expenses 20%
  const scenario2Savings = emergencyFund - scenario2Amount;

  const scenario3Amount = monthlyExpenses * 6 + 5000; // Major medical
  const scenario3Extra = scenario3Amount - emergencyFund;

  return (
    <div className="max-w-[1180px] mx-auto px-2 sm:px-2 py-3 sm:py-4 md:py-6">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Emergency Fund Calculator')}</h1>
        <p className="text-base sm:text-lg text-gray-600">Calculate your ideal emergency fund based on expenses and personal situation</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Emergency Fund Calculator</h2>

            {/* Emergency Fund Scenarios */}
            <div className="mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Common Scenarios</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => applyTemplate('singlePro')}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Single Professional
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('family')}
                  className="bg-green-100 hover:bg-green-200 text-green-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Family of Four
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('youngGrad')}
                  className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Young Graduate
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('highEarner')}
                  className="bg-orange-100 hover:bg-orange-200 text-orange-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  High Earner
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('freelancer')}
                  className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Freelancer
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('dualIncome')}
                  className="bg-teal-100 hover:bg-teal-200 text-teal-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Dual Income
                </button>
              </div>
            </div>

            {/* Monthly Expenses */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Monthly Essential Expenses</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="housing" className="block text-sm font-medium text-gray-700 mb-1">Housing (Rent/Mortgage)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      type="number"
                      id="housing"
                      value={housing}
                      onChange={(e) => setHousing(parseFloat(e.target.value) || 0)}
                      min="0"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="utilities" className="block text-sm font-medium text-gray-700 mb-1">Utilities</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      type="number"
                      id="utilities"
                      value={utilities}
                      onChange={(e) => setUtilities(parseFloat(e.target.value) || 0)}
                      min="0"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="groceries" className="block text-sm font-medium text-gray-700 mb-1">Groceries & Food</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      type="number"
                      id="groceries"
                      value={groceries}
                      onChange={(e) => setGroceries(parseFloat(e.target.value) || 0)}
                      min="0"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="transportation" className="block text-sm font-medium text-gray-700 mb-1">Transportation</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      type="number"
                      id="transportation"
                      value={transportation}
                      onChange={(e) => setTransportation(parseFloat(e.target.value) || 0)}
                      min="0"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="insurance" className="block text-sm font-medium text-gray-700 mb-1">Insurance</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      type="number"
                      id="insurance"
                      value={insurance}
                      onChange={(e) => setInsurance(parseFloat(e.target.value) || 0)}
                      min="0"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="debtPayments" className="block text-sm font-medium text-gray-700 mb-1">Minimum Debt Payments</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      type="number"
                      id="debtPayments"
                      value={debtPayments}
                      onChange={(e) => setDebtPayments(parseFloat(e.target.value) || 0)}
                      min="0"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="otherExpenses" className="block text-sm font-medium text-gray-700 mb-1">Other Essential Expenses</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    id="otherExpenses"
                    value={otherExpenses}
                    onChange={(e) => setOtherExpenses(parseFloat(e.target.value) || 0)}
                    min="0"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Personal Factors */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="jobStability" className="block text-sm font-medium text-gray-700 mb-1">Job Stability</label>
                  <select
                    id="jobStability"
                    value={jobStability}
                    onChange={(e) => setJobStability(e.target.value as 'stable' | 'moderate' | 'unstable')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="stable">Very Stable</option>
                    <option value="moderate">Moderately Stable</option>
                    <option value="unstable">Unstable/Variable</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="dependents" className="block text-sm font-medium text-gray-700 mb-1">Number of Dependents</label>
                  <input
                    type="number"
                    id="dependents"
                    value={dependents}
                    onChange={(e) => setDependents(parseInt(e.target.value) || 0)}
                    min="0"
                    max="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Emergency Fund Analysis</h3>

            {/* Monthly Expenses Display */}
            <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 mb-3 sm:mb-4 md:mb-6">
              <div className="text-center">
                <div className="text-sm font-medium text-blue-600 mb-1">Monthly Essential Expenses</div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-700 mb-2">{formatCurrency(monthlyExpenses)}</div>
                <div className="text-sm text-blue-600">Total required per month</div>
              </div>
            </div>

            {/* Emergency Fund Results */}
            <div className="grid grid-cols-1 gap-4 mb-3 sm:mb-4 md:mb-6">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-sm font-medium text-green-600">Recommended Emergency Fund</div>
                <div className="text-2xl font-bold text-green-700">{formatCurrency(emergencyFund)}</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-sm font-medium text-purple-600">Coverage Period</div>
                <div className="text-2xl font-bold text-purple-700">{monthsCoverage.toFixed(1)} months</div>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="text-sm font-medium text-amber-600">Monthly Savings Goal</div>
                <div className="text-2xl font-bold text-amber-700">{formatCurrency(monthlySavings)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fund Accumulation Chart */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Emergency Fund Growth Over Time</h2>

        <div className="overflow-x-auto">
          <svg viewBox="0 0 800 300" className="w-full h-auto">
            {/* Gradients */}
            <defs>
              <linearGradient id="emergencyFundGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = 20 + 240 - ratio * 240;
              return (
                <line
                  key={ratio}
                  x1={70}
                  y1={y}
                  x2={770}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              );
            })}

            {/* Y-axis labels */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = 20 + 240 - ratio * 240;
              const value = emergencyFund * ratio;
              return (
                <text
                  key={ratio}
                  x={60}
                  y={y + 5}
                  textAnchor="end"
                  fontSize="12"
                  fill="#6b7280"
                >
                  {formatCurrency(value)}
                </text>
              );
            })}

            {/* X-axis labels */}
            {Array.from({ length: 11 }).map((_, i) => (
              <text
                key={i}
                x={70 + (i / 10) * 700}
                y={280}
                textAnchor="middle"
                fontSize="12"
                fill="#6b7280"
              >
                {i}mo
              </text>
            ))}

            {/* Area path */}
            <path
              d={`M 70 260 ${Array.from({ length: 10 }).map((_, i) => {
                const x = 70 + ((i + 1) / 10) * 700;
                const progress = (i + 1) / 10;
                const y = 20 + 240 - (emergencyFund * progress / emergencyFund) * 240;
                return `L ${x} ${y}`;
              }).join(' ')} L 770 260 Z`}
              fill="url(#emergencyFundGradient)"
              opacity="0.8"
            />

            {/* Line path */}
            <path
              d={`M 70 260 ${Array.from({ length: 10 }).map((_, i) => {
                const x = 70 + ((i + 1) / 10) * 700;
                const progress = (i + 1) / 10;
                const y = 20 + 240 - (emergencyFund * progress / emergencyFund) * 240;
                return `L ${x} ${y}`;
              }).join(' ')}`}
              stroke="#3b82f6"
              strokeWidth="3"
              fill="none"
            />

            {/* Target line */}
            <line
              x1={70}
              y1={20}
              x2={770}
              y2={20}
              stroke="#10b981"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <text x={760} y={15} textAnchor="end" fontSize="12" fill="#10b981" fontWeight="bold">
              Goal: {formatCurrency(emergencyFund)}
            </text>
          </svg>

          {/* Legend */}
          <div className="flex justify-center gap-3 sm:gap-4 md:gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-600">Fund Accumulation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded" style={{ borderRadius: '2px', borderStyle: 'dashed', border: '2px dashed #10b981', backgroundColor: 'transparent' }}></div>
              <span className="text-sm text-gray-600">Target Fund</span>
            </div>
          </div>
        </div>
      </div>

      {/* Coverage Visualization */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Coverage Months Breakdown</h2>

        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 items-center">
          {/* Donut Chart */}
          <div className="flex justify-center">
            <svg viewBox="0 0 200 200" className="w-full max-w-[200px] h-auto">
              <circle cx="100" cy="100" r="80" fill="#3b82f6" />
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="transparent"
                stroke="#10b981"
                strokeWidth="160"
                strokeDasharray={`${monthlyExpenses > 0 ? (monthsCoverage / 12) * 100 * 5.027 : 0} 502.7`}
                transform="rotate(-90 100 100)"
              />
              <circle cx="100" cy="100" r="50" fill="white" />
              <text x="100" y="95" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#4b5563">
                {monthsCoverage.toFixed(1)}
              </text>
              <text x="100" y="115" textAnchor="middle" fontSize="12" fill="#6b7280">
                Months
              </text>
            </svg>
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm font-medium text-gray-700">Monthly Expenses</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">{formatCurrency(monthlyExpenses)}</div>
                <div className="text-xs text-gray-500">Per month</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm font-medium text-gray-700">Total Fund Needed</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">{formatCurrency(emergencyFund)}</div>
                <div className="text-xs text-gray-500">{monthsCoverage.toFixed(1)} months</div>
              </div>
            </div>

            <div className="p-3 bg-purple-50 rounded-lg border-2 border-purple-200">
              <div className="text-sm text-purple-600 mb-1">Monthly Savings Goal</div>
              <div className="text-2xl font-bold text-purple-700">{formatCurrency(monthlySavings)}</div>
              <div className="text-xs text-gray-500 mt-1">To build in 10 months</div>
            </div>
          </div>
        </div>
      </div>

      {/* Expense Breakdown Pie Chart */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Monthly Expense Breakdown</h2>

        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          {/* Bar Chart Visualization */}
          <div className="space-y-3">
            {[
              { label: 'Housing', value: housing, color: '#3b82f6' },
              { label: 'Utilities', value: utilities, color: '#10b981' },
              { label: 'Groceries', value: groceries, color: '#f59e0b' },
              { label: 'Transportation', value: transportation, color: '#8b5cf6' },
              { label: 'Insurance', value: insurance, color: '#ec4899' },
              { label: 'Debt Payments', value: debtPayments, color: '#ef4444' },
              { label: 'Other', value: otherExpenses, color: '#6b7280' }
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{item.label}</span>
                  <span className="font-semibold">{formatCurrency(item.value)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="h-4 rounded-full transition-all duration-300"
                    style={{
                      width: `${monthlyExpenses > 0 ? (item.value / monthlyExpenses) * 100 : 0}%`,
                      backgroundColor: item.color
                    }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {monthlyExpenses > 0 ? ((item.value / monthlyExpenses) * 100).toFixed(1) : 0}% of monthly expenses
                </div>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Fund Recommendations</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Minimum (3 months):</span>
                  <span className="font-semibold">{formatCurrency(monthlyExpenses * 3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Standard (6 months):</span>
                  <span className="font-semibold">{formatCurrency(monthlyExpenses * 6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Conservative (9 months):</span>
                  <span className="font-semibold">{formatCurrency(monthlyExpenses * 9)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="text-gray-700 font-medium">Your Target:</span>
                  <span className="font-bold text-blue-600">{formatCurrency(emergencyFund)}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">Based on Your Profile</h3>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>Job Stability: {jobStability === 'stable' ? 'Very Stable' : jobStability === 'moderate' ? 'Moderate' : 'Variable Income'}</li>
                <li>Dependents: {dependents}</li>
                <li>Recommended Coverage: {monthsCoverage.toFixed(1)} months</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* What If Scenarios */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">What If Scenarios</h2>
        <div className="grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {/* Scenario 1 */}
          <div className="p-3 sm:p-4 md:p-6 bg-blue-50 rounded-xl border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Job Loss (9 months)</h3>
            <div className="space-y-2">
              <div className="text-sm text-blue-700">Extended coverage for <span className="font-semibold">job search</span></div>
              <div className="text-lg font-bold text-blue-800">Need: {formatCurrency(scenario1Amount)}</div>
              <div className="text-sm text-blue-600">{scenario1Extra >= 0 ? '+' : ''}{formatCurrency(scenario1Extra)} {scenario1Extra >= 0 ? 'more than basic' : 'less than current'}</div>
            </div>
          </div>

          {/* Scenario 2 */}
          <div className="p-3 sm:p-4 md:p-6 bg-green-50 rounded-xl border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-3">Reduce Expenses 20%</h3>
            <div className="space-y-2">
              <div className="text-sm text-green-700">Emergency <span className="font-semibold">lifestyle cuts</span></div>
              <div className="text-lg font-bold text-green-800">Need: {formatCurrency(scenario2Amount)}</div>
              <div className="text-sm text-green-600">-{formatCurrency(Math.abs(scenario2Savings))} less needed</div>
            </div>
          </div>

          {/* Scenario 3 */}
          <div className="p-3 sm:p-4 md:p-6 bg-purple-50 rounded-xl border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-800 mb-3">Major Medical</h3>
            <div className="space-y-2">
              <div className="text-sm text-purple-700">Health emergency <span className="font-semibold">+ lost income</span></div>
              <div className="text-lg font-bold text-purple-800">Need: {formatCurrency(scenario3Amount)}</div>
              <div className="text-sm text-purple-600">+{formatCurrency(Math.abs(scenario3Extra))} for medical costs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Savings Strategy */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Building Your Emergency Fund</h2>
        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          <div>
            <h3 className="text-xl font-medium text-gray-700 mb-3">Step-by-Step Plan</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Step 1: Start Small</h4>
                <p className="text-sm text-blue-700">Begin with $1,000 as your initial emergency fund goal.</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Step 2: Build Gradually</h4>
                <p className="text-sm text-green-700">Add money monthly until you reach your full target amount.</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Step 3: Optimize Storage</h4>
                <p className="text-sm text-purple-700">Keep funds in a high-yield savings account for easy access.</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-medium text-gray-700 mb-3">Savings Tips</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-sm">Automate transfers to savings account</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-sm">Use windfalls like tax refunds or bonuses</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-sm">Cut temporary expenses to boost savings</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-sm">Keep separate from other savings goals</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-sm">Review and adjust annually</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Related Finance Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Finance Calculators</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {relatedCalculators.map((calc, index) => (
            <Link key={index} href={calc.href} className="block p-3 sm:p-4 md:p-6 bg-white rounded-lg border hover:border-blue-300 hover:shadow-md transition-all">
              <h3 className="font-semibold text-gray-800 mb-2">{calc.title}</h3>
              <p className="text-sm text-gray-600">{calc.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Understanding Emergency Funds</h2>
        <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
          An emergency fund is your financial safety net—money set aside specifically for unexpected expenses or income disruptions.
          Unlike savings for planned goals, this fund exists to protect you from life&apos;s uncertainties: job loss, medical emergencies,
          major car repairs, or urgent home fixes. Having adequate emergency savings prevents you from going into debt or dipping into
          retirement accounts when the unexpected happens.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">3-Month Fund</h3>
            <p className="text-sm text-gray-600">Minimum for stable jobs with dual income. Start here if you&apos;re just beginning.</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">6-Month Fund</h3>
            <p className="text-sm text-gray-600">Standard recommendation for most households. Covers typical job search time.</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="font-semibold text-purple-800 mb-2">9-12 Month Fund</h3>
            <p className="text-sm text-gray-600">For self-employed, single income, or volatile industries.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Where to Keep Your Emergency Fund</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span><strong>High-Yield Savings:</strong> Best balance of access and returns (4-5% APY)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span><strong>Money Market Account:</strong> Similar to savings with check-writing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span><strong>Short-term CDs:</strong> Slightly higher rates, less liquid</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">✗</span>
                <span><strong>NOT in stocks:</strong> Too volatile for emergency needs</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Building Your Fund Faster</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Automate transfers on payday</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Direct deposit a portion to separate account</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Save tax refunds and bonuses</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>Start with $1,000, then build to full target</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-5">
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">How much should I have in my emergency fund?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              The standard recommendation is 3-6 months of essential expenses. However, your specific needs depend on job stability,
              number of income earners, industry volatility, and dependents. Single-income households, self-employed individuals,
              and those in volatile industries should aim for 9-12 months. Focus on essential expenses only (housing, utilities,
              food, insurance, debt minimums)—not your full lifestyle spending.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">Should I pay off debt or build emergency savings first?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Build a starter emergency fund of $1,000-2,000 first, then aggressively pay down high-interest debt (credit cards),
              then complete your full emergency fund. Without any emergency savings, an unexpected expense will force you back into
              debt, undoing your progress. Once you have a starter fund, the math favors paying off high-interest debt before
              building more savings.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">What counts as an emergency worth using the fund?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              True emergencies are unexpected, necessary, and urgent: job loss, medical emergencies, critical car repairs needed
              for work, essential home repairs (broken furnace, major leak). NOT emergencies: sales, vacations, predictable
              expenses (car registration, annual insurance), or wants. If you knew about it in advance or it can wait, it&apos;s not
              an emergency—budget for it separately.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">How do I replenish my emergency fund after using it?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Treat replenishing your emergency fund as a priority. Pause extra retirement contributions (beyond employer match)
              and discretionary spending until the fund is restored. Create a specific timeline—aim to rebuild within 6-12 months.
              Automate contributions to make it happen without willpower. Consider what caused the emergency and whether you need
              to increase your target amount.
            </p>
          </div>

          <div>
            <h3 className="text-base font-medium text-gray-800 mb-2">Can my emergency fund be too big?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Yes, holding excessive cash has an opportunity cost. Money beyond 12 months of expenses could be invested for
              better returns. Once your fund is fully stocked, redirect those savings to retirement accounts, taxable investments,
              or other goals. If you keep a large cash buffer for psychological comfort, that&apos;s valid—but understand you&apos;re
              trading potential growth for peace of mind.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="emergency-fund-calculator" fallbackFaqs={fallbackFaqs} />
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-50 rounded-xl p-3 sm:p-4 md:p-6 text-center">
        <p className="text-sm text-gray-600">
          <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes. Your specific emergency fund needs may vary based on your unique circumstances. Consider consulting with a financial advisor for personalized advice.
        </p>
      </div>
    </div>
  );
}
