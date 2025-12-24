'use client';

import { useState, useEffect, useMemo } from 'react';
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

interface GoalTemplate {
  name: string;
  amount: number;
  rate: number;
}

interface MonthlyProjection {
  month: number;
  payment: number;
  interest: number;
  balance: number;
  totalSaved: number;
}

const goalTemplates: Record<string, GoalTemplate> = {
  emergency: { name: 'Emergency Fund', amount: 15000, rate: 4 },
  vacation: { name: 'Dream Vacation', amount: 5000, rate: 3 },
  house: { name: 'House Down Payment', amount: 50000, rate: 4 },
  car: { name: 'New Car', amount: 8000, rate: 3 },
  wedding: { name: 'Wedding Fund', amount: 25000, rate: 4 },
  retirement: { name: 'Retirement Savings', amount: 100000, rate: 6 }
};

const fallbackFaqs = [
  {
    id: '1',
    question: "How do I calculate how much to save each month?",
    answer: "Divide your goal amount (minus current savings) by the number of months until your deadline. For example, to save $15,000 in 3 years (36 months) starting from $2,000: ($15,000 - $2,000) ÷ 36 = $361/month. If your savings earn interest, you'll need slightly less each month since interest contributes to your goal.",
    order: 1
  },
  {
    id: '2',
    question: "Where should I keep my savings goal money?",
    answer: "For short-term goals (under 2 years), use a high-yield savings account (currently offering 4-5% APY) or money market account for safety and liquidity. For medium-term goals (2-5 years), consider CDs or I-bonds. For long-term goals (5+ years), a diversified investment portfolio may be appropriate despite short-term volatility.",
    order: 2
  },
  {
    id: '3',
    question: "How much should I have in an emergency fund?",
    answer: "Financial experts recommend 3-6 months of essential expenses for an emergency fund. If you have variable income, are self-employed, or have dependents, aim for 6-12 months. Essential expenses include rent/mortgage, utilities, food, insurance, and minimum debt payments—not your entire budget.",
    order: 3
  },
  {
    id: '4',
    question: "Should I pay off debt or save for goals first?",
    answer: "Generally, build a small emergency fund ($1,000-$2,000) first, then focus on high-interest debt (above 7%). Once high-interest debt is paid, balance debt repayment with savings goals. Always contribute enough to retirement accounts to get employer matches—that's free money you shouldn't miss.",
    order: 4
  }
];

export default function SavingsGoalClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('savings-goal-calculator');

  const [goalName, setGoalName] = useState('Emergency Fund');
  const [goalAmount, setGoalAmount] = useState(15000);
  const [currentSavings, setCurrentSavings] = useState(2000);
  const [timePeriod, setTimePeriod] = useState(3);
  const [interestRate, setInterestRate] = useState(4);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalToSave, setTotalToSave] = useState(0);
  const [interestEarned, setInterestEarned] = useState(0);
  const [progress, setProgress] = useState(0);
  const [monthsToGoal, setMonthsToGoal] = useState(0);
  const [monthlyProjections, setMonthlyProjections] = useState<MonthlyProjection[]>([]);

  const calculateSavings = (goal: number, current: number, years: number, rate: number) => {
    const toSave = Math.max(0, goal - current);
    const progressPercent = goal > 0 ? (current / goal) * 100 : 0;
    const totalMonths = Math.round(years * 12);
    const monthlyRate = (rate / 100) / 12;

    let payment = 0;
    if (totalMonths > 0 && toSave > 0) {
      if (monthlyRate === 0) {
        payment = toSave / totalMonths;
      } else {
        payment = toSave * monthlyRate / (Math.pow(1 + monthlyRate, totalMonths) - 1);
      }
    }

    // Calculate interest earned
    let interest = 0;
    if (monthlyRate > 0 && payment > 0) {
      const futureValue = payment * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
      interest = futureValue - (payment * totalMonths);
    }

    // Generate monthly projections
    const projections: MonthlyProjection[] = [];
    let balance = current;
    let totalSaved = current;

    for (let month = 1; month <= Math.min(totalMonths, 120); month++) {
      const monthInterest = balance * monthlyRate;
      balance += payment + monthInterest;
      totalSaved += payment;

      projections.push({
        month,
        payment,
        interest: monthInterest,
        balance,
        totalSaved
      });

      if (balance >= goal) break;
    }

    return {
      monthlyPayment: payment,
      totalToSave: toSave,
      interestEarned: interest,
      progress: progressPercent,
      monthsToGoal: totalMonths,
      projections
    };
  };

  useEffect(() => {
    const result = calculateSavings(goalAmount, currentSavings, timePeriod, interestRate);
    setMonthlyPayment(result.monthlyPayment);
    setTotalToSave(result.totalToSave);
    setInterestEarned(result.interestEarned);
    setProgress(result.progress);
    setMonthsToGoal(result.monthsToGoal);
    setMonthlyProjections(result.projections);
  }, [goalAmount, currentSavings, timePeriod, interestRate]);

  // What-if scenarios
  const scenarios = useMemo(() => {
    const current = calculateSavings(goalAmount, currentSavings, timePeriod, interestRate);
    const moreMonthly = calculateSavings(goalAmount, currentSavings, timePeriod * 0.75, interestRate);
    const longerTime = calculateSavings(goalAmount, currentSavings, timePeriod + 1, interestRate);

    return {
      current: { ...current, years: timePeriod },
      faster: {
        ...moreMonthly,
        years: timePeriod * 0.75,
        monthlyDiff: moreMonthly.monthlyPayment - current.monthlyPayment,
        timeSaved: timePeriod - timePeriod * 0.75
      },
      longer: {
        ...longerTime,
        years: timePeriod + 1,
        monthlySavings: current.monthlyPayment - longerTime.monthlyPayment
      }
    };
  }, [goalAmount, currentSavings, timePeriod, interestRate]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return '$' + (value / 1000000).toFixed(2) + 'M';
    }
    if (value >= 100000) {
      return '$' + (value / 1000).toFixed(1) + 'K';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatCurrencyFull = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const applyTemplate = (templateKey: string) => {
    const template = goalTemplates[templateKey];
    if (template) {
      setGoalName(template.name);
      setGoalAmount(template.amount);
      setInterestRate(template.rate);
    }
  };

  // Chart dimensions
  const chartWidth = 800;
  const chartHeight = 300;
  const chartPadding = { top: 20, right: 30, bottom: 40, left: 70 };
  const plotWidth = chartWidth - chartPadding.left - chartPadding.right;
  const plotHeight = chartHeight - chartPadding.top - chartPadding.bottom;

  const maxChartValue = Math.max(goalAmount * 1.15, monthlyProjections.length > 0 ? Math.max(...monthlyProjections.map(d => d.balance)) * 1.1 : 100);

  // Generate line paths
  const generateLinePath = (data: MonthlyProjection[], key: 'balance' | 'totalSaved') => {
    if (data.length === 0) return '';
    return data.map((d, i) => {
      const x = chartPadding.left + ((i + 1) / data.length) * plotWidth;
      const y = chartPadding.top + plotHeight - (d[key] / maxChartValue) * plotHeight;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  const generateAreaPath = (data: MonthlyProjection[], key: 'balance' | 'totalSaved') => {
    if (data.length === 0) return '';
    const linePath = generateLinePath(data, key);
    const startX = chartPadding.left + (1 / data.length) * plotWidth;
    const endX = chartPadding.left + plotWidth;
    const bottomY = chartPadding.top + plotHeight;
    return `${linePath} L ${endX} ${bottomY} L ${startX} ${bottomY} Z`;
  };

  // Y-axis ticks
  const yAxisTicks = [0, 0.25, 0.5, 0.75, 1].map(ratio => ({
    value: maxChartValue * ratio,
    y: chartPadding.top + plotHeight - ratio * plotHeight
  }));

  const allRelatedCalculators = [
    { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound growth', icon: '📈' },
    { href: '/us/tools/calculators/sip-calculator', title: 'SIP Calculator', description: 'Systematic investment plan', icon: '💰' },
    { href: '/us/tools/calculators/retirement-calculator', title: 'Retirement Calculator', description: 'Plan for retirement', icon: '🏖️' },
    { href: '/us/tools/calculators/emergency-fund-calculator', title: 'Emergency Fund', description: 'Build your safety net', icon: '🛡️' },
    { href: '/us/tools/calculators/investment-growth-calculator', title: 'Investment Growth', description: 'Track portfolio growth', icon: '💹' },
    { href: '/us/tools/calculators/lumpsum-calculator', title: 'Lumpsum Calculator', description: 'One-time investment', icon: '💵' },
    { href: '/us/tools/calculators/fd-calculator', title: 'FD Calculator', description: 'Fixed deposit returns', icon: '🏦' },
    { href: '/us/tools/calculators/inflation-calculator', title: 'Inflation Calculator', description: 'Calculate inflation impact', icon: '📉' }
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-2 xs:px-3 sm:px-4 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-5 sm:mb-6 md:mb-8">
        <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">{getH1('Savings Goal Calculator')}</h1>
        <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-600 px-1 sm:px-2 leading-relaxed">Plan and achieve your financial goals with smart savings strategies</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Calculator Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Left: Input Section */}
          <div className="space-y-4 sm:space-y-4 md:space-y-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Set Your Goal</h2>

            {/* Goal Templates */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quick Templates</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(goalTemplates).map(([key, template]) => (
                  <button
                    key={key}
                    onClick={() => applyTemplate(key)}
                    className={`p-2 text-xs border rounded-lg transition-all ${
                      goalName === template.name
                        ? 'border-sky-500 bg-sky-50 text-sky-700'
                        : 'border-gray-200 hover:border-sky-300 hover:bg-sky-50'
                    }`}
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Goal Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Goal Name</label>
              <input
                type="text"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            {/* Goal Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Goal Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={goalAmount}
                  onChange={(e) => setGoalAmount(Number(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  min="100"
                  step="100"
                />
              </div>
            </div>

            {/* Current Savings */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Savings</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(Number(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  min="0"
                  step="100"
                />
              </div>
            </div>

            {/* Time Period */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time to Reach Goal (Years)</label>
              <input
                type="range"
                value={timePeriod}
                onChange={(e) => setTimePeriod(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                min="0.5"
                max="10"
                step="0.5"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>6 months</span>
                <span className="font-semibold text-sky-600">{timePeriod} years</span>
                <span>10 years</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expected Interest Rate (%)</label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                min="0"
                max="15"
                step="0.5"
              />
            </div>
          </div>

          {/* Right: Results Section */}
          <div className="space-y-4 sm:space-y-4 md:space-y-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Your Savings Plan</h2>

            {/* Progress Bar */}
            <div className="bg-gray-100 rounded-xl p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Current Progress</span>
                <span className="font-semibold text-sky-600">{progress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-sky-500 h-3 rounded-full transition-all"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>{formatCurrency(currentSavings)} saved</span>
                <span>{formatCurrency(goalAmount)} goal</span>
              </div>
            </div>

            {/* Monthly Payment */}
            <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-3 sm:p-4 md:p-6 border-2 border-sky-200">
              <div className="text-sm text-sky-600 mb-1">Monthly Savings Needed</div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-sky-700">{formatCurrency(monthlyPayment)}</div>
              <div className="text-sm text-sky-600 mt-2">for {monthsToGoal} months</div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-xs text-blue-600">Amount to Save</div>
                <div className="text-lg font-bold text-blue-700">{formatCurrency(totalToSave)}</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-xs text-green-600">Interest Earned</div>
                <div className="text-lg font-bold text-green-700">{formatCurrency(interestEarned)}</div>
              </div>
            </div>

            {/* Goal Summary */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">{goalName} Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Goal Amount</span>
                  <span className="font-semibold">{formatCurrency(goalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Already Saved</span>
                  <span className="font-semibold text-sky-600">{formatCurrency(currentSavings)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Still Need</span>
                  <span className="font-semibold text-orange-600">{formatCurrency(totalToSave)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="text-gray-500">Target Date</span>
                  <span className="font-semibold">{Math.round(timePeriod * 12)} months</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Savings Progress Chart */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-4 md:mb-6">Savings Progress Toward Goal</h2>

        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
            {/* Gradients */}
            <defs>
              <linearGradient id="savingsBalanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="savingsContributionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Goal line */}
            <line
              x1={chartPadding.left}
              y1={chartPadding.top + plotHeight - (goalAmount / maxChartValue) * plotHeight}
              x2={chartWidth - chartPadding.right}
              y2={chartPadding.top + plotHeight - (goalAmount / maxChartValue) * plotHeight}
              stroke="#f97316"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <text
              x={chartWidth - chartPadding.right - 5}
              y={chartPadding.top + plotHeight - (goalAmount / maxChartValue) * plotHeight - 5}
              textAnchor="end"
              fontSize="12"
              fill="#f97316"
              fontWeight="bold"
            >
              Goal: {formatCurrency(goalAmount)}
            </text>

            {/* Grid lines */}
            {yAxisTicks.map((tick) => (
              <line
                key={tick.value}
                x1={chartPadding.left}
                y1={tick.y}
                x2={chartWidth - chartPadding.right}
                y2={tick.y}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            ))}

            {/* Y-axis labels */}
            {yAxisTicks.map((tick) => (
              <text
                key={tick.value}
                x={chartPadding.left - 10}
                y={tick.y + 5}
                textAnchor="end"
                fontSize="12"
                fill="#6b7280"
              >
                {formatCurrency(tick.value)}
              </text>
            ))}

            {/* X-axis labels */}
            {monthlyProjections.map((d, i) => {
              if (i % Math.ceil(monthlyProjections.length / 8) === 0 || i === monthlyProjections.length - 1) {
                const x = chartPadding.left + ((i + 1) / monthlyProjections.length) * plotWidth;
                return (
                  <text
                    key={i}
                    x={x}
                    y={chartHeight - chartPadding.bottom + 20}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#6b7280"
                  >
                    Mo {d.month}
                  </text>
                );
              }
              return null;
            })}

            {/* Contribution area */}
            <path
              d={generateAreaPath(monthlyProjections, 'totalSaved')}
              fill="url(#savingsContributionGradient)"
              opacity="0.8"
            />

            {/* Balance area */}
            <path
              d={generateAreaPath(monthlyProjections, 'balance')}
              fill="url(#savingsBalanceGradient)"
              opacity="0.6"
            />

            {/* Lines */}
            <path
              d={generateLinePath(monthlyProjections, 'totalSaved')}
              stroke="#10b981"
              strokeWidth="3"
              fill="none"
            />
            <path
              d={generateLinePath(monthlyProjections, 'balance')}
              stroke="#3b82f6"
              strokeWidth="3"
              fill="none"
            />

            {/* Interactive points */}
            {hoveredMonth !== null && monthlyProjections[hoveredMonth] && (
              <>
                <circle
                  cx={chartPadding.left + ((hoveredMonth + 1) / monthlyProjections.length) * plotWidth}
                  cy={chartPadding.top + plotHeight - (monthlyProjections[hoveredMonth].totalSaved / maxChartValue) * plotHeight}
                  r="6"
                  fill="#10b981"
                  stroke="white"
                  strokeWidth="2"
                />
                <circle
                  cx={chartPadding.left + ((hoveredMonth + 1) / monthlyProjections.length) * plotWidth}
                  cy={chartPadding.top + plotHeight - (monthlyProjections[hoveredMonth].balance / maxChartValue) * plotHeight}
                  r="6"
                  fill="#3b82f6"
                  stroke="white"
                  strokeWidth="2"
                />
              </>
            )}

            {/* Interactive overlay */}
            {monthlyProjections.map((d, i) => {
              const x = chartPadding.left + ((i + 1) / monthlyProjections.length) * plotWidth;
              return (
                <rect
                  key={i}
                  x={x - (plotWidth / monthlyProjections.length) / 2}
                  y={chartPadding.top}
                  width={plotWidth / monthlyProjections.length}
                  height={plotHeight}
                  fill="transparent"
                  onMouseEnter={() => setHoveredMonth(i)}
                  onMouseLeave={() => setHoveredMonth(null)}
                  style={{ cursor: 'pointer' }}
                />
              );
            })}
          </svg>

          {/* Legend */}
          <div className="flex justify-center gap-3 sm:gap-4 md:gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">Total Contributions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-600">Total with Interest</span>
            </div>
            <div className="w-4 h-4 bg-orange-500 rounded" style={{ borderRadius: '2px', borderStyle: 'dashed', border: '2px dashed #f97316', backgroundColor: 'transparent' }}></div>
            <span className="text-sm text-gray-600">Goal Amount</span>
          </div>

          {/* Tooltip */}
          {hoveredMonth !== null && monthlyProjections[hoveredMonth] && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-semibold text-gray-900 mb-2">Month {monthlyProjections[hoveredMonth].month}</div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Monthly Payment</div>
                  <div className="font-semibold text-sky-600">{formatCurrencyFull(monthlyProjections[hoveredMonth].payment)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Interest Earned</div>
                  <div className="font-semibold text-orange-600">{formatCurrencyFull(monthlyProjections[hoveredMonth].interest)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Total Balance</div>
                  <div className="font-semibold text-blue-600">{formatCurrencyFull(monthlyProjections[hoveredMonth].balance)}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Breakdown Pie Chart */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-4 md:mb-6">Contribution vs Interest Breakdown</h2>

        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 items-center">
          {/* Pie Chart */}
          <div className="flex justify-center">
            <svg viewBox="0 0 200 200" className="w-full max-w-[200px] h-auto">
              <circle cx="100" cy="100" r="80" fill="#3b82f6" />
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="transparent"
                stroke="#f97316"
                strokeWidth="160"
                strokeDasharray={`${goalAmount > 0 ? (interestEarned / goalAmount) * 100 * 5.027 : 0} 502.7`}
                transform="rotate(-90 100 100)"
              />
              <circle cx="100" cy="100" r="50" fill="white" />
              <text x="100" y="95" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#4b5563">
                {formatCurrency(goalAmount)}
              </text>
              <text x="100" y="115" textAnchor="middle" fontSize="12" fill="#6b7280">
                Goal Amount
              </text>
            </svg>
          </div>

          {/* Legend and Stats */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm font-medium text-gray-700">Monthly Contributions</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">{formatCurrencyFull(totalToSave)}</div>
                <div className="text-xs text-gray-500">{goalAmount > 0 ? ((totalToSave / goalAmount) * 100).toFixed(1) : 0}%</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <span className="text-sm font-medium text-gray-700">Interest Earned</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-orange-600">{formatCurrencyFull(interestEarned)}</div>
                <div className="text-xs text-gray-500">{goalAmount > 0 ? ((interestEarned / goalAmount) * 100).toFixed(1) : 0}%</div>
              </div>
            </div>

            <div className="p-3 bg-sky-50 rounded-lg border-2 border-sky-200">
              <div className="text-sm text-sky-600 mb-1">Goal Progress</div>
              <div className="text-2xl font-bold text-sky-700">{progress.toFixed(1)}%</div>
              <div className="text-xs text-gray-500 mt-1">{formatCurrencyFull(currentSavings)} of {formatCurrencyFull(goalAmount)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Visualization */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-4 md:mb-6">Savings Timeline</h2>

        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {/* Timeline bar */}
          <div className="relative">
            <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-400 to-sky-600 transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
            <div className="absolute top-0 left-0 h-8 flex items-center pl-4">
              <span className="text-xs font-semibold text-white drop-shadow">
                {Math.min(progress, 100).toFixed(0)}% Complete
              </span>
            </div>
          </div>

          {/* Milestones */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-sky-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-sky-600">{formatCurrency(currentSavings)}</div>
              <div className="text-xs text-gray-600 mt-1">Current Savings</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(monthlyPayment)}</div>
              <div className="text-xs text-gray-600 mt-1">Monthly Needed</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{monthsToGoal}</div>
              <div className="text-xs text-gray-600 mt-1">Months to Goal</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{formatCurrency(goalAmount)}</div>
              <div className="text-xs text-gray-600 mt-1">Target Goal</div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners */}
      <CalculatorAfterCalcBanners />

      {/* Related Calculators */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-3 xs:mb-4 sm:mb-4 md:mb-6">Related Savings Calculators</h2>
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
          {allRelatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group touch-manipulation">
              <div className="rounded-lg xs:rounded-xl p-2 xs:p-3 sm:p-4 bg-white border border-gray-200 hover:border-sky-300 active:border-sky-400 hover:shadow-md active:shadow-lg transition-all h-full">
                <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-sky-50 rounded-md xs:rounded-lg flex items-center justify-center mb-1.5 xs:mb-2 sm:mb-3 text-base xs:text-lg sm:text-2xl">
                  {calc.icon}
                </div>
                <h3 className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-900 mb-0.5 xs:mb-1 group-hover:text-sky-600 transition-colors leading-tight">
                  {calc.title}
                </h3>
                <p className="text-[9px] xs:text-[10px] sm:text-xs text-gray-600 leading-tight">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 xs:mb-3 sm:mb-4 md:mb-6 prose prose-gray max-w-none">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Understanding Savings Goals</h2>
        <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-3 xs:mb-4 sm:mb-4 md:mb-6 leading-relaxed">
          Setting clear savings goals is the foundation of financial success. Whether you&apos;re saving for an emergency fund, a dream vacation,
          a house down payment, or your child&apos;s education, having a specific target and timeline helps you stay motivated and on track.
          This calculator shows exactly how much you need to save each month to reach your goal.
        </p>

        <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 xs:gap-4 sm:gap-4 md:gap-6 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
          <div className="bg-sky-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-sky-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">SMART Goals</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Make goals Specific, Measurable, Achievable, Relevant, Time-bound</p>
          </div>
          <div className="bg-green-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-green-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Automate Savings</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Set up automatic transfers to remove temptation to skip</p>
          </div>
          <div className="bg-purple-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-purple-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Earn Interest</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Use high-yield savings accounts to accelerate growth</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-3 sm:gap-4 md:gap-6">
          <div>
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Common Savings Goals</h2>
            <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-600">
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-sky-500 mt-0.5 flex-shrink-0">🛡️</span>
                <span><strong>Emergency Fund:</strong> 3-6 months of expenses</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-sky-500 mt-0.5 flex-shrink-0">🏠</span>
                <span><strong>House Down Payment:</strong> 10-20% of home price</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-sky-500 mt-0.5 flex-shrink-0">🎓</span>
                <span><strong>Education:</strong> College tuition and expenses</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-sky-500 mt-0.5 flex-shrink-0">🚗</span>
                <span><strong>Vehicle:</strong> New or used car purchase</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-sky-500 mt-0.5 flex-shrink-0">✈️</span>
                <span><strong>Vacation:</strong> Dream trip or annual travel</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Where to Keep Savings</h2>
            <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-600">
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span><strong>Short-term (0-2 years):</strong> High-yield savings, Money Market</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span><strong>Medium-term (2-5 years):</strong> CDs, I-Bonds, Treasury bills</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span><strong>Long-term (5+ years):</strong> Index funds, diversified portfolio</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-blue-500 mt-0.5 flex-shrink-0">💡</span>
                <span>Match time horizon to risk tolerance and liquidity needs</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQs Section */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-3 xs:mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="savings-goal-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}

