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
  principalPaid: number;
  interestPaid: number;
  totalPaid: number;
  balance: number;
}

interface MonthlyData {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Emi Calculator?",
    answer: "A Emi Calculator is a free online tool designed to help you quickly and accurately calculate emi-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Emi Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Emi Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Emi Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function EMICalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('emi-calculator');

  const [principal, setPrincipal] = useState(250000);
  const [rate, setRate] = useState(7.5);
  const [tenure, setTenure] = useState(20);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);
  const [hoveredScenario, setHoveredScenario] = useState<string | null>(null);

  const [results, setResults] = useState({
    emi: 0,
    totalAmount: 0,
    totalInterest: 0,
    principalPercent: 0,
    interestPercent: 0,
    totalMonths: 0,
    effectiveRate: 0,
    interestMultiple: 0
  });

  const [yearlyData, setYearlyData] = useState<YearlyData[]>([]);

  const calculateEMI = (p: number, r: number, t: number) => {
    const monthlyRate = r / 12 / 100;
    const months = t * 12;

    // EMI Formula: P × r × (1 + r)^n / ((1 + r)^n - 1)
    const emiAmount = p * monthlyRate *
      Math.pow(1 + monthlyRate, months) /
      (Math.pow(1 + monthlyRate, months) - 1);

    const total = emiAmount * months;
    const interest = total - p;

    // Generate yearly breakdown
    const yearlyBreakdown: YearlyData[] = [];
    let balance = p;
    let totalPrincipalPaid = 0;
    let totalInterestPaid = 0;

    for (let year = 1; year <= t; year++) {
      let yearPrincipal = 0;
      let yearInterest = 0;

      for (let month = 1; month <= 12; month++) {
        const monthInterest = balance * monthlyRate;
        const monthPrincipal = emiAmount - monthInterest;
        balance = Math.max(0, balance - monthPrincipal);
        yearPrincipal += monthPrincipal;
        yearInterest += monthInterest;
      }

      totalPrincipalPaid += yearPrincipal;
      totalInterestPaid += yearInterest;

      yearlyBreakdown.push({
        year,
        principalPaid: yearPrincipal,
        interestPaid: yearInterest,
        totalPaid: totalPrincipalPaid + totalInterestPaid,
        balance: Math.max(0, balance)
      });
    }

    return {
      emi: emiAmount,
      total,
      interest,
      yearlyBreakdown
    };
  };

  useEffect(() => {
    const result = calculateEMI(principal, rate, tenure);
    const principalPercent = (principal / result.total) * 100;
    const interestPercent = (result.interest / result.total) * 100;

    setResults({
      emi: result.emi,
      totalAmount: result.total,
      totalInterest: result.interest,
      principalPercent,
      interestPercent,
      totalMonths: tenure * 12,
      effectiveRate: rate,
      interestMultiple: result.interest / principal
    });

    setYearlyData(result.yearlyBreakdown);
  }, [principal, rate, tenure]);

  // What-if scenarios
  const scenarios = useMemo(() => {
    const current = calculateEMI(principal, rate, tenure);
    const lowerRate = calculateEMI(principal, Math.max(1, rate - 1), tenure);
    const shorterTenure = calculateEMI(principal, rate, Math.max(5, tenure - 5));

    return {
      current: { ...current, rate, tenure, principal },
      lowerRate: {
        ...lowerRate,
        rate: Math.max(1, rate - 1),
        tenure,
        principal,
        savings: current.interest - lowerRate.interest
      },
      shorter: {
        ...shorterTenure,
        rate,
        tenure: Math.max(5, tenure - 5),
        principal,
        savings: current.interest - shorterTenure.interest
      }
    };
  }, [principal, rate, tenure]);

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

  const maxChartValue = yearlyData.length > 0 ? principal * 1.1 : 100;
  const scenarioMax = Math.max(scenarios.current.total, scenarios.lowerRate.total, scenarios.shorter.total) * 1.1;

  const allRelatedCalculators = [
    { href: '/us/tools/calculators/loan-calculator', title: 'Loan Calculator', description: 'Calculate any loan payment', icon: '💰' },
    { href: '/us/tools/calculators/mortgage-calculator-advanced', title: 'Mortgage Calculator', description: 'Calculate mortgage payments', icon: '🏠' },
    { href: '/us/tools/calculators/home-loan-calculator', title: 'Home Loan Calculator', description: 'Plan your home purchase', icon: '🏡' },
    { href: '/us/tools/calculators/car-loan-calculator', title: 'Car Loan Calculator', description: 'Auto financing calculator', icon: '🚗' },
    { href: '/us/tools/calculators/personal-loan-calculator', title: 'Personal Loan', description: 'Personal loan EMI', icon: '👤' },
    { href: '/us/tools/calculators/loan-comparison-calculator', title: 'Loan Comparison', description: 'Compare loan offers', icon: '📊' },
    { href: '/us/tools/calculators/loan-balance-calculator', title: 'Loan Balance', description: 'Check remaining balance', icon: '💳' },
    { href: '/us/tools/calculators/prepayment-calculator', title: 'Prepayment Calculator', description: 'Plan loan prepayments', icon: '📉' }
  ];

  // Chart dimensions
  const chartWidth = 800;
  const chartHeight = 300;
  const chartPadding = { top: 20, right: 30, bottom: 40, left: 70 };
  const plotWidth = chartWidth - chartPadding.left - chartPadding.right;
  const plotHeight = chartHeight - chartPadding.top - chartPadding.bottom;

  // Generate bar chart data
  const getBarHeight = (value: number) => (value / maxChartValue) * plotHeight;
  const barWidth = yearlyData.length > 0 ? Math.min(40, (plotWidth / yearlyData.length) * 0.7) : 40;
  const barGap = yearlyData.length > 0 ? (plotWidth - barWidth * yearlyData.length) / (yearlyData.length + 1) : 0;

  return (
    <div className="max-w-[1200px] mx-auto px-2 xs:px-3 sm:px-4 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-5 sm:mb-6 md:mb-8">
        <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">{getH1('EMI Calculator')}</h1>
        <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-600 px-1 sm:px-2 leading-relaxed">Calculate your Equated Monthly Installment and plan your loan repayment effectively</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Calculator Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Left: Input Section */}

      <div className="space-y-3 sm:space-y-4 md:space-y-5">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">Loan Details</h2>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Loan Amount (Principal)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">$</span>
                <input
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base touch-manipulation"
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
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base touch-manipulation"
                  inputMode="decimal"
                  step="0.1"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">%</span>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Loan Tenure (Years)</label>
              <input
                type="number"
                value={tenure}
                onChange={(e) => setTenure(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base touch-manipulation"
                inputMode="numeric"
              />
            </div>

            <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 mt-3 sm:mt-4">
              <h3 className="text-xs sm:text-sm font-semibold text-blue-600 mb-2 sm:mb-3 md:mb-4">Quick Loan Presets</h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => { setPrincipal(250000); setRate(7.5); setTenure(30); }}
                  className="px-2 py-2 bg-white border border-blue-200 rounded-lg text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  Home Loan
                </button>
                <button
                  onClick={() => { setPrincipal(35000); setRate(6.5); setTenure(5); }}
                  className="px-2 py-2 bg-white border border-blue-200 rounded-lg text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  Car Loan
                </button>
                <button
                  onClick={() => { setPrincipal(15000); setRate(10); setTenure(3); }}
                  className="px-2 py-2 bg-white border border-blue-200 rounded-lg text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  Personal
                </button>
              </div>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 sm:py-3.5 px-2 sm:px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base touch-manipulation">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Calculate EMI
            </button>
          </div>

          {/* Right: Results Section */}
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">EMI Breakdown</h2>

            <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
              <div className="text-[10px] xs:text-xs sm:text-sm text-blue-600 mb-0.5 sm:mb-1">Monthly EMI</div>
              <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-blue-700">{formatCurrencyFull(results.emi)}</div>
              <div className="text-[10px] xs:text-xs sm:text-sm text-blue-600 mt-1">Pay this amount every month</div>
            </div>

            <div className="space-y-1.5 sm:space-y-2 md:space-y-3 mb-3 sm:mb-4 md:mb-6">
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Principal Amount:</span>
                <span className="font-semibold text-gray-800">{formatCurrencyFull(principal)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Total Interest:</span>
                <span className="font-semibold text-orange-600">{formatCurrencyFull(results.totalInterest)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Total Amount Payable:</span>
                <span className="font-semibold text-green-600">{formatCurrencyFull(results.totalAmount)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Loan Duration:</span>
                <span className="font-semibold text-blue-600">{tenure} years ({results.totalMonths} months)</span>
              </div>
            </div>

            <div className="mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Payment Distribution</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] xs:text-xs sm:text-sm">
                  <span className="text-gray-600">Principal Amount</span>
                  <span className="font-medium">{results.principalPercent.toFixed(1)}%</span>
                </div>
                <div className="h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${results.principalPercent}%` }} />
                </div>
                <div className="flex justify-between text-[10px] xs:text-xs sm:text-sm mt-2 sm:mt-3">
                  <span className="text-gray-600">Interest Amount</span>
                  <span className="font-medium">{results.interestPercent.toFixed(1)}%</span>
                </div>
                <div className="h-2 sm:h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full transition-all duration-500" style={{ width: `${results.interestPercent}%` }} />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Key Insights</h3>
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-4 text-[10px] xs:text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total months:</span>
                  <span className="font-medium">{results.totalMonths}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Interest rate:</span>
                  <span className="font-medium">{rate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Interest ratio:</span>
                  <span className="font-medium">{(results.interestMultiple * 100).toFixed(0)}% of principal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cost per $1K:</span>
                  <span className="font-medium">${((results.totalInterest / principal) * 1000).toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners */}
      <CalculatorAfterCalcBanners />

      {/* Loan Balance Visualization */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Loan Balance Over Time</h2>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-3 xs:gap-4 sm:gap-6 md:gap-8 mb-3 sm:mb-4 md:mb-6">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 shadow-sm"></div>
            <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-medium">Remaining Balance</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-sm"></div>
            <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-medium">Principal Paid</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 shadow-sm"></div>
            <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-medium">Interest Paid</span>
          </div>
        </div>

        {/* Stacked Bar Chart */}
        <div className="relative overflow-x-auto bg-gradient-to-br from-slate-50 to-gray-100 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 -mx-1 sm:mx-0">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto min-w-[320px] sm:min-w-[400px] md:min-w-[500px]"
            style={{ maxHeight: '300px' }}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="blueBarGradientEMI" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#1d4ed8" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#60a5fa" />
              </linearGradient>
              <linearGradient id="greenBarGradientEMI" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#047857" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
              <linearGradient id="orangeBarGradientEMI" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#c2410c" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#fb923c" />
              </linearGradient>
              <filter id="barShadowEMI" x="-10%" y="-10%" width="120%" height="130%">
                <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.15"/>
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

            {/* Stacked Bars */}
            {yearlyData.map((d, i) => {
              const x = chartPadding.left + barGap + i * (barWidth + barGap);
              const balanceHeight = getBarHeight(d.balance);
              const principalHeight = getBarHeight(principal - d.balance);
              const isHovered = hoveredYear === i;

              return (
                <g
                  key={i}
                  filter="url(#barShadowEMI)"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredYear(i)}
                  onMouseLeave={() => setHoveredYear(null)}
                  style={{ transform: isHovered ? 'scale(1.02)' : 'scale(1)', transformOrigin: `${x + barWidth/2}px ${chartPadding.top + plotHeight}px` }}
                >
                  {/* Remaining Balance */}
                  <rect
                    x={x}
                    y={chartPadding.top + plotHeight - balanceHeight}
                    width={barWidth}
                    height={balanceHeight}
                    fill="url(#blueBarGradientEMI)"
                    rx="2"
                    className="transition-all duration-200"
                  />
                  {/* Principal Paid (stacked on top) */}
                  <rect
                    x={x}
                    y={chartPadding.top + plotHeight - balanceHeight - principalHeight}
                    width={barWidth}
                    height={principalHeight}
                    fill="url(#greenBarGradientEMI)"
                    rx="2"
                    className="transition-all duration-200"
                  />
                </g>
              );
            })}

            {/* X-axis labels */}
            {yearlyData.map((d, i) => {
              const x = chartPadding.left + barGap + i * (barWidth + barGap) + barWidth / 2;
              const showLabel = yearlyData.length <= 15 || i % Math.ceil(yearlyData.length / 10) === 0 || i === yearlyData.length - 1;
              return showLabel ? (
                <text
                  key={i}
                  x={x}
                  y={chartPadding.top + plotHeight + 25}
                  textAnchor="middle"
                  className="text-[10px] sm:text-xs fill-gray-500 font-medium"
                >
                  Yr {d.year}
                </text>
              ) : null;
            })}

            {/* Hover tooltip indicator */}
            {hoveredYear !== null && yearlyData[hoveredYear] && (
              <line
                x1={chartPadding.left + barGap + hoveredYear * (barWidth + barGap) + barWidth / 2}
                y1={chartPadding.top}
                x2={chartPadding.left + barGap + hoveredYear * (barWidth + barGap) + barWidth / 2}
                y2={chartPadding.top + plotHeight}
                stroke="#6366f1"
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
                  <span className="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></span>
                  <span className="text-gray-600">Balance:</span>
                  <span className="font-semibold text-blue-600 ml-auto">{formatCurrencyFull(yearlyData[hoveredYear].balance)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"></span>
                  <span className="text-gray-600">Principal Paid:</span>
                  <span className="font-semibold text-emerald-600 ml-auto">{formatCurrencyFull(principal - yearlyData[hoveredYear].balance)}</span>
                </div>
                <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
                  <span className="w-2.5 h-2.5 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"></span>
                  <span className="text-gray-600">Interest Paid:</span>
                  <span className="font-semibold text-orange-600 ml-auto">{formatCurrencyFull(yearlyData[hoveredYear].totalPaid - (principal - yearlyData[hoveredYear].balance))}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* What-If Scenarios */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-1.5 sm:mb-2">What-If Scenarios</h2>
        <p className="text-gray-600 text-[10px] xs:text-xs sm:text-sm mb-3 sm:mb-4 md:mb-6">See how changing loan terms affects your total interest payment</p>

        {/* Scenario Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
          <div className="border-2 border-blue-200 bg-blue-50 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 xs:col-span-2 sm:col-span-1">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Current Loan</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-blue-600 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">Active</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Rate:</span>
                <span className="font-medium">{scenarios.current.rate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tenure:</span>
                <span className="font-medium">{scenarios.current.tenure} yrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">EMI:</span>
                <span className="font-medium">{formatCurrencyFull(scenarios.current.emi)}</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-blue-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Total Interest</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-blue-700">{formatCurrencyFull(scenarios.current.interest)}</div>
            </div>
          </div>

          <div className="border border-gray-200 bg-white rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 hover:border-green-300 active:border-green-400 transition-colors">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Lower Rate</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-green-500 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">-1%</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Rate:</span>
                <span className="font-medium">{scenarios.lowerRate.rate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tenure:</span>
                <span className="font-medium">{scenarios.lowerRate.tenure} yrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">EMI:</span>
                <span className="font-medium">{formatCurrencyFull(scenarios.lowerRate.emi)}</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Total Interest</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-gray-800">{formatCurrencyFull(scenarios.lowerRate.interest)}</div>
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-green-600">Save {formatCurrencyFull(scenarios.lowerRate.savings)}</div>
            </div>
          </div>

          <div className="border border-gray-200 bg-white rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 hover:border-purple-300 active:border-purple-400 transition-colors">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Shorter Tenure</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-purple-500 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">-5 yrs</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Rate:</span>
                <span className="font-medium">{scenarios.shorter.rate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tenure:</span>
                <span className="font-medium">{scenarios.shorter.tenure} yrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">EMI:</span>
                <span className="font-medium">{formatCurrencyFull(scenarios.shorter.emi)}</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-gray-500">Total Interest</div>
              <div className="text-base xs:text-lg sm:text-2xl font-bold text-gray-800">{formatCurrencyFull(scenarios.shorter.interest)}</div>
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-green-600">Save {formatCurrencyFull(scenarios.shorter.savings)}</div>
            </div>
          </div>
        </div>

        {/* Insight Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 xs:gap-3 sm:gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-gray-800 text-[10px] xs:text-xs sm:text-sm md:text-base">Lower Interest Rate Impact</span>
            </div>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              Negotiating a 1% lower interest rate could save you {formatCurrencyFull(scenarios.lowerRate.savings)} over the loan tenure.
              Consider refinancing if rates drop significantly.
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-gray-800 text-[10px] xs:text-xs sm:text-sm md:text-base">Shorter Tenure Benefits</span>
            </div>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              Reducing tenure by 5 years increases EMI to {formatCurrencyFull(scenarios.shorter.emi)} but saves {formatCurrencyFull(scenarios.shorter.savings)} in interest.
              Higher EMI means faster debt freedom.
            </p>
          </div>
        </div>
      </div>

      {/* Year-by-Year Amortization Schedule */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-sm xs:text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Year-by-Year Amortization Schedule</h2>

        <div className="overflow-x-auto -mx-3 xs:-mx-4 sm:mx-0">
          <table className="w-full text-[10px] xs:text-xs sm:text-sm min-w-[400px] sm:min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Year</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Principal</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Interest</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700 hidden xs:table-cell">Total Paid</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Balance</th>
              </tr>
            </thead>
            <tbody>
              {(showFullSchedule ? yearlyData : yearlyData.slice(0, 5)).map((row) => (
                <tr key={row.year} className="border-b border-gray-100 hover:bg-gray-50 active:bg-gray-100">
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-gray-800">Yr {row.year}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-green-600">{formatCurrencyFull(row.principalPaid)}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-orange-600">{formatCurrencyFull(row.interestPaid)}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-gray-600 hidden xs:table-cell">{formatCurrencyFull(row.totalPaid)}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right font-semibold text-blue-600">{formatCurrencyFull(row.balance)}</td>
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
      {/* Related Loan Calculators */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-3 xs:mb-4 sm:mb-4 md:mb-6">Related Loan Calculators</h2>
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
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Understanding EMI (Equated Monthly Installment)</h2>
        <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-3 xs:mb-4 sm:mb-4 md:mb-6 leading-relaxed">
          EMI (Equated Monthly Installment) is a fixed payment amount made by a borrower to a lender at a specified date each month.
          EMIs are used to pay off both interest and principal each month, so that over a specified number of years, the loan is paid off in full.
        </p>

        <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 xs:gap-4 sm:gap-4 md:gap-6 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
          <div className="bg-blue-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-blue-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Principal Component</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Portion of EMI that goes towards repaying the actual loan amount</p>
          </div>
          <div className="bg-orange-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-orange-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Interest Component</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Cost of borrowing, calculated on outstanding balance</p>
          </div>
          <div className="bg-green-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-green-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Fixed Payment</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">EMI remains constant throughout the loan tenure</p>
          </div>
        </div>

        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">EMI Calculation Formula</h2>
        <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-2 xs:mb-3 sm:mb-4">The EMI calculator uses the following standard formula:</p>

        <div className="bg-gray-50 rounded-lg xs:rounded-xl p-3 xs:p-3 sm:p-4 font-mono text-[10px] xs:text-xs sm:text-sm overflow-x-auto mb-4 xs:mb-3 sm:mb-4 md:mb-6">
          <p className="mb-2 xs:mb-3 sm:mb-4">EMI = P × r × (1 + r)<sup>n</sup> / ((1 + r)<sup>n</sup> - 1)</p>
          <div className="text-gray-600 space-y-0.5 xs:space-y-1">
            <p>Where:</p>
            <p>P = Principal Loan Amount</p>
            <p>r = Monthly Interest Rate (Annual Rate / 12 / 100)</p>
            <p>n = Total Number of Monthly Installments</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-3 sm:gap-4 md:gap-6">
          <div>
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">How to Use This Calculator</h2>
            <ol className="list-decimal list-inside space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-600">
              <li>Enter the loan principal amount</li>
              <li>Input the annual interest rate</li>
              <li>Specify the loan tenure in years</li>
              <li>View your EMI and total payment breakdown</li>
            </ol>
          </div>

          <div>
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Tips for Managing EMI</h2>
            <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-600">
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                <span>Keep EMI below 40-50% of monthly income</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                <span>Make prepayments when possible</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                <span>Compare rates from multiple lenders</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                <span>Consider refinancing if rates drop</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                <span>Balance tenure with total interest cost</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                <span>Maintain emergency fund alongside EMI payments</span>
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
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">What exactly is EMI and how is it calculated?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              EMI (Equated Monthly Installment) is a fixed payment amount you make each month to repay a loan. Each EMI contains two
              components: principal repayment and interest. Early in the loan, most of your EMI goes toward interest, with principal
              repayment increasing over time. The EMI formula ensures you pay off both principal and all interest by the end of the
              loan term through equal monthly payments, making budgeting easier.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">How does loan tenure affect my EMI and total interest?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              Longer loan tenures result in lower monthly EMIs but significantly higher total interest paid. For example, a $200,000
              loan at 7% costs $1,331/month over 30 years (total interest: $279,017) versus $1,798/month over 15 years (total interest:
              $123,577). The shorter tenure saves over $155,000 in interest but requires a higher monthly budget. Choose a tenure that
              balances comfortable monthly payments with minimizing total interest costs.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">Can I reduce my EMI or pay off my loan faster?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              Yes, several strategies can help: (1) Make prepayments when you have extra funds - even small amounts reduce principal
              and future interest. (2) Refinance to a lower interest rate if rates have dropped. (3) Switch to bi-weekly payments
              (26 half-payments per year equals 13 full payments). (4) Round up your payments. (5) Apply windfalls like bonuses or
              tax refunds to principal. Check for prepayment penalties before making extra payments.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">What is the ideal EMI-to-income ratio?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              Financial experts recommend keeping total loan EMIs below 40-50% of your monthly take-home income. Lenders typically
              use a Debt-to-Income (DTI) ratio of 36-43% as a qualification threshold. For example, if you earn $6,000/month, your
              total EMIs (including the new loan) should ideally not exceed $2,400-$3,000. Keeping EMIs lower leaves room for savings,
              emergencies, and maintaining quality of life without being &quot;house poor&quot; or &quot;loan poor.&quot;
            </p>
          </div>

          <div>
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">What&apos;s the difference between fixed and floating rate EMIs?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              Fixed rate loans have the same interest rate and EMI throughout the loan term, providing payment predictability but
              often starting slightly higher. Floating/variable rate loans have interest rates that change with market conditions,
              potentially resulting in lower initial rates but payment uncertainty. In a falling rate environment, floating rates
              benefit you automatically, while fixed rates require refinancing. Choose based on your risk tolerance and interest
              rate outlook.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="emi-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
