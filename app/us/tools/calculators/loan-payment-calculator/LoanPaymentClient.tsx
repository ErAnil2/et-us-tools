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

interface Props {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '%' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

interface ScheduleRow {
  payment: number;
  date: string;
  totalPayment: number;
  principal: number;
  interest: number;
  balance: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Loan Payment Calculator?",
    answer: "A Loan Payment Calculator is a free online tool that helps you calculate and analyze loan payment-related financial metrics quickly and accurately. It provides instant results to help you make informed financial decisions.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is this Loan Payment Calculator?",
    answer: "Our Loan Payment Calculator uses standard financial formulas and provides highly accurate results. However, actual results may vary based on specific terms, conditions, and market factors. Always consult with a financial advisor for major decisions.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Loan Payment Calculator free to use?",
    answer: "Yes, this Loan Payment Calculator is completely free to use. There are no hidden charges or registration required. You can use it as many times as you need.",
    order: 3
  },
  {
    id: '4',
    question: "Can I save my Loan Payment calculations?",
    answer: "The calculator displays results instantly on screen. You can take a screenshot or note down the results for your records. Some browsers also allow you to print the page.",
    order: 4
  },
  {
    id: '5',
    question: "What information do I need for this calculator?",
    answer: "You'll need basic information related to loan payment such as amounts, rates, time periods, or other relevant values. The calculator will guide you through each required field.",
    order: 5
  }
];

export default function LoanPaymentClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('loan-payment-calculator');

  const [loanAmount, setLoanAmount] = useState(25000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(5);
  const [termUnit, setTermUnit] = useState<'years' | 'months'>('years');
  const [extraPayment, setExtraPayment] = useState(0);

  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);
  const [payoffTime, setPayoffTime] = useState('');
  const [interestSaved, setInterestSaved] = useState(0);
  const [timeSaved, setTimeSaved] = useState(0);
  const [showSavings, setShowSavings] = useState(false);

  const [comparison15Monthly, setComparison15Monthly] = useState(0);
  const [comparison15Interest, setComparison15Interest] = useState(0);
  const [comparison20Monthly, setComparison20Monthly] = useState(0);
  const [comparison20Interest, setComparison20Interest] = useState(0);
  const [comparison30Monthly, setComparison30Monthly] = useState(0);
  const [comparison30Interest, setComparison30Interest] = useState(0);

  const [schedule, setSchedule] = useState<ScheduleRow[]>([]);
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    calculate();
  }, [loanAmount, interestRate, loanTerm, termUnit, extraPayment]);

  const calculate = () => {
    if (loanAmount <= 0 || interestRate < 0 || loanTerm <= 0) {
      resetResults();
      return;
    }

    // Convert term to months
    const months = termUnit === 'years' ? loanTerm * 12 : loanTerm;
    const monthlyRate = interestRate / 100 / 12;

    // Calculate monthly payment
    let monthlyPmt;
    if (monthlyRate === 0) {
      monthlyPmt = loanAmount / months;
    } else {
      monthlyPmt = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);
    }

    // Calculate totals without extra payment
    const totalPmt = monthlyPmt * months;
    const totalInt = totalPmt - loanAmount;

    // Calculate with extra payment
    let balance = loanAmount;
    let totalPaid = 0;
    let totalInterestPaid = 0;
    let paymentCount = 0;
    const scheduleData: ScheduleRow[] = [];

    while (balance > 0.01 && paymentCount < months * 2) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = Math.min(monthlyPmt - interestPayment + extraPayment, balance);
      const totalPayment = interestPayment + principalPayment;

      balance -= principalPayment;
      totalPaid += totalPayment;
      totalInterestPaid += interestPayment;
      paymentCount++;

      scheduleData.push({
        payment: paymentCount,
        date: getPaymentDate(paymentCount),
        totalPayment: totalPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: balance
      });
    }

    setMonthlyPayment(monthlyPmt);
    setTotalInterest(totalInterestPaid);
    setTotalPayments(totalPaid);

    const years = Math.floor(paymentCount / 12);
    const remainingMonths = paymentCount % 12;
    let payoffText = '';
    if (years > 0) payoffText += `${years} year${years !== 1 ? 's' : ''}`;
    if (remainingMonths > 0) {
      if (payoffText) payoffText += ' ';
      payoffText += `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
    setPayoffTime(payoffText);

    // Show savings if extra payment
    if (extraPayment > 0) {
      setInterestSaved(totalInt - totalInterestPaid);
      setTimeSaved(months - paymentCount);
      setShowSavings(true);
    } else {
      setShowSavings(false);
    }

    setSchedule(scheduleData);
    updateComparisons();
  };

  const resetResults = () => {
    setMonthlyPayment(0);
    setTotalInterest(0);
    setTotalPayments(0);
    setPayoffTime('');
    setShowSavings(false);
    setSchedule([]);
  };

  const getPaymentDate = (paymentNum: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() + paymentNum);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const updateComparisons = () => {
    if (loanAmount <= 0 || interestRate <= 0) {
      setComparison15Monthly(0);
      setComparison15Interest(0);
      setComparison20Monthly(0);
      setComparison20Interest(0);
      setComparison30Monthly(0);
      setComparison30Interest(0);
      return;
    }

    const monthlyRate = interestRate / 100 / 12;

    [15, 20, 30].forEach(years => {
      const months = years * 12;
      let monthlyPmt;

      if (monthlyRate === 0) {
        monthlyPmt = loanAmount / months;
      } else {
        monthlyPmt = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1);
      }

      const totalPmt = monthlyPmt * months;
      const totalInt = totalPmt - loanAmount;

      if (years === 15) {
        setComparison15Monthly(monthlyPmt);
        setComparison15Interest(totalInt);
      } else if (years === 20) {
        setComparison20Monthly(monthlyPmt);
        setComparison20Interest(totalInt);
      } else if (years === 30) {
        setComparison30Monthly(monthlyPmt);
        setComparison30Interest(totalInt);
      }
    });
  };

  const setPreset = (amount: number, rate: number, term: number, unit: 'years' | 'months') => {
    setLoanAmount(amount);
    setInterestRate(rate);
    setLoanTerm(term);
    setTermUnit(unit);
    setExtraPayment(0);
  };

  const getDisplaySchedule = () => {
    if (!schedule.length) return [];

    if (viewMode === 'monthly') {
      return schedule.slice(0, 12);
    } else {
      // Group by year
      const yearlyData: { [key: number]: ScheduleRow } = {};

      schedule.forEach(payment => {
        const year = Math.ceil(payment.payment / 12);
        if (!yearlyData[year]) {
          yearlyData[year] = {
            payment: year,
            date: `Year ${year}`,
            totalPayment: 0,
            principal: 0,
            interest: 0,
            balance: 0
          };
        }

        yearlyData[year].totalPayment += payment.totalPayment;
        yearlyData[year].principal += payment.principal;
        yearlyData[year].interest += payment.interest;
        yearlyData[year].balance = payment.balance;
      });

      return Object.values(yearlyData);
    }
  };

  // Chart dimensions and helpers
  const chartWidth = 800;
  const chartHeight = 300;
  const chartPadding = { top: 20, right: 30, bottom: 40, left: 70 };
  const plotWidth = chartWidth - chartPadding.left - chartPadding.right;
  const plotHeight = chartHeight - chartPadding.top - chartPadding.bottom;

  const [hoveredPayment, setHoveredPayment] = useState<number | null>(null);

  const maxPayment = schedule.length > 0 ? Math.max(...schedule.map(s => s.totalPayment)) * 1.1 : monthlyPayment * 1.1;
  const maxBalance = loanAmount * 1.1;

  const principalPercent = totalPayments > 0 ? (loanAmount / totalPayments) * 100 : 50;
  const interestPercent = totalPayments > 0 ? (totalInterest / totalPayments) * 100 : 50;

  return (
    <div className="max-w-[1180px] mx-auto p-3 sm:p-4 md:p-6">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Loan Payment Calculator Online')}</h1>
        <p className="text-lg text-gray-600">Calculate monthly loan payments, total interest, and amortization schedules</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Loan Details</h2>

            {/* Loan Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500 text-lg">$</span>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  step="100"
                  min="0"
                />
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Annual Interest Rate</label>
              <div className="relative">
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                  className="w-full pr-8 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  max="50"
                />
                <span className="absolute right-3 top-3 text-gray-500 text-lg">%</span>
              </div>
            </div>

            {/* Loan Term */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loan Term</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(parseFloat(e.target.value) || 0)}
                  className="flex-1 px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="1"
                  max="50"
                />
                <select
                  value={termUnit}
                  onChange={(e) => setTermUnit(e.target.value as 'years' | 'months')}
                  className="px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>

            {/* Loan Type Presets */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Common Loan Types</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPreset(25000, 7.5, 5, 'years')}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  Auto Loan<br /><span className="text-xs text-gray-500">5 years, 7.5%</span>
                </button>

                <button
                  onClick={() => setPreset(300000, 6.5, 30, 'years')}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  Mortgage<br /><span className="text-xs text-gray-500">30 years, 6.5%</span>
                </button>

                <button
                  onClick={() => setPreset(10000, 12, 3, 'years')}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  Personal Loan<br /><span className="text-xs text-gray-500">3 years, 12%</span>
                </button>

                <button
                  onClick={() => setPreset(50000, 5, 10, 'years')}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  Student Loan<br /><span className="text-xs text-gray-500">10 years, 5%</span>
                </button>
              </div>
            </div>

            {/* Extra Payment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Extra Monthly Payment (Optional)</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500 text-lg">$</span>
                <input
                  type="number"
                  value={extraPayment}
                  onChange={(e) => setExtraPayment(parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  step="10"
                  min="0"
                />
              </div>
              <div className="text-sm text-gray-500 mt-1">Additional principal payment each month</div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Results</h3>

              <div className="space-y-4">
                {/* Monthly Payment */}
                <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-blue-800">Monthly Payment:</span>
                    <span className="text-2xl font-bold text-blue-600">${Math.round(monthlyPayment).toLocaleString()}</span>
                  </div>
                </div>

                {/* Total Interest */}
                <div className="flex justify-between items-center p-4 bg-white rounded-lg border">
                  <span className="text-gray-600">Total Interest:</span>
                  <span className="text-xl font-bold text-red-600">${Math.round(totalInterest).toLocaleString()}</span>
                </div>

                {/* Total Payment */}
                <div className="flex justify-between items-center p-4 bg-white rounded-lg border">
                  <span className="text-gray-600">Total of Payments:</span>
                  <span className="text-xl font-bold text-gray-800">${Math.round(totalPayments).toLocaleString()}</span>
                </div>
{/* Payoff Time */}
                <div className="flex justify-between items-center p-4 bg-white rounded-lg border">
                  <span className="text-gray-600">Payoff Time:</span>
                  <span className="font-semibold">{payoffTime}</span>
                </div>

                {/* Interest Savings */}
                {showSavings && (
                  <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                    <div className="text-sm font-medium text-green-800 mb-2">With Extra Payment:</div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-700">Interest Saved:</span>
                        <span className="font-semibold">${Math.round(interestSaved).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-green-700">Time Saved:</span>
                        <span className="font-semibold">{timeSaved} months</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Breakdown Over Time Chart */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Payment Breakdown Over Time</h2>

        <div className="overflow-x-auto relative">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto"
            style={{ minHeight: '300px' }}
          >
            <defs>
              <linearGradient id="principalGradientLoan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="interestGradientLoan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const y = chartPadding.top + plotHeight - ratio * plotHeight;
              const value = maxPayment * ratio;
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
                    ${Math.round(value).toLocaleString()}
                  </text>
                </g>
              );
            })}

            {/* X-axis labels */}
            {schedule.slice(0, 12).map((s, i) => {
              if (i % 2 === 0 || i === 11) {
                const x = chartPadding.left + (i / 11) * plotWidth;
                return (
                  <text
                    key={i}
                    x={x}
                    y={chartHeight - chartPadding.bottom + 20}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#6b7280"
                  >
                    M{s.payment}
                  </text>
                );
              }
              return null;
            })}

            {/* Stacked area chart */}
            {schedule.length > 1 && (
              <>
                {/* Principal area */}
                <path
                  d={(() => {
                    const points = schedule.slice(0, 12).map((s, i) => {
                      const x = chartPadding.left + (i / 11) * plotWidth;
                      const y = chartPadding.top + plotHeight - (s.principal / maxPayment) * plotHeight;
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ');
                    const lastX = chartPadding.left + plotWidth;
                    const bottomY = chartPadding.top + plotHeight;
                    return `${points} L ${lastX} ${bottomY} L ${chartPadding.left} ${bottomY} Z`;
                  })()}
                  fill="url(#principalGradientLoan)"
                />

                {/* Interest area (stacked on top) */}
                <path
                  d={(() => {
                    const points = schedule.slice(0, 12).map((s, i) => {
                      const x = chartPadding.left + (i / 11) * plotWidth;
                      const y = chartPadding.top + plotHeight - ((s.principal + s.interest) / maxPayment) * plotHeight;
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ');
                    const baseLine = schedule.slice(0, 12).map((s, i) => {
                      const x = chartPadding.left + ((11 - i) / 11) * plotWidth;
                      const y = chartPadding.top + plotHeight - (s.principal / maxPayment) * plotHeight;
                      return `L ${x} ${y}`;
                    }).reverse().join(' ');
                    return `${points} ${baseLine} Z`;
                  })()}
                  fill="url(#interestGradientLoan)"
                />

                {/* Border lines */}
                <path
                  d={schedule.slice(0, 12).map((s, i) => {
                    const x = chartPadding.left + (i / 11) * plotWidth;
                    const y = chartPadding.top + plotHeight - (s.principal / maxPayment) * plotHeight;
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d={schedule.slice(0, 12).map((s, i) => {
                    const x = chartPadding.left + (i / 11) * plotWidth;
                    const y = chartPadding.top + plotHeight - ((s.principal + s.interest) / maxPayment) * plotHeight;
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')}
                  stroke="#f97316"
                  strokeWidth="2"
                  fill="none"
                />
              </>
            )}

            {/* Interactive hover */}
            {hoveredPayment !== null && schedule[hoveredPayment] && (
              <line
                x1={chartPadding.left + (hoveredPayment / 11) * plotWidth}
                y1={chartPadding.top}
                x2={chartPadding.left + (hoveredPayment / 11) * plotWidth}
                y2={chartPadding.top + plotHeight}
                stroke="#6b7280"
                strokeWidth="1"
                strokeDasharray="4"
              />
            )}

            {/* Interactive overlay */}
            {schedule.slice(0, 12).map((s, i) => {
              const x = chartPadding.left + (i / 11) * plotWidth;
              return (
                <rect
                  key={i}
                  x={x - (plotWidth / 12) / 2}
                  y={chartPadding.top}
                  width={plotWidth / 12}
                  height={plotHeight}
                  fill="transparent"
                  onMouseEnter={() => setHoveredPayment(i)}
                  onMouseLeave={() => setHoveredPayment(null)}
                  style={{ cursor: 'pointer' }}
                />
              );
            })}
          </svg>

          {/* Legend */}
          <div className="flex justify-center gap-3 sm:gap-4 md:gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-600">Principal Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="text-sm text-gray-600">Interest Payment</span>
            </div>
          </div>

          {/* Tooltip */}
          {hoveredPayment !== null && schedule[hoveredPayment] && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-semibold text-gray-900 mb-2">Payment #{schedule[hoveredPayment].payment} - {schedule[hoveredPayment].date}</div>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">Payment</div>
                  <div className="font-semibold text-gray-800">${Math.round(schedule[hoveredPayment].totalPayment).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-500">Principal</div>
                  <div className="font-semibold text-blue-600">${Math.round(schedule[hoveredPayment].principal).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-500">Interest</div>
                  <div className="font-semibold text-orange-600">${Math.round(schedule[hoveredPayment].interest).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-500">Balance</div>
                  <div className="font-semibold text-indigo-600">${Math.round(schedule[hoveredPayment].balance).toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Total Cost Breakdown Pie Chart */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Total Loan Cost Breakdown</h2>

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
                ${Math.round(totalPayments).toLocaleString()}
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
                <div className="font-bold text-blue-700">${loanAmount.toLocaleString()}</div>
                <div className="text-sm text-blue-600">{principalPercent.toFixed(1)}%</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <span className="font-medium text-gray-700">Total Interest</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-orange-700">${Math.round(totalInterest).toLocaleString()}</div>
                <div className="text-sm text-orange-600">{interestPercent.toFixed(1)}%</div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
              <div className="text-sm text-green-600 mb-1">Payoff Time</div>
              <div className="text-xl font-bold text-green-700">{payoffTime}</div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* Amortization Schedule */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="flex justify-between items-center mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Amortization Schedule</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('monthly')}
              className={`px-2 py-2 rounded-lg transition-colors ${viewMode === 'monthly' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setViewMode('yearly')}
              className={`px-2 py-2 rounded-lg transition-colors ${viewMode === 'yearly' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Schedule Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-2 py-3 text-left font-medium text-gray-700">Payment #</th>
                <th className="px-2 py-3 text-left font-medium text-gray-700">Payment Date</th>
                <th className="px-2 py-3 text-left font-medium text-gray-700">Payment</th>
                <th className="px-2 py-3 text-left font-medium text-gray-700">Principal</th>
                <th className="px-2 py-3 text-left font-medium text-gray-700">Interest</th>
                <th className="px-2 py-3 text-left font-medium text-gray-700">Balance</th>
              </tr>
            </thead>
            <tbody>
              {getDisplaySchedule().map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-2 py-2">{row.payment}</td>
                  <td className="px-2 py-2">{row.date}</td>
                  <td className="px-2 py-2">${Math.round(row.totalPayment).toLocaleString()}</td>
                  <td className="px-2 py-2 text-blue-600">${Math.round(row.principal).toLocaleString()}</td>
                  <td className="px-2 py-2 text-red-600">${Math.round(row.interest).toLocaleString()}</td>
                  <td className="px-2 py-2">${Math.round(row.balance).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          * {viewMode === 'monthly' ? 'Showing first 12 payments. Switch to yearly view to see full term summary.' : 'Showing yearly summary.'}
        </div>
      </div>

      {/* Loan Comparison */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Loan Comparison</h2>

        <div className="grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          <div className="bg-blue-50 rounded-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">15-Year Loan</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-blue-700">Monthly Payment:</span>
                <span className="font-semibold">
                  {comparison15Monthly > 0 ? `$${Math.round(comparison15Monthly).toLocaleString()}` : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Total Interest:</span>
                <span className="font-semibold">
                  {comparison15Interest > 0 ? `$${Math.round(comparison15Interest).toLocaleString()}` : '-'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-4">20-Year Loan</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-green-700">Monthly Payment:</span>
                <span className="font-semibold">
                  {comparison20Monthly > 0 ? `$${Math.round(comparison20Monthly).toLocaleString()}` : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Total Interest:</span>
                <span className="font-semibold">
                  {comparison20Interest > 0 ? `$${Math.round(comparison20Interest).toLocaleString()}` : '-'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-lg font-semibold text-purple-800 mb-4">30-Year Loan</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-purple-700">Monthly Payment:</span>
                <span className="font-semibold">
                  {comparison30Monthly > 0 ? `$${Math.round(comparison30Monthly).toLocaleString()}` : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-700">Total Interest:</span>
                <span className="font-semibold">
                  {comparison30Interest > 0 ? `$${Math.round(comparison30Interest).toLocaleString()}` : '-'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Financial Calculators</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {relatedCalculators.map((calc, index) => (
            <Link key={index} href={calc.href} className="block p-3 sm:p-4 md:p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-2">{calc.title}</h3>
              <p className="text-sm text-gray-600">{calc.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Understanding Loan Payment Calculations</h2>

        <div className="prose max-w-none">
          <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
            Understanding how loan payments work is essential for making informed borrowing decisions. Your monthly payment consists of two parts: principal (the amount that reduces your balance) and interest (the cost of borrowing). This calculator helps you see exactly how your payment is allocated and how much you&apos;ll pay over the life of the loan.
          </p>

          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
              <h4 className="font-semibold text-blue-800 mb-2">The Loan Payment Formula</h4>
              <p className="font-mono text-sm text-blue-700 mb-2">M = P × (r × (1+r)^n) / ((1+r)^n - 1)</p>
              <p className="text-sm text-blue-600">Where M = Monthly Payment, P = Principal, r = Monthly Rate, n = Number of Payments</p>
            </div>
            <div className="bg-green-50 p-5 rounded-xl border border-green-100">
              <h4 className="font-semibold text-green-800 mb-2">Payment Breakdown</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Early payments are mostly interest</li>
                <li>• Later payments are mostly principal</li>
                <li>• Extra payments reduce principal faster</li>
                <li>• Shorter terms mean less total interest</li>
              </ul>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Strategies to Reduce Loan Costs</h3>
          <div className="space-y-3 mb-3 sm:mb-4 md:mb-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-gray-800">Make Extra Principal Payments</h4>
              <p className="text-gray-600 text-sm">Even small extra payments can save thousands in interest and shorten your loan term significantly.</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-gray-800">Choose a Shorter Term</h4>
              <p className="text-gray-600 text-sm">While monthly payments are higher, 15-year loans have lower rates and save tens of thousands in interest.</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold text-gray-800">Refinance When Rates Drop</h4>
              <p className="text-gray-600 text-sm">If rates fall 0.5-1% below your current rate, refinancing may save money even with closing costs.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>

        <div className="space-y-5">
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2">How is my monthly loan payment calculated?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your monthly payment is calculated using an amortization formula that factors in the loan amount, interest rate, and term length. The formula ensures that with equal monthly payments, your loan is fully paid off by the end of the term. Each payment includes both interest on the remaining balance and principal reduction.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2">Why does most of my early payment go toward interest?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Interest is calculated on your remaining balance each month. At the start of your loan, the balance is highest, so the interest portion is largest. As you pay down the principal over time, less interest accrues each month, and more of your payment goes toward reducing the balance. This is why making extra principal payments early in the loan saves the most money.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2">How much can I save by making extra payments?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Extra payments can have a dramatic impact. For example, adding $100 extra to a $300,000 mortgage at 6.5% could save you over $47,000 in interest and pay off the loan 4 years early. The earlier you start making extra payments, the more you save because of how compound interest works.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-semibold text-gray-800 mb-2">Should I choose a 15-year or 30-year loan term?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              A 15-year loan has higher monthly payments but lower interest rates and saves tens of thousands in total interest. A 30-year loan offers lower required payments and more flexibility. If you can comfortably afford the higher payment, 15 years is usually better financially. However, some prefer the 30-year option while making extra payments—this provides flexibility if finances become tight.
            </p>
          </div>

          <div className="pb-2">
            <h3 className="text-base font-semibold text-gray-800 mb-2">How do biweekly payments save money?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Biweekly payments (half your monthly payment every two weeks) result in 26 half-payments per year, which equals 13 full monthly payments instead of 12. This extra payment goes directly to principal each year. On a 30-year mortgage, biweekly payments can shave off about 4-5 years and save significant interest—all without dramatically changing your budget.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="loan-payment-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
