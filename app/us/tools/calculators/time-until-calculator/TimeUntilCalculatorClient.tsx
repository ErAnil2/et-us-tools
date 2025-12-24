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
const fallbackFaqs = [
  {
    id: '1',
    question: "How accurate is the countdown timer?",
    answer: "The countdown updates every second and is accurate to the second. It uses your device's local time to calculate the remaining time until your target date and time.",
    order: 1
  },
  {
    id: '2',
    question: "Can I count down to a specific time, not just a date?",
    answer: "Yes! You can set both the date and time for your countdown. Simply select the target date and enter the specific time (hour and minute) when you want the countdown to end.",
    order: 2
  },
  {
    id: '3',
    question: "What happens when the countdown reaches zero?",
    answer: "When the target date and time is reached, the calculator will display 'Event has passed!' and show that the countdown is complete. The timer will stop updating.",
    order: 3
  },
  {
    id: '4',
    question: "How are working days calculated?",
    answer: "Working days are calculated by assuming a 5-day work week (Monday to Friday). The formula estimates working days as approximately 5/7 of the total days remaining.",
    order: 4
  },
  {
    id: '5',
    question: "Why does the months calculation seem approximate?",
    answer: "Months are calculated using an average of 30 days per month. Since actual months vary from 28 to 31 days, this is an approximation. For precise month calculations, use our Date Calculator.",
    order: 5
  },
  {
    id: '6',
    question: "Can I share my countdown with others?",
    answer: "Currently, the countdown is calculated locally on your device. You can share the target date and time with others, and they can set up the same countdown on their devices.",
    order: 6
  }
];

const relatedCalculators = [
  { href: '/us/tools/calculators/time-calculator', title: 'Time Calculator', description: 'Add/subtract times' },
  { href: '/us/tools/calculators/date-calculator', title: 'Date Calculator', description: 'Calculate date differences' },
  { href: '/us/tools/calculators/age-calculator', title: 'Age Calculator', description: 'Calculate exact age' },
  { href: '/us/tools/calculators/days-between-dates-calculator', title: 'Days Between Dates', description: 'Count days between dates' },
  { href: '/us/tools/calculators/hours-calculator', title: 'Hours Calculator', description: 'Calculate work hours' },
  { href: '/us/tools/calculators/time-zone-calculator', title: 'Time Zone', description: 'Convert time zones' },
];

const upcomingHolidays = [
  { name: "New Year's Day", date: "January 1", icon: "🎉" },
  { name: "Valentine's Day", date: "February 14", icon: "💕" },
  { name: "Easter", date: "March/April", icon: "🐰" },
  { name: "Independence Day", date: "July 4", icon: "🇺🇸" },
  { name: "Halloween", date: "October 31", icon: "🎃" },
  { name: "Thanksgiving", date: "November", icon: "🦃" },
  { name: "Christmas", date: "December 25", icon: "🎄" },
  { name: "New Year's Eve", date: "December 31", icon: "🥂" },
];

export default function TimeUntilCalculatorClient() {
  const { getH1, getSubHeading } = usePageSEO('time-until-calculator');

  const [targetDate, setTargetDate] = useState<string>('');
  const [targetTime, setTargetTime] = useState<string>('00:00');
  const [eventName, setEventName] = useState<string>('New Year 2026');
  const [currentDateTime, setCurrentDateTime] = useState<string>('');

  const [countdown, setCountdown] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0,
    totalHours: 0,
    totalMinutes: 0,
    totalSeconds: 0,
    totalWeeks: 0,
    workingDays: 0,
    liveCountdown: '0d 0h 0m 0s',
    isPast: false,
    yearProgress: 0
  });

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTimeForInput = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const getNextWeekend = () => {
    const now = new Date();
    const daysUntilSaturday = (6 - now.getDay()) % 7 || 7;
    const saturday = new Date(now.getTime() + daysUntilSaturday * 24 * 60 * 60 * 1000);
    saturday.setHours(0, 0, 0, 0);
    return saturday;
  };

  const applyDatePreset = (type: string) => {
    const now = new Date();
    let date: Date;
    let name = '';

    switch(type) {
      case 'newYear':
        date = new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0);
        name = `New Year ${date.getFullYear()}`;
        break;
      case 'christmas':
        date = new Date(now.getFullYear(), 11, 25, 0, 0, 0);
        if (date < now) {
          date = new Date(now.getFullYear() + 1, 11, 25, 0, 0, 0);
        }
        name = `Christmas ${date.getFullYear()}`;
        break;
      case 'halloween':
        date = new Date(now.getFullYear(), 9, 31, 0, 0, 0);
        if (date < now) {
          date = new Date(now.getFullYear() + 1, 9, 31, 0, 0, 0);
        }
        name = `Halloween ${date.getFullYear()}`;
        break;
      case 'valentines':
        date = new Date(now.getFullYear(), 1, 14, 0, 0, 0);
        if (date < now) {
          date = new Date(now.getFullYear() + 1, 1, 14, 0, 0, 0);
        }
        name = `Valentine's Day ${date.getFullYear()}`;
        break;
      case 'weekend':
        date = getNextWeekend();
        name = 'Next Weekend';
        break;
      case 'custom':
      default:
        date = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        name = 'One Month From Now';
        break;
    }

    setTargetDate(formatDateForInput(date));
    setTargetTime(formatTimeForInput(date));
    setEventName(name);
  };

  const updateCurrentDateTime = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    setCurrentDateTime(now.toLocaleDateString('en-US', options));
  };

  const calculateTimeUntil = () => {
    if (!targetDate) {
      return;
    }

    const targetDateTime = new Date(`${targetDate}T${targetTime || '00:00'}`);
    const now = new Date();
    const diffMs = targetDateTime.getTime() - now.getTime();

    if (diffMs <= 0) {
      setCountdown(prev => ({
        ...prev,
        liveCountdown: 'Event has passed!',
        isPast: true
      }));
      return;
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
    const totalWeeks = Math.floor(totalDays / 7);

    const years = Math.floor(totalDays / 365);
    const months = Math.floor((totalDays % 365) / 30);
    const days = totalDays % 30;
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;

    const workingDays = Math.floor(totalDays * 5 / 7);

    const countdownText = totalDays > 0
      ? `${totalDays}d ${hours}h ${minutes}m ${seconds}s`
      : `${hours}h ${minutes}m ${seconds}s`;

    // Year progress
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const yearEnd = new Date(now.getFullYear() + 1, 0, 1);
    const yearProgress = ((now.getTime() - yearStart.getTime()) / (yearEnd.getTime() - yearStart.getTime())) * 100;

    setCountdown({
      years,
      months,
      days,
      hours,
      minutes,
      seconds,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
      totalWeeks,
      workingDays,
      liveCountdown: countdownText,
      isPast: false,
      yearProgress
    });
  };

  // Initialize on mount
  useEffect(() => {
    updateCurrentDateTime();
    applyDatePreset('newYear');
  }, []);

  // Update countdown every second
  useEffect(() => {
    const interval = setInterval(() => {
      updateCurrentDateTime();
      calculateTimeUntil();
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, targetTime]);

  // Calculate when date/time changes
  useEffect(() => {
    calculateTimeUntil();
  }, [targetDate, targetTime]);

  const heartbeats = countdown.totalMinutes * 70;
  const breaths = countdown.totalMinutes * 16;
  const earthRotations = countdown.totalDays;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Time Until Calculator",
          "description": "Free online countdown timer to calculate exact time remaining until any future date. Count down to holidays, birthdays, vacations, and special events.",
          "url": "https://www.example.com/us/tools/calculators/time-until-calculator",
          "applicationCategory": "UtilityApplication",
          "operatingSystem": "Any",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "featureList": [
            "Live countdown timer",
            "Multiple time unit displays",
            "Holiday presets",
            "Working days calculation"
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
            { "@type": "ListItem", "position": 4, "name": "Time Until Calculator", "item": "https://www.example.com/us/tools/calculators/time-until-calculator" }
          ]
        })
      }} />

      <div className="max-w-[1180px] mx-auto px-4 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Time Until Calculator')}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Calculate the exact time remaining until any future date. Perfect for counting down to holidays, birthdays, vacations, deadlines, or special events.</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Main Calculator Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className="grid lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8">
            {/* Input Section */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-6">
              {/* Target Date and Time */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Target Date & Time</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                    <input
                      type="time"
                      value={targetTime}
                      onChange={(e) => setTargetTime(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Event Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Name (Optional)</label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="e.g., Birthday, Vacation, Holiday"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              {/* Quick Presets */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Quick Presets</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  <button
                    onClick={() => applyDatePreset('newYear')}
                    className="px-3 py-3 text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <div className="text-xl mb-1">🎉</div>
                    <div className="font-semibold text-xs">New Year</div>
                  </button>
                  <button
                    onClick={() => applyDatePreset('valentines')}
                    className="px-3 py-3 text-sm bg-pink-50 text-pink-700 border border-pink-200 rounded-lg hover:bg-pink-100 transition-colors"
                  >
                    <div className="text-xl mb-1">💕</div>
                    <div className="font-semibold text-xs">Valentine&apos;s</div>
                  </button>
                  <button
                    onClick={() => applyDatePreset('halloween')}
                    className="px-3 py-3 text-sm bg-orange-50 text-orange-700 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
                  >
                    <div className="text-xl mb-1">🎃</div>
                    <div className="font-semibold text-xs">Halloween</div>
                  </button>
                  <button
                    onClick={() => applyDatePreset('christmas')}
                    className="px-3 py-3 text-sm bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <div className="text-xl mb-1">🎄</div>
                    <div className="font-semibold text-xs">Christmas</div>
                  </button>
                  <button
                    onClick={() => applyDatePreset('weekend')}
                    className="px-3 py-3 text-sm bg-purple-50 text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <div className="text-xl mb-1">🌴</div>
                    <div className="font-semibold text-xs">Weekend</div>
                  </button>
                  <button
                    onClick={() => applyDatePreset('custom')}
                    className="px-3 py-3 text-sm bg-gray-50 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="text-xl mb-1">📅</div>
                    <div className="font-semibold text-xs">+30 Days</div>
                  </button>
                </div>
              </div>

              {/* Current Date & Time */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
                <div className="text-sm font-medium text-indigo-700 mb-1">Current Date & Time:</div>
                <div className="text-lg font-semibold text-indigo-900">{currentDateTime}</div>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-4">

      <div>
                <h2 className="text-xl font-bold text-gray-800 mb-1">Time Remaining</h2>
                <div className="text-sm text-gray-600">Until {eventName}</div>
              </div>

              {/* Live Countdown */}
              <div className={`rounded-xl p-6 text-center text-white ${countdown.isPast ? 'bg-gradient-to-r from-gray-500 to-gray-600' : 'bg-gradient-to-r from-purple-500 to-pink-600'}`}>
                <div className="text-sm opacity-90 mb-1">Live Countdown</div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold">{countdown.liveCountdown}</div>
              </div>

              {/* Detailed Breakdown */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="text-sm font-semibold text-blue-800 mb-3">Detailed Breakdown</div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white rounded-lg p-2">
                    <div className="text-2xl font-bold text-blue-700">{countdown.years}</div>
                    <div className="text-xs text-blue-600">Years</div>
                  </div>
                  <div className="bg-white rounded-lg p-2">
                    <div className="text-2xl font-bold text-blue-700">{countdown.months}</div>
                    <div className="text-xs text-blue-600">Months</div>
                  </div>
<div className="bg-white rounded-lg p-2">
                    <div className="text-2xl font-bold text-blue-700">{countdown.days}</div>
                    <div className="text-xs text-blue-600">Days</div>
                  </div>
                  <div className="bg-white rounded-lg p-2">
                    <div className="text-2xl font-bold text-purple-700">{countdown.hours}</div>
                    <div className="text-xs text-purple-600">Hours</div>
                  </div>
                  <div className="bg-white rounded-lg p-2">
                    <div className="text-2xl font-bold text-purple-700">{countdown.minutes}</div>
                    <div className="text-xs text-purple-600">Minutes</div>
                  </div>
                  <div className="bg-white rounded-lg p-2">
                    <div className="text-2xl font-bold text-purple-700">{countdown.seconds}</div>
                    <div className="text-xs text-purple-600">Seconds</div>
                  </div>
                </div>
              </div>

              {/* Total Units */}
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="text-sm font-semibold text-green-800 mb-3">Total Time</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-700">Total Weeks:</span>
                    <span className="font-bold text-green-800">{formatNumber(countdown.totalWeeks)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Total Days:</span>
                    <span className="font-bold text-green-800">{formatNumber(countdown.totalDays)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Total Hours:</span>
                    <span className="font-bold text-green-800">{formatNumber(countdown.totalHours)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Working Days:</span>
                    <span className="font-bold text-green-800">{formatNumber(countdown.workingDays)}</span>
                  </div>
                </div>
              </div>

              {/* Year Progress */}
              <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                <div className="text-sm font-semibold text-orange-800 mb-2">Year Progress</div>
                <div className="w-full bg-orange-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-amber-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${countdown.yearProgress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-orange-700 mt-2">{countdown.yearProgress.toFixed(1)}% of year completed</div>
              </div>
            </div>
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

        {/* Fun Facts Section */}
        {/* Mobile MREC2 - Before FAQs */}

        <CalculatorMobileMrec2 />


        {/* FAQs Section - Firebase Powered */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="time-until-calculator" fallbackFaqs={fallbackFaqs} />
      </div>

        {/* How It Works */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">How the Time Until Calculator Works</h2>
          <div className="grid md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Select Date</h3>
              <p className="text-sm text-gray-600">Choose your target date using the date picker or quick presets.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Set Time</h3>
              <p className="text-sm text-gray-600">Optionally set a specific time for more precise countdowns.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Name Event</h3>
              <p className="text-sm text-gray-600">Give your countdown a name for personal reference.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-purple-600">4</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Watch Countdown</h3>
              <p className="text-sm text-gray-600">See live updates every second with multiple time formats.</p>
            </div>
          </div>
        </div>
{/* Related Calculators */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-5 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {relatedCalculators.map((calc) => (
              <Link key={calc.href} href={calc.href} className="group">
                <div className="rounded-lg p-4 bg-gray-50 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all h-full">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-purple-600">{calc.title}</h3>
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
