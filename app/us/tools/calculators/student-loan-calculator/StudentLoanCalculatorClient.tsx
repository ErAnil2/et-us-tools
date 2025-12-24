'use client';

import { useState, useEffect } from 'react';
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

interface PaymentScheduleRow {
  year: number;
  startBalance: number;
  yearlyPayment: number;
  principalPaid: number;
  interestPaid: number;
  endBalance: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is the difference between federal and private student loans?",
    answer: "Federal student loans are offered by the government with fixed interest rates, income-driven repayment options, and potential loan forgiveness programs. Private student loans come from banks with variable or fixed rates based on credit, fewer repayment options, and no forgiveness programs. Always exhaust federal loan options first.",
    order: 1
  },
  {
    id: '2',
    question: "How does the grace period affect my loan?",
    answer: "The grace period is typically 6 months after graduation before payments start. However, interest usually accrues during this period on unsubsidized loans, adding to your total balance. On subsidized federal loans, the government pays the interest during the grace period.",
    order: 2
  },
  {
    id: '3',
    question: "Should I pay off student loans early or invest?",
    answer: "If your loan rate is above 6-7%, paying off early often makes sense. If your rate is low (3-4%), investing may yield higher returns. Always take employer 401(k) matches first (free money), and maintain an emergency fund. Many people choose a hybrid approach.",
    order: 3
  },
  {
    id: '4',
    question: "What repayment plans are available?",
    answer: "Federal loans offer: Standard (10 years, fixed), Graduated (payments increase every 2 years), Extended (up to 25 years), and Income-Driven Plans (IBR, PAYE, REPAYE, ICR) that cap payments at 10-20% of discretionary income with forgiveness after 20-25 years.",
    order: 4
  },
  {
    id: '5',
    question: "Can student loans be forgiven?",
    answer: "Yes! PSLF forgives remaining balance after 120 payments while working for government/non-profit employers. Income-driven repayment forgiveness cancels remaining debt after 20-25 years. Teacher Loan Forgiveness provides up to $17,500 after 5 years in low-income schools.",
    order: 5
  }
];

export default function StudentLoanCalculatorClient() {
  const { getH1, getSubHeading } = usePageSEO('student-loan-calculator');

  const [loanAmount, setLoanAmount] = useState(45000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(10);
  const [gracePeriod, setGracePeriod] = useState(6);
  const [loanType, setLoanType] = useState<'federal-undergrad' | 'federal-grad' | 'federal-plus' | 'private'>('federal-undergrad');
  const [repaymentPlan, setRepaymentPlan] = useState<'standard' | 'graduated' | 'extended' | 'income-driven'>('standard');
  const [extraPayment, setExtraPayment] = useState(0);
  const [showSchedule, setShowSchedule] = useState(true);

  const [results, setResults] = useState({
    monthlyPayment: 0,
    totalPayment: 0,
    totalInterest: 0,
    payoffDate: '',
    graceInterest: 0,
    effectiveRate: 0
  });

  const [schedule, setSchedule] = useState<PaymentScheduleRow[]>([]);
  const [savingsWithExtra, setSavingsWithExtra] = useState({ months: 0, interest: 0 });

  const loanTypes = [
    { type: 'federal-undergrad' as const, label: 'Federal Undergrad', rate: 5.50, description: 'Direct Subsidized/Unsubsidized' },
    { type: 'federal-grad' as const, label: 'Federal Graduate', rate: 7.05, description: 'Direct Unsubsidized' },
    { type: 'federal-plus' as const, label: 'Parent/Grad PLUS', rate: 8.05, description: 'Direct PLUS Loans' },
    { type: 'private' as const, label: 'Private Loan', rate: 10.0, description: 'Bank/Credit Union' }
  ];

  useEffect(() => {
    const selected = loanTypes.find(l => l.type === loanType);
    if (selected && loanType !== 'private') {
      setInterestRate(selected.rate);
    }
  }, [loanType]);

  useEffect(() => {
    calculateLoan();
  }, [loanAmount, interestRate, loanTerm, gracePeriod, extraPayment, repaymentPlan]);

  const calculateLoan = () => {
    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = loanTerm * 12;

    // Interest accrued during grace period
    const graceInterest = loanAmount * monthlyRate * gracePeriod;
    const totalLoanAmount = loanAmount + graceInterest;

    // Calculate standard monthly payment
    let monthlyPayment = 0;
    if (monthlyRate > 0) {
      monthlyPayment = totalLoanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    } else {
      monthlyPayment = totalLoanAmount / totalMonths;
    }

    // Adjust for repayment plan
    if (repaymentPlan === 'extended') {
      const extendedMonths = 25 * 12;
      monthlyPayment = totalLoanAmount * (monthlyRate * Math.pow(1 + monthlyRate, extendedMonths)) / (Math.pow(1 + monthlyRate, extendedMonths) - 1);
    }

    const totalPayment = monthlyPayment * totalMonths;
    const totalInterest = totalPayment - loanAmount;
    const effectiveRate = ((totalPayment - loanAmount) / loanAmount / loanTerm) * 100;

    const payoffDate = new Date();
    payoffDate.setMonth(payoffDate.getMonth() + gracePeriod + totalMonths);

    setResults({
      monthlyPayment,
      totalPayment,
      totalInterest,
      payoffDate: payoffDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      graceInterest,
      effectiveRate
    });

    // Calculate savings with extra payment
    if (extraPayment > 0) {
      const newMonthlyPayment = monthlyPayment + extraPayment;
      let balance = totalLoanAmount;
      let months = 0;
      let totalPaid = 0;

      while (balance > 0 && months < totalMonths * 2) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = Math.min(newMonthlyPayment - interestPayment, balance);
        balance -= principalPayment;
        totalPaid += newMonthlyPayment;
        months++;
      }

      const monthsSaved = totalMonths - months;
      const interestSaved = totalPayment - totalPaid;
      setSavingsWithExtra({ months: monthsSaved, interest: Math.max(0, interestSaved) });
    } else {
      setSavingsWithExtra({ months: 0, interest: 0 });
    }

    // Generate yearly schedule
    generateSchedule(totalLoanAmount, monthlyRate, monthlyPayment, totalMonths);
  };

  const generateSchedule = (principal: number, monthlyRate: number, monthlyPayment: number, totalMonths: number) => {
    const yearlySchedule: PaymentScheduleRow[] = [];
    let balance = principal;

    for (let year = 1; year <= Math.ceil(totalMonths / 12); year++) {
      const startBalance = balance;
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;

      for (let month = 1; month <= 12 && balance > 0; month++) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = Math.min(monthlyPayment - interestPayment, balance);
        yearlyPrincipal += principalPayment;
        yearlyInterest += interestPayment;
        balance -= principalPayment;
      }

      yearlySchedule.push({
        year,
        startBalance,
        yearlyPayment: yearlyPrincipal + yearlyInterest,
        principalPaid: yearlyPrincipal,
        interestPaid: yearlyInterest,
        endBalance: Math.max(0, balance)
      });

      if (balance <= 0) break;
    }

    setSchedule(yearlySchedule);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  const relatedCalculators = [
    { href: '/us/tools/calculators/debt-payoff-calculator', title: 'Debt Payoff', description: 'Plan debt repayment' },
    { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound growth' },
    { href: '/us/tools/calculators/savings-goal-calculator', title: 'Savings Goal', description: 'Plan savings goals' },
    { href: '/us/tools/calculators/budget-calculator', title: 'Budget Calculator', description: 'Plan your budget' },
    { href: '/us/tools/calculators/personal-loan-calculator', title: 'Personal Loan', description: 'Calculate loan payments' },
    { href: '/us/tools/calculators/investment-calculator', title: 'Investment', description: 'Calculate investment growth' }
  ];

  // Calculate principal vs interest percentages
  const principalPercent = (loanAmount / results.totalPayment) * 100;
  const interestPercent = (results.totalInterest / results.totalPayment) * 100;

  // Chart dimensions and helpers
  const chartWidth = 800;
  const chartHeight = 300;
  const chartPadding = { top: 20, right: 30, bottom: 40, left: 70 };
  const plotWidth = chartWidth - chartPadding.left - chartPadding.right;
  const plotHeight = chartHeight - chartPadding.top - chartPadding.bottom;

  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  const maxBalance = schedule.length > 0 ? Math.max(...schedule.map(s => s.startBalance)) * 1.1 : loanAmount;

  return (
    <div className="max-w-[1200px] mx-auto px-3 xs:px-2 sm:px-4 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3">{getH1('Student Loan Calculator')}</h1>
        <p className="text-sm sm:text-base text-gray-600">Calculate payments, total cost, and explore repayment strategies</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Calculator */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-4 md:mb-6">
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          {/* Input Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Loan Details</h2>

            {/* Loan Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loan Type</label>
              <div className="grid grid-cols-2 gap-2">
                {loanTypes.map((type) => (
                  <button
                    key={type.type}
                    onClick={() => setLoanType(type.type)}
                    className={`p-3 text-left rounded-lg border-2 transition-all ${
                      loanType === type.type
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-sm font-medium">{type.label}</div>
                    <div className="text-xs text-gray-500">{type.rate}% APR</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Loan Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1000"
                  step="1000"
                />
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                max="20"
                step="0.1"
              />
            </div>

            {/* Loan Term */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loan Term (Years)</label>
              <input
                type="range"
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                min="5"
                max="25"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5 years</span>
                <span className="font-semibold text-blue-600">{loanTerm} years</span>
                <span>25 years</span>
              </div>
            </div>

            {/* Grace Period */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grace Period (Months)</label>
              <input
                type="number"
                value={gracePeriod}
                onChange={(e) => setGracePeriod(Number(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                max="12"
              />
            </div>

            {/* Extra Payment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Extra Monthly Payment</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={extraPayment}
                  onChange={(e) => setExtraPayment(Number(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  step="25"
                />
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Loan Summary</h2>

            {/* Monthly Payment */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-4 md:p-6 border-2 border-blue-200">
              <div className="text-sm text-blue-600 mb-1">Monthly Payment</div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-700">{formatCurrency(results.monthlyPayment)}</div>
              <div className="text-sm text-blue-600 mt-2">Payoff by {results.payoffDate}</div>
            </div>

            {/* Cost Breakdown */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-xs text-gray-500">Principal</div>
                <div className="text-lg font-bold text-gray-800">{formatCurrency(loanAmount)}</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-xs text-orange-600">Total Interest</div>
                <div className="text-lg font-bold text-orange-600">{formatCurrency(results.totalInterest)}</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-xs text-purple-600">Grace Interest</div>
                <div className="text-lg font-bold text-purple-600">{formatCurrency(results.graceInterest)}</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-xs text-green-600">Total Payment</div>
                <div className="text-lg font-bold text-green-600">{formatCurrency(results.totalPayment)}</div>
              </div>
            </div>

            {/* Principal vs Interest */}
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Principal vs Interest</div>
              <div className="flex h-4 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500"
                  style={{ width: `${principalPercent}%` }}
                ></div>
                <div
                  className="bg-orange-500"
                  style={{ width: `${interestPercent}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-xs">
                <span className="text-blue-600">Principal: {principalPercent.toFixed(1)}%</span>
                <span className="text-orange-600">Interest: {interestPercent.toFixed(1)}%</span>
              </div>
            </div>

            {/* Extra Payment Savings */}
            {extraPayment > 0 && (
              <div className="bg-green-100 rounded-lg p-4 border border-green-200">
                <h3 className="text-sm font-semibold text-green-800 mb-2">Extra Payment Savings</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-green-600">Time Saved</div>
                    <div className="font-bold text-green-800">{savingsWithExtra.months} months</div>
                  </div>
                  <div>
                    <div className="text-green-600">Interest Saved</div>
                    <div className="font-bold text-green-800">{formatCurrency(savingsWithExtra.interest)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loan Balance Over Time Chart */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-4 md:mb-6">Loan Balance Over Time</h2>

        <div className="overflow-x-auto relative">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto"
            style={{ minHeight: '300px' }}
          >
            <defs>
              <linearGradient id="studentLoanBalanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const y = chartPadding.top + plotHeight - ratio * plotHeight;
              const value = maxBalance * ratio;
              return (
                <g key={i}>
                  <line
                    x1={chartPadding.left}
                    y1={y}
                    x2={chartWidth - chartPadding.right}
                    y2={y}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    strokeDasharray="4"
                  />
                  <text
                    x={chartPadding.left - 10}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="12"
                    fill="#6b7280"
                  >
                    {formatCurrency(value)}
                  </text>
                </g>
              );
            })}

            {/* X-axis labels */}
            {schedule.map((s, i) => {
              if (i % Math.ceil(schedule.length / 8) === 0 || i === schedule.length - 1) {
                const x = chartPadding.left + (i / Math.max(schedule.length - 1, 1)) * plotWidth;
                return (
                  <text
                    key={i}
                    x={x}
                    y={chartHeight - chartPadding.bottom + 20}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#6b7280"
                  >
                    Yr {s.year}
                  </text>
                );
              }
              return null;
            })}

            {/* Balance area */}
            {schedule.length > 1 && (
              <>
                <path
                  d={(() => {
                    const points = schedule.map((s, i) => {
                      const x = chartPadding.left + (i / Math.max(schedule.length - 1, 1)) * plotWidth;
                      const y = chartPadding.top + plotHeight - (s.endBalance / maxBalance) * plotHeight;
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ');
                    const lastX = chartPadding.left + plotWidth;
                    const bottomY = chartPadding.top + plotHeight;
                    return `${points} L ${lastX} ${bottomY} L ${chartPadding.left} ${bottomY} Z`;
                  })()}
                  fill="url(#studentLoanBalanceGradient)"
                />
                <path
                  d={schedule.map((s, i) => {
                    const x = chartPadding.left + (i / Math.max(schedule.length - 1, 1)) * plotWidth;
                    const y = chartPadding.top + plotHeight - (s.endBalance / maxBalance) * plotHeight;
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')}
                  stroke="#3b82f6"
                  strokeWidth="3"
                  fill="none"
                />
              </>
            )}

            {/* Interactive points */}
            {hoveredYear !== null && schedule[hoveredYear] && (
              <circle
                cx={chartPadding.left + (hoveredYear / Math.max(schedule.length - 1, 1)) * plotWidth}
                cy={chartPadding.top + plotHeight - (schedule[hoveredYear].endBalance / maxBalance) * plotHeight}
                r="6"
                fill="#3b82f6"
                stroke="white"
                strokeWidth="2"
              />
            )}

            {/* Interactive overlay */}
            {schedule.map((s, i) => {
              const x = chartPadding.left + (i / Math.max(schedule.length - 1, 1)) * plotWidth;
              return (
                <rect
                  key={i}
                  x={x - (plotWidth / schedule.length) / 2}
                  y={chartPadding.top}
                  width={plotWidth / schedule.length}
                  height={plotHeight}
                  fill="transparent"
                  onMouseEnter={() => setHoveredYear(i)}
                  onMouseLeave={() => setHoveredYear(null)}
                  style={{ cursor: 'pointer' }}
                />
              );
            })}
          </svg>

          {/* Legend */}
          <div className="flex justify-center gap-3 sm:gap-4 md:gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-600">Remaining Balance</span>
            </div>
          </div>

          {/* Tooltip */}
          {hoveredYear !== null && schedule[hoveredYear] && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-semibold text-gray-900 mb-2">Year {schedule[hoveredYear].year}</div>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Principal Paid</div>
                  <div className="font-semibold text-blue-600">{formatCurrency(schedule[hoveredYear].principalPaid)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Interest Paid</div>
                  <div className="font-semibold text-orange-600">{formatCurrency(schedule[hoveredYear].interestPaid)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Yearly Payment</div>
                  <div className="font-semibold text-green-600">{formatCurrency(schedule[hoveredYear].yearlyPayment)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Balance</div>
                  <div className="font-semibold text-indigo-600">{formatCurrency(schedule[hoveredYear].endBalance)}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Principal vs Interest Pie Chart */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-4 md:mb-6">Total Cost Breakdown</h2>

        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 items-center">
          {/* Pie Chart */}
          <div className="flex justify-center">
            <svg viewBox="0 0 200 200" className="w-full max-w-[200px] h-auto">
              <circle cx="100" cy="100" r="80" fill="#3b82f6" />
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="transparent"
                stroke="#f97316"
                strokeWidth="160"
                strokeDasharray={`${interestPercent * 5.027} 502.7`}
                transform="rotate(-90 100 100)"
              />
              <circle cx="100" cy="100" r="50" fill="white" />
              <text x="100" y="95" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#4b5563">
                {formatCurrency(results.totalPayment)}
              </text>
              <text x="100" y="115" textAnchor="middle" fontSize="12" fill="#6b7280">
                Total Cost
              </text>
            </svg>
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="font-medium text-gray-700">Principal Amount</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-blue-700">{formatCurrency(loanAmount)}</div>
                <div className="text-sm text-blue-600">{principalPercent.toFixed(1)}%</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <span className="font-medium text-gray-700">Total Interest</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-orange-700">{formatCurrency(results.totalInterest)}</div>
                <div className="text-sm text-orange-600">{interestPercent.toFixed(1)}%</div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
              <div className="text-sm text-purple-600 mb-1">Grace Period Interest</div>
              <div className="text-xl font-bold text-purple-700">{formatCurrency(results.graceInterest)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Yearly Payment Breakdown Table */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Yearly Payment Breakdown</h2>
          <button
            onClick={() => setShowSchedule(!showSchedule)}
            className="px-4 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
          >
            {showSchedule ? 'Hide Schedule' : 'Show Schedule'}
          </button>
        </div>

        {showSchedule && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">Year</th>
                  <th className="text-right py-3 px-2 font-semibold text-gray-700">Start Balance</th>
                  <th className="text-right py-3 px-2 font-semibold text-gray-700">Principal Paid</th>
                  <th className="text-right py-3 px-2 font-semibold text-gray-700">Interest Paid</th>
                  <th className="text-right py-3 px-2 font-semibold text-gray-700">End Balance</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((row, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium text-gray-900">{row.year}</td>
                    <td className="text-right py-3 px-2 text-gray-600">{formatCurrency(row.startBalance)}</td>
                    <td className="text-right py-3 px-2 text-blue-600">{formatCurrency(row.principalPaid)}</td>
                    <td className="text-right py-3 px-2 text-orange-600">{formatCurrency(row.interestPaid)}</td>
                    <td className="text-right py-3 px-2 font-semibold text-indigo-700">{formatCurrency(row.endBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MREC Banners */}
      <CalculatorAfterCalcBanners />

      {/* SEO Content Section */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Understanding Student Loan Repayment</h2>

        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-4">
            Student loans are a significant financial commitment that can impact your budget for years after graduation. Understanding how these loans work, the difference between federal and private options, and your repayment choices can save you thousands of dollars and help you become debt-free faster.
          </p>

          <div className="grid md:grid-cols-2 gap-4 my-6 not-prose">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-semibold text-blue-900 mb-2">Federal Loans</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Fixed interest rates set by Congress</li>
                <li>• Income-driven repayment options</li>
                <li>• Loan forgiveness programs available</li>
                <li>• 6-month grace period after graduation</li>
              </ul>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <h3 className="font-semibold text-purple-900 mb-2">Private Loans</h3>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Variable or fixed rates based on credit</li>
                <li>• Fewer repayment flexibility options</li>
                <li>• No federal forgiveness programs</li>
                <li>• Often require cosigner for students</li>
              </ul>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">Interest Accrues During Grace Period</h3>
          <p className="text-gray-600 mb-4">
            On unsubsidized loans, interest begins accruing immediately—even while you are in school. During the typical 6-month grace period after graduation, this interest capitalizes (adds to your principal), meaning you will pay interest on interest. Making interest-only payments during school and grace periods can significantly reduce your total repayment amount.
          </p>

          <div className="bg-amber-50 p-4 rounded-lg my-6 not-prose">
            <h4 className="font-semibold text-amber-900 mb-2">The Impact of Extra Payments</h4>
            <p className="text-sm text-amber-800">
              Paying just $50 extra per month on a $45,000 loan at 6.5% over 10 years can save you over $2,000 in interest and pay off your loan 14 months early. The earlier you make extra payments, the greater the impact due to reduced interest accumulation.
            </p>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">Choosing the Right Repayment Plan</h3>
          <p className="text-gray-600 mb-4">
            The Standard 10-year plan offers the lowest total cost but highest monthly payments. Extended plans (up to 25 years) reduce monthly payments but significantly increase total interest. Income-driven plans cap payments at 10-20% of discretionary income and offer forgiveness after 20-25 years—ideal for public service careers or those with high debt-to-income ratios.
          </p>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="student-loan-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
{/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Related Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-lg p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
                  {calc.title}
                </h3>
                <p className="text-xs text-gray-500">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
