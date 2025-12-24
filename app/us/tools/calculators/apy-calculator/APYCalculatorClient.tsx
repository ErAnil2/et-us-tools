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
  deposits: number;
  interest: number;
  balance: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Apy Calculator?",
    answer: "A Apy Calculator is a free online tool designed to help you quickly and accurately calculate apy-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Apy Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Apy Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Apy Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function APYCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('apy-calculator');

  const [apr, setApr] = useState(5.0);
  const [compounding, setCompounding] = useState<number>(12);
  const [initialDeposit, setInitialDeposit] = useState(10000);
  const [monthlyDeposit, setMonthlyDeposit] = useState(500);
  const [years, setYears] = useState(10);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [hoveredScenario, setHoveredScenario] = useState<string | null>(null);

  const [results, setResults] = useState({
    apy: 0,
    totalDeposits: 0,
    interestEarned: 0,
    finalBalance: 0,
    apyDifference: 0,
    effectiveMonthlyRate: 0
  });

  const [yearlyData, setYearlyData] = useState<YearlyData[]>([]);

  const compoundingOptions = [
    { value: 365, label: 'Daily (365x/year)' },
    { value: 12, label: 'Monthly (12x/year)' },
    { value: 4, label: 'Quarterly (4x/year)' },
    { value: 2, label: 'Semi-Annually (2x/year)' },
    { value: 1, label: 'Annually (1x/year)' }
  ];

  const calculateAPY = (aprVal: number, compVal: number, initial: number, monthly: number, yrs: number) => {
    const r = aprVal / 100;
    const n = compVal;

    // APY Formula: (1 + r/n)^n - 1
    const apy = (Math.pow(1 + r / n, n) - 1) * 100;

    const monthlyRate = apy / 100 / 12;
    const totalMonths = yrs * 12;
    const totalDeposits = initial + (monthly * totalMonths);

    // Future value of initial deposit
    const futureValueInitial = initial * Math.pow(1 + monthlyRate, totalMonths);

    // Future value of monthly deposits (annuity)
    let futureValueMonthly = 0;
    if (monthly > 0 && monthlyRate > 0) {
      futureValueMonthly = monthly * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    } else if (monthly > 0) {
      futureValueMonthly = monthly * totalMonths;
    }

    const finalBalance = futureValueInitial + futureValueMonthly;
    const interestEarned = finalBalance - totalDeposits;

    // Generate yearly breakdown
    const yearlyBreakdown: YearlyData[] = [];
    for (let year = 1; year <= yrs; year++) {
      const months = year * 12;
      const deposits = initial + (monthly * months);
      const fvInitial = initial * Math.pow(1 + monthlyRate, months);
      let fvMonthly = 0;
      if (monthly > 0 && monthlyRate > 0) {
        fvMonthly = monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
      } else if (monthly > 0) {
        fvMonthly = monthly * months;
      }
      const balance = fvInitial + fvMonthly;
      const interest = balance - deposits;

      yearlyBreakdown.push({
        year,
        deposits,
        interest,
        balance
      });
    }

    return {
      apy,
      totalDeposits,
      interestEarned,
      finalBalance,
      apyDifference: apy - aprVal,
      effectiveMonthlyRate: monthlyRate * 100,
      yearlyBreakdown
    };
  };

  useEffect(() => {
    const result = calculateAPY(apr, compounding, initialDeposit, monthlyDeposit, years);
    setResults({
      apy: result.apy,
      totalDeposits: result.totalDeposits,
      interestEarned: result.interestEarned,
      finalBalance: result.finalBalance,
      apyDifference: result.apyDifference,
      effectiveMonthlyRate: result.effectiveMonthlyRate
    });
    setYearlyData(result.yearlyBreakdown);
  }, [apr, compounding, initialDeposit, monthlyDeposit, years]);

  // What-if scenarios
  const scenarios = useMemo(() => {
    const current = calculateAPY(apr, compounding, initialDeposit, monthlyDeposit, years);
    const higherRate = calculateAPY(apr + 1, compounding, initialDeposit, monthlyDeposit, years);
    const dailyCompound = calculateAPY(apr, 365, initialDeposit, monthlyDeposit, years);

    return {
      current: { ...current, apr, compounding },
      higherRate: {
        ...higherRate,
        apr: apr + 1,
        compounding,
        extraInterest: higherRate.interestEarned - current.interestEarned
      },
      dailyCompound: {
        ...dailyCompound,
        apr,
        compounding: 365,
        extraInterest: dailyCompound.interestEarned - current.interestEarned
      }
    };
  }, [apr, compounding, initialDeposit, monthlyDeposit, years]);

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

  // Generate chart points
  const chartPoints = useMemo(() => {
    if (yearlyData.length === 0) return [];

    const maxValue = Math.max(...yearlyData.map(d => d.balance)) * 1.1;
    const points: { x: number; y: number; yDeposits: number; year: number; balance: number; deposits: number; interest: number }[] = [];

    // Start point
    points.push({
      x: chartPadding.left,
      y: chartPadding.top + plotHeight - (initialDeposit / maxValue) * plotHeight,
      yDeposits: chartPadding.top + plotHeight - (initialDeposit / maxValue) * plotHeight,
      year: 0,
      balance: initialDeposit,
      deposits: initialDeposit,
      interest: 0
    });

    yearlyData.forEach((d, i) => {
      const x = chartPadding.left + ((i + 1) / years) * plotWidth;
      const y = chartPadding.top + plotHeight - (d.balance / maxValue) * plotHeight;
      const yDeposits = chartPadding.top + plotHeight - (d.deposits / maxValue) * plotHeight;
      points.push({
        x,
        y,
        yDeposits,
        year: d.year,
        balance: d.balance,
        deposits: d.deposits,
        interest: d.interest
      });
    });

    return points;
  }, [yearlyData, initialDeposit, years]);

  const maxChartValue = yearlyData.length > 0 ? Math.max(...yearlyData.map(d => d.balance)) * 1.1 : initialDeposit * 2;

  // Create paths
  const balancePath = chartPoints.length > 0
    ? `M ${chartPoints.map(p => `${p.x} ${p.y}`).join(' L ')}`
    : '';

  const depositsPath = chartPoints.length > 0
    ? `M ${chartPoints.map(p => `${p.x} ${p.yDeposits}`).join(' L ')}`
    : '';

  const areaPath = chartPoints.length > 0
    ? `M ${chartPoints[0].x} ${chartPadding.top + plotHeight} L ${chartPoints.map(p => `${p.x} ${p.y}`).join(' L ')} L ${chartPoints[chartPoints.length - 1].x} ${chartPadding.top + plotHeight} Z`
    : '';

  const allRelatedCalculators = [
    { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound growth', icon: '📈' },
    { href: '/us/tools/calculators/fd-calculator', title: 'FD Calculator', description: 'Fixed deposit returns', icon: '🏦' },
    { href: '/us/tools/calculators/sip-calculator', title: 'SIP Calculator', description: 'Systematic investment plan', icon: '💹' },
    { href: '/us/tools/calculators/savings-calculator', title: 'Savings Calculator', description: 'Plan your savings', icon: '💰' },
    { href: '/us/tools/calculators/simple-interest-calculator', title: 'Simple Interest', description: 'Calculate simple interest', icon: '💵' },
    { href: '/us/tools/calculators/lumpsum-calculator', title: 'Lumpsum Calculator', description: 'One-time investment', icon: '📊' },
    { href: '/us/tools/calculators/inflation-calculator', title: 'Inflation Calculator', description: 'Adjust for inflation', icon: '📉' },
    { href: '/us/tools/calculators/investment-growth-calculator', title: 'Investment Growth', description: 'Track growth over time', icon: '🌱' }
  ];

  const getCompoundingLabel = (value: number) => {
    const option = compoundingOptions.find(o => o.value === value);
    return option ? option.label.split(' ')[0] : 'Monthly';
  };

  return (
    <div className="max-w-[1200px] mx-auto px-2 xs:px-3 sm:px-4 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-5 sm:mb-6 md:mb-8">
        <h1 className="text-xl xs:text-lg sm:text-xl md:text-2xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">{getH1('APY Calculator')}</h1>
        <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-600 px-1 sm:px-2 leading-relaxed">Calculate Annual Percentage Yield and see how compounding frequency affects your returns</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Calculator Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 sm:gap-5 md:gap-6">
          {/* Left: Input Section */}

      <div className="space-y-3 sm:space-y-4 md:space-y-5">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">Investment Details</h2>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">APR (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={apr}
                    onChange={(e) => setApr(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm sm:text-base touch-manipulation"
                    inputMode="decimal"
                    step="0.1"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">%</span>
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Compounding</label>
                <select
                  value={compounding}
                  onChange={(e) => setCompounding(Number(e.target.value))}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm sm:text-base touch-manipulation bg-white"
                >
                  {compoundingOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Initial Deposit ($)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">$</span>
                  <input
                    type="number"
                    value={initialDeposit}
                    onChange={(e) => setInitialDeposit(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm sm:text-base touch-manipulation"
                    inputMode="numeric"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Monthly Deposit ($)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">$</span>
                  <input
                    type="number"
                    value={monthlyDeposit}
                    onChange={(e) => setMonthlyDeposit(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm sm:text-base touch-manipulation"
                    inputMode="numeric"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Time Period (Years)</label>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm sm:text-base touch-manipulation"
                inputMode="numeric"
              />
            </div>

            <div className="bg-cyan-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 mt-3 sm:mt-4">
              <h3 className="text-xs sm:text-sm font-semibold text-cyan-600 mb-2 sm:mb-3 md:mb-4">Quick Scenarios</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setApr(4.5); setCompounding(12); setInitialDeposit(10000); setMonthlyDeposit(500); }}
                  className="px-2 py-2 bg-white border border-cyan-200 rounded-lg text-xs font-medium text-cyan-700 hover:bg-cyan-100 transition-colors touch-manipulation"
                >
                  High-Yield Savings
                </button>
                <button
                  onClick={() => { setApr(5.25); setCompounding(365); setInitialDeposit(25000); setMonthlyDeposit(0); }}
                  className="px-2 py-2 bg-white border border-cyan-200 rounded-lg text-xs font-medium text-cyan-700 hover:bg-cyan-100 transition-colors touch-manipulation"
                >
                  Online Bank CD
                </button>
                <button
                  onClick={() => { setApr(0.45); setCompounding(12); setInitialDeposit(5000); setMonthlyDeposit(200); }}
                  className="px-2 py-2 bg-white border border-cyan-200 rounded-lg text-xs font-medium text-cyan-700 hover:bg-cyan-100 transition-colors touch-manipulation"
                >
                  Traditional Savings
                </button>
                <button
                  onClick={() => { setApr(4.75); setCompounding(4); setInitialDeposit(50000); setMonthlyDeposit(1000); }}
                  className="px-2 py-2 bg-white border border-cyan-200 rounded-lg text-xs font-medium text-cyan-700 hover:bg-cyan-100 transition-colors touch-manipulation"
                >
                  Money Market
                </button>
              </div>
            </div>
          </div>

          {/* Right: Results Section */}
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">APY Results</h2>

            <div className="bg-cyan-50 border border-cyan-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
              <div className="text-[10px] xs:text-xs sm:text-sm text-cyan-600 mb-0.5 sm:mb-1">Annual Percentage Yield (APY)</div>
              <div className="text-xl xs:text-lg sm:text-xl md:text-2xl md:text-4xl font-bold text-cyan-700">{results.apy.toFixed(3)}%</div>
              <div className="text-[10px] xs:text-xs sm:text-sm text-cyan-600 mt-1">+{results.apyDifference.toFixed(3)}% higher than APR ({apr}%)</div>
            </div>

            <div className="space-y-1.5 sm:space-y-2 md:space-y-3 mb-3 sm:mb-4 md:mb-6">
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Total Deposits:</span>
                <span className="font-semibold text-gray-800">{formatCurrencyFull(results.totalDeposits)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Interest Earned:</span>
                <span className="font-semibold text-green-600">+{formatCurrencyFull(results.interestEarned)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Final Balance:</span>
                <span className="font-semibold text-cyan-600">{formatCurrencyFull(results.finalBalance)}</span>
              </div>
            </div>

            <div className="mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Balance Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] xs:text-xs sm:text-sm">
                  <span className="text-gray-600">Total Deposits</span>
                  <span className="font-medium">{((results.totalDeposits / results.finalBalance) * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full transition-all duration-500" style={{ width: `${(results.totalDeposits / results.finalBalance) * 100}%` }} />
                </div>
                <div className="flex justify-between text-[10px] xs:text-xs sm:text-sm mt-2 sm:mt-3">
                  <span className="text-gray-600">Interest Earned</span>
                  <span className="font-medium">{((results.interestEarned / results.finalBalance) * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: `${(results.interestEarned / results.finalBalance) * 100}%` }} />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Key Metrics</h3>
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-4 text-[10px] xs:text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">APR:</span>
                  <span className="font-medium">{apr}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">APY:</span>
                  <span className="font-medium text-cyan-600">{results.apy.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Compounding:</span>
                  <span className="font-medium">{getCompoundingLabel(compounding)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Growth:</span>
                  <span className="font-medium text-green-600">+{((results.interestEarned / results.totalDeposits) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners */}
      <CalculatorAfterCalcBanners />

      {/* Growth Chart */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Savings Growth Over Time</h2>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-3 xs:gap-4 sm:gap-5 md:gap-6 mb-3 sm:mb-4 md:mb-6">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-600 shadow-sm"></div>
            <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-medium">Total Balance</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 shadow-sm"></div>
            <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-medium">Total Deposits</span>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="relative overflow-x-auto bg-gradient-to-br from-slate-50 to-gray-100 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 -mx-1 sm:mx-0">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto min-w-[320px] sm:min-w-[400px] md:min-w-[500px]"
            style={{ maxHeight: '300px' }}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="apyAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#cffafe" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="apyLineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0891b2" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
              <filter id="apyGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <filter id="apyShadow" x="-10%" y="-10%" width="120%" height="130%">
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
                fill="url(#apyAreaGradient)"
                filter="url(#apyShadow)"
              />
            )}

            {/* Deposits line */}
            {depositsPath && (
              <path
                d={depositsPath}
                fill="none"
                stroke="#9ca3af"
                strokeWidth="2"
                strokeDasharray="6,4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Balance line */}
            {balancePath && (
              <path
                d={balancePath}
                fill="none"
                stroke="url(#apyLineGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#apyGlow)"
              />
            )}

            {/* Data points */}
            {chartPoints.map((point, i) => (
              <g key={i}>
                {/* Glow effect circle - rendered first, behind */}
                {hoveredPoint === i && (
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="14"
                    fill="#06b6d4"
                    opacity="0.15"
                    className="pointer-events-none"
                  />
                )}
                {/* Visible data point */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={hoveredPoint === i ? 8 : 6}
                  fill="white"
                  stroke="#06b6d4"
                  strokeWidth="3"
                  className="pointer-events-none transition-all duration-200"
                  filter="url(#apyGlow)"
                />
                {/* Invisible larger hit area for stable hover */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="18"
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(i)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
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
                stroke="#06b6d4"
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
                  <span className="w-2.5 h-2.5 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full"></span>
                  <span className="text-gray-600">Balance:</span>
                  <span className="font-semibold text-cyan-600 ml-auto">{formatCurrencyFull(chartPoints[hoveredPoint].balance)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-gray-400 rounded-full"></span>
                  <span className="text-gray-600">Deposits:</span>
                  <span className="font-semibold text-gray-600 ml-auto">{formatCurrencyFull(chartPoints[hoveredPoint].deposits)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></span>
                  <span className="text-gray-600">Interest:</span>
                  <span className="font-semibold text-green-600 ml-auto">+{formatCurrencyFull(chartPoints[hoveredPoint].interest)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* What-If Scenarios */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-1.5 sm:mb-2">What-If Scenarios</h2>
        <p className="text-gray-600 text-[10px] xs:text-xs sm:text-sm mb-3 sm:mb-4 md:mb-6">See how rate and compounding frequency affect your APY</p>

        {/* Scenario Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
          <div
            className={`border-2 border-cyan-200 bg-cyan-50 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 xs:col-span-2 sm:col-span-1 transition-transform duration-200 ${hoveredScenario === 'current' ? 'scale-[1.02]' : ''}`}
            onMouseEnter={() => setHoveredScenario('current')}
            onMouseLeave={() => setHoveredScenario(null)}
          >
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Current APY</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-cyan-600 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">Active</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">APR:</span>
                <span className="font-medium">{apr}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Compounding:</span>
                <span className="font-medium">{getCompoundingLabel(compounding)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">APY:</span>
                <span className="font-medium text-cyan-600">{scenarios.current.apy.toFixed(2)}%</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-cyan-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Interest Earned</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-cyan-700">{formatCurrencyFull(scenarios.current.interestEarned)}</div>
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
                <span className="text-gray-600">APR:</span>
                <span className="font-medium text-green-600">{apr + 1}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Compounding:</span>
                <span className="font-medium">{getCompoundingLabel(compounding)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">APY:</span>
                <span className="font-medium text-green-600">{scenarios.higherRate.apy.toFixed(2)}%</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Interest Earned</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-gray-800">{formatCurrencyFull(scenarios.higherRate.interestEarned)}</div>
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-green-600">+{formatCurrencyFull(scenarios.higherRate.extraInterest)} extra</div>
            </div>
          </div>

          <div
            className={`border border-gray-200 bg-white rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 hover:border-purple-300 active:border-purple-400 transition-all duration-200 ${hoveredScenario === 'dailyCompound' ? 'scale-[1.02] border-purple-300' : ''}`}
            onMouseEnter={() => setHoveredScenario('dailyCompound')}
            onMouseLeave={() => setHoveredScenario(null)}
          >
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Daily Compounding</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-purple-500 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">365x</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">APR:</span>
                <span className="font-medium">{apr}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Compounding:</span>
                <span className="font-medium text-purple-600">Daily</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">APY:</span>
                <span className="font-medium text-purple-600">{scenarios.dailyCompound.apy.toFixed(2)}%</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Interest Earned</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-gray-800">{formatCurrencyFull(scenarios.dailyCompound.interestEarned)}</div>
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-green-600">+{formatCurrencyFull(scenarios.dailyCompound.extraInterest)} extra</div>
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
              A 1% higher APR would earn you {formatCurrencyFull(scenarios.higherRate.extraInterest)} more over {years} years.
              Shop around for the best rates from online banks and credit unions.
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="font-semibold text-gray-800 text-[10px] xs:text-xs sm:text-sm md:text-base">Compounding Frequency</span>
            </div>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              Daily compounding would earn {formatCurrencyFull(scenarios.dailyCompound.extraInterest)} more than your current setup.
              More frequent compounding means faster growth.
            </p>
          </div>
        </div>
      </div>

      {/* Year-by-Year Schedule */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-sm xs:text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Year-by-Year Growth Schedule</h2>

        <div className="overflow-x-auto -mx-3 xs:-mx-4 sm:mx-0">
          <table className="w-full text-[10px] xs:text-xs sm:text-sm min-w-[400px] sm:min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Year</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Total Deposits</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Interest Earned</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Balance</th>
              </tr>
            </thead>
            <tbody>
              {(showFullSchedule ? yearlyData : yearlyData.slice(0, 5)).map((row) => (
                <tr key={row.year} className="border-b border-gray-100 hover:bg-gray-50 active:bg-gray-100">
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-gray-800">Year {row.year}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-gray-600">{formatCurrencyFull(row.deposits)}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-green-600">+{formatCurrencyFull(row.interest)}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right font-semibold text-cyan-600">{formatCurrencyFull(row.balance)}</td>
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

      {/* Related Calculators - Moved above SEO and FAQs */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-3 xs:mb-4 sm:mb-6">Related Savings Calculators</h2>
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
          {allRelatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group touch-manipulation">
              <div className="rounded-lg xs:rounded-xl p-2 xs:p-3 sm:p-4 bg-white border border-gray-200 hover:border-cyan-300 active:border-cyan-400 hover:shadow-md active:shadow-lg transition-all h-full">
                <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-cyan-50 rounded-md xs:rounded-lg flex items-center justify-center mb-1.5 xs:mb-2 sm:mb-3 text-base xs:text-lg sm:text-2xl">
                  {calc.icon}
                </div>
                <h3 className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-900 mb-0.5 xs:mb-1 group-hover:text-cyan-600 transition-colors leading-tight">
                  {calc.title}
                </h3>
                <p className="text-[9px] xs:text-[10px] sm:text-xs text-gray-600 leading-tight">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-4 md:p-6 mb-4 xs:mb-4 sm:mb-6 prose prose-gray max-w-none">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">What is APY and Why Does It Matter?</h2>
        <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-3 xs:mb-4 sm:mb-6 leading-relaxed">
          When you're shopping for a savings account, CD, or money market account, you'll see two numbers that look almost identical: APR and APY. Here's the difference that can mean hundreds or thousands of dollars over time. APY (Annual Percentage Yield) shows you the real return on your money, including the magic of compound interest. APR (Annual Percentage Rate) is just the base interest rate without compounding factored in. Banks are required by law to display APY, making it easier for you to compare accounts accurately.
        </p>

        <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-gray-800 mb-2 xs:mb-3">Understanding APY vs APR</h3>
        <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-3 xs:mb-4 sm:mb-6 leading-relaxed">
          Think of APR as the advertised rate and APY as what you actually earn. For example, a savings account with a 5% APR that compounds monthly actually yields 5.12% APY. That 0.12% difference might seem small, but on a $50,000 balance over 10 years, it adds up to over $600 in extra earnings. The more frequently interest compounds, the higher your APY compared to APR.
        </p>

        <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 xs:gap-3 sm:gap-6 mb-4 xs:mb-4 sm:mb-6">
          <div className="bg-cyan-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-cyan-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">APY Advantage</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">APY is always equal to or higher than APR due to compounding</p>
          </div>
          <div className="bg-green-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-green-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Compounding Power</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">More frequent compounding = higher effective returns</p>
          </div>
          <div className="bg-purple-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-purple-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">True Comparison</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Always compare APY when choosing savings accounts</p>
          </div>
        </div>

        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">APY Calculation Formula</h2>
        <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-2 xs:mb-3 sm:mb-4">The APY calculator uses this formula:</p>

        <div className="bg-gray-50 rounded-lg xs:rounded-xl p-3 xs:p-3 sm:p-4 font-mono text-[10px] xs:text-xs sm:text-sm overflow-x-auto mb-4 xs:mb-4 sm:mb-6">
          <p className="mb-2 xs:mb-3 sm:mb-4">APY = (1 + r/n)<sup>n</sup> - 1</p>
          <div className="text-gray-600 space-y-0.5 xs:space-y-1">
            <p>Where:</p>
            <p>APY = Annual Percentage Yield</p>
            <p>r = Annual interest rate (APR as decimal)</p>
            <p>n = Number of compounding periods per year</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-4 sm:gap-6">
          <div>
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Compounding Frequency Impact</h2>
            <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-600">
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-cyan-500 mt-0.5 flex-shrink-0">•</span>
                <span><strong>Daily (365x):</strong> Highest APY, best for savings</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-cyan-500 mt-0.5 flex-shrink-0">•</span>
                <span><strong>Monthly (12x):</strong> Common for savings accounts</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-cyan-500 mt-0.5 flex-shrink-0">•</span>
                <span><strong>Quarterly (4x):</strong> Typical for CDs</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-cyan-500 mt-0.5 flex-shrink-0">•</span>
                <span><strong>Annually (1x):</strong> APY equals APR</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Maximize Your APY</h2>
            <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-600">
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Compare APY across online banks</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Choose accounts with daily compounding</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Consider high-yield savings accounts</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Check for promotional rates on CDs</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Avoid accounts with fees that reduce APY</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span>Make regular deposits to maximize growth</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-4 md:p-6 mb-4 xs:mb-4 sm:mb-6">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-3 xs:mb-4 sm:mb-6">Frequently Asked Questions About APY</h2>

        <div className="space-y-4 xs:space-y-5">
          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-xs xs:text-sm sm:text-base font-semibold text-gray-800 mb-1.5 xs:mb-2">What's a good APY for a savings account in 2024?</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              High-yield savings accounts currently offer APYs between 4.5% and 5.5%, which is significantly better than the national average of around 0.45%. Online banks and credit unions typically offer the best rates since they have lower overhead costs than traditional brick-and-mortar banks. If your savings account is earning less than 4%, it's worth shopping around.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-xs xs:text-sm sm:text-base font-semibold text-gray-800 mb-1.5 xs:mb-2">Does compounding frequency really make a difference?</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              Yes, but the difference is often smaller than people expect. On a 5% APR account with $10,000: annual compounding yields $500 in year one, while daily compounding yields $512.67—a difference of $12.67. However, over 20 years on larger balances, this compounds significantly. Daily compounding is best, but don't stress over monthly vs. daily for smaller amounts.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-xs xs:text-sm sm:text-base font-semibold text-gray-800 mb-1.5 xs:mb-2">Why is my APY higher than the advertised APR?</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              APY factors in compound interest—you earn interest on your interest. When interest compounds more than once per year, your effective annual return (APY) exceeds the stated APR. A 5% APR with monthly compounding becomes 5.12% APY because each month you earn interest on the previous months' interest.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-xs xs:text-sm sm:text-base font-semibold text-gray-800 mb-1.5 xs:mb-2">Are high-yield savings accounts safe?</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              Yes, as long as the bank is FDIC-insured (or NCUA-insured for credit unions). Your deposits are protected up to $250,000 per depositor, per institution. Online banks offering high APYs aren't riskier—they simply have lower costs and pass savings to customers. Always verify FDIC insurance before opening an account.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-xs xs:text-sm sm:text-base font-semibold text-gray-800 mb-1.5 xs:mb-2">Should I choose APY or bonus offers when picking an account?</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              Do the math. A $200 bonus might sound great, but if the account has a 0.5% APY versus a high-yield account at 5%, you'd need to keep less than $4,400 for the bonus to be better value over one year. For larger balances or longer time horizons, a consistently high APY usually wins. Watch out for promotional rates that drop after a few months.
            </p>
          </div>

          <div className="pb-2">
            <h3 className="text-xs xs:text-sm sm:text-base font-semibold text-gray-800 mb-1.5 xs:mb-2">How often should I check and compare APY rates?</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              Review your savings APY quarterly, especially when the Federal Reserve changes interest rates. Banks adjust their rates accordingly, and the highest-paying bank this month might not be next quarter. Set a calendar reminder to compare rates every 3-4 months—moving your money to a better rate takes about 15 minutes and could earn you hundreds more per year.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="apy-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
