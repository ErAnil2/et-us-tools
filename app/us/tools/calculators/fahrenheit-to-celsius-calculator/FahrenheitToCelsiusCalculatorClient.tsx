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
export default function FahrenheitToCelsiusCalculatorClient() {
  const { getH1, getSubHeading } = usePageSEO('fahrenheit-to-celsius-calculator');

  const [fahrenheit, setFahrenheit] = useState<string>('77');
  const [celsius, setCelsius] = useState<string>('25');
  const [lastEdited, setLastEdited] = useState<'fahrenheit' | 'celsius'>('fahrenheit');

  const fallbackFaqs = [
    {
    id: '1',
    question: "What is the formula to convert Fahrenheit to Celsius?",
      answer: "The formula is: °C = (°F - 32) × 5/9. Subtract 32 from the Fahrenheit temperature, then multiply by 5 and divide by 9 to get Celsius.",
    order: 1
  },
    {
    id: '2',
    question: "What is 32°F in Celsius?",
      answer: "32°F equals 0°C. This is the freezing point of water at standard atmospheric pressure.",
    order: 2
  },
    {
    id: '3',
    question: "What is 98.6°F in Celsius?",
      answer: "98.6°F equals 37°C. This is considered the normal human body temperature, though it can vary slightly from person to person.",
    order: 3
  },
    {
    id: '4',
    question: "How do I quickly estimate Fahrenheit to Celsius?",
      answer: "A quick estimation method: subtract 30 from the Fahrenheit temperature and divide by 2. For example, 70°F: (70-30)/2 = 20°C (actual is 21.1°C). This gives a rough approximation.",
    order: 4
  },
    {
    id: '5',
    question: "At what temperature are Fahrenheit and Celsius equal?",
      answer: "Fahrenheit and Celsius are equal at -40°. So -40°F = -40°C. This is the only point where both temperature scales intersect.",
    order: 5
  },
    {
    id: '6',
    question: "What is 212°F in Celsius?",
      answer: "212°F equals 100°C. This is the boiling point of water at standard atmospheric pressure (at sea level).",
    order: 6
  }
  ];

  const relatedCalculators = [
    { href: '/us/tools/calculators/celsius-to-fahrenheit-calculator', title: 'Celsius to Fahrenheit', description: 'Convert °C to °F' },
    { href: '/us/tools/calculators/temperature-converter', title: 'Temperature Converter', description: 'All temperature units' },
    { href: '/us/tools/calculators/unit-converter', title: 'Unit Converter', description: 'Convert any units' },
    { href: '/us/tools/calculators/length-converter', title: 'Length Converter', description: 'Convert length units' },
    { href: '/us/tools/calculators/weight-converter', title: 'Weight Converter', description: 'Convert weight units' },
    { href: '/us/tools/calculators/cooking-measurement-converter', title: 'Cooking Converter', description: 'Kitchen measurements' },
  ];

  const temperatureReferences = [
    { name: 'Absolute Zero', fahrenheit: -459.67, celsius: -273.15 },
    { name: 'Water Freezes', fahrenheit: 32, celsius: 0 },
    { name: 'Room Temperature', fahrenheit: 68, celsius: 20 },
    { name: 'Body Temperature', fahrenheit: 98.6, celsius: 37 },
    { name: 'Water Boils', fahrenheit: 212, celsius: 100 },
  ];

  useEffect(() => {
    if (lastEdited === 'fahrenheit') {
      const f = parseFloat(fahrenheit) || 0;
      const c = (f - 32) * 5/9;
      setCelsius(c.toFixed(2));
    }
  }, [fahrenheit, lastEdited]);

  useEffect(() => {
    if (lastEdited === 'celsius') {
      const c = parseFloat(celsius) || 0;
      const f = (c * 9/5) + 32;
      setFahrenheit(f.toFixed(2));
    }
  }, [celsius, lastEdited]);

  const handleFahrenheitChange = (value: string) => {
    setFahrenheit(value);
    setLastEdited('fahrenheit');
  };

  const handleCelsiusChange = (value: string) => {
    setCelsius(value);
    setLastEdited('celsius');
  };

  const setQuickFahrenheit = (value: number) => {
    setFahrenheit(value.toString());
    setLastEdited('fahrenheit');
  };

  const formatNumber = (num: number): string => {
    if (Number.isInteger(num)) return num.toString();
    return num.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Fahrenheit to Celsius Calculator",
          "description": "Free online calculator to convert temperatures from Fahrenheit to Celsius. Instant conversion with formula explanation.",
          "url": "https://www.example.com/us/tools/calculators/fahrenheit-to-celsius-calculator",
          "applicationCategory": "UtilityApplication",
          "operatingSystem": "Any",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "featureList": [
            "Fahrenheit to Celsius conversion",
            "Celsius to Fahrenheit conversion",
            "Real-time calculation",
            "Temperature reference chart"
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
            { "@type": "ListItem", "position": 4, "name": "Fahrenheit to Celsius Calculator", "item": "https://www.example.com/us/tools/calculators/fahrenheit-to-celsius-calculator" }
          ]
        })
      }} />

      <div className="max-w-[1180px] mx-auto px-4 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Fahrenheit to Celsius Calculator')}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Convert temperatures between Fahrenheit and Celsius instantly. Enter a value in either field for real-time conversion.</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Main Calculator Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
            {/* Fahrenheit Input */}
            <div className="bg-red-50 rounded-xl p-3 sm:p-4 md:p-6">
              <label className="block text-xl font-semibold text-red-800 mb-4">Fahrenheit (°F)</label>
              <input
                type="number"
                value={fahrenheit}
                onChange={(e) => handleFahrenheitChange(e.target.value)}
                className="w-full px-4 py-4 text-xl sm:text-2xl md:text-3xl font-bold text-center border-2 border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Enter °F"
              />
              <p className="text-center mt-4 text-red-700 text-sm">Formula: °C = (°F - 32) × 5/9</p>

              {/* Quick Presets */}
              <div className="mt-4">
                <p className="text-sm text-red-700 mb-2">Quick values:</p>
                <div className="grid grid-cols-4 gap-2">
                  {[-40, 32, 68, 98.6, 212].map(val => (
                    <button
                      key={val}
                      onClick={() => setQuickFahrenheit(val)}
                      className="px-3 py-2 bg-red-100 text-red-800 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                    >
                      {val}°F
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Celsius Input */}
            <div className="bg-blue-50 rounded-xl p-3 sm:p-4 md:p-6">
              <label className="block text-xl font-semibold text-blue-800 mb-4">Celsius (°C)</label>
              <input
                type="number"
                value={celsius}
                onChange={(e) => handleCelsiusChange(e.target.value)}
                className="w-full px-4 py-4 text-xl sm:text-2xl md:text-3xl font-bold text-center border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter °C"
              />
              <p className="text-center mt-4 text-blue-700 text-sm">Formula: °F = (°C × 9/5) + 32</p>

              {/* Quick Presets */}
              <div className="mt-4">
                <p className="text-sm text-blue-700 mb-2">Quick values:</p>
                <div className="grid grid-cols-4 gap-2">
                  {[-40, 0, 20, 37, 100].map(val => (
                    <button
                      key={val}
                      onClick={() => handleCelsiusChange(val.toString())}
                      className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                    >
                      {val}°C
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Result Display */}
          <div className="mt-8 p-3 sm:p-4 md:p-6 bg-gradient-to-r from-red-500 to-blue-500 rounded-xl text-white text-center">
            <div className="text-lg opacity-90 mb-2">Conversion Result</div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold">
              {fahrenheit}°F = {celsius}°C
            </div>
          </div>

          {/* Temperature References */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {temperatureReferences.map((ref) => (
              <div key={ref.name} className="bg-gray-100 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">{ref.name}</div>
                <div className="text-lg font-bold text-gray-800">{formatNumber(ref.fahrenheit)}°F</div>
                <div className="text-lg font-bold text-gray-600">{formatNumber(ref.celsius)}°C</div>
              </div>
            ))}
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />


        {/* Conversion Table */}

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQs Section - Firebase Powered */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="fahrenheit-to-celsius-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
{/* Related Calculators */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-5 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {relatedCalculators.map((calc) => (
              <Link key={calc.href} href={calc.href} className="group">
                <div className="rounded-lg p-4 bg-gray-50 border border-gray-200 hover:border-red-300 hover:shadow-md transition-all h-full">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-red-600">{calc.title}</h3>
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
