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
    question: "What is a Money Per Hour Calculator?",
    answer: "A Money Per Hour Calculator is a free online tool designed to help you quickly and accurately calculate money per hour-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Money Per Hour Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Money Per Hour Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Money Per Hour Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function MoneyPerHourClient() {
  const { getH1, getSubHeading } = usePageSEO('money-per-hour-calculator');

  const [calculationType, setCalculationType] = useState('fromTotal');
  const [totalAmount, setTotalAmount] = useState(5000);
  const [hoursWorked, setHoursWorked] = useState(160);
  const [hourlyRate, setHourlyRate] = useState(30);

  const [results, setResults] = useState({
    hourlyRate: 0,
    totalEarnings: 0,
    dailyRate: 0,
    weeklyRate: 0,
    monthlyRate: 0,
    annualRate: 0
  });

  useEffect(() => {
    calculate();
  }, [calculationType, totalAmount, hoursWorked, hourlyRate]);

  const calculate = () => {
    let calcHourlyRate = 0;
    let calcTotalEarnings = 0;

    if (calculationType === 'fromTotal') {
      calcHourlyRate = hoursWorked > 0 ? totalAmount / hoursWorked : 0;
      calcTotalEarnings = totalAmount;
    } else {
      calcHourlyRate = hourlyRate;
      calcTotalEarnings = hourlyRate * hoursWorked;
    }

    setResults({
      hourlyRate: calcHourlyRate,
      totalEarnings: calcTotalEarnings,
      dailyRate: calcHourlyRate * 8,
      weeklyRate: calcHourlyRate * 40,
      monthlyRate: calcHourlyRate * 160,
      annualRate: calcHourlyRate * 2080
    });
  };

  const relatedCalculators = [
    { href: '/us/tools/calculators/salary-calculator', title: 'Salary Calculator', description: 'Calculate annual salary' },
    { href: '/us/tools/calculators/hourly-to-annual-salary-calculator', title: 'Hourly to Annual', description: 'Convert hourly to annual' },
    { href: '/us/tools/calculators/overtime-calculator', title: 'Overtime Calculator', description: 'Calculate overtime pay' },
    { href: '/us/tools/calculators/payroll-calculator', title: 'Payroll Calculator', description: 'Calculate payroll deductions' },
    { href: '/us/tools/calculators/tip-calculator', title: 'Tip Calculator', description: 'Calculate tips and splits' },
    { href: '/us/tools/calculators/freelance-rate-calculator', title: 'Freelance Rate', description: 'Calculate freelance rates' }
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Money Per Hour Calculator')}</h1>
        <p className="text-lg text-gray-600">Calculate your hourly earnings rate from any income source</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Calculate Your Rate</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Calculation Type</label>
              <select value={calculationType} onChange={(e) => setCalculationType(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
                <option value="fromTotal">From Total Amount</option>
                <option value="fromHourly">From Hourly Rate</option>
              </select>
            </div>

            {calculationType === 'fromTotal' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount Earned ($)</label>
                <input
                  type="number"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(Number(e.target.value))}
                  min="0"
                  step="100"
                  className="w-full px-4 py-3 border rounded-lg"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate ($)</label>
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  min="0"
                  step="1"
                  className="w-full px-4 py-3 border rounded-lg"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hours Worked: {hoursWorked}</label>
              <input
                type="range"
                min="1"
                max="300"
                value={hoursWorked}
                onChange={(e) => setHoursWorked(parseInt(e.target.value))}
                className="w-full h-2 bg-blue-200 rounded-lg"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 hr</span>
                <span>300 hrs</span>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Quick Reference</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p>Part-time month: ~80 hours</p>
                <p>Full-time month: ~160 hours</p>
                <p>Full-time year: ~2,080 hours</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Your Results</h2>

            <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 mb-4">
              <div className="text-sm text-green-600 mb-1">Hourly Rate</div>
              <div className="text-5xl font-bold text-green-700">${results.hourlyRate.toFixed(2)}</div>
              <div className="text-sm text-green-600 mt-2">per hour</div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Daily (8 hrs)</span>
                <span className="font-semibold text-gray-800">${results.dailyRate.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Weekly (40 hrs)</span>
                <span className="font-semibold text-gray-800">${results.weeklyRate.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Monthly (160 hrs)</span>
                <span className="font-semibold text-gray-800">${results.monthlyRate.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-700">Annual (2,080 hrs)</span>
                <span className="font-bold text-blue-800">${results.annualRate.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-sm text-yellow-800">
                <strong>Total Earnings:</strong> ${results.totalEarnings.toFixed(2)} for {hoursWorked} hours
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
                <div className="text-2xl mb-2">💰</div>
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
        <FirebaseFAQs pageId="money-per-hour-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
</div>
  );
}
