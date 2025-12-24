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
const conversionFactors: Record<string, number> = {
  kg: 1,
  g: 0.001,
  mg: 0.000001,
  t: 1000,
  lb: 0.453592,
  oz: 0.0283495,
  st: 6.35029,
  ton: 907.185,
};

const unitNames: Record<string, string> = {
  kg: 'Kilograms',
  g: 'Grams',
  mg: 'Milligrams',
  t: 'Metric Tons',
  lb: 'Pounds',
  oz: 'Ounces',
  st: 'Stone',
  ton: 'US Tons',
};

const unitSymbols: Record<string, string> = {
  kg: 'kg',
  g: 'g',
  mg: 'mg',
  t: 't',
  lb: 'lb',
  oz: 'oz',
  st: 'st',
  ton: 'ton',
};

export default function WeightConverterClient() {
  const { getH1, getSubHeading } = usePageSEO('weight-converter');

  const [fromValue, setFromValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('kg');
  const [toUnit, setToUnit] = useState<string>('lb');
  const [allConversions, setAllConversions] = useState<Record<string, string>>({});

  const formatNumber = (num: number): string => {
    if (num === 0) return '0';
    if (Math.abs(num) >= 1000000) return num.toExponential(4);
    if (Math.abs(num) >= 1000) return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
    if (Math.abs(num) >= 1) return num.toLocaleString('en-US', { maximumFractionDigits: 4 });
    if (Math.abs(num) >= 0.0001) return num.toLocaleString('en-US', { maximumFractionDigits: 6 });
    return num.toExponential(4);
  };

  const convert = () => {
    const value = parseFloat(fromValue) || 0;
    const kg = value * conversionFactors[fromUnit];

    const conversions: Record<string, string> = {};
    Object.keys(conversionFactors).forEach(unit => {
      const result = kg / conversionFactors[unit];
      conversions[unit] = formatNumber(result);
    });
    setAllConversions(conversions);
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  useEffect(() => {
    convert();
  }, [fromValue, fromUnit]);

  const primaryResult = allConversions[toUnit] || '0';

  const fallbackFaqs = [
    {
    id: '1',
    question: "How many pounds are in a kilogram?",
      answer: "There are approximately 2.20462 pounds in one kilogram. To convert kilograms to pounds, multiply the kilogram value by 2.20462. For example, 5 kg = 11.023 lbs.",
    order: 1
  },
    {
    id: '2',
    question: "How do I convert pounds to kilograms?",
      answer: "To convert pounds to kilograms, multiply the pound value by 0.453592. Alternatively, divide by 2.20462. For example, 150 lbs = 68.04 kg.",
    order: 2
  },
    {
    id: '3',
    question: "What is a stone in weight?",
      answer: "A stone is a British unit of weight equal to 14 pounds or approximately 6.35 kilograms. It's commonly used in the UK and Ireland for measuring body weight.",
    order: 3
  },
    {
    id: '4',
    question: "How many ounces are in a pound?",
      answer: "There are exactly 16 ounces in one pound. This is true for both avoirdupois (common) and troy measurement systems used for precious metals.",
    order: 4
  },
    {
    id: '5',
    question: "What is the difference between a metric ton and a US ton?",
      answer: "A metric ton (tonne) equals 1,000 kg or about 2,204.6 lbs. A US ton (short ton) equals 2,000 lbs or about 907.2 kg. The metric ton is about 10% heavier.",
    order: 5
  },
    {
    id: '6',
    question: "How do I quickly estimate kg to lbs in my head?",
      answer: "For a quick estimate, multiply kg by 2 and add 10% of the result. For example, 70 kg × 2 = 140, plus 10% (14) = 154 lbs. The exact answer is 154.3 lbs.",
    order: 6
  }
  ];

  const relatedCalculators = [
    { href: '/us/tools/calculators/length-converter', title: 'Length Converter', description: 'Meters, feet, inches' },
    { href: '/us/tools/calculators/temperature-converter', title: 'Temperature Converter', description: 'Celsius, Fahrenheit' },
    { href: '/us/tools/calculators/unit-converter', title: 'Unit Converter', description: 'All unit conversions' },
    { href: '/us/tools/calculators/bmi-calculator', title: 'BMI Calculator', description: 'Body Mass Index' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Weight Converter",
            "description": "Free online weight converter. Convert between kilograms, pounds, ounces, grams, stones, and tons instantly.",
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Any",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "featureList": ["Kilograms to Pounds", "Pounds to Kilograms", "Stone conversion", "Metric and Imperial"]
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
              "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
            }))
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://economictimes.com/us" },
              { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://economictimes.com/us/tools" },
              { "@type": "ListItem", "position": 3, "name": "Calculators", "item": "https://economictimes.com/us/tools/calculators" },
              { "@type": "ListItem", "position": 4, "name": "Weight Converter", "item": "https://economictimes.com/us/tools/calculators/weight-converter" }
            ]
          })
        }}
      />

      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">{getH1('Weight Converter')}</h1>
          <p className="text-gray-600">Convert between metric and imperial weight units instantly</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Main Calculator */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
            {/* Input Section */}

      <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Enter Weight</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                  <input
                    type="number"
                    value={fromValue}
                    onChange={(e) => setFromValue(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    placeholder="Enter weight"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Unit</label>
                  <select
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {Object.entries(unitNames).map(([key, name]) => (
                      <option key={key} value={key}>{name} ({unitSymbols[key]})</option>
                    ))}
                  </select>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center">
                  <button
                    onClick={swapUnits}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
                    </svg>
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To Unit</label>
                  <select
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {Object.entries(unitNames).map(([key, name]) => (
                      <option key={key} value={key}>{name} ({unitSymbols[key]})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quick Conversions */}
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Quick conversions:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { v: '1', f: 'kg', t: 'lb' },
                    { v: '100', f: 'lb', t: 'kg' },
                    { v: '1', f: 'st', t: 'kg' },
                    { v: '16', f: 'oz', t: 'lb' },
                  ].map((preset, i) => (
                    <button
                      key={i}
                      onClick={() => { setFromValue(preset.v); setFromUnit(preset.f); setToUnit(preset.t); }}
                      className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors"
                    >
                      {preset.v} {unitSymbols[preset.f]} → {unitSymbols[preset.t]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Result Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Result</h2>

              {/* Primary Result */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-5 border border-green-100 mb-4">
                <div className="text-center">
                  <div className="text-sm text-green-600 mb-1">
                    {fromValue} {unitNames[fromUnit]} =
                  </div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-700">{primaryResult}</div>
                  <div className="text-lg text-green-600">{unitNames[toUnit]}</div>
                </div>
              </div>

              {/* All Conversions */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">All Conversions</h3>
                <div className="grid grid-cols-2 gap-2 text-sm max-h-48 overflow-y-auto">
                  {Object.entries(allConversions).map(([unit, value]) => (
                    <div key={unit} className={`flex justify-between p-2 rounded ${unit === toUnit ? 'bg-green-100' : 'bg-white'}`}>
                      <span className="text-gray-600">{unitSymbols[unit]}:</span>
                      <span className="font-medium text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
        <FirebaseFAQs pageId="weight-converter" fallbackFaqs={fallbackFaqs} />
      </div>
{/* Related Calculators */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Related Calculators</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {relatedCalculators.map((calc) => (
              <Link
                key={calc.href}
                href={calc.href}
                className="p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
              >
                <div className="font-medium text-gray-900 text-sm group-hover:text-blue-700">{calc.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{calc.description}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
