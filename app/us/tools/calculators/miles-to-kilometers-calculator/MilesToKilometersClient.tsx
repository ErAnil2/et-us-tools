'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
const KM_TO_MILES = 0.621371;
const MILES_TO_KM = 1.60934;

const fallbackFaqs = [
  {
    id: '1',
    question: "How many kilometers is 1 mile?",
    answer: "1 mile is equal to approximately 1.60934 kilometers. To convert miles to kilometers, multiply the mile value by 1.60934.",
    order: 1
  },
  {
    id: '2',
    question: "How many miles is 1 kilometer?",
    answer: "1 kilometer is equal to approximately 0.621371 miles. To convert kilometers to miles, multiply the kilometer value by 0.621371.",
    order: 2
  },
  {
    id: '3',
    question: "Why do most countries use kilometers instead of miles?",
    answer: "Most countries use kilometers because they adopted the metric system, which is based on powers of 10 and is easier for scientific calculations. The metric system was developed in France in the 1790s and has since become the international standard.",
    order: 3
  },
  {
    id: '4',
    question: "What is the Fibonacci trick for miles to km conversion?",
    answer: "Consecutive Fibonacci numbers (1, 1, 2, 3, 5, 8, 13, 21...) closely approximate mile to km conversions! For example: 3 miles ≈ 5 km, 5 miles ≈ 8 km, 8 miles ≈ 13 km. This works because the ratio between consecutive Fibonacci numbers approaches the golden ratio (1.618), which is close to the conversion factor (1.609).",
    order: 4
  },
  {
    id: '5',
    question: "How long is a marathon in miles and kilometers?",
    answer: "A marathon is exactly 26.219 miles or 42.195 kilometers. The distance was standardized in 1921 based on the 1908 London Olympics course.",
    order: 5
  },
  {
    id: '6',
    question: "What countries still use miles?",
    answer: "Only the United States (primary), United Kingdom (for road distances), Liberia, and Myanmar still use miles for everyday distance measurements. The UK is unique in using miles for roads but kilometers for running races.",
    order: 6
  }
];

const relatedCalcs = [
  { href: '/us/tools/calculators/kilometers-to-miles-calculator', title: 'Kilometers to Miles', description: 'Convert km to miles' },
  { href: '/us/tools/calculators/length-converter', title: 'Length Converter', description: 'All length units' },
  { href: '/us/tools/calculators/unit-converter', title: 'Unit Converter', description: 'Convert any units' },
  { href: '/us/tools/calculators/fuel-economy-converter', title: 'Fuel Economy Converter', description: 'MPG and L/100km' },
  { href: '/us/tools/calculators/temperature-converter', title: 'Temperature Converter', description: 'Convert temperature' },
  { href: '/us/tools/calculators/weight-converter', title: 'Weight Converter', description: 'Convert weight units' },
];

export default function MilesToKilometersClient() {
  const { getH1, getSubHeading } = usePageSEO('miles-to-kilometers-calculator');

  const [inputValue, setInputValue] = useState<string>('10');
  const [direction, setDirection] = useState<string>('mi-to-km');
  const [primaryResult, setPrimaryResult] = useState<string>('16.09 km');
  const [meters, setMeters] = useState<string>('16,093 m');
  const [feet, setFeet] = useState<string>('52,808 ft');
  const [yards, setYards] = useState<string>('17,603 yd');
  const [walkingTime, setWalkingTime] = useState<string>('3h 20m');
  const [runningTime, setRunningTime] = useState<string>('1h 40m');
  const [drivingTime, setDrivingTime] = useState<string>('10m');

  const formatNumber = (num: number, decimals: number = 2): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };

  const formatLargeNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(Math.round(num));
  };

  const formatTime = (hours: number): string => {
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes}m`;
    } else {
      const h = Math.floor(hours);
      const m = Math.round((hours - h) * 60);
      return m > 0 ? `${h}h ${m}m` : `${h}h`;
    }
  };

  const calculate = () => {
    const value = parseFloat(inputValue) || 0;
    let km: number, miles: number;

    if (direction === 'mi-to-km') {
      miles = value;
      km = miles * MILES_TO_KM;
      setPrimaryResult(`${formatNumber(km)} km`);
    } else {
      km = value;
      miles = km * KM_TO_MILES;
      setPrimaryResult(`${formatNumber(miles)} miles`);
    }

    // Update additional units
    const metersValue = km * 1000;
    const feetValue = km * 3280.84;
    const yardsValue = km * 1093.61;

    setMeters(`${formatLargeNumber(metersValue)} m`);
    setFeet(`${formatLargeNumber(feetValue)} ft`);
    setYards(`${formatLargeNumber(yardsValue)} yd`);

    // Update travel times
    const walkingTimeVal = miles / 3;
    const runningTimeVal = miles / 6;
    const drivingTimeVal = miles / 60;

    setWalkingTime(formatTime(walkingTimeVal));
    setRunningTime(formatTime(runningTimeVal));
    setDrivingTime(formatTime(drivingTimeVal));
  };

  const setDistance = (value: number) => {
    setInputValue(value.toString());
  };

  const copyResults = () => {
    const directionText = direction === 'mi-to-km' ? 'miles' : 'kilometers';
    const results = `Distance Conversion Results

Input: ${inputValue} ${directionText}
Result: ${primaryResult}

Additional Units:
${meters}
${feet}`;

    navigator.clipboard.writeText(results).then(() => {
      alert('Results copied to clipboard!');
    });
  };

  useEffect(() => {
    calculate();
  }, [inputValue, direction]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Miles to Kilometers Calculator",
          "description": "Free online calculator to convert miles to kilometers and vice versa. Perfect for travel, running, and international distance conversions.",
          "url": "https://www.example.com/us/tools/calculators/miles-to-kilometers-calculator",
          "applicationCategory": "UtilityApplication",
          "operatingSystem": "Any",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "featureList": [
            "Miles to kilometers conversion",
            "Kilometers to miles conversion",
            "Travel time estimates",
            "Running distance references"
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
            { "@type": "ListItem", "position": 4, "name": "Miles to Kilometers Calculator", "item": "https://www.example.com/us/tools/calculators/miles-to-kilometers-calculator" }
          ]
        })
      }} />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-8">
      {/* Header */}
      <header className="text-center mb-6 md:mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">{getH1('Miles to Kilometers Calculator')}</h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
          Convert between miles and kilometers instantly. Perfect for travel planning, fitness tracking, and international distance measurements.
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
                onChange={(e) => setInputValue(e.target.value)}
                min="0"
                step="0.01"
                className="w-full px-3 md:px-2 py-2 md:py-3 border-2 border-gray-300 rounded-lg text-sm md:text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                placeholder="Enter distance..."
              />
            </div>

            {/* Quick Presets */}
            <div className="mb-4 md:mb-6">
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2 md:mb-3">Quick Distances:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3">
                <button onClick={() => setDistance(1)} className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-xs md:text-sm font-semibold hover:bg-green-200 transition-all">
                  1 mile
                </button>
                <button onClick={() => setDistance(5)} className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-xs md:text-sm font-semibold hover:bg-blue-200 transition-all">
                  5 miles
                </button>
                <button onClick={() => setDistance(10)} className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-xs md:text-sm font-semibold hover:bg-purple-200 transition-all">
                  10 miles
                </button>
                <button onClick={() => setDistance(26.219)} className="px-3 py-2 bg-orange-100 text-orange-700 rounded-lg text-xs md:text-sm font-semibold hover:bg-orange-200 transition-all">
                  Marathon
                </button>
              </div>
            </div>

            {/* Formula Display */}
            <div className="grid md:grid-cols-2 gap-3 md:gap-4">
              <div className="p-3 md:p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="text-xs font-medium text-gray-700 mb-1">miles → km:</div>
                <div className="font-mono text-xs md:text-sm text-green-700">km = miles × 1.60934</div>
              </div>
              <div className="p-3 md:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="text-xs font-medium text-gray-700 mb-1">km → miles:</div>
                <div className="font-mono text-xs md:text-sm text-blue-700">miles = km × 0.621371</div>
              </div>
            </div>
          </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

          {/* Common Distances Table */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Common Distance References</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-green-200">
                    <th className="px-3 py-2 md:px-4 md:py-3 text-left font-semibold text-gray-900">Distance</th>
                    <th className="px-3 py-2 md:px-4 md:py-3 text-left font-semibold text-gray-900">Miles</th>
                    <th className="px-3 py-2 md:px-4 md:py-3 text-left font-semibold text-gray-900">Kilometers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-2 md:px-4 md:py-3 font-medium">5K Run</td>
                    <td className="px-3 py-2 md:px-4 md:py-3">3.11 miles</td>
                    <td className="px-3 py-2 md:px-4 md:py-3">5.0 km</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-2 md:px-4 md:py-3 font-medium">10K Run</td>
                    <td className="px-3 py-2 md:px-4 md:py-3">6.21 miles</td>
                    <td className="px-3 py-2 md:px-4 md:py-3">10.0 km</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-2 md:px-4 md:py-3 font-medium">Half Marathon</td>
                    <td className="px-3 py-2 md:px-4 md:py-3">13.11 miles</td>
                    <td className="px-3 py-2 md:px-4 md:py-3">21.1 km</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-2 md:px-4 md:py-3 font-medium">Marathon</td>
                    <td className="px-3 py-2 md:px-4 md:py-3">26.22 miles</td>
                    <td className="px-3 py-2 md:px-4 md:py-3">42.2 km</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-2 md:px-4 md:py-3 font-medium">Average Commute</td>
                    <td className="px-3 py-2 md:px-4 md:py-3">16 miles</td>
                    <td className="px-3 py-2 md:px-4 md:py-3">25.7 km</td>
                  </tr>
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
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 md:p-4 mb-3 md:mb-4 border-2 border-green-200">
              <div className="text-xs md:text-sm text-gray-600 mb-1">Converted Value</div>
              <div className="text-2xl md:text-3xl font-bold text-green-700 break-words">{primaryResult}</div>
            </div>

            {/* Additional Units */}
            <div className="space-y-2 md:space-y-3">
              <div className="bg-gray-50 rounded-lg p-2 md:p-3 border border-gray-200">
                <div className="text-xs text-gray-600">Meters</div>
                <div className="text-base md:text-lg font-bold text-gray-900">{meters}</div>
              </div>

              <div className="bg-gray-50 rounded-lg p-2 md:p-3 border border-gray-200">
                <div className="text-xs text-gray-600">Feet</div>
                <div className="text-base md:text-lg font-bold text-gray-900">{feet}</div>
              </div>

              <div className="bg-gray-50 rounded-lg p-2 md:p-3 border border-gray-200">
                <div className="text-xs text-gray-600">Yards</div>
                <div className="text-base md:text-lg font-bold text-gray-900">{yards}</div>
              </div>
            </div>

            {/* Travel Time Context */}
            <div className="mt-4 md:mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-xs md:text-sm font-semibold text-gray-900 mb-2 md:mb-3">Travel Time Estimates</h4>
              <div className="space-y-2 text-xs md:text-sm">
                <div className="flex justify-between text-gray-700">
                  <span>Walking (3 mph):</span>
                  <span className="font-bold text-gray-900">{walkingTime}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Running (6 mph):</span>
                  <span className="font-bold text-gray-900">{runningTime}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Driving (60 mph):</span>
                  <span className="font-bold text-gray-900">{drivingTime}</span>
                </div>
              </div>
            </div>

            {/* Copy Button */}
            <button
              onClick={copyResults}
              className="w-full mt-4 md:mt-6 px-3 md:px-2 py-2 md:py-3 bg-green-600 text-white rounded-lg text-xs md:text-sm font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
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
              <strong className="text-gray-900">Mile (mi):</strong>
              <p className="mt-1">Part of the imperial system. 1 mile = 5,280 feet or 1,760 yards. Primarily used in the US, UK, and Myanmar.</p>
            </div>
            <div>
              <strong className="text-gray-900">Kilometer (km):</strong>
              <p className="mt-1">Part of the metric system. 1 km = 1,000 meters. Used by most countries worldwide for measuring distance.</p>
            </div>
            <div>
              <strong className="text-gray-900">Origin:</strong>
              <p className="mt-1">Mile comes from Roman &quot;mille passus&quot; (1,000 paces). Kilometer was introduced during the French Revolution as part of the metric system.</p>
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
              <p className="mt-1">To convert miles to km quickly, multiply by 1.6. For km to miles, divide by 1.6.</p>
            </div>
            <div>
              <strong className="text-gray-900">Fibonacci Trick:</strong>
              <p className="mt-1">Consecutive Fibonacci numbers approximate the conversion! 3 miles ≈ 5 km, 5 miles ≈ 8 km, 8 miles ≈ 13 km.</p>
            </div>
            <div>
              <strong className="text-gray-900">Example:</strong>
              <p className="mt-1 font-mono bg-gray-50 p-2 rounded">50 miles × 1.6 = 80 km<br />100 km ÷ 1.6 ≈ 62.5 miles</p>
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
              <div className="text-blue-700">3.11 miles = 5 km (Beginner friendly)</div>
            </div>
            <div className="p-2 bg-green-50 rounded border border-green-200">
              <div className="font-semibold text-green-900">10K Run</div>
              <div className="text-green-700">6.21 miles = 10 km (Popular distance)</div>
            </div>
            <div className="p-2 bg-purple-50 rounded border border-purple-200">
              <div className="font-semibold text-purple-900">Half Marathon</div>
              <div className="text-purple-700">13.11 miles = 21.1 km</div>
            </div>
            <div className="p-2 bg-orange-50 rounded border border-orange-200">
              <div className="font-semibold text-orange-900">Marathon</div>
              <div className="text-orange-700">26.22 miles = 42.195 km</div>
            </div>
            <div className="p-2 bg-red-50 rounded border border-red-200">
              <div className="font-semibold text-red-900">Ultra Marathon</div>
              <div className="text-red-700">31.07 miles = 50 km (and beyond)</div>
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
              <span><strong>Road Signs:</strong> Most countries using km don&apos;t include units on signs - just numbers.</span>
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

      {/* FAQs Section - Firebase Powered */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="miles-to-kilometers-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
{/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {relatedCalcs.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-lg p-4 bg-gray-50 border border-gray-200 hover:border-green-300 hover:shadow-md transition-all h-full">
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-green-600">{calc.title}</h3>
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
