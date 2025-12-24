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

interface TaxBracket {
  limit: number;
  rate: number;
}

type FilingStatus = 'single' | 'marriedJointly' | 'marriedSeparately' | 'headOfHousehold';
type TaxYear = '2024' | '2025';

const taxBrackets: Record<TaxYear, Record<FilingStatus, TaxBracket[]>> = {
  '2024': {
    single: [
      { limit: 11600, rate: 0 },
      { limit: 23200, rate: 10 },
      { limit: 94300, rate: 12 },
      { limit: 201050, rate: 22 },
      { limit: 383900, rate: 24 },
      { limit: 487450, rate: 32 },
      { limit: 731200, rate: 35 },
      { limit: Infinity, rate: 37 }
    ],
    marriedJointly: [
      { limit: 23200, rate: 0 },
      { limit: 46400, rate: 10 },
      { limit: 188600, rate: 12 },
      { limit: 402100, rate: 22 },
      { limit: 767800, rate: 24 },
      { limit: 974900, rate: 32 },
      { limit: 1462400, rate: 35 },
      { limit: Infinity, rate: 37 }
    ],
    marriedSeparately: [
      { limit: 11600, rate: 0 },
      { limit: 23200, rate: 10 },
      { limit: 94300, rate: 12 },
      { limit: 201050, rate: 22 },
      { limit: 383900, rate: 24 },
      { limit: 487450, rate: 32 },
      { limit: 731200, rate: 35 },
      { limit: Infinity, rate: 37 }
    ],
    headOfHousehold: [
      { limit: 16550, rate: 0 },
      { limit: 33100, rate: 10 },
      { limit: 126650, rate: 12 },
      { limit: 201050, rate: 22 },
      { limit: 383900, rate: 24 },
      { limit: 487450, rate: 32 },
      { limit: 731200, rate: 35 },
      { limit: Infinity, rate: 37 }
    ]
  },
  '2025': {
    single: [
      { limit: 11600, rate: 0 },
      { limit: 23200, rate: 10 },
      { limit: 94300, rate: 12 },
      { limit: 201050, rate: 22 },
      { limit: 383900, rate: 24 },
      { limit: 487450, rate: 32 },
      { limit: 731200, rate: 35 },
      { limit: Infinity, rate: 37 }
    ],
    marriedJointly: [
      { limit: 23200, rate: 0 },
      { limit: 46400, rate: 10 },
      { limit: 188600, rate: 12 },
      { limit: 402100, rate: 22 },
      { limit: 767800, rate: 24 },
      { limit: 974900, rate: 32 },
      { limit: 1462400, rate: 35 },
      { limit: Infinity, rate: 37 }
    ],
    marriedSeparately: [
      { limit: 11600, rate: 0 },
      { limit: 23200, rate: 10 },
      { limit: 94300, rate: 12 },
      { limit: 201050, rate: 22 },
      { limit: 383900, rate: 24 },
      { limit: 487450, rate: 32 },
      { limit: 731200, rate: 35 },
      { limit: Infinity, rate: 37 }
    ],
    headOfHousehold: [
      { limit: 16550, rate: 0 },
      { limit: 33100, rate: 10 },
      { limit: 126650, rate: 12 },
      { limit: 201050, rate: 22 },
      { limit: 383900, rate: 24 },
      { limit: 487450, rate: 32 },
      { limit: 731200, rate: 35 },
      { limit: Infinity, rate: 37 }
    ]
  }
};

const standardDeductions: Record<TaxYear, Record<FilingStatus, number>> = {
  '2024': {
    single: 14600,
    marriedJointly: 29200,
    marriedSeparately: 14600,
    headOfHousehold: 21900
  },
  '2025': {
    single: 14600,
    marriedJointly: 29200,
    marriedSeparately: 14600,
    headOfHousehold: 21900
  }
};

const fallbackFaqs = [
  {
    id: '1',
    question: "What is the difference between marginal and effective tax rate?",
    answer: "Your marginal tax rate is the rate you pay on your last dollar of income - it's the highest bracket your income falls into. Your effective tax rate is your total tax divided by total income, representing the average rate you actually pay. For example, if you're in the 22% bracket with $50,000 taxable income, your marginal rate is 22%, but your effective rate might be around 12-15% because lower portions of income are taxed at lower rates (10% and 12%).",
    order: 1
  },
  {
    id: '2',
    question: "Should I take the standard deduction or itemize?",
    answer: "Take whichever is larger. For 2024, standard deductions are: Single $14,600, Married Filing Jointly $29,200, Head of Household $21,900. Itemize if your combined deductible expenses (state/local taxes up to $10,000, mortgage interest, charitable donations, medical expenses over 7.5% of AGI) exceed these amounts. Most taxpayers benefit from the standard deduction since the Tax Cuts and Jobs Act nearly doubled it.",
    order: 2
  },
  {
    id: '3',
    question: "What are the best ways to reduce my tax liability?",
    answer: "Key strategies include: 1) Maximize pre-tax retirement contributions (401k up to $23,000 in 2024, plus $7,500 catch-up if 50+). 2) Contribute to HSA if eligible ($4,150 individual, $8,300 family). 3) Claim all eligible tax credits (more valuable than deductions as they reduce tax dollar-for-dollar). 4) Time income and deductions strategically. 5) Harvest investment losses to offset gains. 6) Consider Roth conversions in low-income years.",
    order: 3
  },
  {
    id: '4',
    question: "What tax credits am I likely eligible for?",
    answer: "Common credits include: Child Tax Credit ($2,000 per qualifying child under 17), Child and Dependent Care Credit (up to $3,000 for one dependent), Earned Income Tax Credit (for lower incomes), American Opportunity Credit ($2,500 for college expenses), Lifetime Learning Credit ($2,000 for education), and Retirement Savings Contribution Credit (up to $1,000). Credits directly reduce your tax bill, making them more valuable than deductions.",
    order: 4
  },
  {
    id: '5',
    question: "How do federal tax brackets work?",
    answer: "The US uses a progressive tax system where income is taxed in layers. For 2024 single filers: First $11,600 is taxed at 10%, $11,601-$47,150 at 12%, $47,151-$100,525 at 22%, and so on up to 37% for income over $609,350. Each dollar is only taxed at the rate for its bracket - moving into a higher bracket doesn't retroactively increase tax on lower income. This is why your effective rate is always lower than your marginal rate.",
    order: 5
  }
];

export default function USFederalTaxClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('us-federal-income-tax-calculator');

  const [taxYear, setTaxYear] = useState<TaxYear>('2025');
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single');
  const [salary, setSalary] = useState(80000);
  const [otherIncome, setOtherIncome] = useState(5000);
  const [capitalGains, setCapitalGains] = useState(0);
  const [businessIncome, setBusinessIncome] = useState(0);
  const [rentalIncome, setRentalIncome] = useState(0);
  const [retirementContributions, setRetirementContributions] = useState(6000);
  const [hsaContributions, setHsaContributions] = useState(3000);
  const [studentLoanInterest, setStudentLoanInterest] = useState(0);
  const [federalWithheld, setFederalWithheld] = useState(0);
  const [dependents, setDependents] = useState(0);
  const [childTaxCredit, setChildTaxCredit] = useState(0);
  const [educationCredits, setEducationCredits] = useState(0);
  const [otherCredits, setOtherCredits] = useState(0);
  const [deductionType, setDeductionType] = useState<'standard' | 'itemized'>('standard');
  const [itemizedDeductions, setItemizedDeductions] = useState(0);

  const [grossIncome, setGrossIncome] = useState(0);
  const [adjustedGrossIncome, setAdjustedGrossIncome] = useState(0);
  const [taxableIncome, setTaxableIncome] = useState(0);
  const [taxBeforeCredits, setTaxBeforeCredits] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  const [taxesOwed, setTaxesOwed] = useState(0);
  const [effectiveTaxRate, setEffectiveTaxRate] = useState(0);
  const [marginalTaxRate, setMarginalTaxRate] = useState(0);
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);

  useEffect(() => {
    calculateTax();
  }, [taxYear, filingStatus, salary, otherIncome, capitalGains, businessIncome, rentalIncome,
      retirementContributions, hsaContributions, studentLoanInterest, federalWithheld,
      dependents, childTaxCredit, educationCredits, otherCredits, deductionType, itemizedDeductions]);

  const calculateTax = () => {
    // Calculate gross income
    const gross = salary + otherIncome + capitalGains + businessIncome + rentalIncome;
    setGrossIncome(gross);

    // Calculate AGI (gross - pre-tax deductions)
    const preTaxDeductions = retirementContributions + hsaContributions + studentLoanInterest;
    const agi = gross - preTaxDeductions;
    setAdjustedGrossIncome(agi);

    // Get standard deduction for filing status
    const standardDeduction = standardDeductions[taxYear][filingStatus];
    const deduction = deductionType === 'standard' ? standardDeduction : itemizedDeductions;

    // Calculate taxable income
    const taxable = Math.max(0, agi - deduction);
    setTaxableIncome(taxable);

    // Calculate tax using progressive brackets
    const brackets = taxBrackets[taxYear][filingStatus];
    let tax = 0;
    let previousLimit = 0;
    let marginal = 0;

    for (const bracket of brackets) {
      if (taxable > previousLimit) {
        const taxableInBracket = Math.min(taxable - previousLimit, bracket.limit - previousLimit);
        tax += taxableInBracket * (bracket.rate / 100);

        if (taxable > previousLimit && taxable <= bracket.limit) {
          marginal = bracket.rate;
        }
      }
      previousLimit = bracket.limit;
    }

    setTaxBeforeCredits(tax);
    setMarginalTaxRate(marginal);

    // Calculate total tax credits
    const credits = childTaxCredit + educationCredits + otherCredits;
    setTotalCredits(credits);

    // Calculate final tax owed (can be negative for refund)
    const owed = tax - credits - federalWithheld;
    setTaxesOwed(owed);

    // Calculate effective tax rate
    const effective = gross > 0 ? (tax / gross) * 100 : 0;
    setEffectiveTaxRate(effective);
  };

  const formatCurrency = (amount: number): string => {
    const abs = Math.abs(amount);
    return `${amount < 0 ? '-' : ''}$${Math.round(abs).toLocaleString()}`;
  };

  const formatPercent = (rate: number): string => {
    return `${rate.toFixed(1)}%`;
  };

  return (
    <div className="max-w-[1200px] mx-auto px-3 xs:px-2 sm:px-4 py-4 sm:py-6 md:py-8">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3">{getH1('US Federal Income Tax Calculator')}</h1>
        <p className="text-sm sm:text-base text-gray-600">Calculate your federal tax liability with detailed breakdowns</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="bg-white rounded-xl shadow-lg p-3 xs:p-4 sm:p-6 md:p-8 mb-4 sm:mb-4 md:mb-6">
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Input Section */}
          <div className="space-y-4 sm:space-y-4 md:space-y-6">
            {/* Tax Year & Filing Status */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tax Year</label>
                <select
                  value={taxYear}
                  onChange={(e) => setTaxYear(e.target.value as TaxYear)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filing Status</label>
                <select
                  value={filingStatus}
                  onChange={(e) => setFilingStatus(e.target.value as FilingStatus)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="single">Single</option>
                  <option value="marriedJointly">Married Filing Jointly</option>
                  <option value="marriedSeparately">Married Filing Separately</option>
                  <option value="headOfHousehold">Head of Household</option>
                </select>
              </div>
            </div>

            {/* Income Section */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="text-sm font-semibold text-blue-800 mb-3">Income</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">W-2 Salary</label>
                  <input
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="$0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Other Income</label>
                  <input
                    type="number"
                    value={otherIncome}
                    onChange={(e) => setOtherIncome(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="$0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Capital Gains</label>
                  <input
                    type="number"
                    value={capitalGains}
                    onChange={(e) => setCapitalGains(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="$0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Business Income</label>
                  <input
                    type="number"
                    value={businessIncome}
                    onChange={(e) => setBusinessIncome(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="$0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Rental Income</label>
                  <input
                    type="number"
                    value={rentalIncome}
                    onChange={(e) => setRentalIncome(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="$0"
                  />
                </div>
              </div>
            </div>

            {/* Deductions Section */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h3 className="text-sm font-semibold text-green-800 mb-3">Pre-Tax Deductions</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">401(k) / IRA</label>
                  <input
                    type="number"
                    value={retirementContributions}
                    onChange={(e) => setRetirementContributions(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="$0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">HSA Contributions</label>
                  <input
                    type="number"
                    value={hsaContributions}
                    onChange={(e) => setHsaContributions(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="$0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Student Loan Interest</label>
                  <input
                    type="number"
                    value={studentLoanInterest}
                    onChange={(e) => setStudentLoanInterest(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="$0"
                  />
                </div>
              </div>
            </div>

            {/* Deduction Type */}
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <h3 className="text-sm font-semibold text-purple-800 mb-3">Deduction Type</h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <button
                  onClick={() => setDeductionType('standard')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    deductionType === 'standard'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-purple-700 border border-purple-300'
                  }`}
                >
                  Standard ({formatCurrency(standardDeductions[taxYear][filingStatus])})
                </button>
                <button
                  onClick={() => setDeductionType('itemized')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    deductionType === 'itemized'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-purple-700 border border-purple-300'
                  }`}
                >
                  Itemized
                </button>
              </div>
              {deductionType === 'itemized' && (
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Itemized Deductions Total</label>
                  <input
                    type="number"
                    value={itemizedDeductions}
                    onChange={(e) => setItemizedDeductions(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="$0"
                  />
                </div>
              )}
            </div>

            {/* Tax Credits */}
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <h3 className="text-sm font-semibold text-orange-800 mb-3">Tax Credits & Withholdings</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Child Tax Credit</label>
                  <input
                    type="number"
                    value={childTaxCredit}
                    onChange={(e) => setChildTaxCredit(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="$0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Education Credits</label>
                  <input
                    type="number"
                    value={educationCredits}
                    onChange={(e) => setEducationCredits(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="$0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Other Credits</label>
                  <input
                    type="number"
                    value={otherCredits}
                    onChange={(e) => setOtherCredits(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="$0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Federal Withheld</label>
                  <input
                    type="number"
                    value={federalWithheld}
                    onChange={(e) => setFederalWithheld(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="$0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-3 sm:p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tax Summary</h3>

            {/* Main Result */}
            <div className={`rounded-lg p-4 mb-4 text-center ${taxesOwed >= 0 ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
              <span className="text-sm text-gray-600 block mb-1">
                {taxesOwed >= 0 ? 'Estimated Tax Owed' : 'Estimated Refund'}
              </span>
              <span className={`text-3xl font-bold ${taxesOwed >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                {formatCurrency(Math.abs(taxesOwed))}
              </span>
            </div>

            {/* Tax Rates */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white rounded-lg p-3 text-center">
                <span className="text-xs text-gray-600 block">Marginal Rate</span>
                <span className="text-xl font-bold text-blue-600">{formatPercent(marginalTaxRate)}</span>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <span className="text-xs text-gray-600 block">Effective Rate</span>
                <span className="text-xl font-bold text-green-600">{formatPercent(effectiveTaxRate)}</span>
              </div>
            </div>

            {/* Income Breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between items-center bg-white rounded-lg p-3">
                <span className="text-sm text-gray-600">Gross Income</span>
                <span className="font-bold text-gray-800">{formatCurrency(grossIncome)}</span>
              </div>
              <div className="flex justify-between items-center bg-white rounded-lg p-3">
                <span className="text-sm text-gray-600">Adjusted Gross Income</span>
                <span className="font-bold text-gray-800">{formatCurrency(adjustedGrossIncome)}</span>
              </div>
              <div className="flex justify-between items-center bg-white rounded-lg p-3">
                <span className="text-sm text-gray-600">Taxable Income</span>
                <span className="font-bold text-gray-800">{formatCurrency(taxableIncome)}</span>
              </div>
              <div className="flex justify-between items-center bg-white rounded-lg p-3">
                <span className="text-sm text-gray-600">Tax Before Credits</span>
                <span className="font-bold text-gray-800">{formatCurrency(taxBeforeCredits)}</span>
              </div>
              <div className="flex justify-between items-center bg-white rounded-lg p-3">
                <span className="text-sm text-gray-600">Total Credits</span>
                <span className="font-bold text-green-600">-{formatCurrency(totalCredits)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SVG Charts Section */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-4 md:mb-6">Tax Breakdown Visualizations</h2>

        {/* Chart 1: Income Allocation Pie Chart */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Income Allocation</h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 sm:gap-5 md:gap-8">
            <svg viewBox="0 0 200 200" className="w-64 h-64">
              <defs>
                <linearGradient id="taxGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
                <linearGradient id="takeHomeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
              {(() => {
                const totalTax = Math.max(0, taxBeforeCredits - totalCredits);
                const takeHome = Math.max(0, grossIncome - totalTax);
                const total = grossIncome || 1;
                const taxPercent = (totalTax / total) * 100;
                const takeHomePercent = (takeHome / total) * 100;
                const taxAngle = (taxPercent / 100) * 360;
                const takeHomeAngle = (takeHomePercent / 100) * 360;

                const createPieSlice = (startAngle: number, endAngle: number, color: string, idx: number) => {
                  const start = (startAngle - 90) * Math.PI / 180;
                  const end = (endAngle - 90) * Math.PI / 180;
                  const x1 = 100 + 80 * Math.cos(start);
                  const y1 = 100 + 80 * Math.sin(start);
                  const x2 = 100 + 80 * Math.cos(end);
                  const y2 = 100 + 80 * Math.sin(end);
                  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

                  return (
                    <path
                      key={idx}
                      d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      fill={color}
                      stroke="white"
                      strokeWidth="2"
                      className="transition-all duration-200 cursor-pointer"
                      style={{
                        opacity: hoveredSegment === idx || hoveredSegment === null ? 1 : 0.5,
                        transform: hoveredSegment === idx ? 'scale(1.05)' : 'scale(1)',
                        transformOrigin: 'center'
                      }}
                      onMouseEnter={() => setHoveredSegment(idx)}
                      onMouseLeave={() => setHoveredSegment(null)}
                    />
                  );
                };

                return (
                  <>
                    {createPieSlice(0, taxAngle, 'url(#taxGradient)', 0)}
                    {createPieSlice(taxAngle, 360, 'url(#takeHomeGradient)', 1)}
                  </>
                );
              })()}
            </svg>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-red-500 to-red-600"></div>
                <div>
                  <p className="text-sm text-gray-600">Total Tax</p>
                  <p className="text-lg font-bold text-red-600">{formatCurrency(Math.max(0, taxBeforeCredits - totalCredits))}</p>
                  <p className="text-xs text-gray-500">{((Math.max(0, taxBeforeCredits - totalCredits) / (grossIncome || 1)) * 100).toFixed(1)}%</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-green-500 to-green-600"></div>
                <div>
                  <p className="text-sm text-gray-600">Take-Home Pay</p>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(Math.max(0, grossIncome - Math.max(0, taxBeforeCredits - totalCredits)))}</p>
                  <p className="text-xs text-gray-500">{((Math.max(0, grossIncome - Math.max(0, taxBeforeCredits - totalCredits)) / (grossIncome || 1)) * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 2: Tax Breakdown by Type */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Tax Breakdown by Type</h3>
          <div className="overflow-x-auto">
            <svg viewBox="0 0 800 300" className="w-full h-auto">
              <defs>
                <linearGradient id="federalBar" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
                <linearGradient id="ficaBar" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
                <linearGradient id="stateBar" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="60" y1="240" x2="740" y2="240" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="60" y1="180" x2="740" y2="180" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="60" y1="120" x2="740" y2="120" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="60" y1="60" x2="740" y2="60" stroke="#e5e7eb" strokeWidth="1" />

              {/* Axis */}
              <line x1="60" y1="20" x2="60" y2="240" stroke="#374151" strokeWidth="2" />
              <line x1="60" y1="240" x2="740" y2="240" stroke="#374151" strokeWidth="2" />

              {(() => {
                const federalTax = taxBeforeCredits;
                const ficaTax = (grossIncome * 0.0765);
                const stateTax = 0; // Simplified, not included in this calculator
                const maxValue = Math.max(federalTax, ficaTax, 10000);
                const scale = 200 / maxValue;

                const bars = [
                  { label: 'Federal Tax', value: federalTax, color: 'url(#federalBar)', x: 150 },
                  { label: 'FICA', value: ficaTax, color: 'url(#ficaBar)', x: 400 },
                ];

                return bars.map((bar, idx) => {
                  const height = bar.value * scale;
                  const y = 240 - height;
                  return (
                    <g key={idx}>
                      <rect
                        x={bar.x}
                        y={y}
                        width="100"
                        height={height}
                        fill={bar.color}
                        rx="4"
                        className="transition-all duration-200"
                      />
                      <text x={bar.x + 50} y={y - 10} textAnchor="middle" className="text-sm font-semibold fill-gray-700">
                        {formatCurrency(bar.value)}
                      </text>
                      <text x={bar.x + 50} y={260} textAnchor="middle" className="text-sm fill-gray-600">
                        {bar.label}
                      </text>
                    </g>
                  );
                });
              })()}

              {/* Y-axis labels */}
              <text x="55" y="245" textAnchor="end" className="text-xs fill-gray-600">$0</text>
              <text x="55" y="125" textAnchor="end" className="text-xs fill-gray-600">
                {formatCurrency(Math.max(taxBeforeCredits, grossIncome * 0.0765) / 2)}
              </text>
              <text x="55" y="25" textAnchor="end" className="text-xs fill-gray-600">
                {formatCurrency(Math.max(taxBeforeCredits, grossIncome * 0.0765))}
              </text>
            </svg>
          </div>
        </div>

        {/* Chart 3: Effective vs Marginal Tax Rate */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Effective vs Marginal Tax Rate</h3>
          <div className="overflow-x-auto">
            <svg viewBox="0 0 800 300" className="w-full h-auto">
              <defs>
                <linearGradient id="effectiveBar" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="marginalBar" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="150" y1="80" x2="750" y2="80" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="150" y1="150" x2="750" y2="150" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="150" y1="220" x2="750" y2="220" stroke="#e5e7eb" strokeWidth="1" />

              {/* Bars */}
              <rect x="150" y="60" width={effectiveTaxRate * 12} height="40" fill="url(#effectiveBar)" rx="4" />
              <text x={150 + effectiveTaxRate * 12 + 10} y="85" className="text-sm font-semibold fill-green-700">
                {formatPercent(effectiveTaxRate)}
              </text>
              <text x="30" y="85" className="text-sm fill-gray-700">Effective Rate</text>

              <rect x="150" y="130" width={marginalTaxRate * 12} height="40" fill="url(#marginalBar)" rx="4" />
              <text x={150 + marginalTaxRate * 12 + 10} y="155" className="text-sm font-semibold fill-orange-700">
                {marginalTaxRate}%
              </text>
              <text x="30" y="155" className="text-sm fill-gray-700">Marginal Rate</text>

              {/* Reference line at 100% */}
              <line x1="750" y1="60" x2="750" y2="170" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4" />
              <text x="760" y="120" className="text-xs fill-gray-500">100%</text>
            </svg>
          </div>
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Effective Rate:</strong> Average tax rate on all income ({formatPercent(effectiveTaxRate)})<br />
              <strong>Marginal Rate:</strong> Tax rate on your last dollar earned ({marginalTaxRate}%)
            </p>
          </div>
        </div>
      </div>

      {/* MREC Banners */}
      <CalculatorAfterCalcBanners />

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQs Section */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="us-federal-income-tax-calculator" fallbackFaqs={fallbackFaqs} />
      </div>

      <div className="mt-6 sm:mt-8">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-4 md:mb-6">Related Finance Calculators</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          {relatedCalculators.map((calc, index) => (
            <Link key={index} href={calc.href} className="block sm:p-4 md:p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base">{calc.title}</h3>
              <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{calc.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
