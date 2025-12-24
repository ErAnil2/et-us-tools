'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';

import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
}

interface DaysBetweenDatesClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '📊' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

export default function DaysBetweenDatesClient({ relatedCalculators = defaultRelatedCalculators }: DaysBetweenDatesClientProps) {
  // Firebase SEO data
  const { getH1, getSubHeading, loading: seoLoading } = usePageSEO('days-between-dates-calculator');

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [includeEndDate, setIncludeEndDate] = useState<boolean>(false);
  const [businessDaysOnly, setBusinessDaysOnly] = useState<boolean>(false);

  // Results
  const [totalDays, setTotalDays] = useState<number | string>(0);
  const [weeks, setWeeks] = useState<number>(0);
  const [months, setMonths] = useState<number>(0);
  const [years, setYears] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [businessDays, setBusinessDays] = useState<number>(0);
  const [weekdays, setWeekdays] = useState<number>(0);
  const [weekends, setWeekends] = useState<number>(0);
  const [leapYearsCount, setLeapYearsCount] = useState<number>(0);
  const [detailedBreakdown, setDetailedBreakdown] = useState<string>('Select dates to see detailed breakdown');
  const [specialMessage, setSpecialMessage] = useState<string>('');

  const isBusinessDay = (date: Date): boolean => {
    const day = date.getDay();
    return day !== 0 && day !== 6; // Not Sunday (0) or Saturday (6)
  };

  const isLeapYear = (year: number): boolean => {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  };

  const countBusinessDays = (start: Date, end: Date): number => {
    let count = 0;
    let currentDate = new Date(start);

    while (currentDate <= end) {
      if (isBusinessDay(currentDate)) {
        count++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return count;
  };

  const countWeekdaysAndWeekends = (start: Date, end: Date, days: number) => {
    let weekdaysCount = 0;
    let weekendsCount = 0;
    let currentDate = new Date(start);

    for (let i = 0; i < days; i++) {
      if (isBusinessDay(currentDate)) {
        weekdaysCount++;
      } else {
        weekendsCount++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return { weekdays: weekdaysCount, weekends: weekendsCount };
  };

  const countLeapYears = (startYear: number, endYear: number): number => {
    let count = 0;
    for (let year = startYear; year <= endYear; year++) {
      if (isLeapYear(year)) {
        count++;
      }
    }
    return count;
  };

  const checkSpecialDates = (days: number): string => {
    if (days === 365) return 'Exactly one year!';
    if (days === 100) return 'A perfect century of days!';
    if (days === 1000) return 'A millennium of days!';
    if (days === 30) return 'Exactly one month (average)!';
    if (days === 7) return 'Exactly one week!';
    return '';
  };

  const calculateDateDifference = () => {
    if (!startDate || !endDate) {
      resetResults();
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      resetResults();
      setTotalDays('Invalid');
      return;
    }

    // Calculate difference in milliseconds
    const timeDiff = end.getTime() - start.getTime();
    let daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

    if (includeEndDate) {
      daysDiff += 1;
    }

    // Calculate other units
    const weeksCalc = Math.floor(daysDiff / 7);
    const monthsCalc = Math.floor(daysDiff / 30.44);
    const yearsCalc = Math.floor(daysDiff / 365.25);
    const hoursCalc = daysDiff * 24;
    const minutesCalc = hoursCalc * 60;

    // Business days calculation
    let businessDaysCalc = 0;
    if (businessDaysOnly) {
      businessDaysCalc = countBusinessDays(start, end);
      if (includeEndDate && isBusinessDay(end)) {
        businessDaysCalc++;
      }
    }

    // Weekdays and weekends
    const { weekdays: weekdaysCalc, weekends: weekendsCalc } = countWeekdaysAndWeekends(start, end, daysDiff);

    // Leap years
    const startYear = start.getFullYear();
    const endYear = end.getFullYear();
    const leapYears = countLeapYears(startYear, endYear);

    // Update state
    setTotalDays(businessDaysOnly ? businessDaysCalc : daysDiff);
    setWeeks(weeksCalc);
    setMonths(monthsCalc);
    setYears(yearsCalc);
    setHours(hoursCalc);
    setMinutes(minutesCalc);
    setBusinessDays(businessDaysCalc);
    setWeekdays(weekdaysCalc);
    setWeekends(weekendsCalc);
    setLeapYearsCount(leapYears);

    // Detailed breakdown
    const breakdown = [];
    if (yearsCalc > 0) breakdown.push(`${yearsCalc} year${yearsCalc !== 1 ? 's' : ''}`);
    if (monthsCalc % 12 > 0) breakdown.push(`${monthsCalc % 12} month${monthsCalc % 12 !== 1 ? 's' : ''}`);
    if (weeksCalc % 4 > 0) breakdown.push(`${weeksCalc % 4} week${weeksCalc % 4 !== 1 ? 's' : ''}`);
    if (daysDiff % 7 > 0) breakdown.push(`${daysDiff % 7} day${daysDiff % 7 !== 1 ? 's' : ''}`);

    setDetailedBreakdown(breakdown.length > 0 ? breakdown.join(', ') : `${daysDiff} day${daysDiff !== 1 ? 's' : ''}`);

    // Check for special dates
    setSpecialMessage(checkSpecialDates(daysDiff));
  };

  const resetResults = () => {
    setTotalDays(0);
    setWeeks(0);
    setMonths(0);
    setYears(0);
    setHours(0);
    setMinutes(0);
    setBusinessDays(0);
    setWeekdays(0);
    setWeekends(0);
    setLeapYearsCount(0);
    setDetailedBreakdown('Select dates to see detailed breakdown');
    setSpecialMessage('');
  };

  useEffect(() => {
    calculateDateDifference();
  }, [startDate, endDate, includeEndDate, businessDaysOnly]);

  useEffect(() => {
    // Set default dates (today to next week)
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    setStartDate(today.toISOString().split('T')[0]);
    setEndDate(nextWeek.toISOString().split('T')[0]);
  }, []);

  const setDatesFromToday = (days: number) => {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + days);

    if (days >= 0) {
      setStartDate(today.toISOString().split('T')[0]);
      setEndDate(futureDate.toISOString().split('T')[0]);
    } else {
      setStartDate(futureDate.toISOString().split('T')[0]);
      setEndDate(today.toISOString().split('T')[0]);
    }
  };

  const calculateAge = () => {
    const today = new Date();
    setEndDate(today.toISOString().split('T')[0]);
  };

  const setProjectDates = () => {
    const today = new Date();
    const end = new Date(today);
    end.setDate(today.getDate() + 30);

    setStartDate(today.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  const setEventDate = () => {
    const today = new Date();
    const event = new Date(today);
    event.setDate(today.getDate() + 90);

    setStartDate(today.toISOString().split('T')[0]);
    setEndDate(event.toISOString().split('T')[0]);
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-6 md:py-8 px-2 sm:px-4 lg:px-3 sm:px-5 md:px-8">
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Days Between Dates Calculator",
            "description": "Calculate the exact number of days, weeks, months, and years between two dates with options for business days and leap year tracking.",
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
      <article className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {getH1('Days Between Dates Calculator')}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            {getSubHeading('Calculate the exact number of days, weeks, months, and years between two dates')}
          </p>
        </header>

        {/* Main Calculator Card */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Input Section */}
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Select Dates</h2>

              {/* Start Date */}
              <div>
                <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* End Date */}
              <div>
                <label htmlFor="endDate" className="block text-sm font-semibold text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Quick Date Presets */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-3">Quick Calculations</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setDatesFromToday(7)}
                    className="px-3 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm transition-colors"
                  >
                    Next Week
                  </button>
                  <button
                    onClick={() => setDatesFromToday(30)}
                    className="px-3 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm transition-colors"
                  >
                    Next Month
                  </button>
                  <button
                    onClick={() => setDatesFromToday(90)}
                    className="px-3 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm transition-colors"
                  >
                    Next 3 Months
                  </button>
                  <button
                    onClick={() => setDatesFromToday(365)}
                    className="px-3 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm transition-colors"
                  >
                    Next Year
                  </button>
                  <button
                    onClick={() => setDatesFromToday(-7)}
                    className="px-3 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm transition-colors"
                  >
                    Last Week
                  </button>
                  <button
                    onClick={() => setDatesFromToday(-30)}
                    className="px-3 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm transition-colors"
                  >
                    Last Month
                  </button>
                  <button
                    onClick={() => setDatesFromToday(-90)}
                    className="px-3 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm transition-colors"
                  >
                    Last 3 Months
                  </button>
                  <button
                    onClick={() => setDatesFromToday(-365)}
                    className="px-3 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm transition-colors"
                  >
                    Last Year
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeEndDate"
                    checked={includeEndDate}
                    onChange={(e) => setIncludeEndDate(e.target.checked)}
                    className="mr-2 w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="includeEndDate" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Include end date in count
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="businessDaysOnly"
                    checked={businessDaysOnly}
                    onChange={(e) => setBusinessDaysOnly(e.target.checked)}
                    className="mr-2 w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="businessDaysOnly" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Business days only (Mon-Fri)
                  </label>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6 space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Time Duration</h3>

              {/* Total Days - Primary Result */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-3 sm:p-4 md:p-6 text-center text-white">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{formatNumber(typeof totalDays === 'number' ? totalDays : 0)}</div>
                <div className="text-lg font-semibold">{businessDaysOnly ? 'Business Days' : 'Total Days'}</div>
              </div>

              {/* Other Results */}
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Weeks:</span>
                  <span className="font-semibold text-gray-900">
                    {formatNumber(weeks)} {weeks === 1 ? 'week' : 'weeks'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Months:</span>
                  <span className="font-semibold text-gray-900">
                    {formatNumber(months)} {months === 1 ? 'month' : 'months'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Years:</span>
                  <span className="font-semibold text-gray-900">
                    {formatNumber(years)} {years === 1 ? 'year' : 'years'}
                  </span>
                </div>

                {businessDaysOnly && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Business Days:</span>
                    <span className="font-semibold text-gray-900">{formatNumber(businessDays)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Hours:</span>
                  <span className="font-semibold text-gray-900">{formatNumber(hours)}</span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Minutes:</span>
                  <span className="font-semibold text-gray-900">{formatNumber(minutes)}</span>
                </div>
              </div>

              {/* Special Information */}
              {specialMessage && (
                <div className="bg-purple-100 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 mb-2">Special Date</h4>
                  <div className="text-purple-700 text-sm">{specialMessage}</div>
                </div>
              )}
            </div>
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

        {/* Date Range Analysis */}
        <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 md:mb-8">
          <h3 className="text-xl font-bold text-yellow-800 mb-4">Date Range Analysis</h3>
          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div>
              <h4 className="font-semibold text-yellow-800 mb-3">Calendar Information</h4>
              <div className="space-y-2 text-yellow-700 text-sm">
                <div className="flex justify-between">
                  <span>Weekdays:</span>
                  <span className="font-semibold">{formatNumber(weekdays)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Weekend Days:</span>
                  <span className="font-semibold">{formatNumber(weekends)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Complete Weeks:</span>
                  <span className="font-semibold">{formatNumber(weeks)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Leap Years:</span>
                  <span className="font-semibold">{formatNumber(leapYearsCount)}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-yellow-800 mb-3">Breakdown</h4>
              <div className="text-yellow-700 text-sm">{detailedBreakdown}</div>
            </div>
          </div>
        </div>

        {/* Common Use Cases */}
        <div className="bg-green-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 md:mb-8">
          <h3 className="text-xl font-bold text-green-800 mb-4">Common Use Cases</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-green-800">Age Calculation</h4>
              <p className="text-sm text-green-700 mb-3">Calculate exact age in days</p>
              <button
                onClick={calculateAge}
                className="px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 text-sm transition-colors"
              >
                Use Today
              </button>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-green-800">Project Duration</h4>
              <p className="text-sm text-green-700 mb-3">Track project timelines</p>
              <button
                onClick={setProjectDates}
                className="px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 text-sm transition-colors"
              >
                30-Day Project
              </button>
            </div>
<div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-green-800">Event Planning</h4>
              <p className="text-sm text-green-700 mb-3">Days until special events</p>
              <button
                onClick={setEventDate}
                className="px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 text-sm transition-colors"
              >
                90 Days Out
              </button>
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="bg-blue-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 md:mb-8">
          <h3 className="text-xl font-bold text-blue-800 mb-4">About Date Calculations</h3>
          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 text-blue-700">
            <div>
              <h4 className="font-semibold mb-2">Calculation Notes:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Accounts for leap years automatically</li>
                <li>• Business days exclude weekends only</li>
                <li>• Times are calculated at midnight (00:00)</li>
                <li>• End date inclusion is optional</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Practical Applications:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Age calculations and milestones</li>
                <li>• Project planning and deadlines</li>
                <li>• Event countdown and planning</li>
                <li>• Legal and financial calculations</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Mobile MREC2 - Before FAQs */}


        <CalculatorMobileMrec2 />



        {/* FAQ Section - Managed via Firebase */}
        <FirebaseFAQs pageId="days-between-dates-calculator" />
      {/* Related Calculators */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedCalculators.map((calc, index) => (
              <Link
                key={index}
                href={calc.href}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{calc.title}</h3>
                <p className="text-sm text-gray-600">{calc.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
