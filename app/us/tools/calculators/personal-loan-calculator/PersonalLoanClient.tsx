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
}

interface PersonalLoanClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '📊' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

interface PaymentRow {
  month: number;
  principal: number;
  interest: number;
  payment: number;
  balance: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a personal loan and how does it work?",
    answer: "A personal loan is an unsecured loan that you repay in fixed monthly installments over a set term (typically 2-7 years). Unlike mortgages or auto loans, personal loans aren't backed by collateral. You receive a lump sum upfront and pay it back with interest.",
    order: 1
  },
  {
    id: '2',
    question: "What credit score do I need for a personal loan?",
    answer: "Most lenders prefer credit scores of 670 or higher for the best rates. Scores of 580-669 may qualify but at higher rates. Excellent credit (720+) can get rates as low as 6-8%, while fair credit might see rates of 15-25%.",
    order: 2
  },
  {
    id: '3',
    question: "What is DTI ratio and why does it matter?",
    answer: "DTI (Debt-to-Income) ratio is your total monthly debt payments divided by your gross monthly income. Most lenders prefer DTI under 36%, with the new loan payment included. A DTI over 43% may result in loan denial.",
    order: 3
  },
  {
    id: '4',
    question: "Should I choose a shorter or longer loan term?",
    answer: "Shorter terms mean higher monthly payments but less total interest paid. Longer terms have lower monthly payments but cost more overall. Choose based on what you can comfortably afford while minimizing total cost.",
    order: 4
  },
  {
    id: '5',
    question: "What fees should I watch out for?",
    answer: "Common fees include: Origination fees (1-6% of loan amount), Late payment fees ($25-50), Prepayment penalties (some lenders charge for paying off early). Always calculate the APR, which includes fees.",
    order: 5
  }
];

export default function PersonalLoanClient({ relatedCalculators = defaultRelatedCalculators }: PersonalLoanClientProps) {
  const { getH1, getSubHeading } = usePageSEO('personal-loan-calculator');

  const [loanAmount, setLoanAmount] = useState(25000);
  const [interestRate, setInterestRate] = useState(12.5);
  const [loanTenure, setLoanTenure] = useState(4);
  const [monthlyIncome, setMonthlyIncome] = useState(5000);
  const [creditScore, setCreditScore] = useState('good');
  const [processingFeePercent, setProcessingFeePercent] = useState(2.5);
  const [extraPayment, setExtraPayment] = useState(0);

  // Calculated values
  const [monthlyEMI, setMonthlyEMI] = useState(0);
  const [processingFeeAmount, setProcessingFeeAmount] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [apr, setAPR] = useState(0);
  const [dtiRatio, setDtiRatio] = useState(0);
  const [dtiStatus, setDtiStatus] = useState('');
  const [dtiClass, setDtiClass] = useState('');
  const [paymentSchedule, setPaymentSchedule] = useState<PaymentRow[]>([]);
  const [showSchedule, setShowSchedule] = useState(true);
  const [savingsWithExtra, setSavingsWithExtra] = useState({ months: 0, interest: 0 });

  const templates = [
    { key: 'debtConsolidation', label: 'Debt Consolidation', amount: 10000, rate: 10.5, icon: '💳' },
    { key: 'homeImprovement', label: 'Home Improvement', amount: 25000, rate: 12.5, icon: '🏠' },
    { key: 'medical', label: 'Medical', amount: 15000, rate: 13.5, icon: '🏥' },
    { key: 'wedding', label: 'Wedding', amount: 30000, rate: 11.5, icon: '💒' },
    { key: 'business', label: 'Business', amount: 20000, rate: 14.0, icon: '💼' },
    { key: 'majorPurchase', label: 'Major Purchase', amount: 35000, rate: 12.0, icon: '🛒' }
  ];

  useEffect(() => {
    calculatePersonalLoan();
  }, [loanAmount, interestRate, loanTenure, monthlyIncome, creditScore, processingFeePercent, extraPayment]);

  const calculatePersonalLoan = () => {
    const monthlyRate = interestRate / 12 / 100;
    const totalMonths = loanTenure * 12;

    // Calculate EMI
    const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);

    // Calculate totals
    const totalPay = emi * totalMonths;
    const totalInt = totalPay - loanAmount;
    const procFee = (loanAmount * processingFeePercent) / 100;

    // Calculate APR
    const totalCost = totalPay + procFee;
    const totalInterestPlusFees = totalCost - loanAmount;
    const aprValue = (totalInterestPlusFees / loanAmount / (totalMonths / 12)) * 100;

    // DTI Ratio
    const dti = (emi / monthlyIncome) * 100;

    setMonthlyEMI(emi);
    setProcessingFeeAmount(procFee);
    setTotalInterest(totalInt);
    setTotalPayment(totalPay);
    setAPR(aprValue);
    setDtiRatio(dti);

    // DTI Assessment
    if (dti <= 20) {
      setDtiStatus('Excellent');
      setDtiClass('text-green-600');
    } else if (dti <= 36) {
      setDtiStatus('Manageable');
      setDtiClass('text-yellow-600');
    } else {
      setDtiStatus('High Risk');
      setDtiClass('text-red-600');
    }

    // Calculate savings with extra payment
    if (extraPayment > 0) {
      const newMonthlyPayment = emi + extraPayment;
      let balance = loanAmount;
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
      const interestSaved = totalPay - totalPaid;
      setSavingsWithExtra({ months: monthsSaved, interest: Math.max(0, interestSaved) });
    } else {
      setSavingsWithExtra({ months: 0, interest: 0 });
    }

    // Generate payment schedule
    generatePaymentSchedule(loanAmount, monthlyRate, totalMonths, emi);
  };

  const generatePaymentSchedule = (principal: number, monthlyRate: number, totalMonths: number, emi: number) => {
    const schedule: PaymentRow[] = [];
    let balance = principal;

    for (let month = 1; month <= totalMonths; month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = emi - interestPayment;
      balance -= principalPayment;

      schedule.push({
        month,
        principal: principalPayment,
        interest: interestPayment,
        payment: emi,
        balance: Math.max(0, balance)
      });
    }

    setPaymentSchedule(schedule);
  };

  const applyTemplate = (template: typeof templates[0]) => {
    setLoanAmount(template.amount);
    setInterestRate(template.rate);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate principal vs interest percentages
  const principalPercent = totalPayment > 0 ? (loanAmount / totalPayment) * 100 : 0;
  const interestPercent = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

  // Chart dimensions and helpers
  const chartWidth = 800;
  const chartHeight = 300;
  const chartPadding = { top: 20, right: 30, bottom: 40, left: 70 };
  const plotWidth = chartWidth - chartPadding.left - chartPadding.right;
  const plotHeight = chartHeight - chartPadding.top - chartPadding.bottom;

  const maxPayment = Math.max(monthlyEMI, ...paymentSchedule.map(p => p.principal), ...paymentSchedule.map(p => p.interest)) * 1.1;

  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  return (
    <div className="max-w-[1200px] mx-auto px-3 xs:px-2 sm:px-4 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3">{getH1('Personal Loan Calculator')}</h1>
        <p className="text-sm sm:text-base text-gray-600">Calculate EMI, total cost, and compare loan purposes</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Calculator */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-4 md:mb-6">
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          {/* Input Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Loan Details</h2>

            {/* Loan Templates */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quick Templates</label>
              <div className="grid grid-cols-3 gap-2">
                {templates.map((template) => (
                  <button
                    key={template.key}
                    onClick={() => applyTemplate(template)}
                    className="p-2 text-xs border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
                  >
                    <span className="block text-lg">{template.icon}</span>
                    <span className="block text-gray-700">{template.label}</span>
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
                  max="100000"
                  step="1000"
                />
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (APR %)</label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                max="36"
                step="0.1"
              />
            </div>

            {/* Loan Tenure */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loan Term (Years)</label>
              <input
                type="number"
                value={loanTenure}
                onChange={(e) => setLoanTenure(Number(e.target.value) || 1)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                max="7"
              />
            </div>

            {/* Monthly Income */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Income (for DTI)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  step="100"
                />
              </div>
            </div>

            {/* Processing Fee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Processing Fee (%)</label>
              <input
                type="number"
                value={processingFeePercent}
                onChange={(e) => setProcessingFeePercent(Number(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                max="10"
                step="0.1"
              />
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Loan Summary</h2>

            {/* Monthly EMI */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-4 md:p-6 border-2 border-blue-200">
              <div className="text-sm text-blue-600 mb-1">Monthly EMI</div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-700">{formatCurrency(monthlyEMI)}</div>
              <div className="text-sm text-blue-600 mt-2">per month for {loanTenure * 12} months</div>
            </div>

            {/* Cost Breakdown */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-xs text-gray-500">Principal</div>
                <div className="text-lg font-bold text-gray-800">{formatCurrency(loanAmount)}</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-xs text-orange-600">Total Interest</div>
                <div className="text-lg font-bold text-orange-600">{formatCurrency(totalInterest)}</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-xs text-purple-600">Processing Fee</div>
                <div className="text-lg font-bold text-purple-600">{formatCurrency(processingFeeAmount)}</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-xs text-green-600">Total Payment</div>
                <div className="text-lg font-bold text-green-600">{formatCurrency(totalPayment)}</div>
              </div>
            </div>

            {/* DTI Ratio */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Debt-to-Income Ratio</span>
                <span className={`font-bold ${dtiClass}`}>{dtiRatio.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className={`h-2 rounded-full ${dtiRatio <= 20 ? 'bg-green-500' : dtiRatio <= 36 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(dtiRatio, 100)}%` }}
                ></div>
              </div>
              <div className={`text-sm ${dtiClass}`}>{dtiStatus}</div>
            </div>

            {/* Principal vs Interest Chart */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Principal vs Interest</h3>
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
          </div>
        </div>
      </div>

      {/* Amortization Chart */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-4 md:mb-6">Principal vs Interest Breakdown Over Time</h2>

        <div className="overflow-x-auto relative">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto"
            style={{ minHeight: '300px' }}
          >
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
                    {formatCurrency(value)}
                  </text>
                </g>
              );
            })}

            {/* X-axis labels */}
            {paymentSchedule.map((p, i) => {
              if (i % Math.ceil(paymentSchedule.length / 8) === 0 || i === paymentSchedule.length - 1) {
                const x = chartPadding.left + (i / (paymentSchedule.length - 1)) * plotWidth;
                return (
                  <text
                    key={i}
                    x={x}
                    y={chartHeight - chartPadding.bottom + 20}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#6b7280"
                  >
                    M{p.month}
                  </text>
                );
              }
              return null;
            })}

            {/* Stacked area chart */}
            {paymentSchedule.length > 1 && (
              <>
                {/* Principal area */}
                <path
                  d={(() => {
                    const points = paymentSchedule.map((p, i) => {
                      const x = chartPadding.left + (i / (paymentSchedule.length - 1)) * plotWidth;
                      const y = chartPadding.top + plotHeight - (p.principal / maxPayment) * plotHeight;
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ');
                    const lastX = chartPadding.left + plotWidth;
                    const bottomY = chartPadding.top + plotHeight;
                    return `${points} L ${lastX} ${bottomY} L ${chartPadding.left} ${bottomY} Z`;
                  })()}
                  fill="#3b82f6"
                  opacity="0.7"
                />

                {/* Interest area (stacked on top) */}
                <path
                  d={(() => {
                    const points = paymentSchedule.map((p, i) => {
                      const x = chartPadding.left + (i / (paymentSchedule.length - 1)) * plotWidth;
                      const y = chartPadding.top + plotHeight - ((p.principal + p.interest) / maxPayment) * plotHeight;
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ');
                    const baseLine = paymentSchedule.map((p, i) => {
                      const x = chartPadding.left + ((paymentSchedule.length - 1 - i) / (paymentSchedule.length - 1)) * plotWidth;
                      const y = chartPadding.top + plotHeight - (p.principal / maxPayment) * plotHeight;
                      return `L ${x} ${y}`;
                    }).reverse().join(' ');
                    return `${points} ${baseLine} Z`;
                  })()}
                  fill="#f97316"
                  opacity="0.7"
                />

                {/* Border lines */}
                <path
                  d={paymentSchedule.map((p, i) => {
                    const x = chartPadding.left + (i / (paymentSchedule.length - 1)) * plotWidth;
                    const y = chartPadding.top + plotHeight - (p.principal / maxPayment) * plotHeight;
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')}
                  stroke="#2563eb"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d={paymentSchedule.map((p, i) => {
                    const x = chartPadding.left + (i / (paymentSchedule.length - 1)) * plotWidth;
                    const y = chartPadding.top + plotHeight - ((p.principal + p.interest) / maxPayment) * plotHeight;
                    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')}
                  stroke="#ea580c"
                  strokeWidth="2"
                  fill="none"
                />
              </>
            )}

            {/* Interactive hover */}
            {hoveredMonth !== null && paymentSchedule[hoveredMonth] && (
              <line
                x1={chartPadding.left + (hoveredMonth / (paymentSchedule.length - 1)) * plotWidth}
                y1={chartPadding.top}
                x2={chartPadding.left + (hoveredMonth / (paymentSchedule.length - 1)) * plotWidth}
                y2={chartPadding.top + plotHeight}
                stroke="#6b7280"
                strokeWidth="1"
                strokeDasharray="4"
              />
            )}

            {/* Interactive overlay */}
            {paymentSchedule.map((p, i) => {
              const x = chartPadding.left + (i / (paymentSchedule.length - 1)) * plotWidth;
              return (
                <rect
                  key={i}
                  x={x - (plotWidth / paymentSchedule.length) / 2}
                  y={chartPadding.top}
                  width={plotWidth / paymentSchedule.length}
                  height={plotHeight}
                  fill="transparent"
                  onMouseEnter={() => setHoveredMonth(i)}
                  onMouseLeave={() => setHoveredMonth(null)}
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
          {hoveredMonth !== null && paymentSchedule[hoveredMonth] && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-semibold text-gray-900 mb-2">Month {paymentSchedule[hoveredMonth].month}</div>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">EMI</div>
                  <div className="font-semibold text-gray-800">{formatCurrency(paymentSchedule[hoveredMonth].payment)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Principal</div>
                  <div className="font-semibold text-blue-600">{formatCurrency(paymentSchedule[hoveredMonth].principal)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Interest</div>
                  <div className="font-semibold text-orange-600">{formatCurrency(paymentSchedule[hoveredMonth].interest)}</div>
                </div>
                <div>
                  <div className="text-gray-500">Balance</div>
                  <div className="font-semibold text-indigo-600">{formatCurrency(paymentSchedule[hoveredMonth].balance)}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Total Cost Breakdown Pie Chart */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-4 md:mb-6">Total Loan Cost Breakdown</h2>

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
                {formatCurrency(totalPayment)}
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
                <div className="font-bold text-orange-700">{formatCurrency(totalInterest)}</div>
                <div className="text-sm text-orange-600">{interestPercent.toFixed(1)}%</div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
              <div className="text-sm text-purple-600 mb-1">Processing Fee</div>
              <div className="text-xl font-bold text-purple-700">{formatCurrency(processingFeeAmount)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners */}
      <CalculatorAfterCalcBanners />

      {/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 mb-6 md:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Related Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
          {relatedCalculators.map((calc, index) => (
            <Link key={index} href={calc.href} className="group">
              <div className="rounded-lg p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
                  {calc.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 mb-6 md:mb-8">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Understanding Personal Loans</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          A personal loan is an unsecured installment loan that provides a lump sum of money you repay with fixed monthly payments over a set term. Unlike mortgages or auto loans, personal loans don&apos;t require collateral, making them versatile for debt consolidation, home improvements, medical expenses, or major purchases.
        </p>

        <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
          Because personal loans are unsecured, interest rates typically range from 6% to 36% depending on your credit score, income, and debt-to-income ratio. Understanding how these factors affect your rate helps you secure the best terms and decide whether a personal loan is the right financing choice.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <h3 className="font-semibold text-blue-900 mb-2">Debt Consolidation</h3>
            <p className="text-sm text-blue-800">Combine high-interest credit cards into one lower-rate payment to save money and simplify finances</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <h3 className="font-semibold text-green-900 mb-2">Home Improvement</h3>
            <p className="text-sm text-green-800">Fund renovations without tapping home equity or using high-interest credit cards</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
            <h3 className="font-semibold text-purple-900 mb-2">Major Purchases</h3>
            <p className="text-sm text-purple-800">Finance large expenses with predictable fixed payments instead of revolving credit</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-3">Personal Loan Rate Factors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 sm:mb-4 md:mb-6">
          <div>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Credit Score:</strong> 750+ gets rates under 10%; below 600 may see 25%+</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Income:</strong> Higher income shows ability to repay</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>DTI Ratio:</strong> Keep total debt payments under 36% of income</span>
              </li>
            </ul>
          </div>
          <div>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Loan Amount:</strong> Very small loans may have higher rates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Loan Term:</strong> Shorter terms often get better rates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Lender Type:</strong> Credit unions often beat banks and online lenders</span>
              </li>
            </ul>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-3">Tips for Getting the Best Rate</h3>
        <p className="text-gray-600 leading-relaxed">
          Check your credit score and dispute errors before applying. Get prequalified with multiple lenders using soft credit checks that don&apos;t affect your score. Compare APRs, not just interest rates, to see the true cost including fees. Consider a co-signer if your credit needs improvement. Avoid origination fees when possible.
        </p>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="personal-loan-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}

