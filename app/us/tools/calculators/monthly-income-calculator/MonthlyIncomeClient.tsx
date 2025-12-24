'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners } from '@/components/MRECBanners';
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

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500' },
  { href: '/us/tools/calculators/bmi-calculator', title: 'BMI Calculator', description: 'Calculate body mass index', color: 'bg-purple-500' },
  { href: '/us/tools/calculators/age-calculator', title: 'Age Calculator', description: 'Calculate your exact age', color: 'bg-orange-500' },
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

export default function MonthlyIncomeClient() {
  const { getH1, getSubHeading } = usePageSEO('monthly-income-calculator');

  const [inputType, setInputType] = useState('annual');
  const [annualSalary, setAnnualSalary] = useState(60000);
  const [hourlyRate, setHourlyRate] = useState(30);
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [weeksPerYear, setWeeksPerYear] = useState(52);

  const [results, setResults] = useState({
    monthlyIncome: 0,
    biweeklyIncome: 0,
    weeklyIncome: 0,
    dailyIncome: 0,
    hourlyRate: 0,
    annualIncome: 0
  });

  useEffect(() => {
    calculate();
  }, [inputType, annualSalary, hourlyRate, hoursPerWeek, weeksPerYear]);

  const calculate = () => {
    let annual = 0;

    if (inputType === 'annual') {
      annual = annualSalary;
    } else {
      annual = hourlyRate * hoursPerWeek * weeksPerYear;
    }

    const monthly = annual / 12;
    const biweekly = annual / 26;
    const weekly = annual / 52;
    const daily = annual / 260; // Assuming 5 working days per week
    const hourly = annual / (hoursPerWeek * weeksPerYear);

    setResults({
      monthlyIncome: monthly,
      biweeklyIncome: biweekly,
      weeklyIncome: weekly,
      dailyIncome: daily,
      hourlyRate: hourly,
      annualIncome: annual
    });
  };

  const relatedCalculators = [
    { href: '/us/tools/calculators/salary-calculator', title: 'Salary Calculator', description: 'Calculate take-home pay' },
    { href: '/us/tools/calculators/annual-income-calculator', title: 'Annual Income', description: 'Calculate yearly income' },
    { href: '/us/tools/calculators/hourly-to-annual-salary-calculator', title: 'Hourly to Annual', description: 'Convert hourly to annual' },
    { href: '/us/tools/calculators/payroll-calculator', title: 'Payroll Calculator', description: 'Calculate payroll' },
    { href: '/us/tools/calculators/overtime-calculator', title: 'Overtime Calculator', description: 'Calculate overtime pay' },
    { href: '/us/tools/calculators/budget-calculator', title: 'Budget Calculator', description: 'Plan your budget' }
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Monthly Income Calculator')}</h1>
        <p className="text-lg text-gray-600">Convert annual salary or hourly wage to monthly income</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Enter Your Income</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Input Type</label>
              <div className="flex gap-4">
                <label className="inline-flex items-center">
                  <input type="radio" value="annual" checked={inputType === 'annual'} onChange={(e) => setInputType(e.target.value)} className="form-radio text-blue-600" />
                  <span className="ml-2">Annual Salary</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" value="hourly" checked={inputType === 'hourly'} onChange={(e) => setInputType(e.target.value)} className="form-radio text-blue-600" />
                  <span className="ml-2">Hourly Rate</span>
                </label>
              </div>
            </div>

            {inputType === 'annual' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Salary ($)</label>
                <input
                  type="number"
                  value={annualSalary}
                  onChange={(e) => setAnnualSalary(Number(e.target.value))}
                  min="0"
                  step="1000"
                  className="w-full px-4 py-3 border rounded-lg"
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate ($)</label>
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    min="0"
                    step="0.5"
                    className="w-full px-4 py-3 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hours Per Week: {hoursPerWeek}</label>
                  <input
                    type="range"
                    min="1"
                    max="80"
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(parseInt(e.target.value))}
                    className="w-full h-2 bg-blue-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weeks Per Year: {weeksPerYear}</label>
                  <input
                    type="range"
                    min="1"
                    max="52"
                    value={weeksPerYear}
                    onChange={(e) => setWeeksPerYear(parseInt(e.target.value))}
                    className="w-full h-2 bg-green-200 rounded-lg"
                  />
                </div>
              </>
            )}

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Note</h3>
              <p className="text-sm text-blue-700">
                This calculator provides gross income estimates before taxes and deductions.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Your Income Breakdown</h2>

            <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 mb-4">
              <div className="text-sm text-green-600 mb-1">Monthly Income</div>
              <div className="text-5xl font-bold text-green-700">${results.monthlyIncome.toFixed(2)}</div>
              <div className="text-sm text-green-600 mt-2">per month (before taxes)</div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Annual</span>
                <span className="font-semibold text-gray-800">${results.annualIncome.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Bi-weekly</span>
                <span className="font-semibold text-gray-800">${results.biweeklyIncome.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Weekly</span>
                <span className="font-semibold text-gray-800">${results.weeklyIncome.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Daily (5-day week)</span>
                <span className="font-semibold text-gray-800">${results.dailyIncome.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-700">Hourly Equivalent</span>
                <span className="font-bold text-blue-800">${results.hourlyRate.toFixed(2)}/hr</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-lg p-4 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <div className="text-2xl mb-2">💵</div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{calc.title}</h3>
                <p className="text-xs text-gray-600">{calc.description}</p>
              </div>
            </Link>
          ))}
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
