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
  value: number;
  growth: number;
  growthPercent: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Cagr Calculator?",
    answer: "A Cagr Calculator is a free online tool designed to help you quickly and accurately calculate cagr-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Cagr Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Cagr Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Cagr Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function CAGRCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('cagr-calculator');

  const [initialValue, setInitialValue] = useState(10000);
  const [finalValue, setFinalValue] = useState(25000);
  const [years, setYears] = useState(5);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  const [results, setResults] = useState({
    cagr: 0,
    totalGrowth: 0,
    totalReturn: 0,
    absoluteGrowth: 0,
    growthMultiple: 0
  });

  const [yearlyData, setYearlyData] = useState<YearlyData[]>([]);

  const calculateCAGR = (initial: number, final: number, period: number) => {
    if (initial <= 0 || final <= 0 || period <= 0) {
      return { cagr: 0, totalReturn: 0, growthMultiple: 0 };
    }
    const cagr = (Math.pow(final / initial, 1 / period) - 1) * 100;
    const totalReturn = ((final / initial) - 1) * 100;
    const growthMultiple = final / initial;
    return { cagr, totalReturn, growthMultiple };
  };

  useEffect(() => {
    const result = calculateCAGR(initialValue, finalValue, years);
    const absoluteGrowth = finalValue - initialValue;

    setResults({
      cagr: result.cagr,
      totalGrowth: absoluteGrowth,
      totalReturn: result.totalReturn,
      absoluteGrowth,
      growthMultiple: result.growthMultiple
    });

    // Generate year-by-year data
    const data: YearlyData[] = [];
    const growthRate = result.cagr / 100;

    for (let i = 0; i <= years; i++) {
      const value = initialValue * Math.pow(1 + growthRate, i);
      const prevValue = i > 0 ? initialValue * Math.pow(1 + growthRate, i - 1) : initialValue;
      const growth = value - prevValue;
      const growthPercent = i > 0 ? ((value / prevValue) - 1) * 100 : 0;

      data.push({
        year: i,
        value,
        growth: i > 0 ? growth : 0,
        growthPercent
      });
    }

    setYearlyData(data);
  }, [initialValue, finalValue, years]);

  // What-if scenarios
  const scenarios = useMemo(() => {
    const current = calculateCAGR(initialValue, finalValue, years);
    const higherGrowth = calculateCAGR(initialValue, finalValue * 1.3, years);
    const longerPeriod = calculateCAGR(initialValue, finalValue, years + 3);

    return {
      current: {
        ...current,
        initial: initialValue,
        final: finalValue,
        years
      },
      higherGrowth: {
        ...higherGrowth,
        initial: initialValue,
        final: Math.round(finalValue * 1.3),
        years,
        diff: higherGrowth.cagr - current.cagr
      },
      longerPeriod: {
        ...longerPeriod,
        initial: initialValue,
        final: finalValue,
        years: years + 3,
        diff: longerPeriod.cagr - current.cagr
      }
    };
  }, [initialValue, finalValue, years]);

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
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const maxChartValue = yearlyData.length > 0 ? Math.max(...yearlyData.map(d => d.value)) * 1.15 : 100;

  const allRelatedCalculators = [
    { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound returns', icon: '💹' },
    { href: '/us/tools/calculators/sip-calculator', title: 'SIP Calculator', description: 'Systematic investment plan', icon: '💰' },
    { href: '/us/tools/calculators/roi-calculator', title: 'ROI Calculator', description: 'Return on investment', icon: '📈' },
    { href: '/us/tools/calculators/investment-growth-calculator', title: 'Investment Growth', description: 'Track investment growth', icon: '📊' },
    { href: '/us/tools/calculators/simple-interest-calculator', title: 'Simple Interest', description: 'Calculate simple interest', icon: '💵' },
    { href: '/us/tools/calculators/retirement-calculator', title: 'Retirement Calculator', description: 'Plan for retirement', icon: '🏖️' },
    { href: '/us/tools/calculators/inflation-calculator', title: 'Inflation Calculator', description: 'Calculate inflation impact', icon: '📉' },
    { href: '/us/tools/calculators/savings-goal-calculator', title: 'Savings Goal', description: 'Track savings targets', icon: '🎯' }
  ];

  // Chart dimensions
  const chartWidth = 800;
  const chartHeight = 300;
  const chartPadding = { top: 20, right: 30, bottom: 40, left: 70 };
  const plotWidth = chartWidth - chartPadding.left - chartPadding.right;
  const plotHeight = chartHeight - chartPadding.top - chartPadding.bottom;

  // Generate smooth line path
  const generateLinePath = (data: YearlyData[]) => {
    if (data.length === 0) return '';

    return data.map((d, i) => {
      const x = chartPadding.left + (i / (data.length - 1)) * plotWidth;
      const y = chartPadding.top + plotHeight - (d.value / maxChartValue) * plotHeight;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  // Generate area path
  const generateAreaPath = (data: YearlyData[]) => {
    if (data.length === 0) return '';
    const linePath = generateLinePath(data);
    const startX = chartPadding.left;
    const endX = chartPadding.left + plotWidth;
    const bottomY = chartPadding.top + plotHeight;
    return `${linePath} L ${endX} ${bottomY} L ${startX} ${bottomY} Z`;
  };

  // Get point coordinates
  const getPointCoords = (index: number) => {
    if (!yearlyData[index]) return { x: 0, y: 0 };
    const x = chartPadding.left + (index / (yearlyData.length - 1)) * plotWidth;
    const y = chartPadding.top + plotHeight - (yearlyData[index].value / maxChartValue) * plotHeight;
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
        <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">{getH1('CAGR Calculator')}</h1>
        <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-600 px-1 sm:px-2 leading-relaxed">Calculate Compound Annual Growth Rate to measure investment performance over time</p>
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
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Initial Value</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">$</span>
                <input
                  type="number"
                  value={initialValue}
                  onChange={(e) => setInitialValue(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm sm:text-base touch-manipulation"
                  inputMode="numeric"
                />
              </div>
              <p className="text-[10px] xs:text-xs text-gray-500 mt-1">Starting investment amount</p>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Final Value</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">$</span>
                <input
                  type="number"
                  value={finalValue}
                  onChange={(e) => setFinalValue(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm sm:text-base touch-manipulation"
                  inputMode="numeric"
                />
              </div>
              <p className="text-[10px] xs:text-xs text-gray-500 mt-1">Ending investment value</p>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Time Period (Years)</label>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm sm:text-base touch-manipulation"
                inputMode="numeric"
                min="1"
              />
            </div>

            <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 mt-3 sm:mt-4">
              <h3 className="text-xs sm:text-sm font-semibold text-blue-600 mb-2 sm:mb-3">CAGR Formula</h3>
              <div className="bg-white rounded-lg p-2 sm:p-3 font-mono text-[10px] xs:text-xs sm:text-sm text-blue-800">
                CAGR = (Final Value / Initial Value)<sup>1/n</sup> - 1
              </div>
              <p className="text-[10px] xs:text-xs text-blue-600 mt-2">Where n = number of years</p>
            </div>

            <button className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold py-3 sm:py-3.5 px-2 sm:px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base touch-manipulation">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Calculate CAGR
            </button>
          </div>

          {/* Right: Results Section */}
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">Growth Analysis</h2>

            <div className={`border rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6 ${results.cagr >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
              <div className={`text-[10px] xs:text-xs sm:text-sm mb-0.5 sm:mb-1 ${results.cagr >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>Compound Annual Growth Rate</div>
              <div className={`text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold ${results.cagr >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                {results.cagr >= 0 ? '+' : ''}{results.cagr.toFixed(2)}%
              </div>
              <div className={`text-[10px] xs:text-xs sm:text-sm mt-1 ${results.cagr >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                per year over {years} years
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2 md:space-y-3 mb-3 sm:mb-4 md:mb-6">
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Initial Value:</span>
                <span className="font-semibold text-blue-600">{formatCurrencyFull(initialValue)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Final Value:</span>
                <span className="font-semibold text-green-600">{formatCurrencyFull(finalValue)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Absolute Growth:</span>
                <span className={`font-semibold ${results.absoluteGrowth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {results.absoluteGrowth >= 0 ? '+' : ''}{formatCurrencyFull(results.absoluteGrowth)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Total Return:</span>
                <span className={`font-semibold ${results.totalReturn >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {results.totalReturn >= 0 ? '+' : ''}{results.totalReturn.toFixed(2)}%
                </span>
              </div>
            </div>

            <div className="mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Growth Visualization</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] xs:text-xs sm:text-sm">
                  <span className="text-gray-600">Initial Investment</span>
                  <span className="font-medium">{((initialValue / finalValue) * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${Math.min((initialValue / finalValue) * 100, 100)}%` }} />
                </div>
                <div className="flex justify-between text-[10px] xs:text-xs sm:text-sm mt-2 sm:mt-3">
                  <span className="text-gray-600">Growth Amount</span>
                  <span className="font-medium">{(((finalValue - initialValue) / finalValue) * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${Math.max(((finalValue - initialValue) / finalValue) * 100, 0)}%` }} />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Key Metrics</h3>
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-4 text-[10px] xs:text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">CAGR:</span>
                  <span className="font-medium">{results.cagr.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time Period:</span>
                  <span className="font-medium">{years} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Growth Multiple:</span>
                  <span className="font-medium">{results.growthMultiple.toFixed(2)}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg. Yearly:</span>
                  <span className="font-medium">{formatCurrency(results.absoluteGrowth / years)}</span>
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
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Investment Growth Over Time</h2>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-3 xs:gap-4 sm:gap-6 md:gap-8 mb-3 sm:mb-4 md:mb-6">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-sm"></div>
            <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-medium">Investment Value</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-8 h-0.5 bg-gray-400 border-dashed border-t-2 border-gray-400"></div>
            <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-medium">Initial Value</span>
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
              <linearGradient id="greenAreaGradientCAGR" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#34d399" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#6ee7b7" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="greenLineGradientCAGR" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <filter id="lineShadowCAGR" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15"/>
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

            {/* Initial value reference line */}
            <line
              x1={chartPadding.left}
              y1={chartPadding.top + plotHeight - (initialValue / maxChartValue) * plotHeight}
              x2={chartPadding.left + plotWidth}
              y2={chartPadding.top + plotHeight - (initialValue / maxChartValue) * plotHeight}
              stroke="#9ca3af"
              strokeWidth="2"
              strokeDasharray="8,4"
            />

            {/* Axes */}
            <line x1={chartPadding.left} y1={chartPadding.top} x2={chartPadding.left} y2={chartPadding.top + plotHeight} stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
            <line x1={chartPadding.left} y1={chartPadding.top + plotHeight} x2={chartPadding.left + plotWidth} y2={chartPadding.top + plotHeight} stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />

            {/* Area fill */}
            <path d={generateAreaPath(yearlyData)} fill="url(#greenAreaGradientCAGR)" />

            {/* Line */}
            <path d={generateLinePath(yearlyData)} fill="none" stroke="url(#greenLineGradientCAGR)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" filter="url(#lineShadowCAGR)" />

            {/* Data points */}
            {yearlyData.map((d, i) => {
              const coords = getPointCoords(i);
              const isHovered = hoveredYear === i;

              return (
                <g key={i}>
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r={isHovered ? 8 : 5}
                    fill="white"
                    stroke="#10b981"
                    strokeWidth={isHovered ? 3 : 2}
                    className="transition-all duration-200"
                  />
                </g>
              );
            })}

            {/* X-axis labels */}
            {yearlyData.map((d, i) => {
              const x = chartPadding.left + (i / (yearlyData.length - 1)) * plotWidth;
              return (
                <text key={i} x={x} y={chartPadding.top + plotHeight + 25} textAnchor="middle" className="text-[10px] sm:text-xs fill-gray-500 font-medium">
                  Year {d.year}
                </text>
              );
            })}

            {/* Hover areas */}
            {yearlyData.map((_, i) => {
              const x = chartPadding.left + (i / (yearlyData.length - 1)) * plotWidth;
              const width = plotWidth / yearlyData.length;
              return (
                <rect
                  key={i}
                  x={x - width / 2}
                  y={chartPadding.top}
                  width={width}
                  height={plotHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredYear(i)}
                  onMouseLeave={() => setHoveredYear(null)}
                />
              );
            })}

            {/* Hover line */}
            {hoveredYear !== null && (
              <line
                x1={chartPadding.left + (hoveredYear / (yearlyData.length - 1)) * plotWidth}
                y1={chartPadding.top}
                x2={chartPadding.left + (hoveredYear / (yearlyData.length - 1)) * plotWidth}
                y2={chartPadding.top + plotHeight}
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="6,4"
                opacity="0.6"
              />
            )}
          </svg>

          {/* Tooltip */}
          {hoveredYear !== null && yearlyData[hoveredYear] && (
            <div
              className="absolute z-20 bg-white text-gray-800 text-xs rounded-xl px-4 py-3 shadow-2xl pointer-events-none border border-gray-100"
              style={{
                left: `calc(${((hoveredYear) / (yearlyData.length - 1)) * 85 + 8}%)`,
                top: '30px',
                transform: 'translateX(-50%)'
              }}
            >
              <div className="font-bold mb-2 text-sm text-gray-900 border-b border-gray-100 pb-2">Year {yearlyData[hoveredYear].year}</div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"></span>
                  <span className="text-gray-600">Value:</span>
                  <span className="font-semibold text-emerald-600 ml-auto">{formatCurrencyFull(yearlyData[hoveredYear].value)}</span>
                </div>
                {hoveredYear > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></span>
                    <span className="text-gray-600">Growth:</span>
                    <span className="font-semibold text-blue-600 ml-auto">+{formatCurrencyFull(yearlyData[hoveredYear].growth)}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* What-If Scenarios */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-1.5 sm:mb-2">What-If Scenarios</h2>
        <p className="text-gray-600 text-[10px] xs:text-xs sm:text-sm mb-3 sm:mb-4 md:mb-6">See how different outcomes affect your compound annual growth rate</p>

        {/* Scenario Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
          <div className={`border-2 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 xs:col-span-2 sm:col-span-1 ${scenarios.current.cagr >= 0 ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}>
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Current Scenario</span>
              <span className={`text-[8px] xs:text-[10px] sm:text-xs text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded ${scenarios.current.cagr >= 0 ? 'bg-emerald-600' : 'bg-red-600'}`}>Active</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Initial:</span>
                <span className="font-medium">{formatCurrencyFull(scenarios.current.initial)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Final:</span>
                <span className="font-medium">{formatCurrencyFull(scenarios.current.final)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Period:</span>
                <span className="font-medium">{scenarios.current.years} years</span>
              </div>
            </div>
            <div className={`mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t ${scenarios.current.cagr >= 0 ? 'border-emerald-200' : 'border-red-200'}`}>
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">CAGR</div>
              <div className={`text-base xs:text-lg sm:text-2xl font-bold ${scenarios.current.cagr >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                {scenarios.current.cagr >= 0 ? '+' : ''}{scenarios.current.cagr.toFixed(2)}%
              </div>
            </div>
          </div>

          <div className="border border-gray-200 bg-white rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 hover:border-green-300 active:border-green-400 transition-colors">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Higher Growth</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-green-500 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">+30%</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Initial:</span>
                <span className="font-medium">{formatCurrencyFull(scenarios.higherGrowth.initial)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Final:</span>
                <span className="font-medium text-green-600">{formatCurrencyFull(scenarios.higherGrowth.final)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Period:</span>
                <span className="font-medium">{scenarios.higherGrowth.years} years</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">CAGR</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-gray-800">
                {scenarios.higherGrowth.cagr >= 0 ? '+' : ''}{scenarios.higherGrowth.cagr.toFixed(2)}%
              </div>
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-green-600">+{scenarios.higherGrowth.diff.toFixed(2)}% higher CAGR</div>
            </div>
          </div>

          <div className="border border-gray-200 bg-white rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 hover:border-purple-300 active:border-purple-400 transition-colors">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Longer Period</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-purple-500 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">+3 yrs</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Initial:</span>
                <span className="font-medium">{formatCurrencyFull(scenarios.longerPeriod.initial)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Final:</span>
                <span className="font-medium">{formatCurrencyFull(scenarios.longerPeriod.final)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Period:</span>
                <span className="font-medium text-purple-600">{scenarios.longerPeriod.years} years</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">CAGR</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-gray-800">
                {scenarios.longerPeriod.cagr >= 0 ? '+' : ''}{scenarios.longerPeriod.cagr.toFixed(2)}%
              </div>
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-purple-600">{scenarios.longerPeriod.diff.toFixed(2)}% lower CAGR</div>
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
              A 30% higher final value increases your CAGR by {scenarios.higherGrowth.diff.toFixed(2)} percentage points,
              demonstrating how improved returns compound significantly over time.
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-gray-800 text-[10px] xs:text-xs sm:text-sm md:text-base">Time Period Effect</span>
            </div>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              Spreading the same growth over 3 more years reduces the CAGR by {Math.abs(scenarios.longerPeriod.diff).toFixed(2)} percentage points.
              Faster growth in shorter periods yields higher CAGR.
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
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Value</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Growth</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Growth %</th>
              </tr>
            </thead>
            <tbody>
              {(showFullSchedule ? yearlyData : yearlyData.slice(0, 6)).map((row) => (
                <tr key={row.year} className={`border-b border-gray-100 hover:bg-gray-50 active:bg-gray-100 ${row.year === 0 ? 'bg-blue-50' : ''}`}>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-gray-800">
                    {row.year === 0 ? 'Start' : `Year ${row.year}`}
                  </td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-emerald-600 font-semibold">{formatCurrencyFull(row.value)}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-blue-600">
                    {row.year === 0 ? '-' : `+${formatCurrencyFull(row.growth)}`}
                  </td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-purple-600">
                    {row.year === 0 ? '-' : `+${row.growthPercent.toFixed(2)}%`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {yearlyData.length > 6 && (
            <div className="text-center py-2 sm:py-3 md:py-4">
              {!showFullSchedule && (
                <p className="text-[10px] xs:text-xs sm:text-sm text-gray-500 mb-2">
                  Showing first 6 of {yearlyData.length} years
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

      {/* Related Finance Calculators - Moved above SEO and FAQs */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-3 xs:mb-4 sm:mb-4 md:mb-6">Related Finance Calculators</h2>
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
          {allRelatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group touch-manipulation">
              <div className="rounded-lg xs:rounded-xl p-2 xs:p-3 sm:p-4 bg-white border border-gray-200 hover:border-emerald-300 active:border-emerald-400 hover:shadow-md active:shadow-lg transition-all h-full">
                <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-emerald-50 rounded-md xs:rounded-lg flex items-center justify-center mb-1.5 xs:mb-2 sm:mb-3 text-base xs:text-lg sm:text-2xl">
                  {calc.icon}
                </div>
                <h3 className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-900 mb-0.5 xs:mb-1 group-hover:text-emerald-600 transition-colors leading-tight">
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
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Understanding CAGR (Compound Annual Growth Rate)</h2>
        <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-3 xs:mb-4 sm:mb-4 md:mb-6 leading-relaxed">
          CAGR (Compound Annual Growth Rate) is one of the most accurate ways to calculate and determine returns for anything that can rise or fall in value over time.
          Unlike simple average returns, CAGR smooths out the volatility and provides a single growth rate that, if applied consistently,
          would take you from the initial value to the final value over the specified period.
        </p>

        <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 xs:gap-4 sm:gap-4 md:gap-6 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
          <div className="bg-emerald-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-emerald-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Smooth Returns</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Accounts for volatility by providing a constant growth rate</p>
          </div>
          <div className="bg-blue-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-blue-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Easy Comparison</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Compare investments with different time horizons</p>
          </div>
          <div className="bg-purple-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-purple-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">True Performance</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Shows actual annual compounded returns</p>
          </div>
        </div>

        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">CAGR Formula</h2>
        <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-2 xs:mb-3 sm:mb-4">The CAGR calculator uses the following formula:</p>

        <div className="bg-gray-50 rounded-lg xs:rounded-xl p-3 xs:p-3 sm:p-4 font-mono text-[10px] xs:text-xs sm:text-sm overflow-x-auto mb-4 xs:mb-3 sm:mb-4 md:mb-6">
          <p className="mb-2 xs:mb-3 sm:mb-4 font-bold">CAGR = (Final Value / Initial Value)<sup>1/n</sup> - 1</p>
          <div className="text-gray-600 space-y-0.5 xs:space-y-1 border-t border-gray-200 pt-3">
            <p>Where:</p>
            <p>Final Value = Ending value of investment</p>
            <p>Initial Value = Starting value of investment</p>
            <p>n = Number of years</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-3 sm:gap-4 md:gap-6">
          <div>
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">How to Use This Calculator</h2>
            <ol className="list-decimal list-inside space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-600">
              <li>Enter the initial investment value</li>
              <li>Enter the final value after growth</li>
              <li>Specify the number of years</li>
              <li>View the calculated CAGR and growth analysis</li>
              <li>Explore what-if scenarios for insights</li>
            </ol>
          </div>

          <div>
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">CAGR vs Average Returns</h2>
            <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-600">
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-emerald-500 mt-0.5 flex-shrink-0">+</span>
                <span>CAGR accounts for compounding effects</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-emerald-500 mt-0.5 flex-shrink-0">+</span>
                <span>More accurate for multi-year investments</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-emerald-500 mt-0.5 flex-shrink-0">+</span>
                <span>Ignores year-to-year volatility</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-red-500 mt-0.5 flex-shrink-0">-</span>
                <span>Does not show individual year performance</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-red-500 mt-0.5 flex-shrink-0">-</span>
                <span>Assumes smooth, constant growth</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-blue-500 mt-0.5 flex-shrink-0">i</span>
                <span>Best used alongside other metrics</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-3 xs:mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4 xs:space-y-5 sm:space-y-4 md:space-y-6">
          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">What is CAGR and why is it important for investors?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              CAGR (Compound Annual Growth Rate) represents the mean annual growth rate of an investment over a specified period,
              assuming profits are reinvested each year. Unlike simple averages, CAGR smooths out volatility and shows what constant
              rate of return would have produced the same end result. It's invaluable for comparing investments with different time
              horizons, evaluating fund performance, and setting realistic expectations for future growth.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">How is CAGR different from average annual return?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              Average annual return simply adds up yearly returns and divides by the number of years, ignoring compounding effects.
              CAGR accounts for the compounding of returns over time. For example, if an investment grows 50% in year one and drops
              33% in year two, the average return is 8.5%, but the CAGR is 0% because you're back where you started. CAGR provides
              a more accurate picture of actual growth because it reflects the geometric progression of your investment.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">What is a good CAGR for investments?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              A "good" CAGR depends on the investment type and market conditions. Historically, the S&P 500 has delivered approximately
              10% CAGR over long periods. A CAGR of 7-10% is generally considered healthy for diversified stock portfolios. Real estate
              typically sees 3-5% CAGR, while high-growth stocks might achieve 15-25% or more. However, higher CAGR usually comes with
              higher risk. Always compare CAGR against relevant benchmarks and consider the time period analyzed.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">Can CAGR be negative?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              Yes, CAGR can be negative when the ending value is lower than the beginning value, indicating an investment lost money
              over the period. A negative CAGR shows the constant annual rate at which your investment declined. For instance, if
              $10,000 decreased to $7,500 over 5 years, the CAGR would be approximately -5.6% per year. This metric is useful for
              understanding the magnitude of investment losses and comparing underperforming assets.
            </p>
          </div>

          <div>
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">What are the limitations of using CAGR?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              While CAGR is powerful, it has limitations. It assumes smooth, constant growth and hides year-to-year volatility, which
              may be important for risk assessment. It doesn't account for additional investments or withdrawals during the period,
              making it unsuitable for portfolios with regular contributions. CAGR is also highly sensitive to the start and end
              dates chosen. For a complete picture, combine CAGR with other metrics like standard deviation, maximum drawdown, and
              Sharpe ratio.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="cagr-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
