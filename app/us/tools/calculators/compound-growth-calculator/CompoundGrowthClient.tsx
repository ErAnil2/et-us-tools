'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { FirebaseFAQs } from '@/components/PageSEOContent';

import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color?: string;
  icon?: string;
}

interface CompoundGrowthClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '📊' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

interface GrowthPeriod {
  period: number;
  startingValue: number;
  growth: number;
  endingValue: number;
  cumulativeGrowth: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Compound Growth Calculator?",
    answer: "A Compound Growth Calculator is a free online tool designed to help you quickly and accurately calculate compound growth-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Compound Growth Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Compound Growth Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Compound Growth Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function CompoundGrowthClient({ relatedCalculators = defaultRelatedCalculators }: CompoundGrowthClientProps) {
  const { getH1, getSubHeading } = usePageSEO('compound-growth-calculator');

  const [initialValue, setInitialValue] = useState(10000);
  const [growthRate, setGrowthRate] = useState(8);
  const [timePeriods, setTimePeriods] = useState(10);
  const [compoundingFrequency, setCompoundingFrequency] = useState(1);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [hoveredPeriod, setHoveredPeriod] = useState<number | null>(null);

  const [results, setResults] = useState({
    finalValue: 0,
    totalGrowth: 0,
    growthPercentage: 0,
    effectiveRate: 0,
    doublingTime: 0,
    growthMultiple: 0
  });

  const [growthBreakdown, setGrowthBreakdown] = useState<GrowthPeriod[]>([]);

  const calculateCompoundGrowth = (principal: number, rate: number, periods: number, frequency: number) => {
    const r = rate / 100;
    const finalVal = principal * Math.pow(1 + r / frequency, frequency * periods);
    const totalGrow = finalVal - principal;
    const growthPct = (totalGrow / principal) * 100;
    const effRate = (Math.pow(1 + r / frequency, frequency) - 1) * 100;
    const doublingTime = Math.log(2) / Math.log(1 + r / frequency) / frequency;

    // Generate breakdown
    const breakdown: GrowthPeriod[] = [];
    let cumulativeGrowth = 0;

    for (let i = 1; i <= periods; i++) {
      const startingValue = principal * Math.pow(1 + r / frequency, frequency * (i - 1));
      const endingValue = principal * Math.pow(1 + r / frequency, frequency * i);
      const growth = endingValue - startingValue;
      cumulativeGrowth += growth;

      breakdown.push({
        period: i,
        startingValue,
        growth,
        endingValue,
        cumulativeGrowth
      });
    }

    return {
      finalValue: finalVal,
      totalGrowth: totalGrow,
      growthPercentage: growthPct,
      effectiveRate: effRate,
      doublingTime,
      growthMultiple: finalVal / principal,
      breakdown
    };
  };

  useEffect(() => {
    const result = calculateCompoundGrowth(initialValue, growthRate, timePeriods, compoundingFrequency);
    setResults({
      finalValue: result.finalValue,
      totalGrowth: result.totalGrowth,
      growthPercentage: result.growthPercentage,
      effectiveRate: result.effectiveRate,
      doublingTime: result.doublingTime,
      growthMultiple: result.growthMultiple
    });
    setGrowthBreakdown(result.breakdown);
  }, [initialValue, growthRate, timePeriods, compoundingFrequency]);

  // What-if scenarios
  const scenarios = useMemo(() => {
    const current = calculateCompoundGrowth(initialValue, growthRate, timePeriods, compoundingFrequency);
    const higherRate = calculateCompoundGrowth(initialValue, growthRate + 2, timePeriods, compoundingFrequency);
    const longerTerm = calculateCompoundGrowth(initialValue, growthRate, timePeriods + 5, compoundingFrequency);

    return {
      current: { ...current, rate: growthRate, periods: timePeriods },
      higher: {
        ...higherRate,
        rate: growthRate + 2,
        periods: timePeriods,
        diff: higherRate.finalValue - current.finalValue
      },
      longer: {
        ...longerTerm,
        rate: growthRate,
        periods: timePeriods + 5,
        diff: longerTerm.finalValue - current.finalValue
      }
    };
  }, [initialValue, growthRate, timePeriods, compoundingFrequency]);

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

  const getFrequencyLabel = (freq: number) => {
    switch (freq) {
      case 1: return 'Annually';
      case 2: return 'Semi-annually';
      case 4: return 'Quarterly';
      case 12: return 'Monthly';
      case 365: return 'Daily';
      default: return `${freq}x/year`;
    }
  };

  // Chart dimensions
  const chartWidth = 800;
  const chartHeight = 300;
  const chartPadding = { top: 20, right: 30, bottom: 40, left: 70 };
  const plotWidth = chartWidth - chartPadding.left - chartPadding.right;
  const plotHeight = chartHeight - chartPadding.top - chartPadding.bottom;

  const maxChartValue = growthBreakdown.length > 0 ? Math.max(...growthBreakdown.map(d => d.endingValue)) * 1.15 : 100;

  // Generate smooth line path
  const generateLinePath = (data: GrowthPeriod[], key: 'endingValue' | 'startingValue') => {
    if (data.length === 0) return '';

    return data.map((d, i) => {
      const x = chartPadding.left + ((i + 1) / data.length) * plotWidth;
      const y = chartPadding.top + plotHeight - (d[key] / maxChartValue) * plotHeight;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  // Generate area path
  const generateAreaPath = (data: GrowthPeriod[]) => {
    if (data.length === 0) return '';
    const linePath = data.map((d, i) => {
      const x = chartPadding.left + ((i + 1) / data.length) * plotWidth;
      const y = chartPadding.top + plotHeight - (d.endingValue / maxChartValue) * plotHeight;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
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
    { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', icon: '📈' },
    { href: '/us/tools/calculators/sip-calculator', title: 'SIP Calculator', description: 'Systematic investment plan', icon: '💰' },
    { href: '/us/tools/calculators/cagr-calculator', title: 'CAGR Calculator', description: 'Compound annual growth rate', icon: '📊' },
    { href: '/us/tools/calculators/investment-growth-calculator', title: 'Investment Growth', description: 'Track investment growth', icon: '💹' },
    { href: '/us/tools/calculators/roi-calculator', title: 'ROI Calculator', description: 'Return on investment', icon: '📉' },
    { href: '/us/tools/calculators/fd-calculator', title: 'FD Calculator', description: 'Fixed deposit returns', icon: '🏦' },
    { href: '/us/tools/calculators/inflation-calculator', title: 'Inflation Calculator', description: 'Calculate inflation impact', icon: '📈' },
    { href: '/us/tools/calculators/lumpsum-calculator', title: 'Lumpsum Calculator', description: 'One-time investment growth', icon: '💵' }
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-2 xs:px-3 sm:px-4 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-5 sm:mb-6 md:mb-8">
        <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">{getH1('Compound Growth Calculator')}</h1>
        <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-600 px-1 sm:px-2 leading-relaxed">Calculate exponential growth and see how your investments compound over time</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Calculator Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Left: Input Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">Growth Parameters</h2>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Initial Value</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">$</span>
                <input
                  type="number"
                  value={initialValue}
                  onChange={(e) => setInitialValue(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-sm sm:text-base touch-manipulation"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Annual Growth Rate (%)</label>
              <div className="relative">
                <input
                  type="number"
                  value={growthRate}
                  onChange={(e) => setGrowthRate(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-sm sm:text-base touch-manipulation"
                  inputMode="decimal"
                  step="0.5"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">%</span>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Time Period (Years)</label>
              <input
                type="number"
                value={timePeriods}
                onChange={(e) => setTimePeriods(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-sm sm:text-base touch-manipulation"
                inputMode="numeric"
              />
            </div>

            <div className="bg-violet-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 mt-3 sm:mt-4">
              <h3 className="text-xs sm:text-sm font-semibold text-violet-600 mb-2 sm:mb-3 md:mb-4">Compounding Options</h3>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-violet-600 mb-1.5 sm:mb-2">Compound Frequency</label>
                <select
                  value={compoundingFrequency}
                  onChange={(e) => setCompoundingFrequency(parseInt(e.target.value))}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-sm sm:text-base touch-manipulation bg-white"
                >
                  <option value={1}>Annually</option>
                  <option value={2}>Semi-annually</option>
                  <option value={4}>Quarterly</option>
                  <option value={12}>Monthly</option>
                  <option value={365}>Daily</option>
                </select>
              </div>
            </div>

            <button className="w-full bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white font-semibold py-3 sm:py-3.5 px-2 sm:px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base touch-manipulation">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Calculate Growth
            </button>
          </div>

          {/* Right: Results Section */}
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">Growth Results</h2>

            <div className="bg-violet-50 border border-violet-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
              <div className="text-[10px] xs:text-xs sm:text-sm text-violet-600 mb-0.5 sm:mb-1">Final Value</div>
              <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-violet-700">{formatCurrencyFull(results.finalValue)}</div>
              <div className="text-[10px] xs:text-xs sm:text-sm text-violet-600 mt-1">After {timePeriods} years of compounding</div>
            </div>

            <div className="space-y-1.5 sm:space-y-2 md:space-y-3 mb-3 sm:mb-4 md:mb-6">
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Initial Investment:</span>
                <span className="font-semibold text-gray-800">{formatCurrencyFull(initialValue)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Total Growth:</span>
                <span className="font-semibold text-green-600">+{formatCurrencyFull(results.totalGrowth)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Growth Percentage:</span>
                <span className="font-semibold text-violet-600">{results.growthPercentage.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Growth Period:</span>
                <span className="font-semibold text-gray-800">{timePeriods} years</span>
              </div>
            </div>

            <div className="mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Value Composition</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] xs:text-xs sm:text-sm">
                  <span className="text-gray-600">Initial Investment</span>
                  <span className="font-medium">{((initialValue / results.finalValue) * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-500 rounded-full transition-all duration-500" style={{ width: `${(initialValue / results.finalValue) * 100}%` }} />
                </div>
                <div className="flex justify-between text-[10px] xs:text-xs sm:text-sm mt-2 sm:mt-3">
                  <span className="text-gray-600">Growth Earned</span>
                  <span className="font-medium">{((results.totalGrowth / results.finalValue) * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500 rounded-full transition-all duration-500" style={{ width: `${(results.totalGrowth / results.finalValue) * 100}%` }} />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Key Metrics</h3>
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-4 text-[10px] xs:text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Growth Rate:</span>
                  <span className="font-medium">{growthRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Compounding:</span>
                  <span className="font-medium">{getFrequencyLabel(compoundingFrequency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Effective Rate:</span>
                  <span className="font-medium">{results.effectiveRate.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Growth Multiple:</span>
                  <span className="font-medium">{results.growthMultiple.toFixed(2)}x</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners */}
      <CalculatorAfterCalcBanners />

      {/* Growth Visualization - Line Chart */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Growth Visualization</h2>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-3 xs:gap-4 sm:gap-6 md:gap-8 mb-3 sm:mb-4 md:mb-6">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-violet-400 to-violet-600 shadow-sm"></div>
            <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-medium">Portfolio Value</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-gray-400 to-gray-600 shadow-sm"></div>
            <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-medium">Initial Investment</span>
          </div>
        </div>

        {/* Line Chart */}
        <div className="relative overflow-x-auto bg-gradient-to-br from-slate-50 to-gray-100 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 -mx-1 sm:mx-0">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto min-w-[320px] sm:min-w-[400px] md:min-w-[500px]"
            style={{ maxHeight: '300px' }}
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Gradients */}
            <defs>
              <linearGradient id="violetAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#c4b5fd" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="violetLineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
              <filter id="lineShadowViolet" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#8b5cf6" floodOpacity="0.3"/>
              </filter>
              <filter id="glowViolet" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Background */}
            <rect x={chartPadding.left} y={chartPadding.top} width={plotWidth} height={plotHeight} fill="white" rx="8" opacity="0.7"/>

            {/* Grid lines */}
            {yAxisTicks.map((tick, i) => (
              <g key={i}>
                <line x1={chartPadding.left} y1={tick.y} x2={chartPadding.left + plotWidth} y2={tick.y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray={i === 0 ? "0" : "4,4"} />
                <text x={chartPadding.left - 12} y={tick.y + 4} textAnchor="end" className="text-[10px] sm:text-xs fill-gray-500 font-medium">
                  {formatCurrency(tick.value)}
                </text>
              </g>
            ))}

            {/* Axes */}
            <line x1={chartPadding.left} y1={chartPadding.top} x2={chartPadding.left} y2={chartPadding.top + plotHeight} stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
            <line x1={chartPadding.left} y1={chartPadding.top + plotHeight} x2={chartPadding.left + plotWidth} y2={chartPadding.top + plotHeight} stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />

            {/* Initial investment line */}
            <line
              x1={chartPadding.left}
              y1={chartPadding.top + plotHeight - (initialValue / maxChartValue) * plotHeight}
              x2={chartPadding.left + plotWidth}
              y2={chartPadding.top + plotHeight - (initialValue / maxChartValue) * plotHeight}
              stroke="#9ca3af"
              strokeWidth="2"
              strokeDasharray="8,4"
              opacity="0.7"
            />

            {/* Area fill */}
            <path d={generateAreaPath(growthBreakdown)} fill="url(#violetAreaGradient)" />

            {/* Line */}
            <path d={generateLinePath(growthBreakdown, 'endingValue')} fill="none" stroke="url(#violetLineGradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" filter="url(#lineShadowViolet)" />

            {/* Data points */}
            {growthBreakdown.map((d, i) => {
              const x = chartPadding.left + ((i + 1) / growthBreakdown.length) * plotWidth;
              const y = chartPadding.top + plotHeight - (d.endingValue / maxChartValue) * plotHeight;
              const isHovered = hoveredPeriod === i;

              return (
                <g key={i}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 8 : 5}
                    fill="white"
                    stroke="#8b5cf6"
                    strokeWidth={isHovered ? 3 : 2}
                    filter={isHovered ? "url(#glowViolet)" : undefined}
                    className="transition-all duration-200"
                  />
                </g>
              );
            })}

            {/* X-axis labels */}
            {growthBreakdown.map((d, i) => {
              const x = chartPadding.left + ((i + 1) / growthBreakdown.length) * plotWidth;
              const showLabel = growthBreakdown.length <= 12 || i % Math.ceil(growthBreakdown.length / 10) === 0 || i === growthBreakdown.length - 1;
              return showLabel ? (
                <text key={i} x={x} y={chartPadding.top + plotHeight + 25} textAnchor="middle" className="text-[10px] sm:text-xs fill-gray-500 font-medium">
                  Yr {d.period}
                </text>
              ) : null;
            })}

            {/* Hover areas */}
            {growthBreakdown.map((_, i) => {
              const x = chartPadding.left + ((i + 1) / growthBreakdown.length) * plotWidth;
              const width = plotWidth / growthBreakdown.length;
              return (
                <rect
                  key={i}
                  x={x - width / 2}
                  y={chartPadding.top}
                  width={width}
                  height={plotHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPeriod(i)}
                  onMouseLeave={() => setHoveredPeriod(null)}
                />
              );
            })}

            {/* Hover line */}
            {hoveredPeriod !== null && (
              <line
                x1={chartPadding.left + ((hoveredPeriod + 1) / growthBreakdown.length) * plotWidth}
                y1={chartPadding.top}
                x2={chartPadding.left + ((hoveredPeriod + 1) / growthBreakdown.length) * plotWidth}
                y2={chartPadding.top + plotHeight}
                stroke="#8b5cf6"
                strokeWidth="2"
                strokeDasharray="6,4"
                opacity="0.6"
              />
            )}
          </svg>

          {/* Tooltip */}
          {hoveredPeriod !== null && growthBreakdown[hoveredPeriod] && (
            <div
              className="absolute z-20 bg-white text-gray-800 text-xs rounded-xl px-4 py-3 shadow-2xl pointer-events-none border border-violet-100"
              style={{
                left: `calc(${((hoveredPeriod + 1) / growthBreakdown.length) * 85 + 8}%)`,
                top: '30px',
                transform: 'translateX(-50%)'
              }}
            >
              <div className="font-bold mb-2 text-sm text-gray-900 border-b border-gray-100 pb-2">Year {growthBreakdown[hoveredPeriod].period}</div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-gradient-to-r from-violet-400 to-violet-600 rounded-full"></span>
                  <span className="text-gray-600">Value:</span>
                  <span className="font-semibold text-violet-600 ml-auto">{formatCurrencyFull(growthBreakdown[hoveredPeriod].endingValue)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></span>
                  <span className="text-gray-600">Year Growth:</span>
                  <span className="font-semibold text-green-600 ml-auto">+{formatCurrencyFull(growthBreakdown[hoveredPeriod].growth)}</span>
                </div>
                <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                  <span className="w-2.5 h-2.5 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full"></span>
                  <span className="text-gray-600">Total Growth:</span>
                  <span className="font-bold text-gray-800 ml-auto">{formatCurrencyFull(growthBreakdown[hoveredPeriod].cumulativeGrowth)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* What-If Scenarios */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-1.5 sm:mb-2">What-If Scenarios</h2>
        <p className="text-gray-600 text-[10px] xs:text-xs sm:text-sm mb-3 sm:mb-4 md:mb-6">Compare your current growth with alternative scenarios</p>

        {/* Scenario Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
          <div className="border-2 border-violet-200 bg-violet-50 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 xs:col-span-2 sm:col-span-1">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Current Plan</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-violet-600 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">Active</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Initial:</span>
                <span className="font-medium">{formatCurrencyFull(initialValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rate:</span>
                <span className="font-medium">{scenarios.current.rate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Period:</span>
                <span className="font-medium">{scenarios.current.periods} yrs</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-violet-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Final Value</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-violet-700">{formatCurrencyFull(scenarios.current.finalValue)}</div>
            </div>
          </div>

          <div className="border border-gray-200 bg-white rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 hover:border-green-300 active:border-green-400 transition-colors">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Higher Rate</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-green-500 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">+2%</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Initial:</span>
                <span className="font-medium">{formatCurrencyFull(initialValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rate:</span>
                <span className="font-medium text-green-600">{scenarios.higher.rate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Period:</span>
                <span className="font-medium">{scenarios.higher.periods} yrs</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Final Value</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-gray-800">{formatCurrencyFull(scenarios.higher.finalValue)}</div>
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-green-600">+{formatCurrencyFull(scenarios.higher.diff)} more</div>
            </div>
          </div>

          <div className="border border-gray-200 bg-white rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 hover:border-blue-300 active:border-blue-400 transition-colors">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Longer Term</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-blue-500 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">+5 yrs</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Initial:</span>
                <span className="font-medium">{formatCurrencyFull(initialValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rate:</span>
                <span className="font-medium">{scenarios.longer.rate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Period:</span>
                <span className="font-medium text-blue-600">{scenarios.longer.periods} yrs</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Final Value</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-gray-800">{formatCurrencyFull(scenarios.longer.finalValue)}</div>
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-blue-600">+{formatCurrencyFull(scenarios.longer.diff)} more</div>
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
              <span className="font-semibold text-gray-800 text-[10px] xs:text-xs sm:text-sm md:text-base">Higher Growth Rate</span>
            </div>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              A 2% higher growth rate adds {formatCurrencyFull(scenarios.higher.diff)} to your final value ({((scenarios.higher.diff / scenarios.current.finalValue) * 100).toFixed(1)}% increase). Seek higher-return investments wisely.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-gray-800 text-[10px] xs:text-xs sm:text-sm md:text-base">Power of Time</span>
            </div>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              Adding 5 more years generates {formatCurrencyFull(scenarios.longer.diff)} extra ({((scenarios.longer.diff / scenarios.current.finalValue) * 100).toFixed(1)}% boost). Time amplifies compound growth exponentially!
            </p>
          </div>
        </div>
      </div>

      {/* Year-by-Year Growth Schedule */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-sm xs:text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Year-by-Year Growth Schedule</h2>

        <div className="overflow-x-auto -mx-3 xs:-mx-4 sm:mx-0">
          <table className="w-full text-[10px] xs:text-xs sm:text-sm min-w-[400px] sm:min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Year</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Start Value</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Growth</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700 hidden xs:table-cell">Cumulative</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">End Value</th>
              </tr>
            </thead>
            <tbody>
              {(showFullSchedule ? growthBreakdown : growthBreakdown.slice(0, 5)).map((row) => (
                <tr key={row.period} className="border-b border-gray-100 hover:bg-gray-50 active:bg-gray-100">
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-gray-800">Yr {row.period}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-gray-600">{formatCurrencyFull(row.startingValue)}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-green-600">+{formatCurrencyFull(row.growth)}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-violet-600 hidden xs:table-cell">{formatCurrencyFull(row.cumulativeGrowth)}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right font-semibold text-gray-800">{formatCurrencyFull(row.endingValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {growthBreakdown.length > 5 && (
            <div className="text-center py-2 sm:py-3 md:py-4">
              {!showFullSchedule && (
                <p className="text-[10px] xs:text-xs sm:text-sm text-gray-500 mb-2">
                  Showing first 5 of {growthBreakdown.length} years
                </p>
              )}
              <button
                onClick={() => setShowFullSchedule(!showFullSchedule)}
                className="px-3 xs:px-4 sm:px-5 py-1.5 sm:py-2 bg-violet-100 hover:bg-violet-200 active:bg-violet-300 text-violet-700 text-[10px] xs:text-xs sm:text-sm font-medium rounded-lg transition-colors touch-manipulation"
              >
                {showFullSchedule ? 'Show Less' : 'Show Full Schedule'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 xs:mb-3 sm:mb-4 md:mb-6 prose prose-gray max-w-none">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Understanding Compound Growth</h2>
        <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-3 xs:mb-4 sm:mb-4 md:mb-6 leading-relaxed">
          Compound growth is the phenomenon where growth builds upon itself over time, creating exponential rather than linear increases.
          This powerful concept is the foundation of wealth building and applies to investments, savings, and business growth.
        </p>

        <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 xs:gap-4 sm:gap-4 md:gap-6 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
          <div className="bg-violet-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-violet-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Exponential Growth</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Growth accelerates over time as returns compound on returns</p>
          </div>
          <div className="bg-green-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-green-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Time Advantage</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">The longer you invest, the more powerful compounding becomes</p>
          </div>
          <div className="bg-blue-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-blue-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Rate Sensitivity</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Small rate differences create large value differences over time</p>
          </div>
        </div>

        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Compound Growth Formula</h2>
        <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-2 xs:mb-3 sm:mb-4">The compound growth calculator uses this formula:</p>

        <div className="bg-gray-50 rounded-lg xs:rounded-xl p-3 xs:p-3 sm:p-4 font-mono text-[10px] xs:text-xs sm:text-sm overflow-x-auto mb-4 xs:mb-3 sm:mb-4 md:mb-6">
          <p className="mb-2 xs:mb-3 sm:mb-4">FV = PV × (1 + r/n)<sup>n×t</sup></p>
          <div className="text-gray-600 space-y-0.5 xs:space-y-1">
            <p>Where:</p>
            <p>FV = Future Value</p>
            <p>PV = Present Value (Initial Amount)</p>
            <p>r = Annual Growth Rate (decimal)</p>
            <p>n = Compounding Frequency per year</p>
            <p>t = Time Period in years</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-3 sm:gap-4 md:gap-6">
          <div>
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Rule of 72</h2>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-2 xs:mb-3 leading-relaxed">
              The Rule of 72 is a quick way to estimate how long it takes to double your money:
            </p>
            <div className="bg-violet-50 rounded-lg p-3 xs:p-4 mb-3">
              <p className="font-mono text-sm text-violet-700">Doubling Time ≈ 72 ÷ Growth Rate</p>
            </div>
            <p className="text-xs xs:text-sm text-gray-600">
              At {growthRate}% growth rate, your money doubles in approximately <span className="font-semibold">{(72 / growthRate).toFixed(1)} years</span>.
            </p>
          </div>

          <div>
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Maximizing Compound Growth</h2>
            <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-600">
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-violet-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Start early to maximize time in the market</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-violet-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Reinvest all dividends and returns</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-violet-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Choose investments with higher compounding frequency</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-violet-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Minimize fees that reduce compound returns</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-violet-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Be patient - compound growth accelerates over time</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-violet-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Avoid withdrawing principal to preserve compounding</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
{/* Related Finance Calculators */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-3 xs:mb-4 sm:mb-4 md:mb-6">Related Investment Calculators</h2>
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
          {allRelatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group touch-manipulation">
              <div className="rounded-lg xs:rounded-xl p-2 xs:p-3 sm:p-4 bg-white border border-gray-200 hover:border-violet-300 active:border-violet-400 hover:shadow-md active:shadow-lg transition-all h-full">
                <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-violet-50 rounded-md xs:rounded-lg flex items-center justify-center mb-1.5 xs:mb-2 sm:mb-3 text-base xs:text-lg sm:text-2xl">
                  {calc.icon}
                </div>
                <h3 className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-900 mb-0.5 xs:mb-1 group-hover:text-violet-600 transition-colors leading-tight">
                  {calc.title}
                </h3>
                <p className="text-[9px] xs:text-[10px] sm:text-xs text-gray-600 leading-tight">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="compound-growth-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
