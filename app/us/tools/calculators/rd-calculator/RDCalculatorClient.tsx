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
  totalDeposits: number;
  interestEarned: number;
  balance: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Rd Calculator?",
    answer: "A Rd Calculator is a free online tool designed to help you quickly and accurately calculate rd-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Rd Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Rd Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Rd Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function RDCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('rd-calculator');

  const [monthlyDeposit, setMonthlyDeposit] = useState(500);
  const [timePeriod, setTimePeriod] = useState(3);
  const [interestRate, setInterestRate] = useState(5.5);
  const [compoundingFrequency, setCompoundingFrequency] = useState('quarterly');
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  const [results, setResults] = useState({
    maturityAmount: 0,
    totalDeposits: 0,
    totalInterest: 0,
    depositsPercent: 0,
    interestPercent: 0,
    effectiveRate: 0,
    monthlyInterest: 0
  });

  const [yearlyData, setYearlyData] = useState<YearlyData[]>([]);

  const getCompoundingFactor = (frequency: string): number => {
    switch (frequency) {
      case 'monthly': return 12;
      case 'quarterly': return 4;
      case 'half-yearly': return 2;
      case 'yearly': return 1;
      default: return 4;
    }
  };

  const calculateRD = (monthly: number, years: number, rate: number, compounding: string) => {
    const totalMonths = years * 12;
    const r = rate / 100;

    // RD calculation with monthly compound interest
    let balance = 0;
    const yearlyBreakdown: YearlyData[] = [];
    let yearDeposits = 0;

    for (let month = 1; month <= totalMonths; month++) {
      balance += monthly;
      // Apply monthly compound interest
      const monthlyRate = r / 12;
      balance = balance * (1 + monthlyRate);
      yearDeposits += monthly;

      if (month % 12 === 0) {
        const year = month / 12;
        const totalDeposits = year * 12 * monthly;
        const interestEarned = balance - totalDeposits;

        yearlyBreakdown.push({
          year,
          deposits: yearDeposits,
          totalDeposits,
          interestEarned,
          balance
        });

        yearDeposits = 0;
      }
    }

    // Handle partial year if any
    if (totalMonths % 12 !== 0) {
      const year = Math.ceil(totalMonths / 12);
      const totalDeposits = totalMonths * monthly;
      const interestEarned = balance - totalDeposits;

      yearlyBreakdown.push({
        year,
        deposits: yearDeposits,
        totalDeposits,
        interestEarned,
        balance
      });
    }

    const totalDeposits = totalMonths * monthly;
    const totalInterest = balance - totalDeposits;
    const effectiveRate = (totalInterest / totalDeposits) * 100 / years;

    return {
      maturityAmount: balance,
      totalDeposits,
      totalInterest,
      effectiveRate,
      yearlyBreakdown
    };
  };

  useEffect(() => {
    const result = calculateRD(monthlyDeposit, timePeriod, interestRate, compoundingFrequency);
    const depositsPercent = (result.totalDeposits / result.maturityAmount) * 100;
    const interestPercent = (result.totalInterest / result.maturityAmount) * 100;

    setResults({
      maturityAmount: result.maturityAmount,
      totalDeposits: result.totalDeposits,
      totalInterest: result.totalInterest,
      depositsPercent,
      interestPercent,
      effectiveRate: result.effectiveRate,
      monthlyInterest: result.totalInterest / (timePeriod * 12)
    });

    setYearlyData(result.yearlyBreakdown);
  }, [monthlyDeposit, timePeriod, interestRate, compoundingFrequency]);

  // What-if scenarios
  const scenarios = useMemo(() => {
    const current = calculateRD(monthlyDeposit, timePeriod, interestRate, compoundingFrequency);
    const higherDeposit = calculateRD(monthlyDeposit * 1.25, timePeriod, interestRate, compoundingFrequency);
    const longerTerm = calculateRD(monthlyDeposit, timePeriod + 2, interestRate, compoundingFrequency);

    return {
      current: {
        ...current,
        monthly: monthlyDeposit,
        years: timePeriod,
        rate: interestRate
      },
      higher: {
        ...higherDeposit,
        monthly: Math.round(monthlyDeposit * 1.25),
        years: timePeriod,
        rate: interestRate,
        diff: higherDeposit.maturityAmount - current.maturityAmount
      },
      longer: {
        ...longerTerm,
        monthly: monthlyDeposit,
        years: timePeriod + 2,
        rate: interestRate,
        diff: longerTerm.maturityAmount - current.maturityAmount
      }
    };
  }, [monthlyDeposit, timePeriod, interestRate, compoundingFrequency]);

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

  const maxChartValue = yearlyData.length > 0 ? Math.max(...yearlyData.map(d => d.balance)) * 1.15 : 100;
  const scenarioMax = Math.max(scenarios.current.maturityAmount, scenarios.higher.maturityAmount, scenarios.longer.maturityAmount) * 1.1;

  const allRelatedCalculators = [
    { href: '/us/tools/calculators/fd-calculator', title: 'FD Calculator', description: 'Fixed deposit returns', icon: '🏦' },
    { href: '/us/tools/calculators/sip-calculator', title: 'SIP Calculator', description: 'Systematic investment plan', icon: '💰' },
    { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', icon: '💹' },
    { href: '/us/tools/calculators/simple-interest-calculator', title: 'Simple Interest', description: 'Calculate simple interest', icon: '💵' },
    { href: '/us/tools/calculators/savings-goal-calculator', title: 'Savings Goal', description: 'Track savings targets', icon: '🎯' },
    { href: '/us/tools/calculators/cd-calculator', title: 'CD Calculator', description: 'Certificate of deposit', icon: '📜' },
    { href: '/us/tools/calculators/retirement-calculator', title: 'Retirement Calculator', description: 'Plan for retirement', icon: '🏖️' },
    { href: '/us/tools/calculators/inflation-calculator', title: 'Inflation Calculator', description: 'Calculate inflation impact', icon: '📉' }
  ];

  // Chart dimensions
  const chartWidth = 800;
  const chartHeight = 300;
  const chartPadding = { top: 20, right: 30, bottom: 40, left: 70 };
  const plotWidth = chartWidth - chartPadding.left - chartPadding.right;
  const plotHeight = chartHeight - chartPadding.top - chartPadding.bottom;

  // Generate smooth line path
  const generateLinePath = (data: YearlyData[], key: 'totalDeposits' | 'interestEarned' | 'balance') => {
    if (data.length === 0) return '';

    return data.map((d, i) => {
      const x = chartPadding.left + (i / Math.max(data.length - 1, 1)) * plotWidth;
      const y = chartPadding.top + plotHeight - (d[key] / maxChartValue) * plotHeight;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  // Generate area path
  const generateAreaPath = (data: YearlyData[], key: 'totalDeposits' | 'interestEarned' | 'balance') => {
    if (data.length === 0) return '';
    const linePath = generateLinePath(data, key);
    const startX = chartPadding.left;
    const endX = chartPadding.left + (data.length > 1 ? plotWidth : 0);
    const bottomY = chartPadding.top + plotHeight;
    return `${linePath} L ${endX} ${bottomY} L ${startX} ${bottomY} Z`;
  };

  // Get point coordinates
  const getPointCoords = (index: number, key: 'totalDeposits' | 'interestEarned' | 'balance') => {
    if (!yearlyData[index]) return { x: 0, y: 0 };
    const x = chartPadding.left + (index / Math.max(yearlyData.length - 1, 1)) * plotWidth;
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
        <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">{getH1('RD Calculator')}</h1>
        <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-600 px-1 sm:px-2 leading-relaxed">Calculate your Recurring Deposit maturity value with compound interest and see how your savings grow over time</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Calculator Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Left: Input Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-5">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">RD Investment Details</h2>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Monthly Deposit</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">$</span>
                <input
                  type="number"
                  value={monthlyDeposit}
                  onChange={(e) => setMonthlyDeposit(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base touch-manipulation"
                  inputMode="numeric"
                />
              </div>
              <p className="text-[10px] xs:text-xs text-gray-500 mt-1">Amount deposited every month</p>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Time Period (Years)</label>
              <input
                type="number"
                value={timePeriod}
                onChange={(e) => setTimePeriod(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base touch-manipulation"
                inputMode="numeric"
                min="1"
                max="10"
              />
              <p className="text-[10px] xs:text-xs text-gray-500 mt-1">Typical RD tenure: 1-10 years</p>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Interest Rate (% per annum)</label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base touch-manipulation"
                inputMode="decimal"
                step="0.1"
              />
              <p className="text-[10px] xs:text-xs text-gray-500 mt-1">Current rates: 4% - 7% p.a.</p>
            </div>

            <div className="bg-teal-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 mt-3 sm:mt-4">
              <h3 className="text-xs sm:text-sm font-semibold text-teal-700 mb-2 sm:mb-3">Compounding Frequency</h3>
              <select
                value={compoundingFrequency}
                onChange={(e) => setCompoundingFrequency(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base touch-manipulation bg-white"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="half-yearly">Half-Yearly</option>
                <option value="yearly">Yearly</option>
              </select>
              <p className="text-[10px] xs:text-xs text-teal-600 mt-2">Most banks compound quarterly</p>
            </div>

            <button className="w-full bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold py-3 sm:py-3.5 px-2 sm:px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base touch-manipulation">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Calculate Maturity
            </button>
          </div>

          {/* Right: Results Section */}
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">Maturity Analysis</h2>

            <div className="bg-teal-50 border border-teal-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
              <div className="text-[10px] xs:text-xs sm:text-sm text-teal-600 mb-0.5 sm:mb-1">Maturity Amount</div>
              <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-teal-700">{formatCurrencyFull(results.maturityAmount)}</div>
            </div>

            <div className="space-y-1.5 sm:space-y-2 md:space-y-3 mb-3 sm:mb-4 md:mb-6">
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Total Deposits:</span>
                <span className="font-semibold text-blue-600">{formatCurrencyFull(results.totalDeposits)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Interest Earned:</span>
                <span className="font-semibold text-green-600">{formatCurrencyFull(results.totalInterest)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Monthly Deposit:</span>
                <span className="font-semibold text-gray-800">{formatCurrencyFull(monthlyDeposit)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Investment Period:</span>
                <span className="font-semibold text-blue-600">{timePeriod} years ({timePeriod * 12} months)</span>
              </div>
            </div>

            <div className="mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Deposit vs Interest Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] xs:text-xs sm:text-sm">
                  <span className="text-gray-600">Total Deposits</span>
                  <span className="font-medium">{results.depositsPercent.toFixed(1)}%</span>
                </div>
                <div className="h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${results.depositsPercent}%` }} />
                </div>
                <div className="flex justify-between text-[10px] xs:text-xs sm:text-sm mt-2 sm:mt-3">
                  <span className="text-gray-600">Interest Earned</span>
                  <span className="font-medium">{results.interestPercent.toFixed(1)}%</span>
                </div>
                <div className="h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${results.interestPercent}%` }} />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Key Insights</h3>
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-4 text-[10px] xs:text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Interest Rate:</span>
                  <span className="font-medium">{interestRate}% p.a.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Effective Rate:</span>
                  <span className="font-medium">{results.effectiveRate.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Months:</span>
                  <span className="font-medium">{timePeriod * 12}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Monthly Interest:</span>
                  <span className="font-medium">{formatCurrency(results.monthlyInterest)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners */}
      <CalculatorAfterCalcBanners />

      {/* Investment Growth Visualization - Line Chart */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">RD Growth Visualization</h2>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-3 xs:gap-4 sm:gap-6 md:gap-8 mb-3 sm:mb-4 md:mb-6">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 shadow-sm"></div>
            <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-medium">Total Deposits</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-sm"></div>
            <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-medium">Interest Earned</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 shadow-sm"></div>
            <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-medium">Total Balance</span>
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
            {/* Enhanced gradients */}
            <defs>
              <linearGradient id="blueAreaGradientRD" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="greenAreaGradientRD" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#34d399" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#6ee7b7" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="tealAreaGradientRD" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#2dd4bf" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#5eead4" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="blueLineGradientRD" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="greenLineGradientRD" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <linearGradient id="tealLineGradientRD" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0d9488" />
                <stop offset="100%" stopColor="#14b8a6" />
              </linearGradient>
              <filter id="lineShadowRD" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15"/>
              </filter>
              <filter id="pointGlowRD" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="blur"/>
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Background pattern */}
            <rect x={chartPadding.left} y={chartPadding.top} width={plotWidth} height={plotHeight} fill="white" rx="8" opacity="0.7"/>

            {/* Grid lines */}
            {yAxisTicks.map((tick, i) => (
              <g key={i}>
                <line
                  x1={chartPadding.left}
                  y1={tick.y}
                  x2={chartPadding.left + plotWidth}
                  y2={tick.y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray={i === 0 ? "0" : "4,4"}
                />
                <text
                  x={chartPadding.left - 12}
                  y={tick.y + 4}
                  textAnchor="end"
                  className="text-[10px] sm:text-xs fill-gray-500 font-medium"
                >
                  {formatCurrency(tick.value)}
                </text>
              </g>
            ))}

            {/* Y-axis */}
            <line x1={chartPadding.left} y1={chartPadding.top} x2={chartPadding.left} y2={chartPadding.top + plotHeight} stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />

            {/* X-axis */}
            <line x1={chartPadding.left} y1={chartPadding.top + plotHeight} x2={chartPadding.left + plotWidth} y2={chartPadding.top + plotHeight} stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />

            {/* Area fills */}
            <path d={generateAreaPath(yearlyData, 'balance')} fill="url(#tealAreaGradientRD)" />
            <path d={generateAreaPath(yearlyData, 'interestEarned')} fill="url(#greenAreaGradientRD)" />
            <path d={generateAreaPath(yearlyData, 'totalDeposits')} fill="url(#blueAreaGradientRD)" />

            {/* Lines */}
            <path d={generateLinePath(yearlyData, 'balance')} fill="none" stroke="url(#tealLineGradientRD)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" filter="url(#lineShadowRD)" />
            <path d={generateLinePath(yearlyData, 'interestEarned')} fill="none" stroke="url(#greenLineGradientRD)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" filter="url(#lineShadowRD)" />
            <path d={generateLinePath(yearlyData, 'totalDeposits')} fill="none" stroke="url(#blueLineGradientRD)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" filter="url(#lineShadowRD)" />

            {/* Data points */}
            {yearlyData.map((_, i) => {
              const balanceCoords = getPointCoords(i, 'balance');
              const interestCoords = getPointCoords(i, 'interestEarned');
              const depositsCoords = getPointCoords(i, 'totalDeposits');
              const isHovered = hoveredYear === i;

              return (
                <g key={i} filter={isHovered ? "url(#pointGlowRD)" : undefined}>
                  <circle cx={balanceCoords.x} cy={balanceCoords.y} r={isHovered ? 7 : 5} fill="white" stroke="#14b8a6" strokeWidth={isHovered ? 3 : 2} className="transition-all duration-200" />
                  <circle cx={interestCoords.x} cy={interestCoords.y} r={isHovered ? 7 : 5} fill="white" stroke="#10b981" strokeWidth={isHovered ? 3 : 2} className="transition-all duration-200" />
                  <circle cx={depositsCoords.x} cy={depositsCoords.y} r={isHovered ? 7 : 5} fill="white" stroke="#3b82f6" strokeWidth={isHovered ? 3 : 2} className="transition-all duration-200" />
                </g>
              );
            })}

            {/* X-axis labels */}
            {yearlyData.map((d, i) => {
              const x = chartPadding.left + (i / Math.max(yearlyData.length - 1, 1)) * plotWidth;
              return (
                <text key={i} x={x} y={chartPadding.top + plotHeight + 25} textAnchor="middle" className="text-[10px] sm:text-xs fill-gray-500 font-medium">
                  Year {d.year}
                </text>
              );
            })}

            {/* Hover areas */}
            {yearlyData.map((_, i) => {
              const x = chartPadding.left + (i / Math.max(yearlyData.length - 1, 1)) * plotWidth;
              const width = plotWidth / Math.max(yearlyData.length, 1);
              return (
                <rect key={i} x={x - width / 2} y={chartPadding.top} width={width} height={plotHeight} fill="transparent" className="cursor-pointer" onMouseEnter={() => setHoveredYear(i)} onMouseLeave={() => setHoveredYear(null)} />
              );
            })}

            {/* Vertical hover line */}
            {hoveredYear !== null && (
              <line x1={chartPadding.left + (hoveredYear / Math.max(yearlyData.length - 1, 1)) * plotWidth} y1={chartPadding.top} x2={chartPadding.left + (hoveredYear / Math.max(yearlyData.length - 1, 1)) * plotWidth} y2={chartPadding.top + plotHeight} stroke="#14b8a6" strokeWidth="2" strokeDasharray="6,4" opacity="0.6" />
            )}
          </svg>

          {/* Tooltip */}
          {hoveredYear !== null && yearlyData[hoveredYear] && (
            <div className="absolute z-20 bg-white text-gray-800 text-xs rounded-xl px-4 py-3 shadow-2xl pointer-events-none border border-gray-100" style={{ left: `calc(${((hoveredYear) / Math.max(yearlyData.length - 1, 1)) * 85 + 8}%)`, top: '30px', transform: 'translateX(-50%)' }}>
              <div className="font-bold mb-2 text-sm text-gray-900 border-b border-gray-100 pb-2">Year {yearlyData[hoveredYear].year}</div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></span>
                  <span className="text-gray-600">Deposits:</span>
                  <span className="font-semibold text-blue-600 ml-auto">{formatCurrencyFull(yearlyData[hoveredYear].totalDeposits)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"></span>
                  <span className="text-gray-600">Interest:</span>
                  <span className="font-semibold text-emerald-600 ml-auto">{formatCurrencyFull(yearlyData[hoveredYear].interestEarned)}</span>
                </div>
                <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                  <span className="w-2.5 h-2.5 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full"></span>
                  <span className="text-gray-600">Balance:</span>
                  <span className="font-bold text-teal-600 ml-auto">{formatCurrencyFull(yearlyData[hoveredYear].balance)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* What-If Scenarios */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-1.5 sm:mb-2">What-If Scenarios</h2>
        <p className="text-gray-600 text-[10px] xs:text-xs sm:text-sm mb-3 sm:mb-4 md:mb-6">Compare your current RD plan with alternative scenarios to maximize your savings</p>

        {/* Scenario Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
          <div className="border-2 border-teal-200 bg-teal-50 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 xs:col-span-2 sm:col-span-1">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Current Plan</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-teal-600 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">Active</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly:</span>
                <span className="font-medium">{formatCurrencyFull(scenarios.current.monthly)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Period:</span>
                <span className="font-medium">{scenarios.current.years} yrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rate:</span>
                <span className="font-medium">{scenarios.current.rate}%</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-teal-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Maturity Amount</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-teal-700">{formatCurrencyFull(scenarios.current.maturityAmount)}</div>
            </div>
          </div>

          <div className="border border-gray-200 bg-white rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 hover:border-green-300 active:border-green-400 transition-colors">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Higher Deposit</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-green-500 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">+25%</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly:</span>
                <span className="font-medium">{formatCurrencyFull(scenarios.higher.monthly)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Period:</span>
                <span className="font-medium">{scenarios.higher.years} yrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rate:</span>
                <span className="font-medium">{scenarios.higher.rate}%</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Maturity Amount</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-gray-800">{formatCurrencyFull(scenarios.higher.maturityAmount)}</div>
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-green-600">+{formatCurrencyFull(scenarios.higher.diff)} more</div>
            </div>
          </div>

          <div className="border border-gray-200 bg-white rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 hover:border-purple-300 active:border-purple-400 transition-colors">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Longer Term</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-purple-500 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">+2 yrs</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly:</span>
                <span className="font-medium">{formatCurrencyFull(scenarios.longer.monthly)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Period:</span>
                <span className="font-medium">{scenarios.longer.years} yrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rate:</span>
                <span className="font-medium">{scenarios.longer.rate}%</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Maturity Amount</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-gray-800">{formatCurrencyFull(scenarios.longer.maturityAmount)}</div>
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-green-600">+{formatCurrencyFull(scenarios.longer.diff)} more</div>
            </div>
          </div>
        </div>

        {/* Insight Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 xs:gap-3 sm:gap-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="font-semibold text-gray-800 text-[10px] xs:text-xs sm:text-sm md:text-base">Impact of Higher Deposits</span>
            </div>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              Increasing monthly deposit by 25% could result in {formatCurrencyFull(scenarios.higher.diff)} more
              ({((scenarios.higher.diff / scenarios.current.maturityAmount) * 100).toFixed(1)}% increase) at maturity.
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-gray-800 text-[10px] xs:text-xs sm:text-sm md:text-base">Power of Time</span>
            </div>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              Extending RD by 2 years could result in {formatCurrencyFull(scenarios.longer.diff)} more
              ({((scenarios.longer.diff / scenarios.current.maturityAmount) * 100).toFixed(1)}% increase) through compound interest.
            </p>
          </div>
        </div>
      </div>

      {/* Year-by-Year Accumulation Schedule */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-sm xs:text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Year-by-Year Accumulation Schedule</h2>

        <div className="overflow-x-auto -mx-3 xs:-mx-4 sm:mx-0">
          <table className="w-full text-[10px] xs:text-xs sm:text-sm min-w-[400px] sm:min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Year</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Year Deposits</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700 hidden xs:table-cell">Total Deposits</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Interest</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Balance</th>
              </tr>
            </thead>
            <tbody>
              {(showFullSchedule ? yearlyData : yearlyData.slice(0, 5)).map((row) => (
                <tr key={row.year} className="border-b border-gray-100 hover:bg-gray-50 active:bg-gray-100">
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-gray-800">Yr {row.year}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-blue-600">{formatCurrencyFull(row.deposits)}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-gray-600 hidden xs:table-cell">{formatCurrencyFull(row.totalDeposits)}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-green-600">{formatCurrencyFull(row.interestEarned)}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right font-semibold text-gray-800">{formatCurrencyFull(row.balance)}</td>
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
      {/* SEO Content Section */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 xs:mb-3 sm:mb-4 md:mb-6 prose prose-gray max-w-none">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Understanding Recurring Deposits (RD)</h2>
        <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-3 xs:mb-4 sm:mb-4 md:mb-6 leading-relaxed">
          A Recurring Deposit (RD) is a savings scheme that allows you to make regular monthly deposits for a fixed period.
          It combines the benefits of regular savings with the higher interest rates of fixed deposits, making it an ideal
          choice for disciplined savers who want to build a corpus over time.
        </p>

        <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 xs:gap-4 sm:gap-4 md:gap-6 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
          <div className="bg-teal-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-teal-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Fixed Monthly Savings</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Regular deposits build disciplined saving habits</p>
          </div>
          <div className="bg-blue-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-blue-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Compound Interest</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Interest compounds quarterly for better returns</p>
          </div>
          <div className="bg-green-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-green-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Low Risk Investment</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Guaranteed returns with FDIC insurance protection</p>
          </div>
        </div>

        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">RD Maturity Calculation Formula</h2>
        <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-2 xs:mb-3 sm:mb-4">The RD calculator uses compound interest formula:</p>

        <div className="bg-gray-50 rounded-lg xs:rounded-xl p-3 xs:p-3 sm:p-4 font-mono text-[10px] xs:text-xs sm:text-sm overflow-x-auto mb-4 xs:mb-3 sm:mb-4 md:mb-6">
          <p className="mb-2 xs:mb-3 sm:mb-4">M = P x [(1 + r/n)^(nt) - 1] x (1 + r/n) / (r/n)</p>
          <div className="text-gray-600 space-y-0.5 xs:space-y-1">
            <p>Where:</p>
            <p>M = Maturity Amount</p>
            <p>P = Monthly Deposit</p>
            <p>r = Annual Interest Rate</p>
            <p>n = Compounding Frequency (4 for quarterly)</p>
            <p>t = Time Period in Years</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-3 sm:gap-4 md:gap-6">
          <div>
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">How to Use This Calculator</h2>
            <ol className="list-decimal list-inside space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-600">
              <li>Enter your monthly deposit amount</li>
              <li>Select the investment period (1-10 years)</li>
              <li>Enter the annual interest rate</li>
              <li>Choose compounding frequency</li>
              <li>View your maturity amount and interest earned</li>
            </ol>
          </div>

          <div>
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Benefits of RD Investment</h2>
            <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-600">
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                <span>Start with small amounts</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                <span>Fixed interest rates for the entire tenure</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                <span>Flexible tenure options (1-10 years)</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                <span>Loan facility against RD balance</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                <span>Ideal for short to medium-term goals</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                <span>Higher interest than regular savings</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
{/* FAQ Section */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-3 xs:mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4 xs:space-y-5">
          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-xs xs:text-sm sm:text-base font-medium text-gray-800 mb-1.5 xs:mb-2">What is a Recurring Deposit (RD)?</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              A Recurring Deposit is a savings product where you deposit a fixed amount monthly for a predetermined period. At maturity, you receive your total deposits plus accumulated interest. RDs combine the discipline of regular savings with higher interest rates than regular savings accounts, making them ideal for building savings systematically toward specific goals like vacations, down payments, or emergency funds.
            </p>
          </div>
          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-xs xs:text-sm sm:text-base font-medium text-gray-800 mb-1.5 xs:mb-2">How is RD interest calculated?</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              RD interest is typically calculated using compound interest, with quarterly compounding being most common. Each monthly deposit earns interest from its deposit date until maturity, so earlier deposits earn more interest than later ones. The formula accounts for each deposit&apos;s time in the account. A 5-year RD at 6.5% yields roughly 18% in interest on your total deposits.
            </p>
          </div>
          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-xs xs:text-sm sm:text-base font-medium text-gray-800 mb-1.5 xs:mb-2">What is the minimum and maximum tenure for RD?</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              RD tenures typically range from 6 months to 10 years, though this varies by financial institution. Most banks offer flexible tenure options: 6 months, 1 year, 2 years, 3 years, 5 years, and 10 years. Longer tenures generally offer slightly higher interest rates. Choose tenure based on your financial goal timeline—shorter for near-term needs, longer for better returns on distant goals.
            </p>
          </div>
          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-xs xs:text-sm sm:text-base font-medium text-gray-800 mb-1.5 xs:mb-2">Can I withdraw my RD before maturity?</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              Yes, most banks allow premature withdrawal, but with penalties. Typically, you&apos;ll receive 1-2% lower interest rate than the contracted rate, and some banks charge additional penalty fees. If you withdraw before minimum tenure (often 3 months), you may receive only savings account interest. Some banks also allow partial withdrawals or loans against RD balance at competitive rates—a better option than breaking the deposit entirely.
            </p>
          </div>
          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-xs xs:text-sm sm:text-base font-medium text-gray-800 mb-1.5 xs:mb-2">RD vs SIP: Which is better?</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              RD offers guaranteed returns with zero risk—ideal for conservative investors and short-term goals. SIPs (Systematic Investment Plans) in mutual funds offer potentially higher returns but with market risk. For goals 3-5+ years away, SIPs typically outperform RDs. For goals under 3 years or when capital preservation is crucial, RDs are safer. Many financial advisors suggest combining both: RDs for short-term needs and emergency funds, SIPs for long-term wealth creation.
            </p>
          </div>
          <div>
            <h3 className="text-xs xs:text-sm sm:text-base font-medium text-gray-800 mb-1.5 xs:mb-2">Is RD interest taxable?</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              Yes, RD interest is fully taxable as &quot;Income from Other Sources&quot; at your applicable tax slab rate. Banks deduct TDS (Tax Deducted at Source) if total interest exceeds the threshold. You can claim credit for TDS when filing returns. Unlike tax-saving FDs, regular RDs don&apos;t qualify for Section 80C deductions. Consider the after-tax return when comparing RDs with tax-advantaged options—a 6.5% RD yields only 4.55% after 30% tax.
            </p>
          </div>
        </div>
      </div>

{/* Related Finance Calculators */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8">
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

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="rd-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
