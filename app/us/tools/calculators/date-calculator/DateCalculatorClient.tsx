'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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

import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
type CalculatorMode = 'difference' | 'addSubtract' | 'businessDays';

interface DateBreakdown {
  years: number;
  months: number;
  weeks: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  totalHours: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "How do I calculate the number of days between two dates?",
    answer: "To calculate days between dates, subtract the earlier date from the later date. Our calculator automatically handles this by computing the absolute difference in milliseconds and converting to days. For example, the difference between January 1, 2025 and March 1, 2025 is 59 days.",
    order: 1
  },
  {
    id: '2',
    question: "How do I add or subtract days from a date?",
    answer: "To add days to a date, simply add the number of days to the current date value. To subtract, use a negative number. Our calculator lets you slide between -365 to +365 days, and also allows you to enter custom values for years, months, and days to add or subtract.",
    order: 2
  },
  {
    id: '3',
    question: "What are business days and how are they calculated?",
    answer: "Business days (also called working days) are weekdays excluding Saturdays and Sundays. To calculate business days between two dates, count all days and subtract weekends. Some calculations also exclude federal holidays. Our calculator can count business days excluding weekends.",
    order: 3
  },
  {
    id: '4',
    question: "How do I calculate years, months, and days between two dates?",
    answer: "To break down the difference: First calculate the year difference, then the remaining months, then the remaining days. For example, from January 15, 2023 to March 20, 2025 is 2 years, 2 months, and 5 days.",
    order: 4
  },
  {
    id: '5',
    question: "Does the date calculator account for leap years?",
    answer: "Yes, our calculator automatically accounts for leap years. February has 29 days in leap years (years divisible by 4, except century years not divisible by 400). The calculator uses JavaScript's Date object which handles leap years correctly.",
    order: 5
  },
  {
    id: '6',
    question: "How do I calculate a due date or deadline?",
    answer: "To find a due date, use the Add/Subtract mode. Enter your start date, then add the number of days, weeks, or months until the deadline. For example, if a project starts today and has a 90-day deadline, add 90 days to today's date to find the due date.",
    order: 6
  }
];

const relatedCalculators = [
  { href: "/us/tools/calculators/age-calculator", title: "Age Calculator", description: "Calculate exact age", color: "bg-blue-600" },
  { href: "/us/tools/calculators/days-between-dates-calculator", title: "Days Between Dates", description: "Days difference", color: "bg-green-600" },
  { href: "/us/tools/calculators/time-calculator", title: "Time Calculator", description: "Add & subtract time", color: "bg-purple-600" },
  { href: "/us/tools/calculators/time-until-calculator", title: "Time Until", description: "Countdown to events", color: "bg-orange-500" }
];

export default function DateCalculatorClient() {
  // Calculator mode
  const { getH1, getSubHeading } = usePageSEO('date-calculator');

  const [mode, setMode] = useState<CalculatorMode>('difference');

  // Date difference state
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [includeEndDate, setIncludeEndDate] = useState(false);

  // Add/Subtract state
  const [baseDate, setBaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [operation, setOperation] = useState<'add' | 'subtract'>('add');
  const [addYears, setAddYears] = useState(0);
  const [addMonths, setAddMonths] = useState(0);
  const [addDays, setAddDays] = useState(30);

  // Business days state
  const [businessStartDate, setBusinessStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [businessEndDate, setBusinessEndDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  // Results
  const [dateBreakdown, setDateBreakdown] = useState<DateBreakdown>({
    years: 0, months: 1, weeks: 4, days: 2,
    totalDays: 30, totalWeeks: 4, totalMonths: 1, totalHours: 720
  });
  const [resultDate, setResultDate] = useState('');
  const [businessDays, setBusinessDays] = useState(0);
  const [weekendDays, setWeekendDays] = useState(0);

  // FAQ state

  useEffect(() => {
    if (mode === 'difference') {
      calculateDifference();
    } else if (mode === 'addSubtract') {
      calculateAddSubtract();
    } else if (mode === 'businessDays') {
      calculateBusinessDays();
    }
  }, [mode, startDate, endDate, includeEndDate, baseDate, operation, addYears, addMonths, addDays, businessStartDate, businessEndDate]);

  const calculateDifference = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Ensure start is before end
    const [earlier, later] = start <= end ? [start, end] : [end, start];

    let diffMs = later.getTime() - earlier.getTime();
    if (includeEndDate) {
      diffMs += 24 * 60 * 60 * 1000;
    }

    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = Math.floor(totalDays / 30.44);
    const totalHours = totalDays * 24;

    // Calculate years, months, days breakdown
    let years = 0;
    let months = 0;
    let days = 0;

    let tempDate = new Date(earlier);

    // Count years
    while (new Date(tempDate.getFullYear() + 1, tempDate.getMonth(), tempDate.getDate()) <= later) {
      years++;
      tempDate.setFullYear(tempDate.getFullYear() + 1);
    }

    // Count months
    while (true) {
      const nextMonth = new Date(tempDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      if (nextMonth <= later) {
        months++;
        tempDate = nextMonth;
      } else {
        break;
      }
    }

    // Count remaining days
    days = Math.floor((later.getTime() - tempDate.getTime()) / (1000 * 60 * 60 * 24));
    if (includeEndDate) days++;

    setDateBreakdown({
      years, months, weeks: Math.floor(days / 7), days: days % 7,
      totalDays, totalWeeks, totalMonths, totalHours
    });
  };

  const calculateAddSubtract = () => {
    const base = new Date(baseDate);

    if (operation === 'add') {
      base.setFullYear(base.getFullYear() + addYears);
      base.setMonth(base.getMonth() + addMonths);
      base.setDate(base.getDate() + addDays);
    } else {
      base.setFullYear(base.getFullYear() - addYears);
      base.setMonth(base.getMonth() - addMonths);
      base.setDate(base.getDate() - addDays);
    }

    setResultDate(base.toISOString().split('T')[0]);
  };

  const calculateBusinessDays = () => {
    const start = new Date(businessStartDate);
    const end = new Date(businessEndDate);

    const [earlier, later] = start <= end ? [start, end] : [end, start];

    let businessCount = 0;
    let weekendCount = 0;
    let current = new Date(earlier);

    while (current <= later) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekendCount++;
      } else {
        businessCount++;
      }
      current.setDate(current.getDate() + 1);
    }

    setBusinessDays(businessCount);
    setWeekendDays(weekendCount);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getQuickDates = () => {
    const today = new Date();
    return [
      { label: 'Tomorrow', days: 1 },
      { label: '1 Week', days: 7 },
      { label: '2 Weeks', days: 14 },
      { label: '1 Month', days: 30 },
      { label: '3 Months', days: 90 },
      { label: '6 Months', days: 180 },
      { label: '1 Year', days: 365 },
    ];
  };

  const setQuickDate = (days: number) => {
    const future = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    setEndDate(future.toISOString().split('T')[0]);
    setStartDate(new Date().toISOString().split('T')[0]);
  };

  // Schema.org structured data
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": "Date Calculator",
        "description": "Calculate days, weeks, months, and years between two dates. Add or subtract time from any date. Calculate business days excluding weekends.",
        "url": "https://economictimes.indiatimes.com/us/tools/calculators/date-calculator",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any",
        "permissions": "browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": fallbackFaqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://economictimes.indiatimes.com/us"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Tools",
            "item": "https://economictimes.indiatimes.com/us/tools"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Calculators",
            "item": "https://economictimes.indiatimes.com/us/tools/calculators"
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "Date Calculator",
            "item": "https://economictimes.indiatimes.com/us/tools/calculators/date-calculator"
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-3 sm:mb-4 md:mb-6">
          <Link href="/us/tools" className="text-blue-600 hover:underline">Home</Link>
          <span className="text-gray-400">›</span>
          <Link href="/us/tools/all-calculators" className="text-blue-600 hover:underline">Calculators</Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-600">Date Calculator</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{getH1('Date Calculator')}</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Calculate the difference between two dates in days, weeks, months, and years. Add or subtract time from any date, or find business days between dates.
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8 mb-12">
          {/* Calculator Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
              {/* Mode Selection */}
              <div className="mb-3 sm:mb-4 md:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Calculator Mode</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    onClick={() => setMode('difference')}
                    className={`flex flex-col items-center p-4 border-2 rounded-xl transition-all ${
                      mode === 'difference'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-6 h-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium">Date Difference</span>
                    <span className="text-xs text-gray-500 mt-1">Days between dates</span>
                  </button>
                  <button
                    onClick={() => setMode('addSubtract')}
                    className={`flex flex-col items-center p-4 border-2 rounded-xl transition-all ${
                      mode === 'addSubtract'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-6 h-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="font-medium">Add/Subtract</span>
                    <span className="text-xs text-gray-500 mt-1">Find future/past date</span>
                  </button>
                  <button
                    onClick={() => setMode('businessDays')}
                    className={`flex flex-col items-center p-4 border-2 rounded-xl transition-all ${
                      mode === 'businessDays'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-6 h-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium">Business Days</span>
                    <span className="text-xs text-gray-500 mt-1">Exclude weekends</span>
                  </button>
                </div>
              </div>

              {/* Date Difference Mode */}
              {mode === 'difference' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculate Days Between Dates</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                      />
                      <div className="text-sm text-gray-500 mt-1">{formatDate(startDate)}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                      />
                      <div className="text-sm text-gray-500 mt-1">{formatDate(endDate)}</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={includeEndDate}
                        onChange={(e) => setIncludeEndDate(e.target.checked)}
                        className="mr-3 w-5 h-5 rounded text-blue-600"
                      />
                      <span className="text-sm text-gray-700">Include end date in calculation</span>
                    </label>
                  </div>

                  {/* Quick Date Buttons */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Quick Dates (from today)</label>
                    <div className="flex flex-wrap gap-2">
                      {getQuickDates().map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => setQuickDate(item.days)}
                          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Add/Subtract Mode */}
              {mode === 'addSubtract' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Add or Subtract from Date</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Starting Date</label>
                      <input
                        type="date"
                        value={baseDate}
                        onChange={(e) => setBaseDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                      />
                      <div className="text-sm text-gray-500 mt-1">{formatDate(baseDate)}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Operation</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setOperation('add')}
                          className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                            operation === 'add'
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          + Add
                        </button>
                        <button
                          onClick={() => setOperation('subtract')}
                          className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                            operation === 'subtract'
                              ? 'border-red-500 bg-red-50 text-red-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          - Subtract
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Years</label>
                      <input
                        type="number"
                        value={addYears}
                        onChange={(e) => setAddYears(parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Months</label>
                      <input
                        type="number"
                        value={addMonths}
                        onChange={(e) => setAddMonths(parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Days</label>
                      <input
                        type="number"
                        value={addDays}
                        onChange={(e) => setAddDays(parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Result Date Display */}
                  <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <div className="text-sm text-green-600 mb-1">Result Date</div>
                    <div className="text-2xl font-bold text-green-800">{formatDate(resultDate)}</div>
                    <div className="text-sm text-green-600 mt-2">{resultDate}</div>
                  </div>
                </div>
              )}

              {/* Business Days Mode */}
              {mode === 'businessDays' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculate Business Days</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                      <input
                        type="date"
                        value={businessStartDate}
                        onChange={(e) => setBusinessStartDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                      />
                      <div className="text-sm text-gray-500 mt-1">{formatDate(businessStartDate)}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                      <input
                        type="date"
                        value={businessEndDate}
                        onChange={(e) => setBusinessEndDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                      />
                      <div className="text-sm text-gray-500 mt-1">{formatDate(businessEndDate)}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-center">
                      <div className="text-sm text-blue-600">Business Days</div>
                      <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-700">{businessDays}</div>
                      <div className="text-xs text-blue-500">Mon-Fri only</div>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-xl border border-orange-200 text-center">
                      <div className="text-sm text-orange-600">Weekend Days</div>
                      <div className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-700">{weekendDays}</div>
                      <div className="text-xs text-orange-500">Sat & Sun</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />


            {/* Common Uses Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Date Calculations</h3>
              <div className="grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Project Planning</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>Calculate project duration</li>
                    <li>Find deadline dates</li>
                    <li>Track milestones</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Personal Events</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>Days until vacation</li>
                    <li>Anniversary countdowns</li>
                    <li>Birthday calculations</li>
                  </ul>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">Financial</h4>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>Payment due dates</li>
                    <li>Interest calculations</li>
                    <li>Contract durations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-1">
            {mode === 'difference' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 sticky top-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Date Difference</h3>

                {/* Primary Breakdown */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 mb-4 border border-blue-200">
                  <div className="text-sm text-blue-600 mb-2">Exact Duration</div>
                  <div className="text-xl font-bold text-blue-800">
                    {dateBreakdown.years > 0 && `${dateBreakdown.years} year${dateBreakdown.years !== 1 ? 's' : ''} `}
                    {dateBreakdown.months > 0 && `${dateBreakdown.months} month${dateBreakdown.months !== 1 ? 's' : ''} `}
                    {dateBreakdown.days > 0 && `${dateBreakdown.days} day${dateBreakdown.days !== 1 ? 's' : ''}`}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-gray-900">{dateBreakdown.totalDays.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Total Days</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-gray-900">{dateBreakdown.totalWeeks.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Total Weeks</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-gray-900">{dateBreakdown.totalMonths.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Total Months</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-gray-900">{dateBreakdown.totalHours.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Total Hours</div>
                  </div>
                </div>
              </div>
            )}

            {mode === 'addSubtract' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 sticky top-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Add Options</h3>
                <div className="space-y-2">
                  {[7, 14, 30, 60, 90, 180, 365].map((days) => (
                    <button
                      key={days}
                      onClick={() => setAddDays(days)}
                      className="w-full py-2 px-3 text-left text-sm rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      {days} days {days >= 30 && `(~${Math.round(days/30)} month${Math.round(days/30) > 1 ? 's' : ''})`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mode === 'businessDays' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 sticky top-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Days Info</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>Business days exclude:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Saturdays</li>
                    <li>Sundays</li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-4">
                    Note: This calculation does not account for federal holidays.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile MREC2 - Before FAQs */}


        <CalculatorMobileMrec2 />



        {/* FAQs Section */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
          <FirebaseFAQs pageId="date-calculator" fallbackFaqs={fallbackFaqs} />
        </div>
{/* Related Calculators */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedCalculators.map((calc, index) => (
              <Link
                key={index}
                href={calc.href}
                className="block p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className={`w-10 h-10 ${calc.color || 'bg-gray-500'} rounded-lg flex items-center justify-center mb-3`}>
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{calc.title}</h3>
                <p className="text-sm text-gray-500">{calc.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

