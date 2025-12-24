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
  openingBalance: number;
  payment: number;
  principal: number;
  interest: number;
  closingBalance: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Home Loan Calculator?",
    answer: "A Home Loan Calculator is a free online tool that helps you calculate and analyze home loan-related financial metrics quickly and accurately. It provides instant results to help you make informed financial decisions.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is this Home Loan Calculator?",
    answer: "Our Home Loan Calculator uses standard financial formulas and provides highly accurate results. However, actual results may vary based on specific terms, conditions, and market factors. Always consult with a financial advisor for major decisions.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Home Loan Calculator free to use?",
    answer: "Yes, this Home Loan Calculator is completely free to use. There are no hidden charges or registration required. You can use it as many times as you need.",
    order: 3
  },
  {
    id: '4',
    question: "Can I save my Home Loan calculations?",
    answer: "The calculator displays results instantly on screen. You can take a screenshot or note down the results for your records. Some browsers also allow you to print the page.",
    order: 4
  },
  {
    id: '5',
    question: "What information do I need for this calculator?",
    answer: "You'll need basic information related to home loan such as amounts, rates, time periods, or other relevant values. The calculator will guide you through each required field.",
    order: 5
  }
];

export default function HomeLoanClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('home-loan-calculator');

  const [homePrice, setHomePrice] = useState(400000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [propertyTax, setPropertyTax] = useState(3600);
  const [homeInsurance, setHomeInsurance] = useState(1200);
  const [monthlyIncome, setMonthlyIncome] = useState(8000);
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const [hoveredChart, setHoveredChart] = useState<number | null>(null);

  const calculations = useMemo(() => {
    const downPayment = homePrice * (downPaymentPercent / 100);
    const loanAmount = homePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = loanTerm * 12;

    // Calculate EMI
    let monthlyEMI = 0;
    if (monthlyRate > 0 && totalMonths > 0) {
      monthlyEMI = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1);
    }

    // Calculate PMI if down payment < 20%
    let monthlyPMI = 0;
    if (downPaymentPercent < 20) {
      monthlyPMI = (loanAmount * 0.005) / 12; // 0.5% annual PMI
    }

    const monthlyTax = propertyTax / 12;
    const monthlyInsurance = homeInsurance / 12;
    const totalMonthly = monthlyEMI + monthlyTax + monthlyInsurance + monthlyPMI;

    // Calculate totals
    const totalPayments = monthlyEMI * totalMonths;
    const totalInterest = totalPayments - loanAmount;

    // Affordability
    const housingRatio = monthlyIncome > 0 ? (totalMonthly / monthlyIncome) * 100 : 0;
    let affordabilityStatus = 'Enter income';
    let affordabilityColor = 'gray';
    if (monthlyIncome > 0) {
      if (housingRatio <= 28) {
        affordabilityStatus = 'Affordable';
        affordabilityColor = 'green';
      } else if (housingRatio <= 36) {
        affordabilityStatus = 'Moderate';
        affordabilityColor = 'yellow';
      } else {
        affordabilityStatus = 'Unaffordable';
        affordabilityColor = 'red';
      }
    }

    // Generate amortization schedule
    const schedule: AmortizationRow[] = [];
    let balance = loanAmount;
    for (let year = 1; year <= loanTerm; year++) {
      const openingBalance = balance;
      let yearlyPayment = 0;
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;

      for (let month = 0; month < 12 && balance > 0; month++) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = Math.min(monthlyEMI - interestPayment, balance);
        yearlyPayment += monthlyEMI;
        yearlyInterest += interestPayment;
        yearlyPrincipal += principalPayment;
        balance -= principalPayment;
      }

      schedule.push({
        year,
        openingBalance,
        payment: yearlyPayment,
        principal: yearlyPrincipal,
        interest: yearlyInterest,
        closingBalance: Math.max(0, balance)
      });
    }

    return {
      downPayment,
      loanAmount,
      monthlyEMI,
      monthlyTax,
      monthlyInsurance,
      monthlyPMI,
      totalMonthly,
      totalPayments,
      totalInterest,
      housingRatio,
      affordabilityStatus,
      affordabilityColor,
      schedule
    };
  }, [homePrice, downPaymentPercent, interestRate, loanTerm, propertyTax, homeInsurance, monthlyIncome]);

  // What-if scenarios
  const scenarios = useMemo(() => {
    const calculate = (price: number, downPct: number, rate: number, term: number) => {
      const down = price * (downPct / 100);
      const loan = price - down;
      const r = rate / 100 / 12;
      const n = term * 12;
      const emi = loan * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
      const total = emi * n;
      return { emi, totalInterest: total - loan, totalPayments: total };
    };

    return {
      lowerRate: calculate(homePrice, downPaymentPercent, interestRate - 1, loanTerm),
      higherDown: calculate(homePrice, Math.min(downPaymentPercent + 10, 50), interestRate, loanTerm),
      shorterTerm: calculate(homePrice, downPaymentPercent, interestRate, Math.max(loanTerm - 5, 10)),
    };
  }, [homePrice, downPaymentPercent, interestRate, loanTerm]);

  const formatCurrency = (amount: number) => `$${Math.round(amount).toLocaleString('en-US')}`;

  // Donut chart data
  const donutData = useMemo(() => {
    const total = calculations.totalMonthly;
    if (total === 0) return [];

    const segments = [
      { id: 'principal', label: 'Principal & Interest', value: calculations.monthlyEMI, color: '#3B82F6' },
      { id: 'tax', label: 'Property Tax', value: calculations.monthlyTax, color: '#10B981' },
      { id: 'insurance', label: 'Home Insurance', value: calculations.monthlyInsurance, color: '#F59E0B' },
    ];

    if (calculations.monthlyPMI > 0) {
      segments.push({ id: 'pmi', label: 'PMI', value: calculations.monthlyPMI, color: '#EF4444' });
    }

    let cumulative = 0;
    return segments.map(seg => {
      const percentage = (seg.value / total) * 100;
      const start = cumulative;
      cumulative += percentage;
      return {
        ...seg,
        percentage,
        strokeDasharray: `${percentage} ${100 - percentage}`,
        strokeDashoffset: 25 - start
      };
    });
  }, [calculations]);

  // Chart points for balance over time
  const chartPoints = useMemo(() => {
    const schedule = calculations.schedule;
    if (schedule.length === 0) return [];

    const maxBalance = calculations.loanAmount;
    const width = 500;
    const height = 200;
    const padding = 40;

    return schedule.map((item, i) => ({
      x: padding + ((i / (schedule.length - 1)) * (width - 2 * padding)),
      y: padding + ((1 - item.closingBalance / maxBalance) * (height - 2 * padding)),
      year: item.year,
      balance: item.closingBalance
    }));
  }, [calculations]);

  return (
    <div className="max-w-[1180px] mx-auto p-3 sm:p-4 md:p-6">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Home Loan Calculator')}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Calculate your monthly mortgage payment, see how much house you can afford, and explore different loan scenarios with our comprehensive home loan calculator.
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Calculator */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}

      <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Loan Details</h2>

            {/* Quick Home Price Buttons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quick Home Price</label>
              <div className="grid grid-cols-3 gap-2">
                {[250000, 400000, 500000, 750000, 1000000, 1500000].map(price => (
                  <button
                    key={price}
                    onClick={() => setHomePrice(price)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      homePrice === price
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {formatCurrency(price)}
                  </button>
                ))}
              </div>
            </div>

            {/* Home Price Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Home Price: <span className="text-blue-600 font-bold">{formatCurrency(homePrice)}</span>
              </label>
              <input
                type="range"
                min="100000"
                max="2000000"
                step="10000"
                value={homePrice}
                onChange={(e) => setHomePrice(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$100K</span>
                <span>$1M</span>
                <span>$2M</span>
              </div>
            </div>

            {/* Down Payment Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Down Payment: <span className="text-green-600 font-bold">{downPaymentPercent}% ({formatCurrency(calculations.downPayment)})</span>
              </label>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>20%</span>
                <span>50%</span>
              </div>
              {downPaymentPercent < 20 && (
                <p className="text-xs text-orange-600 mt-1">PMI required (down payment &lt; 20%)</p>
              )}
            </div>

            {/* Interest Rate Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interest Rate: <span className="text-purple-600 font-bold">{interestRate.toFixed(2)}%</span>
              </label>
              <input
                type="range"
                min="3"
                max="12"
                step="0.125"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>3%</span>
                <span>7.5%</span>
                <span>12%</span>
              </div>
            </div>

            {/* Loan Term */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loan Term</label>
              <div className="flex gap-3">
                {[15, 20, 30].map(term => (
                  <button
                    key={term}
                    onClick={() => setLoanTerm(term)}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      loanTerm === term
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {term} Years
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Costs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Annual Property Tax ($)</label>
                <input
                  type="number"
                  value={propertyTax}
                  onChange={(e) => setPropertyTax(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  min="0"
                  step="100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Annual Insurance ($)</label>
                <input
                  type="number"
                  value={homeInsurance}
                  onChange={(e) => setHomeInsurance(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  min="0"
                  step="100"
                />
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Monthly Payment</h2>

            {/* Main Result */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-3 sm:p-4 md:p-6 text-white">
              <p className="text-sm opacity-90 mb-1">Total Monthly Payment</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold">{formatCurrency(calculations.totalMonthly)}</p>
              <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="opacity-75">Loan Amount</p>
                  <p className="font-semibold">{formatCurrency(calculations.loanAmount)}</p>
                </div>
                <div>
                  <p className="opacity-75">Total Interest</p>
                  <p className="font-semibold">{formatCurrency(calculations.totalInterest)}</p>
                </div>
              </div>
            </div>

            {/* Donut Chart */}
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="relative">
                <svg width="160" height="160" viewBox="0 0 160 160">
                  {donutData.map((segment) => (
                    <g key={segment.id}>
                      {hoveredSegment === segment.id && (
                        <circle
                          cx="80" cy="80" r="55"
                          fill="none" stroke={segment.color}
                          strokeWidth="25" opacity="0.3"
                          className="pointer-events-none"
                        />
                      )}
                      <circle
                        cx="80" cy="80" r="55"
                        fill="none" stroke={segment.color}
                        strokeWidth={hoveredSegment === segment.id ? 22 : 18}
                        strokeDasharray={segment.strokeDasharray}
                        strokeDashoffset={segment.strokeDashoffset}
                        transform="rotate(-90 80 80)"
                        pathLength="100"
                        className="pointer-events-none transition-all duration-200"
                      />
                      <circle
                        cx="80" cy="80" r="55"
                        fill="transparent" stroke="transparent"
                        strokeWidth="28"
                        strokeDasharray={segment.strokeDasharray}
                        strokeDashoffset={segment.strokeDashoffset}
                        transform="rotate(-90 80 80)"
                        pathLength="100"
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredSegment(segment.id)}
                        onMouseLeave={() => setHoveredSegment(null)}
                      />
                    </g>
                  ))}
                  <text x="80" y="75" textAnchor="middle" className="text-sm font-bold fill-gray-800">
                    {formatCurrency(calculations.totalMonthly)}
                  </text>
                  <text x="80" y="92" textAnchor="middle" className="text-xs fill-gray-500">
                    /month
                  </text>
                </svg>
              </div>
              <div className="flex-1 space-y-2">
                {donutData.map(segment => (
                  <div
                    key={segment.id}
                    className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                      hoveredSegment === segment.id ? 'bg-gray-100' : ''
                    }`}
                    onMouseEnter={() => setHoveredSegment(segment.id)}
                    onMouseLeave={() => setHoveredSegment(null)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }} />
                      <span className="text-sm text-gray-700">{segment.label}</span>
                    </div>
                    <span className="text-sm font-medium">{formatCurrency(segment.value)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Affordability Check */}
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-700">Affordability Check</span>
                <span className={`text-sm font-bold ${
                  calculations.affordabilityColor === 'green' ? 'text-green-600' :
                  calculations.affordabilityColor === 'yellow' ? 'text-yellow-600' :
                  calculations.affordabilityColor === 'red' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {calculations.affordabilityStatus} ({calculations.housingRatio.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div
                  className={`h-2 rounded-full transition-all ${
                    calculations.affordabilityColor === 'green' ? 'bg-green-500' :
                    calculations.affordabilityColor === 'yellow' ? 'bg-yellow-500' :
                    calculations.affordabilityColor === 'red' ? 'bg-red-500' : 'bg-gray-400'
                  }`}
                  style={{ width: `${Math.min(calculations.housingRatio, 100)}%` }}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Monthly Income:</span>
                <input
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(parseFloat(e.target.value) || 0)}
                  className="flex-1 px-2 py-1 border rounded text-sm"
                  placeholder="$8,000"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Housing costs should be &lt; 28% of gross income. Currently: {calculations.housingRatio.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners */}
      <CalculatorAfterCalcBanners />

      {/* Loan Balance Chart */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Loan Balance Over Time</h2>
        <div className="relative">
          <svg width="100%" viewBox="0 0 500 200" className="overflow-visible">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((pct) => (
              <line
                key={pct}
                x1="40" y1={40 + ((100 - pct) / 100) * 120}
                x2="460" y2={40 + ((100 - pct) / 100) * 120}
                stroke="#E5E7EB" strokeDasharray="4"
              />
            ))}

            {/* Y-axis labels */}
            <text x="35" y="45" textAnchor="end" className="text-xs fill-gray-500">{formatCurrency(calculations.loanAmount)}</text>
            <text x="35" y="165" textAnchor="end" className="text-xs fill-gray-500">$0</text>

            {/* X-axis label */}
            <text x="250" y="195" textAnchor="middle" className="text-xs fill-gray-500">Years</text>

            {/* Area fill */}
            {chartPoints.length > 1 && (
              <path
                d={`M ${chartPoints[0].x} ${chartPoints[0].y} ${chartPoints.map(p => `L ${p.x} ${p.y}`).join(' ')} L ${chartPoints[chartPoints.length - 1].x} 160 L ${chartPoints[0].x} 160 Z`}
                fill="url(#loanGradient)"
                className="pointer-events-none"
              />
            )}

            {/* Line */}
            {chartPoints.length > 1 && (
              <path
                d={`M ${chartPoints[0].x} ${chartPoints[0].y} ${chartPoints.map(p => `L ${p.x} ${p.y}`).join(' ')}`}
                fill="none" stroke="#3B82F6" strokeWidth="2"
                className="pointer-events-none"
              />
            )}

            <defs>
              <linearGradient id="loanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Interactive points */}
            {chartPoints.filter((_, i) => i % 3 === 0 || i === chartPoints.length - 1).map((point, i) => (
              <g key={i}>
                <circle
                  cx={point.x} cy={point.y}
                  r={hoveredChart === point.year ? 6 : 4}
                  fill="#3B82F6"
                  className="pointer-events-none transition-all duration-200"
                />
                <circle
                  cx={point.x} cy={point.y}
                  r="15" fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredChart(point.year)}
                  onMouseLeave={() => setHoveredChart(null)}
                />
                {hoveredChart === point.year && (
                  <g className="pointer-events-none">
                    <rect
                      x={point.x - 50} y={point.y - 45}
                      width="100" height="35"
                      fill="white" stroke="#E5E7EB" rx="4"
                    />
                    <text x={point.x} y={point.y - 30} textAnchor="middle" className="text-xs font-medium fill-gray-800">
                      Year {point.year}
                    </text>
                    <text x={point.x} y={point.y - 17} textAnchor="middle" className="text-xs fill-gray-600">
                      {formatCurrency(point.balance)}
                    </text>
                  </g>
                )}
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* What-If Scenarios */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">What-If Scenarios</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          <div className="border-2 border-green-200 rounded-lg p-5 bg-green-50">
            <h3 className="text-lg font-medium text-green-800 mb-2">Lower Interest Rate (-1%)</h3>
            <p className="text-xs text-green-600 mb-4">What if you got a better rate?</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">New Rate:</span>
                <span className="font-bold">{(interestRate - 1).toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Payment:</span>
                <span className="font-bold text-green-700">{formatCurrency(scenarios.lowerRate.emi)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Interest:</span>
                <span className="font-bold">{formatCurrency(scenarios.lowerRate.totalInterest)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-green-200">
                <span className="text-green-700">You Save:</span>
                <span className="font-bold text-green-700">
                  {formatCurrency(calculations.totalInterest - scenarios.lowerRate.totalInterest)}
                </span>
              </div>
            </div>
          </div>

          <div className="border-2 border-blue-200 rounded-lg p-5 bg-blue-50">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Higher Down Payment (+10%)</h3>
            <p className="text-xs text-blue-600 mb-4">What if you saved more upfront?</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">New Down:</span>
                <span className="font-bold">{Math.min(downPaymentPercent + 10, 50)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Payment:</span>
                <span className="font-bold text-blue-700">{formatCurrency(scenarios.higherDown.emi)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Interest:</span>
                <span className="font-bold">{formatCurrency(scenarios.higherDown.totalInterest)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-blue-200">
                <span className="text-blue-700">You Save:</span>
                <span className="font-bold text-blue-700">
                  {formatCurrency(calculations.totalInterest - scenarios.higherDown.totalInterest)}
                </span>
              </div>
            </div>
          </div>

          <div className="border-2 border-purple-200 rounded-lg p-5 bg-purple-50">
            <h3 className="text-lg font-medium text-purple-800 mb-2">Shorter Term (-5 years)</h3>
            <p className="text-xs text-purple-600 mb-4">What if you paid it off faster?</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">New Term:</span>
                <span className="font-bold">{Math.max(loanTerm - 5, 10)} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Payment:</span>
                <span className="font-bold text-purple-700">{formatCurrency(scenarios.shorterTerm.emi)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Interest:</span>
                <span className="font-bold">{formatCurrency(scenarios.shorterTerm.totalInterest)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-purple-200">
                <span className="text-purple-700">You Save:</span>
                <span className="font-bold text-purple-700">
                  {formatCurrency(calculations.totalInterest - scenarios.shorterTerm.totalInterest)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Amortization Schedule */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Amortization Schedule</h2>
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left">Year</th>
                <th className="px-4 py-3 text-right">Opening Balance</th>
                <th className="px-4 py-3 text-right">Annual Payment</th>
                <th className="px-4 py-3 text-right">Principal</th>
                <th className="px-4 py-3 text-right">Interest</th>
                <th className="px-4 py-3 text-right">Closing Balance</th>
              </tr>
            </thead>
            <tbody>
              {calculations.schedule.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 font-medium">{row.year}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(row.openingBalance)}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(row.payment)}</td>
                  <td className="px-4 py-3 text-right text-blue-600 font-medium">{formatCurrency(row.principal)}</td>
                  <td className="px-4 py-3 text-right text-orange-600 font-medium">{formatCurrency(row.interest)}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatCurrency(row.closingBalance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Financial Calculators</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {relatedCalculators.map((calc, index) => (
            <Link key={index} href={calc.href} className="block p-3 sm:p-4 md:p-6 bg-white rounded-lg border hover:border-blue-300 hover:shadow-md transition-all">
              <h3 className="font-semibold text-gray-800 mb-2">{calc.title}</h3>
              <p className="text-sm text-gray-600">{calc.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Understanding Home Loans</h2>

        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">How Home Loan Payments Work</h3>
            <p className="text-gray-700 mb-4">
              Your monthly mortgage payment consists of several components, commonly known as PITI:
              <strong> Principal, Interest, Taxes, and Insurance</strong>. Understanding each component
              helps you budget effectively and make informed decisions about your home purchase.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-lg font-medium text-blue-800 mb-3">Monthly Payment Formula (EMI)</h3>
            <p className="text-blue-700 mb-2">The principal and interest portion is calculated using:</p>
            <div className="bg-white rounded-lg p-4 font-mono text-sm text-center">
              EMI = P × r × (1 + r)^n / [(1 + r)^n - 1]
            </div>
            <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm text-blue-700">
              <ul className="space-y-1">
                <li><strong>P</strong> = Principal (loan amount)</li>
                <li><strong>r</strong> = Monthly interest rate</li>
              </ul>
              <ul className="space-y-1">
                <li><strong>n</strong> = Total number of payments</li>
                <li><strong>EMI</strong> = Monthly payment</li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">The 28/36 Rule</h4>
              <p className="text-gray-600 text-sm">
                Lenders typically want your housing costs to be no more than <strong>28%</strong> of your
                gross monthly income, and total debt payments (including housing) no more than <strong>36%</strong>.
                This helps ensure you can comfortably afford your mortgage.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Private Mortgage Insurance (PMI)</h4>
              <p className="text-gray-600 text-sm">
                If your down payment is less than <strong>20%</strong>, you'll typically need to pay PMI,
                which protects the lender if you default. PMI usually costs 0.5% to 1% of the loan annually
                and can be removed once you reach 20% equity.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">How much house can I afford?</h3>
            <p className="text-gray-700">
              A common guideline is that your total monthly housing payment (including mortgage, taxes, and insurance)
              should not exceed 28% of your gross monthly income. If you earn $8,000/month, aim for a payment under
              $2,240. Use our affordability calculator above to check your specific situation.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Should I get a 15-year or 30-year mortgage?</h3>
            <p className="text-gray-700">
              A 15-year mortgage has higher monthly payments but saves significantly on interest over the life of the loan.
              A 30-year mortgage has lower monthly payments, making it more affordable month-to-month. Choose based on
              your financial goals and monthly budget flexibility.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">How much should I put down on a house?</h3>
            <p className="text-gray-700">
              While 20% down is ideal to avoid PMI, many buyers put down less. FHA loans require as little as 3.5% down,
              and some conventional loans allow 3-5% down. However, a larger down payment means lower monthly payments
              and less interest paid over time.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">What factors affect my mortgage interest rate?</h3>
            <p className="text-gray-700">
              Your interest rate depends on several factors: credit score (higher = better rates), down payment amount,
              loan term (shorter terms often have lower rates), loan type (fixed vs. adjustable), and current market conditions.
              Even a small rate difference can save or cost you thousands over the loan's life.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">When can I remove PMI from my mortgage?</h3>
            <p className="text-gray-700">
              For conventional loans, you can request PMI removal when you reach 20% equity in your home (based on
              the original purchase price or appraised value). PMI automatically cancels when you reach 22% equity.
              FHA loans have different rules and may require refinancing to remove mortgage insurance.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="home-loan-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
