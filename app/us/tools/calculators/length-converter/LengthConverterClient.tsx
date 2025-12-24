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
const conversionFactors: Record<string, number> = {
  km: 1000,
  m: 1,
  cm: 0.01,
  mm: 0.001,
  mi: 1609.344,
  yd: 0.9144,
  ft: 0.3048,
  in: 0.0254,
  nm: 1852,
  fur: 201.168,
};

const unitNames: Record<string, string> = {
  km: 'Kilometers',
  m: 'Meters',
  cm: 'Centimeters',
  mm: 'Millimeters',
  mi: 'Miles',
  yd: 'Yards',
  ft: 'Feet',
  in: 'Inches',
  nm: 'Nautical Miles',
  fur: 'Furlongs',
};

const unitSymbols: Record<string, string> = {
  km: 'km',
  m: 'm',
  cm: 'cm',
  mm: 'mm',
  mi: 'mi',
  yd: 'yd',
  ft: 'ft',
  in: 'in',
  nm: 'nmi',
  fur: 'fur',
};

export default function LengthConverterClient() {
  const { getH1, getSubHeading } = usePageSEO('length-converter');

  const [fromValue, setFromValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('ft');
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
    const meters = value * conversionFactors[fromUnit];

    const conversions: Record<string, string> = {};
    Object.keys(conversionFactors).forEach(unit => {
      const result = meters / conversionFactors[unit];
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
    question: "How many feet are in a meter?",
      answer: "There are exactly 3.28084 feet in one meter. To convert meters to feet, multiply the meter value by 3.28084. For example, 5 meters = 16.4042 feet.",
    order: 1
  },
    {
    id: '2',
    question: "How do I convert miles to kilometers?",
      answer: "To convert miles to kilometers, multiply the mile value by 1.60934. For example, 10 miles = 16.0934 kilometers. Conversely, to convert km to miles, multiply by 0.621371.",
    order: 2
  },
    {
    id: '3',
    question: "What is the difference between metric and imperial units?",
      answer: "The metric system (meters, kilometers, centimeters) is based on powers of 10 and is used worldwide. The imperial system (feet, inches, miles, yards) is primarily used in the United States. The metric system is generally considered easier for calculations due to its decimal nature.",
    order: 3
  },
    {
    id: '4',
    question: "How many inches are in a centimeter?",
      answer: "There are approximately 0.3937 inches in one centimeter. Conversely, one inch equals exactly 2.54 centimeters. This is the exact conversion factor defined internationally.",
    order: 4
  },
    {
    id: '5',
    question: "What is a nautical mile?",
      answer: "A nautical mile is a unit of length used in maritime and aviation navigation. It equals exactly 1,852 meters or approximately 1.15078 statute miles. It's based on the circumference of the Earth.",
    order: 5
  }
  ];

  const relatedCalculators = [
    { href: '/us/tools/calculators/weight-converter', title: 'Weight Converter', description: 'Convert kg, lbs, oz' },
    { href: '/us/tools/calculators/temperature-converter', title: 'Temperature Converter', description: 'Celsius, Fahrenheit' },
    { href: '/us/tools/calculators/area-calculator', title: 'Area Calculator', description: 'Calculate areas' },
    { href: '/us/tools/calculators/unit-converter', title: 'Unit Converter', description: 'All unit conversions' },
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
            "name": "Length Converter",
            "description": "Free online length converter tool. Convert between meters, feet, inches, kilometers, miles, and more length units instantly.",
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "Convert between 10+ length units",
              "Instant real-time conversion",
              "Metric and Imperial units",
              "Mobile-friendly interface"
            ]
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
              { "@type": "ListItem", "position": 4, "name": "Length Converter", "item": "https://economictimes.com/us/tools/calculators/length-converter" }
            ]
          })
        }}
      />

      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">{getH1('Length Converter')}</h1>
          <p className="text-gray-600">Convert between metric and imperial length units instantly</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Main Calculator */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
            {/* Input Section */}

      <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Convert From</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                  <input
                    type="number"
                    value={fromValue}
                    onChange={(e) => setFromValue(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    placeholder="Enter value"
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
                    title="Swap units"
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
                    { v: '1', f: 'm', t: 'ft' },
                    { v: '1', f: 'km', t: 'mi' },
                    { v: '1', f: 'in', t: 'cm' },
                    { v: '100', f: 'cm', t: 'in' },
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
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-100 mb-4">
                <div className="text-center">
                  <div className="text-sm text-blue-600 mb-1">
                    {fromValue} {unitNames[fromUnit]} =
                  </div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-700">{primaryResult}</div>
                  <div className="text-lg text-blue-600">{unitNames[toUnit]}</div>
                </div>
              </div>

              {/* All Conversions */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">All Conversions</h3>
                <div className="grid grid-cols-2 gap-2 text-sm max-h-48 overflow-y-auto">
                  {Object.entries(allConversions).map(([unit, value]) => (
                    <div key={unit} className={`flex justify-between p-2 rounded ${unit === toUnit ? 'bg-blue-100' : 'bg-white'}`}>
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
        <FirebaseFAQs pageId="length-converter" fallbackFaqs={fallbackFaqs} />
      </div>

        {/* How to Use */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">How to Use the Length Converter</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
            <li>Enter the value you want to convert in the input field</li>
            <li>Select the unit you're converting from (e.g., meters, feet)</li>
            <li>Select the unit you want to convert to</li>
            <li>The result appears instantly - no button click needed</li>
            <li>View all unit conversions in the results panel</li>
          </ol>
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
