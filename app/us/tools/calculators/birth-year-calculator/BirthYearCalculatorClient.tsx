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
  color?: string;
  icon?: string;
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/age-calculator', title: 'Age Calculator', description: 'Calculate your exact age', color: 'bg-blue-500' },
  { href: '/us/tools/calculators/date-calculator', title: 'Date Calculator', description: 'Calculate date differences', color: 'bg-green-500' },
  { href: '/us/tools/calculators/age-in-days-calculator', title: 'Age in Days', description: 'Age in days/hours', color: 'bg-purple-500' },
  { href: '/us/tools/calculators/zodiac-sign-calculator', title: 'Zodiac Calculator', description: 'Find your zodiac sign', color: 'bg-orange-500' },
];

interface Props {
  relatedCalculators?: RelatedCalculator[];
}

const fallbackFaqs = [
  {
    id: '1',
    question: "How do I calculate my birth year from my age?",
    answer: "Simply subtract your current age from the current year. For example, if you're 30 years old in 2024, your birth year is 2024 - 30 = 1994. However, this gives an approximate result since your exact birth year depends on whether your birthday has passed this year.",
    order: 1
  },
  {
    id: '2',
    question: "Why might the calculated birth year be off by one year?",
    answer: "If your birthday hasn't occurred yet this year, you should subtract an additional year. For example, if it's March 2024 and you're 30 but were born in July, your birth year would be 1993, not 1994. Our calculator provides both possible years when relevant.",
    order: 2
  },
  {
    id: '3',
    question: "What are the different generations and their birth years?",
    answer: "Gen Alpha: 2010-present, Gen Z: 1997-2009, Millennials: 1981-1996, Gen X: 1965-1980, Baby Boomers: 1946-1964, Silent Generation: 1928-1945, Greatest Generation: before 1928.",
    order: 3
  },
  {
    id: '4',
    question: "How is the Chinese Zodiac animal determined?",
    answer: "The Chinese Zodiac follows a 12-year cycle, with each year represented by an animal: Rat, Ox, Tiger, Rabbit, Dragon, Snake, Horse, Goat, Monkey, Rooster, Dog, and Pig. Your zodiac animal is determined by your birth year in the lunar calendar.",
    order: 4
  },
  {
    id: '5',
    question: "How do I calculate age from birth year?",
    answer: "Subtract the birth year from the current year. If the birthday hasn't passed yet this year, subtract 1 from the result. For example, if someone was born in 1990 and it's 2024, they are either 33 or 34 depending on whether their birthday has passed.",
    order: 5
  },
  {
    id: '6',
    question: "What is the most accurate way to calculate exact age?",
    answer: "For the most accurate age calculation, you need the complete birth date (day, month, and year) and the current date. Our Age Calculator tool provides exact age in years, months, days, hours, and even minutes.",
    order: 6
  }
];

const relatedTools = [
  { href: '/us/tools/calculators/age-calculator', title: 'Age Calculator', description: 'Calculate exact age' },
  { href: '/us/tools/calculators/age-in-days-calculator', title: 'Age in Days', description: 'Age in days/hours' },
  { href: '/us/tools/calculators/date-calculator', title: 'Date Calculator', description: 'Add/subtract dates' },
  { href: '/us/tools/calculators/days-between-dates-calculator', title: 'Days Between Dates', description: 'Count days' },
  { href: '/us/tools/calculators/years-between-dates-calculator', title: 'Years Between Dates', description: 'Count years' },
  { href: '/us/tools/calculators/countdown-calculator', title: 'Countdown', description: 'Event countdown' },
];

export default function BirthYearCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('birth-year-calculator');

  const [method, setMethod] = useState('fromAge');
  const [currentAge, setCurrentAge] = useState(25);
  const [birthYear, setBirthYear] = useState(1998);
  const [results, setResults] = useState({
    primaryResult: 1998,
    alternateResult: 1999,
    age: 25,
    ageInDays: 9125,
    ageInWeeks: 1304,
    ageInMonths: 300,
    generation: 'Millennial',
    zodiac: '🐅 Tiger',
    westernZodiac: 'Depends on birth date'
  });

  useEffect(() => {
    calculate();
  }, [method, currentAge, birthYear]);

  const calculate = () => {
    const today = new Date();
    const currentYear = today.getFullYear();

    if (method === 'fromAge') {
      const calculatedBirthYear = currentYear - currentAge;
      const ageInDays = Math.round(currentAge * 365.25);
      const ageInWeeks = Math.round(ageInDays / 7);
      const ageInMonths = currentAge * 12;
      setResults({
        primaryResult: calculatedBirthYear,
        alternateResult: calculatedBirthYear - 1,
        age: currentAge,
        ageInDays,
        ageInWeeks,
        ageInMonths,
        generation: getGeneration(calculatedBirthYear),
        zodiac: getChineseZodiac(calculatedBirthYear),
        westernZodiac: 'Depends on birth date'
      });
    } else {
      const calculatedAge = currentYear - birthYear;
      const ageInDays = Math.round(calculatedAge * 365.25);
      const ageInWeeks = Math.round(ageInDays / 7);
      const ageInMonths = calculatedAge * 12;
      setResults({
        primaryResult: calculatedAge,
        alternateResult: calculatedAge - 1,
        age: calculatedAge,
        ageInDays,
        ageInWeeks,
        ageInMonths,
        generation: getGeneration(birthYear),
        zodiac: getChineseZodiac(birthYear),
        westernZodiac: 'Depends on birth date'
      });
    }
  };

  const getGeneration = (year: number): string => {
    if (year >= 2013) return 'Gen Alpha (2013-present)';
    if (year >= 1997) return 'Gen Z (1997-2012)';
    if (year >= 1981) return 'Millennial (1981-1996)';
    if (year >= 1965) return 'Gen X (1965-1980)';
    if (year >= 1946) return 'Baby Boomer (1946-1964)';
    if (year >= 1928) return 'Silent Generation (1928-1945)';
    return 'Greatest Generation (before 1928)';
  };

  const getChineseZodiac = (year: number): string => {
    const animals = ['🐭 Rat', '🐮 Ox', '🐅 Tiger', '🐰 Rabbit', '🐉 Dragon', '🐍 Snake',
                     '🐴 Horse', '🐐 Goat', '🐵 Monkey', '🐓 Rooster', '🐕 Dog', '🐷 Pig'];
    return animals[(year - 4) % 12];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Birth Year Calculator",
          "description": "Calculate birth year from age or find your exact age from birth year. Includes generation info, Chinese zodiac, and age statistics.",
          "url": "https://economictimes.indiatimes.com/us/tools/calculators/birth-year-calculator",
          "applicationCategory": "UtilityApplication",
          "operatingSystem": "Any",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
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

      <div className="max-w-[1180px] mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{getH1('Birth Year Calculator')}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Calculate birth year from age or find your exact age from birth year. Discover your generation, Chinese zodiac, and more.
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Main Calculator */}
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Calculate</h2>

              {/* Method Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Calculation Method</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setMethod('fromAge')}
                    className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                      method === 'fromAge'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    Age → Birth Year
                  </button>
                  <button
                    onClick={() => setMethod('fromYear')}
                    className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                      method === 'fromYear'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    Birth Year → Age
                  </button>
                </div>
              </div>

              {/* Input Field */}
              {method === 'fromAge' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Age</label>
                  <input
                    type="number"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    min="0"
                    max="150"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Birth Year</label>
                  <input
                    type="number"
                    value={birthYear}
                    onChange={(e) => setBirthYear(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>
              )}
            </div>

            {/* Results Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Results</h3>

              {/* Primary Result */}
              <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                <div className="text-sm text-gray-500">
                  {method === 'fromAge' ? 'Birth Year' : 'Current Age'}
                </div>
                <div className="text-3xl font-bold text-blue-600">
                  {method === 'fromAge' ? results.primaryResult : `${results.age} years`}
                </div>
                {method === 'fromAge' && (
                  <div className="text-sm text-gray-500 mt-1">
                    or {results.alternateResult} (if birthday hasn&apos;t passed)
                  </div>
                )}
              </div>

              {/* Age Statistics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-xs text-gray-500">Days</div>
                  <div className="text-lg font-bold text-gray-800">{results.ageInDays.toLocaleString()}</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-xs text-gray-500">Weeks</div>
                  <div className="text-lg font-bold text-gray-800">{results.ageInWeeks.toLocaleString()}</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-xs text-gray-500">Months</div>
                  <div className="text-lg font-bold text-gray-800">{results.ageInMonths.toLocaleString()}</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-xs text-gray-500">Chinese Zodiac</div>
                  <div className="text-lg font-bold text-gray-800">{results.zodiac}</div>
                </div>
              </div>

              {/* Generation */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm text-gray-500">Generation</div>
                <div className="text-lg font-semibold text-purple-600">{results.generation}</div>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <FirebaseFAQs pageId="birth-year-calculator" fallbackFaqs={fallbackFaqs} />
        </div>
{/* Related Calculators */}
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Calculators</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {relatedTools.map((calc) => (
              <Link key={calc.href} href={calc.href} className="group">
                <div className="rounded-lg p-4 bg-gray-50 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600">
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

