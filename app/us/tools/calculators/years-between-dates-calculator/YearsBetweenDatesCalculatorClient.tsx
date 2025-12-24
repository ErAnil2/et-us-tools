'use client';

import { useState, useEffect } from 'react';
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

interface PreciseDifference {
  years: number;
  months: number;
  days: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "How do I calculate the years between two dates?",
    answer: "Enter your start date and end date in the calculator above. The tool will automatically calculate the time difference in years, months, and days. You can choose between precise calculation, decimal years, or total days.",
    order: 1
  },
  {
    id: '2',
    question: "What's the difference between precise and decimal year calculations?",
    answer: "Precise calculation shows exact years, months, and days (e.g., 2 years, 3 months, 15 days). Decimal years express the time as a single decimal number (e.g., 2.29 years), which is useful for statistical analysis and scientific calculations.",
    order: 2
  },
  {
    id: '3',
    question: "Does the calculator account for leap years?",
    answer: "Yes, the calculator accounts for leap years in all calculations. The decimal year calculation uses 365.25 days per year to account for the extra day every four years, ensuring accuracy over long time periods.",
    order: 3
  },
  {
    id: '4',
    question: "How can I calculate my exact age using this calculator?",
    answer: "Enter your birth date as the start date and click 'Set End to Today' to automatically set today's date as the end date. The calculator will show your exact age in years, months, and days.",
    order: 4
  },
  {
    id: '5',
    question: "Can I swap the start and end dates?",
    answer: "Yes, use the 'Swap Dates' button to instantly reverse the start and end dates. This is useful if you entered the dates in the wrong order or want to calculate time in the opposite direction.",
    order: 5
  },
  {
    id: '6',
    question: "What are common uses for calculating years between dates?",
    answer: "Common uses include calculating age, determining service tenure, measuring time until retirement, finding anniversary milestones, calculating loan terms, determining eligibility periods, and planning long-term events.",
    order: 6
  }
];

export default function YearsBetweenDatesCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('years-between-dates-calculator');

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [method, setMethod] = useState<'precise' | 'decimal' | 'days'>('precise');
  const [results, setResults] = useState<{
    mainResult: string;
    explanation: string;
    precise: PreciseDifference;
    decimalYears: number;
    totalDays: number;
    totalWeeks: number;
    totalMonths: number;
    totalHours: number;
    totalMinutes: number;
    startFormatted: string;
    endFormatted: string;
    specialOccasions: string[];
  } | null>(null);

  // Initialize with default dates
  useEffect(() => {
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    setStartDate(oneYearAgo.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
  }, []);

  const setTodayAsEndDate = () => {
    const today = new Date().toISOString().split('T')[0];
    setEndDate(today);
  };

  const swapDates = () => {
    const temp = startDate;
    setStartDate(endDate);
    setEndDate(temp);
  };

  const calculatePreciseDifference = (start: Date, end: Date): PreciseDifference => {
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months, days };
  };

  const getPreciseFormatted = (precise: PreciseDifference): string => {
    const parts: string[] = [];
    if (precise.years > 0) parts.push(`${precise.years} year${precise.years === 1 ? '' : 's'}`);
    if (precise.months > 0) parts.push(`${precise.months} month${precise.months === 1 ? '' : 's'}`);
    if (precise.days > 0) parts.push(`${precise.days} day${precise.days === 1 ? '' : 's'}`);
    return parts.length > 0 ? parts.join(', ') : 'Same day';
  };

  const getSpecialOccasions = (totalDays: number): string[] => {
    const occasions: string[] = [];
    const years = Math.floor(totalDays / 365.25);

    if (years >= 1 && years <= 100) {
      const milestones = [1, 5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 100];
      const milestone = milestones.find(m => m === years);
      if (milestone) {
        occasions.push(`${milestone} year milestone!`);
      }
    }

    if (totalDays === 365) occasions.push('Exactly one year');
    if (totalDays === 100) occasions.push('100 days milestone');
    if (totalDays === 1000) occasions.push('1,000 days milestone');
    if (totalDays === 10000) occasions.push('10,000 days milestone');

    return occasions;
  };

  const calculateDateDifference = () => {
    if (!startDate || !endDate) {
      setResults(null);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      setResults(null);
      return;
    }

    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalMonths = Math.floor(totalDays / 30.44);
    const decimalYears = totalDays / 365.25;

    const precise = calculatePreciseDifference(start, end);

    let mainResult = '';
    let explanation = '';

    if (method === 'precise') {
      mainResult = getPreciseFormatted(precise);
      explanation = 'Precise calculation accounting for varying month lengths and leap years';
    } else if (method === 'decimal') {
      mainResult = `${decimalYears.toFixed(2)} years`;
      explanation = 'Decimal years calculation (total days ÷ 365.25)';
    } else if (method === 'days') {
      mainResult = `${totalDays.toLocaleString()} day${totalDays === 1 ? '' : 's'}`;
      explanation = 'Total number of days between the selected dates';
    }

    const startFormatted = start.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const endFormatted = end.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    setResults({
      mainResult,
      explanation,
      precise,
      decimalYears,
      totalDays,
      totalWeeks,
      totalMonths,
      totalHours,
      totalMinutes,
      startFormatted,
      endFormatted,
      specialOccasions: getSpecialOccasions(totalDays)
    });
  };

  useEffect(() => {
    calculateDateDifference();
  }, [startDate, endDate, method]);

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-6 md:py-8">
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Years Between Dates Calculator",
            "description": "Calculate the number of years, months, and days between two dates. Find age, anniversaries, time periods, and date differences with precision.",
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": fallbackFaqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />
      {/* Header */}
      <header className="text-center mb-6 md:mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">{getH1('Years Between Dates Calculator')}</h1>
        <p className="text-sm md:text-base text-gray-600 max-w-3xl mx-auto">
          Calculate the number of years, months, and days between two dates. Find age, anniversaries, time periods, and date differences with precision.
        </p>
      </header>

      {/* Main Grid Layout */}
      <div className="grid lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
        {/* Left Column: Calculator */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            {/* Date Inputs */}
            <div className="space-y-4 md:space-y-6">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <button
                    onClick={setTodayAsEndDate}
                    className="px-4 py-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium whitespace-nowrap"
                  >
                    Set to Today
                  </button>
                </div>
              </div>

              {/* Swap Button */}
              <button
                onClick={swapDates}
                className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                ↔ Swap Dates
              </button>

              {/* Calculation Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Calculation Method</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setMethod('precise')}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      method === 'precise'
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                    }`}
                  >
                    Precise
                  </button>
                  <button
                    onClick={() => setMethod('decimal')}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      method === 'decimal'
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                    }`}
                  >
                    Decimal
                  </button>
                  <button
                    onClick={() => setMethod('days')}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      method === 'days'
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                    }`}
                  >
                    Days
                  </button>
                </div>
              </div>
            </div>

            {/* Results Display */}
            {results && (
              <div className="mt-6 space-y-4">
                {/* Main Result */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 sm:p-4 md:p-6 border border-purple-200">
                  <div className="text-center">
                    <p className="text-sm text-purple-600 mb-2">{results.explanation}</p>
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-900">{results.mainResult}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      From {results.startFormatted} to {results.endFormatted}
                    </p>
                  </div>
                </div>

                {/* Special Occasions */}
                {results.specialOccasions.length > 0 && (
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <h4 className="text-sm font-medium text-yellow-800 mb-2">Milestones</h4>
                    {results.specialOccasions.map((occasion, i) => (
                      <span key={i} className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mr-2 mb-1">
                        {occasion}
                      </span>
                    ))}
                  </div>
                )}

                {/* Detailed Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
                    <span className="text-xs text-blue-600 block">Years</span>
                    <span className="text-lg font-bold text-blue-900">{results.precise.years}</span>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
                    <span className="text-xs text-green-600 block">Months</span>
                    <span className="text-lg font-bold text-green-900">{results.precise.months}</span>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 text-center border border-orange-200">
                    <span className="text-xs text-orange-600 block">Days</span>
                    <span className="text-lg font-bold text-orange-900">{results.precise.days}</span>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-3 text-center border border-indigo-200">
                    <span className="text-xs text-indigo-600 block">Total Days</span>
                    <span className="text-lg font-bold text-indigo-900">{results.totalDays.toLocaleString()}</span>
                  </div>
                  <div className="bg-pink-50 rounded-lg p-3 text-center border border-pink-200">
                    <span className="text-xs text-pink-600 block">Total Weeks</span>
                    <span className="text-lg font-bold text-pink-900">{results.totalWeeks.toLocaleString()}</span>
                  </div>
                  <div className="bg-teal-50 rounded-lg p-3 text-center border border-teal-200">
                    <span className="text-xs text-teal-600 block">Decimal Years</span>
                    <span className="text-lg font-bold text-teal-900">{results.decimalYears.toFixed(2)}</span>
                  </div>
                </div>

                {/* Extra Stats */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">More Details</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Hours:</span>
                      <span className="font-medium">{results.totalHours.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Minutes:</span>
                      <span className="font-medium">{results.totalMinutes.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Months:</span>
                      <span className="font-medium">{results.totalMonths.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Info Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 sticky top-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Tips</h3>

            <div className="space-y-4">
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h4 className="text-sm font-medium text-purple-800 mb-2">Calculate Your Age</h4>
                <p className="text-xs text-purple-600">Enter your birthdate as the start date and click "Set to Today" for the end date.</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Anniversary Planning</h4>
                <p className="text-xs text-blue-600">Find out exactly how many years until your next milestone anniversary.</p>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="text-sm font-medium text-green-800 mb-2">Decimal Years</h4>
                <p className="text-xs text-green-600">Decimal format is useful for financial calculations and statistical analysis.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners */}
      <CalculatorAfterCalcBanners />

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQs Section */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="years-between-dates-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
{/* Related Calculators */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedCalculators.map((calc, index) => (
            <Link
              key={index}
              href={calc.href}
              className={`${calc.color || 'bg-gray-500'} text-white p-4 rounded-lg hover:opacity-90 transition-opacity`}
            >
              <h3 className="font-semibold">{calc.title}</h3>
              <p className="text-sm opacity-90">{calc.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
