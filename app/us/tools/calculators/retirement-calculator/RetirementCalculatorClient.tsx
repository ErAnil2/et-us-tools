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
}

interface Props {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '%' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

interface YearlyData {
  age: number;
  year: number;
  contribution: number;
  totalContributed: number;
  interestEarned: number;
  totalValue: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "How much should I save for retirement?",
    answer: "A common rule is to save 10-15% of your gross income for retirement, including any employer match. By age 30, aim to have 1x your annual salary saved; by 40, aim for 3x; by 50, aim for 6x; by 60, aim for 8x; and by 67, aim for 10x your salary. These are guidelines—your needs may vary based on lifestyle goals, healthcare costs, and other income sources.",
    order: 1
  },
  {
    id: '2',
    question: "What is the 4% rule for retirement withdrawals?",
    answer: "The 4% rule suggests you can withdraw 4% of your retirement savings in the first year, then adjust for inflation each year after. This approach historically provided a 95% chance of funds lasting 30 years. With a $1 million portfolio, you'd withdraw $40,000 in year one. Some experts now recommend 3-3.5% given lower expected returns and longer lifespans.",
    order: 2
  },
  {
    id: '3',
    question: "How does compound interest affect retirement savings?",
    answer: "Compound interest makes your money grow exponentially because you earn interest on both your principal and accumulated interest. Starting early is crucial: $500/month at 7% return from age 25 to 65 becomes ~$1.2 million. The same contribution from age 35 to 65 only reaches ~$567,000—less than half. Even small amounts early can significantly impact your retirement.",
    order: 3
  },
  {
    id: '4',
    question: "When can I retire and access my retirement accounts?",
    answer: "You can withdraw from 401(k) and Traditional IRA penalty-free at age 59½, or at 55 if you leave your job (401k only). Early withdrawals typically incur a 10% penalty plus income tax. Roth IRA contributions (not earnings) can be withdrawn anytime tax and penalty-free. Social Security benefits can start at 62 (reduced) or full retirement age (66-67), with bonuses for delaying until 70.",
    order: 4
  }
];

export default function RetirementCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('retirement-calculator');

  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualReturn, setAnnualReturn] = useState(7);
  const [retirementIncome, setRetirementIncome] = useState(5000);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  const [results, setResults] = useState({
    totalSavings: 0,
    yearsToRetirement: 0,
    monthlyRetirementIncome: 0,
    totalContributions: 0,
    totalInterest: 0,
    contributionPercent: 0,
    interestPercent: 0
  });

  const [yearlyData, setYearlyData] = useState<YearlyData[]>([]);

  const calculateRetirement = (age: number, retAge: number, savings: number, monthly: number, rate: number) => {
    const years = retAge - age;
    if (years <= 0) {
      return {
        totalSavings: savings,
        yearsToRetirement: 0,
        monthlyRetirementIncome: (savings * 0.04) / 12,
        totalContributions: savings,
        totalInterest: 0,
        yearlyBreakdown: []
      };
    }

    const monthlyRate = rate / 12 / 100;
    const yearlyBreakdown: YearlyData[] = [];
    let currentValue = savings;
    let totalContributed = savings;

    for (let year = 1; year <= years; year++) {
      const yearlyContribution = monthly * 12;

      // Compound monthly with contributions
      for (let month = 1; month <= 12; month++) {
        currentValue = currentValue * (1 + monthlyRate) + monthly;
      }

      totalContributed += yearlyContribution;
      const interestEarned = currentValue - totalContributed;

      yearlyBreakdown.push({
        age: age + year,
        year,
        contribution: yearlyContribution,
        totalContributed,
        interestEarned,
        totalValue: currentValue
      });
    }

    const monthlyIncome = (currentValue * 0.04) / 12;

    return {
      totalSavings: currentValue,
      yearsToRetirement: years,
      monthlyRetirementIncome: monthlyIncome,
      totalContributions: totalContributed,
      totalInterest: currentValue - totalContributed,
      yearlyBreakdown
    };
  };

  useEffect(() => {
    const result = calculateRetirement(currentAge, retirementAge, currentSavings, monthlyContribution, annualReturn);
    const contributionPercent = result.totalSavings > 0 ? (result.totalContributions / result.totalSavings) * 100 : 0;
    const interestPercent = result.totalSavings > 0 ? (result.totalInterest / result.totalSavings) * 100 : 0;

    setResults({
      totalSavings: result.totalSavings,
      yearsToRetirement: result.yearsToRetirement,
      monthlyRetirementIncome: result.monthlyRetirementIncome,
      totalContributions: result.totalContributions,
      totalInterest: result.totalInterest,
      contributionPercent,
      interestPercent
    });

    setYearlyData(result.yearlyBreakdown);
  }, [currentAge, retirementAge, currentSavings, monthlyContribution, annualReturn]);

  // What-if scenarios
  const scenarios = useMemo(() => {
    const current = calculateRetirement(currentAge, retirementAge, currentSavings, monthlyContribution, annualReturn);
    const higherContribution = calculateRetirement(currentAge, retirementAge, currentSavings, Math.round(monthlyContribution * 1.5), annualReturn);
    const laterRetirement = calculateRetirement(currentAge, retirementAge + 5, currentSavings, monthlyContribution, annualReturn);

    return {
      current: { ...current, monthly: monthlyContribution, retireAge: retirementAge },
      higher: {
        ...higherContribution,
        monthly: Math.round(monthlyContribution * 1.5),
        retireAge: retirementAge,
        diff: higherContribution.totalSavings - current.totalSavings
      },
      later: {
        ...laterRetirement,
        monthly: monthlyContribution,
        retireAge: retirementAge + 5,
        diff: laterRetirement.totalSavings - current.totalSavings
      }
    };
  }, [currentAge, retirementAge, currentSavings, monthlyContribution, annualReturn]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return '$' + (value / 1000000).toFixed(1) + 'M';
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

  const isOnTrack = results.monthlyRetirementIncome >= retirementIncome;
  const maxChartValue = yearlyData.length > 0 ? Math.max(...yearlyData.map(d => d.totalValue)) * 1.15 : 100;

  const allRelatedCalculators = [
    { href: '/us/tools/calculators/401k-calculator', title: '401(k) Calculator', description: 'Plan your 401k savings', icon: '🏦' },
    { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'See money grow over time', icon: '📈' },
    { href: '/us/tools/calculators/sip-calculator', title: 'SIP Calculator', description: 'Systematic investment plan', icon: '💹' },
    { href: '/us/tools/calculators/investment-calculator', title: 'Investment Calculator', description: 'Calculate investment returns', icon: '💰' },
    { href: '/us/tools/calculators/savings-goal-calculator', title: 'Savings Goal', description: 'Plan your savings target', icon: '🎯' },
    { href: '/us/tools/calculators/inflation-calculator', title: 'Inflation Calculator', description: 'Understand purchasing power', icon: '📉' },
    { href: '/us/tools/calculators/social-security-calculator', title: 'Social Security', description: 'Estimate SS benefits', icon: '🏛️' },
    { href: '/us/tools/calculators/life-expectancy-calculator', title: 'Life Expectancy', description: 'Plan for longevity', icon: '❤️' }
  ];

  // Chart dimensions
  const chartWidth = 800;
  const chartHeight = 300;
  const chartPadding = { top: 20, right: 30, bottom: 40, left: 70 };
  const plotWidth = chartWidth - chartPadding.left - chartPadding.right;
  const plotHeight = chartHeight - chartPadding.top - chartPadding.bottom;

  // Generate line paths
  const generateLinePath = (key: 'totalContributed' | 'interestEarned' | 'totalValue') => {
    if (yearlyData.length === 0) return '';
    return yearlyData.map((d, i) => {
      const x = chartPadding.left + (i / (yearlyData.length - 1)) * plotWidth;
      const y = chartPadding.top + plotHeight - (d[key] / maxChartValue) * plotHeight;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  const generateAreaPath = (key: 'totalContributed' | 'interestEarned' | 'totalValue') => {
    if (yearlyData.length === 0) return '';
    const linePath = generateLinePath(key);
    const startX = chartPadding.left;
    const endX = chartPadding.left + plotWidth;
    const bottomY = chartPadding.top + plotHeight;
    return `${linePath} L ${endX} ${bottomY} L ${startX} ${bottomY} Z`;
  };

  const getPointCoords = (index: number, key: 'totalContributed' | 'interestEarned' | 'totalValue') => {
    if (!yearlyData[index]) return { x: 0, y: 0 };
    const x = chartPadding.left + (index / (yearlyData.length - 1)) * plotWidth;
    const y = chartPadding.top + plotHeight - (yearlyData[index][key] / maxChartValue) * plotHeight;
    return { x, y };
  };

  return (
    <div className="max-w-[1200px] mx-auto px-2 xs:px-3 sm:px-4 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-5 sm:mb-6 md:mb-8">
        <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">{getH1('Retirement Calculator')}</h1>
        <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-600 px-1 sm:px-2 leading-relaxed">Plan your retirement savings and see if you're on track for your goals</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Calculator Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Left: Input Section */}
          <div className="space-y-4 sm:space-y-4 md:space-y-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Your Details</h2>

            {/* Current Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Age</label>
              <input
                type="number"
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                min="18"
                max="80"
              />
            </div>

            {/* Retirement Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Retirement Age</label>
              <input
                type="range"
                value={retirementAge}
                onChange={(e) => setRetirementAge(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                min={currentAge + 1}
                max="85"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{currentAge + 1}</span>
                <span className="font-semibold text-indigo-600">{retirementAge} years old</span>
                <span>85</span>
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
                  className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  min="0"
                  step="1000"
                />
              </div>
            </div>

            {/* Monthly Contribution */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Contribution</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Number(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  min="0"
                  step="50"
                />
              </div>
            </div>

            {/* Annual Return */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expected Annual Return (%)</label>
              <input
                type="number"
                value={annualReturn}
                onChange={(e) => setAnnualReturn(Number(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                min="1"
                max="15"
                step="0.5"
              />
            </div>

            {/* Retirement Income Goal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Desired Monthly Retirement Income</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={retirementIncome}
                  onChange={(e) => setRetirementIncome(Number(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  min="0"
                  step="500"
                />
              </div>
            </div>
          </div>

          {/* Right: Results Section */}
          <div className="space-y-4 sm:space-y-4 md:space-y-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Retirement Projection</h2>

            {/* Total Savings */}
            <div className={`bg-gradient-to-br ${isOnTrack ? 'from-green-50 to-emerald-50 border-green-200' : 'from-orange-50 to-amber-50 border-orange-200'} rounded-xl p-6 border-2`}>
              <div className={`text-sm ${isOnTrack ? 'text-green-600' : 'text-orange-600'} mb-1`}>
                Projected Savings at {retirementAge}
              </div>
              <div className={`text-4xl font-bold ${isOnTrack ? 'text-green-700' : 'text-orange-700'}`}>
                {formatCurrency(results.totalSavings)}
              </div>
              <div className={`text-sm ${isOnTrack ? 'text-green-600' : 'text-orange-600'} mt-2`}>
                {isOnTrack ? '✓ On track to meet your goal!' : '⚠ Below your income goal'}
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-xs text-blue-600">Years to Retirement</div>
                <div className="text-2xl font-bold text-blue-700">{results.yearsToRetirement}</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-xs text-purple-600">Monthly Income (4% Rule)</div>
                <div className="text-2xl font-bold text-purple-700">{formatCurrency(results.monthlyRetirementIncome)}</div>
              </div>
            </div>

            {/* Contributions vs Interest */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-xs text-gray-500">Total Contributions</div>
                <div className="text-lg font-bold text-gray-800">{formatCurrency(results.totalContributions)}</div>
                <div className="text-xs text-gray-500">{results.contributionPercent.toFixed(1)}%</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-xs text-green-600">Interest Earned</div>
                <div className="text-lg font-bold text-green-700">{formatCurrency(results.totalInterest)}</div>
                <div className="text-xs text-green-500">{results.interestPercent.toFixed(1)}%</div>
              </div>
            </div>

            {/* Visual Breakdown */}
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Contributions vs Growth</div>
              <div className="flex h-6 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500"
                  style={{ width: `${results.contributionPercent}%` }}
                ></div>
                <div
                  className="bg-green-500"
                  style={{ width: `${results.interestPercent}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-xs">
                <span className="text-blue-600">Contributions: {results.contributionPercent.toFixed(1)}%</span>
                <span className="text-green-600">Growth: {results.interestPercent.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-4 md:mb-6">Retirement Savings Growth Over Time</h2>

        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
            {/* Gradients */}
            <defs>
              <linearGradient id="retirementContributionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="retirementTotalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = chartPadding.top + plotHeight - ratio * plotHeight;
              return (
                <line
                  key={ratio}
                  x1={chartPadding.left}
                  y1={y}
                  x2={chartWidth - chartPadding.right}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              );
            })}

            {/* Y-axis labels */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = chartPadding.top + plotHeight - ratio * plotHeight;
              const value = maxChartValue * ratio;
              return (
                <text
                  key={ratio}
                  x={chartPadding.left - 10}
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
            {yearlyData.map((d, i) => {
              if (i % Math.ceil(yearlyData.length / 8) === 0 || i === yearlyData.length - 1) {
                const x = chartPadding.left + (i / (yearlyData.length - 1)) * plotWidth;
                return (
                  <text
                    key={i}
                    x={x}
                    y={chartHeight - chartPadding.bottom + 20}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#6b7280"
                  >
                    Age {d.age}
                  </text>
                );
              }
              return null;
            })}

            {/* Contributions area */}
            <path
              d={generateAreaPath('totalContributed')}
              fill="url(#retirementContributionGradient)"
              opacity="0.8"
            />

            {/* Total value area */}
            <path
              d={generateAreaPath('totalValue')}
              fill="url(#retirementTotalGradient)"
              opacity="0.6"
            />

            {/* Lines */}
            <path
              d={generateLinePath('totalContributed')}
              stroke="#3b82f6"
              strokeWidth="3"
              fill="none"
            />
            <path
              d={generateLinePath('totalValue')}
              stroke="#10b981"
              strokeWidth="3"
              fill="none"
            />

            {/* Interactive points */}
            {hoveredYear !== null && yearlyData[hoveredYear] && (
              <>
                <circle
                  cx={getPointCoords(hoveredYear, 'totalContributed').x}
                  cy={getPointCoords(hoveredYear, 'totalContributed').y}
                  r="6"
                  fill="#3b82f6"
                  stroke="white"
                  strokeWidth="2"
                />
                <circle
                  cx={getPointCoords(hoveredYear, 'totalValue').x}
                  cy={getPointCoords(hoveredYear, 'totalValue').y}
                  r="6"
                  fill="#10b981"
                  stroke="white"
                  strokeWidth="2"
                />
              </>
            )}

            {/* Interactive overlay */}
            {yearlyData.map((d, i) => {
              const x = chartPadding.left + (i / (yearlyData.length - 1)) * plotWidth;
              return (
                <rect
                  key={i}
                  x={x - (plotWidth / yearlyData.length) / 2}
                  y={chartPadding.top}
                  width={plotWidth / yearlyData.length}
                  height={plotHeight}
                  fill="transparent"
                  onMouseEnter={() => setHoveredYear(i)}
                  onMouseLeave={() => setHoveredYear(null)}
                  style={{ cursor: 'pointer' }}
                />
              );
            })}
          </svg>

          {/* Legend */}
          <div className="flex justify-center gap-3 sm:gap-4 md:gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-600">Total Contributions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">Total Value</span>
            </div>
          </div>

          {/* Tooltip */}
          {hoveredYear !== null && yearlyData[hoveredYear] && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-semibold text-gray-900 mb-2">Age {yearlyData[hoveredYear].age} (Year {yearlyData[hoveredYear].year})</div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Contributions</div>
                  <div className="font-semibold text-blue-600">{formatCurrencyFull(yearlyData[hoveredYear].totalContributed)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Interest Earned</div>
                  <div className="font-semibold text-orange-600">{formatCurrencyFull(yearlyData[hoveredYear].interestEarned)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Total Value</div>
                  <div className="font-semibold text-green-600">{formatCurrencyFull(yearlyData[hoveredYear].totalValue)}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Breakdown Pie Chart */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-4 md:mb-6">Retirement Savings Breakdown</h2>

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
                stroke="#10b981"
                strokeWidth="160"
                strokeDasharray={`${results.interestPercent * 5.027} 502.7`}
                transform="rotate(-90 100 100)"
              />
              <circle cx="100" cy="100" r="50" fill="white" />
              <text x="100" y="95" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#4b5563">
                {formatCurrency(results.totalSavings)}
              </text>
              <text x="100" y="115" textAnchor="middle" fontSize="12" fill="#6b7280">
                Total Savings
              </text>
            </svg>
          </div>

          {/* Legend and Stats */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm font-medium text-gray-700">Your Contributions</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">{formatCurrencyFull(results.totalContributions)}</div>
                <div className="text-xs text-gray-500">{results.contributionPercent.toFixed(1)}%</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm font-medium text-gray-700">Investment Returns</span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">{formatCurrencyFull(results.totalInterest)}</div>
                <div className="text-xs text-gray-500">{results.interestPercent.toFixed(1)}%</div>
              </div>
            </div>

            <div className="p-3 bg-indigo-50 rounded-lg border-2 border-indigo-200">
              <div className="text-sm text-indigo-600 mb-1">Total at Retirement</div>
              <div className="text-2xl font-bold text-indigo-700">{formatCurrencyFull(results.totalSavings)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Year-by-Year Table */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-4 md:mb-6">Year-by-Year Projection</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 px-2 text-gray-700">Age</th>
                <th className="text-left py-3 px-2 text-gray-700">Year</th>
                <th className="text-right py-3 px-2 text-gray-700">Annual Contribution</th>
                <th className="text-right py-3 px-2 text-gray-700">Total Contributed</th>
                <th className="text-right py-3 px-2 text-gray-700">Interest Earned</th>
                <th className="text-right py-3 px-2 text-gray-700">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {yearlyData.slice(0, showFullSchedule ? yearlyData.length : 10).map((data, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-2 font-medium">{data.age}</td>
                  <td className="py-3 px-2">{data.year}</td>
                  <td className="py-3 px-2 text-right text-blue-600">{formatCurrencyFull(data.contribution)}</td>
                  <td className="py-3 px-2 text-right">{formatCurrencyFull(data.totalContributed)}</td>
                  <td className="py-3 px-2 text-right text-orange-600">{formatCurrencyFull(data.interestEarned)}</td>
                  <td className="py-3 px-2 text-right font-semibold text-green-600">{formatCurrencyFull(data.totalValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {yearlyData.length > 10 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowFullSchedule(!showFullSchedule)}
              className="px-3 sm:px-4 md:px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {showFullSchedule ? 'Show Less' : `Show All ${yearlyData.length} Years`}
            </button>
          </div>
        )}
      </div>

      {/* MREC Banners */}
      <CalculatorAfterCalcBanners />

      {/* Related Calculators */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-3 xs:mb-4 sm:mb-4 md:mb-6">Related Retirement Calculators</h2>
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
          {allRelatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group touch-manipulation">
              <div className="rounded-lg xs:rounded-xl p-2 xs:p-3 sm:p-4 bg-white border border-gray-200 hover:border-indigo-300 active:border-indigo-400 hover:shadow-md active:shadow-lg transition-all h-full">
                <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-indigo-50 rounded-md xs:rounded-lg flex items-center justify-center mb-1.5 xs:mb-2 sm:mb-3 text-base xs:text-lg sm:text-2xl">
                  {calc.icon}
                </div>
                <h3 className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-900 mb-0.5 xs:mb-1 group-hover:text-indigo-600 transition-colors leading-tight">
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
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Understanding Retirement Planning</h2>
        <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-3 xs:mb-4 sm:mb-4 md:mb-6 leading-relaxed">
          Retirement planning is one of the most important financial decisions you&apos;ll make. The earlier you start saving, the more time
          your money has to grow through compound interest. This calculator helps you project your retirement savings based on your current
          age, savings rate, and expected investment returns, giving you a clear picture of your financial future.
        </p>

        <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 xs:gap-4 sm:gap-4 md:gap-6 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
          <div className="bg-indigo-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-indigo-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Start Early</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Every decade you delay cuts your retirement savings roughly in half</p>
          </div>
          <div className="bg-green-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-green-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Maximize Matching</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Always contribute enough to get your full employer 401(k) match</p>
          </div>
          <div className="bg-purple-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-purple-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">The 4% Rule</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Withdraw 4% annually for a high chance of funds lasting 30+ years</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-3 sm:gap-4 md:gap-6">
          <div>
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Retirement Savings Milestones</h2>
            <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-600">
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-indigo-500 mt-0.5 flex-shrink-0">•</span>
                <span><strong>Age 30:</strong> 1x your annual salary saved</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-indigo-500 mt-0.5 flex-shrink-0">•</span>
                <span><strong>Age 40:</strong> 3x your annual salary saved</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-indigo-500 mt-0.5 flex-shrink-0">•</span>
                <span><strong>Age 50:</strong> 6x your annual salary saved</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-indigo-500 mt-0.5 flex-shrink-0">•</span>
                <span><strong>Age 60:</strong> 8x your annual salary saved</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-indigo-500 mt-0.5 flex-shrink-0">•</span>
                <span><strong>Age 67:</strong> 10x your annual salary saved</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Retirement Account Types</h2>
            <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-600">
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span><strong>401(k):</strong> Employer-sponsored, often with matching</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span><strong>Traditional IRA:</strong> Tax-deferred growth, deductible contributions</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span><strong>Roth IRA:</strong> Tax-free withdrawals in retirement</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span><strong>HSA:</strong> Triple tax advantage for healthcare</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-3 xs:mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="retirement-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
