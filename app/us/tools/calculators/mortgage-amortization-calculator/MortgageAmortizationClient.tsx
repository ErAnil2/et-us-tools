'use client';

import { useState, useEffect } from 'react';
import { FirebaseFAQs } from '@/components/PageSEOContent';

import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
}

interface AmortizationRow {
  paymentNum: number;
  date: string;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

interface MortgageAmortizationClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '📊' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Mortgage Amortization Calculator?",
    answer: "A Mortgage Amortization Calculator is a free online tool that helps you calculate and analyze mortgage amortization-related financial metrics quickly and accurately. It provides instant results to help you make informed financial decisions.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is this Mortgage Amortization Calculator?",
    answer: "Our Mortgage Amortization Calculator uses standard financial formulas and provides highly accurate results. However, actual results may vary based on specific terms, conditions, and market factors. Always consult with a financial advisor for major decisions.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Mortgage Amortization Calculator free to use?",
    answer: "Yes, this Mortgage Amortization Calculator is completely free to use. There are no hidden charges or registration required. You can use it as many times as you need.",
    order: 3
  },
  {
    id: '4',
    question: "Can I save my Mortgage Amortization calculations?",
    answer: "The calculator displays results instantly on screen. You can take a screenshot or note down the results for your records. Some browsers also allow you to print the page.",
    order: 4
  },
  {
    id: '5',
    question: "What information do I need for this calculator?",
    answer: "You'll need basic information related to mortgage amortization such as amounts, rates, time periods, or other relevant values. The calculator will guide you through each required field.",
    order: 5
  }
];

export default function MortgageAmortizationClient({ relatedCalculators = defaultRelatedCalculators }: MortgageAmortizationClientProps) {
  const { getH1, getSubHeading } = usePageSEO('mortgage-amortization-calculator');

  const [loanAmount, setLoanAmount] = useState(300000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [startDate, setStartDate] = useState('');
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  // Calculated values
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [schedule, setSchedule] = useState<AmortizationRow[]>([]);
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  // Set default start date to next month
  useEffect(() => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const year = nextMonth.getFullYear();
    const month = String(nextMonth.getMonth() + 1).padStart(2, '0');
    setStartDate(`${year}-${month}`);
  }, []);

  useEffect(() => {
    if (!loanAmount || !interestRate || !loanTerm || !startDate) {
      return;
    }

    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;

    // Calculate monthly payment: M = P × [r(1+r)^n] / [(1+r)^n - 1]
    const payment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                    (Math.pow(1 + monthlyRate, numPayments) - 1);

    let balance = loanAmount;
    let interest = 0;
    const amortSchedule: AmortizationRow[] = [];

    // Generate amortization schedule
    for (let i = 1; i <= numPayments; i++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = payment - interestPayment;
      balance -= principalPayment;
      interest += interestPayment;

      const paymentDate = new Date(startDate + '-01');
      paymentDate.setMonth(paymentDate.getMonth() + i - 1);

      amortSchedule.push({
        paymentNum: i,
        date: paymentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        payment: payment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance)
      });
    }

    setMonthlyPayment(payment);
    setTotalPayments(payment * numPayments);
    setTotalInterest(interest);
    setSchedule(amortSchedule);
  }, [loanAmount, interestRate, loanTerm, startDate]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const exportToCSV = () => {
    if (!schedule.length) return;

    const headers = ['Payment #', 'Date', 'Payment', 'Principal', 'Interest', 'Balance'];
    const csvContent = [
      headers.join(','),
      ...schedule.map(row =>
        `${row.paymentNum},${row.date},${row.payment.toFixed(2)},${row.principal.toFixed(2)},${row.interest.toFixed(2)},${row.balance.toFixed(2)}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'amortization_schedule.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const displayedSchedule = showFullSchedule ? schedule : schedule.slice(0, 120);

  return (
    <div className="max-w-[1180px] mx-auto p-3 sm:p-4 md:p-6">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Mortgage Amortization Calculator')}</h1>
        <p className="text-lg text-gray-600">
          Calculate your mortgage amortization schedule with detailed monthly payment breakdown showing principal, interest, and remaining balance.
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Enter Loan Details</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount ($)</label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                step="1000"
                min="1000"
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Annual Interest Rate (%)</label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                step="0.01"
                min="0.1"
                max="50"
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loan Term (Years)</label>
              <select
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="30">30 Years</option>
                <option value="15">15 Years</option>
                <option value="20">20 Years</option>
                <option value="25">25 Years</option>
                <option value="10">10 Years</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Payment Date</label>
              <input
                type="month"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Summary</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Monthly Payment:</span>
                  <span className="font-semibold text-blue-600">{formatCurrency(monthlyPayment)}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Total Payments:</span>
                  <span className="font-semibold text-green-600">{formatCurrency(totalPayments)}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Total Interest:</span>
                  <span className="font-semibold text-orange-600">{formatCurrency(totalInterest)}</span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Principal Amount:</span>
                  <span className="font-semibold text-purple-600">{formatCurrency(loanAmount)}</span>
                </div>
              </div>
            </div>

            {/* Payment Breakdown */}
            <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 border">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Payment Breakdown</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm text-gray-700">Principal</span>
                  <div className="text-right">
                    <div className="font-semibold text-purple-600">{formatCurrency(loanAmount)}</div>
                    <div className="text-xs text-gray-500">
                      {((loanAmount / totalPayments) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-sm text-gray-700">Total Interest</span>
                  <div className="text-right">
                    <div className="font-semibold text-red-600">{formatCurrency(totalInterest)}</div>
                    <div className="text-xs text-gray-500">
                      {((totalInterest / totalPayments) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mortgage Balance Over Time Chart */}
      {schedule.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Loan Balance Over Time</h3>
          <div className="w-full overflow-x-auto">
            <svg viewBox="0 0 800 300" className="w-full h-auto">
              <defs>
                <linearGradient id="mortgageAmortBalanceGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map((i) => {
                const y = 20 + (i * 260 / 4);
                return (
                  <g key={i}>
                    <line x1="70" y1={y} x2="770" y2={y} stroke="#e5e7eb" strokeWidth="1" />
                    <text x="60" y={y + 5} textAnchor="end" fontSize="12" fill="#6b7280">
                      ${Math.round(loanAmount * (1 - i * 0.25) / 1000)}K
                    </text>
                  </g>
                );
              })}

              {/* X-axis labels */}
              {[0, 0.25, 0.5, 0.75, 1].map((percent, i) => {
                const x = 70 + percent * 700;
                const year = Math.round(loanTerm * percent);
                return (
                  <text key={i} x={x} y="290" textAnchor="middle" fontSize="12" fill="#6b7280">
                    Year {year}
                  </text>
                );
              })}

              {/* Balance area chart */}
              <path
                d={(() => {
                  const points = schedule.map((row, idx) => {
                    const x = 70 + (idx / (schedule.length - 1)) * 700;
                    const y = 20 + (1 - row.balance / loanAmount) * 260;
                    return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ');
                  return `${points} L 770 280 L 70 280 Z`;
                })()}
                fill="url(#mortgageAmortBalanceGradient)"
              />

              {/* Balance line */}
              <path
                d={schedule.map((row, idx) => {
                  const x = 70 + (idx / (schedule.length - 1)) * 700;
                  const y = 20 + (1 - row.balance / loanAmount) * 260;
                  return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ')}
                stroke="#3b82f6"
                strokeWidth="3"
                fill="none"
              />

              {/* Interactive hover points */}
              {schedule.map((row, idx) => {
                const x = 70 + (idx / (schedule.length - 1)) * 700;
                const y = 20 + (1 - row.balance / loanAmount) * 260;
                return (
                  <g key={idx}>
                    <circle
                      cx={x}
                      cy={y}
                      r={hoveredMonth === idx ? 6 : 0}
                      fill="#3b82f6"
                      className="transition-all duration-200"
                    />
                    <rect
                      x={x - 10}
                      y={20}
                      width={20}
                      height={260}
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredMonth(idx)}
                      onMouseLeave={() => setHoveredMonth(null)}
                    />
                  </g>
                );
              })}

              {/* Hover tooltip */}
              {hoveredMonth !== null && schedule[hoveredMonth] && (
                <g>
                  <rect
                    x={70 + (hoveredMonth / (schedule.length - 1)) * 700 - 80}
                    y={5}
                    width="160"
                    height="70"
                    fill="white"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    rx="5"
                  />
                  <text
                    x={70 + (hoveredMonth / (schedule.length - 1)) * 700}
                    y="25"
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="600"
                    fill="#1f2937"
                  >
                    {schedule[hoveredMonth].date}
                  </text>
                  <text
                    x={70 + (hoveredMonth / (schedule.length - 1)) * 700}
                    y="45"
                    textAnchor="middle"
                    fontSize="11"
                    fill="#3b82f6"
                  >
                    Balance: {formatCurrency(schedule[hoveredMonth].balance)}
                  </text>
                  <text
                    x={70 + (hoveredMonth / (schedule.length - 1)) * 700}
                    y="62"
                    textAnchor="middle"
                    fontSize="10"
                    fill="#6b7280"
                  >
                    Payment #{schedule[hoveredMonth].paymentNum}
                  </text>
                </g>
              )}
            </svg>
          </div>
          <p className="text-sm text-gray-600 text-center mt-4">
            Watch your loan balance decrease from {formatCurrency(loanAmount)} to $0 over {loanTerm} years
          </p>
        </div>
      )}

      {/* Principal vs Interest Chart */}
      {schedule.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Principal vs Interest Over Time</h3>
          <div className="w-full overflow-x-auto">
            <svg viewBox="0 0 800 300" className="w-full h-auto">
              <defs>
                <linearGradient id="mortgageAmortPrincipalArea" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
                </linearGradient>
                <linearGradient id="mortgageAmortInterestArea" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.3" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map((i) => {
                const y = 20 + (i * 260 / 4);
                const maxPayment = monthlyPayment * 1.1;
                return (
                  <g key={i}>
                    <line x1="70" y1={y} x2="770" y2={y} stroke="#e5e7eb" strokeWidth="1" />
                    <text x="60" y={y + 5} textAnchor="end" fontSize="12" fill="#6b7280">
                      ${Math.round((maxPayment * (1 - i * 0.25)) / 100) * 100}
                    </text>
                  </g>
                );
              })}

              {/* X-axis labels */}
              {[0, 0.25, 0.5, 0.75, 1].map((percent, i) => {
                const x = 70 + percent * 700;
                const year = Math.round(loanTerm * percent);
                return (
                  <text key={i} x={x} y="290" textAnchor="middle" fontSize="12" fill="#6b7280">
                    Year {year}
                  </text>
                );
              })}

              {/* Principal area (bottom) */}
              <path
                d={(() => {
                  const maxPayment = monthlyPayment * 1.1;
                  const points = schedule.map((row, idx) => {
                    const x = 70 + (idx / (schedule.length - 1)) * 700;
                    const y = 20 + (1 - row.principal / maxPayment) * 260;
                    return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ');
                  return `${points} L 770 280 L 70 280 Z`;
                })()}
                fill="url(#mortgageAmortPrincipalArea)"
              />

              {/* Interest area (top) */}
              <path
                d={(() => {
                  const maxPayment = monthlyPayment * 1.1;
                  const topPoints = schedule.map((row, idx) => {
                    const x = 70 + (idx / (schedule.length - 1)) * 700;
                    const y = 20 + (1 - (row.principal + row.interest) / maxPayment) * 260;
                    return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ');
                  const bottomPoints = schedule.map((row, idx) => {
                    const x = 70 + ((schedule.length - 1 - idx) / (schedule.length - 1)) * 700;
                    const y = 20 + (1 - row.principal / maxPayment) * 260;
                    return `L ${x} ${y}`;
                  }).reverse().join(' ');
                  return `${topPoints} ${bottomPoints} Z`;
                })()}
                fill="url(#mortgageAmortInterestArea)"
              />

              {/* Principal line */}
              <path
                d={schedule.map((row, idx) => {
                  const maxPayment = monthlyPayment * 1.1;
                  const x = 70 + (idx / (schedule.length - 1)) * 700;
                  const y = 20 + (1 - row.principal / maxPayment) * 260;
                  return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ')}
                stroke="#3b82f6"
                strokeWidth="2"
                fill="none"
              />

              {/* Interest line */}
              <path
                d={schedule.map((row, idx) => {
                  const maxPayment = monthlyPayment * 1.1;
                  const x = 70 + (idx / (schedule.length - 1)) * 700;
                  const y = 20 + (1 - (row.principal + row.interest) / maxPayment) * 260;
                  return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ')}
                stroke="#f97316"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
          <div className="flex justify-center gap-3 sm:gap-5 md:gap-8 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-600">Principal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="text-sm text-gray-600">Interest</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 text-center mt-2">
            Early payments are mostly interest. Over time, more goes toward principal
          </p>
        </div>
      )}

      {/* Payment Breakdown Pie Chart */}
      {schedule.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Total Payment Breakdown</h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 sm:gap-5 md:gap-8">
            <svg viewBox="0 0 200 200" className="w-64 h-64">
              <defs>
                <filter id="shadow">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
                </filter>
              </defs>

              {/* Principal slice */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="#3b82f6"
                filter="url(#shadow)"
              />

              {/* Interest slice */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#f97316"
                strokeWidth="160"
                strokeDasharray={`${(totalInterest / totalPayments) * 502.7} 502.7`}
                strokeDashoffset="125.675"
                transform="rotate(-90 100 100)"
                filter="url(#shadow)"
              />

              {/* Center text */}
              <text x="100" y="95" textAnchor="middle" fontSize="16" fontWeight="600" fill="white">
                Total Paid
              </text>
              <text x="100" y="115" textAnchor="middle" fontSize="18" fontWeight="700" fill="white">
                {formatCurrency(totalPayments)}
              </text>
            </svg>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Principal Amount</div>
                  <div className="text-xl font-bold text-gray-800">{formatCurrency(loanAmount)}</div>
                  <div className="text-xs text-gray-500">
                    {((loanAmount / totalPayments) * 100).toFixed(1)}% of total
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">I</span>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Total Interest</div>
                  <div className="text-xl font-bold text-gray-800">{formatCurrency(totalInterest)}</div>
                  <div className="text-xs text-gray-500">
                    {((totalInterest / totalPayments) * 100).toFixed(1)}% of total
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">Monthly Payment</div>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(monthlyPayment)}</div>
                <div className="text-xs text-gray-500">
                  for {loanTerm * 12} months
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* Amortization Table */}
      {schedule.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className="flex justify-between items-center mb-3 sm:mb-4 md:mb-6">
            <h3 className="text-2xl font-semibold text-gray-800">Detailed Amortization Schedule</h3>
            <div className="flex gap-4">
              <button
                onClick={() => setShowFullSchedule(!showFullSchedule)}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                {showFullSchedule ? 'Show Less' : 'Show Full Schedule'}
              </button>
              <button
                onClick={exportToCSV}
                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              >
                Export to CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-2 py-2 text-left">Payment #</th>
                  <th className="px-2 py-2 text-left">Date</th>
                  <th className="px-2 py-2 text-right">Payment</th>
                  <th className="px-2 py-2 text-right">Principal</th>
                  <th className="px-2 py-2 text-right">Interest</th>
                  <th className="px-2 py-2 text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {displayedSchedule.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="px-2 py-2">{row.paymentNum}</td>
                    <td className="px-2 py-2">{row.date}</td>
                    <td className="px-2 py-2 text-right">{formatCurrency(row.payment)}</td>
                    <td className="px-2 py-2 text-right">{formatCurrency(row.principal)}</td>
                    <td className="px-2 py-2 text-right">{formatCurrency(row.interest)}</td>
                    <td className="px-2 py-2 text-right">{formatCurrency(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!showFullSchedule && schedule.length > 120 && (
            <div className="text-center mt-4 text-sm text-gray-500">
              Showing first 120 payments (10 years). Click "Show Full Schedule" to see all {schedule.length} payments.
            </div>
          )}
        </div>
)}

      {/* Information Section */}
      <div className="bg-blue-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">Understanding Mortgage Amortization</h3>
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 text-blue-700">
          <div>
            <h4 className="font-semibold mb-2">Monthly Payment Formula:</h4>
            <p className="mb-4">M = P × [r(1+r)^n] / [(1+r)^n - 1]</p>
            <p className="text-sm mb-4">
              Where: M = Monthly Payment, P = Principal, r = Monthly Interest Rate, n = Number of Payments
            </p>
            <h4 className="font-semibold mb-2">How It Works:</h4>
            <p>
              Each payment is split between principal and interest, with early payments being mostly interest.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Key Benefits:</h4>
            <ul className="space-y-1">
              <li>• See exactly how much you'll pay each month</li>
              <li>• Track how equity builds over time</li>
              <li>• Understand total interest costs</li>
              <li>• Plan for extra principal payments</li>
              <li>• Compare different loan terms</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          {relatedCalculators.map((calc, index) => (
            <a
              key={index}
              href={calc.href}
              className="block p-3 sm:p-4 md:p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl hover:shadow-lg transition-all duration-300 border border-blue-100"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{calc.title}</h3>
              <p className="text-sm text-gray-600">{calc.description}</p>
            </a>
          ))}
        </div>
      </div>

      {/* SEO Content */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Understanding Mortgage Amortization</h2>
        <p className="text-gray-600 mb-4">
          Mortgage amortization is the process of gradually paying off your home loan through scheduled monthly payments.
          Each payment is split between principal (reducing the loan balance) and interest (the cost of borrowing).
          Understanding your amortization schedule is essential for effective financial planning and building home equity.
        </p>

        <p className="text-gray-600 mb-4">
          The amortization schedule shows every payment over the life of your loan, breaking down exactly how much goes toward
          principal versus interest. This transparency helps you make informed decisions about extra payments, refinancing,
          and long-term financial planning.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">How Amortization Works</h3>
        <p className="text-gray-600 mb-4">
          In the early years of your mortgage, most of your monthly payment goes toward interest. As time passes,
          more of each payment is applied to the principal balance. This shift accelerates as you approach the end of your loan term.
          For a 30-year mortgage, it typically takes about 13 years before more of your payment goes to principal than interest.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Benefits of Understanding Your Amortization Schedule</h3>
        <ul className="space-y-2 text-gray-600">
          <li><strong>Payment Planning:</strong> Know exactly how much you&apos;ll pay each month and over the life of the loan</li>
          <li><strong>Interest Savings:</strong> Understand the impact of extra principal payments on total interest</li>
          <li><strong>Equity Building:</strong> Track how your home equity grows over time</li>
          <li><strong>Refinancing Decisions:</strong> Compare current schedule with potential refinancing options</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Tips for Managing Your Mortgage</h3>
        <ul className="space-y-2 text-gray-600">
          <li>• Consider making extra principal payments to reduce total interest paid</li>
          <li>• Review your amortization schedule annually to track progress</li>
          <li>• Understand how refinancing affects your payment schedule</li>
          <li>• Factor in property taxes and insurance when budgeting</li>
        </ul>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">What is the difference between amortization and simple interest?</h3>
            <p className="text-gray-600">
              Amortization distributes payments evenly over the loan term while gradually shifting from interest-heavy to principal-heavy payments. Simple interest calculates interest only on the remaining principal without a structured payment schedule. Amortized loans provide predictable monthly payments, while simple interest loans may have varying payment amounts.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">How do extra payments affect my amortization schedule?</h3>
            <p className="text-gray-600">
              Extra payments go directly toward reducing your principal balance, which decreases the interest charged on future payments. Even small additional payments can significantly reduce your total interest and shorten your loan term. For example, adding $100 monthly to a $300,000 mortgage at 6.5% could save over $50,000 in interest and pay off the loan 5 years early.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">When does my payment shift from mostly interest to mostly principal?</h3>
            <p className="text-gray-600">
              For a typical 30-year mortgage, the crossover point where more of your payment goes to principal than interest occurs around year 13-15, depending on your interest rate. Higher rates mean the crossover happens later. For 15-year mortgages, this shift happens much earlier, often within the first few years.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Should I refinance to a shorter loan term?</h3>
            <p className="text-gray-600">
              Refinancing to a shorter term (like 30 to 15 years) typically offers lower interest rates and dramatically reduces total interest paid. However, monthly payments will be higher. Consider refinancing if you can comfortably afford higher payments, plan to stay in the home long-term, and the rate difference justifies closing costs.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">How does my amortization schedule affect home equity?</h3>
            <p className="text-gray-600">
              Your amortization schedule directly shows your equity growth as principal payments reduce your loan balance. Home equity equals your home&apos;s value minus the remaining mortgage balance. Early in your loan, equity builds slowly due to interest-heavy payments, but accelerates over time as more goes to principal. Home price appreciation also increases equity independently of payments.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="mortgage-amortization-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
</div>
  );
}
