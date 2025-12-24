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
export default function CelsiusToFahrenheitCalculatorClient() {
  const { getH1, getSubHeading } = usePageSEO('celsius-to-fahrenheit-calculator');

  const [celsius, setCelsius] = useState<string>('25');
  const [fahrenheit, setFahrenheit] = useState<string>('77');
  const [lastEdited, setLastEdited] = useState<'celsius' | 'fahrenheit'>('celsius');

  const fallbackFaqs = [
    {
    id: '1',
    question: "What is the formula to convert Celsius to Fahrenheit?",
      answer: "The formula is: °F = (°C × 9/5) + 32. Multiply the Celsius temperature by 9, divide by 5, then add 32 to get Fahrenheit.",
    order: 1
  },
    {
    id: '2',
    question: "What is 0°C in Fahrenheit?",
      answer: "0°C equals 32°F. This is the freezing point of water at standard atmospheric pressure.",
    order: 2
  },
    {
    id: '3',
    question: "What is normal body temperature in Celsius and Fahrenheit?",
      answer: "Normal human body temperature is approximately 37°C or 98.6°F. However, it can vary slightly between 36.1°C to 37.2°C (97°F to 99°F).",
    order: 3
  },
    {
    id: '4',
    question: "Why does the US use Fahrenheit instead of Celsius?",
      answer: "The Fahrenheit scale was developed by Daniel Gabriel Fahrenheit in 1724 and was widely adopted in English-speaking countries. While most countries switched to Celsius as part of the metric system, the US retained Fahrenheit for everyday use.",
    order: 4
  },
    {
    id: '5',
    question: "At what temperature are Celsius and Fahrenheit equal?",
      answer: "Celsius and Fahrenheit are equal at -40°. So -40°C = -40°F. This is the only point where both scales intersect.",
    order: 5
  },
    {
    id: '6',
    question: "What is room temperature in Celsius and Fahrenheit?",
      answer: "Room temperature is typically considered to be around 20-22°C or 68-72°F. This is the comfortable range for most indoor environments.",
    order: 6
  }
  ];

  const relatedCalculators = [
    { href: '/us/tools/calculators/fahrenheit-to-celsius-calculator', title: 'Fahrenheit to Celsius', description: 'Convert °F to °C' },
    { href: '/us/tools/calculators/temperature-converter', title: 'Temperature Converter', description: 'All temperature units' },
    { href: '/us/tools/calculators/unit-converter', title: 'Unit Converter', description: 'Convert any units' },
    { href: '/us/tools/calculators/length-converter', title: 'Length Converter', description: 'Convert length units' },
    { href: '/us/tools/calculators/weight-converter', title: 'Weight Converter', description: 'Convert weight units' },
    { href: '/us/tools/calculators/cooking-measurement-converter', title: 'Cooking Converter', description: 'Kitchen measurements' },
  ];

  const temperatureReferences = [
    { name: 'Absolute Zero', celsius: -273.15, fahrenheit: -459.67 },
    { name: 'Water Freezes', celsius: 0, fahrenheit: 32 },
    { name: 'Room Temperature', celsius: 20, fahrenheit: 68 },
    { name: 'Body Temperature', celsius: 37, fahrenheit: 98.6 },
    { name: 'Water Boils', celsius: 100, fahrenheit: 212 },
  ];

  useEffect(() => {
    if (lastEdited === 'celsius') {
      const c = parseFloat(celsius) || 0;
      const f = (c * 9/5) + 32;
      setFahrenheit(f.toFixed(2));
    }
  }, [celsius, lastEdited]);

  useEffect(() => {
    if (lastEdited === 'fahrenheit') {
      const f = parseFloat(fahrenheit) || 0;
      const c = (f - 32) * 5/9;
      setCelsius(c.toFixed(2));
    }
  }, [fahrenheit, lastEdited]);

  const handleCelsiusChange = (value: string) => {
    setCelsius(value);
    setLastEdited('celsius');
  };

  const handleFahrenheitChange = (value: string) => {
    setFahrenheit(value);
    setLastEdited('fahrenheit');
  };

  const setQuickCelsius = (value: number) => {
    setCelsius(value.toString());
    setLastEdited('celsius');
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
          "name": "Celsius to Fahrenheit Calculator",
          "description": "Free online calculator to convert temperatures from Celsius to Fahrenheit. Instant conversion with formula explanation.",
          "url": "https://www.example.com/us/tools/calculators/celsius-to-fahrenheit-calculator",
          "applicationCategory": "UtilityApplication",
          "operatingSystem": "Any",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "featureList": [
            "Celsius to Fahrenheit conversion",
            "Fahrenheit to Celsius conversion",
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
            { "@type": "ListItem", "position": 4, "name": "Celsius to Fahrenheit Calculator", "item": "https://www.example.com/us/tools/calculators/celsius-to-fahrenheit-calculator" }
          ]
        })
      }} />

      <div className="max-w-[1180px] mx-auto px-4 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Celsius to Fahrenheit Calculator')}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Convert temperatures between Celsius and Fahrenheit instantly. Enter a value in either field for real-time conversion.</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Main Calculator Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
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
                      onClick={() => setQuickCelsius(val)}
                      className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                    >
                      {val}°C
                    </button>
                  ))}
                </div>
              </div>
            </div>

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
                      onClick={() => handleFahrenheitChange(val.toString())}
                      className="px-3 py-2 bg-red-100 text-red-800 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                    >
                      {val}°F
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Result Display */}
          <div className="mt-8 p-3 sm:p-4 md:p-6 bg-gradient-to-r from-blue-500 to-red-500 rounded-xl text-white text-center">
            <div className="text-lg opacity-90 mb-2">Conversion Result</div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold">
              {celsius}°C = {fahrenheit}°F
            </div>
          </div>

          {/* Temperature References */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {temperatureReferences.map((ref) => (
              <div key={ref.name} className="bg-gray-100 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">{ref.name}</div>
                <div className="text-lg font-bold text-gray-800">{formatNumber(ref.celsius)}°C</div>
                <div className="text-lg font-bold text-gray-600">{formatNumber(ref.fahrenheit)}°F</div>
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
        <FirebaseFAQs pageId="celsius-to-fahrenheit-calculator" fallbackFaqs={fallbackFaqs} />
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
