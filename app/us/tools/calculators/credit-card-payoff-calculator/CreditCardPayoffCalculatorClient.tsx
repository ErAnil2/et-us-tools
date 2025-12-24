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

interface PayoffMonth {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Credit Card Payoff Calculator?",
    answer: "A Credit Card Payoff Calculator is a free online tool designed to help you quickly and accurately calculate credit card payoff-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Credit Card Payoff Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Credit Card Payoff Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Credit Card Payoff Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function CreditCardPayoffCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('credit-card-payoff-calculator');

  const [balance, setBalance] = useState(5000);
  const [interestRate, setInterestRate] = useState(18.99);
  const [monthlyPayment, setMonthlyPayment] = useState(200);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  const [results, setResults] = useState({
    monthsToPayoff: 0,
    totalInterest: 0,
    totalPaid: 0,
    payoffDate: '',
    minPayment: 0,
    interestPercent: 0
  });

  const [payoffSchedule, setPayoffSchedule] = useState<PayoffMonth[]>([]);

  const calculatePayoff = (bal: number, apr: number, payment: number) => {
    if (bal <= 0 || payment <= 0) return { months: 0, interest: 0, schedule: [] };

    const monthlyRate = apr / 100 / 12;
    const minPayment = Math.max(25, bal * 0.01 + bal * monthlyRate);

    if (payment < minPayment * 0.9) {
      return { months: 999, interest: 999999, schedule: [], minPayment };
    }

    let remainingBalance = bal;
    let totalInterest = 0;
    let months = 0;
    const schedule: PayoffMonth[] = [];

    while (remainingBalance > 0 && months < 600) {
      const interestCharge = remainingBalance * monthlyRate;
      totalInterest += interestCharge;
      const principalPaid = Math.min(payment - interestCharge, remainingBalance);
      remainingBalance = Math.max(0, remainingBalance - principalPaid);
      months++;

      schedule.push({
        month: months,
        payment: principalPaid + interestCharge,
        principal: principalPaid,
        interest: interestCharge,
        balance: remainingBalance
      });

      if (remainingBalance < 0.01) remainingBalance = 0;
    }

    return { months, interest: totalInterest, schedule, minPayment };
  };

  useEffect(() => {
    const result = calculatePayoff(balance, interestRate, monthlyPayment);

    const payoffDate = new Date();
    payoffDate.setMonth(payoffDate.getMonth() + result.months);

    setResults({
      monthsToPayoff: result.months,
      totalInterest: result.interest,
      totalPaid: balance + result.interest,
      payoffDate: payoffDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      minPayment: result.minPayment || 0,
      interestPercent: balance > 0 ? (result.interest / (balance + result.interest)) * 100 : 0
    });

    setPayoffSchedule(result.schedule);
  }, [balance, interestRate, monthlyPayment]);

  // What-if scenarios
  const scenarios = useMemo(() => {
    const current = calculatePayoff(balance, interestRate, monthlyPayment);
    const extraPayment = calculatePayoff(balance, interestRate, monthlyPayment + 100);
    const doublePayment = calculatePayoff(balance, interestRate, monthlyPayment * 2);

    return {
      current: { ...current, payment: monthlyPayment },
      extra: {
        ...extraPayment,
        payment: monthlyPayment + 100,
        savings: current.interest - extraPayment.interest,
        monthsSaved: current.months - extraPayment.months
      },
      double: {
        ...doublePayment,
        payment: monthlyPayment * 2,
        savings: current.interest - doublePayment.interest,
        monthsSaved: current.months - doublePayment.months
      }
    };
  }, [balance, interestRate, monthlyPayment]);

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
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Donut chart calculations
  const principalPercent = balance > 0 ? (balance / results.totalPaid) * 100 : 0;
  const interestPercent = results.interestPercent;

  const segments = [
    { id: 'principal', label: 'Principal', value: balance, percent: principalPercent, color: '#3B82F6' },
    { id: 'interest', label: 'Interest', value: results.totalInterest, percent: interestPercent, color: '#EF4444' },
  ];

  const radius = 70;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;

  const allRelatedCalculators = [
    { href: '/us/tools/calculators/debt-payoff-calculator', title: 'Debt Payoff', description: 'Pay off multiple debts', icon: '💳' },
    { href: '/us/tools/calculators/loan-calculator', title: 'Loan Calculator', description: 'Calculate loan payments', icon: '💰' },
    { href: '/us/tools/calculators/interest-calculator', title: 'Interest Calculator', description: 'Calculate interest costs', icon: '📊' },
    { href: '/us/tools/calculators/savings-goal-calculator', title: 'Savings Goal', description: 'Plan your savings', icon: '🎯' },
    { href: '/us/tools/calculators/budget-calculator', title: 'Budget Calculator', description: 'Plan your budget', icon: '📋' },
    { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Grow your savings', icon: '📈' },
    { href: '/us/tools/calculators/personal-loan-calculator', title: 'Personal Loan', description: 'Personal loan EMI', icon: '👤' },
    { href: '/us/tools/calculators/emergency-fund-calculator', title: 'Emergency Fund', description: 'Build safety net', icon: '🛡️' }
  ];

  // Chart dimensions for line chart
  const chartWidth = 800;
  const chartHeight = 300;
  const chartPadding = { top: 30, right: 30, bottom: 50, left: 80 };
  const plotWidth = chartWidth - chartPadding.left - chartPadding.right;
  const plotHeight = chartHeight - chartPadding.top - chartPadding.bottom;

  // Generate chart points
  const chartPoints = useMemo(() => {
    if (payoffSchedule.length === 0) return [];

    const maxBalance = balance * 1.1;
    return payoffSchedule.map((d, i) => ({
      x: chartPadding.left + (i / (payoffSchedule.length - 1 || 1)) * plotWidth,
      y: chartPadding.top + plotHeight - (d.balance / maxBalance) * plotHeight,
      month: d.month,
      balance: d.balance,
      interest: d.interest,
      principal: d.principal
    }));
  }, [payoffSchedule, balance]);

  const maxChartBalance = balance * 1.1;

  const linePath = chartPoints.length > 0
    ? `M ${chartPoints.map(p => `${p.x} ${p.y}`).join(' L ')}`
    : '';

  const areaPath = chartPoints.length > 0
    ? `M ${chartPoints[0].x} ${chartPadding.top + plotHeight} L ${chartPoints.map(p => `${p.x} ${p.y}`).join(' L ')} L ${chartPoints[chartPoints.length - 1].x} ${chartPadding.top + plotHeight} Z`
    : '';

  return (
    <div className="max-w-[1200px] mx-auto px-2 xs:px-3 sm:px-4 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-5 sm:mb-6 md:mb-8">
        <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">{getH1('Credit Card Payoff Calculator')}</h1>
        <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-600 px-1 sm:px-2 leading-relaxed">Calculate how long to pay off your credit card debt and how much interest you'll pay</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Calculator Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Left: Input Section */}

      <div className="space-y-3 sm:space-y-4 md:space-y-5">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">Credit Card Details</h2>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Current Balance</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">$</span>
                <input
                  type="number"
                  value={balance}
                  onChange={(e) => setBalance(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base touch-manipulation"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Interest Rate (APR): {interestRate}%</label>
              <input
                type="range"
                min="0"
                max="30"
                step="0.01"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                className="w-full h-2 sm:h-2.5 bg-red-200 rounded-lg appearance-none cursor-pointer touch-manipulation"
              />
              <div className="flex justify-between text-[10px] xs:text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>30%</span>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Monthly Payment: {formatCurrency(monthlyPayment)}</label>
              <input
                type="range"
                min={Math.max(25, balance * 0.01)}
                max={Math.max(balance, 100)}
                step="10"
                value={monthlyPayment}
                onChange={(e) => setMonthlyPayment(parseFloat(e.target.value))}
                className="w-full h-2 sm:h-2.5 bg-blue-200 rounded-lg appearance-none cursor-pointer touch-manipulation"
              />
              <div className="flex justify-between text-[10px] xs:text-xs text-gray-500 mt-1">
                <span>Min: {formatCurrency(Math.max(25, balance * 0.01))}</span>
                <span>Full: {formatCurrency(balance)}</span>
              </div>
            </div>

            <div className="bg-red-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 mt-3 sm:mt-4">
              <h3 className="text-xs sm:text-sm font-semibold text-red-600 mb-2 sm:mb-3">Quick Payment Options</h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setMonthlyPayment(Math.max(25, balance * 0.02))}
                  className="px-2 py-2 bg-white border border-red-200 rounded-lg text-xs font-medium text-red-700 hover:bg-red-100 active:bg-red-200 transition-colors touch-manipulation"
                >
                  Minimum
                </button>
                <button
                  onClick={() => setMonthlyPayment(Math.max(50, balance * 0.05))}
                  className="px-2 py-2 bg-white border border-red-200 rounded-lg text-xs font-medium text-red-700 hover:bg-red-100 active:bg-red-200 transition-colors touch-manipulation"
                >
                  5% of Balance
                </button>
                <button
                  onClick={() => setMonthlyPayment(Math.max(100, balance * 0.1))}
                  className="px-2 py-2 bg-white border border-red-200 rounded-lg text-xs font-medium text-red-700 hover:bg-red-100 active:bg-red-200 transition-colors touch-manipulation"
                >
                  10% of Balance
                </button>
              </div>
            </div>

            <button className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold py-3 sm:py-3.5 px-2 sm:px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base touch-manipulation">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Calculate Payoff
            </button>
          </div>

          {/* Right: Results Section */}
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 md:mb-4">Payoff Summary</h2>

            <div className="bg-green-50 border border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
              <div className="text-[10px] xs:text-xs sm:text-sm text-green-600 mb-0.5 sm:mb-1">Debt-Free Date</div>
              <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-green-700">{results.payoffDate}</div>
              <div className="text-[10px] xs:text-xs sm:text-sm text-green-600 mt-1">{results.monthsToPayoff} months to payoff</div>
            </div>

            <div className="space-y-1.5 sm:space-y-2 md:space-y-3 mb-3 sm:mb-4 md:mb-6">
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Current Balance:</span>
                <span className="font-semibold text-gray-800">{formatCurrencyFull(balance)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Total Interest:</span>
                <span className="font-semibold text-red-600">{formatCurrencyFull(results.totalInterest)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Total Amount to Pay:</span>
                <span className="font-semibold text-blue-600">{formatCurrencyFull(results.totalPaid)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2 border-b border-gray-100 text-xs sm:text-sm md:text-base">
                <span className="text-gray-600">Monthly Payment:</span>
                <span className="font-semibold text-green-600">{formatCurrencyFull(monthlyPayment)}</span>
              </div>
            </div>

            {/* Donut Chart */}
            <div className="mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 text-center">Payment Breakdown</h3>
              <div className="flex justify-center">
                <svg viewBox="0 0 180 180" className="w-32 h-32 xs:w-36 xs:h-36 sm:w-44 sm:h-44">
                  <defs>
                    <filter id="ccGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                  </defs>
                  {(() => {
                    let offset = 0;
                    return segments.map((segment) => {
                      const dashArray = (segment.percent / 100) * circumference;
                      const currentOffset = offset;
                      offset -= dashArray;

                      return (
                        <g key={segment.id}>
                          {hoveredSegment === segment.id && (
                            <circle
                              cx="90" cy="90" r={radius}
                              fill="none" stroke={segment.color} strokeWidth={strokeWidth + 8}
                              strokeDasharray={`${dashArray} ${circumference}`}
                              strokeDashoffset={currentOffset}
                              opacity="0.2"
                              className="pointer-events-none"
                            />
                          )}
                          <circle
                            cx="90" cy="90" r={radius}
                            fill="none" stroke={segment.color}
                            strokeWidth={hoveredSegment === segment.id ? strokeWidth + 4 : strokeWidth}
                            strokeDasharray={`${dashArray} ${circumference}`}
                            strokeDashoffset={currentOffset}
                            className="pointer-events-none transition-all duration-200"
                            style={{ opacity: hoveredSegment && hoveredSegment !== segment.id ? 0.5 : 1 }}
                            filter="url(#ccGlow)"
                          />
                          <circle
                            cx="90" cy="90" r={radius}
                            fill="transparent" strokeWidth={strokeWidth + 10} stroke="transparent"
                            strokeDasharray={`${dashArray} ${circumference}`}
                            strokeDashoffset={currentOffset}
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredSegment(segment.id)}
                            onMouseLeave={() => setHoveredSegment(null)}
                          />
                        </g>
                      );
                    });
                  })()}
                  <text x="90" y="85" textAnchor="middle" className="text-sm sm:text-base font-bold fill-gray-800">
                    {hoveredSegment ? formatCurrency(segments.find(s => s.id === hoveredSegment)?.value || 0) : formatCurrency(results.totalPaid)}
                  </text>
                  <text x="90" y="102" textAnchor="middle" className="text-[10px] sm:text-xs fill-gray-500">
                    {hoveredSegment ? segments.find(s => s.id === hoveredSegment)?.label : 'Total'}
                  </text>
                </svg>
              </div>
              <div className="flex justify-center gap-4 xs:gap-3 sm:gap-4 md:gap-6 mt-2">
                {segments.map((segment) => (
                  <div
                    key={segment.id}
                    className="flex items-center gap-1.5 cursor-pointer"
                    onMouseEnter={() => setHoveredSegment(segment.id)}
                    onMouseLeave={() => setHoveredSegment(null)}
                  >
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: segment.color }}></div>
                    <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600">{segment.label} ({segment.percent.toFixed(1)}%)</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Key Insights</h3>
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-4 text-[10px] xs:text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">APR:</span>
                  <span className="font-medium text-red-600">{interestRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Months:</span>
                  <span className="font-medium">{results.monthsToPayoff}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Interest Cost:</span>
                  <span className="font-medium text-red-600">{formatCurrency(results.totalInterest)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Interest %:</span>
                  <span className="font-medium">{results.interestPercent.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />


      {/* Balance Payoff Chart */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Balance Payoff Over Time</h2>

        <div className="flex flex-wrap justify-center gap-3 xs:gap-4 sm:gap-6 md:gap-8 mb-3 sm:mb-4 md:mb-6">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-red-400 to-red-600 shadow-sm"></div>
            <span className="text-[10px] xs:text-xs sm:text-sm text-gray-600 font-medium">Remaining Balance</span>
          </div>
        </div>

        <div className="relative overflow-x-auto bg-gradient-to-br from-slate-50 to-gray-100 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 -mx-1 sm:mx-0">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto min-w-[320px] sm:min-w-[400px] md:min-w-[500px]"
            style={{ maxHeight: '300px' }}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="ccAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#f87171" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#fca5a5" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="ccLineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
              <filter id="ccLineShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15"/>
              </filter>
            </defs>

            <rect x={chartPadding.left} y={chartPadding.top} width={plotWidth} height={plotHeight} fill="white" rx="8" opacity="0.7"/>

            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const y = chartPadding.top + plotHeight - ratio * plotHeight;
              return (
                <g key={i}>
                  <line x1={chartPadding.left} y1={y} x2={chartPadding.left + plotWidth} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray={i === 0 ? "0" : "4,4"} />
                  <text x={chartPadding.left - 12} y={y + 4} textAnchor="end" className="text-[10px] sm:text-xs fill-gray-500 font-medium">
                    {formatCurrency(maxChartBalance * ratio)}
                  </text>
                </g>
              );
            })}

            <line x1={chartPadding.left} y1={chartPadding.top} x2={chartPadding.left} y2={chartPadding.top + plotHeight} stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
            <line x1={chartPadding.left} y1={chartPadding.top + plotHeight} x2={chartPadding.left + plotWidth} y2={chartPadding.top + plotHeight} stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />

            {areaPath && <path d={areaPath} fill="url(#ccAreaGradient)" />}
            {linePath && <path d={linePath} fill="none" stroke="url(#ccLineGradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" filter="url(#ccLineShadow)" />}

            {chartPoints.map((point, i) => (
              <g key={i}>
                {hoveredMonth === i && (
                  <circle cx={point.x} cy={point.y} r="14" fill="#ef4444" opacity="0.15" className="pointer-events-none" />
                )}
                <circle
                  cx={point.x} cy={point.y}
                  r={hoveredMonth === i ? 8 : 5}
                  fill="white" stroke="#ef4444" strokeWidth="3"
                  className="pointer-events-none transition-all duration-200"
                />
                <circle
                  cx={point.x} cy={point.y} r="18"
                  fill="transparent" className="cursor-pointer"
                  onMouseEnter={() => setHoveredMonth(i)}
                  onMouseLeave={() => setHoveredMonth(null)}
                />
              </g>
            ))}

            {chartPoints.map((point, i) => {
              const showLabel = chartPoints.length <= 12 || i % Math.ceil(chartPoints.length / 8) === 0 || i === chartPoints.length - 1;
              return showLabel ? (
                <text key={i} x={point.x} y={chartPadding.top + plotHeight + 25} textAnchor="middle" className="text-[10px] sm:text-xs fill-gray-500 font-medium">
                  Mo {point.month}
                </text>
              ) : null;
            })}

            {hoveredMonth !== null && chartPoints[hoveredMonth] && (
              <line
                x1={chartPoints[hoveredMonth].x}
                y1={chartPadding.top}
                x2={chartPoints[hoveredMonth].x}
                y2={chartPadding.top + plotHeight}
                stroke="#ef4444" strokeWidth="2" strokeDasharray="6,4" opacity="0.6"
              />
            )}
          </svg>

          {hoveredMonth !== null && chartPoints[hoveredMonth] && (
            <div
              className="absolute z-20 bg-white text-gray-800 text-xs rounded-xl px-4 py-3 shadow-2xl pointer-events-none border border-gray-100"
              style={{
                left: `calc(${(hoveredMonth / (chartPoints.length - 1 || 1)) * 85 + 8}%)`,
                top: '30px',
                transform: 'translateX(-50%)'
              }}
            >
              <div className="font-bold mb-2 text-sm text-gray-900 border-b border-gray-100 pb-2">Month {chartPoints[hoveredMonth].month}</div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                  <span className="text-gray-600">Balance:</span>
                  <span className="font-semibold text-red-600 ml-auto">{formatCurrencyFull(chartPoints[hoveredMonth].balance)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
                  <span className="text-gray-600">Principal:</span>
                  <span className="font-semibold text-blue-600 ml-auto">{formatCurrencyFull(chartPoints[hoveredMonth].principal)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-orange-500 rounded-full"></span>
                  <span className="text-gray-600">Interest:</span>
                  <span className="font-semibold text-orange-600 ml-auto">{formatCurrencyFull(chartPoints[hoveredMonth].interest)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* What-If Scenarios */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-1.5 sm:mb-2">What-If Scenarios</h2>
        <p className="text-gray-600 text-[10px] xs:text-xs sm:text-sm mb-3 sm:mb-4 md:mb-6">See how increasing your payment can save you money and time</p>

        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
          <div className="border-2 border-red-200 bg-red-50 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 xs:col-span-2 sm:col-span-1">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Current Payment</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-red-600 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">Active</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly:</span>
                <span className="font-medium">{formatCurrency(monthlyPayment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Months:</span>
                <span className="font-medium">{scenarios.current.months}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Interest:</span>
                <span className="font-medium text-red-600">{formatCurrency(scenarios.current.interest)}</span>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 bg-white rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 hover:border-green-300 active:border-green-400 transition-colors">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">+$100/month</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-green-500 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">Save</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly:</span>
                <span className="font-medium">{formatCurrency(scenarios.extra.payment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Months:</span>
                <span className="font-medium text-green-600">{scenarios.extra.months}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Interest:</span>
                <span className="font-medium">{formatCurrency(scenarios.extra.interest)}</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-green-600">Save {formatCurrency(scenarios.extra.savings)} • {scenarios.extra.monthsSaved} months faster</div>
            </div>
          </div>

          <div className="border border-gray-200 bg-white rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4 hover:border-blue-300 active:border-blue-400 transition-colors">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-800">Double Payment</span>
              <span className="text-[8px] xs:text-[10px] sm:text-xs bg-blue-500 text-white px-1 xs:px-1.5 sm:px-2 py-0.5 rounded">Best</span>
            </div>
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-[10px] xs:text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly:</span>
                <span className="font-medium">{formatCurrency(scenarios.double.payment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Months:</span>
                <span className="font-medium text-blue-600">{scenarios.double.months}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Interest:</span>
                <span className="font-medium">{formatCurrency(scenarios.double.interest)}</span>
              </div>
            </div>
            <div className="mt-2 xs:mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
              <div className="text-[8px] xs:text-[10px] sm:text-xs text-blue-600">Save {formatCurrency(scenarios.double.savings)} • {scenarios.double.monthsSaved} months faster</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 xs:gap-3 sm:gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold text-gray-800 text-[10px] xs:text-xs sm:text-sm md:text-base">Pay More, Save More</span>
            </div>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              Every extra dollar goes directly to principal, reducing interest charges. Even small increases compound into significant savings over time.
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg sm:rounded-xl p-2.5 xs:p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="font-semibold text-gray-800 text-[10px] xs:text-xs sm:text-sm md:text-base">Minimum Payment Warning</span>
            </div>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">
              Minimum payments mostly cover interest. A {formatCurrency(balance)} balance at {interestRate}% APR could take decades to pay off with minimum payments.
            </p>
          </div>
        </div>
      </div>
{/* Payoff Schedule */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-sm xs:text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Monthly Payoff Schedule</h2>

        <div className="overflow-x-auto -mx-3 xs:-mx-4 sm:mx-0">
          <table className="w-full text-[10px] xs:text-xs sm:text-sm min-w-[400px] sm:min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Month</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Payment</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Principal</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Interest</th>
                <th className="text-right py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 font-semibold text-gray-700">Balance</th>
              </tr>
            </thead>
            <tbody>
              {(showFullSchedule ? payoffSchedule : payoffSchedule.slice(0, 6)).map((row) => (
                <tr key={row.month} className="border-b border-gray-100 hover:bg-gray-50 active:bg-gray-100">
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-gray-800">{row.month}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-gray-600">{formatCurrencyFull(row.payment)}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-blue-600">{formatCurrencyFull(row.principal)}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right text-red-600">{formatCurrencyFull(row.interest)}</td>
                  <td className="py-1.5 sm:py-2 md:py-3 px-2 xs:px-3 sm:px-4 text-right font-semibold text-gray-800">{formatCurrencyFull(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {payoffSchedule.length > 6 && (
            <div className="text-center py-2 sm:py-3 md:py-4">
              {!showFullSchedule && (
                <p className="text-[10px] xs:text-xs sm:text-sm text-gray-500 mb-2">
                  Showing first 6 of {payoffSchedule.length} months
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
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-3 xs:mb-4 sm:mb-4 md:mb-6">Related Debt Calculators</h2>
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
          {allRelatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group touch-manipulation">
              <div className="rounded-lg xs:rounded-xl p-2 xs:p-3 sm:p-4 bg-white border border-gray-200 hover:border-red-300 active:border-red-400 hover:shadow-md active:shadow-lg transition-all h-full">
                <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 bg-red-50 rounded-md xs:rounded-lg flex items-center justify-center mb-1.5 xs:mb-2 sm:mb-3 text-base xs:text-lg sm:text-2xl">
                  {calc.icon}
                </div>
                <h3 className="text-[10px] xs:text-xs sm:text-sm font-semibold text-gray-900 mb-0.5 xs:mb-1 group-hover:text-red-600 transition-colors leading-tight">
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
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Understanding Credit Card Debt</h2>
        <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-3 xs:mb-4 sm:mb-4 md:mb-6 leading-relaxed">
          Credit card debt can quickly spiral out of control due to high interest rates. Understanding how credit card interest compounds
          and how your payments are applied is crucial for getting out of debt faster. Most credit card interest rates range from 15% to 25%
          APR, making it one of the most expensive forms of debt.
        </p>

        <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 xs:gap-4 sm:gap-4 md:gap-6 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
          <div className="bg-red-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-red-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">High Interest</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Credit cards charge 15-25% APR, far higher than other debt types</p>
          </div>
          <div className="bg-yellow-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-yellow-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Minimum Trap</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Minimum payments keep you in debt for years or decades</p>
          </div>
          <div className="bg-green-50 rounded-lg xs:rounded-xl p-3 xs:p-4 sm:p-5">
            <h3 className="font-semibold text-green-800 mb-1 xs:mb-2 text-xs xs:text-sm sm:text-base">Extra Payments</h3>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-relaxed">Every dollar above minimum goes directly to principal</p>
          </div>
        </div>

        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Credit Card Interest Formula</h2>
        <div className="bg-gray-50 rounded-lg xs:rounded-xl p-3 xs:p-3 sm:p-4 font-mono text-[10px] xs:text-xs sm:text-sm overflow-x-auto mb-4 xs:mb-3 sm:mb-4 md:mb-6">
          <p className="mb-2 xs:mb-3 sm:mb-4 font-bold">Monthly Interest = Balance × (APR ÷ 12)</p>
          <div className="text-gray-600 space-y-0.5 xs:space-y-1 border-t border-gray-200 pt-3">
            <p>Example: $5,000 balance at 18.99% APR</p>
            <p>Monthly Interest = $5,000 × (0.1899 ÷ 12) = $79.13</p>
            <p>If minimum payment is $100, only $20.87 goes to principal!</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-3 sm:gap-4 md:gap-6">
          <div>
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Debt Payoff Strategies</h2>
            <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-600">
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span><strong>Avalanche:</strong> Pay highest interest first</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span><strong>Snowball:</strong> Pay smallest balance first</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span><strong>Balance Transfer:</strong> Move to 0% APR card</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                <span><strong>Consolidation:</strong> Lower rate personal loan</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4">Tips to Pay Off Faster</h2>
            <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2 text-xs xs:text-sm sm:text-base text-gray-600">
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
                <span>Pay more than the minimum every month</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
                <span>Make bi-weekly payments to reduce interest</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
                <span>Apply windfalls to credit card debt</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
                <span>Stop using the card while paying off</span>
              </li>
              <li className="flex items-start gap-1.5 xs:gap-2">
                <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
                <span>Negotiate a lower interest rate</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8">
        <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-800 mb-3 xs:mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4 xs:space-y-5 sm:space-y-4 md:space-y-6">
          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">Why does paying the minimum take so long to pay off my card?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              Minimum payments are designed to cover mostly interest with only a small portion going to principal. Credit card companies
              typically set minimums at 1-3% of your balance or a fixed amount like $25-35. At 18% APR on a $5,000 balance, your minimum
              might be $100, but $75 goes to interest and only $25 reduces your debt. This is why a $5,000 balance can take 20+ years to
              pay off with minimum payments.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">Should I use the avalanche or snowball method?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              The avalanche method (paying highest interest first) saves the most money mathematically. The snowball method (paying smallest
              balance first) provides psychological wins that keep you motivated. If you're disciplined, choose avalanche. If you need
              motivation from quick wins, choose snowball. Either method is better than just paying minimums, so pick what you'll actually
              stick with.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">Is a balance transfer card a good idea?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              Balance transfer cards with 0% APR promotions can be excellent if you can pay off the balance before the promotional period
              ends. Watch for transfer fees (typically 3-5% of the transferred amount), and know that remaining balances after the promo
              period will be charged regular APR (often 20%+). Only transfer if you have a realistic payoff plan within the 0% period.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-4 xs:pb-5">
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">How does credit card interest compound?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              Most credit cards use daily compounding based on your Average Daily Balance. Your APR is divided by 365 to get a daily rate,
              which is applied to your balance each day. New purchases may have a grace period if you pay in full, but carried balances
              accrue interest daily. This is why paying early in the billing cycle or making multiple payments per month can reduce interest.
            </p>
          </div>

          <div>
            <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-800 mb-2">Should I close my credit card after paying it off?</h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 leading-relaxed">
              Generally, no. Closing cards reduces your available credit and can hurt your credit score by increasing your credit utilization
              ratio and shortening your credit history. If there's no annual fee, keep it open with occasional small purchases paid in full.
              If you're worried about overspending, you can cut up the card while keeping the account open, or request a product change to a
              no-fee card.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="credit-card-payoff-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
