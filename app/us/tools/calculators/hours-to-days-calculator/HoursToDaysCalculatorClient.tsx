'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';

const fallbackFaqs = [
  {
    id: '1',
    question: "How many days is 24 hours?",
    answer: "24 hours equals exactly 1 day. This is because a day is defined as the time it takes for Earth to complete one full rotation on its axis, which is 24 hours. However, this can vary slightly in context: a calendar day is midnight to midnight (24 hours), a solar day accounts for Earth's orbital movement (24 hours and ~4 minutes on average), and a business day typically means 8-10 working hours, not a full 24-hour period.",
    order: 1
  },
  {
    id: '2',
    question: "How do I convert hours to days?",
    answer: "To convert hours to days, divide the number of hours by 24. Formula: Days = Hours ÷ 24. For example: 48 hours ÷ 24 = 2 days, 72 hours ÷ 24 = 3 days, 36 hours ÷ 24 = 1.5 days. For partial days, multiply the decimal by 24 to get remaining hours. Example: 30 hours = 1.25 days = 1 day and 6 hours (0.25 × 24 = 6 hours).",
    order: 2
  },
  {
    id: '3',
    question: "How many hours are in a work week?",
    answer: "A standard full-time work week in the United States is 40 hours (5 days × 8 hours per day). This has been the norm since the Fair Labor Standards Act of 1938. However, actual work weeks vary: part-time employment is typically 20-35 hours, some professions work 50-60 hours regularly, European countries often have 35-37.5 hour work weeks, and shift workers may work compressed schedules like 4 days of 10 hours (40 hours total).",
    order: 3
  },
  {
    id: '4',
    question: "How many hours in 3 days?",
    answer: "There are 72 hours in 3 days. Calculation: 3 days × 24 hours/day = 72 hours. This applies to consecutive 24-hour periods. However, '3 business days' may mean something different depending on context—it could mean 3 working days (typically 24-30 hours depending on whether it's 8 or 10-hour shifts) or 72 hours of elapsed calendar time including nights and weekends.",
    order: 4
  },
  {
    id: '5',
    question: "Why isn't a day exactly 24 hours?",
    answer: "A day isn't precisely 24 hours due to Earth's orbital dynamics. A sidereal day (one complete rotation relative to distant stars) is 23 hours, 56 minutes, and 4 seconds. However, because Earth also orbits the Sun, a solar day (noon to noon, the time for the Sun to return to the same position in the sky) is about 24 hours. Even this varies throughout the year by up to 16 minutes due to Earth's elliptical orbit and axial tilt. To maintain consistency, we use mean solar time, averaging these variations into exactly 24 hours. Additionally, Earth's rotation is gradually slowing (by about 1.7 milliseconds per century), which is why we occasionally add leap seconds to our atomic clocks.",
    order: 5
  },
  {
    id: '6',
    question: "How many hours should I work per week?",
    answer: "The optimal work hours depend on individual goals, industry, and life circumstances. Research on productivity and health suggests: 40 hours/week is the traditional standard providing balanced productivity without excessive burnout. 35-40 hours appears optimal for knowledge workers—studies show productivity per hour decreases significantly beyond 50 hours weekly. Some countries (Netherlands, Denmark) average 30-35 hour weeks with high productivity. Working consistently over 55 hours/week increases health risks (cardiovascular disease, stroke, mental health issues) and actually reduces overall output due to errors and decreased cognitive function. For optimal results: limit to 40-50 hours for sustained periods, take regular breaks, prioritize sleep and recovery, and remember that time worked doesn't equal value created—focused deep work in fewer hours often outperforms longer unfocused hours.",
    order: 6
  }
];

export default function HoursToDaysCalculatorClient() {
  const [hours, setHours] = useState(48);
  const [results, setResults] = useState<any>(null);

  const calculateDays = () => {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    const decimalDays = hours / 24;
    const weeks = Math.floor(hours / 168); // 24 * 7
    const months = hours / 730; // approximate 30.4 days average
    const years = hours / 8760; // 24 * 365

    setResults({
      days,
      remainingHours,
      decimalDays: decimalDays.toFixed(2),
      weeks,
      months: months.toFixed(2),
      years: years.toFixed(3),
      totalMinutes: hours * 60,
      totalSeconds: hours * 3600
    });
  };

  useEffect(() => {
    if (hours >= 0) {
      calculateDays();
    }
  }, [hours]);

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Hours to Days Calculator</h1>
        <p className="text-lg text-gray-600">Convert hours to days, weeks, months, and other time units</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Enter Hours</h2>

          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Hours</label>
              <input
                type="number"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                min="0"
                step="1"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="range"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                min="0"
                max="720"
                step="1"
                className="w-full mt-2"
              />
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Common Time Periods</h4>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setHours(24)} className="text-sm bg-white border rounded px-2 py-1 hover:bg-blue-100">1 Day (24h)</button>
                <button onClick={() => setHours(48)} className="text-sm bg-white border rounded px-2 py-1 hover:bg-blue-100">2 Days (48h)</button>
                <button onClick={() => setHours(72)} className="text-sm bg-white border rounded px-2 py-1 hover:bg-blue-100">3 Days (72h)</button>
                <button onClick={() => setHours(168)} className="text-sm bg-white border rounded px-2 py-1 hover:bg-blue-100">1 Week (168h)</button>
              </div>
            </div>
          </div>
        </div>

        {results && (
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Conversion Results</h3>

              <div className="space-y-4">
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
                  <div className="text-sm text-green-700">Days</div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">{results.days} days, {results.remainingHours} hours</div>
                  <div className="text-sm text-green-600 mt-1">{results.decimalDays} days (decimal)</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-sm text-blue-700">Weeks</div>
                    <div className="text-xl font-bold text-blue-600">{results.weeks}</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <div className="text-sm text-purple-700">Months</div>
                    <div className="text-xl font-bold text-purple-600">{results.months}</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Other Units</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Years:</span>
                      <span className="font-semibold">{results.years}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Minutes:</span>
                      <span className="font-semibold">{results.totalMinutes.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Seconds:</span>
                      <span className="font-semibold">{results.totalSeconds.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 rounded-xl p-3 sm:p-4 md:p-6">
              <h4 className="font-semibold text-orange-800 mb-3">Quick Reference</h4>
              <ul className="text-sm text-orange-700 space-y-2">
                <li>• 1 day = 24 hours</li>
                <li>• 1 week = 168 hours</li>
                <li>• 1 month ≈ 730 hours</li>
                <li>• 1 year = 8,760 hours</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mt-8 mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Time Calculators</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { href: "/us/tools/calculators/age-calculator", title: "Age Calculator", description: "Calculate your age", color: "bg-blue-500" },
            { href: "/us/tools/calculators/date-calculator", title: "Date Calculator", description: "Add or subtract dates", color: "bg-green-500" },
            { href: "/us/tools/calculators/time-calculator", title: "Time Calculator", description: "Add or subtract time", color: "bg-purple-500" },
            { href: "/us/tools/calculators/work-hours-calculator", title: "Work Hours Calculator", description: "Calculate work time", color: "bg-orange-500" },
          ].map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <div className={`w-10 h-10 ${calc.color} rounded-lg flex items-center justify-center mb-3`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 text-sm group-hover:text-blue-600 transition-colors mb-1">{calc.title}</h3>
                <p className="text-xs text-gray-500">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Understanding Hours to Days Conversion</h2>
        <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
          Converting hours to days is a fundamental time calculation used in project planning, work scheduling, travel time estimation, and understanding time-based data. Whether you&apos;re calculating how many days a certain number of work hours represents, or determining elapsed time for a project, this conversion helps put time measurements into perspective.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-2 text-sm">Basic Conversion</h3>
            <p className="text-xs text-gray-600">
              Divide hours by 24 to get days. For example, 96 hours ÷ 24 = 4 days. Simple and straightforward for whole day calculations.
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <h3 className="font-semibold text-green-800 mb-2 text-sm">Practical Applications</h3>
            <p className="text-xs text-gray-600">
              Project management, work time tracking, deadline calculations, and understanding time commitments in a more relatable unit.
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <h3 className="font-semibold text-purple-800 mb-2 text-sm">Context Matters</h3>
            <p className="text-xs text-gray-600">
              Remember that &apos;3 business days&apos; differs from &apos;72 hours&apos;. Always clarify whether you mean calendar days or business days.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQs Section */}
      <FirebaseFAQs pageId="hours-to-days-calculator" fallbackFaqs={fallbackFaqs} />

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 text-2xl">⚠️</div>
          <div>
            <h3 className="text-sm font-semibold text-amber-800 mb-1">Important Note</h3>
            <p className="text-xs sm:text-sm text-amber-700">
              This calculator uses the standard conversion of 24 hours per day. For business applications, remember that &quot;days&quot; may refer to business days (typically 8-10 working hours) rather than full 24-hour periods. Always clarify the context when communicating time estimates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
