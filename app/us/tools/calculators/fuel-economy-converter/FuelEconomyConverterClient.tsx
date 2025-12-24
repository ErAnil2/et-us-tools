'use client';

import { useState } from 'react';
import { MobileBelowSubheadingBanner, CalculatorMobileMrec2 } from '@/components/BannerPlacements';
import Link from 'next/link';
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

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Fuel Economy Converter Calculator?",
    answer: "A Fuel Economy Converter Calculator is a mathematical tool that helps you quickly calculate or convert fuel economy converter-related values. It eliminates manual calculations and provides instant, accurate results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Fuel Economy Converter Calculator?",
    answer: "Simply enter your values in the input fields provided. The calculator will automatically compute and display the results. You can adjust values to see how changes affect the outcome.",
    order: 2
  },
  {
    id: '3',
    question: "Are the results accurate?",
    answer: "Yes, our Fuel Economy Converter Calculator uses precise mathematical formulas to ensure accurate results. The calculations follow standard mathematical conventions and formulas.",
    order: 3
  },
  {
    id: '4',
    question: "Can I use this for professional or academic work?",
    answer: "Yes, this calculator is suitable for professional, academic, and personal use. It uses standard formulas that are widely accepted. However, always verify critical calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Is this calculator free?",
    answer: "Yes, this Fuel Economy Converter Calculator is completely free to use with no registration required. Use it as many times as you need for your calculations.",
    order: 5
  }
];

export default function FuelEconomyConverterClient() {
  const [fromValue, setFromValue] = useState(25);
  const [fromUnit, setFromUnit] = useState('mpg-us');
  const [distance, setDistance] = useState(100);
  const [distanceUnit, setDistanceUnit] = useState('miles');
  const [fuelPrice, setFuelPrice] = useState(3.50);

  const mpgUSToL100km = (mpg: number) => 235.214 / mpg;
  const mpgUKToL100km = (mpg: number) => 282.481 / mpg;
  const l100kmToMpgUS = (l100km: number) => 235.214 / l100km;
  const l100kmToMpgUK = (l100km: number) => 282.481 / l100km;
  const kmLToL100km = (kmL: number) => 100 / kmL;
  const l100kmToKmL = (l100km: number) => 100 / l100km;

  const convertToAllUnits = (value: number, unit: string) => {
    if (value <= 0) {
      return { mpgUS: 0, mpgUK: 0, l100km: 0, kmL: 0 };
    }

    let l100km: number;

    switch (unit) {
      case 'mpg-us':
        l100km = mpgUSToL100km(value);
        break;
      case 'mpg-uk':
        l100km = mpgUKToL100km(value);
        break;
      case 'l100km':
        l100km = value;
        break;
      case 'kmpl':
        l100km = kmLToL100km(value);
        break;
      default:
        l100km = 0;
    }

    return {
      mpgUS: l100kmToMpgUS(l100km),
      mpgUK: l100kmToMpgUK(l100km),
      l100km: l100km,
      kmL: l100kmToKmL(l100km)
    };
  };

  const results = convertToAllUnits(fromValue, fromUnit);

  const formatNumber = (num: number, decimals = 1) => {
    if (isNaN(num) || num === 0) return '0.0';
    return num.toFixed(decimals);
  };

  let distanceInMiles = distance;
  if (distanceUnit === 'km') {
    distanceInMiles = distance * 0.621371;
  }

  const fuelNeeded = results.mpgUS > 0 ? distanceInMiles / results.mpgUS : 0;
  const totalCost = fuelNeeded * fuelPrice;

  const setFuel = (value: number, unit: string) => {
    setFromValue(value);
    setFromUnit(unit);
  };

  const relatedCalculators = [
    { href: '/us/tools/calculators/unit-converter', title: 'Unit Converter', description: 'Convert all units' },
    { href: '/us/tools/calculators/length-converter', title: 'Length Converter', description: 'Convert distances' },
    { href: '/us/tools/calculators/currency-converter', title: 'Currency Converter', description: 'Convert currencies' },
    { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages' },
    { href: '/us/tools/calculators/tip-calculator', title: 'Tip Calculator', description: 'Calculate tips' },
    { href: '/us/tools/calculators/discount-calculator', title: 'Discount Calculator', description: 'Calculate discounts' }
  ];

  const faqs = [
    {
      question: 'What is the difference between MPG (US) and MPG (UK)?',
      answer: 'MPG (US) uses the US gallon (3.785 liters), while MPG (UK) uses the Imperial gallon (4.546 liters). Because the UK gallon is larger, the same vehicle will have a higher MPG rating in UK units. To convert: UK MPG = US MPG x 1.201.'
    },
    {
      question: 'How do I convert MPG to L/100km?',
      answer: 'To convert US MPG to L/100km, divide 235.214 by the MPG value. For example, 25 MPG (US) = 235.214 / 25 = 9.41 L/100km. Note that higher MPG means lower L/100km (better efficiency).'
    },
    {
      question: 'Which fuel economy measurement is better for comparison?',
      answer: 'L/100km is often considered better for comparing fuel costs because it shows actual fuel consumption. With MPG, the relationship between efficiency and fuel cost is not linear - going from 10 to 20 MPG saves more fuel than going from 30 to 40 MPG for the same distance.'
    },
    {
      question: 'What is considered good fuel economy?',
      answer: 'Good fuel economy varies by vehicle type. For cars: 30+ MPG is good, 40+ is excellent. For SUVs: 25+ MPG is good. For trucks: 20+ MPG is respectable. In L/100km: under 8 is good, under 6 is excellent for cars.'
    },
    {
      question: 'How does driving behavior affect fuel economy?',
      answer: 'Aggressive driving (rapid acceleration, speeding, hard braking) can reduce fuel economy by 15-30%. Other factors include: tire pressure (underinflation reduces MPG by 0.2% per 1 PSI drop), excess weight (100 lbs reduces MPG by 1%), and air conditioning (can reduce MPG by 5-25%).'
    }
  ];

  const vehicleComparison = [
    { type: 'Large Truck/SUV', mpgUS: 15, l100km: 15.7 },
    { type: 'Average Car', mpgUS: 25, l100km: 9.4 },
    { type: 'Efficient Car', mpgUS: 35, l100km: 6.7 },
    { type: 'Hybrid Vehicle', mpgUS: 50, l100km: 4.7 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Fuel Economy Converter",
          "description": "Free fuel economy converter for MPG (US/UK), L/100km, and km/L. Calculate fuel costs and compare vehicle efficiency across measurement systems.",
          "url": "https://calculatorhub.com/us/tools/calculators/fuel-economy-converter",
          "applicationCategory": "UtilityApplication",
          "operatingSystem": "Any",
          "permissions": "browser",
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
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://calculatorhub.com" },
            { "@type": "ListItem", "position": 2, "name": "Calculators", "item": "https://calculatorhub.com/us/tools/calculators" },
            { "@type": "ListItem", "position": 3, "name": "Fuel Economy Converter", "item": "https://calculatorhub.com/us/tools/calculators/fuel-economy-converter" }
          ]
        })
      }} />

      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3">Fuel Economy Converter</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Convert between MPG (US/UK), L/100km, and km/L. Compare fuel efficiency and calculate trip costs across measurement systems.
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Main Converter Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Fuel Economy Converter</h2>

          {/* Input Section */}
          <div className="mb-3 sm:mb-4 md:mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Enter Fuel Economy</label>
            <div className="grid grid-cols-5 gap-3">
              <input
                type="number"
                value={fromValue}
                onChange={(e) => setFromValue(Number(e.target.value))}
                min="0"
                step="0.1"
                className="col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Value"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="col-span-3 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="mpg-us">MPG (US)</option>
                <option value="mpg-uk">MPG (UK)</option>
                <option value="l100km">L/100km</option>
                <option value="kmpl">km/L</option>
              </select>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="mb-3 sm:mb-4 md:mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Quick Presets</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button onClick={() => setFuel(15, 'mpg-us')} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                Truck: 15 MPG
              </button>
              <button onClick={() => setFuel(25, 'mpg-us')} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                Average: 25 MPG
              </button>
              <button onClick={() => setFuel(35, 'mpg-us')} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                Efficient: 35 MPG
              </button>
              <button onClick={() => setFuel(50, 'mpg-us')} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                Hybrid: 50 MPG
              </button>
            </div>
          </div>

          {/* Results Display */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-3 sm:p-4 md:p-6 text-white mb-3 sm:mb-4 md:mb-6">
            <div className="text-sm opacity-90 mb-2">Conversion Results</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <div className="text-2xl font-bold">{formatNumber(results.mpgUS)}</div>
                <div className="text-xs opacity-80">MPG (US)</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{formatNumber(results.mpgUK)}</div>
                <div className="text-xs opacity-80">MPG (UK)</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{formatNumber(results.l100km)}</div>
                <div className="text-xs opacity-80">L/100km</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{formatNumber(results.kmL)}</div>
                <div className="text-xs opacity-80">km/L</div>
              </div>
            </div>
          </div>

          {/* Efficiency Rating */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Efficiency Rating</div>
            <div className="flex items-center gap-2">
              {results.mpgUS >= 35 ? (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Excellent</span>
              ) : results.mpgUS >= 25 ? (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Good</span>
              ) : results.mpgUS >= 20 ? (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">Average</span>
              ) : (
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">Below Average</span>
              )}
              <span className="text-sm text-gray-600">for passenger vehicles</span>
            </div>
          </div>
        </div>

        {/* Fuel Cost Calculator Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Trip Cost Calculator</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3 sm:mb-4 md:mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Distance</label>
              <input
                type="number"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                min="0"
                step="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
              <select
                value={distanceUnit}
                onChange={(e) => setDistanceUnit(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="miles">Miles</option>
                <option value="km">Kilometers</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Price ($/gal)</label>
              <input
                type="number"
                value={fuelPrice}
                onChange={(e) => setFuelPrice(Number(e.target.value))}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-3 sm:p-4 md:p-6 text-white">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-sm opacity-90">Fuel Needed</div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold">{formatNumber(fuelNeeded)} gal</div>
              </div>
              <div>
                <div className="text-sm opacity-90">Total Cost</div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold">${formatNumber(totalCost, 2)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Comparison Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Vehicle Type Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Vehicle Type</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">MPG (US)</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">L/100km</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Annual Cost*</th>
                </tr>
              </thead>
              <tbody>
                {vehicleComparison.map((vehicle, idx) => {
                  const annualMiles = 12500;
                  const annualGallons = annualMiles / vehicle.mpgUS;
                  const annualCost = annualGallons * fuelPrice;
                  return (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-800">{vehicle.type}</td>
                      <td className="py-3 px-4 text-right">{vehicle.mpgUS}</td>
                      <td className="py-3 px-4 text-right">{vehicle.l100km}</td>
                      <td className="py-3 px-4 text-right font-bold text-green-600">${formatNumber(annualCost, 0)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="text-xs text-gray-500 mt-3">*Based on 12,500 miles/year at ${fuelPrice.toFixed(2)}/gallon</p>
          </div>
        </div>

        {/* Conversion Formulas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Conversion Formulas</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">MPG (US) to L/100km</h3>
              <p className="text-sm font-mono text-blue-700">L/100km = 235.214 / MPG</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-purple-800 mb-2">MPG (UK) to L/100km</h3>
              <p className="text-sm font-mono text-purple-700">L/100km = 282.481 / MPG</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">L/100km to km/L</h3>
              <p className="text-sm font-mono text-green-700">km/L = 100 / L/100km</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <h3 className="font-semibold text-orange-800 mb-2">US to UK MPG</h3>
              <p className="text-sm font-mono text-orange-700">UK MPG = US MPG x 1.201</p>
            </div>
          </div>
        </div>

        {/* Regional Usage */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Regional Usage</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="font-semibold text-gray-800 mb-1">United States</div>
              <div className="text-sm text-gray-600">MPG (US)</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="font-semibold text-gray-800 mb-1">United Kingdom</div>
              <div className="text-sm text-gray-600">MPG (UK)</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="font-semibold text-gray-800 mb-1">Europe/Canada</div>
              <div className="text-sm text-gray-600">L/100km</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="font-semibold text-gray-800 mb-1">Asia/Others</div>
              <div className="text-sm text-gray-600">km/L</div>
            </div>
          </div>
        </div>

        {/* Mobile MREC2 - Before FAQs */}


        <CalculatorMobileMrec2 />



        {/* FAQs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <details key={index} className="group">
                <summary className="flex justify-between items-center cursor-pointer list-none p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                  <span className="font-medium text-gray-800">{faq.question}</span>
                  <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="mt-2 px-3 pb-3 text-sm text-gray-600">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Related Calculators */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Related Calculators</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {relatedCalculators.map((calc) => (
              <Link key={calc.href} href={calc.href}>
                <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors h-full">
                  <h3 className="font-medium text-gray-900 text-sm">{calc.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{calc.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="fuel-economy-converter" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
