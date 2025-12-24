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
  year: number;
  interest: number;
  totalInterest: number;
  totalValue: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is the difference between simple interest and compound interest?",
    answer: "Simple interest is calculated only on the original principal amount throughout the entire loan or investment period. Compound interest, on the other hand, is calculated on both the principal and the accumulated interest from previous periods. For example, if you invest $1,000 at 5% for 3 years: Simple interest earns $150 total ($50 per year), while compound interest (annually) earns approximately $157.63. The difference becomes more significant over longer time periods.",
    order: 1
  },
  {
    id: '2',
    question: "When is simple interest used instead of compound interest?",
    answer: "Simple interest is commonly used for short-term loans, car loans, some personal loans, and certain bonds. It's also used in specific savings accounts (though rare), payday loans, and consumer installment loans. Lenders often prefer simple interest for auto loans because it's easier for borrowers to understand, and payments are predictable. For investments, simple interest is less common but may be found in certain Treasury bills and short-term deposits.",
    order: 2
  },
  {
    id: '3',
    question: "How do I calculate simple interest manually?",
    answer: "Use the formula: Simple Interest = Principal × Rate × Time ÷ 100. For example, to find interest on $5,000 at 6% for 2 years: SI = $5,000 × 6 × 2 ÷ 100 = $600. The total amount at the end would be $5,600 (principal + interest). Remember that the rate should be the annual percentage, and time should be in years. If you have months, divide by 12; for days, divide by 365.",
    order: 3
  },
  {
    id: '4',
    question: "What factors affect how much simple interest I earn or pay?",
    answer: "Three main factors affect simple interest: 1) Principal - the larger your initial amount, the more interest you earn or pay. 2) Interest Rate - higher rates mean more interest. Even a 1% difference can be significant on large amounts. 3) Time Period - longer durations result in more interest earned or paid. Unlike compound interest, these factors have a direct, linear relationship with simple interest.",
    order: 4
  },
  {
    id: '5',
    question: "Is simple interest better for borrowers or lenders?",
    answer: "Simple interest is generally better for borrowers because you only pay interest on the original loan amount, not on accumulated interest. This means lower total interest payments compared to compound interest loans. For lenders and investors, compound interest is typically more profitable over time, especially for longer-term investments. However, for short-term situations (less than a year), the difference between simple and compound interest is minimal.",
    order: 5
  }
];

export default function SimpleInterestClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('simple-interest-calculator');

  const [principal, setPrincipal] = useState(10000);
  const [interestRate, setInterestRate] = useState(5);
  const [timePeriod, setTimePeriod] = useState(5);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  const [results, setResults] = useState({
    simpleInterest: 0,
    totalAmount: 0,
    annualInterest: 0,
    monthlyInterest: 0,
    interestPercent: 0,
    principalPercent: 0
  });

  const [yearlyData, setYearlyData] = useState<YearlyData[]>([]);

  const calculateSimpleInterest = (p: number, r: number, t: number) => {
    const interest = (p * r * t) / 100;
    const total = p + interest;
    const annual = (p * r) / 100;
    return { interest, total, annual };
  };

  useEffect(() => {
    if (principal <= 0 || interestRate < 0 || timePeriod <= 0) return;

    const result = calculateSimpleInterest(principal, interestRate, timePeriod);
    const interestPercent = (result.interest / result.total) * 100;
    const principalPercent = (principal / result.total) * 100;

    setResults({
      simpleInterest: result.interest,
      totalAmount: result.total,
      annualInterest: result.annual,
      monthlyInterest: result.annual / 12,
      interestPercent,
      principalPercent
    });

    // Generate year-by-year data
    const data: YearlyData[] = [];
    const annualInterest = (principal * interestRate) / 100;

    for (let year = 0; year <= timePeriod; year++) {
      const totalInterest = annualInterest * year;
      const totalValue = principal + totalInterest;
      data.push({
        year,
        interest: year === 0 ? 0 : annualInterest,
        totalInterest,
        totalValue
      });
    }

    setYearlyData(data);
  }, [principal, interestRate, timePeriod]);

  // What-if scenarios
  const scenarios = useMemo(() => {
    const current = calculateSimpleInterest(principal, interestRate, timePeriod);
    const higherRate = calculateSimpleInterest(principal, interestRate + 2, timePeriod);
    const longerTerm = calculateSimpleInterest(principal, interestRate, timePeriod + 3);

    return {
      current: {
        ...current,
        principal,
        rate: interestRate,
        term: timePeriod
      },
      higherRate: {
        ...higherRate,
        principal,
        rate: interestRate + 2,
        term: timePeriod,
        diff: higherRate.interest - current.interest
      },
      longerTerm: {
        ...longerTerm,
        principal,
        rate: interestRate,
        term: timePeriod + 3,
        diff: longerTerm.interest - current.interest
      }
    };
  }, [principal, interestRate, timePeriod]);

  const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1000000) {
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
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const allRelatedCalculators = [
    { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound returns', icon: '💹' },
    { href: '/us/tools/calculators/sip-calculator', title: 'SIP Calculator', description: 'Systematic investment plan', icon: '💰' },
    { href: '/us/tools/calculators/cagr-calculator', title: 'CAGR Calculator', description: 'Compound annual growth rate', icon: '📊' },
    { href: '/us/tools/calculators/roi-calculator', title: 'ROI Calculator', description: 'Return on investment', icon: '📈' },
    { href: '/us/tools/calculators/loan-calculator', title: 'Loan Calculator', description: 'Calculate loan payments', icon: '🏦' },
    { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Equated monthly installment', icon: '💳' },
    { href: '/us/tools/calculators/investment-growth-calculator', title: 'Investment Growth', description: 'Track investment growth', icon: '🌱' },
    { href: '/us/tools/calculators/savings-goal-calculator', title: 'Savings Goal', description: 'Track savings targets', icon: '🎯' }
  ];

  // Chart dimensions
  const chartWidth = 800;
  const chartHeight = 300;
  const chartPadding = { top: 20, right: 30, bottom: 40, left: 70 };
  const plotWidth = chartWidth - chartPadding.left - chartPadding.right;
  const plotHeight = chartHeight - chartPadding.top - chartPadding.bottom;

  const maxChartValue = yearlyData.length > 0 ? Math.max(...yearlyData.map(d => d.totalValue)) * 1.15 : 100;

  // Generate line path
  const generateLinePath = () => {
    if (yearlyData.length === 0) return '';
    return yearlyData.map((d, i) => {
      const x = chartPadding.left + (i / (yearlyData.length - 1)) * plotWidth;
      const y = chartPadding.top + plotHeight - (d.totalValue / maxChartValue) * plotHeight;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  // Generate area path
  const generateAreaPath = () => {
    if (yearlyData.length === 0) return '';
    const linePath = generateLinePath();
    const startX = chartPadding.left;
    const endX = chartPadding.left + plotWidth;
    const bottomY = chartPadding.top + plotHeight;
    return `${linePath} L ${endX} ${bottomY} L ${startX} ${bottomY} Z`;
  };

  // Get point coordinates
  const getPointCoords = (index: number) => {
    if (!yearlyData[index]) return { x: 0, y: 0 };
    const x = chartPadding.left + (index / (yearlyData.length - 1)) * plotWidth;
    const y = chartPadding.top + plotHeight - (yearlyData[index].totalValue / maxChartValue) * plotHeight;
    return { x, y };
  };

  const setPreset = (p: number, r: number, t: number) => {
    setPrincipal(p);
    setInterestRate(r);
    setTimePeriod(t);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-2 xs:px-3 sm:px-4 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-5 sm:mb-6 md:mb-8">
        <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">{getH1('Simple Interest Calculator')}</h1>
        <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-600 px-1 sm:px-2 leading-relaxed">Calculate simple interest on your investments or loans with linear growth</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Calculator Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Left: Input Section */}
          <div className="space-y-4 sm:space-y-4 md:space-y-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Enter Values</h2>

            {/* Principal Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Principal Amount ($)</label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter principal"
              />
            </div>

            {/* Interest Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Annual Interest Rate (%)</label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                step="0.1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter rate"
              />
            </div>

            {/* Time Period */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Period (Years)</label>
              <input
                type="number"
                value={timePeriod}
                onChange={(e) => setTimePeriod(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter years"
              />
            </div>

            {/* Quick Presets */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quick Presets</label>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setPreset(5000, 5, 3)} className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-teal-100 rounded-lg">$5K, 5%, 3yr</button>
                <button onClick={() => setPreset(10000, 6, 5)} className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-teal-100 rounded-lg">$10K, 6%, 5yr</button>
                <button onClick={() => setPreset(25000, 7, 10)} className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-teal-100 rounded-lg">$25K, 7%, 10yr</button>
              </div>
            </div>
          </div>

          {/* Right: Results Section */}
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-3 sm:p-4 border border-teal-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Results</h2>

            {/* Main Results */}
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm text-gray-500">Simple Interest Earned</div>
                <div className="text-2xl sm:text-2xl md:text-3xl font-bold text-teal-600">{formatCurrencyFull(results.simpleInterest)}</div>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm text-gray-500">Total Amount</div>
                <div className="text-2xl sm:text-2xl md:text-3xl font-bold text-green-600">{formatCurrencyFull(results.totalAmount)}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-xs text-gray-500">Annual Interest</div>
                  <div className="text-lg font-bold text-gray-800">{formatCurrencyFull(results.annualInterest)}</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-xs text-gray-500">Monthly Interest</div>
                  <div className="text-lg font-bold text-gray-800">{formatCurrencyFull(results.monthlyInterest)}</div>
                </div>
              </div>

              {/* Breakdown */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm font-medium text-gray-700 mb-2">Breakdown</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Principal</span>
                    <span className="font-medium">{formatCurrency(principal)} ({results.principalPercent.toFixed(1)}%)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Interest</span>
                    <span className="font-medium">{formatCurrency(results.simpleInterest)} ({results.interestPercent.toFixed(1)}%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interest Growth Chart */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-4 md:mb-6">Interest Growth Over Time</h2>

        <div className="overflow-x-auto relative">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto"
            style={{ minHeight: '300px' }}
          >
            {/* Gradient definitions */}
            <defs>
              <linearGradient id="simpleInterestPrincipalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0891b2" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0891b2" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="simpleInterestTotalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const y = chartPadding.top + plotHeight - ratio * plotHeight;
              const value = maxChartValue * ratio;
              return (
                <g key={i}>
                  <line
                    x1={chartPadding.left}
                    y1={y}
                    x2={chartWidth - chartPadding.right}
                    y2={y}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    strokeDasharray="4"
                  />
                  <text
                    x={chartPadding.left - 10}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="12"
                    fill="#6b7280"
                  >
                    {formatCurrency(value)}
                  </text>
                </g>
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
                    Yr {d.year}
                  </text>
                );
              }
              return null;
            })}

            {/* Principal line (flat) */}
            <line
              x1={chartPadding.left}
              y1={chartPadding.top + plotHeight - (principal / maxChartValue) * plotHeight}
              x2={chartPadding.left + plotWidth}
              y2={chartPadding.top + plotHeight - (principal / maxChartValue) * plotHeight}
              stroke="#0891b2"
              strokeWidth="3"
              strokeDasharray="8 4"
            />

            {/* Total value line (ascending) */}
            {yearlyData.length > 1 && (
              <path
                d={yearlyData.map((d, i) => {
                  const x = chartPadding.left + (i / (yearlyData.length - 1)) * plotWidth;
                  const y = chartPadding.top + plotHeight - (d.totalValue / maxChartValue) * plotHeight;
                  return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ')}
                stroke="#14b8a6"
                strokeWidth="3"
                fill="none"
              />
            )}

            {/* Interactive points */}
            {hoveredYear !== null && yearlyData[hoveredYear] && (
              <circle
                cx={chartPadding.left + (hoveredYear / (yearlyData.length - 1)) * plotWidth}
                cy={chartPadding.top + plotHeight - (yearlyData[hoveredYear].totalValue / maxChartValue) * plotHeight}
                r="6"
                fill="#14b8a6"
                stroke="white"
                strokeWidth="2"
              />
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
              <div className="w-4 h-1 bg-cyan-600" style={{ borderTop: '3px dashed' }}></div>
              <span className="text-sm text-gray-600">Principal (Flat)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-teal-500 rounded"></div>
              <span className="text-sm text-gray-600">Total Value (Linear Growth)</span>
            </div>
          </div>

          {/* Tooltip */}
          {hoveredYear !== null && yearlyData[hoveredYear] && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-semibold text-gray-900 mb-2">Year {yearlyData[hoveredYear].year}</div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Principal</div>
                  <div className="font-semibold text-cyan-600">{formatCurrencyFull(principal)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Interest Earned</div>
                  <div className="font-semibold text-teal-600">{formatCurrencyFull(yearlyData[hoveredYear].totalInterest)}</div>
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
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-4 md:mb-6">Principal vs Interest Breakdown</h2>

        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 items-center">
          {/* Pie Chart */}
          <div className="flex justify-center">
            <svg viewBox="0 0 200 200" className="w-full max-w-[200px] h-auto">
              <circle cx="100" cy="100" r="80" fill="#0891b2" />
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="transparent"
                stroke="#14b8a6"
                strokeWidth="160"
                strokeDasharray={`${results.interestPercent * 5.027} 502.7`}
                transform="rotate(-90 100 100)"
              />
              <circle cx="100" cy="100" r="50" fill="white" />
              <text x="100" y="95" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#4b5563">
                {formatCurrency(results.totalAmount)}
              </text>
              <text x="100" y="115" textAnchor="middle" fontSize="12" fill="#6b7280">
                Total
              </text>
            </svg>
          </div>

          {/* Legend and Stats */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-cyan-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-cyan-600 rounded"></div>
                <span className="font-medium text-gray-700">Principal Amount</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-cyan-700">{formatCurrency(principal)}</div>
                <div className="text-sm text-cyan-600">{results.principalPercent.toFixed(1)}%</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-teal-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-teal-500 rounded"></div>
                <span className="font-medium text-gray-700">Simple Interest</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-teal-700">{formatCurrency(results.simpleInterest)}</div>
                <div className="text-sm text-teal-600">{results.interestPercent.toFixed(1)}%</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500">Annual Interest</div>
                <div className="text-lg font-bold text-gray-800">{formatCurrency(results.annualInterest)}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500">Monthly Interest</div>
                <div className="text-lg font-bold text-gray-800">{formatCurrency(results.monthlyInterest)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Year-by-Year Breakdown Table */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Year-by-Year Interest Breakdown</h2>
          <button
            onClick={() => setShowFullSchedule(!showFullSchedule)}
            className="px-4 py-2 text-sm bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-lg transition-colors"
          >
            {showFullSchedule ? 'Show Less' : 'Show All Years'}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-2 font-semibold text-gray-700">Year</th>
                <th className="text-right py-3 px-2 font-semibold text-gray-700">Annual Interest</th>
                <th className="text-right py-3 px-2 font-semibold text-gray-700">Total Interest</th>
                <th className="text-right py-3 px-2 font-semibold text-gray-700">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {(showFullSchedule ? yearlyData : yearlyData.slice(0, 5)).map((data, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2 font-medium text-gray-900">{data.year}</td>
                  <td className="text-right py-3 px-2 text-teal-600">{formatCurrencyFull(data.interest)}</td>
                  <td className="text-right py-3 px-2 text-teal-700 font-medium">{formatCurrencyFull(data.totalInterest)}</td>
                  <td className="text-right py-3 px-2 font-semibold text-green-700">{formatCurrencyFull(data.totalValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!showFullSchedule && yearlyData.length > 5 && (
          <div className="text-center mt-4 text-sm text-gray-500">
            Showing 5 of {yearlyData.length} years
          </div>
        )}
      </div>

      {/* MREC Banners */}
      <CalculatorAfterCalcBanners />

      {/* Related Finance Calculators */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-3 xs:mb-4 sm:mb-4 md:mb-6">Related Finance Calculators</h2>
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
          {allRelatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group touch-manipulation">
              <div className="rounded-lg xs:rounded-xl p-2 xs:p-3 sm:p-4 bg-white border border-gray-200 hover:border-teal-300 active:border-teal-400 hover:shadow-md active:shadow-lg transition-all h-full">
                <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-teal-50 rounded-md xs:rounded-lg flex items-center justify-center mb-1.5 xs:mb-2 sm:mb-3 text-base xs:text-lg sm:text-2xl">
                  {calc.icon}
                </div>
                <h3 className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-900 mb-0.5 xs:mb-1 group-hover:text-teal-600 transition-colors leading-tight">
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
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Understanding Simple Interest</h2>
        <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-3 xs:mb-4 sm:mb-4 md:mb-6 leading-relaxed">
          Simple interest is the most straightforward way to calculate interest on a principal amount. Unlike compound interest,
          simple interest is calculated only on the original principal, not on accumulated interest. This makes it easier to predict
          and is commonly used for short-term loans, car loans, and some types of personal loans.
        </p>

        <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 xs:gap-4 sm:gap-4 md:gap-6 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
          <div className="bg-teal-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-teal-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Easy to Calculate</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">I = P × R × T is all you need to know</p>
          </div>
          <div className="bg-green-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-green-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Predictable Payments</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Total interest is fixed from day one</p>
          </div>
          <div className="bg-purple-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-purple-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Lower Total Cost</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Pays less interest than compound interest</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-3 sm:gap-4 md:gap-6">
          <div>
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Simple Interest Formula</h2>
            <div className="bg-gray-50 rounded-lg p-3 xs:p-4 mb-3 font-mono text-sm">
              <p><strong>I = P × R × T</strong></p>
              <p className="text-gray-600 mt-2">Where:</p>
              <ul className="text-gray-600 text-xs xs:text-sm">
                <li>I = Interest earned</li>
                <li>P = Principal amount</li>
                <li>R = Annual interest rate (decimal)</li>
                <li>T = Time period (in years)</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Common Uses</h2>
            <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-600">
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-teal-500 mt-0.5 flex-shrink-0">🚗</span>
                <span><strong>Auto Loans:</strong> Many car loans use simple interest</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-teal-500 mt-0.5 flex-shrink-0">💵</span>
                <span><strong>Personal Loans:</strong> Short-term lending often uses simple interest</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-teal-500 mt-0.5 flex-shrink-0">📊</span>
                <span><strong>Treasury Bills:</strong> Government securities use simple interest</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-teal-500 mt-0.5 flex-shrink-0">🎓</span>
                <span><strong>Some Student Loans:</strong> While in school, federal loans accrue simple interest</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-3 xs:mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="simple-interest-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
