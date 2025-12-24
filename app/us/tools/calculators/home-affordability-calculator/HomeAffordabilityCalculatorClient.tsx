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
  color: string;
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500' },
  { href: '/us/tools/calculators/bmi-calculator', title: 'BMI Calculator', description: 'Calculate body mass index', color: 'bg-purple-500' },
  { href: '/us/tools/calculators/age-calculator', title: 'Age Calculator', description: 'Calculate your exact age', color: 'bg-orange-500' },
];

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Home Affordability Calculator?",
    answer: "A Home Affordability Calculator is a free online tool designed to help you quickly and accurately calculate home affordability-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Home Affordability Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Home Affordability Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Home Affordability Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function HomeAffordabilityCalculatorClient() {
  const { getH1, getSubHeading } = usePageSEO('home-affordability-calculator');

  // Income inputs
  const [annualIncome, setAnnualIncome] = useState(85000);
  const [monthlyDebts, setMonthlyDebts] = useState(500);
  const [downPayment, setDownPayment] = useState(50000);

  // Loan parameters
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);

  // Additional costs
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.2);
  const [homeInsurance, setHomeInsurance] = useState(1500);
  const [hoaFees, setHoaFees] = useState(0);
  const [pmiRate, setPmiRate] = useState(0.5);

  // DTI preferences
  const [frontEndDTI, setFrontEndDTI] = useState(28);
  const [backEndDTI, setBackEndDTI] = useState(36);
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);

  const results = useMemo(() => {
    const monthlyIncome = annualIncome / 12;

    // Calculate max housing payment based on front-end DTI
    const maxHousingPayment = monthlyIncome * (frontEndDTI / 100);

    // Calculate max total debt payment based on back-end DTI
    const maxTotalDebt = monthlyIncome * (backEndDTI / 100);
    const maxHousingFromBackEnd = maxTotalDebt - monthlyDebts;

    // Use the lower of the two limits
    const effectiveMaxPayment = Math.min(maxHousingPayment, maxHousingFromBackEnd);

    // Monthly interest rate
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;

    // Estimate property tax and insurance per month (as percentage of home value)
    // We need to iterate to find the home price that works
    let homePrice = 0;
    let loanAmount = 0;
    let monthlyPrincipalInterest = 0;
    let monthlyPropertyTax = 0;
    let monthlyInsurance = homeInsurance / 12;
    let monthlyPMI = 0;
    let totalMonthlyPayment = 0;

    // Binary search for home price
    let low = 0;
    let high = 2000000;

    for (let i = 0; i < 50; i++) {
      const testPrice = (low + high) / 2;
      const testLoan = testPrice - downPayment;

      if (testLoan <= 0) {
        high = testPrice;
        continue;
      }

      // Calculate P&I
      const testPI = testLoan * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                     (Math.pow(1 + monthlyRate, numPayments) - 1);

      // Property tax
      const testPropTax = (testPrice * propertyTaxRate / 100) / 12;

      // PMI if down payment < 20%
      const ltv = testLoan / testPrice;
      const testPMI = ltv > 0.8 ? (testLoan * pmiRate / 100) / 12 : 0;

      const testTotal = testPI + testPropTax + monthlyInsurance + testPMI + hoaFees;

      if (Math.abs(testTotal - effectiveMaxPayment) < 1) {
        homePrice = testPrice;
        break;
      } else if (testTotal < effectiveMaxPayment) {
        low = testPrice;
      } else {
        high = testPrice;
      }

      homePrice = testPrice;
    }

    loanAmount = homePrice - downPayment;

    if (loanAmount > 0 && monthlyRate > 0) {
      monthlyPrincipalInterest = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                                  (Math.pow(1 + monthlyRate, numPayments) - 1);
    }

    monthlyPropertyTax = (homePrice * propertyTaxRate / 100) / 12;
    const ltv = loanAmount / homePrice;
    monthlyPMI = ltv > 0.8 ? (loanAmount * pmiRate / 100) / 12 : 0;
    totalMonthlyPayment = monthlyPrincipalInterest + monthlyPropertyTax + monthlyInsurance + monthlyPMI + hoaFees;

    const totalInterest = (monthlyPrincipalInterest * numPayments) - loanAmount;
    const currentDTI = monthlyIncome > 0 ? ((totalMonthlyPayment + monthlyDebts) / monthlyIncome) * 100 : 0;
    const housingDTI = monthlyIncome > 0 ? (totalMonthlyPayment / monthlyIncome) * 100 : 0;

    return {
      homePrice: Math.max(0, homePrice),
      loanAmount: Math.max(0, loanAmount),
      monthlyPayment: totalMonthlyPayment,
      principalInterest: monthlyPrincipalInterest,
      propertyTax: monthlyPropertyTax,
      insurance: monthlyInsurance,
      pmi: monthlyPMI,
      totalInterest,
      downPaymentPercent: homePrice > 0 ? (downPayment / homePrice) * 100 : 0,
      ltv: ltv * 100,
      currentDTI,
      housingDTI,
      maxHousingPayment: effectiveMaxPayment
    };
  }, [annualIncome, monthlyDebts, downPayment, interestRate, loanTerm, propertyTaxRate, homeInsurance, hoaFees, pmiRate, frontEndDTI, backEndDTI]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const relatedCalculators = [
    { href: '/us/tools/calculators/mortgage-calculator-advanced', title: 'Mortgage Calculator', description: 'Calculate monthly payments', icon: '🏠' },
    { href: '/us/tools/calculators/mortgage-payment-calculator', title: 'Payment Calculator', description: 'Detailed payment breakdown', icon: '💵' },
    { href: '/us/tools/calculators/debt-to-income-calculator', title: 'DTI Calculator', description: 'Check your debt ratio', icon: '📊' },
    { href: '/us/tools/calculators/home-loan-calculator', title: 'Home Loan Calculator', description: 'Compare loan options', icon: '🏦' },
    { href: '/us/tools/calculators/mortgage-refinance-calculator', title: 'Refinance Calculator', description: 'Should you refinance?', icon: '🔄' },
    { href: '/us/tools/calculators/loan-to-value-calculator', title: 'LTV Calculator', description: 'Calculate loan-to-value', icon: '📈' },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-2 sm:px-4 py-3 sm:py-4 md:py-6">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Home Affordability Calculator')}</h1>
        <p className="text-base sm:text-lg text-gray-600">Find out how much house you can afford based on your income, debts, and down payment</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Calculator */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Financial Information</h2>

            {/* Income Section */}
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
              <h3 className="font-semibold text-green-800 mb-3">Income & Debts</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Gross Income: {formatCurrency(annualIncome)}
                  </label>
                  <input
                    type="range"
                    min="30000"
                    max="500000"
                    step="5000"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(parseInt(e.target.value))}
                    className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Debt Payments: {formatCurrency(monthlyDebts)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="50"
                    value={monthlyDebts}
                    onChange={(e) => setMonthlyDebts(parseInt(e.target.value))}
                    className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-1">Car loans, student loans, credit cards, etc.</p>
                </div>
              </div>
            </div>

            {/* Down Payment */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-3">Down Payment</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Down Payment: {formatCurrency(downPayment)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="500000"
                  step="5000"
                  value={downPayment}
                  onChange={(e) => setDownPayment(parseInt(e.target.value))}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Loan Terms */}
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
              <h3 className="font-semibold text-purple-800 mb-3">Loan Terms</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interest Rate: {interestRate.toFixed(2)}%
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="10"
                    step="0.125"
                    value={interestRate}
                    onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                    className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loan Term</label>
                  <div className="flex gap-2">
                    {[15, 20, 30].map((term) => (
                      <button
                        key={term}
                        onClick={() => setLoanTerm(term)}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                          loanTerm === term
                            ? 'bg-purple-600 text-white'
                            : 'bg-white border border-purple-300 text-purple-700 hover:bg-purple-50'
                        }`}
                      >
                        {term} Years
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Costs */}
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
              <h3 className="font-semibold text-amber-800 mb-3">Additional Costs</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Property Tax Rate</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={propertyTaxRate}
                      onChange={(e) => setPropertyTaxRate(parseFloat(e.target.value) || 0)}
                      step="0.1"
                      className="w-full px-3 py-2 border border-amber-300 rounded-lg text-sm"
                    />
                    <span className="absolute right-3 top-2 text-gray-500 text-sm">%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Annual Insurance</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500 text-sm">$</span>
                    <input
                      type="number"
                      value={homeInsurance}
                      onChange={(e) => setHomeInsurance(parseInt(e.target.value) || 0)}
                      className="w-full pl-7 pr-3 py-2 border border-amber-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Monthly HOA</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500 text-sm">$</span>
                    <input
                      type="number"
                      value={hoaFees}
                      onChange={(e) => setHoaFees(parseInt(e.target.value) || 0)}
                      className="w-full pl-7 pr-3 py-2 border border-amber-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">PMI Rate</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={pmiRate}
                      onChange={(e) => setPmiRate(parseFloat(e.target.value) || 0)}
                      step="0.1"
                      className="w-full px-3 py-2 border border-amber-300 rounded-lg text-sm"
                    />
                    <span className="absolute right-3 top-2 text-gray-500 text-sm">%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {/* Main Result */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-3 sm:p-4 md:p-6">
              <div className="text-center">
                <div className="text-sm font-medium text-green-100 mb-2">You Can Afford a Home Up To</div>
                <div className="text-4xl sm:text-5xl font-bold mb-2">{formatCurrency(results.homePrice)}</div>
                <div className="text-green-100 text-sm">Based on your income and debts</div>
              </div>
            </div>

            {/* Monthly Payment Breakdown */}
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-semibold text-gray-800 mb-4">Monthly Payment: {formatCurrency(results.monthlyPayment)}</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Principal & Interest:</span>
                  <span className="font-semibold">{formatCurrency(results.principalInterest)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Property Tax:</span>
                  <span className="font-semibold">{formatCurrency(results.propertyTax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Home Insurance:</span>
                  <span className="font-semibold">{formatCurrency(results.insurance)}</span>
                </div>
                {results.pmi > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">PMI:</span>
                    <span className="font-semibold text-orange-600">{formatCurrency(results.pmi)}</span>
                  </div>
                )}
                {hoaFees > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">HOA Fees:</span>
                    <span className="font-semibold">{formatCurrency(hoaFees)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Loan Details */}
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-4">Loan Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Loan Amount:</span>
                  <span className="font-semibold text-blue-800">{formatCurrency(results.loanAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Down Payment:</span>
                  <span className="font-semibold text-blue-800">{formatCurrency(downPayment)} ({results.downPaymentPercent.toFixed(1)}%)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Loan-to-Value:</span>
                  <span className="font-semibold text-blue-800">{results.ltv.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Total Interest:</span>
                  <span className="font-semibold text-blue-800">{formatCurrency(results.totalInterest)}</span>
                </div>
              </div>
            </div>

            {/* DTI Ratios */}
            <div className="grid grid-cols-2 gap-4">
              <div className={`rounded-xl p-4 text-center ${results.housingDTI <= 28 ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
                <div className="text-sm text-gray-600 mb-1">Housing DTI</div>
                <div className={`text-2xl font-bold ${results.housingDTI <= 28 ? 'text-green-600' : 'text-orange-600'}`}>
                  {results.housingDTI.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500">Target: ≤28%</div>
              </div>
              <div className={`rounded-xl p-4 text-center ${results.currentDTI <= 36 ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
                <div className="text-sm text-gray-600 mb-1">Total DTI</div>
                <div className={`text-2xl font-bold ${results.currentDTI <= 36 ? 'text-green-600' : 'text-orange-600'}`}>
                  {results.currentDTI.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500">Target: ≤36%</div>
              </div>
            </div>

            {/* PMI Warning */}
            {results.downPaymentPercent < 20 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <span className="text-amber-500 text-xl">⚠️</span>
                  <div>
                    <div className="font-semibold text-amber-800">PMI Required</div>
                    <p className="text-sm text-amber-700">
                      With less than 20% down, you&apos;ll pay {formatCurrency(results.pmi)}/month in PMI until you reach 20% equity.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Payment Breakdown Chart */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Monthly Payment Breakdown</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 sm:gap-5 md:gap-8">
          <svg viewBox="0 0 200 200" className="w-64 h-64">
            {(() => {
              const segments = [
                { label: 'Principal & Interest', value: results.principalInterest, color: '#3b82f6' },
                { label: 'Property Tax', value: results.propertyTax, color: '#10b981' },
                { label: 'Insurance', value: results.insurance, color: '#8b5cf6' },
                ...(results.pmi > 0 ? [{ label: 'PMI', value: results.pmi, color: '#ef4444' }] : []),
                ...(hoaFees > 0 ? [{ label: 'HOA', value: hoaFees, color: '#f59e0b' }] : [])
              ];

              const total = segments.reduce((sum, s) => sum + s.value, 0);
              const radius = 70;
              const strokeWidth = 20;
              const circumference = 2 * Math.PI * radius;
              let offset = 0;

              return (
                <>
                  {segments.map((seg, i) => {
                    const percent = (seg.value / total) * 100;
                    const dashArray = (percent / 100) * circumference;
                    const currentOffset = offset;
                    offset += dashArray;

                    return (
                      <circle
                        key={i}
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="none"
                        stroke={seg.color}
                        strokeWidth={hoveredSegment === i ? strokeWidth + 4 : strokeWidth}
                        strokeDasharray={`${dashArray} ${circumference}`}
                        strokeDashoffset={-currentOffset}
                        className="cursor-pointer transition-all duration-200"
                        transform="rotate(-90 100 100)"
                        onMouseEnter={() => setHoveredSegment(i)}
                        onMouseLeave={() => setHoveredSegment(null)}
                      />
                    );
                  })}
                  <text x="100" y="95" textAnchor="middle" fontSize="14" fontWeight="600" fill="#374151">
                    {formatCurrency(total)}
                  </text>
                  <text x="100" y="112" textAnchor="middle" fontSize="10" fill="#6b7280">
                    /month
                  </text>
                </>
              );
            })()}
          </svg>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <div className="flex-1">
                <div className="text-sm text-gray-600">Principal & Interest</div>
                <div className="font-semibold text-gray-800">{formatCurrency(results.principalInterest)}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <div className="flex-1">
                <div className="text-sm text-gray-600">Property Tax</div>
                <div className="font-semibold text-gray-800">{formatCurrency(results.propertyTax)}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <div className="flex-1">
                <div className="text-sm text-gray-600">Insurance</div>
                <div className="font-semibold text-gray-800">{formatCurrency(results.insurance)}</div>
              </div>
            </div>
            {results.pmi > 0 && (
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <div className="flex-1">
                  <div className="text-sm text-gray-600">PMI</div>
                  <div className="font-semibold text-gray-800">{formatCurrency(results.pmi)}</div>
                </div>
              </div>
            )}
            {hoaFees > 0 && (
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-amber-500 rounded"></div>
                <div className="flex-1">
                  <div className="text-sm text-gray-600">HOA</div>
                  <div className="font-semibold text-gray-800">{formatCurrency(hoaFees)}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Affordability at Different Income Levels */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Home Price at Different Income Levels</h2>
        <div className="w-full overflow-x-auto">
          <svg viewBox="0 0 800 300" className="w-full h-auto">
            {(() => {
              const incomeMultipliers = [0.5, 0.75, 1, 1.25, 1.5];
              const maxPrice = results.homePrice * 1.8;

              return (
                <>
                  {/* Grid lines */}
                  {[0, 1, 2, 3, 4].map((i) => {
                    const y = 20 + (i * 260 / 4);
                    return (
                      <g key={i}>
                        <line x1="100" y1={y} x2="770" y2={y} stroke="#e5e7eb" strokeWidth="1" />
                        <text x="90" y={y + 5} textAnchor="end" fontSize="12" fill="#6b7280">
                          ${Math.round((maxPrice * (1 - i * 0.25)) / 1000)}K
                        </text>
                      </g>
                    );
                  })}

                  {/* Bars */}
                  {incomeMultipliers.map((mult, idx) => {
                    const income = annualIncome * mult;
                    const monthlyInc = income / 12;
                    const maxHousingPayment = Math.min(
                      monthlyInc * (frontEndDTI / 100),
                      monthlyInc * (backEndDTI / 100) - monthlyDebts
                    );

                    // Calculate affordability with binary search
                    let affordablePrice = 0;
                    let low = 0;
                    let high = 2000000;
                    for (let i = 0; i < 30; i++) {
                      const testPrice = (low + high) / 2;
                      const testLoan = testPrice - downPayment;
                      if (testLoan <= 0) { high = testPrice; continue; }
                      const monthlyRate = interestRate / 100 / 12;
                      const numPayments = loanTerm * 12;
                      const testPI = testLoan * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
                      const testPropTax = (testPrice * propertyTaxRate / 100) / 12;
                      const ltv = testLoan / testPrice;
                      const testPMI = ltv > 0.8 ? (testLoan * pmiRate / 100) / 12 : 0;
                      const testTotal = testPI + testPropTax + homeInsurance / 12 + testPMI + hoaFees;
                      if (Math.abs(testTotal - maxHousingPayment) < 1) { affordablePrice = testPrice; break; }
                      else if (testTotal < maxHousingPayment) low = testPrice;
                      else high = testPrice;
                      affordablePrice = testPrice;
                    }

                    const barWidth = 100;
                    const x = 120 + idx * 130;
                    const barHeight = (affordablePrice / maxPrice) * 260;
                    const isCurrent = mult === 1;

                    return (
                      <g key={idx}>
                        {/* Bar */}
                        <rect
                          x={x}
                          y={280 - barHeight}
                          width={barWidth}
                          height={barHeight}
                          fill={isCurrent ? '#3b82f6' : '#93c5fd'}
                          stroke={isCurrent ? '#2563eb' : '#60a5fa'}
                          strokeWidth="2"
                          rx="4"
                        />
                        {/* Value on bar */}
                        <text
                          x={x + barWidth / 2}
                          y={270 - barHeight}
                          textAnchor="middle"
                          fontSize="12"
                          fontWeight="600"
                          fill={isCurrent ? '#1e40af' : '#3b82f6'}
                        >
                          {formatCurrency(affordablePrice)}
                        </text>
                        {/* Income label */}
                        <text
                          x={x + barWidth / 2}
                          y="295"
                          textAnchor="middle"
                          fontSize="11"
                          fill={isCurrent ? '#1f2937' : '#6b7280'}
                          fontWeight={isCurrent ? '600' : '400'}
                        >
                          {formatCurrency(income)}
                        </text>
                        {isCurrent && (
                          <text
                            x={x + barWidth / 2}
                            y="308"
                            textAnchor="middle"
                            fontSize="9"
                            fill="#2563eb"
                            fontWeight="600"
                          >
                            Your Income
                          </text>
                        )}
                      </g>
                    );
                  })}
                </>
              );
            })()}
          </svg>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 text-center mt-4">
          See how different income levels affect home affordability with your current debts and down payment
        </p>
      </div>

      {/* DTI Ratio Visualization */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Debt-to-Income Ratio Analysis</h2>
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {/* Housing DTI Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Housing DTI (Front-End)</span>
              <span className="text-sm font-semibold text-gray-800">{results.housingDTI.toFixed(1)}%</span>
            </div>
            <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  results.housingDTI <= 28 ? 'bg-green-500' :
                  results.housingDTI <= 35 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(results.housingDTI, 100)}%` }}
              />
              {/* Target line */}
              <div className="absolute left-[28%] top-0 bottom-0 w-0.5 bg-gray-400" />
              <div className="absolute left-[28%] -top-6 transform -translate-x-1/2 text-xs text-gray-500">
                Target: 28%
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              {results.housingDTI <= 28
                ? 'Excellent! Your housing costs are within the recommended limit.'
                : results.housingDTI <= 35
                ? 'Moderate. Consider reducing housing costs or increasing income.'
                : 'High risk. Housing costs exceed recommended limits.'}
            </p>
          </div>

          {/* Total DTI Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Total DTI (Back-End)</span>
              <span className="text-sm font-semibold text-gray-800">{results.currentDTI.toFixed(1)}%</span>
            </div>
            <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  results.currentDTI <= 36 ? 'bg-green-500' :
                  results.currentDTI <= 43 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(results.currentDTI, 100)}%` }}
              />
              {/* Target line */}
              <div className="absolute left-[36%] top-0 bottom-0 w-0.5 bg-gray-400" />
              <div className="absolute left-[36%] -top-6 transform -translate-x-1/2 text-xs text-gray-500">
                Target: 36%
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              {results.currentDTI <= 36
                ? 'Great! Your total debt is manageable for most lenders.'
                : results.currentDTI <= 43
                ? 'Above conventional limits but may qualify for FHA/VA loans.'
                : 'Very high. Consider paying down debts before buying.'}
            </p>
          </div>

          {/* Monthly Budget Breakdown */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-4">Monthly Budget Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-700">Gross Monthly Income:</span>
                <span className="font-semibold text-blue-900">{formatCurrency(annualIncome / 12)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-700">Housing Payment:</span>
                <span className="font-semibold text-blue-900">{formatCurrency(results.monthlyPayment)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-700">Other Debts:</span>
                <span className="font-semibold text-blue-900">{formatCurrency(monthlyDebts)}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-blue-200">
                <span className="text-sm font-semibold text-blue-800">Total Debt Payments:</span>
                <span className="font-bold text-blue-900">{formatCurrency(results.monthlyPayment + monthlyDebts)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-blue-800">Remaining Income:</span>
                <span className="font-bold text-green-600">
                  {formatCurrency((annualIncome / 12) - (results.monthlyPayment + monthlyDebts))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners */}
      <CalculatorAfterCalcBanners />

      {/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-xl p-4 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full text-center">
                <div className="text-2xl mb-2">{calc.icon}</div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{calc.title}</h3>
                <p className="text-xs text-gray-600">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">How Much House Can You Afford?</h2>

        <div className="prose max-w-none">
          <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
            Determining how much house you can afford is one of the most important steps in the home buying process. This calculator uses industry-standard debt-to-income ratios and factors in all the costs of homeownership—not just your mortgage payment—to give you a realistic picture of your home buying budget.
          </p>

          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-3">The 28/36 Rule</h3>
              <p className="text-blue-700 text-sm mb-2">
                Most lenders follow the 28/36 rule: your housing costs shouldn&apos;t exceed 28% of gross income (front-end DTI), and total debt payments shouldn&apos;t exceed 36% (back-end DTI).
              </p>
              <ul className="text-blue-600 text-xs space-y-1">
                <li>• Housing costs include principal, interest, taxes, insurance (PITI)</li>
                <li>• Total debt includes housing plus car loans, student loans, credit cards</li>
              </ul>
            </div>
            <div className="bg-green-50 p-5 rounded-xl border border-green-100">
              <h3 className="font-semibold text-green-800 mb-3">True Cost of Homeownership</h3>
              <p className="text-green-700 text-sm mb-2">
                Your mortgage payment is just the beginning. Factor in these additional costs:
              </p>
              <ul className="text-green-600 text-xs space-y-1">
                <li>• Property taxes (1-3% of home value annually)</li>
                <li>• Homeowner&apos;s insurance ($1,000-$3,000/year)</li>
                <li>• PMI if down payment is less than 20%</li>
                <li>• Maintenance (1-2% of home value annually)</li>
              </ul>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Why Your Down Payment Matters</h3>
          <p className="text-gray-600 mb-4 leading-relaxed">
            A larger down payment means a smaller loan, lower monthly payments, and potentially a better interest rate. Putting down at least 20% eliminates the need for Private Mortgage Insurance (PMI), which can cost 0.5-1% of your loan amount annually.
          </p>

          <div className="bg-amber-50 p-5 rounded-xl border border-amber-200 mb-3 sm:mb-4 md:mb-6">
            <h4 className="font-semibold text-amber-800 mb-2">Understanding PMI</h4>
            <p className="text-amber-700 text-sm">
              PMI protects the lender if you default—it doesn&apos;t benefit you directly. On a $300,000 loan, PMI might cost $125-$250 per month. Once you reach 20% equity through payments or appreciation, you can request PMI removal from conventional loans. FHA loans require mortgage insurance for the life of the loan.
            </p>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Affordable vs. Comfortable</h3>
          <p className="text-gray-600 mb-4 leading-relaxed">
            What you can afford and what you should spend are different. Lenders may approve you for more than is comfortable. Consider your lifestyle, savings goals, and job security. Many financial advisors recommend keeping housing costs at 25% of take-home pay rather than the maximum allowed.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-3 sm:mb-4 md:mb-6">
            <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-center">
              <div className="text-red-800 font-semibold mb-1">Conservative</div>
              <div className="text-2xl font-bold text-red-600">25%</div>
              <div className="text-xs text-red-700">of take-home pay</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-center">
              <div className="text-yellow-800 font-semibold mb-1">Standard</div>
              <div className="text-2xl font-bold text-yellow-600">28%</div>
              <div className="text-xs text-yellow-700">of gross income</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-center">
              <div className="text-orange-800 font-semibold mb-1">Maximum</div>
              <div className="text-2xl font-bold text-orange-600">36%</div>
              <div className="text-xs text-orange-700">with all debts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>

        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">How much income do I need to buy a $300,000 house?</h3>
            <p className="text-gray-600 leading-relaxed">
              For a $300,000 home with 10% down, you&apos;d need roughly $65,000-$75,000 annual income, assuming a 6.5% rate, minimal other debts, and following the 28% rule. With a 20% down payment, you could qualify with around $55,000-$65,000. Your exact requirements depend on your debts, interest rate, property taxes, and the lender&apos;s DTI limits.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">What is the 28/36 rule for home buying?</h3>
            <p className="text-gray-600 leading-relaxed">
              The 28/36 rule is a lending guideline where your monthly housing costs (mortgage, taxes, insurance, HOA) shouldn&apos;t exceed 28% of your gross monthly income, and your total monthly debt payments (housing plus car loans, student loans, credit cards) shouldn&apos;t exceed 36%. Some loan programs allow higher ratios—FHA loans may allow up to 50% back-end DTI.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Is it worth putting 20% down on a house?</h3>
            <p className="text-gray-600 leading-relaxed">
              Putting 20% down eliminates PMI, reduces your loan amount, and often gets you a better interest rate. However, it&apos;s not always the best choice. If it depletes your savings or delays buying for years, a smaller down payment may make sense. Consider low-down-payment options like FHA (3.5%), VA (0%), or conventional (3-5%) loans, weighing the PMI cost against waiting to save more.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">What credit score do I need to buy a house?</h3>
            <p className="text-gray-600 leading-relaxed">
              Minimum credit scores vary by loan type: conventional loans typically require 620+, FHA loans accept 580+ with 3.5% down (500+ with 10% down), VA and USDA loans don&apos;t have official minimums but lenders usually want 620+. For the best rates, aim for 740+. Each 20-point improvement in your score can save thousands over the life of your loan.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">How much should I save for closing costs?</h3>
            <p className="text-gray-600 leading-relaxed">
              Closing costs typically run 2-5% of the purchase price. For a $300,000 home, budget $6,000-$15,000. These include lender fees, title insurance, appraisal, attorney fees, prepaid taxes and insurance. You can negotiate seller concessions (up to 3-6% depending on loan type) or look for lender credits, but this usually means a slightly higher interest rate.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Can I buy a house with student loan debt?</h3>
            <p className="text-gray-600 leading-relaxed">
              Yes, many buyers have student loans. Lenders include your student loan payments in your DTI calculation. If your payments are income-driven and showing $0, lenders typically use 0.5-1% of the loan balance as a hypothetical payment. Paying down other debts, increasing income, or choosing a less expensive home can help you qualify. FHA and some conventional programs are more lenient with student debt.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="home-affordability-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
