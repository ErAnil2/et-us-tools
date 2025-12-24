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
interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  nextBirthday: Date;
  daysUntilBirthday: number;
  dayOfWeek: string;
  zodiacSign: string;
  chineseZodiac: string;
  generation: string;
  leapYearBirthdays: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "How is age calculated accurately?",
    answer: "Age is calculated by counting the complete years, months, and days between your birth date and the current date (or a specified date). The calculator handles varying month lengths (28-31 days) and leap years correctly. For example, if born on March 15, 1990, and today is December 3, 2025, you would be 35 years, 8 months, and 18 days old.",
    order: 1
  },
  {
    id: '2',
    question: "Why does my age in months or days differ from simple multiplication?",
    answer: "Simple multiplication (years × 12 for months or years × 365 for days) doesn't account for varying month lengths and leap years. Our calculator counts actual elapsed time, which gives precise results. A year has 365 or 366 days, and months range from 28-31 days.",
    order: 2
  },
  {
    id: '3',
    question: "How do I calculate age on a specific date?",
    answer: "Enter your birth date and then change the 'Calculate Age On' field to any date you want. This is useful for calculating your age at a future event, for historical dates, or for determining eligibility for age-based requirements on a specific date.",
    order: 3
  },
  {
    id: '4',
    question: "What is my zodiac sign based on my birth date?",
    answer: "Your Western zodiac sign is determined by your birth date. The 12 signs are: Aries (Mar 21-Apr 19), Taurus (Apr 20-May 20), Gemini (May 21-Jun 20), Cancer (Jun 21-Jul 22), Leo (Jul 23-Aug 22), Virgo (Aug 23-Sep 22), Libra (Sep 23-Oct 22), Scorpio (Oct 23-Nov 21), Sagittarius (Nov 22-Dec 21), Capricorn (Dec 22-Jan 19), Aquarius (Jan 20-Feb 18), and Pisces (Feb 19-Mar 20).",
    order: 4
  },
  {
    id: '5',
    question: "How many heartbeats have I had since birth?",
    answer: "The average human heart beats about 100,000 times per day or approximately 70 beats per minute at rest. You can estimate your total heartbeats by multiplying your age in days by 100,000. For example, a 30-year-old has had approximately 1.1 billion heartbeats!",
    order: 5
  },
  {
    id: '6',
    question: "What generation am I part of?",
    answer: "Generations are defined by birth year ranges: Silent Generation (1928-1945), Baby Boomers (1946-1964), Generation X (1965-1980), Millennials/Gen Y (1981-1996), Generation Z (1997-2012), and Generation Alpha (2013-present). Each generation has distinct characteristics shaped by historical events and technology.",
    order: 6
  }
];

const relatedCalculators = [
  { href: "/us/tools/calculators/date-calculator", title: "Date Calculator", description: "Days between dates", color: "bg-blue-600" },
  { href: "/us/tools/calculators/time-until-calculator", title: "Time Until", description: "Countdown to events", color: "bg-green-600" },
  { href: "/us/tools/calculators/days-between-dates-calculator", title: "Days Between Dates", description: "Calculate day difference", color: "bg-purple-600" },
  { href: "/us/tools/calculators/years-between-dates-calculator", title: "Years Between Dates", description: "Calculate year difference", color: "bg-orange-500" }
];

export default function AgeCalculatorClient() {
  const { getH1, getSubHeading } = usePageSEO('age-calculator');

  const [birthDate, setBirthDate] = useState('1990-01-01');
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [ageResult, setAgeResult] = useState<AgeResult | null>(null);

  useEffect(() => {
    calculateAge();
  }, [birthDate, currentDate]);

  const getZodiacSign = (month: number, day: number): string => {
    const signs = [
      { sign: 'Capricorn', endMonth: 1, endDay: 19 },
      { sign: 'Aquarius', endMonth: 2, endDay: 18 },
      { sign: 'Pisces', endMonth: 3, endDay: 20 },
      { sign: 'Aries', endMonth: 4, endDay: 19 },
      { sign: 'Taurus', endMonth: 5, endDay: 20 },
      { sign: 'Gemini', endMonth: 6, endDay: 20 },
      { sign: 'Cancer', endMonth: 7, endDay: 22 },
      { sign: 'Leo', endMonth: 8, endDay: 22 },
      { sign: 'Virgo', endMonth: 9, endDay: 22 },
      { sign: 'Libra', endMonth: 10, endDay: 22 },
      { sign: 'Scorpio', endMonth: 11, endDay: 21 },
      { sign: 'Sagittarius', endMonth: 12, endDay: 21 },
      { sign: 'Capricorn', endMonth: 12, endDay: 31 }
    ];

    for (const s of signs) {
      if (month < s.endMonth || (month === s.endMonth && day <= s.endDay)) {
        return s.sign;
      }
    }
    return 'Capricorn';
  };

  const getChineseZodiac = (year: number): string => {
    const animals = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
    return animals[(year - 1900) % 12];
  };

  const getGeneration = (year: number): string => {
    if (year >= 2013) return 'Generation Alpha';
    if (year >= 1997) return 'Generation Z';
    if (year >= 1981) return 'Millennial (Gen Y)';
    if (year >= 1965) return 'Generation X';
    if (year >= 1946) return 'Baby Boomer';
    if (year >= 1928) return 'Silent Generation';
    return 'Greatest Generation';
  };

  const calculateAge = () => {
    const birth = new Date(birthDate);
    const current = new Date(currentDate);

    if (birth > current) {
      setAgeResult(null);
      return;
    }

    let ageYears = current.getFullYear() - birth.getFullYear();
    let ageMonths = current.getMonth() - birth.getMonth();
    let ageDays = current.getDate() - birth.getDate();

    if (ageDays < 0) {
      ageMonths--;
      const prevMonth = new Date(current.getFullYear(), current.getMonth(), 0);
      ageDays += prevMonth.getDate();
    }

    if (ageMonths < 0) {
      ageYears--;
      ageMonths += 12;
    }

    // Calculate totals
    const diffTime = Math.abs(current.getTime() - birth.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = ageYears * 12 + ageMonths;
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;

    // Next birthday
    let nextBirthday = new Date(current.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= current) {
      nextBirthday = new Date(current.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));

    // Day of week born
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = daysOfWeek[birth.getDay()];

    // Zodiac signs
    const zodiacSign = getZodiacSign(birth.getMonth() + 1, birth.getDate());
    const chineseZodiac = getChineseZodiac(birth.getFullYear());

    // Generation
    const generation = getGeneration(birth.getFullYear());

    // Count leap year birthdays
    let leapYearBirthdays = 0;
    for (let year = birth.getFullYear(); year <= current.getFullYear(); year++) {
      if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
        const birthdayThisYear = new Date(year, birth.getMonth(), birth.getDate());
        if (birthdayThisYear >= birth && birthdayThisYear <= current) {
          leapYearBirthdays++;
        }
      }
    }

    setAgeResult({
      years: ageYears,
      months: ageMonths,
      days: ageDays,
      totalDays,
      totalWeeks,
      totalMonths,
      totalHours,
      totalMinutes,
      totalSeconds,
      nextBirthday,
      daysUntilBirthday,
      dayOfWeek,
      zodiacSign,
      chineseZodiac,
      generation,
      leapYearBirthdays
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const setPresetBirthYear = (yearsAgo: number) => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - yearsAgo);
    setBirthDate(date.toISOString().split('T')[0]);
  };

  // Schema.org structured data
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": "Age Calculator",
        "description": "Calculate your exact age in years, months, days, hours, and minutes. Find your zodiac sign, Chinese zodiac, generation, and more.",
        "url": "https://economictimes.indiatimes.com/us/tools/calculators/age-calculator",
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
            "name": "Age Calculator",
            "item": "https://economictimes.indiatimes.com/us/tools/calculators/age-calculator"
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

      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-4 sm:py-6 md:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-3 sm:mb-4 md:mb-6">
          <Link href="/us/tools" className="text-blue-600 hover:underline">Home</Link>
          <span className="text-gray-400">›</span>
          <Link href="/us/tools/all-calculators" className="text-blue-600 hover:underline">Calculators</Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-600">Age Calculator</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-3xl md:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">{getH1('Age Calculator')}</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Calculate your exact age in years, months, days, hours, and more. Discover your zodiac sign, Chinese zodiac animal, generation, and fun facts about your life.
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8 mb-12">
          {/* Calculator Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Enter Your Details</h2>

              <div className="space-y-3 sm:space-y-4 md:space-y-3 sm:space-y-4 md:space-y-6">
                {/* Birth Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Calculate Age On */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Calculate Age On</label>
                  <input
                    type="date"
                    value={currentDate}
                    onChange={(e) => setCurrentDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Quick Presets */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quick Presets</label>
                  <div className="flex flex-wrap gap-2">
                    {[18, 21, 25, 30, 40, 50, 65].map((years) => (
                      <button
                        key={years}
                        onClick={() => setPresetBirthYear(years)}
                        className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-lg transition-colors"
                      >
                        {years} years ago
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            {ageResult && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Your Age</h2>

                {/* Primary Age Display */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-3 sm:p-4 md:p-6 text-white mb-3 sm:mb-4 md:mb-6">
                  <div className="text-center">
                    <div className="text-5xl font-bold mb-2">
                      {ageResult.years} <span className="text-2xl">years</span>
                    </div>
                    <div className="text-xl opacity-90">
                      {ageResult.months} months, {ageResult.days} days
                    </div>
                  </div>
                </div>

                {/* Age in Different Units */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3 sm:mb-4 md:mb-6">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">{ageResult.totalMonths.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Months</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">{ageResult.totalWeeks.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Weeks</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">{ageResult.totalDays.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Days</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">{ageResult.totalHours.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Hours</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">{ageResult.totalMinutes.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Minutes</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">{ageResult.totalSeconds.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Seconds</div>
                  </div>
                </div>

                {/* Fun Facts */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <span className="text-2xl">🎂</span>
                    <div>
                      <div className="font-medium text-gray-900">Next Birthday</div>
                      <div className="text-sm text-gray-600">{formatDate(ageResult.nextBirthday)} ({ageResult.daysUntilBirthday} days away)</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <span className="text-2xl">⭐</span>
                    <div>
                      <div className="font-medium text-gray-900">Zodiac Sign</div>
                      <div className="text-sm text-gray-600">{ageResult.zodiacSign}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <span className="text-2xl">🐲</span>
                    <div>
                      <div className="font-medium text-gray-900">Chinese Zodiac</div>
                      <div className="text-sm text-gray-600">{ageResult.chineseZodiac}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <span className="text-2xl">👥</span>
                    <div>
                      <div className="font-medium text-gray-900">Generation</div>
                      <div className="text-sm text-gray-600">{ageResult.generation}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <span className="text-2xl">📅</span>
                    <div>
                      <div className="font-medium text-gray-900">Born On</div>
                      <div className="text-sm text-gray-600">{ageResult.dayOfWeek}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-3 sm:space-y-4 md:space-y-3 sm:space-y-4 md:space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-3 sm:p-4 md:p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Did You Know?</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span>💡</span>
                  <span>Your heart has beaten approximately {ageResult ? (ageResult.totalDays * 100000).toLocaleString() : '0'} times!</span>
                </li>
                <li className="flex gap-2">
                  <span>🌙</span>
                  <span>You&apos;ve slept through about {ageResult ? Math.round(ageResult.totalDays * 8).toLocaleString() : '0'} hours of your life.</span>
                </li>
                <li className="flex gap-2">
                  <span>🍽️</span>
                  <span>You&apos;ve eaten approximately {ageResult ? (ageResult.totalDays * 3).toLocaleString() : '0'} meals.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* MREC Banners */}
        <CalculatorAfterCalcBanners />

        {/* Mobile MREC2 - Before FAQs */}


        <CalculatorMobileMrec2 />



        {/* FAQs Section - Firebase Powered */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
          <FirebaseFAQs pageId="age-calculator" fallbackFaqs={fallbackFaqs} />
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
                <div className={`w-10 h-10 ${calc.color} rounded-lg flex items-center justify-center mb-3`}>
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
