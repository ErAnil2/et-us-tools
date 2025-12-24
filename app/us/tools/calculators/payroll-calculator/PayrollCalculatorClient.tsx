'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
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

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Payroll Calculator?",
    answer: "A Payroll Calculator is a free online tool designed to help you quickly and accurately calculate payroll-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Payroll Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Payroll Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Payroll Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function PayrollCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  // Form state
  const { getH1, getSubHeading } = usePageSEO('payroll-calculator');

  const [payFrequency, setPayFrequency] = useState('biweekly');
  const [grossPay, setGrossPay] = useState(3000);
  const [filingStatus, setFilingStatus] = useState('marriedJoint');
  const [allowances, setAllowances] = useState(2);
  const [stateRate, setStateRate] = useState(6.5);
  const [additionalWithholding, setAdditionalWithholding] = useState(0);

  // Pre-tax deductions
  const [retirement401k, setRetirement401k] = useState(200);
  const [healthInsurance, setHealthInsurance] = useState(100);
  const [dentalVision, setDentalVision] = useState(25);
  const [fsaHsa, setFsaHsa] = useState(0);

  // Post-tax deductions
  const [roth401k, setRoth401k] = useState(0);
  const [lifeInsurance, setLifeInsurance] = useState(15);
  const [otherDeductions, setOtherDeductions] = useState(0);
  const [unionDues, setUnionDues] = useState(0);

  // UI state
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  const payPeriodsPerYear: { [key: string]: number } = {
    'weekly': 52,
    'biweekly': 26,
    'semimonthly': 24,
    'monthly': 12
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const calculateFederalTax = (annualIncome: number, status: string, allow: number) => {
    const brackets: { [key: string]: Array<{ min: number; max: number; rate: number }> } = {
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

    const taxBrackets = brackets[status] || brackets.single;

    const standardDeductions: { [key: string]: number } = {
      single: 13850,
      marriedJoint: 27700,
      marriedSeparate: 13850,
      headOfHousehold: 20800
    };

    const standardDeduction = standardDeductions[status] || standardDeductions.single;
    const personalExemption = allow * 4400;

    const taxableIncome = Math.max(0, annualIncome - standardDeduction - personalExemption);

    let tax = 0;
    for (const bracket of taxBrackets) {
      if (taxableIncome > bracket.min) {
        const taxableAtBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
        tax += taxableAtBracket * bracket.rate;
      }
    }

    return Math.max(0, tax);
  };

  const results = useMemo(() => {
    const periods = payPeriodsPerYear[payFrequency];
    const annualGross = grossPay * periods;

    const totalPreTaxDeductions = retirement401k + healthInsurance + dentalVision + fsaHsa;
    const taxableIncome = grossPay - totalPreTaxDeductions;
    const annualTaxableIncome = taxableIncome * periods;

    const federalTax = calculateFederalTax(annualTaxableIncome, filingStatus, allowances) / periods + additionalWithholding;
    const stateTax = (taxableIncome * stateRate) / 100;
    const socialSecurityTax = Math.min(taxableIncome * 0.062, (160200 / periods) * 0.062);
    const medicareTax = taxableIncome * 0.0145;

    const totalTaxes = federalTax + stateTax + socialSecurityTax + medicareTax;
    const afterTaxIncome = taxableIncome - totalTaxes;

    const totalPostTaxDeductions = roth401k + lifeInsurance + otherDeductions + unionDues;
    const netPay = afterTaxIncome - totalPostTaxDeductions;

    const annualNet = netPay * periods;
    const effectiveTaxRate = annualTaxableIncome > 0 ? ((totalTaxes * periods) / annualTaxableIncome) * 100 : 0;

    return {
      regularPay: grossPay,
      preTaxDeductions: totalPreTaxDeductions,
      federalTax,
      stateTax,
      socialSecurityTax,
      medicareTax,
      totalTaxes,
      postTaxDeductions: totalPostTaxDeductions,
      netPay,
      annualGross,
      annualNet,
      effectiveTaxRate,
      periods
    };
  }, [grossPay, payFrequency, filingStatus, allowances, stateRate, additionalWithholding,
      retirement401k, healthInsurance, dentalVision, fsaHsa, roth401k, lifeInsurance, otherDeductions, unionDues]);

  // What-If Scenarios
  const scenarios = useMemo(() => {
    const periods = payPeriodsPerYear[payFrequency];

    // Scenario 1: Max 401k contribution ($23,000 annual limit / periods)
    const max401kPerPeriod = Math.min(884, grossPay * 0.15); // Cap at 15% of gross
    const scenario1PreTax = max401kPerPeriod + healthInsurance + dentalVision + fsaHsa;
    const scenario1TaxableIncome = grossPay - scenario1PreTax;
    const scenario1AnnualTaxable = scenario1TaxableIncome * periods;
    const scenario1FederalTax = calculateFederalTax(scenario1AnnualTaxable, filingStatus, allowances) / periods;
    const scenario1StateTax = (scenario1TaxableIncome * stateRate) / 100;
    const scenario1SS = Math.min(scenario1TaxableIncome * 0.062, (160200 / periods) * 0.062);
    const scenario1Medicare = scenario1TaxableIncome * 0.0145;
    const scenario1TotalTax = scenario1FederalTax + scenario1StateTax + scenario1SS + scenario1Medicare;
    const scenario1PostTax = roth401k + lifeInsurance + otherDeductions + unionDues;
    const scenario1Net = scenario1TaxableIncome - scenario1TotalTax - scenario1PostTax;

    // Scenario 2: No state tax (moving to TX, FL, etc.)
    const scenario2TaxableIncome = grossPay - results.preTaxDeductions;
    const scenario2FederalTax = calculateFederalTax(scenario2TaxableIncome * periods, filingStatus, allowances) / periods;
    const scenario2SS = Math.min(scenario2TaxableIncome * 0.062, (160200 / periods) * 0.062);
    const scenario2Medicare = scenario2TaxableIncome * 0.0145;
    const scenario2TotalTax = scenario2FederalTax + scenario2SS + scenario2Medicare;
    const scenario2Net = scenario2TaxableIncome - scenario2TotalTax - results.postTaxDeductions;

    // Scenario 3: Single filer (if married) or married filer (if single)
    const altStatus = filingStatus === 'single' ? 'marriedJoint' : 'single';
    const scenario3TaxableIncome = grossPay - results.preTaxDeductions;
    const scenario3AnnualTaxable = scenario3TaxableIncome * periods;
    const scenario3FederalTax = calculateFederalTax(scenario3AnnualTaxable, altStatus, allowances) / periods;
    const scenario3StateTax = (scenario3TaxableIncome * stateRate) / 100;
    const scenario3SS = Math.min(scenario3TaxableIncome * 0.062, (160200 / periods) * 0.062);
    const scenario3Medicare = scenario3TaxableIncome * 0.0145;
    const scenario3TotalTax = scenario3FederalTax + scenario3StateTax + scenario3SS + scenario3Medicare;
    const scenario3Net = scenario3TaxableIncome - scenario3TotalTax - results.postTaxDeductions;

    return {
      max401k: {
        netPay: scenario1Net,
        contribution: max401kPerPeriod,
        taxSavings: results.totalTaxes - scenario1TotalTax
      },
      noStateTax: {
        netPay: scenario2Net,
        savings: scenario2Net - results.netPay
      },
      altFilingStatus: {
        status: altStatus === 'marriedJoint' ? 'Married Filing Jointly' : 'Single',
        netPay: scenario3Net,
        difference: scenario3Net - results.netPay
      }
    };
  }, [results, grossPay, payFrequency, filingStatus, allowances, stateRate, healthInsurance, dentalVision, fsaHsa, roth401k, lifeInsurance, otherDeductions, unionDues]);

  // Annual breakdown by pay period
  const annualSchedule = useMemo(() => {
    const periods = payPeriodsPerYear[payFrequency];
    const schedule = [];

    for (let i = 1; i <= periods; i++) {
      const ytdGross = grossPay * i;
      const ytdNet = results.netPay * i;
      const ytdTaxes = results.totalTaxes * i;

      schedule.push({
        period: i,
        gross: grossPay,
        net: results.netPay,
        ytdGross,
        ytdNet,
        ytdTaxes
      });
    }

    return schedule;
  }, [results, grossPay, payFrequency]);

  // SVG Donut Chart Data
  const chartData = useMemo(() => {
    const total = grossPay;
    const segments = [
      { label: 'Net Pay', value: Math.max(0, results.netPay), color: '#3B82F6' },
      { label: 'Pre-tax Deductions', value: results.preTaxDeductions, color: '#94A3B8' },
      { label: 'Federal Tax', value: Math.max(0, results.federalTax), color: '#EF4444' },
      { label: 'State Tax', value: Math.max(0, results.stateTax), color: '#FB923C' },
      { label: 'Social Security', value: results.socialSecurityTax, color: '#A855F7' },
      { label: 'Medicare', value: results.medicareTax, color: '#EC4899' },
      { label: 'Post-tax Deductions', value: results.postTaxDeductions, color: '#64748B' }
    ].filter(s => s.value > 0);

    let currentAngle = 0;
    return segments.map(segment => {
      const percentage = (segment.value / total) * 100;
      const angle = (segment.value / total) * 360;
      const startAngle = currentAngle;
      currentAngle += angle;

      return {
        ...segment,
        percentage,
        startAngle,
        endAngle: currentAngle
      };
    });
  }, [grossPay, results]);

  // Helper function to create SVG arc path
  const createArcPath = (startAngle: number, endAngle: number, innerRadius: number, outerRadius: number) => {
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;

    const x1 = 100 + outerRadius * Math.cos(startRad);
    const y1 = 100 + outerRadius * Math.sin(startRad);
    const x2 = 100 + outerRadius * Math.cos(endRad);
    const y2 = 100 + outerRadius * Math.sin(endRad);
    const x3 = 100 + innerRadius * Math.cos(endRad);
    const y3 = 100 + innerRadius * Math.sin(endRad);
    const x4 = 100 + innerRadius * Math.cos(startRad);
    const y4 = 100 + innerRadius * Math.sin(startRad);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  };

  const displayedSchedule = showFullSchedule ? annualSchedule : annualSchedule.slice(0, 6);

  return (
    <div className="max-w-[1200px] mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-100 to-green-100 px-3 sm:px-4 md:px-6 py-3 rounded-full mb-3 sm:mb-4 md:mb-6">
          <span className="text-2xl">💼</span>
          <span className="text-blue-600 font-semibold">Payroll Calculator</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Payroll Calculator Online')}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Calculate your net pay after all taxes and deductions. Get accurate estimates for federal, state, and FICA taxes.
        </p>
      </div>

      {/* Main Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-6">
            {/* Quick Presets */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Presets</h3>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => { setGrossPay(1500); setPayFrequency('biweekly'); }} className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors">
                  Entry Level ($39K)
                </button>
                <button onClick={() => { setGrossPay(2885); setPayFrequency('biweekly'); }} className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm font-medium transition-colors">
                  Median ($75K)
                </button>
                <button onClick={() => { setGrossPay(4231); setPayFrequency('biweekly'); }} className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-sm font-medium transition-colors">
                  Senior ($110K)
                </button>
                <button onClick={() => { setGrossPay(6731); setPayFrequency('biweekly'); }} className="px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg text-sm font-medium transition-colors">
                  Executive ($175K)
                </button>
              </div>
            </div>

            {/* Basic Pay Information */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Pay Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pay Frequency
                  </label>
                  <select
                    value={payFrequency}
                    onChange={(e) => setPayFrequency(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="weekly">Weekly (52 pay periods)</option>
                    <option value="biweekly">Bi-weekly (26 pay periods)</option>
                    <option value="semimonthly">Semi-monthly (24 pay periods)</option>
                    <option value="monthly">Monthly (12 pay periods)</option>
                  </select>
                </div>
                <div>
                  <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                    <span>Gross Pay per Period</span>
                    <span className="text-blue-600 font-semibold">{formatCurrency(grossPay)}</span>
                  </label>
                  <input
                    type="range"
                    min="500"
                    max="20000"
                    step="50"
                    value={grossPay}
                    onChange={(e) => setGrossPay(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$500</span>
                    <span>$20,000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tax Information */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Tax Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filing Status
                  </label>
                  <select
                    value={filingStatus}
                    onChange={(e) => setFilingStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="single">Single</option>
                    <option value="marriedJoint">Married Filing Jointly</option>
                    <option value="marriedSeparate">Married Filing Separately</option>
                    <option value="headOfHousehold">Head of Household</option>
                  </select>
                </div>
                <div>
                  <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                    <span>W-4 Allowances</span>
                    <span className="text-blue-600 font-semibold">{allowances}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={allowances}
                    onChange={(e) => setAllowances(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State Tax Rate
                  </label>
                  <select
                    value={stateRate}
                    onChange={(e) => setStateRate(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="0">No State Tax (TX, FL, NV, WA, etc.)</option>
                    <option value="3">Alabama (3%)</option>
                    <option value="4.95">Illinois (4.95%)</option>
                    <option value="5.75">Georgia (5.75%)</option>
                    <option value="6">Kentucky (6%)</option>
                    <option value="6.5">California (6.5%)</option>
                    <option value="8.82">New York (8.82%)</option>
                    <option value="10.75">New Jersey (10.75%)</option>
                    <option value="13.3">California Max (13.3%)</option>
                  </select>
                </div>
                <div>
                  <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                    <span>Additional Withholding</span>
                    <span className="text-blue-600 font-semibold">{formatCurrency(additionalWithholding)}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="10"
                    value={additionalWithholding}
                    onChange={(e) => setAdditionalWithholding(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Pre-tax Deductions */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Pre-tax Deductions (per pay period)</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                    <span>401(k) Contribution</span>
                    <span className="text-blue-600 font-semibold">{formatCurrency(retirement401k)}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="25"
                    value={retirement401k}
                    onChange={(e) => setRetirement401k(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </div>
                <div>
                  <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                    <span>Health Insurance</span>
                    <span className="text-blue-600 font-semibold">{formatCurrency(healthInsurance)}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="10"
                    value={healthInsurance}
                    onChange={(e) => setHealthInsurance(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </div>
                <div>
                  <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                    <span>Dental/Vision</span>
                    <span className="text-blue-600 font-semibold">{formatCurrency(dentalVision)}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="5"
                    value={dentalVision}
                    onChange={(e) => setDentalVision(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </div>
                <div>
                  <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                    <span>FSA/HSA Contribution</span>
                    <span className="text-blue-600 font-semibold">{formatCurrency(fsaHsa)}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="300"
                    step="10"
                    value={fsaHsa}
                    onChange={(e) => setFsaHsa(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </div>
              </div>
            </div>

            {/* Post-tax Deductions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Post-tax Deductions (per pay period)</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                    <span>Roth 401(k)</span>
                    <span className="text-blue-600 font-semibold">{formatCurrency(roth401k)}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="25"
                    value={roth401k}
                    onChange={(e) => setRoth401k(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>
                <div>
                  <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                    <span>Life Insurance</span>
                    <span className="text-blue-600 font-semibold">{formatCurrency(lifeInsurance)}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={lifeInsurance}
                    onChange={(e) => setLifeInsurance(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>
                <div>
                  <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                    <span>Other Deductions</span>
                    <span className="text-blue-600 font-semibold">{formatCurrency(otherDeductions)}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="10"
                    value={otherDeductions}
                    onChange={(e) => setOtherDeductions(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>
                <div>
                  <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                    <span>Union Dues</span>
                    <span className="text-blue-600 font-semibold">{formatCurrency(unionDues)}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="5"
                    value={unionDues}
                    onChange={(e) => setUnionDues(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-1">
            {/* Net Pay Card */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
              <div className="text-sm font-medium text-blue-100 mb-1">Your Net Pay</div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{formatCurrency(results.netPay)}</div>
              <div className="text-sm text-blue-100">per {payFrequency === 'biweekly' ? 'paycheck' : 'pay period'}</div>
              <div className="mt-4 pt-4 border-t border-blue-400">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-100">Annual Net:</span>
                  <span className="font-semibold">{formatCurrency(results.annualNet)}</span>
                </div>
              </div>
            </div>

            {/* SVG Donut Chart */}
            <div className="border rounded-xl p-4 mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Paycheck Breakdown</h3>
              <div className="relative">
                <svg viewBox="0 0 200 200" className="w-full max-w-[200px] mx-auto">
                  {chartData.map((segment, index) => (
                    <path
                      key={index}
                      d={createArcPath(segment.startAngle, segment.endAngle, 50, 80)}
                      fill={segment.color}
                      className="transition-all duration-200 cursor-pointer"
                      style={{
                        transform: hoveredSegment === segment.label ? 'scale(1.05)' : 'scale(1)',
                        transformOrigin: 'center'
                      }}
                      onMouseEnter={() => setHoveredSegment(segment.label)}
                      onMouseLeave={() => setHoveredSegment(null)}
                    />
                  ))}
                  <text x="100" y="95" textAnchor="middle" className="text-xs fill-gray-500">
                    {hoveredSegment || 'Gross Pay'}
                  </text>
                  <text x="100" y="115" textAnchor="middle" className="text-sm font-bold fill-gray-800">
                    {hoveredSegment
                      ? formatCurrency(chartData.find(s => s.label === hoveredSegment)?.value || 0)
                      : formatCurrency(grossPay)}
                  </text>
                </svg>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                {chartData.map((segment, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-xs cursor-pointer"
                    onMouseEnter={() => setHoveredSegment(segment.label)}
                    onMouseLeave={() => setHoveredSegment(null)}
                  >
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }} />
                    <span className="text-gray-600 truncate">{segment.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="border rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Detailed Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Gross Pay</span>
                  <span className="font-semibold text-green-600">{formatCurrency(grossPay)}</span>
                </div>
                <div className="flex justify-between py-1 text-gray-600">
                  <span>Pre-tax Deductions</span>
                  <span>-{formatCurrency(results.preTaxDeductions)}</span>
                </div>
                <div className="flex justify-between py-1 text-gray-600">
                  <span>Federal Tax</span>
                  <span>-{formatCurrency(results.federalTax)}</span>
                </div>
                <div className="flex justify-between py-1 text-gray-600">
                  <span>State Tax</span>
                  <span>-{formatCurrency(results.stateTax)}</span>
                </div>
                <div className="flex justify-between py-1 text-gray-600">
                  <span>Social Security (6.2%)</span>
                  <span>-{formatCurrency(results.socialSecurityTax)}</span>
                </div>
                <div className="flex justify-between py-1 text-gray-600">
                  <span>Medicare (1.45%)</span>
                  <span>-{formatCurrency(results.medicareTax)}</span>
                </div>
                <div className="flex justify-between py-1 text-gray-600">
                  <span>Post-tax Deductions</span>
                  <span>-{formatCurrency(results.postTaxDeductions)}</span>
                </div>
                <div className="flex justify-between py-2 border-t font-bold">
                  <span className="text-gray-800">Net Pay</span>
                  <span className="text-blue-600">{formatCurrency(results.netPay)}</span>
                </div>
                <div className="flex justify-between py-2 bg-gray-50 rounded px-2">
                  <span className="text-gray-600">Effective Tax Rate</span>
                  <span className="font-semibold text-orange-600">{results.effectiveTaxRate.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What-If Scenarios */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">What-If Scenarios</h2>
        <div className="grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {/* Scenario 1: Max 401k */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">💰</span>
              <h3 className="font-semibold text-green-800">Max 401(k)</h3>
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mb-2">
              {formatCurrency(scenarios.max401k.netPay)}
            </div>
            <p className="text-sm text-green-700 mb-3">Net pay with {formatCurrency(scenarios.max401k.contribution)}/period</p>
            <div className="text-xs text-green-600 bg-green-100 rounded-lg px-3 py-2">
              Tax savings: {formatCurrency(scenarios.max401k.taxSavings)}/period
            </div>
          </div>

          {/* Scenario 2: No State Tax */}
          <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-5 border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🏠</span>
              <h3 className="font-semibold text-blue-800">No State Tax State</h3>
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600 mb-2">
              {formatCurrency(scenarios.noStateTax.netPay)}
            </div>
            <p className="text-sm text-blue-700 mb-3">If you moved to TX, FL, NV, etc.</p>
            <div className="text-xs text-blue-600 bg-blue-100 rounded-lg px-3 py-2">
              Extra take-home: +{formatCurrency(scenarios.noStateTax.savings)}/period
            </div>
          </div>

          {/* Scenario 3: Alt Filing Status */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-5 border border-purple-200">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">📋</span>
              <h3 className="font-semibold text-purple-800">{scenarios.altFilingStatus.status}</h3>
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-600 mb-2">
              {formatCurrency(scenarios.altFilingStatus.netPay)}
            </div>
            <p className="text-sm text-purple-700 mb-3">If filing status changed</p>
            <div className={`text-xs rounded-lg px-3 py-2 ${scenarios.altFilingStatus.difference >= 0 ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}>
              Difference: {scenarios.altFilingStatus.difference >= 0 ? '+' : ''}{formatCurrency(scenarios.altFilingStatus.difference)}/period
            </div>
          </div>
        </div>
      </div>

      {/* Pay Period Schedule */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <div className="flex justify-between items-center mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Annual Pay Schedule</h2>
          <span className="text-sm text-gray-500">{payPeriodsPerYear[payFrequency]} pay periods/year</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Period</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Gross</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Net</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">YTD Gross</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">YTD Net</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">YTD Taxes</th>
              </tr>
            </thead>
            <tbody>
              {displayedSchedule.map((row) => (
                <tr key={row.period} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{row.period}</td>
                  <td className="text-right py-3 px-4 text-gray-600">{formatCurrency(row.gross)}</td>
                  <td className="text-right py-3 px-4 text-blue-600 font-medium">{formatCurrency(row.net)}</td>
                  <td className="text-right py-3 px-4 text-gray-600">{formatCurrency(row.ytdGross)}</td>
                  <td className="text-right py-3 px-4 text-green-600 font-medium">{formatCurrency(row.ytdNet)}</td>
                  <td className="text-right py-3 px-4 text-red-600">{formatCurrency(row.ytdTaxes)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {annualSchedule.length > 6 && (
          <button
            onClick={() => setShowFullSchedule(!showFullSchedule)}
            className="mt-4 w-full py-2 text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-2"
          >
            {showFullSchedule ? 'Show Less' : `Show All ${annualSchedule.length} Periods`}
            <svg className={`w-4 h-4 transition-transform ${showFullSchedule ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>
{/* Tax Information */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">2024 Tax Information</h2>
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <div className="bg-blue-50 rounded-lg p-5">
            <h3 className="font-semibold text-blue-800 mb-3">FICA Taxes (Required)</h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex justify-between">
                <span>Social Security:</span>
                <span className="font-medium">6.2% (up to $160,200)</span>
              </li>
              <li className="flex justify-between">
                <span>Medicare:</span>
                <span className="font-medium">1.45% (no limit)</span>
              </li>
              <li className="flex justify-between">
                <span>Additional Medicare:</span>
                <span className="font-medium">0.9% (over $200k)</span>
              </li>
            </ul>
          </div>
          <div className="bg-green-50 rounded-lg p-5">
            <h3 className="font-semibold text-green-800 mb-3">Standard Deductions</h3>
            <ul className="space-y-2 text-sm text-green-700">
              <li className="flex justify-between">
                <span>Single:</span>
                <span className="font-medium">$13,850</span>
              </li>
              <li className="flex justify-between">
                <span>Married Filing Jointly:</span>
                <span className="font-medium">$27,700</span>
              </li>
              <li className="flex justify-between">
                <span>Head of Household:</span>
                <span className="font-medium">$20,800</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Tax-Saving Tips</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <h4 className="font-medium text-gray-800">Maximize Pre-tax Contributions</h4>
              <p className="text-sm text-gray-600">401(k) contributions reduce your taxable income, lowering your tax bill.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <h4 className="font-medium text-gray-800">Use FSA/HSA Accounts</h4>
              <p className="text-sm text-gray-600">Healthcare spending accounts provide tax-free funds for medical expenses.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <h4 className="font-medium text-gray-800">Review Your W-4</h4>
              <p className="text-sm text-gray-600">Adjust withholdings to avoid overpaying taxes throughout the year.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <h4 className="font-medium text-gray-800">Consider Roth Options</h4>
              <p className="text-sm text-gray-600">Roth 401(k) contributions grow tax-free for retirement.</p>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners */}
{/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-lg p-4 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <div className="text-2xl mb-2">{calc.icon || '💼'}</div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{calc.title}</h3>
                <p className="text-xs text-gray-600">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>

        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">How do I calculate my net pay from gross salary?</h3>
            <p className="text-gray-600 leading-relaxed">
              Start with your gross pay, then subtract: federal income tax (based on your W-4 and tax brackets), state income tax (varies by state), FICA taxes (7.65% for Social Security and Medicare), and any pre-tax deductions (401k, health insurance, FSA). What remains is your net or take-home pay. For example, a $3,000 bi-weekly gross might result in about $2,200-$2,400 net, depending on your tax situation.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">What&apos;s the difference between pre-tax and post-tax deductions?</h3>
            <p className="text-gray-600 leading-relaxed">
              Pre-tax deductions (like traditional 401k, health insurance premiums, HSA/FSA contributions) are taken from your gross pay before taxes are calculated, reducing your taxable income. Post-tax deductions (like Roth 401k, life insurance, union dues) are taken after taxes. Pre-tax deductions lower your current tax bill, while Roth contributions grow tax-free for retirement.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Why is my paycheck different each pay period?</h3>
            <p className="text-gray-600 leading-relaxed">
              Variations can occur due to: changes in overtime or bonus pay, annual benefit premium adjustments, reaching Social Security wage base limits (no more SS tax after $168,600 in 2024), flexible spending account contributions ending, or changes to your W-4 withholding. Review your pay stub details to identify specific differences.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">How much should I contribute to my 401(k)?</h3>
            <p className="text-gray-600 leading-relaxed">
              At minimum, contribute enough to get your full employer match—that&apos;s free money. A common recommendation is 10-15% of gross income including employer match. The 2024 employee contribution limit is $23,000 (plus $7,500 catch-up if over 50). Balance retirement savings with emergency fund goals and high-interest debt payoff.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">What is FICA tax and why is it on my paycheck?</h3>
            <p className="text-gray-600 leading-relaxed">
              FICA (Federal Insurance Contributions Act) funds Social Security and Medicare. You pay 6.2% for Social Security (on earnings up to $168,600 in 2024) and 1.45% for Medicare (on all earnings). Your employer matches these amounts. High earners pay an additional 0.9% Medicare tax on earnings over $200,000 (single) or $250,000 (married filing jointly).
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Should I claim more or fewer allowances on my W-4?</h3>
            <p className="text-gray-600 leading-relaxed">
              The new W-4 (2020+) doesn&apos;t use allowances—instead, you provide information about multiple jobs, spouse income, dependents, and additional withholding. If you want a larger paycheck (less withholding), claim dependents accurately and don&apos;t add extra withholding. For a larger refund (more withholding), add extra withholding in Step 4(c). Use the IRS withholding estimator for personalized guidance.
            </p>
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
              This payroll calculator provides estimates for informational purposes only. Actual taxes and deductions
              may vary based on your specific situation, state laws, local taxes, and employer policies. Consult a tax professional or
              your HR department for precise payroll calculations.
            </p>
          </div>
        </div>

      {/* Additional SVG Charts Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Payroll Breakdown Visualizations</h2>

        {/* Chart 1: Annual Payroll Cost Breakdown */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Annual Payroll Cost Breakdown</h3>
          <div className="overflow-x-auto">
            <svg viewBox="0 0 800 300" className="w-full h-auto">
              <defs>
                <linearGradient id="grossBar" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="fedBar" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
                <linearGradient id="stBar" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
                <linearGradient id="ficaBar" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
                <linearGradient id="netBar" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>

              <line x1="60" y1="240" x2="740" y2="240" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="60" y1="180" x2="740" y2="180" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="60" y1="120" x2="740" y2="120" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="60" y1="60" x2="740" y2="60" stroke="#e5e7eb" strokeWidth="1" />

              <line x1="60" y1="20" x2="60" y2="240" stroke="#374151" strokeWidth="2" />
              <line x1="60" y1="240" x2="740" y2="240" stroke="#374151" strokeWidth="2" />

              {(() => {
                const annualValues = {
                  gross: results.annualGross,
                  federal: results.federalTax * results.periods,
                  state: results.stateTax * results.periods,
                  fica: (results.socialSecurityTax + results.medicareTax) * results.periods,
                  net: results.annualNet
                };

                const maxValue = annualValues.gross;
                const scale = 200 / maxValue;

                const bars = [
                  { label: 'Annual Gross', value: annualValues.gross, color: 'url(#grossBar)', x: 80 },
                  { label: 'Federal Tax', value: annualValues.federal, color: 'url(#fedBar)', x: 200 },
                  { label: 'State Tax', value: annualValues.state, color: 'url(#stBar)', x: 320 },
                  { label: 'FICA', value: annualValues.fica, color: 'url(#ficaBar)', x: 440 },
                  { label: 'Annual Net', value: annualValues.net, color: 'url(#netBar)', x: 560 }
                ];

                return bars.map((bar, idx) => {
                  const height = bar.value * scale;
                  const y = 240 - height;

                  return (
                    <g key={idx}>
                      <rect
                        x={bar.x}
                        y={y}
                        width="80"
                        height={height}
                        fill={bar.color}
                        rx="4"
                      />
                      <text x={bar.x + 40} y={y - 10} textAnchor="middle" className="text-xs font-semibold fill-gray-700">
                        {formatCurrency(bar.value)}
                      </text>
                      <text x={bar.x + 40} y={260} textAnchor="middle" className="text-xs fill-gray-600">
                        {bar.label}
                      </text>
                    </g>
                  );
                });
              })()}

              <text x="55" y="245" textAnchor="end" className="text-xs fill-gray-600">$0</text>
              <text x="55" y="125" textAnchor="end" className="text-xs fill-gray-600">
                {formatCurrency(results.annualGross / 2)}
              </text>
              <text x="55" y="25" textAnchor="end" className="text-xs fill-gray-600">
                {formatCurrency(results.annualGross)}
              </text>
            </svg>
          </div>
        </div>

        {/* Chart 2: Take-Home Pay Calculation Flow */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Paycheck Flow: Gross to Net</h3>
          <div className="overflow-x-auto">
            <svg viewBox="0 0 800 250" className="w-full h-auto">
              <defs>
                <linearGradient id="flowGross" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="flowDeductions" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
                <linearGradient id="flowTaxes" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
                <linearGradient id="flowNet" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>

              {(() => {
                const total = grossPay;
                const grossWidth = (grossPay / total) * 600;
                const deductionWidth = (results.preTaxDeductions / total) * 600;
                const taxWidth = (results.totalTaxes / total) * 600;
                const netWidth = (results.netPay / total) * 600;

                let currentX = 100;

                return (
                  <>
                    {/* Gross Pay */}
                    <rect x={currentX} y="60" width={grossWidth} height="50" fill="url(#flowGross)" rx="4" />
                    <text x={currentX + grossWidth / 2} y="90" textAnchor="middle" className="text-sm font-semibold fill-white">
                      Gross: {formatCurrency(grossPay)}
                    </text>

                    {/* Arrow */}
                    <path d="M 700 85 L 720 85 L 715 80 M 720 85 L 715 90" stroke="#64748b" strokeWidth="2" fill="none" />
                    <text x="730" y="90" className="text-xs fill-gray-600">minus</text>

                    {/* Deductions */}
                    <rect x="100" y="130" width={deductionWidth} height="30" fill="url(#flowDeductions)" rx="4" />
                    <text x={100 + deductionWidth / 2} y="150" textAnchor="middle" className="text-xs font-semibold fill-white">
                      Pre-tax: {formatCurrency(results.preTaxDeductions)}
                    </text>

                    {/* Taxes */}
                    <rect x={100 + deductionWidth + 10} y="130" width={taxWidth} height="30" fill="url(#flowTaxes)" rx="4" />
                    <text x={100 + deductionWidth + 10 + taxWidth / 2} y="150" textAnchor="middle" className="text-xs font-semibold fill-white">
                      Taxes: {formatCurrency(results.totalTaxes)}
                    </text>

                    {/* Arrow */}
                    <path d="M 400 175 L 400 195 L 395 190 M 400 195 L 405 190" stroke="#64748b" strokeWidth="2" fill="none" />
                    <text x="410" y="190" className="text-xs fill-gray-600">equals</text>

                    {/* Net Pay */}
                    <rect x="100" y="200" width={netWidth} height="40" fill="url(#flowNet)" rx="4" />
                    <text x={100 + netWidth / 2} y="225" textAnchor="middle" className="text-sm font-bold fill-white">
                      Net Pay: {formatCurrency(results.netPay)}
                    </text>
                  </>
                );
              })()}
            </svg>
          </div>
        </div>

        {/* Chart 3: Tax vs Take-Home Comparison */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Effective Tax Rate Visualization</h3>
          <div className="overflow-x-auto">
            <svg viewBox="0 0 800 200" className="w-full h-auto">
              <defs>
                <linearGradient id="taxBar" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
                <linearGradient id="takeHomeBar" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>

              {/* Background bar representing 100% */}
              <rect x="100" y="60" width="600" height="40" fill="#e5e7eb" rx="4" />

              {(() => {
                const taxPercent = results.effectiveTaxRate;
                const takeHomePercent = 100 - taxPercent;
                const taxWidth = (taxPercent / 100) * 600;
                const takeHomeWidth = (takeHomePercent / 100) * 600;

                return (
                  <>
                    {/* Tax portion */}
                    <rect x="100" y="60" width={taxWidth} height="40" fill="url(#taxBar)" rx="4" />
                    <text x={100 + taxWidth / 2} y="85" textAnchor="middle" className="text-sm font-semibold fill-white">
                      Tax: {taxPercent.toFixed(1)}%
                    </text>

                    {/* Take-home portion */}
                    <rect x={100 + taxWidth} y="60" width={takeHomeWidth} height="40" fill="url(#takeHomeBar)" rx="4" />
                    <text x={100 + taxWidth + takeHomeWidth / 2} y="85" textAnchor="middle" className="text-sm font-semibold fill-white">
                      Take-Home: {takeHomePercent.toFixed(1)}%
                    </text>

                    {/* Labels */}
                    <text x="100" y="130" className="text-sm fill-gray-700">0%</text>
                    <text x="700" y="130" textAnchor="end" className="text-sm fill-gray-700">100%</text>
                    <text x="400" y="150" textAnchor="middle" className="text-xs fill-gray-600">
                      Effective Tax Rate: {results.effectiveTaxRate.toFixed(1)}%
                    </text>
                  </>
                );
              })()}
            </svg>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="payroll-calculator" fallbackFaqs={fallbackFaqs} />
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      </div>
    </div>
  );
}
