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
type TempUnit = 'celsius' | 'fahrenheit' | 'kelvin' | 'rankine';

const unitNames: Record<TempUnit, string> = {
  celsius: 'Celsius',
  fahrenheit: 'Fahrenheit',
  kelvin: 'Kelvin',
  rankine: 'Rankine',
};

const unitSymbols: Record<TempUnit, string> = {
  celsius: '°C',
  fahrenheit: '°F',
  kelvin: 'K',
  rankine: '°R',
};

export default function TemperatureConverterClient() {
  const { getH1, getSubHeading } = usePageSEO('temperature-converter');

  const [inputValue, setInputValue] = useState<string>('100');
  const [fromUnit, setFromUnit] = useState<TempUnit>('celsius');
  const [toUnit, setToUnit] = useState<TempUnit>('fahrenheit');
  const [allConversions, setAllConversions] = useState<Record<TempUnit, string>>({
    celsius: '0',
    fahrenheit: '0',
    kelvin: '0',
    rankine: '0',
  });

  const toCelsius = (value: number, unit: TempUnit): number => {
    switch (unit) {
      case 'celsius': return value;
      case 'fahrenheit': return (value - 32) * 5 / 9;
      case 'kelvin': return value - 273.15;
      case 'rankine': return (value - 491.67) * 5 / 9;
      default: return value;
    }
  };

  const fromCelsius = (celsius: number, unit: TempUnit): number => {
    switch (unit) {
      case 'celsius': return celsius;
      case 'fahrenheit': return celsius * 9 / 5 + 32;
      case 'kelvin': return celsius + 273.15;
      case 'rankine': return (celsius + 273.15) * 9 / 5;
      default: return celsius;
    }
  };

  const formatNumber = (num: number): string => {
    if (isNaN(num) || !isFinite(num)) return '0';
    return num.toLocaleString('en-US', { maximumFractionDigits: 4 });
  };

  const convert = () => {
    const value = parseFloat(inputValue) || 0;
    const celsius = toCelsius(value, fromUnit);

    const conversions: Record<TempUnit, string> = {
      celsius: formatNumber(fromCelsius(celsius, 'celsius')),
      fahrenheit: formatNumber(fromCelsius(celsius, 'fahrenheit')),
      kelvin: formatNumber(fromCelsius(celsius, 'kelvin')),
      rankine: formatNumber(fromCelsius(celsius, 'rankine')),
    };

    setAllConversions(conversions);
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  useEffect(() => {
    convert();
  }, [inputValue, fromUnit]);

  const getFormula = (): string => {
    const formulas: Record<string, string> = {
      'celsius-fahrenheit': '°F = (°C × 9/5) + 32',
      'fahrenheit-celsius': '°C = (°F - 32) × 5/9',
      'celsius-kelvin': 'K = °C + 273.15',
      'kelvin-celsius': '°C = K - 273.15',
      'fahrenheit-kelvin': 'K = (°F - 32) × 5/9 + 273.15',
      'kelvin-fahrenheit': '°F = (K - 273.15) × 9/5 + 32',
      'celsius-rankine': '°R = (°C + 273.15) × 9/5',
      'rankine-celsius': '°C = (°R - 491.67) × 5/9',
    };
    return formulas[`${fromUnit}-${toUnit}`] || '';
  };

  const fallbackFaqs = [
    {
    id: '1',
    question: "How do I convert Celsius to Fahrenheit?",
      answer: "To convert Celsius to Fahrenheit, multiply the Celsius temperature by 9/5 (or 1.8) and then add 32. The formula is: °F = (°C × 9/5) + 32. For example, 25°C = (25 × 1.8) + 32 = 77°F.",
    order: 1
  },
    {
    id: '2',
    question: "How do I convert Fahrenheit to Celsius?",
      answer: "To convert Fahrenheit to Celsius, subtract 32 from the Fahrenheit temperature, then multiply by 5/9. The formula is: °C = (°F - 32) × 5/9. For example, 98.6°F = (98.6 - 32) × 5/9 = 37°C.",
    order: 2
  },
    {
    id: '3',
    question: "What is absolute zero?",
      answer: "Absolute zero is the lowest possible temperature where all molecular motion ceases. It equals 0 Kelvin, -273.15°C, or -459.67°F. It's a theoretical limit that cannot be achieved in practice.",
    order: 3
  },
    {
    id: '4',
    question: "What is the difference between Celsius and Fahrenheit?",
      answer: "Celsius is used by most countries worldwide and is based on water's freezing point (0°C) and boiling point (100°C). Fahrenheit is primarily used in the US and sets water's freezing at 32°F and boiling at 212°F.",
    order: 4
  },
    {
    id: '5',
    question: "What is Kelvin used for?",
      answer: "Kelvin is the SI base unit for temperature used in science. It starts at absolute zero (0K) and uses the same increment size as Celsius. It's essential for physics, chemistry, and astronomy calculations.",
    order: 5
  },
    {
    id: '6',
    question: "At what temperature are Celsius and Fahrenheit equal?",
      answer: "Celsius and Fahrenheit are equal at -40 degrees. At this point, -40°C = -40°F. This is the only temperature where both scales intersect.",
    order: 6
  }
  ];

  const relatedCalculators = [
    { href: '/us/tools/calculators/weight-converter', title: 'Weight Converter', description: 'Convert kg, lbs, oz' },
    { href: '/us/tools/calculators/length-converter', title: 'Length Converter', description: 'Meters, feet, inches' },
    { href: '/us/tools/calculators/unit-converter', title: 'Unit Converter', description: 'All unit conversions' },
    { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages' },
  ];

  const commonTemperatures = [
    { name: 'Absolute Zero', c: -273.15, f: -459.67 },
    { name: 'Water Freezes', c: 0, f: 32 },
    { name: 'Room Temperature', c: 20, f: 68 },
    { name: 'Body Temperature', c: 37, f: 98.6 },
    { name: 'Water Boils', c: 100, f: 212 },
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
            "name": "Temperature Converter",
            "description": "Free online temperature converter. Convert between Celsius, Fahrenheit, Kelvin, and Rankine instantly with formulas and explanations.",
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Any",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "featureList": ["Celsius to Fahrenheit", "Fahrenheit to Celsius", "Kelvin conversion", "Instant results"]
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
              { "@type": "ListItem", "position": 4, "name": "Temperature Converter", "item": "https://economictimes.com/us/tools/calculators/temperature-converter" }
            ]
          })
        }}
      />

      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">{getH1('Temperature Converter')}</h1>
          <p className="text-gray-600">Convert between Celsius, Fahrenheit, Kelvin, and Rankine</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Main Calculator */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
            {/* Input Section */}

      <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Enter Temperature</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    placeholder="Enter temperature"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                  <select
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value as TempUnit)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {(Object.keys(unitNames) as TempUnit[]).map((unit) => (
                      <option key={unit} value={unit}>{unitNames[unit]} ({unitSymbols[unit]})</option>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                  <select
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value as TempUnit)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {(Object.keys(unitNames) as TempUnit[]).map((unit) => (
                      <option key={unit} value={unit}>{unitNames[unit]} ({unitSymbols[unit]})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quick Examples */}
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Quick examples:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { v: '0', f: 'celsius', t: 'fahrenheit' },
                    { v: '100', f: 'celsius', t: 'fahrenheit' },
                    { v: '98.6', f: 'fahrenheit', t: 'celsius' },
                    { v: '273.15', f: 'kelvin', t: 'celsius' },
                  ].map((preset, i) => (
                    <button
                      key={i}
                      onClick={() => { setInputValue(preset.v); setFromUnit(preset.f as TempUnit); setToUnit(preset.t as TempUnit); }}
                      className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors"
                    >
                      {preset.v}{unitSymbols[preset.f as TempUnit]} → {unitSymbols[preset.t as TempUnit]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Result Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Result</h2>

              {/* Primary Result */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-5 border border-orange-100 mb-4">
                <div className="text-center">
                  <div className="text-sm text-orange-600 mb-1">
                    {inputValue}{unitSymbols[fromUnit]} =
                  </div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-700">
                    {allConversions[toUnit]}
                  </div>
                  <div className="text-lg text-orange-600">{unitNames[toUnit]}</div>
                </div>
              </div>

              {/* All Conversions */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {(Object.keys(unitNames) as TempUnit[]).map((unit) => (
                  <div key={unit} className={`p-3 rounded-lg ${unit === toUnit ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50'}`}>
                    <div className="text-xs text-gray-500">{unitNames[unit]}</div>
                    <div className="font-semibold text-gray-800">{allConversions[unit]} {unitSymbols[unit]}</div>
                  </div>
                ))}
              </div>

              {/* Formula */}
              {getFormula() && (
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <div className="text-xs text-blue-600 mb-1">Formula</div>
                  <div className="font-mono text-sm text-blue-800">{getFormula()}</div>
                </div>
              )}
            </div>
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

        {/* Common Reference Points */}
        {/* Mobile MREC2 - Before FAQs */}

        <CalculatorMobileMrec2 />


        {/* FAQs Section - Firebase Powered */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="temperature-converter" fallbackFaqs={fallbackFaqs} />
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
