'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CalculatorMobileMrec2 } from '@/components/BannerPlacements';
import { FirebaseFAQs } from '@/components/PageSEOContent';

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

const faqs = [
  {
    question: "How many miles is 1 kilometer?",
    answer: "1 kilometer is equal to approximately 0.621371 miles. To convert kilometers to miles, multiply the kilometer value by 0.621371."
  },
  {
    question: "How many kilometers is 1 mile?",
    answer: "1 mile is equal to approximately 1.60934 kilometers. To convert miles to kilometers, multiply the mile value by 1.60934."
  },
  {
    question: "Why do most countries use kilometers instead of miles?",
    answer: "Most countries use kilometers because they adopted the metric system, which is based on powers of 10 and is easier for scientific calculations. The metric system was developed in France in the 1790s and has since become the international standard."
  },
  {
    question: "What is the Fibonacci trick for km to miles conversion?",
    answer: "Consecutive Fibonacci numbers (1, 1, 2, 3, 5, 8, 13, 21...) closely approximate km to mile conversions! For example: 5 km ≈ 3 miles, 8 km ≈ 5 miles, 13 km ≈ 8 miles. This works because the ratio between consecutive Fibonacci numbers approaches the golden ratio (1.618), which is close to the km-to-mile conversion factor (1.609)."
  },
  {
    question: "How long is a 5K run in miles?",
    answer: "A 5K run is exactly 5 kilometers, which equals 3.107 miles. It's a popular distance for beginner runners and charity events."
  },
  {
    question: "How long is a marathon in both kilometers and miles?",
    answer: "A marathon is exactly 42.195 kilometers or 26.219 miles. The distance was standardized in 1921 based on the 1908 London Olympics course."
  }
];

const relatedCalculators = [
  { href: '/us/tools/calculators/miles-to-kilometers-calculator', title: 'Miles to Kilometers', description: 'Convert miles to km' },
  { href: '/us/tools/calculators/length-converter', title: 'Length Converter', description: 'All length units' },
  { href: '/us/tools/calculators/unit-converter', title: 'Unit Converter', description: 'Convert any units' },
  { href: '/us/tools/calculators/fuel-economy-converter', title: 'Fuel Economy Converter', description: 'MPG and L/100km' },
  { href: '/us/tools/calculators/temperature-converter', title: 'Temperature Converter', description: 'Convert temperature' },
  { href: '/us/tools/calculators/weight-converter', title: 'Weight Converter', description: 'Convert weight units' },
];

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Kilometers To Miles Calculator?",
    answer: "A Kilometers To Miles Calculator is a free online tool designed to help you quickly and accurately calculate kilometers to miles-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Kilometers To Miles Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Kilometers To Miles Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Kilometers To Miles Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function KilometersToMilesCalculatorClient() {
  const [inputValue, setInputValue] = useState(10);
  const [direction, setDirection] = useState('km-to-mi');

  const KM_TO_MILES = 0.621371;
  const MILES_TO_KM = 1.60934;

  const formatNumber = (num: number, decimals = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };

  const formatLargeNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(Math.round(num));
  };

  const formatTime = (hours: number) => {
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes}m`;
    } else {
      const h = Math.floor(hours);
      const m = Math.round((hours - h) * 60);
      return m > 0 ? `${h}h ${m}m` : `${h}h`;
    }
  };

  let km, miles;

  if (direction === 'km-to-mi') {
    km = inputValue;
    miles = km * KM_TO_MILES;
  } else {
    miles = inputValue;
    km = miles * MILES_TO_KM;
  }

  // Additional units
  const meters = km * 1000;
  const feet = km * 3280.84;
  const yards = km * 1093.61;

  // Travel times
  const walkingTime = miles / 3;
  const runningTime = miles / 6;
  const drivingTime = miles / 60;

  const setDistance = (value: number) => {
    setInputValue(value);
  };

  const copyResults = () => {
    const primaryResult = direction === 'km-to-mi' ? `${formatNumber(miles)} miles` : `${formatNumber(km)} km`;

    const resultsText = `Distance Conversion Results

Input: ${inputValue} ${direction === 'km-to-mi' ? 'kilometers' : 'miles'}
Result: ${primaryResult}

Additional Units:
${formatLargeNumber(meters)} m
${formatLargeNumber(feet)} ft`;

    navigator.clipboard.writeText(resultsText).then(() => {
      alert('✅ Results copied to clipboard!');
    });
  };

  const commonDistances = [
    { name: '5K Run', km: 5.0, miles: 3.11 },
    { name: '10K Run', km: 10.0, miles: 6.21 },
    { name: 'Half Marathon', km: 21.1, miles: 13.11 },
    { name: 'Marathon', km: 42.2, miles: 26.22 },
    { name: 'Average Commute', km: 25.7, miles: 16 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Kilometers to Miles Calculator",
          "description": "Free online calculator to convert kilometers to miles and vice versa. Perfect for travel, running, and international distance conversions.",
          "url": "https://www.example.com/us/tools/calculators/kilometers-to-miles-calculator",
          "applicationCategory": "UtilityApplication",
          "operatingSystem": "Any",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "featureList": [
            "Kilometers to miles conversion",
            "Miles to kilometers conversion",
            "Travel time estimates",
            "Running distance references"
          ]
        })
      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs.map(faq => ({
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
            { "@type": "ListItem", "position": 4, "name": "Kilometers to Miles Calculator", "item": "https://www.example.com/us/tools/calculators/kilometers-to-miles-calculator" }
          ]
        })
      }} />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-8">
      {/* Header */}
      <header className="text-center mb-6 md:mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
          Kilometers to Miles Calculator
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
          Convert between kilometers and miles instantly. Perfect for travel planning, running distances, and international conversions.
        </p>
      </header>

      {/* Main Layout */}
      <div className="grid lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
        {/* Left Column: Inputs (2/3) */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Distance Converter */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Distance Converter</h3>

            {/* Direction Toggle */}
            <div className="mb-4 md:mb-6">
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2 md:mb-3">Conversion Direction:</label>
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="direction"
                    value="km-to-mi"
                    checked={direction === 'km-to-mi'}
                    onChange={(e) => setDirection(e.target.value)}
                    className="peer sr-only"
                  />
                  <div className="p-3 border-2 border-gray-300 rounded-lg text-center peer-checked:border-blue-600 peer-checked:bg-blue-50 transition-all hover:bg-gray-50">
                    <div className="text-base md:text-lg font-semibold">📏 Kilometers → Miles</div>
                    <div className="text-xs text-gray-500">km × 0.621371</div>
                  </div>
                </label>

                <label className="cursor-pointer">
                  <input
                    type="radio"
                    name="direction"
                    value="mi-to-km"
                    checked={direction === 'mi-to-km'}
                    onChange={(e) => setDirection(e.target.value)}
                    className="peer sr-only"
                  />
                  <div className="p-3 border-2 border-gray-300 rounded-lg text-center peer-checked:border-green-600 peer-checked:bg-green-50 transition-all hover:bg-gray-50">
                    <div className="text-base md:text-lg font-semibold">📐 Miles → Kilometers</div>
                    <div className="text-xs text-gray-500">mi × 1.60934</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Input Section */}
            <div className="mb-4 md:mb-6">
              <label htmlFor="inputValue" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                Enter Distance
              </label>
              <input
                type="number"
                id="inputValue"
                value={inputValue}
                onChange={(e) => setInputValue(Number(e.target.value))}
                min="0"
                step="0.01"
                className="w-full px-3 md:px-2 py-2 md:py-3 border-2 border-gray-300 rounded-lg text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Enter distance..."
              />
            </div>

            {/* Quick Presets */}
            <div className="mb-4 md:mb-6">
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2 md:mb-3">Quick Distances:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3">
                <button onClick={() => setDistance(1)} className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-xs md:text-sm font-semibold hover:bg-blue-200 transition-all">
                  1 km
                </button>
                <button onClick={() => setDistance(5)} className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-xs md:text-sm font-semibold hover:bg-green-200 transition-all">
                  5 km (5K)
                </button>
                <button onClick={() => setDistance(10)} className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-xs md:text-sm font-semibold hover:bg-purple-200 transition-all">
                  10 km (10K)
                </button>
                <button onClick={() => setDistance(42.195)} className="px-3 py-2 bg-orange-100 text-orange-700 rounded-lg text-xs md:text-sm font-semibold hover:bg-orange-200 transition-all">
                  Marathon
                </button>
              </div>
            </div>

            {/* Formula Display */}
            <div className="grid md:grid-cols-2 gap-3 md:gap-4">
              <div className="p-3 md:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="text-xs font-medium text-gray-700 mb-1">km → miles:</div>
                <div className="font-mono text-xs md:text-sm text-blue-700">miles = km × 0.621371</div>
              </div>
              <div className="p-3 md:p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="text-xs font-medium text-gray-700 mb-1">miles → km:</div>
                <div className="font-mono text-xs md:text-sm text-green-700">km = miles × 1.60934</div>
              </div>
            </div>
          </div>

          {/* Common Distances Table */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Common Distance References</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-200">
                    <th className="px-3 py-2 md:px-4 md:py-3 text-left font-semibold text-gray-900">Distance</th>
                    <th className="px-3 py-2 md:px-4 md:py-3 text-left font-semibold text-gray-900">Kilometers</th>
                    <th className="px-3 py-2 md:px-4 md:py-3 text-left font-semibold text-gray-900">Miles</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {commonDistances.map((distance, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-3 py-2 md:px-4 md:py-3 font-medium">{distance.name}</td>
                      <td className="px-3 py-2 md:px-4 md:py-3">{distance.km} km</td>
                      <td className="px-3 py-2 md:px-4 md:py-3">{distance.miles} miles</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Results (1/3) */}
        <div className="space-y-4 md:space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 sticky top-4">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
              <span>📊</span> Results
            </h3>

            {/* Primary Result */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 md:p-4 mb-3 md:mb-4 border-2 border-blue-200">
              <div className="text-xs md:text-sm text-gray-600 mb-1">Converted Value</div>
              <div className="text-2xl md:text-3xl font-bold text-blue-700 break-words">
                {direction === 'km-to-mi' ? `${formatNumber(miles)} miles` : `${formatNumber(km)} km`}
              </div>
            </div>

            {/* Additional Units */}
            <div className="space-y-2 md:space-y-3">
              <div className="bg-gray-50 rounded-lg p-2 md:p-3 border border-gray-200">
                <div className="text-xs text-gray-600">Meters</div>
                <div className="text-base md:text-lg font-bold text-gray-900">{formatLargeNumber(meters)} m</div>
              </div>

              <div className="bg-gray-50 rounded-lg p-2 md:p-3 border border-gray-200">
                <div className="text-xs text-gray-600">Feet</div>
                <div className="text-base md:text-lg font-bold text-gray-900">{formatLargeNumber(feet)} ft</div>
              </div>

              <div className="bg-gray-50 rounded-lg p-2 md:p-3 border border-gray-200">
                <div className="text-xs text-gray-600">Yards</div>
                <div className="text-base md:text-lg font-bold text-gray-900">{formatLargeNumber(yards)} yd</div>
              </div>
            </div>

            {/* Travel Time Context */}
            <div className="mt-4 md:mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-xs md:text-sm font-semibold text-gray-900 mb-2 md:mb-3">Travel Time Estimates</h4>
              <div className="space-y-2 text-xs md:text-sm">
                <div className="flex justify-between text-gray-700">
                  <span>Walking (3 mph):</span>
                  <span className="font-bold text-gray-900">{formatTime(walkingTime)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Running (6 mph):</span>
                  <span className="font-bold text-gray-900">{formatTime(runningTime)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Driving (60 mph):</span>
                  <span className="font-bold text-gray-900">{formatTime(drivingTime)}</span>
                </div>
              </div>
            </div>

            {/* Copy Button */}
            <button
              onClick={copyResults}
              className="w-full mt-4 md:mt-6 px-3 md:px-2 py-2 md:py-3 bg-blue-600 text-white rounded-lg text-xs md:text-sm font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
            >
              <span>📋</span> Copy Results
            </button>
          </div>
        </div>
      </div>

      {/* Additional Information Sections */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Understanding the Units */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
            <span>📚</span> Understanding the Units
          </h3>
          <div className="space-y-3 text-xs md:text-sm text-gray-700">
            <div>
              <strong className="text-gray-900">Kilometer (km):</strong>
              <p className="mt-1">Part of the metric system. 1 km = 1,000 meters. Used by most countries worldwide for measuring distance.</p>
            </div>
            <div>
              <strong className="text-gray-900">Mile (mi):</strong>
              <p className="mt-1">Part of the imperial system. 1 mile = 5,280 feet or 1,760 yards. Primarily used in the US, UK, and Myanmar.</p>
            </div>
            <div>
              <strong className="text-gray-900">Origin:</strong>
              <p className="mt-1">Mile comes from Roman "mille passus" (1,000 paces). Kilometer was introduced during the French Revolution as part of the metric system.</p>
            </div>
          </div>
        </div>

        {/* Quick Mental Math */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
            <span>🧮</span> Quick Mental Math
          </h3>
          <div className="space-y-3 text-xs md:text-sm text-gray-700">
            <div>
              <strong className="text-gray-900">Simple Rule:</strong>
              <p className="mt-1">To convert km to miles quickly, divide by 1.6. For miles to km, multiply by 1.6.</p>
            </div>
            <div>
              <strong className="text-gray-900">Fibonacci Trick:</strong>
              <p className="mt-1">Consecutive Fibonacci numbers approximate the conversion! 5 km ≈ 3 miles, 8 km ≈ 5 miles, 13 km ≈ 8 miles.</p>
            </div>
            <div>
              <strong className="text-gray-900">Example:</strong>
              <p className="mt-1 font-mono bg-gray-50 p-2 rounded">100 km ÷ 1.6 ≈ 62.5 miles<br/>50 miles × 1.6 = 80 km</p>
            </div>
          </div>
        </div>

        {/* Speed Limits */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
            <span>🚗</span> Common Speed Limits
          </h3>
          <div className="space-y-2 text-xs md:text-sm">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-gray-700">30 mph (residential)</span>
              <span className="font-semibold text-gray-900">48 km/h</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-gray-700">55 mph (highway)</span>
              <span className="font-semibold text-gray-900">89 km/h</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-gray-700">65 mph (highway)</span>
              <span className="font-semibold text-gray-900">105 km/h</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-gray-700">70 mph (highway)</span>
              <span className="font-semibold text-gray-900">113 km/h</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-gray-700">100 km/h (Europe)</span>
              <span className="font-semibold text-gray-900">62 mph</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-gray-700">130 km/h (Germany)</span>
              <span className="font-semibold text-gray-900">81 mph</span>
            </div>
          </div>
        </div>

        {/* Running Distances */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
            <span>🏃</span> Running & Race Distances
          </h3>
          <div className="space-y-2 text-xs md:text-sm">
            <div className="p-2 bg-blue-50 rounded border border-blue-200">
              <div className="font-semibold text-blue-900">5K Run</div>
              <div className="text-blue-700">5 km = 3.11 miles (Beginner friendly)</div>
            </div>
            <div className="p-2 bg-green-50 rounded border border-green-200">
              <div className="font-semibold text-green-900">10K Run</div>
              <div className="text-green-700">10 km = 6.21 miles (Popular distance)</div>
            </div>
            <div className="p-2 bg-purple-50 rounded border border-purple-200">
              <div className="font-semibold text-purple-900">Half Marathon</div>
              <div className="text-purple-700">21.1 km = 13.11 miles</div>
            </div>
            <div className="p-2 bg-orange-50 rounded border border-orange-200">
              <div className="font-semibold text-orange-900">Marathon</div>
              <div className="text-orange-700">42.195 km = 26.22 miles</div>
            </div>
            <div className="p-2 bg-red-50 rounded border border-red-200">
              <div className="font-semibold text-red-900">Ultra Marathon</div>
              <div className="text-red-700">50 km = 31.07 miles (and beyond)</div>
            </div>
          </div>
        </div>

        {/* Travel Tips */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
            <span>✈️</span> Travel Tips
          </h3>
          <ul className="space-y-2 text-xs md:text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span><strong>Rental Cars:</strong> Check if the speedometer shows mph or km/h to avoid speeding tickets abroad.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">•</span>
              <span><strong>GPS Settings:</strong> Change your navigation app units before international trips.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span><strong>Road Signs:</strong> Most countries using km don't include units on signs - just numbers.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 font-bold">•</span>
              <span><strong>Fuel Efficiency:</strong> Remember to convert L/100km ↔ mpg for comparison.</span>
            </li>
          </ul>
        </div>

        {/* When to Use Each */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
            <span>🌍</span> Global Usage
          </h3>
          <div className="space-y-3 text-xs md:text-sm text-gray-700">
            <div>
              <strong className="text-green-900">Countries Using Kilometers:</strong>
              <p className="mt-1">195+ countries including Canada, Mexico, all European countries, Australia, China, Japan, India, Brazil, and most of the world.</p>
            </div>
            <div>
              <strong className="text-blue-900">Countries Using Miles:</strong>
              <p className="mt-1">USA (primary), UK (roads only), Liberia, and Myanmar. Note: UK uses miles for roads but km for running.</p>
            </div>
            <div className="p-2 bg-yellow-50 rounded border border-yellow-200">
              <strong className="text-yellow-900">💡 Pro Tip:</strong>
              <span className="text-yellow-800"> When traveling, always know which system the country uses to avoid confusion!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQs Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <details key={index} className="group">
              <summary className="flex justify-between items-center cursor-pointer list-none p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="font-medium text-gray-800 pr-4">{faq.question}</span>
                <svg className="w-5 h-5 text-gray-500 flex-shrink-0 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="mt-2 px-4 pb-4 text-gray-600">{faq.answer}</div>
            </details>
          ))}
        </div>
      </div>

      {/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
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

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="kilometers-to-miles-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
