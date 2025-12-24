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
    question: "What are business days?",
    answer: "Business days (also called working days or weekdays) are the days when most businesses operate, typically Monday through Friday. They exclude weekends (Saturday and Sunday) and may also exclude public holidays depending on your country or industry.",
    order: 1
  },
  {
    id: '2',
    question: "How do you calculate business days between two dates?",
    answer: "To calculate business days, count each day between the start and end dates, excluding Saturdays and Sundays. For more accurate calculations, you may also need to exclude public holidays specific to your country or region.",
    order: 2
  },
  {
    id: '3',
    question: "Are federal holidays included in business days?",
    answer: "Generally, federal holidays are NOT considered business days as most government offices and many businesses are closed. However, some industries may operate on holidays. This calculator excludes weekends but does not automatically exclude holidays.",
    order: 3
  },
  {
    id: '4',
    question: "How many business days are in a year?",
    answer: "In a typical year, there are approximately 260-262 business days (52 weeks × 5 weekdays). After accounting for major US federal holidays (about 10-11), you get roughly 250-252 working days. Leap years may add one more day.",
    order: 4
  },
  {
    id: '5',
    question: "What is the difference between calendar days and business days?",
    answer: "Calendar days include every day of the week (all 7 days), while business days only count weekdays (Monday-Friday). A period of 7 calendar days equals only 5 business days. This distinction is important for contracts, shipping, and legal deadlines.",
    order: 5
  },
  {
    id: '6',
    question: "Why do businesses use business days for deadlines?",
    answer: "Businesses use business days because they represent days when work can actually be performed. This provides more accurate timelines for processing, shipping, and completing tasks, as most employees only work Monday through Friday.",
    order: 6
  }
];

const relatedCalculators = [
  { href: "/us/tools/calculators/date-calculator", title: "Date Calculator", description: "Days between dates" },
  { href: "/us/tools/calculators/age-calculator", title: "Age Calculator", description: "Calculate exact age" },
  { href: "/us/tools/calculators/time-calculator", title: "Time Calculator", description: "Add/subtract time" },
  { href: "/us/tools/calculators/hours-calculator", title: "Hours Calculator", description: "Work hours tracking" },
  { href: "/us/tools/calculators/paycheck-calculator", title: "Paycheck Calculator", description: "Calculate earnings" },
  { href: "/us/tools/calculators/time-zone-calculator", title: "Time Zone", description: "Convert time zones" }
];

// US Federal Holidays for 2024-2025
const federalHolidays = [
  // 2024
  '2024-01-01', '2024-01-15', '2024-02-19', '2024-05-27', '2024-06-19',
  '2024-07-04', '2024-09-02', '2024-10-14', '2024-11-11', '2024-11-28', '2024-12-25',
  // 2025
  '2025-01-01', '2025-01-20', '2025-02-17', '2025-05-26', '2025-06-19',
  '2025-07-04', '2025-09-01', '2025-10-13', '2025-11-11', '2025-11-27', '2025-12-25',
];

export default function BusinessDaysCalculatorClient() {
  const { getH1, getSubHeading } = usePageSEO('business-days-calculator');

  const [mode, setMode] = useState<'between' | 'add' | 'subtract'>('between');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]);
  const [daysToAdd, setDaysToAdd] = useState(10);
  const [excludeHolidays, setExcludeHolidays] = useState(false);

  const [result, setResult] = useState({
    businessDays: 0,
    totalDays: 0,
    weekendDays: 0,
    holidays: 0,
    resultDate: ''
  });

  useEffect(() => {
    calculate();
  }, [startDate, endDate, daysToAdd, mode, excludeHolidays]);

  const isWeekend = (date: Date): boolean => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const isHoliday = (date: Date): boolean => {
    const dateStr = date.toISOString().split('T')[0];
    return federalHolidays.includes(dateStr);
  };

  const isBusinessDay = (date: Date): boolean => {
    if (isWeekend(date)) return false;
    if (excludeHolidays && isHoliday(date)) return false;
    return true;
  };

  const calculate = () => {
    if (mode === 'between') {
      const start = new Date(startDate);
      const end = new Date(endDate);
      let businessDays = 0;
      let totalDays = 0;
      let weekendDays = 0;
      let holidays = 0;

      const current = new Date(start);
      while (current <= end) {
        totalDays++;
        if (isWeekend(current)) {
          weekendDays++;
        } else if (excludeHolidays && isHoliday(current)) {
          holidays++;
        } else {
          businessDays++;
        }
        current.setDate(current.getDate() + 1);
      }

      setResult({ businessDays, totalDays, weekendDays, holidays, resultDate: '' });
    } else {
      const start = new Date(startDate);
      let remaining = Math.abs(daysToAdd);
      const direction = mode === 'add' ? 1 : -1;
      const current = new Date(start);

      while (remaining > 0) {
        current.setDate(current.getDate() + direction);
        if (isBusinessDay(current)) {
          remaining--;
        }
      }

      setResult({
        businessDays: Math.abs(daysToAdd),
        totalDays: Math.abs(Math.round((current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))),
        weekendDays: 0,
        holidays: 0,
        resultDate: current.toISOString().split('T')[0]
      });
    }
  };

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": "Business Days Calculator",
        "description": "Calculate working days between two dates or add/subtract business days from a date. Excludes weekends and optionally US federal holidays.",
        "url": "https://economictimes.indiatimes.com/us/tools/calculators/business-days-calculator",
        "applicationCategory": "BusinessApplication",
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
            "name": "Business Days Calculator",
            "item": "https://economictimes.indiatimes.com/us/tools/calculators/business-days-calculator"
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

      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{getH1('Business Days Calculator')}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Calculate working days between two dates or find a date by adding/subtracting business days. Excludes weekends and optionally US federal holidays.
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Mode Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          <div className="flex gap-2 mb-3 sm:mb-4 md:mb-6">
            <button
              onClick={() => setMode('between')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                mode === 'between'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Days Between Dates
            </button>
            <button
              onClick={() => setMode('add')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                mode === 'add'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Add Business Days
            </button>
            <button
              onClick={() => setMode('subtract')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                mode === 'subtract'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Subtract Business Days
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
            {/* Input Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {mode === 'between' ? 'Start Date' : 'Starting Date'}
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {mode === 'between' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Days to {mode === 'add' ? 'Add' : 'Subtract'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={daysToAdd}
                    onChange={(e) => setDaysToAdd(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="excludeHolidays"
                  checked={excludeHolidays}
                  onChange={(e) => setExcludeHolidays(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="excludeHolidays" className="text-sm text-gray-700">
                  Exclude US Federal Holidays
                </label>
              </div>
            </div>

            {/* Results Section */}
            <div>
              {mode === 'between' ? (
                <div className="space-y-3">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-3 sm:p-4 md:p-6 text-white text-center">
                    <div className="text-5xl font-bold">{result.businessDays}</div>
                    <div className="text-green-100 mt-1">Business Days</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-blue-600">{result.totalDays}</div>
                      <div className="text-xs text-blue-700">Total Days</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-purple-600">{result.weekendDays}</div>
                      <div className="text-xs text-purple-700">Weekend Days</div>
                    </div>
                    {excludeHolidays && (
                      <div className="bg-orange-50 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-orange-600">{result.holidays}</div>
                        <div className="text-xs text-orange-700">Holidays</div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-3 sm:p-4 md:p-6 text-white">
                  <div className="text-center mb-4">
                    <div className="text-sm text-blue-100 mb-1">Result Date</div>
                    <div className="text-2xl font-bold">{formatDate(result.resultDate)}</div>
                  </div>
                  <div className="text-center pt-4 border-t border-blue-400">
                    <div className="text-sm text-blue-100">
                      {result.businessDays} business days ({result.totalDays} calendar days) {mode === 'add' ? 'after' : 'before'} start date
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />


        {/* Quick Reference */}

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQs Section - Firebase Powered */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="business-days-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
{/* Related Calculators */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Related Calculators</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {relatedCalculators.map((calc) => (
              <Link key={calc.href} href={calc.href} className="group">
                <div className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 text-sm mb-1">
                    {calc.title}
                  </h3>
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
