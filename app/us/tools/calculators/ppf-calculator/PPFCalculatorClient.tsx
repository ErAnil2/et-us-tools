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
  openingBalance: number;
  investment: number;
  interest: number;
  closingBalance: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is PPF and how does it work?",
    answer: "PPF (Public Provident Fund) is a government-backed long-term savings scheme popular in certain countries. It offers guaranteed returns, tax benefits, and capital protection. You invest a fixed amount annually for a minimum of 15 years, and interest compounds annually. The interest rate is set by the government and reviewed quarterly.",
    order: 1
  },
  {
    id: '2',
    question: "What is the minimum lock-in period for PPF?",
    answer: "The minimum lock-in period for PPF is 15 years from the end of the financial year in which the initial deposit was made. After maturity, you can extend in blocks of 5 years either with or without contribution. Premature closure is only allowed in exceptional circumstances like medical emergencies or higher education.",
    order: 2
  },
  {
    id: '3',
    question: "Can I withdraw money from PPF before maturity?",
    answer: "Partial withdrawals are allowed from the 7th financial year onwards. You can withdraw up to 50% of the balance at the end of the 4th preceding year or the preceding year, whichever is lower. Loans against PPF balance are available from the 3rd to 6th year at a small interest premium over the PPF rate.",
    order: 3
  },
  {
    id: '4',
    question: "How is PPF interest calculated?",
    answer: "PPF interest is calculated on the minimum balance between the 5th and last day of each month. Interest is compounded annually and credited at the end of the financial year. To maximize returns, deposit your yearly contribution before the 5th of each month, preferably at the start of the financial year.",
    order: 4
  },
  {
    id: '5',
    question: "What are the tax benefits of PPF?",
    answer: "PPF offers triple tax benefits (EEE status): contributions qualify for tax deduction under applicable tax laws, interest earned is tax-free, and the maturity amount is completely tax-exempt. This makes it one of the most tax-efficient investment options available, especially for risk-averse investors in higher tax brackets.",
    order: 5
  }
];

export default function PPFCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('ppf-calculator');

  const [yearlyInvestment, setYearlyInvestment] = useState(5000);
  const [timePeriod, setTimePeriod] = useState(15);
  const [interestRate, setInterestRate] = useState(5.5);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  const [results, setResults] = useState({
    maturityAmount: 0,
    totalInvestment: 0,
    totalInterest: 0,
    investmentPercent: 0,
    interestPercent: 0,
    effectiveRate: 0
  });

  const [yearlyData, setYearlyData] = useState<YearlyData[]>([]);

  const calculatePPF = (yearly: number, years: number, rate: number) => {
    let balance = 0;
    const r = rate / 100;
    const data: YearlyData[] = [];

    for (let year = 1; year <= years; year++) {
      const openingBalance = balance;
      const interest = (openingBalance + yearly) * r;
      balance = openingBalance + yearly + interest;

      data.push({
        year,
        openingBalance,
        investment: yearly,
        interest,
        closingBalance: balance
      });
    }

    const totalInv = yearly * years;
    const totalInt = balance - totalInv;
    const effectiveRate = (totalInt / totalInv) * 100 / years;

    return {
      maturityAmount: balance,
      totalInvestment: totalInv,
      totalInterest: totalInt,
      effectiveRate,
      yearlyBreakdown: data
    };
  };

  useEffect(() => {
    const result = calculatePPF(yearlyInvestment, timePeriod, interestRate);
    const investmentPercent = (result.totalInvestment / result.maturityAmount) * 100;
    const interestPercent = (result.totalInterest / result.maturityAmount) * 100;

    setResults({
      maturityAmount: result.maturityAmount,
      totalInvestment: result.totalInvestment,
      totalInterest: result.totalInterest,
      investmentPercent,
      interestPercent,
      effectiveRate: result.effectiveRate
    });

    setYearlyData(result.yearlyBreakdown);
  }, [yearlyInvestment, timePeriod, interestRate]);

  // What-if scenarios
  const scenarios = useMemo(() => {
    const current = calculatePPF(yearlyInvestment, timePeriod, interestRate);
    const higherInvestment = calculatePPF(yearlyInvestment * 1.5, timePeriod, interestRate);
    const longerTerm = calculatePPF(yearlyInvestment, timePeriod + 5, interestRate);

    return {
      current: {
        ...current,
        yearly: yearlyInvestment,
        years: timePeriod,
        rate: interestRate
      },
      higher: {
        ...higherInvestment,
        yearly: Math.round(yearlyInvestment * 1.5),
        years: timePeriod,
        rate: interestRate,
        diff: higherInvestment.maturityAmount - current.maturityAmount
      },
      longer: {
        ...longerTerm,
        yearly: yearlyInvestment,
        years: timePeriod + 5,
        rate: interestRate,
        diff: longerTerm.maturityAmount - current.maturityAmount
      }
    };
  }, [yearlyInvestment, timePeriod, interestRate]);

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

  const maxChartValue = yearlyData.length > 0 ? Math.max(...yearlyData.map(d => d.closingBalance)) * 1.15 : 100;
  const scenarioMax = Math.max(scenarios.current.maturityAmount, scenarios.higher.maturityAmount, scenarios.longer.maturityAmount) * 1.1;

  const allRelatedCalculators = [
    { href: '/us/tools/calculators/fd-calculator', title: 'FD Calculator', description: 'Fixed deposit returns', icon: '🏦' },
    { href: '/us/tools/calculators/sip-calculator', title: 'SIP Calculator', description: 'Systematic investment plan', icon: '💰' },
    { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', icon: '💹' },
    { href: '/us/tools/calculators/rd-calculator', title: 'RD Calculator', description: 'Recurring deposit returns', icon: '📈' },
    { href: '/us/tools/calculators/retirement-calculator', title: 'Retirement Calculator', description: 'Plan for retirement', icon: '🏖️' },
    { href: '/us/tools/calculators/401k-calculator', title: '401k Calculator', description: 'Retirement savings', icon: '📊' },
    { href: '/us/tools/calculators/savings-goal-calculator', title: 'Savings Goal', description: 'Track savings targets', icon: '🎯' },
    { href: '/us/tools/calculators/inflation-calculator', title: 'Inflation Calculator', description: 'Calculate inflation impact', icon: '📉' }
  ];

  // Chart dimensions
  const chartWidth = 800;
  const chartHeight = 300;
  const chartPadding = { top: 20, right: 30, bottom: 40, left: 70 };
  const plotWidth = chartWidth - chartPadding.left - chartPadding.right;
  const plotHeight = chartHeight - chartPadding.top - chartPadding.bottom;

  // Generate cumulative data for chart
  const cumulativeData = yearlyData.map(d => ({
    year: d.year,
    totalInvestment: d.year * yearlyInvestment,
    totalInterest: d.closingBalance - (d.year * yearlyInvestment),
    balance: d.closingBalance
  }));

  // Generate smooth line path
  const generateLinePath = (data: typeof cumulativeData, key: 'totalInvestment' | 'totalInterest' | 'balance') => {
    if (data.length === 0) return '';

    return data.map((d, i) => {
      const x = chartPadding.left + (i / Math.max(data.length - 1, 1)) * plotWidth;
      const y = chartPadding.top + plotHeight - (d[key] / maxChartValue) * plotHeight;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  // Generate area path
  const generateAreaPath = (data: typeof cumulativeData, key: 'totalInvestment' | 'totalInterest' | 'balance') => {
    if (data.length === 0) return '';
    const linePath = generateLinePath(data, key);
    const startX = chartPadding.left;
    const endX = chartPadding.left + (data.length > 1 ? plotWidth : 0);
    const bottomY = chartPadding.top + plotHeight;
    return `${linePath} L ${endX} ${bottomY} L ${startX} ${bottomY} Z`;
  };

  // Get point coordinates
  const getPointCoords = (index: number, key: 'totalInvestment' | 'totalInterest' | 'balance') => {
    if (!cumulativeData[index]) return { x: 0, y: 0 };
    const x = chartPadding.left + (index / Math.max(cumulativeData.length - 1, 1)) * plotWidth;
    const y = chartPadding.top + plotHeight - (cumulativeData[index][key] / maxChartValue) * plotHeight;
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
        <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">{getH1('PPF Calculator')}</h1>
        <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-600 px-1 sm:px-2 leading-relaxed">Calculate your Public Provident Fund returns with compound interest and plan your long-term tax-saving investments</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Calculator Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Left: Input Section */}
          <div className="space-y-4 sm:space-y-4 md:space-y-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Investment Details</h2>

            {/* Yearly Investment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Yearly Investment</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={yearlyInvestment}
                  onChange={(e) => setYearlyInvestment(Number(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  min="500"
                  max="150000"
                  step="500"
                />
              </div>
            </div>

            {/* Time Period */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Period (Years)</label>
              <input
                type="range"
                value={timePeriod}
                onChange={(e) => setTimePeriod(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                min="15"
                max="50"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>15 years</span>
                <span className="font-semibold text-indigo-600">{timePeriod} years</span>
                <span>50 years</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                min="1"
                max="15"
                step="0.1"
              />
            </div>
          </div>

          {/* Right: Results Section */}
          <div className="space-y-4 sm:space-y-4 md:space-y-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Results</h2>

            {/* Maturity Amount */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-3 sm:p-4 md:p-6 border-2 border-indigo-200">
              <div className="text-sm text-indigo-600 mb-1">Maturity Amount</div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-indigo-700">{formatCurrency(results.maturityAmount)}</div>
              <div className="text-sm text-indigo-600 mt-2">After {timePeriod} years</div>
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-xs text-blue-600">Total Investment</div>
                <div className="text-lg font-bold text-blue-700">{formatCurrency(results.totalInvestment)}</div>
                <div className="text-xs text-blue-500">{results.investmentPercent.toFixed(1)}%</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-xs text-green-600">Interest Earned</div>
                <div className="text-lg font-bold text-green-700">{formatCurrency(results.totalInterest)}</div>
                <div className="text-xs text-green-500">{results.interestPercent.toFixed(1)}%</div>
              </div>
            </div>

            {/* Visual Breakdown Bar */}
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Investment vs Interest</div>
              <div className="flex h-6 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500"
                  style={{ width: `${results.investmentPercent}%` }}
                ></div>
                <div
                  className="bg-green-500"
                  style={{ width: `${results.interestPercent}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-xs">
                <span className="text-blue-600">Investment: {results.investmentPercent.toFixed(1)}%</span>
                <span className="text-green-600">Interest: {results.interestPercent.toFixed(1)}%</span>
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
          >
            {/* Gradient definitions */}
            <defs>
              <linearGradient id="ppfInvestmentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="ppfInterestGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
              </linearGradient>
            </defs>

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
            {cumulativeData.map((d, i) => {
              if (i % Math.ceil(cumulativeData.length / 8) === 0 || i === cumulativeData.length - 1) {
                const x = chartPadding.left + (i / Math.max(cumulativeData.length - 1, 1)) * plotWidth;
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

            {/* Investment area */}
            <path
              d={generateAreaPath(cumulativeData, 'totalInvestment')}
              fill="url(#ppfInvestmentGradient)"
              opacity="0.8"
            />

            {/* Total balance area */}
            <path
              d={generateAreaPath(cumulativeData, 'balance')}
              fill="url(#ppfInterestGradient)"
              opacity="0.6"
            />

            {/* Lines */}
            <path
              d={generateLinePath(cumulativeData, 'totalInvestment')}
              stroke="#3b82f6"
              strokeWidth="3"
              fill="none"
            />
            <path
              d={generateLinePath(cumulativeData, 'balance')}
              stroke="#10b981"
              strokeWidth="3"
              fill="none"
            />

            {/* Interactive points */}
            {hoveredYear !== null && cumulativeData[hoveredYear] && (
              <>
                <circle
                  cx={getPointCoords(hoveredYear, 'totalInvestment').x}
                  cy={getPointCoords(hoveredYear, 'totalInvestment').y}
                  r="6"
                  fill="#3b82f6"
                  stroke="white"
                  strokeWidth="2"
                />
                <circle
                  cx={getPointCoords(hoveredYear, 'balance').x}
                  cy={getPointCoords(hoveredYear, 'balance').y}
                  r="6"
                  fill="#10b981"
                  stroke="white"
                  strokeWidth="2"
                />
              </>
            )}

            {/* Interactive overlay */}
            {cumulativeData.map((d, i) => {
              const x = chartPadding.left + (i / Math.max(cumulativeData.length - 1, 1)) * plotWidth;
              return (
                <rect
                  key={i}
                  x={x - (plotWidth / cumulativeData.length) / 2}
                  y={chartPadding.top}
                  width={plotWidth / cumulativeData.length}
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
              <span className="text-sm text-gray-600">Total Investment</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">Total Value</span>
            </div>
          </div>

          {/* Tooltip */}
          {hoveredYear !== null && cumulativeData[hoveredYear] && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-semibold text-gray-900 mb-2">Year {cumulativeData[hoveredYear].year}</div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Investment</div>
                  <div className="font-semibold text-blue-600">{formatCurrencyFull(cumulativeData[hoveredYear].totalInvestment)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Interest</div>
                  <div className="font-semibold text-green-600">{formatCurrencyFull(cumulativeData[hoveredYear].totalInterest)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Total Value</div>
                  <div className="font-semibold text-indigo-600">{formatCurrencyFull(cumulativeData[hoveredYear].balance)}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Breakdown Pie Chart */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-4 md:mb-6">Investment Breakdown</h2>

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
                {formatCurrency(results.maturityAmount)}
              </text>
              <text x="100" y="115" textAnchor="middle" fontSize="12" fill="#6b7280">
                Total Value
              </text>
            </svg>
          </div>

          {/* Legend and Stats */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="font-medium text-gray-700">Your Investment</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-blue-700">{formatCurrency(results.totalInvestment)}</div>
                <div className="text-sm text-blue-600">{results.investmentPercent.toFixed(1)}%</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="font-medium text-gray-700">Interest Earned</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-green-700">{formatCurrency(results.totalInterest)}</div>
                <div className="text-sm text-green-600">{results.interestPercent.toFixed(1)}%</div>
              </div>
            </div>

            <div className="p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
              <div className="text-sm text-indigo-600 mb-1">Effective Annual Return</div>
              <div className="text-2xl font-bold text-indigo-700">{results.effectiveRate.toFixed(2)}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Year-by-Year Breakdown Table */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Year-by-Year Breakdown</h2>
          <button
            onClick={() => setShowFullSchedule(!showFullSchedule)}
            className="px-4 py-2 text-sm bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition-colors"
          >
            {showFullSchedule ? 'Show Less' : 'Show All Years'}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-2 font-semibold text-gray-700">Year</th>
                <th className="text-right py-3 px-2 font-semibold text-gray-700">Opening Balance</th>
                <th className="text-right py-3 px-2 font-semibold text-gray-700">Investment</th>
                <th className="text-right py-3 px-2 font-semibold text-gray-700">Interest</th>
                <th className="text-right py-3 px-2 font-semibold text-gray-700">Closing Balance</th>
              </tr>
            </thead>
            <tbody>
              {(showFullSchedule ? yearlyData : yearlyData.slice(0, 5)).map((data, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2 font-medium text-gray-900">{data.year}</td>
                  <td className="text-right py-3 px-2 text-gray-600">{formatCurrencyFull(data.openingBalance)}</td>
                  <td className="text-right py-3 px-2 text-blue-600">{formatCurrencyFull(data.investment)}</td>
                  <td className="text-right py-3 px-2 text-green-600">{formatCurrencyFull(data.interest)}</td>
                  <td className="text-right py-3 px-2 font-semibold text-indigo-700">{formatCurrencyFull(data.closingBalance)}</td>
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

      {/* FAQs Section */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="ppf-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
{/* Related Finance Calculators */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-3 xs:mb-4 sm:mb-4 md:mb-6">Related Finance Calculators</h2>
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
    </div>
  );
}
