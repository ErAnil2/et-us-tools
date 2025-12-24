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
  investment: number;
  totalInvested: number;
  interestEarned: number;
  totalValue: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is SIP and how does it work?",
    answer: "SIP (Systematic Investment Plan) is an investment method where you invest a fixed amount regularly (usually monthly) into mutual funds or ETFs. Instead of investing a lump sum, you spread your investment over time. Each SIP installment buys units at the current market price, and over time, you accumulate units at various price points. This disciplined approach helps build wealth through the power of compounding while reducing the impact of market volatility.",
    order: 1
  },
  {
    id: '2',
    question: "What is dollar cost averaging and why is it beneficial?",
    answer: "Dollar cost averaging is the investment strategy at the heart of SIP investing. When you invest a fixed amount regularly, you automatically buy more units when prices are low and fewer units when prices are high. This averages out your cost per unit over time, reducing the risk of investing a large amount at the wrong time. It eliminates the need to time the market and provides emotional discipline during market fluctuations.",
    order: 2
  },
  {
    id: '3',
    question: "How much should I invest in SIP monthly?",
    answer: "A common guideline is to invest 15-20% of your monthly income, but the ideal amount depends on your financial goals, timeline, and current expenses. Start with an amount you can consistently invest without straining your budget - even $100-$500/month can grow significantly over 10-20 years. Use the step-up feature to increase your SIP amount annually as your income grows. The key is consistency; it's better to invest a smaller amount regularly than a larger amount sporadically.",
    order: 3
  },
  {
    id: '4',
    question: "What returns can I expect from SIP investments?",
    answer: "SIP returns depend on your investment choice and market conditions. Historically, equity mutual funds in the US have delivered 7-12% average annual returns over long periods (10+ years), though past performance doesn't guarantee future results. Bond funds typically offer lower but more stable returns (3-6%). A balanced portfolio might target 6-8% returns. Remember that SIP returns compound over time, so the longer you invest, the more powerful the growth effect.",
    order: 4
  },
  {
    id: '5',
    question: "Can I stop, pause, or modify my SIP?",
    answer: "Yes, SIP investments offer complete flexibility. You can pause your SIP during financial difficulties, increase or decrease the amount as your circumstances change, or stop it altogether. Most platforms allow you to modify SIP details online. However, try to maintain consistency for the best results. If you need to reduce amounts temporarily, that's better than stopping completely and losing the discipline of regular investing.",
    order: 5
  }
];

export default function SIPCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('sip-calculator');

  const [monthlyInvestment, setMonthlyInvestment] = useState(500);
  const [timePeriod, setTimePeriod] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(8);
  const [frequency, setFrequency] = useState('monthly');
  const [annualIncrease, setAnnualIncrease] = useState(0);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);
  const [hoveredScenario, setHoveredScenario] = useState<string | null>(null);
  const [tooltipData, setTooltipData] = useState<{ x: number; y: number; year: number; data: YearlyData } | null>(null);

  const [results, setResults] = useState({
    totalInvestment: 0,
    estimatedReturns: 0,
    totalValue: 0,
    investmentPercent: 0,
    returnsPercent: 0,
    totalMonths: 0,
    avgReturnRate: 0,
    returnMultiple: 0,
    annualizedReturn: 0
  });

  const [yearlyData, setYearlyData] = useState<YearlyData[]>([]);

  const calculateSIP = (monthly: number, years: number, rate: number, stepUp: number = 0) => {
    const monthlyRate = rate / 12 / 100;
    let totalInvested = 0;
    let totalValue = 0;
    const yearlyBreakdown: YearlyData[] = [];
    let currentMonthly = monthly;

    for (let year = 1; year <= years; year++) {
      let yearInvestment = 0;

      for (let month = 1; month <= 12; month++) {
        totalInvested += currentMonthly;
        yearInvestment += currentMonthly;
        totalValue = (totalValue + currentMonthly) * (1 + monthlyRate);
      }

      yearlyBreakdown.push({
        year,
        investment: yearInvestment,
        totalInvested,
        interestEarned: totalValue - totalInvested,
        totalValue
      });

      if (stepUp > 0) {
        currentMonthly = currentMonthly * (1 + stepUp / 100);
      }
    }

    return {
      totalInvested,
      totalValue,
      returns: totalValue - totalInvested,
      yearlyBreakdown
    };
  };

  useEffect(() => {
    const result = calculateSIP(monthlyInvestment, timePeriod, expectedReturn, annualIncrease);
    const investmentPercent = (result.totalInvested / result.totalValue) * 100;
    const returnsPercent = (result.returns / result.totalValue) * 100;

    setResults({
      totalInvestment: result.totalInvested,
      estimatedReturns: result.returns,
      totalValue: result.totalValue,
      investmentPercent,
      returnsPercent,
      totalMonths: timePeriod * 12,
      avgReturnRate: expectedReturn,
      returnMultiple: result.totalValue / result.totalInvested,
      annualizedReturn: ((Math.pow(result.totalValue / result.totalInvested, 1 / timePeriod) - 1) * 100)
    });

    setYearlyData(result.yearlyBreakdown);
  }, [monthlyInvestment, timePeriod, expectedReturn, annualIncrease]);

  const scenarios = useMemo(() => {
    const current = calculateSIP(monthlyInvestment, timePeriod, expectedReturn, annualIncrease);
    const higherInvestment = calculateSIP(monthlyInvestment * 1.2, timePeriod, expectedReturn, annualIncrease);
    const longerDuration = calculateSIP(monthlyInvestment, timePeriod + 5, expectedReturn, annualIncrease);

    return {
      current: { ...current, monthly: monthlyInvestment, years: timePeriod, rate: expectedReturn },
      higher: {
        ...higherInvestment,
        monthly: Math.round(monthlyInvestment * 1.2),
        years: timePeriod,
        rate: expectedReturn,
        diff: higherInvestment.totalValue - current.totalValue
      },
      longer: {
        ...longerDuration,
        monthly: monthlyInvestment,
        years: timePeriod + 5,
        rate: expectedReturn,
        diff: longerDuration.totalValue - current.totalValue
      }
    };
  }, [monthlyInvestment, timePeriod, expectedReturn, annualIncrease]);

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

  const maxChartValue = yearlyData.length > 0 ? Math.max(...yearlyData.map(d => d.totalValue)) * 1.15 : 100;
  const scenarioMax = Math.max(scenarios.current.totalValue, scenarios.higher.totalValue, scenarios.longer.totalValue) * 1.1;

  const allRelatedCalculators = [
    { href: '/us/tools/calculators/roi-calculator', title: 'ROI Calculator', description: 'Calculate return on investment', icon: '📈' },
    { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest growth', icon: '💹' },
    { href: '/us/tools/calculators/simple-interest-calculator', title: 'Simple Interest', description: 'Calculate simple interest', icon: '💰' },
    { href: '/us/tools/calculators/401k-calculator', title: '401k Calculator', description: 'Plan your retirement savings', icon: '🏦' },
    { href: '/us/tools/calculators/investment-calculator', title: 'Investment Calculator', description: 'Calculate investment growth', icon: '📊' },
    { href: '/us/tools/calculators/retirement-calculator', title: 'Retirement Calculator', description: 'Plan for retirement', icon: '🎯' },
    { href: '/us/tools/calculators/savings-goal-calculator', title: 'Savings Goal', description: 'Track savings progress', icon: '🎪' },
    { href: '/us/tools/calculators/inflation-calculator', title: 'Inflation Calculator', description: 'Calculate inflation impact', icon: '📉' }
  ];

  // Chart dimensions
  const chartWidth = 800;
  const chartHeight = 300;
  const chartPadding = { top: 20, right: 30, bottom: 40, left: 70 };
  const plotWidth = chartWidth - chartPadding.left - chartPadding.right;
  const plotHeight = chartHeight - chartPadding.top - chartPadding.bottom;

  // Generate smooth line path
  const generateLinePath = (data: YearlyData[], key: 'totalInvested' | 'interestEarned' | 'totalValue') => {
    if (data.length === 0) return '';

    return data.map((d, i) => {
      const x = chartPadding.left + (i / (data.length - 1)) * plotWidth;
      const y = chartPadding.top + plotHeight - (d[key] / maxChartValue) * plotHeight;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  // Generate area path
  const generateAreaPath = (data: YearlyData[], key: 'totalInvested' | 'interestEarned' | 'totalValue') => {
    if (data.length === 0) return '';
    const linePath = generateLinePath(data, key);
    const startX = chartPadding.left;
    const endX = chartPadding.left + plotWidth;
    const bottomY = chartPadding.top + plotHeight;
    return `${linePath} L ${endX} ${bottomY} L ${startX} ${bottomY} Z`;
  };

  // Get point coordinates
  const getPointCoords = (index: number, key: 'totalInvested' | 'interestEarned' | 'totalValue') => {
    if (!yearlyData[index]) return { x: 0, y: 0 };
    const x = chartPadding.left + (index / (yearlyData.length - 1)) * plotWidth;
    const y = chartPadding.top + plotHeight - (yearlyData[index][key] / maxChartValue) * plotHeight;
    return { x, y };
  };

  // Y-axis ticks
  const yAxisTicks = [0, 0.25, 0.5, 0.75, 1].map(ratio => ({
    value: maxChartValue * ratio,
    y: chartPadding.top + plotHeight - ratio * plotHeight
  }));

  return (
    <div className="max-w-[1200px] mx-auto px-2 xs:px-3 sm:px-4 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-5 sm:mb-6 md:mb-8">
        <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">{getH1('SIP Calculator')}</h1>
        <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-600 px-1 sm:px-2 leading-relaxed">Calculate your SIP investment returns with systematic investment planning and compound growth analysis</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Calculator Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Left: Input Section */}
          <div className="space-y-4 sm:space-y-4 md:space-y-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Investment Details</h2>

            {/* Monthly Investment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Investment</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(Number(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="50"
                  step="50"
                />
              </div>
            </div>

            {/* Time Period */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Investment Period (Years)</label>
              <input
                type="range"
                value={timePeriod}
                onChange={(e) => setTimePeriod(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                min="1"
                max="30"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 year</span>
                <span className="font-semibold text-blue-600">{timePeriod} years</span>
                <span>30 years</span>
              </div>
            </div>

            {/* Expected Return */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expected Annual Return (%)</label>
              <input
                type="number"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Number(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                max="25"
                step="0.5"
              />
            </div>

            {/* Annual Step-up */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Annual Increase (%)</label>
              <input
                type="number"
                value={annualIncrease}
                onChange={(e) => setAnnualIncrease(Number(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                max="25"
                step="1"
              />
              <p className="text-xs text-gray-500 mt-1">Increase SIP amount yearly by this percentage</p>
            </div>
          </div>

          {/* Right: Results Section */}
          <div className="space-y-4 sm:space-y-4 md:space-y-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Investment Results</h2>

            {/* Total Value */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-4 md:p-6 border-2 border-blue-200">
              <div className="text-sm text-blue-600 mb-1">Total Value at Maturity</div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-700">{formatCurrency(results.totalValue)}</div>
              <div className="text-sm text-blue-600 mt-2">{results.returnMultiple.toFixed(2)}x your investment</div>
            </div>

            {/* Investment vs Returns */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-xs text-gray-500">Total Investment</div>
                <div className="text-lg font-bold text-gray-800">{formatCurrency(results.totalInvestment)}</div>
                <div className="text-xs text-gray-500">{results.investmentPercent.toFixed(1)}%</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-xs text-green-600">Estimated Returns</div>
                <div className="text-lg font-bold text-green-700">{formatCurrency(results.estimatedReturns)}</div>
                <div className="text-xs text-green-500">{results.returnsPercent.toFixed(1)}%</div>
              </div>
            </div>

            {/* Visual Breakdown */}
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Investment vs Returns</div>
              <div className="flex h-6 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500"
                  style={{ width: `${results.investmentPercent}%` }}
                ></div>
                <div
                  className="bg-green-500"
                  style={{ width: `${results.returnsPercent}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-xs">
                <span className="text-blue-600">Investment: {results.investmentPercent.toFixed(1)}%</span>
                <span className="text-green-600">Returns: {results.returnsPercent.toFixed(1)}%</span>
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-xs text-purple-600">Total Months</div>
                <div className="text-lg font-bold text-purple-700">{results.totalMonths}</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-xs text-orange-600">Annualized Return</div>
                <div className="text-lg font-bold text-orange-700">{results.annualizedReturn.toFixed(2)}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Growth Chart */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-4 md:mb-6">Investment Growth Over Time</h2>

        <div className="overflow-x-auto relative">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto"
            style={{ minHeight: '300px' }}
            onMouseLeave={() => setTooltipData(null)}
          >
            {/* Grid lines */}
            {yAxisTicks.map((tick, i) => (
              <g key={i}>
                <line
                  x1={chartPadding.left}
                  y1={tick.y}
                  x2={chartWidth - chartPadding.right}
                  y2={tick.y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  strokeDasharray="4"
                />
                <text
                  x={chartPadding.left - 10}
                  y={tick.y + 4}
                  textAnchor="end"
                  fontSize="12"
                  fill="#6b7280"
                >
                  {formatCurrency(tick.value)}
                </text>
              </g>
            ))}

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
                    Year {d.year}
                  </text>
                );
              }
              return null;
            })}

            {/* Invested area */}
            <path
              d={generateAreaPath(yearlyData, 'totalInvested')}
              fill="url(#investedGradient)"
              opacity="0.8"
            />

            {/* Returns area */}
            <path
              d={generateAreaPath(yearlyData, 'totalValue')}
              fill="url(#returnsGradient)"
              opacity="0.6"
            />

            {/* Lines */}
            <path
              d={generateLinePath(yearlyData, 'totalInvested')}
              stroke="#3b82f6"
              strokeWidth="3"
              fill="none"
            />
            <path
              d={generateLinePath(yearlyData, 'totalValue')}
              stroke="#10b981"
              strokeWidth="3"
              fill="none"
            />

            {/* Interactive hover areas */}
            {yearlyData.map((d, i) => {
              const x = chartPadding.left + (i / (yearlyData.length - 1)) * plotWidth;
              const y = chartPadding.top + plotHeight - (d.totalValue / maxChartValue) * plotHeight;
              const rectWidth = plotWidth / yearlyData.length;

              return (
                <rect
                  key={i}
                  x={x - rectWidth / 2}
                  y={chartPadding.top}
                  width={rectWidth}
                  height={plotHeight}
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={(e) => {
                    setTooltipData({ x, y, year: d.year, data: d });
                  }}
                />
              );
            })}

            {/* Hover points and tooltip */}
            {tooltipData && (
              <>
                <circle
                  cx={getPointCoords(tooltipData.year - 1, 'totalInvested').x}
                  cy={getPointCoords(tooltipData.year - 1, 'totalInvested').y}
                  r="6"
                  fill="#3b82f6"
                  stroke="white"
                  strokeWidth="3"
                />
                <circle
                  cx={getPointCoords(tooltipData.year - 1, 'totalValue').x}
                  cy={getPointCoords(tooltipData.year - 1, 'totalValue').y}
                  r="6"
                  fill="#10b981"
                  stroke="white"
                  strokeWidth="3"
                />
              </>
            )}

            {/* Hover points from table */}
            {hoveredYear !== null && yearlyData[hoveredYear - 1] && !tooltipData && (
              <>
                <circle
                  cx={getPointCoords(hoveredYear - 1, 'totalInvested').x}
                  cy={getPointCoords(hoveredYear - 1, 'totalInvested').y}
                  r="5"
                  fill="#3b82f6"
                  stroke="white"
                  strokeWidth="2"
                />
                <circle
                  cx={getPointCoords(hoveredYear - 1, 'totalValue').x}
                  cy={getPointCoords(hoveredYear - 1, 'totalValue').y}
                  r="5"
                  fill="#10b981"
                  stroke="white"
                  strokeWidth="2"
                />
              </>
            )}

            {/* Gradients */}
            <defs>
              <linearGradient id="investedGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="returnsGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
              </linearGradient>
            </defs>
          </svg>

          {/* Tooltip */}
          {tooltipData && (
            <div
              className="absolute bg-white rounded-lg shadow-xl border-2 border-gray-200 p-3 pointer-events-none z-10"
              style={{
                left: `${(tooltipData.x / chartWidth) * 100}%`,
                top: `${(tooltipData.y / chartHeight) * 100}%`,
                transform: 'translate(-50%, -120%)',
              }}
            >
              <div className="text-xs font-bold text-gray-900 mb-2">Year {tooltipData.year}</div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-gray-600">Invested:</span>
                  <span className="font-semibold text-blue-600">{formatCurrencyFull(tooltipData.data.totalInvested)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-gray-600">Total Value:</span>
                  <span className="font-semibold text-green-600">{formatCurrencyFull(tooltipData.data.totalValue)}</span>
                </div>
                <div className="flex items-center gap-2 pt-1 border-t border-gray-200">
                  <span className="text-gray-600">Returns:</span>
                  <span className="font-semibold text-green-700">{formatCurrencyFull(tooltipData.data.interestEarned)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-3 sm:gap-4 md:gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600">Total Invested</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">Total Value</span>
          </div>
        </div>
      </div>

      {/* Scenario Comparison */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">What If Scenarios</h2>
        <p className="text-sm text-gray-600 mb-3 sm:mb-4 md:mb-6">Compare different investment strategies</p>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Current Plan */}
          <div
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-300 cursor-pointer transition-all hover:shadow-lg"
            onMouseEnter={() => setHoveredScenario('current')}
            onMouseLeave={() => setHoveredScenario(null)}
          >
            <div className="text-xs font-semibold text-blue-600 mb-2">CURRENT PLAN</div>
            <div className="text-2xl font-bold text-blue-900 mb-1">{formatCurrency(scenarios.current.totalValue)}</div>
            <div className="text-xs text-blue-700 mb-3">
              {formatCurrency(scenarios.current.monthly)}/month × {scenarios.current.years} years
            </div>
            <div className="text-xs text-blue-600">@ {scenarios.current.rate}% return</div>
          </div>

          {/* Higher Investment */}
          <div
            className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border-2 border-green-300 cursor-pointer transition-all hover:shadow-lg"
            onMouseEnter={() => setHoveredScenario('higher')}
            onMouseLeave={() => setHoveredScenario(null)}
          >
            <div className="text-xs font-semibold text-green-600 mb-2">20% MORE MONTHLY</div>
            <div className="text-2xl font-bold text-green-900 mb-1">{formatCurrency(scenarios.higher.totalValue)}</div>
            <div className="text-xs text-green-700 mb-3">
              {formatCurrency(scenarios.higher.monthly)}/month × {scenarios.higher.years} years
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-green-600">
              <span>↑</span>
              <span>{formatCurrency(scenarios.higher.diff)} more</span>
            </div>
          </div>

          {/* Longer Duration */}
          <div
            className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border-2 border-purple-300 cursor-pointer transition-all hover:shadow-lg"
            onMouseEnter={() => setHoveredScenario('longer')}
            onMouseLeave={() => setHoveredScenario(null)}
          >
            <div className="text-xs font-semibold text-purple-600 mb-2">5 MORE YEARS</div>
            <div className="text-2xl font-bold text-purple-900 mb-1">{formatCurrency(scenarios.longer.totalValue)}</div>
            <div className="text-xs text-purple-700 mb-3">
              {formatCurrency(scenarios.longer.monthly)}/month × {scenarios.longer.years} years
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-purple-600">
              <span>↑</span>
              <span>{formatCurrency(scenarios.longer.diff)} more</span>
            </div>
          </div>
        </div>

        {/* Visual Comparison Column Chart */}
        <div className="mt-8">
          <div className="text-sm font-medium text-gray-700 mb-4 text-center">Visual Comparison</div>

          <div className="flex items-end justify-center gap-3 sm:gap-5 md:gap-8 h-80">
            {/* Current Plan Column */}
            <div className="flex flex-col items-center gap-3 w-32">
              <div className="relative w-full">
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-700 shadow-lg hover:shadow-xl relative"
                  style={{ height: `${(scenarios.current.totalValue / scenarioMax) * 280}px`, minHeight: '40px' }}
                  onMouseEnter={() => setHoveredScenario('current')}
                  onMouseLeave={() => setHoveredScenario(null)}
                >
                  {/* Value label on top of column */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-blue-900 whitespace-nowrap">
                    {formatCurrency(scenarios.current.totalValue)}
                  </div>

                  {/* Hover detail */}
                  {hoveredScenario === 'current' && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white rounded-lg shadow-xl border-2 border-blue-300 p-3 z-20 whitespace-nowrap">
                      <div className="text-xs font-semibold text-blue-600 mb-1">Current Plan</div>
                      <div className="text-xs text-gray-600">
                        {formatCurrency(scenarios.current.monthly)}/mo × {scenarios.current.years}yr
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-xs font-semibold text-blue-700 text-center">Current Plan</div>
            </div>

            {/* Higher Investment Column */}
            <div className="flex flex-col items-center gap-3 w-32">
              <div className="relative w-full">
                <div
                  className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all duration-700 shadow-lg hover:shadow-xl relative"
                  style={{ height: `${(scenarios.higher.totalValue / scenarioMax) * 280}px`, minHeight: '40px' }}
                  onMouseEnter={() => setHoveredScenario('higher')}
                  onMouseLeave={() => setHoveredScenario(null)}
                >
                  {/* Value label on top of column */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-green-900 whitespace-nowrap">
                    {formatCurrency(scenarios.higher.totalValue)}
                  </div>

                  {/* Difference indicator */}
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 text-xs font-semibold text-green-600 whitespace-nowrap">
                    +{formatCurrency(scenarios.higher.diff)}
                  </div>

                  {/* Hover detail */}
                  {hoveredScenario === 'higher' && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white rounded-lg shadow-xl border-2 border-green-300 p-3 z-20 whitespace-nowrap">
                      <div className="text-xs font-semibold text-green-600 mb-1">20% More Monthly</div>
                      <div className="text-xs text-gray-600">
                        {formatCurrency(scenarios.higher.monthly)}/mo × {scenarios.higher.years}yr
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-xs font-semibold text-green-700 text-center">+20% Monthly</div>
            </div>

            {/* Longer Duration Column */}
            <div className="flex flex-col items-center gap-3 w-32">
              <div className="relative w-full">
                <div
                  className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg transition-all duration-700 shadow-lg hover:shadow-xl relative"
                  style={{ height: `${(scenarios.longer.totalValue / scenarioMax) * 280}px`, minHeight: '40px' }}
                  onMouseEnter={() => setHoveredScenario('longer')}
                  onMouseLeave={() => setHoveredScenario(null)}
                >
                  {/* Value label on top of column */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-purple-900 whitespace-nowrap">
                    {formatCurrency(scenarios.longer.totalValue)}
                  </div>

                  {/* Difference indicator */}
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 text-xs font-semibold text-purple-600 whitespace-nowrap">
                    +{formatCurrency(scenarios.longer.diff)}
                  </div>

                  {/* Hover detail */}
                  {hoveredScenario === 'longer' && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white rounded-lg shadow-xl border-2 border-purple-300 p-3 z-20 whitespace-nowrap">
                      <div className="text-xs font-semibold text-purple-600 mb-1">5 More Years</div>
                      <div className="text-xs text-gray-600">
                        {formatCurrency(scenarios.longer.monthly)}/mo × {scenarios.longer.years}yr
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-xs font-semibold text-purple-700 text-center">+5 Years</div>
            </div>
          </div>

          {/* Grid lines for reference */}
          <div className="mt-4 pt-4 border-t-2 border-gray-300"></div>
        </div>
      </div>

      {/* Year-by-Year Schedule */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Investment Schedule</h2>
          <button
            onClick={() => setShowFullSchedule(!showFullSchedule)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {showFullSchedule ? 'Show Less' : 'Show All Years'}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-2 font-semibold text-gray-700">Year</th>
                <th className="text-right py-3 px-2 font-semibold text-gray-700">Annual Investment</th>
                <th className="text-right py-3 px-2 font-semibold text-gray-700">Total Invested</th>
                <th className="text-right py-3 px-2 font-semibold text-gray-700">Interest Earned</th>
                <th className="text-right py-3 px-2 font-semibold text-gray-700">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {(showFullSchedule ? yearlyData : yearlyData.slice(0, 5)).map((data, index) => (
                <tr
                  key={data.year}
                  className="border-b border-gray-100 hover:bg-blue-50 transition-colors cursor-pointer"
                  onMouseEnter={() => setHoveredYear(data.year)}
                  onMouseLeave={() => setHoveredYear(null)}
                >
                  <td className="py-3 px-2 font-medium text-gray-900">Year {data.year}</td>
                  <td className="py-3 px-2 text-right text-gray-600">{formatCurrencyFull(data.investment)}</td>
                  <td className="py-3 px-2 text-right text-blue-600 font-medium">{formatCurrencyFull(data.totalInvested)}</td>
                  <td className="py-3 px-2 text-right text-green-600 font-medium">{formatCurrencyFull(data.interestEarned)}</td>
                  <td className="py-3 px-2 text-right text-gray-900 font-bold">{formatCurrencyFull(data.totalValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!showFullSchedule && yearlyData.length > 5 && (
          <div className="text-center mt-4">
            <button
              onClick={() => setShowFullSchedule(true)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View {yearlyData.length - 5} more years →
            </button>
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
              <div className="rounded-lg xs:rounded-xl p-2 xs:p-3 sm:p-4 bg-white border border-gray-200 hover:border-blue-300 active:border-blue-400 hover:shadow-md active:shadow-lg transition-all h-full">
                <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-md xs:rounded-lg flex items-center justify-center mb-1.5 xs:mb-2 sm:mb-3 text-base xs:text-lg sm:text-2xl">
                  {calc.icon}
                </div>
                <h3 className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-900 mb-0.5 xs:mb-1 group-hover:text-blue-600 transition-colors leading-tight">
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
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Understanding SIP (Systematic Investment Plan)</h2>
        <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-3 xs:mb-4 sm:mb-4 md:mb-6 leading-relaxed">
          A Systematic Investment Plan (SIP) is a disciplined approach to investing where you invest a fixed amount at regular intervals,
          typically monthly. This strategy harnesses the power of dollar-cost averaging, which means you buy more units when prices are low
          and fewer when prices are high, effectively reducing your average cost per unit over time.
        </p>

        <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 xs:gap-4 sm:gap-4 md:gap-6 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
          <div className="bg-blue-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-blue-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Dollar Cost Averaging</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Reduces timing risk by spreading purchases over time</p>
          </div>
          <div className="bg-green-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-green-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Power of Compounding</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Earnings generate their own earnings over time</p>
          </div>
          <div className="bg-purple-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-purple-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Disciplined Investing</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Automates savings and removes emotional decisions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-3 sm:gap-4 md:gap-6">
          <div>
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Benefits of SIP Investing</h2>
            <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-600">
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span><strong>No Market Timing:</strong> Removes guesswork about when to invest</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span><strong>Affordable Start:</strong> Begin with small amounts like $50-100/month</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span><strong>Flexibility:</strong> Increase, decrease, or pause anytime</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span><strong>Long-term Growth:</strong> Ideal for retirement and wealth building</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Step-Up SIP Strategy</h2>
            <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-600">
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-blue-500 mt-0.5 flex-shrink-0">📈</span>
                <span>Increase SIP amount by 5-10% annually</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-blue-500 mt-0.5 flex-shrink-0">💰</span>
                <span>Align increases with salary increments</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-blue-500 mt-0.5 flex-shrink-0">🎯</span>
                <span>Dramatically accelerates wealth accumulation</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-blue-500 mt-0.5 flex-shrink-0">⏰</span>
                <span>Helps beat inflation over long term</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-3 xs:mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="sip-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
