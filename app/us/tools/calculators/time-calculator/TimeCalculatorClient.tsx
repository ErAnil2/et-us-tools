'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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

import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
const fallbackFaqs = [
  {
    id: '1',
    question: "How do I add or subtract times?",
    answer: "Enter the first time in hours, minutes, and seconds. Select either 'Add' or 'Subtract' operation, then enter the second time. The calculator will instantly show the result in HH:MM:SS format, along with total hours, minutes, and seconds.",
    order: 1
  },
  {
    id: '2',
    question: "Can this calculator handle times greater than 24 hours?",
    answer: "Yes! Unlike a regular clock, this calculator can handle durations that exceed 24 hours. If you add 20 hours and 10 hours, you'll get 30 hours displayed correctly as 30:00:00.",
    order: 2
  },
  {
    id: '3',
    question: "What happens if I subtract a larger time from a smaller time?",
    answer: "The calculator will return 00:00:00 (zero) if the second time is larger than the first. This prevents negative time values which don't make sense in most practical applications.",
    order: 3
  },
  {
    id: '4',
    question: "How do I calculate total work hours for a week?",
    answer: "You can add multiple time periods sequentially. First add two times, note the result, then use that result as the first time and add the next time period. Alternatively, convert all times to minutes, add them, then convert back to hours.",
    order: 4
  },
  {
    id: '5',
    question: "How do I convert decimal hours to hours and minutes?",
    answer: "To convert decimal hours (like 2.5 hours) to hours and minutes: The whole number is hours (2), multiply the decimal by 60 to get minutes (0.5 × 60 = 30 minutes). So 2.5 hours = 2 hours 30 minutes.",
    order: 5
  },
  {
    id: '6',
    question: "What's the difference between elapsed time and clock time?",
    answer: "Elapsed time is the duration between two events (e.g., 3 hours 45 minutes), while clock time refers to a specific point in time (e.g., 3:45 PM). This calculator works with elapsed time/durations, not clock times.",
    order: 6
  }
];

const relatedCalculators = [
  { href: '/us/tools/calculators/hours-calculator', title: 'Hours Calculator', description: 'Calculate work hours' },
  { href: '/us/tools/calculators/time-until-calculator', title: 'Time Until', description: 'Countdown to events' },
  { href: '/us/tools/calculators/date-calculator', title: 'Date Calculator', description: 'Add/subtract dates' },
  { href: '/us/tools/calculators/age-calculator', title: 'Age Calculator', description: 'Calculate exact age' },
  { href: '/us/tools/calculators/time-zone-calculator', title: 'Time Zone', description: 'Convert time zones' },
  { href: '/us/tools/calculators/overtime-calculator', title: 'Overtime Calculator', description: 'Calculate overtime pay' },
];

const timeConversions = [
  { unit: '1 Hour', seconds: 3600, minutes: 60, hours: 1, decimal: '1.00' },
  { unit: '30 Minutes', seconds: 1800, minutes: 30, hours: 0.5, decimal: '0.50' },
  { unit: '15 Minutes', seconds: 900, minutes: 15, hours: 0.25, decimal: '0.25' },
  { unit: '45 Minutes', seconds: 2700, minutes: 45, hours: 0.75, decimal: '0.75' },
  { unit: '90 Minutes', seconds: 5400, minutes: 90, hours: 1.5, decimal: '1.50' },
  { unit: '2 Hours', seconds: 7200, minutes: 120, hours: 2, decimal: '2.00' },
];

export default function TimeCalculatorClient() {
  const { getH1, getSubHeading } = usePageSEO('time-calculator');

  const [hours1, setHours1] = useState<number>(1);
  const [minutes1, setMinutes1] = useState<number>(30);
  const [seconds1, setSeconds1] = useState<number>(0);
  const [hours2, setHours2] = useState<number>(0);
  const [minutes2, setMinutes2] = useState<number>(45);
  const [seconds2, setSeconds2] = useState<number>(0);
  const [operation, setOperation] = useState<'add' | 'subtract'>('add');

  const [result, setResult] = useState({
    timeResult: '02:15:00',
    totalHours: '2.25',
    totalMinutes: '135',
    totalSeconds: '8100',
    days: '0',
    weeks: '0'
  });

  const timeToSeconds = (hours: number, minutes: number, seconds: number) => {
    return (hours * 3600) + (minutes * 60) + seconds;
  };

  const secondsToTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { hours, minutes, seconds };
  };

  const padNumber = (num: number) => {
    return num.toString().padStart(2, '0');
  };

  const calculateTime = () => {
    const time1Seconds = timeToSeconds(hours1, minutes1, seconds1);
    const time2Seconds = timeToSeconds(hours2, minutes2, seconds2);

    let resultSeconds: number;
    if (operation === 'add') {
      resultSeconds = time1Seconds + time2Seconds;
    } else {
      resultSeconds = Math.max(0, time1Seconds - time2Seconds);
    }

    const resultTime = secondsToTime(resultSeconds);
    const totalHoursNum = resultSeconds / 3600;
    const daysNum = totalHoursNum / 24;
    const weeksNum = daysNum / 7;

    setResult({
      timeResult: `${padNumber(resultTime.hours)}:${padNumber(resultTime.minutes)}:${padNumber(resultTime.seconds)}`,
      totalHours: totalHoursNum.toFixed(2),
      totalMinutes: (resultSeconds / 60).toFixed(2),
      totalSeconds: resultSeconds.toString(),
      days: daysNum.toFixed(2),
      weeks: weeksNum.toFixed(3)
    });
  };

  useEffect(() => {
    calculateTime();
  }, [hours1, minutes1, seconds1, hours2, minutes2, seconds2, operation]);

  const setPreset = (h1: number, m1: number, s1: number, h2: number, m2: number, s2: number, op: 'add' | 'subtract') => {
    setHours1(h1);
    setMinutes1(m1);
    setSeconds1(s1);
    setHours2(h2);
    setMinutes2(m2);
    setSeconds2(s2);
    setOperation(op);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Time Calculator",
          "description": "Free online time calculator to add and subtract hours, minutes, and seconds. Calculate time differences, work hours, and convert between time formats.",
          "url": "https://www.example.com/us/tools/calculators/time-calculator",
          "applicationCategory": "UtilityApplication",
          "operatingSystem": "Any",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "featureList": [
            "Add times together",
            "Subtract time durations",
            "Convert to decimal hours",
            "Multiple time format outputs"
          ]
        })
      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
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
      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.example.com" },
            { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://www.example.com/us/tools" },
            { "@type": "ListItem", "position": 3, "name": "Calculators", "item": "https://www.example.com/us/tools/calculators" },
            { "@type": "ListItem", "position": 4, "name": "Time Calculator", "item": "https://www.example.com/us/tools/calculators/time-calculator" }
          ]
        })
      }} />

      <div className="max-w-[1180px] mx-auto px-4 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Time Calculator')}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Add or subtract time durations with ease. Calculate time differences, work hours, and convert between different time formats instantly.</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Main Calculator Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className="grid lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8">
            {/* Input Section */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-6">
              {/* First Time */}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">First Time</label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Hours</label>
                    <input
                      type="number"
                      value={hours1}
                      min={0}
                      onChange={(e) => setHours1(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 text-xl font-bold text-center border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Minutes</label>
                    <input
                      type="number"
                      value={minutes1}
                      min={0}
                      max={59}
                      onChange={(e) => setMinutes1(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 text-xl font-bold text-center border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Seconds</label>
                    <input
                      type="number"
                      value={seconds1}
                      min={0}
                      max={59}
                      onChange={(e) => setSeconds1(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 text-xl font-bold text-center border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Operation Toggle */}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">Operation</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setOperation('add')}
                    className={`py-4 rounded-lg font-bold text-lg transition-all ${
                      operation === 'add'
                        ? 'bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-2'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-2 border-blue-200'
                    }`}
                  >
                    + Add Times
                  </button>
                  <button
                    onClick={() => setOperation('subtract')}
                    className={`py-4 rounded-lg font-bold text-lg transition-all ${
                      operation === 'subtract'
                        ? 'bg-orange-600 text-white ring-2 ring-orange-600 ring-offset-2'
                        : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border-2 border-orange-200'
                    }`}
                  >
                    - Subtract Times
                  </button>
                </div>
              </div>

              {/* Second Time */}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">Second Time</label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Hours</label>
                    <input
                      type="number"
                      value={hours2}
                      min={0}
                      onChange={(e) => setHours2(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 text-xl font-bold text-center border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Minutes</label>
                    <input
                      type="number"
                      value={minutes2}
                      min={0}
                      max={59}
                      onChange={(e) => setMinutes2(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 text-xl font-bold text-center border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Seconds</label>
                    <input
                      type="number"
                      value={seconds2}
                      min={0}
                      max={59}
                      onChange={(e) => setSeconds2(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 text-xl font-bold text-center border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Presets */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Quick Examples:</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setPreset(8, 0, 0, 1, 30, 0, 'add')}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                  >
                    8h + 1h30m
                  </button>
                  <button
                    onClick={() => setPreset(2, 30, 0, 1, 45, 0, 'add')}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                  >
                    2h30m + 1h45m
                  </button>
                  <button
                    onClick={() => setPreset(5, 0, 0, 2, 30, 0, 'subtract')}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                  >
                    5h - 2h30m
                  </button>
                  <button
                    onClick={() => setPreset(1, 0, 0, 0, 45, 30, 'subtract')}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                  >
                    1h - 45m30s
                  </button>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-3 sm:p-4 md:p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Result</h3>

              {/* Main Result */}
              <div className="bg-white rounded-lg p-5 mb-4 text-center shadow-sm">
                <span className="text-sm text-gray-600 block mb-1">
                  {operation === 'add' ? 'Sum' : 'Difference'}
                </span>
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600">{result.timeResult}</span>
                <span className="text-sm text-gray-500 block mt-1">HH:MM:SS</span>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-white rounded-lg p-3">
                  <span className="text-gray-600">Decimal Hours</span>
                  <span className="font-bold text-gray-800">{result.totalHours} hrs</span>
                </div>
                <div className="flex justify-between items-center bg-white rounded-lg p-3">
                  <span className="text-gray-600">Total Minutes</span>
                  <span className="font-bold text-gray-800">{result.totalMinutes} min</span>
                </div>
                <div className="flex justify-between items-center bg-white rounded-lg p-3">
                  <span className="text-gray-600">Total Seconds</span>
                  <span className="font-bold text-gray-800">{result.totalSeconds} sec</span>
                </div>
                <div className="flex justify-between items-center bg-white rounded-lg p-3">
                  <span className="text-gray-600">Days</span>
                  <span className="font-bold text-gray-800">{result.days}</span>
                </div>
                <div className="flex justify-between items-center bg-white rounded-lg p-3">
                  <span className="text-gray-600">Weeks</span>
                  <span className="font-bold text-gray-800">{result.weeks}</span>
                </div>
              </div>

              {/* Formula Display */}
              <div className="mt-4 p-3 bg-blue-900 rounded-lg text-center">
                <span className="text-blue-100 text-sm">
                  {padNumber(hours1)}:{padNumber(minutes1)}:{padNumber(seconds1)} {operation === 'add' ? '+' : '-'} {padNumber(hours2)}:{padNumber(minutes2)}:{padNumber(seconds2)} = {result.timeResult}
                </span>
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
          <FirebaseFAQs pageId="time-calculator" fallbackFaqs={fallbackFaqs} />
        </div>

        {/* Time Formulas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Time Conversion Formulas</h2>
          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-3">Convert to Seconds</h3>
              <div className="font-mono text-sm text-blue-700 space-y-1">
                <p>Total Seconds = (Hours × 3600) + (Minutes × 60) + Seconds</p>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-5 border border-green-200">
              <h3 className="font-semibold text-green-800 mb-3">Convert to Decimal Hours</h3>
              <div className="font-mono text-sm text-green-700 space-y-1">
                <p>Decimal Hours = Hours + (Minutes / 60) + (Seconds / 3600)</p>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-5 border border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-3">Seconds to HH:MM:SS</h3>
              <div className="font-mono text-sm text-purple-700 space-y-1">
                <p>Hours = floor(Seconds / 3600)</p>
                <p>Minutes = floor((Seconds % 3600) / 60)</p>
                <p>Seconds = Seconds % 60</p>
              </div>
            </div>
            <div className="bg-orange-50 rounded-lg p-5 border border-orange-200">
              <h3 className="font-semibold text-orange-800 mb-3">Decimal to Minutes</h3>
              <div className="font-mono text-sm text-orange-700 space-y-1">
                <p>Minutes = Decimal Part × 60</p>
                <p>Example: 2.5 hours → 0.5 × 60 = 30 minutes</p>
              </div>
            </div>
          </div>
        </div>
{/* Related Calculators */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-5 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {relatedCalculators.map((calc) => (
              <Link key={calc.href} href={calc.href} className="group">
                <div className="rounded-lg p-4 bg-gray-50 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600">{calc.title}</h3>
                  <p className="text-xs text-gray-600">{calc.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
