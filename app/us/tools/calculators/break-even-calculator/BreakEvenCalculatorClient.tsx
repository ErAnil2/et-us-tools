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

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500' },
  { href: '/us/tools/calculators/bmi-calculator', title: 'BMI Calculator', description: 'Calculate body mass index', color: 'bg-purple-500' },
  { href: '/us/tools/calculators/age-calculator', title: 'Age Calculator', description: 'Calculate your exact age', color: 'bg-orange-500' },
];
interface Props {
  relatedCalculators?: RelatedCalculator[];
}

interface SalesData {
  units: number;
  revenue: number;
  fixedCosts: number;
  variableCosts: number;
  totalCosts: number;
  profit: number;
  cumProfit: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Break Even Calculator?",
    answer: "A Break Even Calculator is a free online tool designed to help you quickly and accurately calculate break even-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Break Even Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Break Even Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Break Even Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function BreakEvenCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('break-even-calculator');

  const [fixedCosts, setFixedCosts] = useState(10000);
  const [pricePerUnit, setPricePerUnit] = useState(50);
  const [variableCostPerUnit, setVariableCostPerUnit] = useState(30);
  const [targetProfit, setTargetProfit] = useState(5000);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const [results, setResults] = useState({
    breakEvenUnits: 0,
    breakEvenRevenue: 0,
    contributionMargin: 0,
    contributionMarginRatio: 0,
    unitsForTargetProfit: 0,
    revenueForTargetProfit: 0,
    safetyMargin: 0
  });

  const [salesData, setSalesData] = useState<SalesData[]>([]);

  const calculateBreakEven = (fixed: number, price: number, variable: number, target: number) => {
    const margin = price - variable;
    if (margin <= 0) {
      return {
        breakEvenUnits: Infinity,
        breakEvenRevenue: Infinity,
        contributionMargin: margin,
        contributionMarginRatio: 0,
        unitsForTargetProfit: Infinity,
        revenueForTargetProfit: Infinity,
        safetyMargin: 0,
        salesData: []
      };
    }

    const breakEvenUnits = fixed / margin;
    const breakEvenRevenue = breakEvenUnits * price;
    const marginRatio = (margin / price) * 100;
    const unitsForTarget = (fixed + target) / margin;
    const revenueForTarget = unitsForTarget * price;

    // Generate sales data for chart
    const maxUnits = Math.ceil(breakEvenUnits * 2);
    const step = Math.max(1, Math.ceil(maxUnits / 20));
    const data: SalesData[] = [];
    let cumProfit = 0;

    for (let units = 0; units <= maxUnits; units += step) {
      const revenue = units * price;
      const varCosts = units * variable;
      const totalCosts = fixed + varCosts;
      const profit = revenue - totalCosts;
      cumProfit = profit;

      data.push({
        units,
        revenue,
        fixedCosts: fixed,
        variableCosts: varCosts,
        totalCosts,
        profit,
        cumProfit
      });
    }

    return {
      breakEvenUnits,
      breakEvenRevenue,
      contributionMargin: margin,
      contributionMarginRatio: marginRatio,
      unitsForTargetProfit: unitsForTarget,
      revenueForTargetProfit: revenueForTarget,
      safetyMargin: ((unitsForTarget - breakEvenUnits) / unitsForTarget) * 100,
      salesData: data
    };
  };

  useEffect(() => {
    const result = calculateBreakEven(fixedCosts, pricePerUnit, variableCostPerUnit, targetProfit);
    setResults({
      breakEvenUnits: result.breakEvenUnits,
      breakEvenRevenue: result.breakEvenRevenue,
      contributionMargin: result.contributionMargin,
      contributionMarginRatio: result.contributionMarginRatio,
      unitsForTargetProfit: result.unitsForTargetProfit,
      revenueForTargetProfit: result.revenueForTargetProfit,
      safetyMargin: result.safetyMargin
    });
    setSalesData(result.salesData);
  }, [fixedCosts, pricePerUnit, variableCostPerUnit, targetProfit]);

  // What-if scenarios
  const scenarios = useMemo(() => {
    const current = calculateBreakEven(fixedCosts, pricePerUnit, variableCostPerUnit, targetProfit);
    const higherPrice = calculateBreakEven(fixedCosts, pricePerUnit * 1.1, variableCostPerUnit, targetProfit);
    const lowerCosts = calculateBreakEven(fixedCosts * 0.9, pricePerUnit, variableCostPerUnit, targetProfit);

    return {
      current: { ...current, price: pricePerUnit, fixed: fixedCosts },
      higherPrice: {
        ...higherPrice,
        price: pricePerUnit * 1.1,
        fixed: fixedCosts,
        unitsSaved: current.breakEvenUnits - higherPrice.breakEvenUnits
      },
      lowerCosts: {
        ...lowerCosts,
        price: pricePerUnit,
        fixed: fixedCosts * 0.9,
        unitsSaved: current.breakEvenUnits - lowerCosts.breakEvenUnits
      }
    };
  }, [fixedCosts, pricePerUnit, variableCostPerUnit, targetProfit]);

  const formatCurrency = (value: number) => {
    if (!isFinite(value)) return 'N/A';
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
    if (!isFinite(value)) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    if (!isFinite(value)) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Chart dimensions
  const chartWidth = 800;
  const chartHeight = 300;
  const chartPadding = { top: 20, right: 30, bottom: 40, left: 70 };
  const plotWidth = chartWidth - chartPadding.left - chartPadding.right;
  const plotHeight = chartHeight - chartPadding.top - chartPadding.bottom;

  const maxChartValue = salesData.length > 0 ? Math.max(...salesData.map(d => Math.max(d.revenue, d.totalCosts))) * 1.15 : 100;
  const maxUnits = salesData.length > 0 ? Math.max(...salesData.map(d => d.units)) : 100;

  // Generate line paths
  const generateLinePath = (key: 'revenue' | 'totalCosts') => {
    if (salesData.length === 0) return '';
    return salesData.map((d, i) => {
      const x = chartPadding.left + (d.units / maxUnits) * plotWidth;
      const y = chartPadding.top + plotHeight - (d[key] / maxChartValue) * plotHeight;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  const allRelatedCalculators = [
    { href: '/us/tools/calculators/profit-margin-calculator', title: 'Profit Margin', description: 'Calculate margins', icon: '💹' },
    { href: '/us/tools/calculators/roi-calculator', title: 'ROI Calculator', description: 'Return on investment', icon: '📊' },
    { href: '/us/tools/calculators/markup-calculator', title: 'Markup Calculator', description: 'Calculate markup', icon: '🏷️' },
    { href: '/us/tools/calculators/selling-price-calculator', title: 'Selling Price', description: 'Find selling price', icon: '💰' },
    { href: '/us/tools/calculators/cost-price-calculator', title: 'Cost Price', description: 'Calculate cost', icon: '📝' },
    { href: '/us/tools/calculators/discount-calculator', title: 'Discount Calculator', description: 'Calculate discounts', icon: '🎯' },
    { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage', description: 'Percentage calcs', icon: '📈' },
    { href: '/us/tools/calculators/business-valuation-calculator', title: 'Business Valuation', description: 'Value business', icon: '🏢' }
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-2 xs:px-3 sm:px-4 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-5 sm:mb-6 md:mb-8">
        <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">{getH1('Break-Even Calculator')}</h1>
        <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-600 px-1 sm:px-2 leading-relaxed">Calculate the point where your revenue equals total costs and plan for profitability</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Calculator Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Left: Input Section */}

      <div className="space-y-3 sm:space-y-4 md:space-y-5">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">Cost & Pricing Details</h2>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Fixed Costs (Monthly)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">$</span>
                <input
                  type="number"
                  value={fixedCosts}
                  onChange={(e) => setFixedCosts(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base touch-manipulation"
                  inputMode="numeric"
                />
              </div>
              <p className="text-[10px] xs:text-xs text-gray-500 mt-1">Rent, salaries, insurance, etc.</p>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Price Per Unit</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">$</span>
                <input
                  type="number"
                  value={pricePerUnit}
                  onChange={(e) => setPricePerUnit(Math.max(0.01, parseFloat(e.target.value) || 0.01))}
                  className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base touch-manipulation"
                  inputMode="decimal"
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Variable Cost Per Unit</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">$</span>
                <input
                  type="number"
                  value={variableCostPerUnit}
                  onChange={(e) => setVariableCostPerUnit(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base touch-manipulation"
                  inputMode="decimal"
                  step="0.01"
                />
              </div>
              <p className="text-[10px] xs:text-xs text-gray-500 mt-1">Materials, labor per unit, etc.</p>
            </div>

            <div className="bg-teal-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 mt-3 sm:mt-4">
              <h3 className="text-xs sm:text-sm font-semibold text-teal-700 mb-2 sm:mb-3 md:mb-4">Target Profit Goal</h3>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">$</span>
                <input
                  type="number"
                  value={targetProfit}
                  onChange={(e) => setTargetProfit(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base touch-manipulation bg-white"
                  inputMode="numeric"
                />
              </div>
            </div>

            <button className="w-full bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold py-3 sm:py-3.5 px-2 sm:px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base touch-manipulation">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Calculate Break-Even
            </button>
          </div>

          {/* Right: Results Section */}
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">Break-Even Analysis</h2>

            <div className="bg-teal-50 border border-teal-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
              <div className="text-[10px] xs:text-xs sm:text-sm text-teal-600 mb-0.5 sm:mb-1">Break-Even Point</div>
              <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-teal-700">{formatNumber(results.breakEvenUnits)} units</div>
              <div className="text-[10px] xs:text-xs sm:text-sm text-teal-600 mt-1">Revenue: {formatCurrencyFull(results.breakEvenRevenue)}</div>
            </div>

            <div className="space-y-1.5 sm:space-y-2 md:space-y-3 mb-3 sm:mb-4 md:mb-6">
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Contribution Margin:</span>
                <span className="font-semibold text-green-600">{formatCurrencyFull(results.contributionMargin)} / unit</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Contribution Margin Ratio:</span>
                <span className="font-semibold text-blue-600">{results.contributionMarginRatio.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Units for Target Profit:</span>
                <span className="font-semibold text-purple-600">{formatNumber(results.unitsForTargetProfit)} units</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Revenue for Target Profit:</span>
                <span className="font-semibold text-purple-600">{formatCurrencyFull(results.revenueForTargetProfit)}</span>
              </div>
            </div>

            <div className="mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Profit vs Loss Zone</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] xs:text-xs sm:text-sm">
                  <span className="text-gray-600">Break-Even Progress</span>
                  <span className="font-medium">50%</span>
                </div>
                <div className="h-3 sm:h-4 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-full overflow-hidden relative">
                  <div
                    className="absolute top-0 h-full w-1 bg-white shadow-lg border border-gray-400"
                    style={{ left: '50%' }}
                  />
                </div>
                <div className="flex justify-between text-[10px] xs:text-xs text-gray-500">
                  <span>Loss Zone</span>
                  <span>Break-Even</span>
                  <span>Profit Zone</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Key Metrics</h3>
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-4 text-[10px] xs:text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Fixed Costs:</span>
                  <span className="font-medium">{formatCurrency(fixedCosts)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price/Unit:</span>
                  <span className="font-medium">{formatCurrency(pricePerUnit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Var. Cost/Unit:</span>
                  <span className="font-medium">{formatCurrency(variableCostPerUnit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Target Profit:</span>
                  <span className="font-medium">{formatCurrency(targetProfit)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Break-Even Chart */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Cost-Volume-Profit Analysis</h2>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-3 xs:gap-4 sm:gap-6 md:gap-8 mb-3 sm:mb-4 md:mb-6">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-green-400 to-green-600 shadow-sm"></div>
            <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-medium">Revenue</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-red-400 to-red-600 shadow-sm"></div>
            <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-medium">Total Costs</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 shadow-sm"></div>
            <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-medium">Break-Even Point</span>
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
            <defs>
              <linearGradient id="revenueGradientBE" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="costGradientBE" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#dc2626" />
              </linearGradient>
              <filter id="lineShadowBE" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15"/>
              </filter>
              <filter id="glowTeal" x="-50%" y="-50%" width="200%" height="200%">
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

            {/* Revenue line */}
            <path d={generateLinePath('revenue')} fill="none" stroke="url(#revenueGradientBE)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" filter="url(#lineShadowBE)" />

            {/* Total costs line */}
            <path d={generateLinePath('totalCosts')} fill="none" stroke="url(#costGradientBE)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" filter="url(#lineShadowBE)" />

            {/* Break-even point */}
            {isFinite(results.breakEvenUnits) && results.breakEvenUnits <= maxUnits && (
              <g>
                <line
                  x1={chartPadding.left + (results.breakEvenUnits / maxUnits) * plotWidth}
                  y1={chartPadding.top}
                  x2={chartPadding.left + (results.breakEvenUnits / maxUnits) * plotWidth}
                  y2={chartPadding.top + plotHeight}
                  stroke="#14b8a6"
                  strokeWidth="2"
                  strokeDasharray="6,4"
                />
                <circle
                  cx={chartPadding.left + (results.breakEvenUnits / maxUnits) * plotWidth}
                  cy={chartPadding.top + plotHeight - (results.breakEvenRevenue / maxChartValue) * plotHeight}
                  r="8"
                  fill="#14b8a6"
                  stroke="white"
                  strokeWidth="3"
                  filter="url(#glowTeal)"
                />
              </g>
            )}

            {/* Data points and hover areas */}
            {salesData.map((d, i) => {
              const x = chartPadding.left + (d.units / maxUnits) * plotWidth;
              const yRev = chartPadding.top + plotHeight - (d.revenue / maxChartValue) * plotHeight;
              const yCost = chartPadding.top + plotHeight - (d.totalCosts / maxChartValue) * plotHeight;
              const isHovered = hoveredPoint === i;

              return (
                <g key={i}>
                  <circle cx={x} cy={yRev} r={isHovered ? 6 : 4} fill="white" stroke="#10b981" strokeWidth={isHovered ? 3 : 2} className="transition-all duration-200" />
                  <circle cx={x} cy={yCost} r={isHovered ? 6 : 4} fill="white" stroke="#ef4444" strokeWidth={isHovered ? 3 : 2} className="transition-all duration-200" />
                  <rect
                    x={x - 15}
                    y={chartPadding.top}
                    width={30}
                    height={plotHeight}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(i)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                </g>
              );
            })}

            {/* X-axis labels */}
            {salesData.filter((_, i) => i % Math.ceil(salesData.length / 6) === 0 || i === salesData.length - 1).map((d, i) => {
              const x = chartPadding.left + (d.units / maxUnits) * plotWidth;
              return (
                <text key={i} x={x} y={chartPadding.top + plotHeight + 25} textAnchor="middle" className="text-[10px] sm:text-xs fill-gray-500 font-medium">
                  {formatNumber(d.units)}
                </text>
              );
            })}
          </svg>

          {/* Tooltip */}
          {hoveredPoint !== null && salesData[hoveredPoint] && (
            <div
              className="absolute z-20 bg-white text-gray-800 text-xs rounded-xl px-4 py-3 shadow-2xl pointer-events-none border border-teal-100"
              style={{
                left: `calc(${((salesData[hoveredPoint].units / maxUnits)) * 85 + 8}%)`,
                top: '30px',
                transform: 'translateX(-50%)'
              }}
            >
              <div className="font-bold mb-2 text-sm text-gray-900 border-b border-gray-100 pb-2">{formatNumber(salesData[hoveredPoint].units)} Units</div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                  <span className="text-gray-600">Revenue:</span>
                  <span className="font-semibold text-green-600 ml-auto">{formatCurrencyFull(salesData[hoveredPoint].revenue)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                  <span className="text-gray-600">Total Costs:</span>
                  <span className="font-semibold text-red-600 ml-auto">{formatCurrencyFull(salesData[hoveredPoint].totalCosts)}</span>
                </div>
                <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                  <span className="text-gray-600">Profit/Loss:</span>
                  <span className={`font-bold ml-auto ${salesData[hoveredPoint].profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrencyFull(salesData[hoveredPoint].profit)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* What-If Scenarios */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-1.5 sm:mb-2">What-If Scenarios</h2>
        <p className="text-gray-600 text-[10px] xs:text-xs sm:text-sm mb-3 sm:mb-4 md:mb-6">See how changes affect your break-even point</p>

        {/* Scenario Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
          <div className="border-2 border-teal-200 bg-teal-50 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 xs:col-span-2 sm:col-span-1">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Current</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-teal-600 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">Active</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Price:</span>
                <span className="font-medium">{formatCurrency(pricePerUnit)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fixed Costs:</span>
                <span className="font-medium">{formatCurrency(fixedCosts)}</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-teal-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Break-Even Units</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-teal-700">{formatNumber(scenarios.current.breakEvenUnits)}</div>
            </div>
          </div>

          <div className="border border-gray-200 bg-white rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 hover:border-green-300 active:border-green-400 transition-colors">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Higher Price</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-green-500 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">+10%</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Price:</span>
                <span className="font-medium text-green-600">{formatCurrency(scenarios.higherPrice.price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fixed Costs:</span>
                <span className="font-medium">{formatCurrency(fixedCosts)}</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Break-Even Units</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-gray-800">{formatNumber(scenarios.higherPrice.breakEvenUnits)}</div>
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-green-600">{formatNumber(scenarios.higherPrice.unitsSaved)} fewer units</div>
            </div>
          </div>

          <div className="border border-gray-200 bg-white rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 hover:border-blue-300 active:border-blue-400 transition-colors">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Lower Costs</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-blue-500 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">-10%</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Price:</span>
                <span className="font-medium">{formatCurrency(pricePerUnit)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fixed Costs:</span>
                <span className="font-medium text-blue-600">{formatCurrency(scenarios.lowerCosts.fixed)}</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Break-Even Units</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-gray-800">{formatNumber(scenarios.lowerCosts.breakEvenUnits)}</div>
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-green-600">{formatNumber(scenarios.lowerCosts.unitsSaved)} fewer units</div>
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
              <span className="font-semibold text-gray-800 text-[10px] xs:text-xs sm:text-sm md:text-base">Increase Contribution Margin</span>
            </div>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              Your current contribution margin is {formatCurrencyFull(results.contributionMargin)} per unit ({results.contributionMarginRatio.toFixed(1)}%).
              Increasing price or reducing variable costs lowers break-even.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-gray-800 text-[10px] xs:text-xs sm:text-sm md:text-base">Target Profit Strategy</span>
            </div>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              To achieve your target profit of {formatCurrency(targetProfit)}, you need to sell {formatNumber(results.unitsForTargetProfit)} units
              generating {formatCurrency(results.revenueForTargetProfit)} in revenue.
            </p>
          </div>
        </div>
      </div>

      {/* Sales Analysis Table */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-sm xs:text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Sales Volume Analysis</h2>

        <div className="overflow-x-auto -mx-3 xs:-mx-4 sm:mx-0">
          <table className="w-full text-[10px] xs:text-xs sm:text-sm min-w-[450px] sm:min-w-[550px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Units</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Revenue</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700 hidden xs:table-cell">Total Costs</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Profit/Loss</th>
              </tr>
            </thead>
            <tbody>
              {(showFullSchedule ? salesData : salesData.slice(0, 6)).map((row, i) => (
                <tr key={i} className={`border-b border-gray-100 hover:bg-gray-50 ${Math.abs(row.units - results.breakEvenUnits) < (maxUnits / 20) ? 'bg-teal-50' : ''}`}>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-gray-800">{formatNumber(row.units)}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-green-600">{formatCurrencyFull(row.revenue)}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-red-600 hidden xs:table-cell">{formatCurrencyFull(row.totalCosts)}</td>
                  <td className={`py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right font-semibold ${row.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrencyFull(row.profit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {salesData.length > 6 && (
            <div className="text-center py-2 sm:py-3 md:py-4">
              {!showFullSchedule && (
                <p className="text-[10px] xs:text-xs sm:text-sm text-gray-500 mb-2">
                  Showing 6 of {salesData.length} data points
                </p>
              )}
              <button
                onClick={() => setShowFullSchedule(!showFullSchedule)}
                className="px-3 xs:px-4 sm:px-5 py-1.5 sm:py-2 bg-teal-100 hover:bg-teal-200 active:bg-teal-300 text-teal-700 text-[10px] xs:text-xs sm:text-sm font-medium rounded-lg transition-colors touch-manipulation"
              >
                {showFullSchedule ? 'Show Less' : 'Show Full Analysis'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Related Calculators - Moved above SEO and FAQs */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-3 xs:mb-4 sm:mb-4 md:mb-6">Related Business Calculators</h2>
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
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Understanding Break-Even Analysis</h2>
        <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-3 xs:mb-4 sm:mb-4 md:mb-6 leading-relaxed">
          Break-even analysis is a critical financial tool that helps businesses determine when they'll start making a profit.
          It identifies the point where total revenue equals total costs, meaning no profit or loss.
        </p>

        <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 xs:gap-4 sm:gap-4 md:gap-6 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
          <div className="bg-teal-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-teal-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Fixed Costs</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600">Costs that don't change with production: rent, salaries, insurance</p>
          </div>
          <div className="bg-orange-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-orange-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Variable Costs</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600">Costs that change with production: materials, direct labor</p>
          </div>
          <div className="bg-green-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-green-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Contribution Margin</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600">Price minus variable cost - what each unit contributes to fixed costs</p>
          </div>
        </div>

        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Break-Even Formulas</h2>
        <div className="bg-gray-50 rounded-lg xs:rounded-xl p-3 xs:p-3 sm:p-4 font-mono text-[10px] xs:text-xs sm:text-sm overflow-x-auto mb-4 xs:mb-3 sm:mb-4 md:mb-6">
          <p className="mb-2 xs:mb-3 sm:mb-4">Break-Even Units = Fixed Costs ÷ Contribution Margin</p>
          <p className="mb-2 xs:mb-3 sm:mb-4">Contribution Margin = Price per Unit - Variable Cost per Unit</p>
          <p className="mb-2 xs:mb-3 sm:mb-4">Break-Even Revenue = Break-Even Units × Price per Unit</p>
          <p>Units for Target Profit = (Fixed Costs + Target Profit) ÷ Contribution Margin</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-3 sm:gap-4 md:gap-6">
          <div>
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Uses of Break-Even Analysis</h2>
            <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-600">
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-teal-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Pricing decisions and profit planning</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-teal-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Evaluating new product viability</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-teal-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Setting sales targets and quotas</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-teal-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Assessing impact of cost changes</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Limitations</h2>
            <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-600">
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-orange-500 mt-0.5 flex-shrink-0">•</span>
                <span>Assumes constant price and costs</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-orange-500 mt-0.5 flex-shrink-0">•</span>
                <span>Ignores economies of scale</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-orange-500 mt-0.5 flex-shrink-0">•</span>
                <span>Single product analysis only</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-orange-500 mt-0.5 flex-shrink-0">•</span>
                <span>Static, point-in-time analysis</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-3 xs:mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4 xs:space-y-5 sm:space-y-4 md:space-y-6">
          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">What is a break-even point and why is it important?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              The break-even point is the sales volume at which your total revenue equals total costs, resulting in zero profit or loss.
              It's crucial for business planning because it tells you the minimum sales needed to cover all expenses. Understanding your
              break-even point helps with pricing decisions, setting sales targets, evaluating new product viability, and making informed
              decisions about fixed cost investments like rent or equipment.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">How is contribution margin calculated and what does it mean?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              Contribution margin is calculated by subtracting the variable cost per unit from the selling price per unit. For example,
              if you sell a product for $50 and it costs $30 in variable expenses to produce, your contribution margin is $20. This $20
              "contributes" toward covering your fixed costs. A higher contribution margin means you need to sell fewer units to break even
              and each sale generates more profit after reaching the break-even point.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">What's the difference between fixed costs and variable costs?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              Fixed costs remain constant regardless of how many units you produce or sell. Examples include rent, insurance, salaries,
              and loan payments. Variable costs change directly with production volume, such as raw materials, packaging, direct labor
              per unit, and shipping. Understanding this distinction is essential for accurate break-even analysis, as fixed costs must
              be covered before any profit is earned, while variable costs scale with your sales.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">How can I lower my break-even point?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              There are three main strategies to lower your break-even point: (1) Reduce fixed costs by negotiating lower rent,
              cutting unnecessary overhead, or automating processes. (2) Increase your selling price, which raises your contribution
              margin per unit. (3) Reduce variable costs per unit by finding cheaper suppliers, improving efficiency, or achieving
              economies of scale. The most effective approach often combines all three strategies while ensuring your pricing remains
              competitive in the market.
            </p>
          </div>

          <div>
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">Can break-even analysis be used for service businesses?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              Yes, break-even analysis works for service businesses too, though the calculations may require some adaptation. For services,
              the "unit" is typically a billable hour, project, or client. Fixed costs include office space, software subscriptions,
              and administrative salaries. Variable costs might include contractor fees, materials for each project, or travel expenses
              per client. The key is accurately identifying which costs change with each additional client or project served.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="break-even-calculator" fallbackFaqs={fallbackFaqs} />
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />
    </div>
  );
}
