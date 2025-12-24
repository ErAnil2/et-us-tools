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
  min: number;
  max: number;
  rate: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Salary Calculator?",
    answer: "A Salary Calculator is a free online tool designed to help you quickly and accurately calculate salary-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Salary Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Salary Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Salary Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function SalaryCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('salary-calculator');

  const [annualSalary, setAnnualSalary] = useState(75000);
  const [payFrequency, setPayFrequency] = useState<'weekly' | 'biweekly' | 'semimonthly' | 'monthly'>('biweekly');
  const [filingStatus, setFilingStatus] = useState<'single' | 'married' | 'head'>('single');
  const [state, setState] = useState('CA');
  const [retirement401k, setRetirement401k] = useState(6);
  const [healthInsurance, setHealthInsurance] = useState(200);
  const [otherDeductions, setOtherDeductions] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Federal tax brackets 2024
  const federalBrackets: Record<string, TaxBracket[]> = {
    single: [
      { min: 0, max: 11600, rate: 10 },
      { min: 11600, max: 47150, rate: 12 },
      { min: 47150, max: 100525, rate: 22 },
      { min: 100525, max: 191950, rate: 24 },
      { min: 191950, max: 243725, rate: 32 },
      { min: 243725, max: 609350, rate: 35 },
      { min: 609350, max: Infinity, rate: 37 },
    ],
    married: [
      { min: 0, max: 23200, rate: 10 },
      { min: 23200, max: 94300, rate: 12 },
      { min: 94300, max: 201050, rate: 22 },
      { min: 201050, max: 383900, rate: 24 },
      { min: 383900, max: 487450, rate: 32 },
      { min: 487450, max: 731200, rate: 35 },
      { min: 731200, max: Infinity, rate: 37 },
    ],
    head: [
      { min: 0, max: 16550, rate: 10 },
      { min: 16550, max: 63100, rate: 12 },
      { min: 63100, max: 100500, rate: 22 },
      { min: 100500, max: 191950, rate: 24 },
      { min: 191950, max: 243700, rate: 32 },
      { min: 243700, max: 609350, rate: 35 },
      { min: 609350, max: Infinity, rate: 37 },
    ],
  };

  // State tax rates (simplified - top marginal rate)
  const stateTaxRates: Record<string, { rate: number; name: string }> = {
    'AL': { rate: 5.0, name: 'Alabama' },
    'AK': { rate: 0, name: 'Alaska' },
    'AZ': { rate: 2.5, name: 'Arizona' },
    'AR': { rate: 4.4, name: 'Arkansas' },
    'CA': { rate: 13.3, name: 'California' },
    'CO': { rate: 4.4, name: 'Colorado' },
    'CT': { rate: 6.99, name: 'Connecticut' },
    'DE': { rate: 6.6, name: 'Delaware' },
    'FL': { rate: 0, name: 'Florida' },
    'GA': { rate: 5.49, name: 'Georgia' },
    'HI': { rate: 11.0, name: 'Hawaii' },
    'ID': { rate: 5.8, name: 'Idaho' },
    'IL': { rate: 4.95, name: 'Illinois' },
    'IN': { rate: 3.05, name: 'Indiana' },
    'IA': { rate: 5.7, name: 'Iowa' },
    'KS': { rate: 5.7, name: 'Kansas' },
    'KY': { rate: 4.0, name: 'Kentucky' },
    'LA': { rate: 4.25, name: 'Louisiana' },
    'ME': { rate: 7.15, name: 'Maine' },
    'MD': { rate: 5.75, name: 'Maryland' },
    'MA': { rate: 5.0, name: 'Massachusetts' },
    'MI': { rate: 4.25, name: 'Michigan' },
    'MN': { rate: 9.85, name: 'Minnesota' },
    'MS': { rate: 5.0, name: 'Mississippi' },
    'MO': { rate: 4.8, name: 'Missouri' },
    'MT': { rate: 5.9, name: 'Montana' },
    'NE': { rate: 5.84, name: 'Nebraska' },
    'NV': { rate: 0, name: 'Nevada' },
    'NH': { rate: 0, name: 'New Hampshire' },
    'NJ': { rate: 10.75, name: 'New Jersey' },
    'NM': { rate: 5.9, name: 'New Mexico' },
    'NY': { rate: 10.9, name: 'New York' },
    'NC': { rate: 4.75, name: 'North Carolina' },
    'ND': { rate: 2.5, name: 'North Dakota' },
    'OH': { rate: 3.5, name: 'Ohio' },
    'OK': { rate: 4.75, name: 'Oklahoma' },
    'OR': { rate: 9.9, name: 'Oregon' },
    'PA': { rate: 3.07, name: 'Pennsylvania' },
    'RI': { rate: 5.99, name: 'Rhode Island' },
    'SC': { rate: 6.4, name: 'South Carolina' },
    'SD': { rate: 0, name: 'South Dakota' },
    'TN': { rate: 0, name: 'Tennessee' },
    'TX': { rate: 0, name: 'Texas' },
    'UT': { rate: 4.65, name: 'Utah' },
    'VT': { rate: 8.75, name: 'Vermont' },
    'VA': { rate: 5.75, name: 'Virginia' },
    'WA': { rate: 0, name: 'Washington' },
    'WV': { rate: 5.12, name: 'West Virginia' },
    'WI': { rate: 7.65, name: 'Wisconsin' },
    'WY': { rate: 0, name: 'Wyoming' },
    'DC': { rate: 10.75, name: 'Washington DC' },
  };

  const calculations = useMemo(() => {
    // Pre-tax deductions
    const retirement401kAmount = annualSalary * (retirement401k / 100);
    const annualHealthInsurance = healthInsurance * 12;
    const annualOtherDeductions = otherDeductions * 12;
    const totalPreTaxDeductions = retirement401kAmount + annualHealthInsurance + annualOtherDeductions;

    // Taxable income
    const taxableIncome = Math.max(0, annualSalary - totalPreTaxDeductions);

    // Federal tax calculation
    const brackets = federalBrackets[filingStatus];
    let federalTax = 0;
    let remainingIncome = taxableIncome;

    for (const bracket of brackets) {
      if (remainingIncome <= 0) break;
      const taxableInBracket = Math.min(remainingIncome, bracket.max - bracket.min);
      federalTax += taxableInBracket * (bracket.rate / 100);
      remainingIncome -= taxableInBracket;
    }

    // State tax (simplified)
    const stateTaxRate = stateTaxRates[state]?.rate || 0;
    const stateTax = taxableIncome * (stateTaxRate / 100);

    // FICA taxes
    const socialSecurityWageBase = 168600; // 2024
    const socialSecurityRate = 0.062;
    const medicareRate = 0.0145;
    const additionalMedicareThreshold = filingStatus === 'married' ? 250000 : 200000;
    const additionalMedicareRate = 0.009;

    const socialSecurityTax = Math.min(annualSalary, socialSecurityWageBase) * socialSecurityRate;
    let medicareTax = annualSalary * medicareRate;
    if (annualSalary > additionalMedicareThreshold) {
      medicareTax += (annualSalary - additionalMedicareThreshold) * additionalMedicareRate;
    }
    const ficaTax = socialSecurityTax + medicareTax;

    // Total taxes
    const totalTaxes = federalTax + stateTax + ficaTax;

    // Net pay
    const annualNetPay = annualSalary - totalTaxes - totalPreTaxDeductions;

    // Pay frequency calculations
    const periodsPerYear = {
      weekly: 52,
      biweekly: 26,
      semimonthly: 24,
      monthly: 12,
    };

    const periods = periodsPerYear[payFrequency];

    // Effective tax rate
    const effectiveTaxRate = annualSalary > 0 ? (totalTaxes / annualSalary) * 100 : 0;

    // Marginal tax rate
    let marginalRate = 0;
    for (const bracket of brackets) {
      if (taxableIncome > bracket.min) {
        marginalRate = bracket.rate;
      }
    }

    return {
      annualGross: annualSalary,
      periodicGross: annualSalary / periods,
      retirement401k: retirement401kAmount,
      healthInsurance: annualHealthInsurance,
      otherDeductions: annualOtherDeductions,
      totalPreTaxDeductions,
      taxableIncome,
      federalTax,
      stateTax,
      socialSecurityTax,
      medicareTax,
      ficaTax,
      totalTaxes,
      annualNetPay,
      periodicNetPay: annualNetPay / periods,
      monthlyNetPay: annualNetPay / 12,
      weeklyNetPay: annualNetPay / 52,
      hourlyRate: annualSalary / 2080,
      effectiveTaxRate,
      marginalRate: marginalRate + stateTaxRate,
      periods,
    };
  }, [annualSalary, payFrequency, filingStatus, state, retirement401k, healthInsurance, otherDeductions]);

  // Salary comparison scenarios
  const salaryComparisons = useMemo(() => {
    const salaries = [50000, 75000, 100000, 150000];
    return salaries.map(salary => {
      const taxable = salary;
      const brackets = federalBrackets[filingStatus];
      let fedTax = 0;
      let remaining = taxable;
      for (const bracket of brackets) {
        if (remaining <= 0) break;
        const taxableInBracket = Math.min(remaining, bracket.max - bracket.min);
        fedTax += taxableInBracket * (bracket.rate / 100);
        remaining -= taxableInBracket;
      }
      const stateTax = taxable * (stateTaxRates[state]?.rate || 0) / 100;
      const fica = Math.min(salary, 168600) * 0.062 + salary * 0.0145;
      const totalTax = fedTax + stateTax + fica;
      return {
        salary,
        takeHome: salary - totalTax,
        effectiveRate: (totalTax / salary) * 100,
      };
    });
  }, [filingStatus, state]);

  // Donut chart for pay breakdown
  const payBreakdown = useMemo(() => {
    const total = calculations.annualGross;
    if (total <= 0) return [];
    return [
      { name: 'Take Home', value: calculations.annualNetPay, color: '#22C55E', percent: (calculations.annualNetPay / total) * 100 },
      { name: 'Federal Tax', value: calculations.federalTax, color: '#3B82F6', percent: (calculations.federalTax / total) * 100 },
      { name: 'State Tax', value: calculations.stateTax, color: '#8B5CF6', percent: (calculations.stateTax / total) * 100 },
      { name: 'Social Security', value: calculations.socialSecurityTax, color: '#F97316', percent: (calculations.socialSecurityTax / total) * 100 },
      { name: 'Medicare', value: calculations.medicareTax, color: '#EC4899', percent: (calculations.medicareTax / total) * 100 },
      { name: '401(k)', value: calculations.retirement401k, color: '#14B8A6', percent: (calculations.retirement401k / total) * 100 },
      { name: 'Health Ins.', value: calculations.healthInsurance, color: '#EAB308', percent: (calculations.healthInsurance / total) * 100 },
    ].filter(item => item.value > 0);
  }, [calculations]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const faqItems = [
    {
      question: "What is the difference between gross and net salary?",
      answer: "Gross salary is your total compensation before any deductions, while net salary (take-home pay) is what you actually receive after taxes and deductions. The difference includes federal and state income taxes, Social Security, Medicare, and any voluntary deductions like 401(k) contributions and health insurance premiums."
    },
    {
      question: "How are federal income taxes calculated?",
      answer: "Federal income taxes use a progressive system with tax brackets. Only the income within each bracket is taxed at that bracket's rate. For example, if you're single earning $60,000, the first $11,600 is taxed at 10%, the next $35,550 at 12%, and the remaining $12,850 at 22%. Your marginal rate (highest bracket) is 22%, but your effective rate is lower."
    },
    {
      question: "What is FICA tax and how much is it?",
      answer: "FICA (Federal Insurance Contributions Act) includes Social Security and Medicare taxes. Social Security is 6.2% on income up to $168,600 (2024), and Medicare is 1.45% on all income. High earners pay an additional 0.9% Medicare tax on income over $200,000 (single) or $250,000 (married). Your employer pays an equal amount."
    },
    {
      question: "How do pre-tax deductions affect my paycheck?",
      answer: "Pre-tax deductions like 401(k) contributions and health insurance premiums reduce your taxable income before taxes are calculated. This means you pay less in income taxes now, though you'll pay taxes on 401(k) withdrawals in retirement. A $500 monthly 401(k) contribution might only reduce your take-home pay by $350-400 depending on your tax bracket."
    },
    {
      question: "Which states have no income tax?",
      answer: "Nine states have no state income tax: Alaska, Florida, Nevada, New Hampshire (on wages), South Dakota, Tennessee, Texas, Washington, and Wyoming. However, some of these states have higher property taxes, sales taxes, or other fees to compensate. Consider total tax burden and cost of living when comparing locations."
    }
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-2 sm:px-2 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Salary Calculator')}</h1>
        <p className="text-lg text-gray-600">Calculate your take-home pay with federal, state taxes, and deductions</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}

      <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Salary Information</h2>

            {/* Annual Salary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Salary: {formatCurrency(annualSalary)}
              </label>
              <input
                type="range"
                min="20000"
                max="500000"
                step="5000"
                value={annualSalary}
                onChange={(e) => setAnnualSalary(parseInt(e.target.value))}
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$20K</span>
                <span>$500K</span>
              </div>
            </div>

            {/* Pay Frequency & Filing Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pay Frequency</label>
                <select
                  value={payFrequency}
                  onChange={(e) => setPayFrequency(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="weekly">Weekly (52)</option>
                  <option value="biweekly">Bi-weekly (26)</option>
                  <option value="semimonthly">Semi-monthly (24)</option>
                  <option value="monthly">Monthly (12)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filing Status</label>
                <select
                  value={filingStatus}
                  onChange={(e) => setFilingStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="single">Single</option>
                  <option value="married">Married Filing Jointly</option>
                  <option value="head">Head of Household</option>
                </select>
              </div>
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State: {stateTaxRates[state]?.name} ({stateTaxRates[state]?.rate}% tax)
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(stateTaxRates).sort((a, b) => a[1].name.localeCompare(b[1].name)).map(([code, info]) => (
                  <option key={code} value={code}>{info.name} ({info.rate}%)</option>
                ))}
              </select>
            </div>

            {/* Deductions */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-3">Pre-Tax Deductions</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    401(k) Contribution: {retirement401k}% ({formatCurrency(annualSalary * retirement401k / 100)}/year)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="23"
                    step="1"
                    value={retirement401k}
                    onChange={(e) => setRetirement401k(parseInt(e.target.value))}
                    className="w-full h-2 bg-teal-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Health Insurance: {formatCurrency(healthInsurance)}/month
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="25"
                    value={healthInsurance}
                    onChange={(e) => setHealthInsurance(parseInt(e.target.value))}
                    className="w-full h-2 bg-yellow-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Other Deductions: {formatCurrency(otherDeductions)}/month
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="25"
                    value={otherDeductions}
                    onChange={(e) => setOtherDeductions(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Pay Summary</h2>

            {/* Main Results */}
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="text-sm text-green-600 mb-1">Take-Home Pay ({payFrequency})</div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-700">{formatCurrency(calculations.periodicNetPay)}</div>
                <div className="text-sm text-green-600 mt-1">
                  {formatCurrency(calculations.annualNetPay)}/year • {formatCurrency(calculations.monthlyNetPay)}/month
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-xs text-blue-600 mb-1">Effective Tax Rate</div>
                  <div className="text-2xl font-bold text-blue-700">{calculations.effectiveTaxRate.toFixed(1)}%</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-xs text-purple-600 mb-1">Marginal Rate</div>
                  <div className="text-2xl font-bold text-purple-700">{calculations.marginalRate.toFixed(1)}%</div>
                </div>
              </div>

              {/* Pay Breakdown Bar */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-3">Pay Distribution</div>
                <div className="flex h-6 rounded-lg overflow-hidden mb-2">
                  {payBreakdown.map((item, index) => (
                    <div
                      key={index}
                      className="transition-all"
                      style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                      title={`${item.name}: ${formatCurrency(item.value)}`}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  {payBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-gray-600">{item.name}: {item.percent.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-3">Annual Breakdown</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-600">Gross Salary</span>
                    <span className="font-semibold">{formatCurrency(calculations.annualGross)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-600">Federal Income Tax</span>
                    <span className="font-semibold text-red-600">-{formatCurrency(calculations.federalTax)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-600">State Tax ({state})</span>
                    <span className="font-semibold text-red-600">-{formatCurrency(calculations.stateTax)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-600">Social Security</span>
                    <span className="font-semibold text-red-600">-{formatCurrency(calculations.socialSecurityTax)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-600">Medicare</span>
                    <span className="font-semibold text-red-600">-{formatCurrency(calculations.medicareTax)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-600">401(k) ({retirement401k}%)</span>
                    <span className="font-semibold text-teal-600">-{formatCurrency(calculations.retirement401k)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-600">Health Insurance</span>
                    <span className="font-semibold text-yellow-600">-{formatCurrency(calculations.healthInsurance)}</span>
                  </div>
                  <div className="flex justify-between pt-2 font-medium">
                    <span className="text-gray-800">Net Annual Pay</span>
                    <span className="text-green-700">{formatCurrency(calculations.annualNetPay)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Salary Conversions */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Salary Conversions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
            <div className="text-sm text-blue-600 mb-1">Hourly Rate</div>
            <div className="text-2xl font-bold text-blue-700">${calculations.hourlyRate.toFixed(2)}</div>
            <div className="text-xs text-gray-500">40 hrs/week</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
            <div className="text-sm text-green-600 mb-1">Weekly</div>
            <div className="text-2xl font-bold text-green-700">{formatCurrency(calculations.weeklyNetPay)}</div>
            <div className="text-xs text-gray-500">take-home</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 text-center">
            <div className="text-sm text-purple-600 mb-1">Monthly</div>
            <div className="text-2xl font-bold text-purple-700">{formatCurrency(calculations.monthlyNetPay)}</div>
            <div className="text-xs text-gray-500">take-home</div>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 text-center">
            <div className="text-sm text-orange-600 mb-1">Annual</div>
            <div className="text-2xl font-bold text-orange-700">{formatCurrency(calculations.annualNetPay)}</div>
            <div className="text-xs text-gray-500">take-home</div>
          </div>
        </div>
      </div>
{/* Salary Comparison */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Salary Comparison</h2>
        <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6">Compare take-home pay at different salary levels ({filingStatus}, {stateTaxRates[state]?.name})</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {salaryComparisons.map((comp) => (
            <div
              key={comp.salary}
              className={`p-4 rounded-lg border ${comp.salary === annualSalary ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}
            >
              <div className="text-sm text-gray-500 mb-1">Salary: {formatCurrency(comp.salary)}</div>
              <div className="text-2xl font-bold text-gray-800 mb-1">{formatCurrency(comp.takeHome)}</div>
              <div className="text-sm text-gray-600">
                Take-home ({comp.effectiveRate.toFixed(1)}% effective rate)
              </div>
            </div>
          ))}
        </div>
      </div>
{/* Tax Brackets */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">2024 Federal Tax Brackets</h2>
        <p className="text-gray-600 mb-4">Filing status: {filingStatus === 'single' ? 'Single' : filingStatus === 'married' ? 'Married Filing Jointly' : 'Head of Household'}</p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-2 px-3 font-semibold text-gray-700">Tax Rate</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-700">Income Range</th>
                <th className="text-right py-2 px-3 font-semibold text-gray-700">Your Tax</th>
              </tr>
            </thead>
            <tbody>
              {federalBrackets[filingStatus].map((bracket, index) => {
                const prevMax = index > 0 ? federalBrackets[filingStatus][index - 1].max : 0;
                const taxableInBracket = Math.max(0, Math.min(calculations.taxableIncome - prevMax, bracket.max - prevMax));
                const taxInBracket = taxableInBracket * (bracket.rate / 100);
                const isCurrentBracket = calculations.taxableIncome > bracket.min && calculations.taxableIncome <= bracket.max;

                return (
                  <tr key={index} className={`border-b border-gray-100 ${isCurrentBracket ? 'bg-blue-50' : ''}`}>
                    <td className="py-2 px-3 font-medium">{bracket.rate}%</td>
                    <td className="py-2 px-3 text-gray-600">
                      {formatCurrency(bracket.min)} - {bracket.max === Infinity ? '+' : formatCurrency(bracket.max)}
                    </td>
                    <td className="text-right py-2 px-3 font-semibold">
                      {taxInBracket > 0 ? formatCurrency(taxInBracket) : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Understanding Your Pay */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Understanding Your Pay</h2>
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Common Deductions:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• <strong>Federal Income Tax:</strong> 10-37% based on income bracket</li>
              <li>• <strong>State Income Tax:</strong> 0-13.3% varies by state</li>
              <li>• <strong>Social Security:</strong> 6.2% up to $168,600 (2024)</li>
              <li>• <strong>Medicare:</strong> 1.45% of all wages (+0.9% over $200K)</li>
              <li>• <strong>401(k) Contributions:</strong> Up to $23,000 (2024)</li>
              <li>• <strong>Health Insurance:</strong> Varies by plan and employer</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Tips to Optimize:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Maximize 401(k) employer match (free money!)</li>
              <li>• Use HSA if eligible for triple tax advantage</li>
              <li>• Consider Roth contributions for tax diversification</li>
              <li>• Review W-4 to optimize withholding</li>
              <li>• Track pre-tax benefits like FSA, transit</li>
              <li>• Plan big expenses around tax implications</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqItems.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg">
              <button
                className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50"
                onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
              >
                <span className="font-medium text-gray-800">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${openFaqIndex === index ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaqIndex === index && (
                <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="salary-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
{/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Salary Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-lg p-4 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <div className="text-2xl mb-2">💼</div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {calc.title}
                </h3>
                <p className="text-xs text-gray-600">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      </div>
    </div>
  );
}
