'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
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
  { href: '/us/tools/calculators/age-calculator', title: 'Age Calculator', description: 'Calculate your exact age', color: 'bg-blue-500' },
  { href: '/us/tools/calculators/date-calculator', title: 'Date Calculator', description: 'Calculate date differences', color: 'bg-green-500' },
  { href: '/us/tools/calculators/birthday-calculator', title: 'Birthday Calculator', description: 'Find your birthday details', color: 'bg-purple-500' },
  { href: '/us/tools/calculators/time-calculator', title: 'Time Calculator', description: 'Calculate time differences', color: 'bg-orange-500' },
];

interface Props {
  relatedCalculators?: RelatedCalculator[];
}

const fallbackFaqs = [
  {
    id: '1',
    question: "How do I calculate my age in days?",
    answer: "Enter your birth date in the calculator above, and it will automatically calculate your exact age in days, hours, minutes, and seconds. The calculator accounts for leap years and varying month lengths for accurate results.",
    order: 1
  },
  {
    id: '2',
    question: "Does the calculator account for leap years?",
    answer: "Yes, the calculator automatically accounts for leap years (years with 366 days instead of 365). Leap years occur every 4 years, adding an extra day on February 29th. This ensures your age in days is calculated accurately.",
    order: 2
  },
  {
    id: '3',
    question: "How many days old am I if I'm 30 years old?",
    answer: "At 30 years old, you would be approximately 10,950-10,958 days old, depending on how many leap years occurred during your lifetime (about 7-8 leap years). The exact number depends on your birth date and the current date.",
    order: 3
  },
  {
    id: '4',
    question: "Can I calculate my age on a specific future or past date?",
    answer: "Yes, select 'Custom Date' instead of 'Today' and enter any date you want. This is useful for finding out how old you were on a specific past event or how old you'll be on a future date.",
    order: 4
  },
  {
    id: '5',
    question: "How many hours and minutes have I lived?",
    answer: "The calculator shows your age in multiple units: days, hours, minutes, and seconds. For example, if you're 10,000 days old, that's 240,000 hours, 14,400,000 minutes, or 864,000,000 seconds.",
    order: 5
  },
  {
    id: '6',
    question: "What is the significance of counting age in days?",
    answer: "Counting age in days gives a more precise measurement of time lived. It's useful for celebrating day milestones (like 10,000 days), tracking infant development in pediatrics, calculating exact time differences, and understanding the true duration of your life experiences.",
    order: 6
  }
];

export default function AgeInDaysCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('age-in-days-calculator');

  const [birthDate, setBirthDate] = useState('1990-01-01');
  const [dateType, setDateType] = useState('today');
  const [customDate, setCustomDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [results, setResults] = useState({
    totalDays: 0,
    totalHours: 0,
    totalMinutes: 0,
    totalSeconds: 0,
    years: 0,
    months: 0,
    days: 0,
    weeks: 0,
    nextBirthday: '',
    zodiacSign: '',
    birthDay: ''
  });

  useEffect(() => {
    calculateAge();
  }, [birthDate, dateType, customDate]);

  const calculateAge = () => {
    if (!birthDate) return;

    const birth = new Date(birthDate);
    const current = dateType === 'today' ? new Date() : new Date(customDate);

    if (birth > current) {
      alert('Birth date cannot be in the future');
      return;
    }

    const timeDiff = current.getTime() - birth.getTime();
    
    const totalDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(timeDiff / (1000 * 60 * 60));
    const totalMinutes = Math.floor(timeDiff / (1000 * 60));
    const totalSeconds = Math.floor(timeDiff / 1000);

    const ageDate = new Date(current.getTime() - birth.getTime());
    const years = ageDate.getUTCFullYear() - 1970;
    const months = ageDate.getUTCMonth();
    const days = ageDate.getUTCDate() - 1;
    const weeks = Math.floor(totalDays / 7);

    const nextBirthday = getNextBirthday(birth, current);
    const zodiacSign = getZodiacSign(birth);
    const birthDay = birth.toLocaleDateString('en-US', { weekday: 'long' });

    setResults({
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
      years,
      months,
      days,
      weeks,
      nextBirthday,
      zodiacSign,
      birthDay
    });
  };

  const getNextBirthday = (birthDate: Date, currentDate: Date) => {
    const nextBirthday = new Date(currentDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (nextBirthday <= currentDate) {
      nextBirthday.setFullYear(currentDate.getFullYear() + 1);
    }
    const daysUntil = Math.ceil((nextBirthday.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
    return `${daysUntil} days`;
  };

  const getZodiacSign = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const signs = [
      { sign: 'Capricorn', start: [12, 22], end: [1, 19] },
      { sign: 'Aquarius', start: [1, 20], end: [2, 18] },
      { sign: 'Pisces', start: [2, 19], end: [3, 20] },
      { sign: 'Aries', start: [3, 21], end: [4, 19] },
      { sign: 'Taurus', start: [4, 20], end: [5, 20] },
      { sign: 'Gemini', start: [5, 21], end: [6, 20] },
      { sign: 'Cancer', start: [6, 21], end: [7, 22] },
      { sign: 'Leo', start: [7, 23], end: [8, 22] },
      { sign: 'Virgo', start: [8, 23], end: [9, 22] },
      { sign: 'Libra', start: [9, 23], end: [10, 22] },
      { sign: 'Scorpio', start: [10, 23], end: [11, 21] },
      { sign: 'Sagittarius', start: [11, 22], end: [12, 21] }
    ];

    for (const { sign, start, end } of signs) {
      if ((month === start[0] && day >= start[1]) || (month === end[0] && day <= end[1])) {
        return sign;
      }
    }
    return 'Capricorn';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Age in Days Calculator",
            "description": "Discover your exact age in days, hours, minutes, and seconds. Calculate how many days you've been alive with precision.",
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
      <div className="max-w-[1180px] mx-auto px-2 py-6 md:py-4 sm:py-6 md:py-8">
        <header className="text-center mb-6 md:mb-10">
          <h1 className="text-3xl md:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">{getH1('Age in Days Calculator')}</h1>
          <p className="text-sm md:text-base text-gray-600 max-w-3xl mx-auto">
            Discover your exact age in days, hours, minutes, and seconds. Calculate how many days you've been alive with precision.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-6 md:mb-8">
          {/* Calculator Input */}
          <div className="lg:col-span-2 space-y-4 md:space-y-3 sm:space-y-4 md:space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Enter Your Details</h2>

              <div className="space-y-3 sm:space-y-4 md:space-y-3 sm:space-y-4 md:space-y-6">
                {/* Birth Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Date Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Calculate Age As Of</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setDateType('today')}
                      className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                        dateType === 'today'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      Today
                    </button>
                    <button
                      onClick={() => setDateType('custom')}
                      className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                        dateType === 'custom'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      Custom Date
                    </button>
                  </div>
                </div>

                {/* Custom Date Input */}
                {dateType === 'custom' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Custom Date</label>
                    <input
                      type="date"
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Results Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-4 md:p-6 border-2 border-blue-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Your Age Results</h3>

              {/* Primary Results - Days */}
              <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                <div className="text-sm text-gray-500">Total Days Lived</div>
                <div className="text-xl sm:text-2xl md:text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">{results.totalDays.toLocaleString()} days</div>
              </div>

              {/* Other Time Units */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-xs text-gray-500">Hours</div>
                  <div className="text-xl font-bold text-gray-800">{results.totalHours.toLocaleString()}</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-xs text-gray-500">Minutes</div>
                  <div className="text-xl font-bold text-gray-800">{results.totalMinutes.toLocaleString()}</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-xs text-gray-500">Seconds</div>
                  <div className="text-xl font-bold text-gray-800">{results.totalSeconds.toLocaleString()}</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-xs text-gray-500">Weeks</div>
                  <div className="text-xl font-bold text-gray-800">{results.weeks.toLocaleString()}</div>
                </div>
              </div>

              {/* Age Breakdown */}
              <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                <div className="text-sm text-gray-500 mb-2">Age Breakdown</div>
                <div className="text-lg font-semibold text-gray-800">
                  {results.years} years, {results.months} months, {results.days} days
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-xs text-gray-500">Birth Day</div>
                  <div className="text-sm font-semibold text-gray-800">{results.birthDay}</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-xs text-gray-500">Zodiac Sign</div>
                  <div className="text-sm font-semibold text-gray-800">{results.zodiacSign}</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm col-span-2">
                  <div className="text-xs text-gray-500">Next Birthday In</div>
                  <div className="text-sm font-semibold text-green-600">{results.nextBirthday}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-3 sm:space-y-4 md:space-y-3 sm:space-y-4 md:space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Fun Facts</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>10,000 days = ~27.4 years</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>1 million hours = ~114 years</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Average lifespan: ~29,000 days</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  <span>Leap years add 1 extra day every 4 years</span>
                </li>
              </ul>
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
          <FirebaseFAQs pageId="age-in-days-calculator" fallbackFaqs={fallbackFaqs} />
        </div>
{/* Related Calculators */}
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
            {relatedCalculators.map((calc) => (
              <Link key={calc.href} href={calc.href} className="group">
                <div className="rounded-lg p-4 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                  <div className="text-2xl mb-2">🧮</div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
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

