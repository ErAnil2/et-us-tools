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
  principal: number;
  interest: number;
  totalValue: number;
  afterTax: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Fd Calculator?",
    answer: "A Fd Calculator is a free online tool designed to help you quickly and accurately calculate fd-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Fd Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Fd Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Fd Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function FDCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('fd-calculator');

  const [principal, setPrincipal] = useState(25000);
  const [rate, setRate] = useState(5.0);
  const [tenure, setTenure] = useState(5);
  const [compounding, setCompounding] = useState<'annually' | 'semi-annually' | 'quarterly' | 'monthly'>('quarterly');
  const [taxRate, setTaxRate] = useState(20);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [hoveredScenario, setHoveredScenario] = useState<string | null>(null);

  const [results, setResults] = useState({
    maturityAmount: 0,
    interestEarned: 0,
    taxOnInterest: 0,
    afterTaxAmount: 0,
    effectiveRate: 0,
    monthlyEquivalent: 0
  });

  const [yearlyData, setYearlyData] = useState<YearlyData[]>([]);

  const compoundingFrequencies: Record<string, number> = {
    'annually': 1,
    'semi-annually': 2,
    'quarterly': 4,
    'monthly': 12
  };

  const calculateFD = (p: number, r: number, t: number, freq: string, tax: number) => {
    const n = compoundingFrequencies[freq];
    const rateDecimal = r / 100;
    const taxDecimal = tax / 100;

    // FD Compound Interest: A = P(1 + r/n)^(nt)
    const maturityAmount = p * Math.pow(1 + rateDecimal / n, n * t);
    const interestEarned = maturityAmount - p;
    const taxOnInterest = interestEarned * taxDecimal;
    const afterTaxAmount = maturityAmount - taxOnInterest;

    // Effective Annual Rate
    const effectiveRate = (Math.pow(1 + rateDecimal / n, n) - 1) * 100;

    // Generate yearly breakdown
    const yearlyBreakdown: YearlyData[] = [];
    for (let year = 1; year <= t; year++) {
      const totalValue = p * Math.pow(1 + rateDecimal / n, n * year);
      const interest = totalValue - p;
      const yearTax = interest * taxDecimal;
      const afterTax = totalValue - yearTax;

      yearlyBreakdown.push({
        year,
        principal: p,
        interest,
        totalValue,
        afterTax
      });
    }

    return {
      maturityAmount,
      interestEarned,
      taxOnInterest,
      afterTaxAmount,
      effectiveRate,
      monthlyEquivalent: interestEarned / (t * 12),
      yearlyBreakdown
    };
  };

  useEffect(() => {
    const result = calculateFD(principal, rate, tenure, compounding, taxRate);
    setResults({
      maturityAmount: result.maturityAmount,
      interestEarned: result.interestEarned,
      taxOnInterest: result.taxOnInterest,
      afterTaxAmount: result.afterTaxAmount,
      effectiveRate: result.effectiveRate,
      monthlyEquivalent: result.monthlyEquivalent
    });
    setYearlyData(result.yearlyBreakdown);
  }, [principal, rate, tenure, compounding, taxRate]);

  // What-if scenarios
  const scenarios = useMemo(() => {
    const current = calculateFD(principal, rate, tenure, compounding, taxRate);
    const higherRate = calculateFD(principal, rate + 1, tenure, compounding, taxRate);
    const longerTerm = calculateFD(principal, rate, tenure + 2, compounding, taxRate);

    return {
      current: { ...current, rate, tenure, principal },
      higherRate: {
        ...higherRate,
        rate: rate + 1,
        tenure,
        principal,
        extraInterest: higherRate.interestEarned - current.interestEarned
      },
      longerTerm: {
        ...longerTerm,
        rate,
        tenure: tenure + 2,
        principal,
        extraInterest: longerTerm.interestEarned - current.interestEarned
      }
    };
  }, [principal, rate, tenure, compounding, taxRate]);

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

  // Generate chart points for FD growth (area chart)
  const chartPoints = useMemo(() => {
    if (yearlyData.length === 0) return [];

    const maxValue = Math.max(...yearlyData.map(d => d.totalValue)) * 1.1;
    const points: { x: number; y: number; year: number; value: number; interest: number }[] = [];

    // Start point
    points.push({
      x: chartPadding.left,
      y: chartPadding.top + plotHeight - (principal / maxValue) * plotHeight,
      year: 0,
      value: principal,
      interest: 0
    });

    yearlyData.forEach((d, i) => {
      const x = chartPadding.left + ((i + 1) / tenure) * plotWidth;
      const y = chartPadding.top + plotHeight - (d.totalValue / maxValue) * plotHeight;
      points.push({
        x,
        y,
        year: d.year,
        value: d.totalValue,
        interest: d.interest
      });
    });

    return points;
  }, [yearlyData, principal, tenure]);

  const maxChartValue = yearlyData.length > 0 ? Math.max(...yearlyData.map(d => d.totalValue)) * 1.1 : principal * 1.5;

  // Create area path
  const areaPath = chartPoints.length > 0
    ? `M ${chartPoints[0].x} ${chartPadding.top + plotHeight} L ${chartPoints.map(p => `${p.x} ${p.y}`).join(' L ')} L ${chartPoints[chartPoints.length - 1].x} ${chartPadding.top + plotHeight} Z`
    : '';

  const linePath = chartPoints.length > 0
    ? `M ${chartPoints.map(p => `${p.x} ${p.y}`).join(' L ')}`
    : '';

  const allRelatedCalculators = [
    { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound growth', icon: '📈' },
    { href: '/us/tools/calculators/sip-calculator', title: 'SIP Calculator', description: 'Systematic investment plan', icon: '💹' },
    { href: '/us/tools/calculators/simple-interest-calculator', title: 'Simple Interest', description: 'Calculate simple interest', icon: '💵' },
    { href: '/us/tools/calculators/investment-growth-calculator', title: 'Investment Growth', description: 'Track investment growth', icon: '🌱' },
    { href: '/us/tools/calculators/savings-calculator', title: 'Savings Calculator', description: 'Plan your savings', icon: '🏦' },
    { href: '/us/tools/calculators/apy-calculator', title: 'APY Calculator', description: 'Annual percentage yield', icon: '📊' },
    { href: '/us/tools/calculators/lumpsum-calculator', title: 'Lumpsum Calculator', description: 'One-time investment returns', icon: '💰' },
    { href: '/us/tools/calculators/inflation-calculator', title: 'Inflation Calculator', description: 'Adjust for inflation', icon: '📉' }
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-2 xs:px-3 sm:px-4 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-5 sm:mb-6 md:mb-8">
        <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">{getH1('Fixed Deposit (FD) Calculator')}</h1>
        <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-600 px-1 sm:px-2 leading-relaxed">Calculate your FD maturity amount with compound interest and see year-by-year growth</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Calculator Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Left: Input Section */}

      <div className="space-y-3 sm:space-y-4 md:space-y-5">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">FD Investment Details</h2>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Principal Amount ($)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">$</span>
                <input
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base touch-manipulation"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Interest Rate (% per annum)</label>
              <div className="relative">
                <input
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base touch-manipulation"
                  inputMode="decimal"
                  step="0.1"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">%</span>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Tenure (Years)</label>
              <input
                type="number"
                value={tenure}
                onChange={(e) => setTenure(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base touch-manipulation"
                inputMode="numeric"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Compounding Frequency</label>
              <select
                value={compounding}
                onChange={(e) => setCompounding(e.target.value as any)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base touch-manipulation bg-white"
              >
                <option value="annually">Annually (1x/year)</option>
                <option value="semi-annually">Semi-Annually (2x/year)</option>
                <option value="quarterly">Quarterly (4x/year)</option>
                <option value="monthly">Monthly (12x/year)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Tax Rate on Interest (%)</label>
              <div className="relative">
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Math.max(0, Math.min(50, parseFloat(e.target.value) || 0)))}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base touch-manipulation"
                  inputMode="decimal"
                  step="1"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">%</span>
              </div>
            </div>

            <div className="bg-indigo-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 mt-3 sm:mt-4">
              <h3 className="text-xs sm:text-sm font-semibold text-indigo-600 mb-2 sm:mb-3 md:mb-4">Quick FD Presets</h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => { setPrincipal(10000); setRate(4.5); setTenure(1); setCompounding('quarterly'); }}
                  className="px-2 py-2 bg-white border border-indigo-200 rounded-lg text-xs font-medium text-indigo-700 hover:bg-indigo-100 transition-colors touch-manipulation"
                >
                  1 Year FD
                </button>
                <button
                  onClick={() => { setPrincipal(25000); setRate(5.0); setTenure(3); setCompounding('quarterly'); }}
                  className="px-2 py-2 bg-white border border-indigo-200 rounded-lg text-xs font-medium text-indigo-700 hover:bg-indigo-100 transition-colors touch-manipulation"
                >
                  3 Year FD
                </button>
                <button
                  onClick={() => { setPrincipal(50000); setRate(5.5); setTenure(5); setCompounding('monthly'); }}
                  className="px-2 py-2 bg-white border border-indigo-200 rounded-lg text-xs font-medium text-indigo-700 hover:bg-indigo-100 transition-colors touch-manipulation"
                >
                  5 Year FD
                </button>
              </div>
            </div>
          </div>

          {/* Right: Results Section */}
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">FD Returns</h2>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
              <div className="text-[10px] xs:text-xs sm:text-sm text-indigo-600 mb-0.5 sm:mb-1">Maturity Amount</div>
              <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-indigo-700">{formatCurrencyFull(results.maturityAmount)}</div>
              <div className="text-[10px] xs:text-xs sm:text-sm text-indigo-600 mt-1">After {tenure} years at {rate}% p.a.</div>
            </div>

            <div className="space-y-1.5 sm:space-y-2 md:space-y-3 mb-3 sm:mb-4 md:mb-6">
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Principal Invested:</span>
                <span className="font-semibold text-gray-800">{formatCurrencyFull(principal)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Interest Earned:</span>
                <span className="font-semibold text-green-600">{formatCurrencyFull(results.interestEarned)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Tax on Interest ({taxRate}%):</span>
                <span className="font-semibold text-red-500">-{formatCurrencyFull(results.taxOnInterest)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">After-Tax Amount:</span>
                <span className="font-semibold text-indigo-600">{formatCurrencyFull(results.afterTaxAmount)}</span>
              </div>
            </div>

            <div className="mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Investment Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] xs:text-xs sm:text-sm">
                  <span className="text-gray-600">Principal</span>
                  <span className="font-medium">{((principal / results.maturityAmount) * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${(principal / results.maturityAmount) * 100}%` }} />
                </div>
                <div className="flex justify-between text-[10px] xs:text-xs sm:text-sm mt-2 sm:mt-3">
                  <span className="text-gray-600">Interest Earned</span>
                  <span className="font-medium">{((results.interestEarned / results.maturityAmount) * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: `${(results.interestEarned / results.maturityAmount) * 100}%` }} />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Key Metrics</h3>
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-4 text-[10px] xs:text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Effective Rate:</span>
                  <span className="font-medium text-indigo-600">{results.effectiveRate.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Compounding:</span>
                  <span className="font-medium capitalize">{compounding}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Interest:</span>
                  <span className="font-medium">{formatCurrencyFull(results.monthlyEquivalent)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Gain:</span>
                  <span className="font-medium text-green-600">+{((results.interestEarned / principal) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners */}
      <CalculatorAfterCalcBanners />

      {/* FD Growth Chart */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">FD Growth Over Time</h2>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-3 xs:gap-4 sm:gap-6 md:gap-8 mb-3 sm:mb-4 md:mb-6">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-600 shadow-sm"></div>
            <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-medium">FD Value</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-violet-400 to-violet-600 shadow-sm"></div>
            <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-medium">Interest Earned</span>
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
              <linearGradient id="fdAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#818cf8" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#c7d2fe" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="fdLineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="50%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
              <filter id="fdGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <filter id="fdShadow" x="-10%" y="-10%" width="120%" height="130%">
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
                fill="url(#fdAreaGradient)"
                filter="url(#fdShadow)"
              />
            )}

            {/* Line */}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="url(#fdLineGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#fdGlow)"
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
                  stroke="#6366f1"
                  strokeWidth="3"
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredPoint(i)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  filter="url(#fdGlow)"
                />
                {hoveredPoint === i && (
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="12"
                    fill="#6366f1"
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
                stroke="#6366f1"
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
                  <span className="w-2.5 h-2.5 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full"></span>
                  <span className="text-gray-600">FD Value:</span>
                  <span className="font-semibold text-indigo-600 ml-auto">{formatCurrencyFull(chartPoints[hoveredPoint].value)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></span>
                  <span className="text-gray-600">Interest:</span>
                  <span className="font-semibold text-green-600 ml-auto">{formatCurrencyFull(chartPoints[hoveredPoint].interest)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* What-If Scenarios */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-1.5 sm:mb-2">What-If Scenarios</h2>
        <p className="text-gray-600 text-[10px] xs:text-xs sm:text-sm mb-3 sm:mb-4 md:mb-6">See how changing FD terms affects your total returns</p>

        {/* Scenario Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
          <div
            className={`border-2 border-indigo-200 bg-indigo-50 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 xs:col-span-2 sm:col-span-1 transition-transform duration-200 ${hoveredScenario === 'current' ? 'scale-[1.02]' : ''}`}
            onMouseEnter={() => setHoveredScenario('current')}
            onMouseLeave={() => setHoveredScenario(null)}
          >
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Current FD</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-indigo-600 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">Active</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Rate:</span>
                <span className="font-medium">{rate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tenure:</span>
                <span className="font-medium">{tenure} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Principal:</span>
                <span className="font-medium">{formatCurrency(principal)}</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-indigo-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Maturity Amount</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-indigo-700">{formatCurrencyFull(scenarios.current.maturityAmount)}</div>
            </div>
          </div>

          <div
            className={`border border-gray-200 bg-white rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 hover:border-green-300 active:border-green-400 transition-all duration-200 ${hoveredScenario === 'higherRate' ? 'scale-[1.02] border-green-300' : ''}`}
            onMouseEnter={() => setHoveredScenario('higherRate')}
            onMouseLeave={() => setHoveredScenario(null)}
          >
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Higher Rate</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-green-500 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">+1%</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Rate:</span>
                <span className="font-medium text-green-600">{rate + 1}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tenure:</span>
                <span className="font-medium">{tenure} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Principal:</span>
                <span className="font-medium">{formatCurrency(principal)}</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Maturity Amount</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-gray-800">{formatCurrencyFull(scenarios.higherRate.maturityAmount)}</div>
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-green-600">+{formatCurrencyFull(scenarios.higherRate.extraInterest)} extra</div>
            </div>
          </div>

          <div
            className={`border border-gray-200 bg-white rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 hover:border-purple-300 active:border-purple-400 transition-all duration-200 ${hoveredScenario === 'longerTerm' ? 'scale-[1.02] border-purple-300' : ''}`}
            onMouseEnter={() => setHoveredScenario('longerTerm')}
            onMouseLeave={() => setHoveredScenario(null)}
          >
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Longer Term</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-purple-500 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">+2 yrs</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Rate:</span>
                <span className="font-medium">{rate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tenure:</span>
                <span className="font-medium text-purple-600">{tenure + 2} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Principal:</span>
                <span className="font-medium">{formatCurrency(principal)}</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Maturity Amount</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-gray-800">{formatCurrencyFull(scenarios.longerTerm.maturityAmount)}</div>
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-green-600">+{formatCurrencyFull(scenarios.longerTerm.extraInterest)} extra</div>
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
              <span className="font-semibold text-gray-800 text-[10px] xs:text-xs sm:text-sm md:text-base">Higher Rate Impact</span>
            </div>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              A 1% higher interest rate would earn you {formatCurrencyFull(scenarios.higherRate.extraInterest)} more in interest over {tenure} years.
              Shop around for the best FD rates from different banks.
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-gray-800 text-[10px] xs:text-xs sm:text-sm md:text-base">Longer Tenure Benefits</span>
            </div>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              Extending your FD by 2 years would grow your returns by {formatCurrencyFull(scenarios.longerTerm.extraInterest)}.
              The power of compounding increases significantly over longer periods.
            </p>
          </div>
        </div>
      </div>

      {/* Year-by-Year Schedule */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-sm xs:text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Year-by-Year FD Schedule</h2>

        <div className="overflow-x-auto -mx-3 xs:-mx-4 sm:mx-0">
          <table className="w-full text-[10px] xs:text-xs sm:text-sm min-w-[400px] sm:min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Year</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Principal</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Interest</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700 hidden xs:table-cell">Total Value</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">After Tax</th>
              </tr>
            </thead>
            <tbody>
              {(showFullSchedule ? yearlyData : yearlyData.slice(0, 5)).map((row) => (
                <tr key={row.year} className="border-b border-gray-100 hover:bg-gray-50 active:bg-gray-100">
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-gray-800">Year {row.year}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-gray-600">{formatCurrencyFull(row.principal)}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-green-600">{formatCurrencyFull(row.interest)}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-indigo-600 hidden xs:table-cell">{formatCurrencyFull(row.totalValue)}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right font-semibold text-gray-800">{formatCurrencyFull(row.afterTax)}</td>
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
      {/* Related Calculators */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-3 xs:mb-4 sm:mb-4 md:mb-6">Related Investment Calculators</h2>
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
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">What is a Fixed Deposit (FD)?</h2>
        <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-3 xs:mb-4 sm:mb-4 md:mb-6 leading-relaxed">
          A Fixed Deposit (FD) is a financial instrument provided by banks that provides investors with a higher rate of interest
          than a regular savings account, until the given maturity date. It is a safe investment option with guaranteed returns,
          making it popular among risk-averse investors looking for stable growth.
        </p>

        <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 xs:gap-4 sm:gap-4 md:gap-6 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
          <div className="bg-indigo-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-indigo-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Guaranteed Returns</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Fixed interest rate locked in at the time of deposit, protecting against rate fluctuations</p>
          </div>
          <div className="bg-green-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-green-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Compound Growth</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Interest compounds on itself, accelerating your wealth growth over time</p>
          </div>
          <div className="bg-purple-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-purple-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Low Risk</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">FDIC insured up to $250,000 per depositor, per bank</p>
          </div>
        </div>

        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">FD Compound Interest Formula</h2>
        <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-2 xs:mb-3 sm:mb-4">Fixed deposits use compound interest calculation:</p>

        <div className="bg-gray-50 rounded-lg xs:rounded-xl p-3 xs:p-3 sm:p-4 font-mono text-[10px] xs:text-xs sm:text-sm overflow-x-auto mb-4 xs:mb-3 sm:mb-4 md:mb-6">
          <p className="mb-2 xs:mb-3 sm:mb-4">A = P × (1 + r/n)<sup>n×t</sup></p>
          <div className="text-gray-600 space-y-0.5 xs:space-y-1">
            <p>Where:</p>
            <p>A = Maturity Amount</p>
            <p>P = Principal (Initial Deposit)</p>
            <p>r = Annual Interest Rate (as decimal)</p>
            <p>n = Compounding Frequency per year</p>
            <p>t = Time Period in years</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-3 sm:gap-4 md:gap-6">
          <div>
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Compounding Frequency Impact</h2>
            <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-600">
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-indigo-500 mt-0.5 flex-shrink-0">•</span>
                <span><strong>Monthly:</strong> Highest returns, compounds 12 times/year</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-indigo-500 mt-0.5 flex-shrink-0">•</span>
                <span><strong>Quarterly:</strong> Most common, compounds 4 times/year</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-indigo-500 mt-0.5 flex-shrink-0">•</span>
                <span><strong>Semi-Annually:</strong> Compounds twice per year</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-indigo-500 mt-0.5 flex-shrink-0">•</span>
                <span><strong>Annually:</strong> Lowest returns, once per year</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Tips for FD Investment</h2>
            <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-600">
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Compare rates across multiple banks</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Consider laddering FDs for flexibility</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Choose monthly compounding when available</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Factor in taxes when comparing returns</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Lock in longer terms when rates are high</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Check for early withdrawal penalties</span>
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
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">What is a Fixed Deposit (FD) and how does it work?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              A Fixed Deposit (also called a Certificate of Deposit or CD in the US) is a savings instrument where you deposit a lump
              sum for a fixed period at a guaranteed interest rate. Unlike savings accounts, you agree not to withdraw funds until
              maturity. In return, banks offer higher interest rates. FDs are FDIC insured up to $250,000, making them one of the
              safest investment options for conservative investors seeking predictable returns.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">What is the difference between simple and compound interest on FDs?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              Simple interest is calculated only on the original principal amount throughout the term. Compound interest is calculated
              on both the principal and accumulated interest, so you earn "interest on interest." For example, $10,000 at 5% for 3 years
              earns $1,500 with simple interest but approximately $1,576 with annual compounding. Most FDs offer compound interest,
              with more frequent compounding (monthly or quarterly) yielding slightly higher returns than annual compounding.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">What happens if I withdraw my FD before maturity?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              Early withdrawal from an FD typically incurs a penalty, often expressed as a reduction in the interest rate earned.
              For example, you might receive 1-3% less interest than the contracted rate, and some banks may forfeit a certain number
              of months' interest. The exact penalty varies by institution and term length. To avoid penalties, consider laddering
              multiple shorter-term FDs instead of one long-term deposit, giving you periodic access to funds.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">Are Fixed Deposits a good investment choice?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              FDs are excellent for capital preservation, emergency funds, and short-term goals where you cannot risk losing principal.
              They're ideal for risk-averse investors and retirees needing predictable income. However, FD returns often barely keep
              pace with inflation, so they may not be suitable as your primary long-term wealth-building strategy. A balanced approach
              uses FDs for stability while allocating other funds to growth investments like stocks or mutual funds.
            </p>
          </div>

          <div>
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">What is FD laddering and why should I consider it?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              FD laddering involves dividing your investment across multiple FDs with staggered maturity dates instead of one large FD.
              For example, instead of investing $50,000 in a 5-year FD, you could invest $10,000 each in 1, 2, 3, 4, and 5-year FDs.
              This strategy provides regular access to funds without penalties, lets you reinvest at potentially higher rates as FDs
              mature, and reduces the risk of locking all your money at a low rate if interest rates rise.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="fd-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
