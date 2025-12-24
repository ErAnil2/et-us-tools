'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { FirebaseFAQs } from '@/components/PageSEOContent';

import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
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

interface AmortizationRow {
  year: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  totalPrincipal: number;
  totalInterest: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Mortgage  Advanced Calculator?",
    answer: "A Mortgage  Advanced Calculator is a free online tool that helps you calculate and analyze mortgage  advanced-related financial metrics quickly and accurately. It provides instant results to help you make informed financial decisions.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is this Mortgage  Advanced Calculator?",
    answer: "Our Mortgage  Advanced Calculator uses standard financial formulas and provides highly accurate results. However, actual results may vary based on specific terms, conditions, and market factors. Always consult with a financial advisor for major decisions.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Mortgage  Advanced Calculator free to use?",
    answer: "Yes, this Mortgage  Advanced Calculator is completely free to use. There are no hidden charges or registration required. You can use it as many times as you need.",
    order: 3
  },
  {
    id: '4',
    question: "Can I save my Mortgage  Advanced calculations?",
    answer: "The calculator displays results instantly on screen. You can take a screenshot or note down the results for your records. Some browsers also allow you to print the page.",
    order: 4
  },
  {
    id: '5',
    question: "What information do I need for this calculator?",
    answer: "You'll need basic information related to mortgage  advanced such as amounts, rates, time periods, or other relevant values. The calculator will guide you through each required field.",
    order: 5
  }
];

export default function MortgageCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('mortgage-calculator-advanced');

  const [homePrice, setHomePrice] = useState(300000);
  const [downPayment, setDownPayment] = useState(60000);
  const [loanTerm, setLoanTerm] = useState(30);
  const [interestRate, setInterestRate] = useState(6.5);
  const [propertyTax, setPropertyTax] = useState(3000);
  const [homeInsurance, setHomeInsurance] = useState(1200);
  const [pmi, setPmi] = useState(0);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  const loanAmount = homePrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;
  const downPaymentPercent = ((downPayment / homePrice) * 100).toFixed(1);

  const monthlyPI = useMemo(() => {
    if (monthlyRate === 0) return loanAmount / numberOfPayments;
    return loanAmount *
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  }, [loanAmount, monthlyRate, numberOfPayments]);

  const monthlyTax = propertyTax / 12;
  const monthlyInsurance = homeInsurance / 12;
  const monthlyPMI = pmi / 12;
  const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + monthlyPMI;
  const totalInterest = (monthlyPI * numberOfPayments) - loanAmount;
  const totalCost = homePrice + totalInterest + (propertyTax * loanTerm) + (homeInsurance * loanTerm) + (pmi * loanTerm);

  const amortizationSchedule = useMemo((): AmortizationRow[] => {
    const schedule: AmortizationRow[] = [];
    let balance = loanAmount;
    let totalPrincipalPaid = 0;
    let totalInterestPaid = 0;

    for (let year = 1; year <= loanTerm; year++) {
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;

      for (let month = 1; month <= 12; month++) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = monthlyPI - interestPayment;

        yearlyInterest += interestPayment;
        yearlyPrincipal += principalPayment;
        balance -= principalPayment;
      }

      totalPrincipalPaid += yearlyPrincipal;
      totalInterestPaid += yearlyInterest;

      schedule.push({
        year,
        payment: monthlyPI * 12,
        principal: yearlyPrincipal,
        interest: yearlyInterest,
        balance: Math.max(0, balance),
        totalPrincipal: totalPrincipalPaid,
        totalInterest: totalInterestPaid,
      });
    }

    return schedule;
  }, [loanAmount, monthlyRate, monthlyPI, loanTerm]);

  const whatIfScenarios = useMemo(() => {
    const calcMortgage = (principal: number, rate: number, years: number) => {
      const mRate = rate / 100 / 12;
      const nPayments = years * 12;
      if (mRate === 0) return principal / nPayments;
      return principal * (mRate * Math.pow(1 + mRate, nPayments)) / (Math.pow(1 + mRate, nPayments) - 1);
    };

    const currentPI = calcMortgage(loanAmount, interestRate, loanTerm);
    const lowerRatePI = calcMortgage(loanAmount, interestRate - 1, loanTerm);
    const shorterTermPI = calcMortgage(loanAmount, interestRate, 15);

    return [
      {
        label: 'Current',
        monthlyPI: currentPI,
        totalInterest: (currentPI * loanTerm * 12) - loanAmount,
        rate: interestRate,
        term: loanTerm,
      },
      {
        label: '1% Lower Rate',
        monthlyPI: lowerRatePI,
        totalInterest: (lowerRatePI * loanTerm * 12) - loanAmount,
        rate: interestRate - 1,
        term: loanTerm,
      },
      {
        label: '15-Year Term',
        monthlyPI: shorterTermPI,
        totalInterest: (shorterTermPI * 15 * 12) - loanAmount,
        rate: interestRate,
        term: 15,
      },
    ];
  }, [loanAmount, interestRate, loanTerm]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(Math.round(value));
  };

  // SVG Chart dimensions
  const chartWidth = 500;
  const chartHeight = 280;
  const padding = { top: 30, right: 30, bottom: 50, left: 70 };
  const graphWidth = chartWidth - padding.left - padding.right;
  const graphHeight = chartHeight - padding.top - padding.bottom;

  const maxBalance = loanAmount;
  const years = amortizationSchedule.map(row => row.year);

  const getX = (year: number) => padding.left + ((year - 1) / (loanTerm - 1)) * graphWidth;
  const getY = (value: number) => padding.top + graphHeight - (value / maxBalance) * graphHeight;

  const balancePath = amortizationSchedule.map((row, i) =>
    `${i === 0 ? 'M' : 'L'} ${getX(row.year)} ${getY(row.balance)}`
  ).join(' ');

  const principalPath = amortizationSchedule.map((row, i) =>
    `${i === 0 ? 'M' : 'L'} ${getX(row.year)} ${getY(row.totalPrincipal)}`
  ).join(' ');

  const interestPath = amortizationSchedule.map((row, i) =>
    `${i === 0 ? 'M' : 'L'} ${getX(row.year)} ${getY(row.totalInterest)}`
  ).join(' ');

  const displayedSchedule = showFullSchedule ? amortizationSchedule : amortizationSchedule.slice(0, 10);

  return (
    <div className="max-w-[1200px] mx-auto px-3 sm:px-4 lg:px-3 sm:px-4 md:px-6 py-4 sm:py-4 md:py-6">
      {/* Header */}
      <div className="text-center mb-3 sm:mb-4 md:mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3">{getH1('Mortgage Calculator')}</h1>
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
          Calculate your monthly mortgage payment with taxes, insurance, and see the full amortization schedule
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Calculator Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 lg:p-3 sm:p-5 md:p-8 mb-3 sm:mb-4 md:mb-6">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div className="space-y-5">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Loan Details</h2>

            {/* Home Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Home Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={homePrice}
                  onChange={(e) => setHomePrice(Number(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base sm:text-lg font-semibold touch-manipulation"
                />
              </div>
              <input
                type="range"
                min="50000"
                max="2000000"
                step="10000"
                value={homePrice}
                onChange={(e) => setHomePrice(parseInt(e.target.value))}
                className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer mt-2 touch-manipulation"
              />
            </div>

            {/* Down Payment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Down Payment ({downPaymentPercent}%)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base sm:text-lg font-semibold touch-manipulation"
                />
              </div>
              <input
                type="range"
                min="0"
                max={homePrice * 0.5}
                step="5000"
                value={downPayment}
                onChange={(e) => setDownPayment(parseInt(e.target.value))}
                className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer mt-2 touch-manipulation"
              />
            </div>

            {/* Loan Term */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Term
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[10, 15, 30].map((term) => (
                  <button
                    key={term}
                    onClick={() => setLoanTerm(term)}
                    className={`py-2.5 sm:py-3 rounded-lg font-medium transition-all touch-manipulation ${
                      loanTerm === term
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {term} yrs
                  </button>
                ))}
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interest Rate (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
                  className="w-full pr-8 pl-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-base sm:text-lg font-semibold touch-manipulation"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
              </div>
              <input
                type="range"
                min="2"
                max="12"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer mt-2 touch-manipulation"
              />
            </div>

            {/* Property Tax & Insurance Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Property Tax
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                  <input
                    type="number"
                    value={propertyTax}
                    onChange={(e) => setPropertyTax(Number(e.target.value) || 0)}
                    className="w-full pl-7 pr-2 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm sm:text-base font-semibold touch-manipulation"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Insurance
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                  <input
                    type="number"
                    value={homeInsurance}
                    onChange={(e) => setHomeInsurance(Number(e.target.value) || 0)}
                    className="w-full pl-7 pr-2 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base font-semibold touch-manipulation"
                  />
                </div>
              </div>
            </div>

            {/* PMI (if down payment < 20%) */}
            {parseFloat(downPaymentPercent) < 20 && (
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-amber-800">PMI Required</span>
                    <p className="text-xs text-amber-600 mt-0.5">Down payment less than 20%</p>
                  </div>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                    <input
                      type="number"
                      value={pmi}
                      onChange={(e) => setPmi(Number(e.target.value) || 0)}
                      placeholder="Annual PMI"
                      className="w-24 pl-6 pr-2 py-1.5 border border-amber-300 rounded text-sm touch-manipulation"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Monthly Payment</h2>

            {/* Main Result */}
            <div className="p-3 sm:p-4 md:p-5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white mb-4 shadow-lg">
              <div className="text-sm text-indigo-100 mb-1">Total Monthly Payment (PITI)</div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold">{formatCurrency(totalMonthly)}</div>
              <div className="text-xs text-indigo-200 mt-2">Principal, Interest, Taxes & Insurance</div>
            </div>

            {/* Payment Breakdown Visual */}
            <div className="mb-4">
              <div className="flex rounded-lg overflow-hidden h-8 sm:h-10">
                <div
                  className="bg-indigo-500 flex items-center justify-center text-white text-xs font-medium"
                  style={{ width: `${(monthlyPI / totalMonthly) * 100}%` }}
                  title={`P&I: ${formatCurrency(monthlyPI)}`}
                >
                  {((monthlyPI / totalMonthly) * 100) > 15 && 'P&I'}
                </div>
                <div
                  className="bg-pink-500 flex items-center justify-center text-white text-xs font-medium"
                  style={{ width: `${(monthlyTax / totalMonthly) * 100}%` }}
                  title={`Tax: ${formatCurrency(monthlyTax)}`}
                >
                  {((monthlyTax / totalMonthly) * 100) > 8 && 'Tax'}
                </div>
                <div
                  className="bg-teal-500 flex items-center justify-center text-white text-xs font-medium"
                  style={{ width: `${(monthlyInsurance / totalMonthly) * 100}%` }}
                  title={`Ins: ${formatCurrency(monthlyInsurance)}`}
                >
                  {((monthlyInsurance / totalMonthly) * 100) > 8 && 'Ins'}
                </div>
                {monthlyPMI > 0 && (
                  <div
                    className="bg-amber-500 flex items-center justify-center text-white text-xs font-medium"
                    style={{ width: `${(monthlyPMI / totalMonthly) * 100}%` }}
                    title={`PMI: ${formatCurrency(monthlyPMI)}`}
                  >
                    {((monthlyPMI / totalMonthly) * 100) > 8 && 'PMI'}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-3 mt-3 text-xs">
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-indigo-500 rounded"></span> P&I: {formatCurrency(monthlyPI)}</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-pink-500 rounded"></span> Tax: {formatCurrency(monthlyTax)}</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-teal-500 rounded"></span> Ins: {formatCurrency(monthlyInsurance)}</span>
                {monthlyPMI > 0 && <span className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-500 rounded"></span> PMI: {formatCurrency(monthlyPMI)}</span>}
              </div>
            </div>

            {/* Key Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 sm:p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <div className="text-xs text-indigo-600 mb-1">Loan Amount</div>
                <div className="text-lg sm:text-xl font-bold text-indigo-700">{formatCurrency(loanAmount)}</div>
              </div>
              <div className="p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-xs text-green-600 mb-1">Down Payment</div>
                <div className="text-lg sm:text-xl font-bold text-green-700">{formatCurrency(downPayment)}</div>
                <div className="text-xs text-green-600">{downPaymentPercent}%</div>
              </div>
              <div className="p-3 sm:p-4 bg-rose-50 rounded-lg border border-rose-200">
                <div className="text-xs text-rose-600 mb-1">Total Interest</div>
                <div className="text-lg sm:text-xl font-bold text-rose-700">{formatCurrency(totalInterest)}</div>
                <div className="text-xs text-rose-600">Over {loanTerm} years</div>
              </div>
              <div className="p-3 sm:p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-xs text-purple-600 mb-1">Total Cost</div>
                <div className="text-lg sm:text-xl font-bold text-purple-700">{formatCurrency(totalCost)}</div>
                <div className="text-xs text-purple-600">Including all fees</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />


      {/* Amortization Chart */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Amortization Over Time</h2>

        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full min-w-[400px] max-w-[600px] mx-auto"
          >
            <defs>
              <linearGradient id="balanceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="principalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="interestGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.1" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={padding.top + graphHeight * (1 - ratio)}
                  x2={padding.left + graphWidth}
                  y2={padding.top + graphHeight * (1 - ratio)}
                  stroke="#e5e7eb"
                  strokeDasharray="4,4"
                />
                <text
                  x={padding.left - 10}
                  y={padding.top + graphHeight * (1 - ratio)}
                  textAnchor="end"
                  alignmentBaseline="middle"
                  className="text-xs fill-gray-500"
                >
                  ${formatNumber(maxBalance * ratio / 1000)}k
                </text>
              </g>
            ))}

            {/* X-axis labels */}
            {[1, Math.round(loanTerm / 4), Math.round(loanTerm / 2), Math.round(loanTerm * 3 / 4), loanTerm].map((year) => (
              <text
                key={year}
                x={getX(year)}
                y={chartHeight - 15}
                textAnchor="middle"
                className="text-xs fill-gray-500"
              >
                Year {year}
              </text>
            ))}

            {/* Balance Line (declining) */}
            <path
              d={balancePath}
              fill="none"
              stroke="#6366f1"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Principal Paid Line (rising) */}
            <path
              d={principalPath}
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Interest Paid Line (rising slower) */}
            <path
              d={interestPath}
              fill="none"
              stroke="#f43f5e"
              strokeWidth="2"
              strokeDasharray="6,3"
              strokeLinecap="round"
            />

            {/* Interactive hover points */}
            {amortizationSchedule.map((row) => (
              <g key={row.year}>
                <circle
                  cx={getX(row.year)}
                  cy={getY(row.balance)}
                  r={hoveredYear === row.year ? 6 : 4}
                  fill="#6366f1"
                  stroke="white"
                  strokeWidth="2"
                  className="cursor-pointer transition-all"
                  filter={hoveredYear === row.year ? "url(#glow)" : undefined}
                  onMouseEnter={() => setHoveredYear(row.year)}
                  onMouseLeave={() => setHoveredYear(null)}
                />
              </g>
            ))}

            {/* Tooltip */}
            {hoveredYear && (
              <g>
                <rect
                  x={Math.min(getX(hoveredYear) - 70, chartWidth - 155)}
                  y={Math.max(getY(amortizationSchedule[hoveredYear - 1]?.balance || 0) - 80, 5)}
                  width="140"
                  height="75"
                  fill="white"
                  stroke="#6366f1"
                  strokeWidth="1"
                  rx="6"
                  filter="url(#glow)"
                />
                <text
                  x={Math.min(getX(hoveredYear) - 70, chartWidth - 155) + 70}
                  y={Math.max(getY(amortizationSchedule[hoveredYear - 1]?.balance || 0) - 80, 5) + 18}
                  textAnchor="middle"
                  className="text-xs font-semibold fill-indigo-700"
                >
                  Year {hoveredYear}
                </text>
                <text
                  x={Math.min(getX(hoveredYear) - 70, chartWidth - 155) + 10}
                  y={Math.max(getY(amortizationSchedule[hoveredYear - 1]?.balance || 0) - 80, 5) + 35}
                  className="text-xs fill-gray-600"
                >
                  Balance: {formatCurrency(amortizationSchedule[hoveredYear - 1]?.balance || 0)}
                </text>
                <text
                  x={Math.min(getX(hoveredYear) - 70, chartWidth - 155) + 10}
                  y={Math.max(getY(amortizationSchedule[hoveredYear - 1]?.balance || 0) - 80, 5) + 52}
                  className="text-xs fill-green-600"
                >
                  Paid: {formatCurrency(amortizationSchedule[hoveredYear - 1]?.totalPrincipal || 0)}
                </text>
                <text
                  x={Math.min(getX(hoveredYear) - 70, chartWidth - 155) + 10}
                  y={Math.max(getY(amortizationSchedule[hoveredYear - 1]?.balance || 0) - 80, 5) + 69}
                  className="text-xs fill-rose-600"
                >
                  Interest: {formatCurrency(amortizationSchedule[hoveredYear - 1]?.totalInterest || 0)}
                </text>
              </g>
            )}

            {/* Legend */}
            <g transform={`translate(${padding.left + 10}, ${padding.top + 10})`}>
              <rect x="0" y="0" width="130" height="55" fill="white" fillOpacity="0.9" rx="4" />
              <circle cx="12" cy="12" r="5" fill="#6366f1" />
              <text x="24" y="16" className="text-xs fill-gray-700">Remaining Balance</text>
              <circle cx="12" cy="30" r="5" fill="#10b981" />
              <text x="24" y="34" className="text-xs fill-gray-700">Principal Paid</text>
              <line x1="7" y1="48" x2="17" y2="48" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4,2" />
              <text x="24" y="52" className="text-xs fill-gray-700">Interest Paid</text>
            </g>
          </svg>
        </div>
      </div>
{/* What-If Scenarios */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">What-If Scenarios</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {whatIfScenarios.map((scenario, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border-2 transition-all ${
                idx === 0
                  ? 'bg-indigo-50 border-indigo-300'
                  : 'bg-gray-50 border-gray-200 hover:border-indigo-300'
              }`}
            >
              <div className={`text-sm font-semibold mb-2 ${idx === 0 ? 'text-indigo-700' : 'text-gray-700'}`}>
                {scenario.label}
              </div>
              <div className="text-xs text-gray-500 mb-2">
                {scenario.rate}% for {scenario.term} years
              </div>
              <div className={`text-xl sm:text-2xl font-bold ${idx === 0 ? 'text-indigo-700' : 'text-gray-800'}`}>
                {formatCurrency(scenario.monthlyPI)}
                <span className="text-xs font-normal text-gray-500">/mo</span>
              </div>
              <div className="text-xs text-gray-600 mt-2">
                Total Interest: {formatCurrency(scenario.totalInterest)}
              </div>
              {idx > 0 && (
                <div className={`text-xs mt-2 font-medium ${
                  scenario.totalInterest < whatIfScenarios[0].totalInterest ? 'text-green-600' : 'text-rose-600'
                }`}>
                  {scenario.totalInterest < whatIfScenarios[0].totalInterest ? 'Save ' : 'Extra '}
                  {formatCurrency(Math.abs(scenario.totalInterest - whatIfScenarios[0].totalInterest))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="grid sm:grid-cols-2 gap-4 mb-3 sm:mb-4 md:mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-5 border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-blue-800 text-sm sm:text-base">Affordability Check</h3>
              <p className="text-xs sm:text-sm text-blue-700 mt-1">
                Monthly payment should be ≤28% of gross income. For this mortgage,
                you'd need ~{formatCurrency(totalMonthly / 0.28 * 12)}/year income.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 sm:p-5 border border-amber-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-amber-800 text-sm sm:text-base">Interest Ratio</h3>
              <p className="text-xs sm:text-sm text-amber-700 mt-1">
                You'll pay {((totalInterest / loanAmount) * 100).toFixed(0)}% of your loan amount in interest.
                That's {formatCurrency(totalInterest)} over {loanTerm} years.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Amortization Schedule Table */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 mb-3 sm:mb-4 md:mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Amortization Schedule</h2>
          <span className="text-sm text-gray-500">Year-by-year breakdown</span>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-3 font-semibold text-gray-700">Year</th>
                <th className="text-right py-3 px-3 font-semibold text-gray-700">Annual Payment</th>
                <th className="text-right py-3 px-3 font-semibold text-gray-700">Principal</th>
                <th className="text-right py-3 px-3 font-semibold text-gray-700">Interest</th>
                <th className="text-right py-3 px-3 font-semibold text-gray-700">Remaining Balance</th>
              </tr>
            </thead>
            <tbody>
              {displayedSchedule.map((row, idx) => (
                <tr
                  key={row.year}
                  className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-indigo-50 transition-colors`}
                >
                  <td className="py-2.5 px-3 font-medium text-gray-800">{row.year}</td>
                  <td className="py-2.5 px-3 text-right text-gray-700">{formatCurrency(row.payment)}</td>
                  <td className="py-2.5 px-3 text-right text-green-600 font-medium">{formatCurrency(row.principal)}</td>
                  <td className="py-2.5 px-3 text-right text-rose-600">{formatCurrency(row.interest)}</td>
                  <td className="py-2.5 px-3 text-right font-semibold text-indigo-700">{formatCurrency(row.balance)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-indigo-50 font-semibold">
                <td className="py-3 px-3 text-indigo-800">Total</td>
                <td className="py-3 px-3 text-right text-indigo-800">{formatCurrency(monthlyPI * loanTerm * 12)}</td>
                <td className="py-3 px-3 text-right text-green-700">{formatCurrency(loanAmount)}</td>
                <td className="py-3 px-3 text-right text-rose-700">{formatCurrency(totalInterest)}</td>
                <td className="py-3 px-3 text-right text-indigo-800">$0</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {amortizationSchedule.length > 10 && (
          <button
            onClick={() => setShowFullSchedule(!showFullSchedule)}
            className="mt-4 w-full py-2.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors touch-manipulation"
          >
            {showFullSchedule ? 'Show Less' : `Show All ${loanTerm} Years`}
          </button>
        )}
      </div>

      {/* Mortgage Tips */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Mortgage Tips</h2>
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm">$</span>
              Save Money
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                Put down 20% to avoid PMI
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                Shop around for best rates
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                Consider shorter loan terms for less interest
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                Make extra principal payments when possible
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                Improve credit score before applying
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm">i</span>
              Key Guidelines
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                Monthly payment should be ≤28% of income
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                Total debt should be ≤36% of income
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                Budget for maintenance (1-2% of home value)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                Consider closing costs (2-5% of loan)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                Factor in HOA fees if applicable
              </li>
            </ul>
          </div>
        </div>
      </div>
{/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Related Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-xl p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all h-full">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mb-2 group-hover:bg-indigo-200 transition-colors">
                  <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-2">
                  {calc.title}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-2">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Understanding Your Mortgage Payment</h2>

        <div className="prose max-w-none">
          <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
            A mortgage is likely the largest financial commitment you&apos;ll ever make. Understanding how your monthly payment is calculated and what factors affect it can save you tens of thousands of dollars over the life of your loan. This comprehensive mortgage calculator breaks down every component of your payment and shows you exactly where your money goes each month.
          </p>

          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
            <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
              <h3 className="font-semibold text-indigo-800 mb-3">Principal & Interest (P&I)</h3>
              <p className="text-indigo-700 text-sm mb-2">
                The core of your mortgage payment goes toward paying down your loan balance (principal) and compensating the lender for the loan (interest). Early in your mortgage, most of your payment goes to interest; this shifts toward principal over time.
              </p>
            </div>
            <div className="bg-pink-50 p-5 rounded-xl border border-pink-100">
              <h3 className="font-semibold text-pink-800 mb-3">Property Taxes & Insurance</h3>
              <p className="text-pink-700 text-sm mb-2">
                Most lenders require you to escrow property taxes and homeowner&apos;s insurance, adding them to your monthly payment. These protect both you and the lender&apos;s investment in the property.
              </p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-4">The True Cost of Mortgage Interest</h3>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Interest can dramatically increase the total cost of your home. On a $300,000 loan at 6.5% over 30 years, you&apos;ll pay approximately $383,000 in interest alone—more than the original loan amount! This is why shopping for the best rate and considering shorter loan terms can save you a fortune.
          </p>

          <div className="bg-amber-50 p-5 rounded-xl border border-amber-200 mb-3 sm:mb-4 md:mb-6">
            <h4 className="font-semibold text-amber-800 mb-2">PMI: The Hidden Cost of Low Down Payments</h4>
            <p className="text-amber-700 text-sm">
              Private Mortgage Insurance (PMI) is required when your down payment is less than 20%. PMI typically costs 0.5% to 1% of the loan amount annually and doesn&apos;t build equity—it only protects the lender. Reaching 20% equity through payments or appreciation allows you to request PMI removal.
            </p>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-4">Fixed-Rate vs. Adjustable-Rate Mortgages</h3>
          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-gray-800 mb-2">Fixed-Rate Mortgages</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Same interest rate for the entire loan term</li>
                <li>• Predictable monthly payments</li>
                <li>• Best when rates are low or rising</li>
                <li>• Available in 10, 15, 20, and 30-year terms</li>
              </ul>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-gray-800 mb-2">Adjustable-Rate Mortgages (ARMs)</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Lower initial rate that adjusts periodically</li>
                <li>• 5/1, 7/1, 10/1 ARM options available</li>
                <li>• Best if you plan to move before adjustment</li>
                <li>• Rate caps limit how much rates can change</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>

        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">How is my monthly mortgage payment calculated?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your monthly mortgage payment (PITI) includes Principal, Interest, Taxes, and Insurance. The principal and interest portion uses the standard amortization formula based on your loan amount, interest rate, and term. Property taxes and homeowner&apos;s insurance are divided by 12 and added to create your total monthly payment. If you have PMI or HOA fees, those are added too.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">Why does so much of my early payment go to interest?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Mortgage amortization front-loads interest payments. Since interest is calculated on the remaining balance, and your balance is highest at the start, most of your early payments cover interest. For a 30-year loan, you might pay 80% interest in your first payment. As you pay down the balance, more of each payment goes to principal. This is why extra principal payments early in your loan have the biggest impact.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">Should I choose a 15-year or 30-year mortgage?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              A 15-year mortgage has higher monthly payments but significantly lower total interest—often saving $100,000+ compared to a 30-year loan. The 30-year option offers lower monthly payments and more financial flexibility. Consider your income stability, other financial goals, and whether you&apos;d actually invest the monthly savings if you chose the 30-year. Many people split the difference with a 20-year loan.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">How much house can I actually afford?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              The standard guideline is that your total housing payment (PITI) shouldn&apos;t exceed 28% of your gross monthly income, and total debt payments shouldn&apos;t exceed 36%. However, what you qualify for isn&apos;t always what you can comfortably afford. Consider your lifestyle, savings goals, job security, and future expenses like children or career changes before maxing out your mortgage approval.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">Is it worth paying extra principal each month?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Extra principal payments can dramatically reduce your total interest and payoff time. Even $100 extra per month on a $300,000 mortgage at 6.5% can save over $50,000 in interest and cut 5+ years off your loan. The earlier you make extra payments, the greater the impact. However, ensure you&apos;ve built emergency savings and maxed out tax-advantaged retirement accounts first, as mortgage debt is relatively cheap.
            </p>
          </div>

          <div>
            <h3 className="text-base font-medium text-gray-800 mb-2">What credit score do I need to get the best mortgage rate?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              For the best conventional mortgage rates, you typically need a credit score of 740 or higher. Scores between 700-739 still get good rates with slightly higher premiums. FHA loans accept scores as low as 580 with 3.5% down, but you&apos;ll pay mortgage insurance for the life of the loan. Before applying, check your credit reports for errors, pay down credit card balances, and avoid opening new accounts.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="mortgage-calculator-advanced" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
