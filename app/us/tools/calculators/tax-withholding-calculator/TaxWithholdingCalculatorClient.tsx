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
  color: string;
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500' },
  { href: '/us/tools/calculators/bmi-calculator', title: 'BMI Calculator', description: 'Calculate body mass index', color: 'bg-purple-500' },
  { href: '/us/tools/calculators/age-calculator', title: 'Age Calculator', description: 'Calculate your exact age', color: 'bg-orange-500' },
];
// 2024 tax brackets and standard deductions
const taxBrackets = {
  single: [
    { min: 0, max: 11000, rate: 0.10 },
    { min: 11000, max: 44725, rate: 0.12 },
    { min: 44725, max: 95375, rate: 0.22 },
    { min: 95375, max: 182050, rate: 0.24 },
    { min: 182050, max: 231250, rate: 0.32 },
    { min: 231250, max: 578125, rate: 0.35 },
    { min: 578125, max: Infinity, rate: 0.37 }
  ],
  marriedJoint: [
    { min: 0, max: 22000, rate: 0.10 },
    { min: 22000, max: 89450, rate: 0.12 },
    { min: 89450, max: 190750, rate: 0.22 },
    { min: 190750, max: 364200, rate: 0.24 },
    { min: 364200, max: 462500, rate: 0.32 },
    { min: 462500, max: 693750, rate: 0.35 },
    { min: 693750, max: Infinity, rate: 0.37 }
  ],
  marriedSeparate: [
    { min: 0, max: 11000, rate: 0.10 },
    { min: 11000, max: 44725, rate: 0.12 },
    { min: 44725, max: 95375, rate: 0.22 },
    { min: 95375, max: 182050, rate: 0.24 },
    { min: 182050, max: 231250, rate: 0.32 },
    { min: 231250, max: 346875, rate: 0.35 },
    { min: 346875, max: Infinity, rate: 0.37 }
  ],
  headOfHousehold: [
    { min: 0, max: 15700, rate: 0.10 },
    { min: 15700, max: 59850, rate: 0.12 },
    { min: 59850, max: 95350, rate: 0.22 },
    { min: 95350, max: 182050, rate: 0.24 },
    { min: 182050, max: 231250, rate: 0.32 },
    { min: 231250, max: 578100, rate: 0.35 },
    { min: 578100, max: Infinity, rate: 0.37 }
  ]
};

const standardDeductions = {
  single: 13850,
  marriedJoint: 27700,
  marriedSeparate: 13850,
  headOfHousehold: 20800
};

type FilingStatus = 'single' | 'marriedJoint' | 'marriedSeparate' | 'headOfHousehold';

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Tax Withholding Calculator?",
    answer: "A Tax Withholding Calculator is a free online tool that helps you calculate and analyze tax withholding-related financial metrics quickly and accurately. It provides instant results to help you make informed financial decisions.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is this Tax Withholding Calculator?",
    answer: "Our Tax Withholding Calculator uses standard financial formulas and provides highly accurate results. However, actual results may vary based on specific terms, conditions, and market factors. Always consult with a financial advisor for major decisions.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Tax Withholding Calculator free to use?",
    answer: "Yes, this Tax Withholding Calculator is completely free to use. There are no hidden charges or registration required. You can use it as many times as you need.",
    order: 3
  },
  {
    id: '4',
    question: "Can I save my Tax Withholding calculations?",
    answer: "The calculator displays results instantly on screen. You can take a screenshot or note down the results for your records. Some browsers also allow you to print the page.",
    order: 4
  },
  {
    id: '5',
    question: "What information do I need for this calculator?",
    answer: "You'll need basic information related to tax withholding such as amounts, rates, time periods, or other relevant values. The calculator will guide you through each required field.",
    order: 5
  }
];

export default function TaxWithholdingCalculatorClient() {
  const { getH1, getSubHeading } = usePageSEO('tax-withholding-calculator');

  const [annualSalary, setAnnualSalary] = useState<number>(75000);
  const [payFrequency, setPayFrequency] = useState<number>(26);
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single');
  const [currentWithholding, setCurrentWithholding] = useState<number>(350);
  const [allowances, setAllowances] = useState<number>(2);
  const [otherIncome, setOtherIncome] = useState<number>(0);
  const [extraDeductions, setExtraDeductions] = useState<number>(0);
  const [taxCredits, setTaxCredits] = useState<number>(0);
  const [selectedGoal, setSelectedGoal] = useState<number | null>(null);

  // Calculated results
  const [estimatedTax, setEstimatedTax] = useState<number>(0);
  const [currentAnnualWithholding, setCurrentAnnualWithholding] = useState<number>(0);
  const [refundOwed, setRefundOwed] = useState<number>(0);
  const [recommendedPerPay, setRecommendedPerPay] = useState<number>(0);
  const [adjustmentNeeded, setAdjustmentNeeded] = useState<number>(0);
  const [w4Recommendation, setW4Recommendation] = useState<string>('');

  const calculateFederalTax = (taxableIncome: number, status: FilingStatus): number => {
    const brackets = taxBrackets[status];
    let tax = 0;

    for (let i = 0; i < brackets.length; i++) {
      const bracket = brackets[i];
      const taxableAtThisBracket = Math.min(taxableIncome, bracket.max) - Math.max(0, bracket.min);

      if (taxableAtThisBracket > 0) {
        tax += taxableAtThisBracket * bracket.rate;
      }

      if (taxableIncome <= bracket.max) break;
    }

    return tax;
  };

  const updateW4Recommendation = (refund: number) => {
    let recommendation = '';

    if (Math.abs(refund) <= 500) {
      recommendation = '✅ Your withholding is well-calibrated. No W-4 changes needed.';
    } else if (refund > 1000) {
      recommendation = '📉 You\'re overwithholding. Consider increasing allowances or reducing extra withholding on your W-4 to keep more money in your paychecks.';
    } else if (refund < -1000) {
      recommendation = '📈 You\'re under-withholding. Consider decreasing allowances or adding extra withholding on your W-4 to avoid owing taxes.';
    } else {
      recommendation = '⚖️ Minor adjustment recommended. Update your W-4 based on the suggested per-pay amount.';
    }

    setW4Recommendation(recommendation);
  };

  const calculateTaxWithholding = () => {
    if (annualSalary <= 0) {
      setEstimatedTax(0);
      setCurrentAnnualWithholding(0);
      setRefundOwed(0);
      setRecommendedPerPay(0);
      setAdjustmentNeeded(0);
      setW4Recommendation('Enter your income information to see recommendations');
      return;
    }

    // Calculate adjusted gross income
    const totalIncome = annualSalary + otherIncome;
    const standardDeduction = standardDeductions[filingStatus];
    const totalDeductions = standardDeduction + extraDeductions;
    const taxableIncome = Math.max(0, totalIncome - totalDeductions);

    // Calculate federal income tax using brackets
    const federalTax = calculateFederalTax(taxableIncome, filingStatus);
    const taxAfterCredits = Math.max(0, federalTax - taxCredits);

    // Current annual withholding
    const currentAnnual = currentWithholding * payFrequency;

    // Calculate refund or amount owed
    const refund = currentAnnual - taxAfterCredits;

    // Recommended withholding per pay period (to break even)
    const recommendedAnnual = taxAfterCredits;
    const recommendedPer = recommendedAnnual / payFrequency;

    // Adjustment needed
    const adjustment = recommendedPer - currentWithholding;

    setEstimatedTax(taxAfterCredits);
    setCurrentAnnualWithholding(currentAnnual);
    setRefundOwed(refund);
    setRecommendedPerPay(recommendedPer);
    setAdjustmentNeeded(adjustment);
    updateW4Recommendation(refund);
  };

  const setWithholdingGoal = (goalRefund: number) => {
    setSelectedGoal(goalRefund);

    const targetWithholding = estimatedTax + goalRefund;
    const targetPerPay = targetWithholding / payFrequency;

    setRecommendedPerPay(targetPerPay);

    // Update adjustment calculation
    const adjustment = targetPerPay - currentWithholding;
    setAdjustmentNeeded(adjustment);

    // Update refund display
    setRefundOwed(goalRefund);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.abs(amount));
  };

  useEffect(() => {
    calculateTaxWithholding();
  }, [annualSalary, payFrequency, filingStatus, currentWithholding, otherIncome, extraDeductions, taxCredits]);

  const relatedCalculators = [
    { href: '/us/tools/calculators/salary-calculator', title: 'Salary Calculator', description: 'Calculate annual salary and deductions', icon: '💼' },
    { href: '/us/tools/calculators/payroll-calculator', title: 'Payroll Calculator', description: 'Complete payroll calculations', icon: '📊' },
    { href: '/us/tools/calculators/us-federal-income-tax-calculator', title: 'Federal Tax Calculator', description: 'Estimate your federal taxes', icon: '🏛️' },
    { href: '/us/tools/calculators/monthly-income-calculator', title: 'Monthly Income', description: 'Convert to monthly earnings', icon: '📅' },
    { href: '/us/tools/calculators/sales-tax-calculator', title: 'Sales Tax Calculator', description: 'Calculate sales tax', icon: '🧾' },
    { href: '/us/tools/calculators/retirement-calculator', title: 'Retirement Calculator', description: 'Plan for retirement', icon: '🏖️' },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-2 sm:px-4 py-3 sm:py-4 md:py-6">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Tax Withholding Calculator')}</h1>
        <p className="text-base sm:text-lg text-gray-600">Optimize your W-4 to avoid surprises at tax time and maximize your take-home pay</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Calculator */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
        {/* Input Section */}
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Income Information</h2>

          {/* Annual Salary */}
          <div>
            <label htmlFor="annualSalary" className="block text-sm font-medium text-gray-700 mb-2">Annual Salary/Wages</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">$</span>
              <input
                type="number"
                id="annualSalary"
                step="1000"
                placeholder="75000"
                value={annualSalary}
                onChange={(e) => setAnnualSalary(parseFloat(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Pay Frequency */}
          <div>
            <label htmlFor="payFrequency" className="block text-sm font-medium text-gray-700 mb-2">Pay Frequency</label>
            <select
              id="payFrequency"
              value={payFrequency}
              onChange={(e) => setPayFrequency(parseInt(e.target.value))}
              className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="52">Weekly (52 per year)</option>
              <option value="26">Bi-Weekly (26 per year)</option>
              <option value="24">Semi-Monthly (24 per year)</option>
              <option value="12">Monthly (12 per year)</option>
            </select>
          </div>

          {/* Filing Status */}
          <div>
            <label htmlFor="filingStatus" className="block text-sm font-medium text-gray-700 mb-2">Filing Status</label>
            <select
              id="filingStatus"
              value={filingStatus}
              onChange={(e) => setFilingStatus(e.target.value as FilingStatus)}
              className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="single">Single</option>
              <option value="marriedJoint">Married Filing Jointly</option>
              <option value="marriedSeparate">Married Filing Separately</option>
              <option value="headOfHousehold">Head of Household</option>
            </select>
          </div>

          {/* Current Withholdings */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-3">Current Withholding</h4>
            <div className="space-y-3">
              <div>
                <label htmlFor="currentWithholding" className="block text-xs text-blue-700 mb-1">Federal Tax Withheld Per Pay</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    id="currentWithholding"
                    step="10"
                    placeholder="350"
                    value={currentWithholding}
                    onChange={(e) => setCurrentWithholding(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="allowances" className="block text-xs text-blue-700 mb-1">Number of Allowances (W-4)</label>
                <input
                  type="number"
                  id="allowances"
                  min="0"
                  max="15"
                  placeholder="2"
                  value={allowances}
                  onChange={(e) => setAllowances(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Additional Income/Deductions */}
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-3">Additional Factors</h4>
            <div className="space-y-3">
              <div>
                <label htmlFor="otherIncome" className="block text-xs text-green-700 mb-1">Other Annual Income</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    id="otherIncome"
                    step="100"
                    placeholder="0"
                    value={otherIncome}
                    onChange={(e) => setOtherIncome(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="extraDeductions" className="block text-xs text-green-700 mb-1">Annual Deductions (above standard)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    id="extraDeductions"
                    step="100"
                    placeholder="0"
                    value={extraDeductions}
                    onChange={(e) => setExtraDeductions(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="taxCredits" className="block text-xs text-green-700 mb-1">Tax Credits (Child, etc.)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    id="taxCredits"
                    step="100"
                    placeholder="0"
                    value={taxCredits}
                    onChange={(e) => setTaxCredits(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Withholding Analysis</h3>

          <div className="space-y-4">
            {/* Tax Liability */}
            <div className="bg-red-100 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{formatCurrency(estimatedTax)}</div>
              <div className="text-red-700">Estimated Federal Tax</div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Current Annual Withholding:</span>
                <span className="font-semibold text-blue-600">{formatCurrency(currentAnnualWithholding)}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Projected Refund/Owed:</span>
                <span className={`font-semibold ${refundOwed >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatCurrency(Math.abs(refundOwed))} {refundOwed >= 0 ? 'Refund' : 'Owed'}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-600">Recommended Per Pay:</span>
                <span className="font-semibold text-purple-600">{formatCurrency(recommendedPerPay)}</span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Adjustment Needed:</span>
                <span className={`font-semibold ${adjustmentNeeded >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {adjustmentNeeded >= 0 ? '+' : ''}{formatCurrency(adjustmentNeeded)} per pay
                </span>
              </div>
            </div>
          </div>

          {/* Withholding Options */}
          <div className="mt-6 p-4 bg-white rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-3">Withholding Goals</h4>
            <div className="space-y-2">
              <button
                onClick={() => setWithholdingGoal(0)}
                className={`w-full text-left px-3 py-2 rounded border ${
                  selectedGoal === 0
                    ? 'bg-blue-100 border-blue-200'
                    : 'bg-blue-50 hover:bg-blue-100 border-blue-200'
                }`}
              >
                <div className="font-medium">Break Even (No Refund/No Tax Owed)</div>
                <div className="text-xs text-gray-600">Withhold exactly what you owe</div>
              </button>
              <button
                onClick={() => setWithholdingGoal(1000)}
                className={`w-full text-left px-3 py-2 rounded border ${
                  selectedGoal === 1000
                    ? 'bg-green-100 border-green-200'
                    : 'bg-green-50 hover:bg-green-100 border-green-200'
                }`}
              >
                <div className="font-medium">Small Refund ($1,000)</div>
                <div className="text-xs text-gray-600">Withhold slightly more for refund</div>
              </button>
              <button
                onClick={() => setWithholdingGoal(2000)}
                className={`w-full text-left px-3 py-2 rounded border ${
                  selectedGoal === 2000
                    ? 'bg-purple-100 border-purple-200'
                    : 'bg-purple-50 hover:bg-purple-100 border-purple-200'
                }`}
              >
                <div className="font-medium">Larger Refund ($2,000)</div>
                <div className="text-xs text-gray-600">Forced savings through overwithholding</div>
              </button>
            </div>
          </div>
{/* W-4 Guidance */}
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">W-4 Recommendation</h4>
            <div className="text-yellow-700 text-sm">
              {w4Recommendation || 'Based on your inputs, consider updating your W-4'}
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
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Understanding Tax Withholding</h2>

        <div className="prose max-w-none">
          <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
            Tax withholding is the money your employer takes from your paycheck and sends directly to the IRS on your behalf. Getting your withholding right means you won&apos;t owe a large tax bill in April, but you also won&apos;t give the government an interest-free loan all year. This calculator helps you find the perfect balance for your financial situation.
          </p>

          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-3">Why Withholding Matters</h3>
              <ul className="text-blue-700 text-sm space-y-2">
                <li className="flex items-start gap-2"><span className="text-blue-500 mt-1">•</span>Avoid penalties for underpaying taxes</li>
                <li className="flex items-start gap-2"><span className="text-blue-500 mt-1">•</span>Keep more money in your paycheck</li>
                <li className="flex items-start gap-2"><span className="text-blue-500 mt-1">•</span>Reduce April tax bill surprises</li>
                <li className="flex items-start gap-2"><span className="text-blue-500 mt-1">•</span>Better cash flow management</li>
              </ul>
            </div>
            <div className="bg-green-50 p-5 rounded-xl border border-green-100">
              <h3 className="font-semibold text-green-800 mb-3">When to Update Your W-4</h3>
              <ul className="text-green-700 text-sm space-y-2">
                <li className="flex items-start gap-2"><span className="text-green-500 mt-1">•</span>Starting a new job</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-1">•</span>Getting married or divorced</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-1">•</span>Having or adopting a child</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-1">•</span>Significant income changes</li>
              </ul>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">The 2024 W-4 Form Explained</h3>
          <p className="text-gray-600 mb-4 leading-relaxed">
            The current W-4 form, updated in 2020, no longer uses &quot;allowances.&quot; Instead, it asks for more specific information about your tax situation. The form has five steps, but most employees only need to complete Steps 1, 2, and 5.
          </p>

          <div className="bg-amber-50 p-5 rounded-xl border border-amber-200 mb-3 sm:mb-4 md:mb-6">
            <h4 className="font-semibold text-amber-800 mb-3">W-4 Form Steps</h4>
            <div className="text-amber-700 text-sm space-y-2">
              <p><strong>Step 1:</strong> Personal information and filing status</p>
              <p><strong>Step 2:</strong> Multiple jobs or spouse works (if applicable)</p>
              <p><strong>Step 3:</strong> Claim dependents (child tax credit, other dependents)</p>
              <p><strong>Step 4:</strong> Other adjustments (additional income, deductions, extra withholding)</p>
              <p><strong>Step 5:</strong> Sign and date the form</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Big Refund vs. Bigger Paychecks</h3>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Some people prefer getting a large tax refund—it feels like a bonus. However, that refund is actually your own money that you&apos;ve loaned to the government interest-free. By adjusting your withholding correctly, you could have an extra $100-$300 in each paycheck instead. That money could go toward savings, debt payoff, or investments where it can actually grow.
          </p>

          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
            <div className="border-l-4 border-green-500 pl-4 bg-green-50/50 p-4 rounded-r-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Optimal Withholding (Break Even)</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Maximum take-home pay each period</li>
                <li>• No surprise tax bill in April</li>
                <li>• Money works for you all year</li>
                <li>• Requires accurate W-4 setup</li>
              </ul>
            </div>
            <div className="border-l-4 border-blue-500 pl-4 bg-blue-50/50 p-4 rounded-r-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Overwithholding (Refund)</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Forces savings through tax system</li>
                <li>• Peace of mind at tax time</li>
                <li>• Miss out on investment growth</li>
                <li>• Good for those who struggle to save</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>

        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">How do I know if I&apos;m withholding enough federal taxes?</h3>
            <p className="text-gray-600 leading-relaxed">
              Compare your current annual withholding (per-pay amount × number of pay periods) to your estimated tax liability using this calculator. If your withholding is less than 90% of your expected tax bill, or less than 100% of last year&apos;s taxes, you may face underpayment penalties. Aim to withhold at least enough to avoid owing more than $1,000 at tax time.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">What happens if I don&apos;t submit a W-4?</h3>
            <p className="text-gray-600 leading-relaxed">
              If you don&apos;t submit a W-4 to your employer, they must withhold taxes at the &quot;Single&quot; filing status with no adjustments—typically the highest withholding rate. This means smaller paychecks and likely a larger refund. Submit a completed W-4 to ensure your withholding matches your actual tax situation.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Can I claim exempt status on my W-4?</h3>
            <p className="text-gray-600 leading-relaxed">
              You can claim exempt only if you had no tax liability last year AND expect none this year. This is rare and typically only applies to very low-income situations. If you incorrectly claim exempt and owe taxes, you&apos;ll face the full bill plus potential penalties. Exempt status must be renewed each year by February 15.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">How do I adjust withholding if I have multiple jobs?</h3>
            <p className="text-gray-600 leading-relaxed">
              With multiple jobs or if both spouses work, you&apos;re often pushed into higher tax brackets. Use Step 2 of the W-4 form. The IRS Tax Withholding Estimator is helpful, or you can use the Multiple Jobs Worksheet. Generally, claim allowances on only one W-4 (your highest-paying job) and use the &quot;extra withholding&quot; option on others.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">What&apos;s the difference between tax deductions and tax credits?</h3>
            <p className="text-gray-600 leading-relaxed">
              Deductions reduce your taxable income—a $1,000 deduction saves you $220 if you&apos;re in the 22% bracket. Credits directly reduce your tax bill dollar-for-dollar—a $1,000 credit saves you exactly $1,000. Credits are more valuable. Common credits include the Child Tax Credit ($2,000 per child), Earned Income Credit, and education credits.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">How often can I change my W-4?</h3>
            <p className="text-gray-600 leading-relaxed">
              You can update your W-4 as often as you like—there&apos;s no limit. Most employers will implement changes within 1-2 pay periods. It&apos;s smart to review your withholding whenever your life circumstances change significantly: new job, marriage, divorce, new baby, or major income changes. Many people also check mid-year to avoid surprises.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="tax-withholding-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
