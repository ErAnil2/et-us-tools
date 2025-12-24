'use client';

import { useState, useMemo } from 'react';
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

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Car Loan Calculator?",
    answer: "A Car Loan Calculator is a free online tool that helps you calculate and analyze car loan-related financial metrics quickly and accurately. It provides instant results to help you make informed financial decisions.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is this Car Loan Calculator?",
    answer: "Our Car Loan Calculator uses standard financial formulas and provides highly accurate results. However, actual results may vary based on specific terms, conditions, and market factors. Always consult with a financial advisor for major decisions.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Car Loan Calculator free to use?",
    answer: "Yes, this Car Loan Calculator is completely free to use. There are no hidden charges or registration required. You can use it as many times as you need.",
    order: 3
  },
  {
    id: '4',
    question: "Can I save my Car Loan calculations?",
    answer: "The calculator displays results instantly on screen. You can take a screenshot or note down the results for your records. Some browsers also allow you to print the page.",
    order: 4
  },
  {
    id: '5',
    question: "What information do I need for this calculator?",
    answer: "You'll need basic information related to car loan such as amounts, rates, time periods, or other relevant values. The calculator will guide you through each required field.",
    order: 5
  }
];

export default function CarLoanCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('car-loan-calculator');

  const [carPrice, setCarPrice] = useState(30000);
  const [downPayment, setDownPayment] = useState(5000);
  const [tradeInValue, setTradeInValue] = useState(0);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(60);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  const loanTermOptions = [24, 36, 48, 60, 72, 84];

  const results = useMemo(() => {
    const loanAmount = Math.max(0, carPrice - downPayment - tradeInValue);
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm;

    let monthlyPayment = 0;
    let totalInterest = 0;
    let totalCost = 0;

    if (loanAmount > 0 && monthlyRate > 0) {
      monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                       (Math.pow(1 + monthlyRate, numPayments) - 1);
      totalCost = monthlyPayment * numPayments;
      totalInterest = totalCost - loanAmount;
    } else if (loanAmount > 0) {
      monthlyPayment = loanAmount / numPayments;
      totalCost = loanAmount;
      totalInterest = 0;
    }

    // Generate amortization schedule
    const schedule: AmortizationRow[] = [];
    let balance = loanAmount;

    for (let month = 1; month <= numPayments; month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      balance = Math.max(0, balance - principalPayment);

      schedule.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance
      });
    }

    return {
      loanAmount,
      monthlyPayment,
      totalInterest,
      totalCost,
      schedule,
      downPaymentPercent: carPrice > 0 ? ((downPayment / carPrice) * 100) : 0
    };
  }, [carPrice, downPayment, tradeInValue, interestRate, loanTerm]);

  // What-if scenarios
  const scenarios = useMemo(() => {
    const calculate = (amount: number, rate: number, term: number) => {
      const monthlyRate = rate / 100 / 12;
      if (amount <= 0) return { monthly: 0, total: 0, interest: 0 };
      if (monthlyRate <= 0) return { monthly: amount / term, total: amount, interest: 0 };

      const monthly = (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) /
                     (Math.pow(1 + monthlyRate, term) - 1);
      const total = monthly * term;
      return { monthly, total, interest: total - amount };
    };

    const current = calculate(results.loanAmount, interestRate, loanTerm);
    const shorterTerm = calculate(results.loanAmount, interestRate, Math.max(24, loanTerm - 12));
    const lowerRate = calculate(results.loanAmount, Math.max(0, interestRate - 1), loanTerm);
    const moreDown = calculate(Math.max(0, results.loanAmount - 2000), interestRate, loanTerm);

    return {
      current,
      shorterTerm: { ...shorterTerm, savings: current.interest - shorterTerm.interest, term: Math.max(24, loanTerm - 12) },
      lowerRate: { ...lowerRate, savings: current.interest - lowerRate.interest, rate: Math.max(0, interestRate - 1) },
      moreDown: { ...moreDown, savings: current.interest - moreDown.interest }
    };
  }, [results.loanAmount, interestRate, loanTerm]);

  const formatCurrency = (value: number) => {
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

  // Donut chart for payment breakdown
  const renderPaymentBreakdown = () => {
    const principal = results.loanAmount;
    const interest = results.totalInterest;
    const total = principal + interest;

    if (total === 0) return null;

    const principalPercent = (principal / total) * 100;
    const interestPercent = (interest / total) * 100;

    const radius = 70;
    const strokeWidth = 24;
    const circumference = 2 * Math.PI * radius;

    const segments = [
      { id: 'principal', label: 'Principal', value: principal, percent: principalPercent, color: '#3B82F6' },
      { id: 'interest', label: 'Interest', value: interest, percent: interestPercent, color: '#F59E0B' },
    ];

    let currentOffset = 0;

    return (
      <div className="flex flex-col items-center">
        <div className="relative">
          <svg width="180" height="180" viewBox="0 0 180 180" className="transform -rotate-90">
            {segments.map((segment) => {
              const dashArray = (segment.percent / 100) * circumference;
              const offset = currentOffset;
              currentOffset -= dashArray;

              return (
                <g key={segment.id}>
                  {hoveredSegment === segment.id && (
                    <circle
                      cx="90"
                      cy="90"
                      r={radius}
                      fill="none"
                      stroke={segment.color}
                      strokeWidth={strokeWidth + 8}
                      strokeDasharray={`${dashArray} ${circumference}`}
                      strokeDashoffset={offset}
                      opacity="0.2"
                      className="pointer-events-none"
                    />
                  )}
                  <circle
                    cx="90"
                    cy="90"
                    r={radius}
                    fill="none"
                    stroke={segment.color}
                    strokeWidth={hoveredSegment === segment.id ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={`${dashArray} ${circumference}`}
                    strokeDashoffset={offset}
                    className="pointer-events-none transition-all duration-200"
                    style={{ opacity: hoveredSegment && hoveredSegment !== segment.id ? 0.5 : 1 }}
                  />
                  <circle
                    cx="90"
                    cy="90"
                    r={radius}
                    fill="transparent"
                    strokeWidth={strokeWidth + 10}
                    stroke="transparent"
                    strokeDasharray={`${dashArray} ${circumference}`}
                    strokeDashoffset={offset}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredSegment(segment.id)}
                    onMouseLeave={() => setHoveredSegment(null)}
                  />
                </g>
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              {hoveredSegment ? (
                <>
                  <div className="text-lg font-bold text-gray-800">
                    {formatCurrency(segments.find(s => s.id === hoveredSegment)?.value || 0)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {segments.find(s => s.id === hoveredSegment)?.label}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-lg font-bold text-gray-800">{formatCurrency(total)}</div>
                  <div className="text-xs text-gray-500">Total Cost</div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-3 sm:gap-4 md:gap-6 mt-4">
          {segments.map((segment) => (
            <div
              key={segment.id}
              className={`flex items-center gap-2 cursor-pointer transition-opacity ${hoveredSegment && hoveredSegment !== segment.id ? 'opacity-50' : ''}`}
              onMouseEnter={() => setHoveredSegment(segment.id)}
              onMouseLeave={() => setHoveredSegment(null)}
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }}></div>
              <span className="text-sm text-gray-600">{segment.label} ({segment.percent.toFixed(1)}%)</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Year-by-year summary
  const yearSummary = useMemo(() => {
    const years: { year: number; principal: number; interest: number; balance: number }[] = [];
    let yearPrincipal = 0;
    let yearInterest = 0;

    results.schedule.forEach((row, index) => {
      yearPrincipal += row.principal;
      yearInterest += row.interest;

      if ((index + 1) % 12 === 0 || index === results.schedule.length - 1) {
        years.push({
          year: Math.ceil((index + 1) / 12),
          principal: yearPrincipal,
          interest: yearInterest,
          balance: row.balance
        });
        yearPrincipal = 0;
        yearInterest = 0;
      }
    });

    return years;
  }, [results.schedule]);

  const allRelatedCalculators = [
    { href: '/us/tools/calculators/auto-loan-calculator', title: 'Auto Loan Calculator', description: 'Compare auto financing', icon: '🚗' },
    { href: '/us/tools/calculators/loan-calculator', title: 'Loan Calculator', description: 'General loan calculations', icon: '💳' },
    { href: '/us/tools/calculators/fuel-cost-calculator', title: 'Fuel Cost Calculator', description: 'Calculate fuel expenses', icon: '⛽' },
    { href: '/us/tools/calculators/interest-rate-calculator', title: 'Interest Rate', description: 'Find your rate', icon: '📊' },
    { href: '/us/tools/calculators/refinance-calculator', title: 'Refinance Calculator', description: 'Should you refinance?', icon: '🔄' },
    { href: '/us/tools/calculators/debt-payoff-calculator', title: 'Debt Payoff', description: 'Pay off debt faster', icon: '💪' },
    { href: '/us/tools/calculators/budget-calculator', title: 'Budget Calculator', description: 'Plan your budget', icon: '📋' },
    { href: '/us/tools/calculators/savings-calculator', title: 'Savings Calculator', description: 'Plan your savings', icon: '💰' }
  ];

  return (
    <div className="max-w-[1180px] mx-auto px-2 sm:px-4 py-3 sm:py-4 md:py-6">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Car Loan Calculator')}</h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Calculate your monthly car payment, total interest, and see how different terms affect your loan
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Calculator */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}

      <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Loan Details</h2>

            <div className="space-y-5">
              {/* Car Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Car Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={carPrice}
                    onChange={(e) => setCarPrice(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Down Payment */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Down Payment</label>
                  <span className="text-sm text-blue-600 font-medium">{results.downPaymentPercent.toFixed(1)}% of price</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Trade-In Value */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trade-In Value (Optional)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={tradeInValue}
                    onChange={(e) => setTradeInValue(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Interest Rate */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Interest Rate (APR)</label>
                  <span className="text-sm font-semibold text-blue-600">{interestRate}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>20%</span>
                </div>
              </div>

              {/* Loan Term */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loan Term</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {loanTermOptions.map((term) => (
                    <button
                      key={term}
                      onClick={() => setLoanTerm(term)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        loanTerm === term
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {term} mo
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Presets */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Quick Presets</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => { setCarPrice(20000); setDownPayment(2000); setInterestRate(7); setLoanTerm(48); }}
                    className="p-2 text-xs bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <div className="font-semibold text-blue-900">Budget</div>
                    <div className="text-blue-700">$20,000</div>
                  </button>
                  <button
                    onClick={() => { setCarPrice(35000); setDownPayment(5000); setInterestRate(5.5); setLoanTerm(60); }}
                    className="p-2 text-xs bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                  >
                    <div className="font-semibold text-emerald-900">Average</div>
                    <div className="text-emerald-700">$35,000</div>
                  </button>
                  <button
                    onClick={() => { setCarPrice(50000); setDownPayment(10000); setInterestRate(4.5); setLoanTerm(60); }}
                    className="p-2 text-xs bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <div className="font-semibold text-purple-900">Premium</div>
                    <div className="text-purple-700">$50,000</div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Payment Summary</h2>

            {/* Monthly Payment Highlight */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 mb-5 border border-blue-100">
              <div className="text-sm text-blue-700 mb-1">Monthly Payment</div>
              <div className="text-3xl sm:text-3xl md:text-4xl font-bold text-blue-600">{formatCurrencyFull(results.monthlyPayment)}</div>
              <div className="text-xs text-blue-600 mt-1">for {loanTerm} months</div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="text-xs text-gray-500 mb-1">Loan Amount</div>
                <div className="text-lg font-bold text-gray-800">{formatCurrency(results.loanAmount)}</div>
              </div>
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                <div className="text-xs text-amber-600 mb-1">Total Interest</div>
                <div className="text-lg font-bold text-amber-600">{formatCurrency(results.totalInterest)}</div>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                <div className="text-xs text-emerald-600 mb-1">Total Cost</div>
                <div className="text-lg font-bold text-emerald-600">{formatCurrency(results.totalCost)}</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                <div className="text-xs text-purple-600 mb-1">Interest Rate</div>
                <div className="text-lg font-bold text-purple-600">{interestRate}% APR</div>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="bg-gray-50 rounded-lg p-4 mb-5 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Cost Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Car Price:</span>
                  <span className="font-medium">{formatCurrency(carPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Down Payment:</span>
                  <span className="font-medium text-green-600">-{formatCurrency(downPayment)}</span>
                </div>
                {tradeInValue > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trade-In Value:</span>
                    <span className="font-medium text-green-600">-{formatCurrency(tradeInValue)}</span>
                  </div>
                )}
                <div className="border-t border-gray-300 pt-2 flex justify-between font-semibold">
                  <span className="text-gray-800">Amount Financed:</span>
                  <span className="text-blue-600">{formatCurrency(results.loanAmount)}</span>
                </div>
              </div>
            </div>

            {/* Payment Breakdown Chart */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 text-center">Principal vs Interest</h3>
              {renderPaymentBreakdown()}
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />


      {/* What-If Scenarios */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">What-If Scenarios</h2>
        <p className="text-gray-600 text-sm mb-3 sm:mb-4 md:mb-6">See how changes can save you money</p>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Shorter Term</h3>
                <p className="text-xs text-gray-500">{scenarios.shorterTerm.term} months</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-600 mb-1">{formatCurrencyFull(scenarios.shorterTerm.monthly)}/mo</div>
            <div className="text-sm text-emerald-600 font-medium">Save {formatCurrency(scenarios.shorterTerm.savings)} in interest</div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-5 border border-emerald-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Lower Rate</h3>
                <p className="text-xs text-gray-500">{scenarios.lowerRate.rate}% APR</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-emerald-600 mb-1">{formatCurrencyFull(scenarios.lowerRate.monthly)}/mo</div>
            <div className="text-sm text-emerald-600 font-medium">Save {formatCurrency(scenarios.lowerRate.savings)} in interest</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">$2K More Down</h3>
                <p className="text-xs text-gray-500">{formatCurrency(downPayment + 2000)} total</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-purple-600 mb-1">{formatCurrencyFull(scenarios.moreDown.monthly)}/mo</div>
            <div className="text-sm text-emerald-600 font-medium">Save {formatCurrency(scenarios.moreDown.savings)} in interest</div>
          </div>
        </div>
      </div>
{/* Year-by-Year Summary */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Year-by-Year Summary</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Year</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Principal Paid</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Interest Paid</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Remaining Balance</th>
              </tr>
            </thead>
            <tbody>
              {yearSummary.map((row) => (
                <tr key={row.year} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-800">Year {row.year}</td>
                  <td className="py-3 px-4 text-right text-blue-600">{formatCurrency(row.principal)}</td>
                  <td className="py-3 px-4 text-right text-amber-600">{formatCurrency(row.interest)}</td>
                  <td className="py-3 px-4 text-right font-semibold text-gray-800">{formatCurrency(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Amortization Schedule */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Amortization Schedule</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Month</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Payment</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Principal</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Interest</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Balance</th>
              </tr>
            </thead>
            <tbody>
              {(showFullSchedule ? results.schedule : results.schedule.slice(0, 12)).map((row) => (
                <tr key={row.month} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-800">{row.month}</td>
                  <td className="py-3 px-4 text-right text-gray-700">{formatCurrencyFull(row.payment)}</td>
                  <td className="py-3 px-4 text-right text-blue-600">{formatCurrencyFull(row.principal)}</td>
                  <td className="py-3 px-4 text-right text-amber-600">{formatCurrencyFull(row.interest)}</td>
                  <td className="py-3 px-4 text-right font-medium text-gray-800">{formatCurrencyFull(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {results.schedule.length > 12 && (
            <div className="text-center py-4">
              <button
                onClick={() => setShowFullSchedule(!showFullSchedule)}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
              >
                {showFullSchedule ? 'Show Less' : `Show All ${results.schedule.length} Months`}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Related Calculators - Moved above SEO and FAQs */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {allRelatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-xl p-4 bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 h-full">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <span className="text-xl">{calc.icon}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{calc.title}</h3>
                <p className="text-xs text-gray-600 line-clamp-2">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">How Car Loans Work</h2>

        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
            A car loan lets you spread the cost of a vehicle over time, making it more affordable to purchase a new or used car. The lender pays the dealer, and you repay the lender with interest over the loan term. Understanding the key factors that affect your payment helps you make smarter financing decisions.
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">The Car Loan Payment Formula</h3>
          <div className="bg-gray-50 rounded-xl p-5 mb-3 sm:mb-4 md:mb-6">
            <p className="font-mono text-sm text-gray-700 mb-3">
              M = P × [r(1+r)^n] / [(1+r)^n - 1]
            </p>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>M</strong> = Monthly payment</p>
              <p><strong>P</strong> = Loan amount (car price - down payment - trade-in)</p>
              <p><strong>r</strong> = Monthly interest rate (annual rate / 12)</p>
              <p><strong>n</strong> = Number of payments (loan term in months)</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
              <h4 className="text-lg font-semibold text-blue-900 mb-3">New vs Used Car Loans</h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                New car loans typically offer lower interest rates (4-7%) compared to used car loans (7-12%) because new cars hold their value better as collateral. However, new cars depreciate faster, losing 20-30% of value in the first year.
              </p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100">
              <h4 className="text-lg font-semibold text-emerald-900 mb-3">The 20/4/10 Rule</h4>
              <p className="text-sm text-emerald-800 leading-relaxed">
                Financial experts recommend: put at least 20% down, choose a loan term of 4 years or less, and keep total car expenses (payment + insurance + gas) under 10% of your gross monthly income.
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">Tips for a Better Car Loan</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-3 sm:mb-4 md:mb-6">
            <div className="flex items-start gap-3">
              <span className="text-green-500 mt-1">&#10003;</span>
              <div>
                <strong className="text-gray-800">Check your credit score</strong>
                <p className="text-sm text-gray-600">Higher scores (700+) qualify for the best rates. Check and dispute errors before applying.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 mt-1">&#10003;</span>
              <div>
                <strong className="text-gray-800">Get pre-approved</strong>
                <p className="text-sm text-gray-600">Shop rates from banks, credit unions, and online lenders before visiting the dealership.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 mt-1">&#10003;</span>
              <div>
                <strong className="text-gray-800">Negotiate the price first</strong>
                <p className="text-sm text-gray-600">Focus on the total price, not monthly payment. Dealers can stretch terms to hide higher prices.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 mt-1">&#10003;</span>
              <div>
                <strong className="text-gray-800">Consider total cost</strong>
                <p className="text-sm text-gray-600">A lower monthly payment with longer term often means paying more interest overall.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>

        <div className="space-y-5">
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2">What credit score do I need for a car loan?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              You can get a car loan with almost any credit score, but rates vary dramatically. Excellent credit (750+) gets rates around 4-6%, good credit (700-749) around 6-9%, fair credit (650-699) around 9-14%, and poor credit (below 650) can see rates of 15-25% or higher. Improving your score by even 50 points before applying can save thousands.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2">Should I choose a 60-month or 72-month loan?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              A 60-month loan has higher monthly payments but saves you money overall. For example, on a $30,000 loan at 6%, a 60-month term costs $4,799 in interest while a 72-month term costs $5,797 - that's $998 more for the same car. Plus, longer loans risk being "underwater" (owing more than the car's worth) longer.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2">How much should I put down on a car?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Aim for at least 20% down on a new car and 10% on a used car. This reduces your loan amount, lowers monthly payments, and protects against negative equity. New cars depreciate about 20% in year one, so putting less down means you'll quickly owe more than the car is worth.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2">Is it better to finance through a dealer or bank?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Get pre-approved from your bank or credit union first, then let the dealer try to beat it. Dealers can sometimes offer promotional rates (0% APR) from manufacturers, but these often require excellent credit and may not be combinable with rebates. Having outside financing gives you negotiating leverage.
            </p>
          </div>

          <div className="pb-2">
            <h3 className="text-base font-semibold text-gray-800 mb-2">Can I pay off my car loan early?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Most car loans allow early payoff without penalty, but check your contract. Paying extra each month or making bi-weekly payments can save significant interest. For example, adding just $50/month to a $400 payment on a 60-month loan can save you nearly $500 in interest and pay off the loan 6 months early.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="car-loan-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
