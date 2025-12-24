'use client';

import { useState, useEffect } from 'react';
import { MobileBelowSubheadingBanner, CalculatorMobileMrec2 } from '@/components/BannerPlacements';
import Link from 'next/link';
import { FirebaseFAQs } from '@/components/PageSEOContent';

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

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Cooking Measurement Converter Calculator?",
    answer: "A Cooking Measurement Converter Calculator is a mathematical tool that helps you quickly calculate or convert cooking measurement converter-related values. It eliminates manual calculations and provides instant, accurate results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Cooking Measurement Converter Calculator?",
    answer: "Simply enter your values in the input fields provided. The calculator will automatically compute and display the results. You can adjust values to see how changes affect the outcome.",
    order: 2
  },
  {
    id: '3',
    question: "Are the results accurate?",
    answer: "Yes, our Cooking Measurement Converter Calculator uses precise mathematical formulas to ensure accurate results. The calculations follow standard mathematical conventions and formulas.",
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
    answer: "Yes, this Cooking Measurement Converter Calculator is completely free to use with no registration required. Use it as many times as you need for your calculations.",
    order: 5
  }
];

export default function CookingMeasurementConverterClient() {
  const [fromValue, setFromValue] = useState(1);
  const [fromUnit, setFromUnit] = useState('cup-us');
  const [toUnit, setToUnit] = useState('ml');
  const [result, setResult] = useState('');
  const [originalServings, setOriginalServings] = useState(4);
  const [desiredServings, setDesiredServings] = useState(6);

  const conversions: Record<string, number> = {
    'cup-us': 236.588, 'tbsp-us': 14.787, 'tsp-us': 4.929, 'fl-oz-us': 29.574,
    'pint-us': 473.176, 'quart-us': 946.353, 'gallon-us': 3785.41,
    'ml': 1, 'liter': 1000,
    'cup-uk': 284.131, 'tbsp-uk': 17.758, 'tsp-uk': 5.919, 'fl-oz-uk': 28.413, 'pint-uk': 568.261,
    'gram': 1, 'kilogram': 1000, 'oz': 28.3495, 'pound': 453.592
  };

  const convert = () => {
    const fromMl = fromValue * conversions[fromUnit];
    const toValue = fromMl / conversions[toUnit];
    setResult(toValue.toFixed(3));
  };

  useEffect(() => {
    convert();
  }, [fromValue, fromUnit, toUnit]);

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const setConversion = (value: number, from: string, to: string) => {
    setFromValue(value);
    setFromUnit(from);
    setToUnit(to);
  };

  const scalingFactor = (desiredServings / originalServings).toFixed(2);

  const relatedCalculators = [
    { href: '/us/tools/calculators/unit-converter', title: 'Unit Converter', description: 'Convert all units' },
    { href: '/us/tools/calculators/weight-converter', title: 'Weight Converter', description: 'Convert weights' },
    { href: '/us/tools/calculators/ml-to-oz-converter-calculator', title: 'ML to OZ Converter', description: 'Convert ml to oz' },
    { href: '/us/tools/calculators/oz-ml-converter-calculator', title: 'OZ to ML Converter', description: 'Convert oz to ml' },
    { href: '/us/tools/calculators/temperature-converter', title: 'Temperature Converter', description: 'Convert temperatures' },
    { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages' }
  ];

  const faqs = [
    { id: 'faq-' + Math.random().toString(36).substr(2, 9), question: 'How many tablespoons are in a cup?',
      answer: 'There are 16 tablespoons in 1 US cup. This is a fundamental cooking conversion to remember. For half a cup, use 8 tablespoons, and for a quarter cup, use 4 tablespoons.'
    },
    { id: 'faq-' + Math.random().toString(36).substr(2, 9), question: 'What is the difference between US and UK cup measurements?',
      answer: 'A US cup is 236.588 mL (8 fluid ounces), while a UK cup is 284.131 mL (10 fluid ounces). This 20% difference can significantly affect recipes, so always check which measurement system a recipe uses.'
    },
    { id: 'faq-' + Math.random().toString(36).substr(2, 9), question: 'How do I convert grams to cups for dry ingredients?',
      answer: 'Converting grams to cups for dry ingredients depends on the ingredient density. For example, 1 cup of all-purpose flour is about 125g, while 1 cup of sugar is about 200g. Our converter uses water density as a baseline, so for dry ingredients, check specific conversion charts.'
    },
    { id: 'faq-' + Math.random().toString(36).substr(2, 9), question: 'Why do recipes use different measurement systems?',
      answer: 'American recipes typically use volume measurements (cups, tablespoons) for convenience, while European and professional recipes use weight (grams) for precision. Weight measurements are more accurate because ingredients can be packed differently, affecting volume but not weight.'
    },
    { id: 'faq-' + Math.random().toString(36).substr(2, 9), question: 'How do I scale a recipe for more or fewer servings?',
      answer: 'Use our Recipe Scaler tool above. Divide your desired servings by the original servings to get the scaling factor. Multiply each ingredient by this factor. For example, scaling from 4 to 6 servings gives a factor of 1.5, so 1 cup becomes 1.5 cups.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Cooking Measurement Converter",
          "description": "Free cooking measurement converter for cups, tablespoons, teaspoons, ounces, grams, and more. Perfect for scaling recipes and international conversions.",
          "url": "https://calculatorhub.com/us/tools/calculators/cooking-measurement-converter",
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
            { "@type": "ListItem", "position": 3, "name": "Cooking Measurement Converter", "item": "https://calculatorhub.com/us/tools/calculators/cooking-measurement-converter" }
          ]
        })
      }} />

      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3">Cooking Measurement Converter</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Convert between cups, tablespoons, teaspoons, ounces, grams, and more. Perfect for scaling recipes and international conversions.
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Main Converter Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Measurement Converter</h2>

          {/* From Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
            <div className="grid grid-cols-5 gap-3">
              <input
                type="number"
                value={fromValue}
                onChange={(e) => setFromValue(Number(e.target.value))}
                min="0"
                step="0.125"
                className="col-span-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Amount"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="col-span-3 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
              >
                <optgroup label="Volume - US">
                  <option value="cup-us">Cup (US)</option>
                  <option value="tbsp-us">Tablespoon (US)</option>
                  <option value="tsp-us">Teaspoon (US)</option>
                  <option value="fl-oz-us">Fluid Ounce (US)</option>
                  <option value="pint-us">Pint (US)</option>
                  <option value="quart-us">Quart (US)</option>
                  <option value="gallon-us">Gallon (US)</option>
                </optgroup>
                <optgroup label="Volume - Metric">
                  <option value="ml">Milliliter (ml)</option>
                  <option value="liter">Liter (L)</option>
                </optgroup>
                <optgroup label="Volume - Imperial">
                  <option value="cup-uk">Cup (UK)</option>
                  <option value="tbsp-uk">Tablespoon (UK)</option>
                  <option value="tsp-uk">Teaspoon (UK)</option>
                  <option value="fl-oz-uk">Fluid Ounce (UK)</option>
                  <option value="pint-uk">Pint (UK)</option>
                </optgroup>
                <optgroup label="Weight">
                  <option value="gram">Gram (g)</option>
                  <option value="kilogram">Kilogram (kg)</option>
                  <option value="oz">Ounce (oz)</option>
                  <option value="pound">Pound (lb)</option>
                </optgroup>
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center mb-4">
            <button
              onClick={swapUnits}
              className="p-3 bg-orange-100 rounded-full hover:bg-orange-200 transition-colors"
              title="Swap units"
            >
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
              </svg>
            </button>
          </div>

          {/* To Input */}
          <div className="mb-3 sm:mb-4 md:mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
            <div className="grid grid-cols-5 gap-3">
              <input
                type="text"
                value={result}
                readOnly
                className="col-span-2 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-semibold text-orange-600"
                placeholder="Result"
              />
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="col-span-3 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
              >
                <optgroup label="Volume - US">
                  <option value="cup-us">Cup (US)</option>
                  <option value="tbsp-us">Tablespoon (US)</option>
                  <option value="tsp-us">Teaspoon (US)</option>
                  <option value="fl-oz-us">Fluid Ounce (US)</option>
                  <option value="pint-us">Pint (US)</option>
                  <option value="quart-us">Quart (US)</option>
                  <option value="gallon-us">Gallon (US)</option>
                </optgroup>
                <optgroup label="Volume - Metric">
                  <option value="ml">Milliliter (ml)</option>
                  <option value="liter">Liter (L)</option>
                </optgroup>
                <optgroup label="Volume - Imperial">
                  <option value="cup-uk">Cup (UK)</option>
                  <option value="tbsp-uk">Tablespoon (UK)</option>
                  <option value="tsp-uk">Teaspoon (UK)</option>
                  <option value="fl-oz-uk">Fluid Ounce (UK)</option>
                  <option value="pint-uk">Pint (UK)</option>
                </optgroup>
                <optgroup label="Weight">
                  <option value="gram">Gram (g)</option>
                  <option value="kilogram">Kilogram (kg)</option>
                  <option value="oz">Ounce (oz)</option>
                  <option value="pound">Pound (lb)</option>
                </optgroup>
              </select>
            </div>
          </div>

          {/* Result Display */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-3 sm:p-4 md:p-6 text-white mb-3 sm:mb-4 md:mb-6">
            <div className="text-sm opacity-90 mb-1">Conversion Result</div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold">{result || '0'}</div>
          </div>

          {/* Quick Conversions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Quick Conversions</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button onClick={() => setConversion(1, 'cup-us', 'ml')} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                1 Cup to ml
              </button>
              <button onClick={() => setConversion(1, 'tbsp-us', 'ml')} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                1 Tbsp to ml
              </button>
              <button onClick={() => setConversion(1, 'tsp-us', 'ml')} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                1 Tsp to ml
              </button>
              <button onClick={() => setConversion(100, 'gram', 'oz')} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                100g to oz
              </button>
            </div>
          </div>
        </div>

        {/* Recipe Scaler Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recipe Scaler</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Original Servings</label>
              <input
                type="number"
                value={originalServings}
                onChange={(e) => setOriginalServings(Number(e.target.value))}
                min="1"
                max="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Desired Servings</label>
              <input
                type="number"
                value={desiredServings}
                onChange={(e) => setDesiredServings(Number(e.target.value))}
                min="1"
                max="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-3 sm:p-4 md:p-6 text-white text-center">
            <div className="text-sm opacity-90">Scaling Factor</div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold">{scalingFactor}x</div>
            <div className="text-sm opacity-90 mt-1">Multiply all ingredients by this amount</div>
          </div>
        </div>

        {/* Quick Reference Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Reference Chart</h2>
          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Volume Conversions</h3>
              <div className="space-y-2">
                <div className="flex justify-between p-2 bg-gray-50 rounded text-sm">
                  <span>1 Cup</span><span className="font-bold">16 Tbsp / 240 ml</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded text-sm">
                  <span>1 Tablespoon</span><span className="font-bold">3 Tsp / 15 ml</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded text-sm">
                  <span>1 Teaspoon</span><span className="font-bold">5 ml</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded text-sm">
                  <span>1 Fluid Ounce</span><span className="font-bold">30 ml</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded text-sm">
                  <span>1 Pint</span><span className="font-bold">2 Cups / 473 ml</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Weight Conversions</h3>
              <div className="space-y-2">
                <div className="flex justify-between p-2 bg-gray-50 rounded text-sm">
                  <span>1 Ounce</span><span className="font-bold">28.35 g</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded text-sm">
                  <span>1 Pound</span><span className="font-bold">16 oz / 454 g</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded text-sm">
                  <span>100 Grams</span><span className="font-bold">3.53 oz</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded text-sm">
                  <span>1 Kilogram</span><span className="font-bold">2.2 lb / 35.27 oz</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded text-sm">
                  <span>1 Stick Butter</span><span className="font-bold">113 g / 8 Tbsp</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">About Cooking Measurements</h2>
          <p className="text-gray-600 mb-4">
            Accurate measurements are crucial for cooking and baking success. This converter helps you switch between US customary, metric, and Imperial measurement systems commonly used in recipes around the world.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-orange-50 rounded-lg p-4">
              <h3 className="font-semibold text-orange-800 mb-2">US Customary</h3>
              <p className="text-sm text-gray-600">Cups, tablespoons, teaspoons, fluid ounces. Common in American recipes.</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Metric System</h3>
              <p className="text-sm text-gray-600">Milliliters, liters, grams, kilograms. Used in most countries and professional kitchens.</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-purple-800 mb-2">Imperial</h3>
              <p className="text-sm text-gray-600">UK measurements which differ slightly from US, especially for cups and fluid ounces.</p>
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
        <FirebaseFAQs pageId="cooking-measurement-converter" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
