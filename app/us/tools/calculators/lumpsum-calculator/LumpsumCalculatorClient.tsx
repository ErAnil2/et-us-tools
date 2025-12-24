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

interface YearlyData {
  year: number;
  value: number;
  gain: number;
  inflationAdjusted: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Lumpsum Calculator?",
    answer: "A Lumpsum Calculator is a free online tool designed to help you quickly and accurately calculate lumpsum-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Lumpsum Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Lumpsum Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Lumpsum Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function LumpsumCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('lumpsum-calculator');

  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(10);
  const [tenure, setTenure] = useState(10);
  const [inflationRate, setInflationRate] = useState(3);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [hoveredScenario, setHoveredScenario] = useState<string | null>(null);

  const [results, setResults] = useState({
    futureValue: 0,
    totalGain: 0,
    realReturn: 0,
    inflationAdjustedValue: 0,
    returnMultiple: 0,
    annualGain: 0
  });

  const [yearlyData, setYearlyData] = useState<YearlyData[]>([]);

  const calculateLumpsum = (p: number, r: number, t: number, inf: number) => {
    const rateDecimal = r / 100;
    const inflationDecimal = inf / 100;

    // Future Value = P × (1 + r)^t
    const futureValue = p * Math.pow(1 + rateDecimal, t);
    const totalGain = futureValue - p;

    // Real return adjusting for inflation
    const realRate = ((1 + rateDecimal) / (1 + inflationDecimal)) - 1;
    const inflationAdjustedValue = p * Math.pow(1 + realRate, t);

    // Generate yearly breakdown
    const yearlyBreakdown: YearlyData[] = [];
    for (let year = 1; year <= t; year++) {
      const value = p * Math.pow(1 + rateDecimal, year);
      const gain = value - p;
      const inflationAdjusted = p * Math.pow(1 + realRate, year);

      yearlyBreakdown.push({
        year,
        value,
        gain,
        inflationAdjusted
      });
    }

    return {
      futureValue,
      totalGain,
      realReturn: realRate * 100,
      inflationAdjustedValue,
      returnMultiple: futureValue / p,
      annualGain: totalGain / t,
      yearlyBreakdown
    };
  };

  useEffect(() => {
    const result = calculateLumpsum(principal, rate, tenure, inflationRate);
    setResults({
      futureValue: result.futureValue,
      totalGain: result.totalGain,
      realReturn: result.realReturn,
      inflationAdjustedValue: result.inflationAdjustedValue,
      returnMultiple: result.returnMultiple,
      annualGain: result.annualGain
    });
    setYearlyData(result.yearlyBreakdown);
  }, [principal, rate, tenure, inflationRate]);

  // What-if scenarios
  const scenarios = useMemo(() => {
    const current = calculateLumpsum(principal, rate, tenure, inflationRate);
    const higherRate = calculateLumpsum(principal, rate + 2, tenure, inflationRate);
    const longerTerm = calculateLumpsum(principal, rate, tenure + 5, inflationRate);

    return {
      current: { ...current, rate, tenure, principal },
      higherRate: {
        ...higherRate,
        rate: rate + 2,
        tenure,
        principal,
        extraGain: higherRate.totalGain - current.totalGain
      },
      longerTerm: {
        ...longerTerm,
        rate,
        tenure: tenure + 5,
        principal,
        extraGain: longerTerm.totalGain - current.totalGain
      }
    };
  }, [principal, rate, tenure, inflationRate]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return '$' + (value / 1000000).toFixed(2) + 'M';
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

  // SVG Chart dimensions
  const chartWidth = 800;
  const chartHeight = 300;
  const chartPadding = { top: 30, right: 30, bottom: 50, left: 80 };
  const plotWidth = chartWidth - chartPadding.left - chartPadding.right;
  const plotHeight = chartHeight - chartPadding.top - chartPadding.bottom;

  // Generate chart points for lumpsum growth (area chart)
  const chartPoints = useMemo(() => {
    if (yearlyData.length === 0) return [];

    const maxValue = Math.max(...yearlyData.map(d => d.value)) * 1.1;
    const points: { x: number; y: number; year: number; value: number; gain: number }[] = [];

    // Start point
    points.push({
      x: chartPadding.left,
      y: chartPadding.top + plotHeight - (principal / maxValue) * plotHeight,
      year: 0,
      value: principal,
      gain: 0
    });

    yearlyData.forEach((d, i) => {
      const x = chartPadding.left + ((i + 1) / tenure) * plotWidth;
      const y = chartPadding.top + plotHeight - (d.value / maxValue) * plotHeight;
      points.push({
        x,
        y,
        year: d.year,
        value: d.value,
        gain: d.gain
      });
    });

    return points;
  }, [yearlyData, principal, tenure]);

  const maxChartValue = yearlyData.length > 0 ? Math.max(...yearlyData.map(d => d.value)) * 1.1 : principal * 2;

  // Create area path
  const areaPath = chartPoints.length > 0
    ? `M ${chartPoints[0].x} ${chartPadding.top + plotHeight} L ${chartPoints.map(p => `${p.x} ${p.y}`).join(' L ')} L ${chartPoints[chartPoints.length - 1].x} ${chartPadding.top + plotHeight} Z`
    : '';

  const linePath = chartPoints.length > 0
    ? `M ${chartPoints.map(p => `${p.x} ${p.y}`).join(' L ')}`
    : '';

  const allRelatedCalculators = [
    { href: '/us/tools/calculators/sip-calculator', title: 'SIP Calculator', description: 'Systematic investment plan', icon: '💹' },
    { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound growth', icon: '📈' },
    { href: '/us/tools/calculators/fd-calculator', title: 'FD Calculator', description: 'Fixed deposit returns', icon: '🏦' },
    { href: '/us/tools/calculators/investment-growth-calculator', title: 'Investment Growth', description: 'Track investment growth', icon: '🌱' },
    { href: '/us/tools/calculators/cagr-calculator', title: 'CAGR Calculator', description: 'Compound annual growth', icon: '📊' },
    { href: '/us/tools/calculators/roi-calculator', title: 'ROI Calculator', description: 'Return on investment', icon: '💰' },
    { href: '/us/tools/calculators/inflation-calculator', title: 'Inflation Calculator', description: 'Adjust for inflation', icon: '📉' },
    { href: '/us/tools/calculators/simple-interest-calculator', title: 'Simple Interest', description: 'Calculate simple interest', icon: '💵' }
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-2 xs:px-3 sm:px-4 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-5 sm:mb-6 md:mb-8">
        <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">{getH1('Lump Sum Investment Calculator')}</h1>
        <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-600 px-1 sm:px-2 leading-relaxed">Calculate the future value of your one-time investment with compound returns</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Calculator Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Left: Input Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">Investment Details</h2>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Initial Investment ($)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">$</span>
                <input
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm sm:text-base touch-manipulation"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Expected Return Rate (% per annum)</label>
              <div className="relative">
                <input
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm sm:text-base touch-manipulation"
                  inputMode="decimal"
                  step="0.5"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">%</span>
              </div>
              <p className="text-[10px] xs:text-xs text-gray-500 mt-1">Historical S&P 500 average: ~10% p.a.</p>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Investment Period (Years)</label>
              <input
                type="number"
                value={tenure}
                onChange={(e) => setTenure(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm sm:text-base touch-manipulation"
                inputMode="numeric"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Inflation Rate (%)</label>
              <div className="relative">
                <input
                  type="number"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Math.max(0, Math.min(15, parseFloat(e.target.value) || 0)))}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm sm:text-base touch-manipulation"
                  inputMode="decimal"
                  step="0.5"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">%</span>
              </div>
              <p className="text-[10px] xs:text-xs text-gray-500 mt-1">Average inflation: 2-3% p.a.</p>
            </div>

            <div className="bg-amber-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 mt-3 sm:mt-4">
              <h3 className="text-xs sm:text-sm font-semibold text-amber-600 mb-2 sm:mb-3 md:mb-4">Quick Investment Presets</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setPrincipal(50000); setRate(10); setTenure(10); }}
                  className="px-2 py-2 bg-white border border-amber-200 rounded-lg text-xs font-medium text-amber-700 hover:bg-amber-100 transition-colors touch-manipulation"
                >
                  Moderate $50K
                </button>
                <button
                  onClick={() => { setPrincipal(100000); setRate(12); setTenure(15); }}
                  className="px-2 py-2 bg-white border border-amber-200 rounded-lg text-xs font-medium text-amber-700 hover:bg-amber-100 transition-colors touch-manipulation"
                >
                  Aggressive $100K
                </button>
                <button
                  onClick={() => { setPrincipal(250000); setRate(8); setTenure(20); }}
                  className="px-2 py-2 bg-white border border-amber-200 rounded-lg text-xs font-medium text-amber-700 hover:bg-amber-100 transition-colors touch-manipulation"
                >
                  Conservative $250K
                </button>
                <button
                  onClick={() => { setPrincipal(500000); setRate(15); setTenure(10); }}
                  className="px-2 py-2 bg-white border border-amber-200 rounded-lg text-xs font-medium text-amber-700 hover:bg-amber-100 transition-colors touch-manipulation"
                >
                  High Growth $500K
                </button>
              </div>
            </div>
          </div>

          {/* Right: Results Section */}
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">Investment Returns</h2>

            <div className="bg-amber-50 border border-amber-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
              <div className="text-[10px] xs:text-xs sm:text-sm text-amber-600 mb-0.5 sm:mb-1">Future Value</div>
              <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-amber-700">{formatCurrencyFull(results.futureValue)}</div>
              <div className="text-[10px] xs:text-xs sm:text-sm text-amber-600 mt-1">After {tenure} years at {rate}% p.a.</div>
            </div>

            <div className="space-y-1.5 sm:space-y-2 md:space-y-3 mb-3 sm:mb-4 md:mb-6">
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Initial Investment:</span>
                <span className="font-semibold text-gray-800">{formatCurrencyFull(principal)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Total Gain:</span>
                <span className="font-semibold text-green-600">+{formatCurrencyFull(results.totalGain)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Inflation-Adjusted Value:</span>
                <span className="font-semibold text-blue-600">{formatCurrencyFull(results.inflationAdjustedValue)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Return Multiple:</span>
                <span className="font-semibold text-amber-600">{results.returnMultiple.toFixed(2)}x</span>
              </div>
            </div>

            <div className="mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Investment Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] xs:text-xs sm:text-sm">
                  <span className="text-gray-600">Principal</span>
                  <span className="font-medium">{((principal / results.futureValue) * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${(principal / results.futureValue) * 100}%` }} />
                </div>
                <div className="flex justify-between text-[10px] xs:text-xs sm:text-sm mt-2 sm:mt-3">
                  <span className="text-gray-600">Investment Gain</span>
                  <span className="font-medium">{((results.totalGain / results.futureValue) * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: `${(results.totalGain / results.futureValue) * 100}%` }} />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Key Metrics</h3>
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-4 text-[10px] xs:text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Real Return:</span>
                  <span className="font-medium text-blue-600">{results.realReturn.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Annual Gain:</span>
                  <span className="font-medium">{formatCurrency(results.annualGain)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Growth:</span>
                  <span className="font-medium text-green-600">+{((results.totalGain / principal) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time Period:</span>
                  <span className="font-medium">{tenure} years</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Growth Chart */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Investment Growth Over Time</h2>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-3 xs:gap-4 sm:gap-6 md:gap-8 mb-3 sm:mb-4 md:mb-6">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 shadow-sm"></div>
            <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-medium">Portfolio Value</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-green-400 to-green-600 shadow-sm"></div>
            <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-medium">Total Gain</span>
          </div>
        </div>

        {/* SVG Area Chart */}
        <div className="relative overflow-x-auto bg-gradient-to-br from-slate-50 to-gray-100 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 -mx-1 sm:mx-0">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto min-w-[320px] sm:min-w-[400px] md:min-w-[500px]"
            style={{ maxHeight: '300px' }}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="lumpsumAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#fef3c7" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="lumpsumLineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
              <filter id="lumpsumGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <filter id="lumpsumShadow" x="-10%" y="-10%" width="120%" height="130%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1"/>
              </filter>
            </defs>

            {/* Background */}
            <rect x={chartPadding.left} y={chartPadding.top} width={plotWidth} height={plotHeight} fill="white" rx="8" opacity="0.7"/>

            {/* Y-axis grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const y = chartPadding.top + plotHeight - ratio * plotHeight;
              return (
                <g key={i}>
                  <line x1={chartPadding.left} y1={y} x2={chartPadding.left + plotWidth} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray={i === 0 ? "0" : "4,4"} />
                  <text x={chartPadding.left - 12} y={y + 4} textAnchor="end" className="text-[10px] sm:text-xs fill-gray-500 font-medium">
                    {formatCurrency(maxChartValue * ratio)}
                  </text>
                </g>
              );
            })}

            {/* Axes */}
            <line x1={chartPadding.left} y1={chartPadding.top} x2={chartPadding.left} y2={chartPadding.top + plotHeight} stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
            <line x1={chartPadding.left} y1={chartPadding.top + plotHeight} x2={chartPadding.left + plotWidth} y2={chartPadding.top + plotHeight} stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />

            {/* Area fill */}
            {areaPath && (
              <path
                d={areaPath}
                fill="url(#lumpsumAreaGradient)"
                filter="url(#lumpsumShadow)"
              />
            )}

            {/* Line */}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="url(#lumpsumLineGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#lumpsumGlow)"
              />
            )}

            {/* Data points */}
            {chartPoints.map((point, i) => (
              <g key={i}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={hoveredPoint === i ? 8 : 6}
                  fill="white"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredPoint(i)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  filter="url(#lumpsumGlow)"
                />
                {hoveredPoint === i && (
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="12"
                    fill="#f59e0b"
                    opacity="0.2"
                    className="animate-pulse"
                  />
                )}
              </g>
            ))}

            {/* X-axis labels */}
            {chartPoints.map((point, i) => (
              <text
                key={i}
                x={point.x}
                y={chartPadding.top + plotHeight + 25}
                textAnchor="middle"
                className="text-[10px] sm:text-xs fill-gray-500 font-medium"
              >
                {point.year === 0 ? 'Start' : `Yr ${point.year}`}
              </text>
            ))}

            {/* Hover indicator line */}
            {hoveredPoint !== null && chartPoints[hoveredPoint] && (
              <line
                x1={chartPoints[hoveredPoint].x}
                y1={chartPadding.top}
                x2={chartPoints[hoveredPoint].x}
                y2={chartPadding.top + plotHeight}
                stroke="#f59e0b"
                strokeWidth="2"
                strokeDasharray="6,4"
                opacity="0.5"
              />
            )}
          </svg>

          {/* Tooltip */}
          {hoveredPoint !== null && chartPoints[hoveredPoint] && (
            <div
              className="absolute z-20 bg-white text-gray-800 text-xs rounded-xl px-4 py-3 shadow-2xl pointer-events-none border border-gray-100"
              style={{
                left: `calc(${(hoveredPoint / (chartPoints.length - 1)) * 85 + 8}%)`,
                top: '30px',
                transform: 'translateX(-50%)'
              }}
            >
              <div className="font-bold mb-2 text-sm text-gray-900 border-b border-gray-100 pb-2">
                {chartPoints[hoveredPoint].year === 0 ? 'Start' : `Year ${chartPoints[hoveredPoint].year}`}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"></span>
                  <span className="text-gray-600">Value:</span>
                  <span className="font-semibold text-amber-600 ml-auto">{formatCurrencyFull(chartPoints[hoveredPoint].value)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></span>
                  <span className="text-gray-600">Gain:</span>
                  <span className="font-semibold text-green-600 ml-auto">+{formatCurrencyFull(chartPoints[hoveredPoint].gain)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* What-If Scenarios */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-1.5 sm:mb-2">What-If Scenarios</h2>
        <p className="text-gray-600 text-[10px] xs:text-xs sm:text-sm mb-3 sm:mb-4 md:mb-6">See how changing your investment strategy affects your wealth</p>

        {/* Scenario Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
          <div
            className={`border-2 border-amber-200 bg-amber-50 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 xs:col-span-2 sm:col-span-1 transition-transform duration-200 ${hoveredScenario === 'current' ? 'scale-[1.02]' : ''}`}
            onMouseEnter={() => setHoveredScenario('current')}
            onMouseLeave={() => setHoveredScenario(null)}
          >
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Current Plan</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-amber-600 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">Active</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Rate:</span>
                <span className="font-medium">{rate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Period:</span>
                <span className="font-medium">{tenure} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Investment:</span>
                <span className="font-medium">{formatCurrency(principal)}</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-amber-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Future Value</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-amber-700">{formatCurrencyFull(scenarios.current.futureValue)}</div>
            </div>
          </div>

          <div
            className={`border border-gray-200 bg-white rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 hover:border-green-300 active:border-green-400 transition-all duration-200 ${hoveredScenario === 'higherRate' ? 'scale-[1.02] border-green-300' : ''}`}
            onMouseEnter={() => setHoveredScenario('higherRate')}
            onMouseLeave={() => setHoveredScenario(null)}
          >
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Higher Return</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-green-500 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">+2%</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Rate:</span>
                <span className="font-medium text-green-600">{rate + 2}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Period:</span>
                <span className="font-medium">{tenure} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Investment:</span>
                <span className="font-medium">{formatCurrency(principal)}</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Future Value</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-gray-800">{formatCurrencyFull(scenarios.higherRate.futureValue)}</div>
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-green-600">+{formatCurrencyFull(scenarios.higherRate.extraGain)} extra</div>
            </div>
          </div>

          <div
            className={`border border-gray-200 bg-white rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 hover:border-purple-300 active:border-purple-400 transition-all duration-200 ${hoveredScenario === 'longerTerm' ? 'scale-[1.02] border-purple-300' : ''}`}
            onMouseEnter={() => setHoveredScenario('longerTerm')}
            onMouseLeave={() => setHoveredScenario(null)}
          >
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Longer Term</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-purple-500 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">+5 yrs</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Rate:</span>
                <span className="font-medium">{rate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Period:</span>
                <span className="font-medium text-purple-600">{tenure + 5} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Investment:</span>
                <span className="font-medium">{formatCurrency(principal)}</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Future Value</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-gray-800">{formatCurrencyFull(scenarios.longerTerm.futureValue)}</div>
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-green-600">+{formatCurrencyFull(scenarios.longerTerm.extraGain)} extra</div>
            </div>
          </div>
        </div>

        {/* Insight Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 xs:gap-3 sm:gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="font-semibold text-gray-800 text-[10px] xs:text-xs sm:text-sm md:text-base">Higher Returns Impact</span>
            </div>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              Achieving just 2% higher returns would add {formatCurrencyFull(scenarios.higherRate.extraGain)} to your wealth.
              Consider diversifying into higher-growth assets while managing risk.
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-gray-800 text-[10px] xs:text-xs sm:text-sm md:text-base">Time is Your Ally</span>
            </div>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              Staying invested for 5 more years would grow your wealth by {formatCurrencyFull(scenarios.longerTerm.extraGain)}.
              Compound interest accelerates dramatically over longer periods.
            </p>
          </div>
        </div>
      </div>

      {/* Year-by-Year Schedule */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-sm xs:text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Year-by-Year Growth Schedule</h2>

        <div className="overflow-x-auto -mx-3 xs:-mx-4 sm:mx-0">
          <table className="w-full text-[10px] xs:text-xs sm:text-sm min-w-[400px] sm:min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Year</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Portfolio Value</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Total Gain</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700 hidden xs:table-cell">Growth %</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Inflation Adj.</th>
              </tr>
            </thead>
            <tbody>
              {(showFullSchedule ? yearlyData : yearlyData.slice(0, 5)).map((row) => (
                <tr key={row.year} className="border-b border-gray-100 hover:bg-gray-50 active:bg-gray-100">
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-gray-800">Year {row.year}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-amber-600 font-medium">{formatCurrencyFull(row.value)}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-green-600">+{formatCurrencyFull(row.gain)}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-gray-600 hidden xs:table-cell">+{((row.gain / principal) * 100).toFixed(1)}%</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right font-semibold text-blue-600">{formatCurrencyFull(row.inflationAdjusted)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {yearlyData.length > 5 && (
            <div className="text-center py-2 sm:py-3 md:py-4">
              {!showFullSchedule && (
                <p className="text-[10px] xs:text-xs sm:text-sm text-gray-500 mb-2">
                  Showing first 5 of {yearlyData.length} years
                </p>
              )}
              <button
                onClick={() => setShowFullSchedule(!showFullSchedule)}
                className="px-3 xs:px-4 sm:px-5 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 text-[10px] xs:text-xs sm:text-sm font-medium rounded-lg transition-colors touch-manipulation"
              >
                {showFullSchedule ? 'Show Less' : 'Show Full Schedule'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MREC Banners */}
      <CalculatorAfterCalcBanners />

      {/* Related Calculators */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-3 xs:mb-4 sm:mb-4 md:mb-6">Related Investment Calculators</h2>
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
          {allRelatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group touch-manipulation">
              <div className="rounded-lg xs:rounded-xl p-2 xs:p-3 sm:p-4 bg-white border border-gray-200 hover:border-amber-300 active:border-amber-400 hover:shadow-md active:shadow-lg transition-all h-full">
                <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-amber-50 rounded-md xs:rounded-lg flex items-center justify-center mb-1.5 xs:mb-2 sm:mb-3 text-base xs:text-lg sm:text-2xl">
                  {calc.icon}
                </div>
                <h3 className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-900 mb-0.5 xs:mb-1 group-hover:text-amber-600 transition-colors leading-tight">
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
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Understanding Lump Sum Investing</h2>
        <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-3 xs:mb-4 sm:mb-4 md:mb-6 leading-relaxed">
          Lump sum investing involves putting a significant amount of money into the market all at once, rather than spreading it out over time.
          This strategy maximizes your time in the market and can lead to higher returns when markets trend upward over the long term.
        </p>

        <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 xs:gap-4 sm:gap-4 md:gap-6 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
          <div className="bg-green-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-green-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Maximum Exposure</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Your entire investment benefits from compound growth from day one</p>
          </div>
          <div className="bg-amber-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-amber-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Simplicity</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">One-time investment decision, no need for ongoing timing decisions</p>
          </div>
          <div className="bg-blue-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-blue-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Historical Edge</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Studies show lump sum beats dollar-cost averaging ~67% of the time</p>
          </div>
        </div>

        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Compound Interest Formula</h2>
        <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-2 xs:mb-3 sm:mb-4">The lump sum calculator uses this compound interest formula:</p>

        <div className="bg-gray-50 rounded-lg xs:rounded-xl p-3 xs:p-3 sm:p-4 font-mono text-[10px] xs:text-xs sm:text-sm overflow-x-auto mb-4 xs:mb-3 sm:mb-4 md:mb-6">
          <p className="mb-2 xs:mb-3 sm:mb-4">FV = P × (1 + r)<sup>t</sup></p>
          <div className="text-gray-600 space-y-0.5 xs:space-y-1">
            <p>Where:</p>
            <p>FV = Future Value</p>
            <p>P = Principal (Initial Investment)</p>
            <p>r = Annual Rate of Return (as decimal)</p>
            <p>t = Time Period in years</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-3 sm:gap-4 md:gap-6">
          <div>
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Lump Sum vs SIP</h2>
            <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-600">
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-amber-500 mt-0.5 flex-shrink-0">•</span>
                <span><strong>Lump Sum:</strong> Better in rising markets, full capital at work</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-amber-500 mt-0.5 flex-shrink-0">•</span>
                <span><strong>SIP:</strong> Reduces timing risk, better for volatile markets</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-amber-500 mt-0.5 flex-shrink-0">•</span>
                <span><strong>Time in market:</strong> Generally beats timing the market</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-amber-500 mt-0.5 flex-shrink-0">•</span>
                <span><strong>Risk tolerance:</strong> Consider your comfort with volatility</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Investment Tips</h2>
            <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-600">
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Invest in diversified index funds</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Stay invested through market cycles</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Rebalance portfolio annually</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Keep emergency fund separate</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Consider tax-advantaged accounts</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Start early to maximize compounding</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-3 xs:mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4 xs:space-y-5 sm:space-y-4 md:space-y-6">
          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">What is lump sum investing and when should I use it?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              Lump sum investing means putting a large amount of money into investments all at once, rather than gradually over time.
              Use this approach when you receive a windfall (inheritance, bonus, or sale proceeds), have saved up a significant amount,
              or have a long investment horizon. Studies show that lump sum investing beats dollar-cost averaging about 67% of the time
              because markets tend to rise over time, so getting fully invested sooner captures more growth.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">Is lump sum investing riskier than SIP/DCA?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              Lump sum investing has higher short-term volatility risk since your entire investment is immediately exposed to market
              movements. If markets drop right after you invest, your losses are larger. However, over long time horizons (10+ years),
              this risk diminishes significantly. Dollar-cost averaging (DCA) or SIP reduces timing risk but often results in lower
              returns because part of your money sits uninvested. Your choice should depend on your risk tolerance and time horizon.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">How does compound interest affect lump sum returns?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              Compound interest is the engine of lump sum growth. Your initial investment earns returns, and those returns then earn
              their own returns, creating exponential growth. For example, $50,000 at 8% for 20 years grows to $233,000, but for 30 years
              it reaches $503,000—more than double for just 10 extra years. This demonstrates why investing early with lump sum maximizes
              the compounding effect. The key is time in the market, not timing the market.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">What return rate should I use for projections?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              For stock investments, 7% is a commonly used conservative estimate representing the S&amp;P 500&apos;s historical inflation-adjusted
              return. The nominal (before inflation) average is closer to 10%. For bonds, use 4-5%. For a balanced 60/40 portfolio, 6-7%
              is reasonable. Remember these are long-term averages—actual returns vary dramatically year to year. Always consider using
              multiple scenarios (conservative, moderate, aggressive) when planning.
            </p>
          </div>

          <div>
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">How do I account for inflation in my projections?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              Our calculator includes an inflation adjustment feature. Enter your expected return rate and a separate inflation rate
              (historical US average is about 3%) to see your investment&apos;s future value in today&apos;s purchasing power. For example,
              $100,000 growing to $200,000 over 20 years with 3% inflation has a real value of only about $111,000. This is crucial for
              retirement planning—nominal growth looks impressive but inflation erodes buying power significantly over decades.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="lumpsum-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
