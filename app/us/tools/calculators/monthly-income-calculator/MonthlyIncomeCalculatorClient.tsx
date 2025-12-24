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
  color?: string;
  icon?: string;
}

interface MonthlyIncomeCalculatorClientProps {
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
    question: "What is a Monthly Income Calculator?",
    answer: "A Monthly Income Calculator is a free online tool that helps you calculate and analyze monthly income-related financial metrics quickly and accurately. It provides instant results to help you make informed financial decisions.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is this Monthly Income Calculator?",
    answer: "Our Monthly Income Calculator uses standard financial formulas and provides highly accurate results. However, actual results may vary based on specific terms, conditions, and market factors. Always consult with a financial advisor for major decisions.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Monthly Income Calculator free to use?",
    answer: "Yes, this Monthly Income Calculator is completely free to use. There are no hidden charges or registration required. You can use it as many times as you need.",
    order: 3
  },
  {
    id: '4',
    question: "Can I save my Monthly Income calculations?",
    answer: "The calculator displays results instantly on screen. You can take a screenshot or note down the results for your records. Some browsers also allow you to print the page.",
    order: 4
  },
  {
    id: '5',
    question: "What information do I need for this calculator?",
    answer: "You'll need basic information related to monthly income such as amounts, rates, time periods, or other relevant values. The calculator will guide you through each required field.",
    order: 5
  }
];

export default function MonthlyIncomeCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: MonthlyIncomeCalculatorClientProps) {
  const { getH1, getSubHeading } = usePageSEO('monthly-income-calculator');

  const [incomeType, setIncomeType] = useState<'hourly' | 'weekly' | 'biweekly' | 'annual'>('annual');
  const [amount, setAmount] = useState(50000);
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [includeTaxes, setIncludeTaxes] = useState(true);
  const [federalTaxRate, setFederalTaxRate] = useState(22);
  const [stateTaxRate, setStateTaxRate] = useState(5);
  const [ficaTaxRate] = useState(7.65);

  const results = useMemo(() => {
    let annualIncome = 0;

    switch (incomeType) {
      case 'hourly':
        annualIncome = amount * hoursPerWeek * 52;
        break;
      case 'weekly':
        annualIncome = amount * 52;
        break;
      case 'biweekly':
        annualIncome = amount * 26;
        break;
      case 'annual':
        annualIncome = amount;
        break;
    }

    const monthlyGross = annualIncome / 12;
    const weeklyGross = annualIncome / 52;
    const biweeklyGross = annualIncome / 26;
    const dailyGross = annualIncome / 260; // 52 weeks * 5 days

    const federalTax = includeTaxes ? (annualIncome * federalTaxRate) / 100 : 0;
    const stateTax = includeTaxes ? (annualIncome * stateTaxRate) / 100 : 0;
    const ficaTax = includeTaxes ? (annualIncome * ficaTaxRate) / 100 : 0;
    const totalTax = federalTax + stateTax + ficaTax;

    const annualNet = annualIncome - totalTax;
    const monthlyNet = annualNet / 12;

    const effectiveTaxRate = annualIncome > 0 ? (totalTax / annualIncome) * 100 : 0;

    return {
      annualGross: annualIncome,
      monthlyGross,
      weeklyGross,
      biweeklyGross,
      dailyGross,
      federalTax: federalTax / 12,
      stateTax: stateTax / 12,
      ficaTax: ficaTax / 12,
      totalMonthlyTax: totalTax / 12,
      monthlyNet,
      annualNet,
      effectiveTaxRate
    };
  }, [amount, incomeType, hoursPerWeek, includeTaxes, federalTaxRate, stateTaxRate, ficaTaxRate]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatCurrencyDetailed = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const presets = [
    { label: 'Entry Level', amount: 35000, type: 'annual' as const },
    { label: 'Median US', amount: 59000, type: 'annual' as const },
    { label: 'Professional', amount: 85000, type: 'annual' as const },
    { label: '$15/hr', amount: 15, type: 'hourly' as const },
    { label: '$25/hr', amount: 25, type: 'hourly' as const },
    { label: '$50/hr', amount: 50, type: 'hourly' as const },
  ];

  const allRelatedCalculators = [
    { href: '/us/tools/calculators/salary-calculator', title: 'Salary Calculator', description: 'Calculate annual salary', icon: '💼' },
    { href: '/us/tools/calculators/hourly-to-annual-salary-calculator', title: 'Hourly to Annual', description: 'Convert hourly to yearly', icon: '⏰' },
    { href: '/us/tools/calculators/salary-to-hourly-calculator', title: 'Salary to Hourly', description: 'Convert salary to hourly rate', icon: '💵' },
    { href: '/us/tools/calculators/payroll-calculator', title: 'Payroll Calculator', description: 'Calculate payroll taxes', icon: '📊' },
    { href: '/us/tools/calculators/tax-withholding-calculator', title: 'Tax Withholding', description: 'Estimate tax deductions', icon: '🏛️' },
    { href: '/us/tools/calculators/overtime-calculator', title: 'Overtime Calculator', description: 'Calculate overtime pay', icon: '⏱️' },
  ];

  return (
    <div className="max-w-[1180px] mx-auto px-2 sm:px-4 py-3 sm:py-4 md:py-6">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Monthly Income Calculator')}</h1>
        <p className="text-base sm:text-lg text-gray-600">Convert any income type to monthly earnings and see your take-home pay after taxes</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Calculator */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {/* Quick Presets */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Scenarios</h3>
              <div className="grid grid-cols-3 gap-2">
                {presets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setAmount(preset.amount);
                      setIncomeType(preset.type);
                    }}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Income Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Income Type</label>
              <select
                value={incomeType}
                onChange={(e) => setIncomeType(e.target.value as any)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="hourly">Hourly Wage</option>
                <option value="weekly">Weekly Salary</option>
                <option value="biweekly">Bi-Weekly Salary</option>
                <option value="annual">Annual Salary</option>
              </select>
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {incomeType === 'hourly' ? 'Hourly Rate' :
                 incomeType === 'weekly' ? 'Weekly Amount' :
                 incomeType === 'biweekly' ? 'Bi-Weekly Amount' : 'Annual Salary'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step={incomeType === 'hourly' ? '0.25' : '100'}
                />
              </div>
            </div>

            {/* Hours per Week (for hourly) */}
            {incomeType === 'hourly' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hours Per Week</label>
                <input
                  type="number"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(parseInt(e.target.value) || 40)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  max="168"
                />
              </div>
            )}

            {/* Tax Settings */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-gray-700">Include Tax Deductions</label>
                <button
                  onClick={() => setIncludeTaxes(!includeTaxes)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${includeTaxes ? 'bg-blue-600' : 'bg-gray-200'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${includeTaxes ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {includeTaxes && (
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                      <span>Federal Tax Rate</span>
                      <span className="text-blue-600">{federalTaxRate}%</span>
                    </label>
                    <input
                      type="range"
                      value={federalTaxRate}
                      onChange={(e) => setFederalTaxRate(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      min="0"
                      max="37"
                    />
                  </div>
                  <div>
                    <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                      <span>State Tax Rate</span>
                      <span className="text-blue-600">{stateTaxRate}%</span>
                    </label>
                    <input
                      type="range"
                      value={stateTaxRate}
                      onChange={(e) => setStateTaxRate(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      min="0"
                      max="13"
                    />
                  </div>
                  <p className="text-xs text-gray-500">FICA (Social Security + Medicare): {ficaTaxRate}% (fixed)</p>
                </div>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {/* Main Result */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-3 sm:p-4 md:p-6">
              <div className="text-center">
                <div className="text-sm font-medium text-green-100 mb-2">Your Monthly {includeTaxes ? 'Take-Home' : 'Gross'} Income</div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                  {formatCurrency(includeTaxes ? results.monthlyNet : results.monthlyGross)}
                </div>
                <div className="text-green-100 text-sm">
                  {formatCurrencyDetailed(includeTaxes ? results.monthlyNet : results.monthlyGross)} per month
                </div>
              </div>
            </div>

            {/* Income Breakdown */}
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-semibold text-gray-800 mb-4">Income Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Annual Gross Income:</span>
                  <span className="font-semibold text-gray-800">{formatCurrency(results.annualGross)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Monthly Gross Income:</span>
                  <span className="font-semibold text-gray-800">{formatCurrency(results.monthlyGross)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Bi-Weekly Pay:</span>
                  <span className="font-semibold text-gray-800">{formatCurrency(results.biweeklyGross)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Weekly Pay:</span>
                  <span className="font-semibold text-gray-800">{formatCurrency(results.weeklyGross)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Daily Pay:</span>
                  <span className="font-semibold text-gray-800">{formatCurrency(results.dailyGross)}</span>
                </div>
              </div>
            </div>

            {/* Tax Deductions */}
            {includeTaxes && (
              <div className="bg-red-50 rounded-xl p-5 border border-red-100">
                <h3 className="font-semibold text-red-800 mb-4">Monthly Tax Deductions</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-red-700">Federal Income Tax ({federalTaxRate}%):</span>
                    <span className="font-semibold text-red-800">-{formatCurrency(results.federalTax)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-red-700">State Income Tax ({stateTaxRate}%):</span>
                    <span className="font-semibold text-red-800">-{formatCurrency(results.stateTax)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-red-700">FICA Taxes ({ficaTaxRate}%):</span>
                    <span className="font-semibold text-red-800">-{formatCurrency(results.ficaTax)}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-red-200">
                    <span className="font-medium text-red-800">Total Monthly Deductions:</span>
                    <span className="font-bold text-red-800">-{formatCurrency(results.totalMonthlyTax)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-100">
                <div className="text-sm text-blue-700 mb-1">Effective Tax Rate</div>
                <div className="text-2xl font-bold text-blue-800">{results.effectiveTaxRate.toFixed(1)}%</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100">
                <div className="text-sm text-green-700 mb-1">Annual Take-Home</div>
                <div className="text-2xl font-bold text-green-800">{formatCurrency(results.annualNet)}</div>
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
          {allRelatedCalculators.map((calc) => (
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
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Understanding Your Monthly Income</h2>

        <div className="prose max-w-none">
          <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
            Knowing your monthly income is essential for budgeting, loan applications, and financial planning. Whether you earn an hourly wage, receive a bi-weekly paycheck, or have an annual salary, this calculator converts your earnings to a consistent monthly figure and shows you exactly how much you&apos;ll take home after taxes.
          </p>

          <div className="grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-3">Hourly to Monthly</h3>
              <p className="text-blue-700 text-sm mb-2">Formula: Hourly Rate x Hours/Week x 52 / 12</p>
              <p className="text-blue-600 text-xs">Example: $25/hr x 40 hrs x 52 / 12 = $4,333/month</p>
            </div>
            <div className="bg-green-50 p-5 rounded-xl border border-green-100">
              <h3 className="font-semibold text-green-800 mb-3">Annual to Monthly</h3>
              <p className="text-green-700 text-sm mb-2">Formula: Annual Salary / 12 months</p>
              <p className="text-green-600 text-xs">Example: $60,000 / 12 = $5,000/month gross</p>
            </div>
            <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
              <h3 className="font-semibold text-purple-800 mb-3">Bi-Weekly to Monthly</h3>
              <p className="text-purple-700 text-sm mb-2">Formula: Bi-Weekly Pay x 26 / 12</p>
              <p className="text-purple-600 text-xs">Example: $2,000 x 26 / 12 = $4,333/month</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Understanding Paycheck Deductions</h3>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Your gross monthly income differs from your take-home pay due to various tax withholdings. Federal income tax, state income tax, and FICA taxes (Social Security and Medicare) are automatically deducted from each paycheck before you receive it.
          </p>

          <div className="bg-amber-50 p-5 rounded-xl border border-amber-200 mb-3 sm:mb-4 md:mb-6">
            <h4 className="font-semibold text-amber-800 mb-2">Common Paycheck Deductions</h4>
            <ul className="text-amber-700 text-sm space-y-1">
              <li>• <strong>Federal Income Tax:</strong> 10% to 37% based on income bracket</li>
              <li>• <strong>State Income Tax:</strong> 0% to 13%+ depending on your state</li>
              <li>• <strong>Social Security:</strong> 6.2% on earnings up to $168,600 (2024)</li>
              <li>• <strong>Medicare:</strong> 1.45% on all earnings (additional 0.9% for high earners)</li>
              <li>• <strong>401(k) Contributions:</strong> Optional pre-tax retirement savings</li>
              <li>• <strong>Health Insurance Premiums:</strong> If employer-sponsored</li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Why Monthly Income Matters</h3>
          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">For Personal Finance</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Create an accurate monthly budget</li>
                <li>• Determine affordable housing costs (28% rule)</li>
                <li>• Plan savings and investment contributions</li>
                <li>• Track income growth over time</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">For Loan Applications</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Mortgage pre-approval calculations</li>
                <li>• Auto loan eligibility assessment</li>
                <li>• Credit card application requirements</li>
                <li>• Debt-to-income ratio calculations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>

        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">How do I calculate my monthly income from an hourly wage?</h3>
            <p className="text-gray-600 leading-relaxed">
              Multiply your hourly rate by the number of hours you work per week, then multiply by 52 (weeks in a year) and divide by 12 (months). For example, if you earn $20 per hour and work 40 hours per week: $20 x 40 x 52 / 12 = $3,467 per month gross. Your net (take-home) pay will be lower after taxes.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">What&apos;s the difference between gross and net monthly income?</h3>
            <p className="text-gray-600 leading-relaxed">
              Gross monthly income is your total earnings before any deductions, while net monthly income (take-home pay) is what you actually receive after taxes and other deductions. The difference typically ranges from 20% to 40% depending on your tax bracket, state taxes, and benefits deductions.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Why does bi-weekly pay result in more monthly income than expected?</h3>
            <p className="text-gray-600 leading-relaxed">
              Bi-weekly pay means you receive 26 paychecks per year, not 24. When converted to monthly, this equals your bi-weekly amount times 26 divided by 12, which is higher than simply multiplying by 2. Twice a year, you&apos;ll receive three paychecks in a month, effectively boosting your average monthly income.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">What is the 28/36 rule for monthly income?</h3>
            <p className="text-gray-600 leading-relaxed">
              The 28/36 rule is a guideline lenders use: your housing costs shouldn&apos;t exceed 28% of your gross monthly income, and total debt payments shouldn&apos;t exceed 36%. For someone with $5,000 gross monthly income, housing should cost no more than $1,400/month, and total debt payments should stay under $1,800/month.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Should I use gross or net income for budgeting?</h3>
            <p className="text-gray-600 leading-relaxed">
              Always use your net (take-home) income for personal budgeting since that&apos;s the money you actually have available to spend. However, lenders and landlords often ask for gross income when evaluating applications. Know both numbers: gross for applications and net for your personal budget.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">How do I account for variable income each month?</h3>
            <p className="text-gray-600 leading-relaxed">
              For variable income (commissions, tips, freelance), calculate your monthly average using the past 12-24 months of income. Some financial advisors recommend budgeting based on your lowest monthly income and treating higher months as bonus savings. This approach prevents overspending during good months and financial stress during slower ones.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="monthly-income-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
