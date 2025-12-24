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
    question: "What is a Kg To Lbs Converter Calculator?",
    answer: "A Kg To Lbs Converter Calculator is a mathematical tool that helps you quickly calculate or convert kg to lbs converter-related values. It eliminates manual calculations and provides instant, accurate results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Kg To Lbs Converter Calculator?",
    answer: "Simply enter your values in the input fields provided. The calculator will automatically compute and display the results. You can adjust values to see how changes affect the outcome.",
    order: 2
  },
  {
    id: '3',
    question: "Are the results accurate?",
    answer: "Yes, our Kg To Lbs Converter Calculator uses precise mathematical formulas to ensure accurate results. The calculations follow standard mathematical conventions and formulas.",
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
    answer: "Yes, this Kg To Lbs Converter Calculator is completely free to use with no registration required. Use it as many times as you need for your calculations.",
    order: 5
  }
];

export default function KgToLbsConverterCalculatorClient() {
  const [fromValue, setFromValue] = useState(1);
  const [fromUnit, setFromUnit] = useState('kg');
  const [toUnit, setToUnit] = useState('lbs');

  const KG_TO_LBS = 2.20462262185;

  const formatNumber = (num: number, decimals = 2) => {
    if (isNaN(num) || num === 0) return '0.00';
    return num.toFixed(decimals);
  };

  let result = 0;
  if (fromUnit === 'kg' && toUnit === 'lbs') {
    result = fromValue * KG_TO_LBS;
  } else if (fromUnit === 'lbs' && toUnit === 'kg') {
    result = fromValue / KG_TO_LBS;
  } else if (fromUnit === toUnit) {
    result = fromValue;
  }

  const unitLabel = toUnit === 'kg' ? 'kg' : 'lbs';

  const swapUnits = () => {
    const tempUnit = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tempUnit);
    setFromValue(result);
  };

  const setWeight = (value: number, unit: string) => {
    setFromValue(value);
    setFromUnit(unit);
  };

  const getFormula = () => {
    if (fromUnit === 'kg' && toUnit === 'lbs') {
      return '1 kg = 2.20462 lbs';
    } else if (fromUnit === 'lbs' && toUnit === 'kg') {
      return '1 lb = 0.453592 kg';
    } else {
      return 'Same unit conversion';
    }
  };

  const kgToLbsTable = [
    { kg: 1, lbs: 2.20 },
    { kg: 5, lbs: 11.02 },
    { kg: 10, lbs: 22.05 },
    { kg: 25, lbs: 55.12 },
    { kg: 50, lbs: 110.23 },
    { kg: 75, lbs: 165.35 },
    { kg: 100, lbs: 220.46 }
  ];

  const lbsToKgTable = [
    { lbs: 1, kg: 0.45 },
    { lbs: 10, kg: 4.54 },
    { lbs: 50, kg: 22.68 },
    { lbs: 100, kg: 45.36 },
    { lbs: 150, kg: 68.04 },
    { lbs: 200, kg: 90.72 },
    { lbs: 250, kg: 113.40 }
  ];

  const relatedCalculators = [
    { href: '/us/tools/calculators/weight-converter', title: 'Weight Converter', description: 'Convert all weights' },
    { href: '/us/tools/calculators/unit-converter', title: 'Unit Converter', description: 'Convert all units' },
    { href: '/us/tools/calculators/bmi-calculator', title: 'BMI Calculator', description: 'Calculate BMI' },
    { href: '/us/tools/calculators/cooking-measurement-converter', title: 'Cooking Converter', description: 'Kitchen conversions' },
    { href: '/us/tools/calculators/length-converter', title: 'Length Converter', description: 'Convert lengths' },
    { href: '/us/tools/calculators/temperature-converter', title: 'Temperature Converter', description: 'Convert temperatures' }
  ];

  const faqs = [
    {
      question: 'How do I convert kilograms to pounds?',
      answer: 'To convert kilograms to pounds, multiply the kilogram value by 2.20462. For example, 10 kg x 2.20462 = 22.05 lbs. A quick approximation is to multiply by 2.2, which gives you a close estimate for most practical purposes.'
    },
    {
      question: 'How do I convert pounds to kilograms?',
      answer: 'To convert pounds to kilograms, divide the pound value by 2.20462, or multiply by 0.453592. For example, 100 lbs / 2.20462 = 45.36 kg. A quick estimate is to divide by 2.2.'
    },
    {
      question: 'Why do some countries use kilograms and others use pounds?',
      answer: 'Kilograms are part of the metric system (SI units) used by most countries worldwide. Pounds are part of the imperial system, still commonly used in the United States and partially in the United Kingdom. The metric system is preferred in science and international trade due to its decimal-based simplicity.'
    },
    {
      question: 'What is the exact conversion factor between kg and lbs?',
      answer: 'The exact conversion is 1 kilogram = 2.20462262185 pounds. This is defined by international agreement. For most everyday purposes, using 2.205 or even 2.2 provides sufficient accuracy.'
    },
    {
      question: 'How much is 1 stone in kilograms and pounds?',
      answer: 'One stone equals 14 pounds or approximately 6.35 kilograms. The stone is a unit of weight still used in the UK and Ireland, particularly for expressing body weight. For example, 10 stone = 140 lbs = 63.5 kg.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Kg to Lbs Converter",
          "description": "Free kilogram to pound converter. Convert between kg and lbs instantly for travel, fitness, cooking, and shipping.",
          "url": "https://calculatorhub.com/us/tools/calculators/kg-to-lbs-converter-calculator",
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
            { "@type": "ListItem", "position": 3, "name": "Kg to Lbs Converter", "item": "https://calculatorhub.com/us/tools/calculators/kg-to-lbs-converter-calculator" }
          ]
        })
      }} />

      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3">Kg to Lbs Converter</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Convert between kilograms and pounds instantly. Perfect for travel, fitness, cooking, and international shipping.
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Main Converter Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Weight Converter</h2>

          {/* From Section */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
            <div className="grid grid-cols-5 gap-3">
              <input
                type="number"
                value={fromValue}
                onChange={(e) => setFromValue(Number(e.target.value))}
                min="0"
                step="0.01"
                className="col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Amount"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="col-span-3 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="lbs">Pounds (lbs)</option>
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center mb-4">
            <button
              onClick={swapUnits}
              className="p-3 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
              title="Swap units"
            >
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
              </svg>
            </button>
          </div>

          {/* To Section */}
          <div className="mb-3 sm:mb-4 md:mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
            <div className="grid grid-cols-5 gap-3">
              <input
                type="text"
                value={formatNumber(result)}
                readOnly
                className="col-span-2 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-semibold text-blue-600"
                placeholder="Result"
              />
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="col-span-3 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="lbs">Pounds (lbs)</option>
              </select>
            </div>
          </div>

          {/* Result Display */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-3 sm:p-4 md:p-6 text-white mb-3 sm:mb-4 md:mb-6">
            <div className="text-sm opacity-90 mb-1">Converted Weight</div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold">{formatNumber(result)} {unitLabel}</div>
          </div>

          {/* Quick Presets */}
          <div className="mb-3 sm:mb-4 md:mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Quick Conversions</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button onClick={() => setWeight(1, 'kg')} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                1 kg
              </button>
              <button onClick={() => setWeight(10, 'kg')} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                10 kg
              </button>
              <button onClick={() => setWeight(50, 'kg')} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                50 kg
              </button>
              <button onClick={() => setWeight(100, 'lbs')} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                100 lbs
              </button>
            </div>
          </div>

          {/* Formula Display */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-700 mb-1">Conversion Formula</div>
            <div className="font-mono text-blue-700">{getFormula()}</div>
          </div>
        </div>

        {/* Conversion Tables */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Conversion Tables</h2>
          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {/* Kg to Lbs Table */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Kilograms to Pounds</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-blue-50 border-b border-blue-200">
                      <th className="text-left py-2 px-3 font-semibold text-gray-700">kg</th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-700">lbs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kgToLbsTable.map((row, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-2 px-3 font-medium">{row.kg}</td>
                        <td className="py-2 px-3 text-blue-600">{row.lbs}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Lbs to Kg Table */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Pounds to Kilograms</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-green-50 border-b border-green-200">
                      <th className="text-left py-2 px-3 font-semibold text-gray-700">lbs</th>
                      <th className="text-left py-2 px-3 font-semibold text-gray-700">kg</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lbsToKgTable.map((row, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-2 px-3 font-medium">{row.lbs}</td>
                        <td className="py-2 px-3 text-green-600">{row.kg}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Understanding Weight Units</h2>
          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Kilogram (kg)</h3>
              <p className="text-sm text-gray-600 mb-4">
                The kilogram is the SI base unit of mass. It is used globally in the metric system and equals 1000 grams. The kilogram is the standard unit for measuring weight in science, medicine, and international trade.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Pound (lb)</h3>
              <p className="text-sm text-gray-600 mb-4">
                The pound is an imperial unit of weight used primarily in the United States. It equals 16 ounces or approximately 0.454 kilograms. Body weight and food items are commonly measured in pounds in the US.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Quick Formula</h4>
              <p className="text-sm text-gray-600">kg x 2.2 = lbs (approximate)</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Exact Conversion</h4>
              <p className="text-sm text-gray-600">1 kg = 2.20462 lbs</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-purple-800 mb-2">Reverse</h4>
              <p className="text-sm text-gray-600">1 lb = 0.453592 kg</p>
            </div>
          </div>
        </div>

        {/* Common Examples */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Common Weight Examples</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between p-2 bg-gray-50 rounded text-sm">
                <span>Newborn baby</span><span className="font-bold">3.5 kg / 7.7 lbs</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded text-sm">
                <span>Laptop computer</span><span className="font-bold">2 kg / 4.4 lbs</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded text-sm">
                <span>Gallon of milk</span><span className="font-bold">3.8 kg / 8.3 lbs</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between p-2 bg-gray-50 rounded text-sm">
                <span>Checked luggage limit</span><span className="font-bold">23 kg / 50 lbs</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded text-sm">
                <span>Average adult</span><span className="font-bold">70 kg / 154 lbs</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded text-sm">
                <span>Bag of cement</span><span className="font-bold">25 kg / 55 lbs</span>
              </div>
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
        <FirebaseFAQs pageId="kg-to-lbs-converter-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
