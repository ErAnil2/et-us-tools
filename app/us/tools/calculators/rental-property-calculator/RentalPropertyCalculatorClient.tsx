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
  color: string;
  icon: string;
}

interface Props {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '%' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

interface YearlyProjection {
  year: number;
  income: number;
  expenses: number;
  cashFlow: number;
  cumulative: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Rental Property Calculator?",
    answer: "A Rental Property Calculator is a free online tool designed to help you quickly and accurately calculate rental property-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Rental Property Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Rental Property Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Rental Property Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function RentalPropertyCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('rental-property-calculator');

  const [purchasePrice, setPurchasePrice] = useState(250000);
  const [rentalIncome, setRentalIncome] = useState(2000);
  const [downPayment, setDownPayment] = useState(20);
  const [interestRate, setInterestRate] = useState(7.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [propertyTaxes, setPropertyTaxes] = useState(200);
  const [insurance, setInsurance] = useState(100);
  const [maintenance, setMaintenance] = useState(150);
  const [vacancyRate, setVacancyRate] = useState(5);
  const [showFullProjection, setShowFullProjection] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const results = useMemo(() => {
    const downPaymentAmount = purchasePrice * (downPayment / 100);
    const loanAmount = purchasePrice - downPaymentAmount;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;

    const monthlyPayment = loanAmount > 0
      ? loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
      : 0;

    const effectiveIncome = rentalIncome * (1 - vacancyRate / 100);
    const totalExpenses = monthlyPayment + propertyTaxes + insurance + maintenance;
    const monthlyCashFlow = effectiveIncome - totalExpenses;
    const annualCashFlow = monthlyCashFlow * 12;

    const closingCosts = purchasePrice * 0.02;
    const totalCashInvested = downPaymentAmount + closingCosts;
    const cashOnCashReturn = totalCashInvested > 0 ? (annualCashFlow / totalCashInvested) * 100 : 0;

    const annualNOI = (effectiveIncome - propertyTaxes - insurance - maintenance) * 12;
    const capRate = purchasePrice > 0 ? (annualNOI / purchasePrice) * 100 : 0;
    const onePercentRule = (rentalIncome / purchasePrice) * 100;
    const dscr = monthlyPayment > 0 ? effectiveIncome / monthlyPayment : 0;

    let rating = 'Fair Investment';
    let barWidth = 50;
    let grade = 'C';
    let gradeDesc = 'Needs improvement';

    if (monthlyCashFlow > 300 && cashOnCashReturn > 8) {
      rating = 'Excellent Investment';
      barWidth = 90;
      grade = 'A';
      gradeDesc = 'Excellent investment opportunity';
    } else if (monthlyCashFlow > 100 && cashOnCashReturn > 6) {
      rating = 'Good Investment';
      barWidth = 70;
      grade = 'B+';
      gradeDesc = 'Good cash flow potential';
    } else if (monthlyCashFlow > 0) {
      rating = 'Fair Investment';
      barWidth = 50;
      grade = 'B';
      gradeDesc = 'Moderate returns expected';
    } else {
      rating = 'Poor Investment';
      barWidth = 20;
      grade = 'D';
      gradeDesc = 'Negative cash flow - reconsider';
    }

    return {
      monthlyCashFlow,
      annualCashFlow,
      monthlyPayment,
      effectiveIncome,
      totalExpenses,
      totalCashInvested,
      capRate,
      cashOnCashReturn,
      onePercentRule,
      dscr,
      rating,
      barWidth,
      grade,
      gradeDesc,
      downPaymentAmount,
      loanAmount
    };
  }, [purchasePrice, rentalIncome, downPayment, interestRate, loanTerm, propertyTaxes, insurance, maintenance, vacancyRate]);

  // What-If Scenarios
  const scenarios = useMemo(() => {
    const calcCashFlow = (price: number, rent: number, down: number, vacancy: number) => {
      const downAmount = price * (down / 100);
      const loan = price - downAmount;
      const monthlyRate = interestRate / 100 / 12;
      const numPayments = loanTerm * 12;
      const payment = loan > 0
        ? loan * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
        : 0;
      const effective = rent * (1 - vacancy / 100);
      const expenses = payment + propertyTaxes + insurance + maintenance;
      return effective - expenses;
    };

    const base = results.monthlyCashFlow;

    return [
      {
        title: 'Higher Rent',
        description: '+10% market increase',
        value: calcCashFlow(purchasePrice, rentalIncome * 1.1, downPayment, vacancyRate),
        diff: calcCashFlow(purchasePrice, rentalIncome * 1.1, downPayment, vacancyRate) - base
      },
      {
        title: 'Lower Price',
        description: '-5% negotiated price',
        value: calcCashFlow(purchasePrice * 0.95, rentalIncome, downPayment, vacancyRate),
        diff: calcCashFlow(purchasePrice * 0.95, rentalIncome, downPayment, vacancyRate) - base
      },
      {
        title: 'Higher Down',
        description: '+5% down payment',
        value: calcCashFlow(purchasePrice, rentalIncome, downPayment + 5, vacancyRate),
        diff: calcCashFlow(purchasePrice, rentalIncome, downPayment + 5, vacancyRate) - base
      }
    ];
  }, [purchasePrice, rentalIncome, downPayment, interestRate, loanTerm, propertyTaxes, insurance, maintenance, vacancyRate, results.monthlyCashFlow]);

  // 10-Year Projection
  const projectionData = useMemo(() => {
    const data: YearlyProjection[] = [];
    const annualIncome = results.effectiveIncome * 12;
    const annualExpenses = results.totalExpenses * 12;
    let cumulative = 0;

    for (let year = 1; year <= 10; year++) {
      const yearlyIncome = annualIncome * Math.pow(1.03, year - 1);
      const yearlyExpenses = annualExpenses * Math.pow(1.025, year - 1);
      const yearlyFlow = yearlyIncome - yearlyExpenses;
      cumulative += yearlyFlow;
      data.push({ year, income: yearlyIncome, expenses: yearlyExpenses, cashFlow: yearlyFlow, cumulative });
    }
    return data;
  }, [results.effectiveIncome, results.totalExpenses]);

  // SVG Donut Chart for Cash Flow Breakdown
  const renderDonutChart = () => {
    const income = results.effectiveIncome;
    const mortgage = results.monthlyPayment;
    const operating = propertyTaxes + insurance + maintenance;
    const cashFlow = Math.max(0, results.monthlyCashFlow);
    const total = income;

    if (total === 0) return null;

    const mortgagePercent = (mortgage / total) * 100;
    const operatingPercent = (operating / total) * 100;
    const cashFlowPercent = Math.max(0, (cashFlow / total) * 100);

    const radius = 70;
    const strokeWidth = 20;
    const circumference = 2 * Math.PI * radius;

    const segments = [
      { label: 'Mortgage', value: mortgage, percent: mortgagePercent, color: '#EF4444', offset: 0 },
      { label: 'Operating', value: operating, percent: operatingPercent, color: '#F59E0B', offset: mortgagePercent },
      { label: 'Cash Flow', value: cashFlow, percent: cashFlowPercent, color: '#10B981', offset: mortgagePercent + operatingPercent }
    ];

    return (
      <div className="flex flex-col items-center">
        <svg width="180" height="180" viewBox="0 0 180 180" className="transform -rotate-90">
          {segments.map((seg, i) => (
            <circle
              key={i}
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={hoveredSegment === i ? strokeWidth + 4 : strokeWidth}
              strokeDasharray={`${(seg.percent / 100) * circumference} ${circumference}`}
              strokeDashoffset={-(seg.offset / 100) * circumference}
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={() => setHoveredSegment(i)}
              onMouseLeave={() => setHoveredSegment(null)}
            />
          ))}
          <text x="90" y="85" textAnchor="middle" fill="#374151" fontSize="12" fontWeight="600" transform="rotate(90 90 90)">
            {formatCurrency(income)}
          </text>
          <text x="90" y="100" textAnchor="middle" fill="#6B7280" fontSize="10" transform="rotate(90 90 90)">
            Monthly Income
          </text>
        </svg>
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {segments.map((seg, i) => (
            <div key={i} className={`flex items-center gap-2 px-2 py-1 rounded ${hoveredSegment === i ? 'bg-gray-100' : ''}`}>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }}></div>
              <span className="text-xs text-gray-600">{seg.label}: {formatCurrency(seg.value)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // SVG Bar Chart for Income vs Expenses
  const renderProjectionChart = () => {
    const data = projectionData.slice(0, 5);
    const maxValue = Math.max(...data.map(d => Math.max(d.income, d.expenses)));
    const width = 400;
    const height = 200;
    const barWidth = 30;
    const groupGap = 50;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {data.map((d, i) => {
          const incomeHeight = (d.income / maxValue) * 140;
          const expenseHeight = (d.expenses / maxValue) * 140;
          const x = 40 + i * (barWidth * 2 + groupGap);

          return (
            <g key={i}>
              <rect x={x} y={160 - incomeHeight} width={barWidth} height={incomeHeight} fill="#10B981" rx="3" />
              <rect x={x + barWidth + 4} y={160 - expenseHeight} width={barWidth} height={expenseHeight} fill="#EF4444" rx="3" />
              <text x={x + barWidth} y={180} textAnchor="middle" fill="#6B7280" fontSize="10">
                Yr {d.year}
              </text>
            </g>
          );
        })}
        <rect x={280} y={15} width={12} height={12} fill="#10B981" rx="2" />
        <text x={297} y={25} fill="#6B7280" fontSize="10">Income</text>
        <rect x={280} y={35} width={12} height={12} fill="#EF4444" rx="2" />
        <text x={297} y={45} fill="#6B7280" fontSize="10">Expenses</text>
      </svg>
    );
  };

  const displayedProjections = showFullProjection ? projectionData : projectionData.slice(0, 5);

  return (
    <div className="max-w-[1180px] mx-auto px-2 sm:px-4 py-3 sm:py-4 md:py-6">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Rental Property Calculator')}</h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Analyze rental property investments with cash flow projections, ROI calculations, and investment grade ratings
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Calculator */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Property Details</h2>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Purchase Price</label>
                  <span className="text-sm font-semibold text-blue-600">{formatCurrency(purchasePrice)}</span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="1000000"
                  step="5000"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>$50K</span>
                  <span>$1M</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Monthly Rental Income</label>
                  <span className="text-sm font-semibold text-emerald-600">{formatCurrency(rentalIncome)}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="50"
                  value={rentalIncome}
                  onChange={(e) => setRentalIncome(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>$500</span>
                  <span>$10,000</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">Down Payment</label>
                    <span className="text-sm font-semibold text-purple-600">{downPayment}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="1"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">Interest Rate</label>
                    <span className="text-sm font-semibold text-rose-600">{interestRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="12"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Loan Term</label>
                <select
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="15">15 Years</option>
                  <option value="20">20 Years</option>
                  <option value="30">30 Years</option>
                </select>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Monthly Operating Expenses</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Property Tax</label>
                    <input
                      type="number"
                      value={propertyTaxes}
                      onChange={(e) => setPropertyTaxes(Number(e.target.value))}
                      className="w-full px-2 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Insurance</label>
                    <input
                      type="number"
                      value={insurance}
                      onChange={(e) => setInsurance(Number(e.target.value))}
                      className="w-full px-2 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Maintenance</label>
                    <input
                      type="number"
                      value={maintenance}
                      onChange={(e) => setMaintenance(Number(e.target.value))}
                      className="w-full px-2 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Vacancy Rate</label>
                  <span className="text-sm font-semibold text-amber-600">{vacancyRate}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={vacancyRate}
                  onChange={(e) => setVacancyRate(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Investment Analysis</h2>

            <div className={`rounded-xl p-5 mb-5 border ${results.monthlyCashFlow >= 0 ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100' : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-100'}`}>
              <div className={`text-sm mb-1 ${results.monthlyCashFlow >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>Monthly Cash Flow</div>
              <div className={`text-3xl sm:text-4xl font-bold ${results.monthlyCashFlow >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {formatCurrency(results.monthlyCashFlow)}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Annual: {formatCurrency(results.annualCashFlow)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="text-xs text-blue-600 mb-1">Total Cash Invested</div>
                <div className="text-lg font-bold text-blue-600">{formatCurrency(results.totalCashInvested)}</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                <div className="text-xs text-purple-600 mb-1">Cash-on-Cash ROI</div>
                <div className="text-lg font-bold text-purple-600">{results.cashOnCashReturn.toFixed(1)}%</div>
              </div>
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                <div className="text-xs text-amber-600 mb-1">Cap Rate</div>
                <div className="text-lg font-bold text-amber-600">{results.capRate.toFixed(1)}%</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="text-xs text-gray-500 mb-1">1% Rule</div>
                <div className="text-lg font-bold text-gray-800">{results.onePercentRule.toFixed(2)}%</div>
              </div>
            </div>

            {/* Investment Grade */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-100 mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Investment Grade</span>
                <span className="text-2xl font-bold text-indigo-600">{results.grade}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div
                  className={`h-2.5 rounded-full transition-all duration-500 ${results.monthlyCashFlow > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                  style={{ width: `${results.barWidth}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600">{results.gradeDesc}</p>
            </div>

            {/* Donut Chart */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 text-center mb-3">Cash Flow Breakdown</h3>
              {renderDonutChart()}
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* What-If Scenarios */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">What-If Scenarios</h2>
        <p className="text-gray-600 text-sm mb-3 sm:mb-4 md:mb-6">See how different factors affect your monthly cash flow</p>

        <div className="grid sm:grid-cols-3 gap-4">
          {scenarios.map((scenario, index) => (
            <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {index === 0 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />}
                    {index === 1 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />}
                    {index === 2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{scenario.title}</h3>
                  <p className="text-xs text-gray-500">{scenario.description}</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-2">{formatCurrency(scenario.value)}/mo</div>
              <div className={`text-sm font-medium ${scenario.diff >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {scenario.diff >= 0 ? '+' : ''}{formatCurrency(scenario.diff)} monthly
              </div>
            </div>
          ))}
        </div>
      </div>
{/* Projection Chart & Table */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">10-Year Cash Flow Projection</h2>

        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Income vs Expenses (First 5 Years)</h3>
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
              {renderProjectionChart()}
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">Assumes 3% annual rent increase, 2.5% expense increase</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Year-by-Year Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <th className="px-3 py-2 text-left font-semibold text-gray-700 rounded-tl-lg">Year</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-700">Income</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-700">Expenses</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-700">Cash Flow</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-700 rounded-tr-lg">Cumulative</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedProjections.map((row, index) => (
                    <tr key={row.year} className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-3 py-2 font-medium text-gray-800">{row.year}</td>
                      <td className="px-3 py-2 text-right text-emerald-600">{formatCurrency(row.income)}</td>
                      <td className="px-3 py-2 text-right text-red-600">{formatCurrency(row.expenses)}</td>
                      <td className="px-3 py-2 text-right font-medium text-gray-800">{formatCurrency(row.cashFlow)}</td>
                      <td className="px-3 py-2 text-right font-bold text-blue-600">{formatCurrency(row.cumulative)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {projectionData.length > 5 && (
              <div className="mt-3 text-center">
                <button
                  onClick={() => setShowFullProjection(!showFullProjection)}
                  className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors"
                >
                  {showFullProjection ? 'Show Less' : 'Show Full 10 Years'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Investment Tips */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8 border border-blue-100">
        <h3 className="text-xl font-semibold text-blue-900 mb-4">Rental Property Investment Tips</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-blue-100">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-blue-900 mb-2">1% Rule</h4>
            <p className="text-blue-800 text-sm">Monthly rent should be at least 1% of purchase price for positive cash flow potential.</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-emerald-100">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-emerald-900 mb-2">Cap Rate Target</h4>
            <p className="text-emerald-800 text-sm">Aim for 5-10% cap rate. Higher rates indicate better cash flow but may mean more risk.</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-purple-900 mb-2">Cash-on-Cash ROI</h4>
            <p className="text-purple-800 text-sm">Target 8-12% cash-on-cash return for a solid investment with good cash flow.</p>
          </div>
        </div>
      </div>
{/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Investment Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-xl p-4 bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 h-full">
                <div className={`w-10 h-10 ${calc.color || 'bg-blue-100'} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <span className="text-xl">{calc.icon || '📊'}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{calc.title}</h3>
                <p className="text-xs text-gray-600 line-clamp-2">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Understanding Rental Property Investment Returns</h2>
        <div className="prose max-w-none text-gray-600 space-y-4">
          <p>
            Rental property investing remains one of the most effective wealth-building strategies in America, offering multiple avenues for profit including monthly cash flow, property appreciation, tax benefits, and equity buildup through mortgage paydown. Understanding key metrics like capitalization rate (cap rate), cash-on-cash return, and net operating income (NOI) is essential for evaluating potential investment properties and comparing opportunities across different markets.
          </p>
          <p>
            The 1% rule serves as a quick screening tool for rental properties—the monthly rent should equal at least 1% of the purchase price to generate positive cash flow. For a $200,000 property, this means targeting $2,000 in monthly rent. While this rule provides a useful starting point, thorough analysis must account for all operating expenses including property taxes, insurance, maintenance reserves, vacancy allowances, and property management fees, which typically consume 40-50% of gross rental income.
          </p>
          <p>
            Financing strategy significantly impacts rental property returns. Conventional investment property loans typically require 20-25% down payments with interest rates 0.5-0.75% higher than primary residence loans. House hacking—living in one unit of a multi-family property—allows investors to use FHA loans with as little as 3.5% down while collecting rent from other units. Portfolio lenders and DSCR (Debt Service Coverage Ratio) loans offer alternatives for investors who don't meet traditional income documentation requirements.
          </p>
          <p>
            Property location fundamentally determines investment success. Markets with strong job growth, population increases, landlord-friendly laws, and affordable price-to-rent ratios offer the best opportunities for new investors. Cash-on-cash returns of 8-12% are considered strong, while cap rates between 5-10% indicate reasonable value relative to income potential. Markets with sub-4% cap rates may offer appreciation potential but typically provide minimal cash flow.
          </p>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">What is a good cap rate for rental property investments?</h3>
            <p className="text-gray-600">A "good" cap rate depends on your investment goals and risk tolerance. Generally, cap rates between 5-8% are considered reasonable in most US markets. Higher cap rates (8-12%) indicate better cash flow potential but may signal higher risk—properties in declining neighborhoods or requiring significant repairs often have higher cap rates. Lower cap rates (4-6%) are common in appreciation-focused markets like coastal cities where investors prioritize property value growth over immediate cash flow.</p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">How much should I budget for rental property expenses?</h3>
            <p className="text-gray-600">Budget 40-50% of gross rental income for operating expenses. This includes property taxes (typically 1-2% of property value annually), insurance ($800-2,000/year), maintenance and repairs (budget 1% of property value or $100-150 per unit monthly), vacancy allowance (8-10% of annual rent), property management (8-12% of collected rent if using a manager), and reserves for capital expenditures like roof replacement or HVAC systems. Underestimating expenses is the most common mistake new investors make.</p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">What is cash-on-cash return and why does it matter?</h3>
            <p className="text-gray-600">Cash-on-cash return measures the annual pre-tax cash flow relative to the total cash invested—it shows the actual return on your out-of-pocket investment. If you invest $50,000 as a down payment and closing costs, and generate $4,000 in annual cash flow after all expenses and mortgage payments, your cash-on-cash return is 8%. This metric is particularly important because it accounts for financing leverage, unlike cap rate which only considers purchase price and doesn't factor in loan terms.</p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Should I self-manage my rental property or hire a property manager?</h3>
            <p className="text-gray-600">This decision depends on your proximity to the property, available time, and expertise. Self-management saves 8-12% of collected rent but requires handling tenant screening, maintenance coordination, rent collection, and potential evictions. Property management companies are essential for out-of-state investing and valuable for local investors who prefer passive income. Many investors self-manage their first few properties to learn the business, then transition to professional management as their portfolio grows.</p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">How do I calculate vacancy rate and why is it important?</h3>
            <p className="text-gray-600">Vacancy rate represents the percentage of time your property sits empty between tenants. Calculate it by dividing vacant days by total days in the year (30 vacant days ÷ 365 = 8.2% vacancy). Most investors budget 5-10% for vacancy depending on local market conditions. High-demand areas with low inventory may experience 3-5% vacancy, while markets with abundant rental supply might see 10-15%. Factor in turnover costs too—each vacancy typically costs one month's rent for marketing, cleaning, and minor repairs between tenants.</p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">What financing options are available for investment properties?</h3>
            <p className="text-gray-600">Investment property financing includes conventional mortgages (20-25% down, best rates but stricter qualification), portfolio loans from local banks (more flexibility on terms and documentation), DSCR loans (qualification based on property income rather than personal income), hard money loans (short-term bridge financing for renovations at 12-15% interest), and seller financing (negotiated directly with property seller). First-time investors often use house hacking with FHA or conventional low-down-payment loans by living in one unit of a multi-family property.</p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 md:p-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.1c-.77-.833-2.694-.833-3.464 0L3.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-amber-800 mb-1">Disclaimer</h3>
            <p className="text-sm text-amber-700">
              This calculator provides estimates for informational purposes only. Actual returns may vary based on market conditions, property management, tenant quality, and unexpected expenses. Always conduct thorough due diligence and consult with real estate and financial professionals before making investment decisions.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="rental-property-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
