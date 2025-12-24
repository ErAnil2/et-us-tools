'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';

interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color: string;
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/cooking-measurement-converter', title: 'Cooking Converter', description: 'Convert cooking measurements', color: 'bg-blue-500' },
  { href: '/us/tools/calculators/unit-converter-calculator', title: 'Unit Converter', description: 'Convert various units', color: 'bg-green-500' },
  { href: '/us/tools/calculators/ounces-to-cups-calculator', title: 'Oz to Cups', description: 'Convert ounces to cups', color: 'bg-purple-500' },
  { href: '/us/tools/calculators/ml-to-oz-calculator', title: 'mL to Oz', description: 'Convert mL to ounces', color: 'bg-orange-500' },
];

const ingredients = [
  { name: 'All-Purpose Flour', density: 125 },
  { name: 'White Sugar (Granulated)', density: 200 },
  { name: 'Brown Sugar (Packed)', density: 220 },
  { name: 'Powdered Sugar', density: 130 },
  { name: 'Butter', density: 227 },
  { name: 'Water', density: 240 },
  { name: 'Milk', density: 245 },
  { name: 'Vegetable Oil', density: 218 },
  { name: 'Rolled Oats', density: 90 },
  { name: 'White Rice (Uncooked)', density: 185 },
  { name: 'Bread Crumbs', density: 108 },
  { name: 'Cake Flour', density: 114 },
  { name: 'Whole Wheat Flour', density: 120 },
  { name: 'Coconut Flour', density: 128 },
  { name: 'Almond Flour', density: 96 },
  { name: 'Honey', density: 340 },
  { name: 'Maple Syrup', density: 315 },
  { name: 'Molasses', density: 328 },
  { name: 'Cocoa Powder', density: 86 },
  { name: 'Cornstarch', density: 128 }
];

const faqs = [
  {
    question: "Why do different ingredients have different cup measurements for the same weight?",
    answer: "Different ingredients have different densities. For example, flour is lighter and more airy than sugar, so 1 cup of flour weighs less than 1 cup of sugar. This is why professional bakers prefer weighing ingredients for accuracy."
  },
  {
    question: "Is it better to measure ingredients by weight or volume?",
    answer: "Weight measurements (grams or ounces) are more accurate than volume measurements (cups). This is because how you scoop flour or pack brown sugar can significantly affect the amount. Professional recipes often use weight for consistency."
  },
  {
    question: "How do I measure flour accurately with cups?",
    answer: "For most accurate cup measurements: 1) Fluff the flour in its container, 2) Spoon flour into the measuring cup, 3) Level off with a straight edge. Never scoop directly or pack down, as this can add up to 30% more flour."
  },
  {
    question: "What is the standard cup size used in US recipes?",
    answer: "US recipes use a standard cup size of 240ml (8 fluid ounces). This is different from the metric cup (250ml) used in Australia and some other countries, or the Japanese cup (200ml)."
  },
  {
    question: "How do I convert grams to tablespoons?",
    answer: "The conversion depends on the ingredient. Generally, 1 tablespoon equals 1/16 of a cup. So divide your cup measurement by 16. For example, if 250g flour = 2 cups, then 250g flour = 32 tablespoons."
  },
  {
    question: "Why are my baked goods inconsistent when using cup measurements?",
    answer: "Cup measurements can vary based on how you scoop, pack, or level ingredients. Humidity, ingredient temperature, and settling can also affect volume. Using a kitchen scale eliminates these variables for more consistent results."
  }
];

const relatedCalculators = [
  { href: '/us/tools/calculators/cooking-measurement-converter', title: 'Cooking Converter', description: 'Convert cooking measurements' },
  { href: '/us/tools/calculators/weight-converter', title: 'Weight Converter', description: 'Convert weight units' },
  { href: '/us/tools/calculators/unit-converter', title: 'Unit Converter', description: 'Convert any units' },
  { href: '/us/tools/calculators/ml-to-oz-converter-calculator', title: 'ML to OZ Converter', description: 'Convert milliliters to ounces' },
  { href: '/us/tools/calculators/oz-ml-converter-calculator', title: 'OZ to ML Converter', description: 'Convert ounces to milliliters' },
  { href: '/us/tools/calculators/kg-to-lbs-converter-calculator', title: 'KG to LBS Converter', description: 'Convert kilograms to pounds' },
];

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Grams To Cups Calculator?",
    answer: "A Grams To Cups Calculator is a free online tool designed to help you quickly and accurately calculate grams to cups-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Grams To Cups Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Grams To Cups Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Grams To Cups Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function GramsToCupsCalculatorClient() {
  const [grams, setGrams] = useState<number>(250);
  const [selectedDensity, setSelectedDensity] = useState<number>(125);
  const [selectedName, setSelectedName] = useState<string>('All-Purpose Flour');

  // Results
  const [cups, setCups] = useState<number>(0);
  const [cupsDecimal, setCupsDecimal] = useState<string>('0');
  const [cupsFraction, setCupsFraction] = useState<string>('0');
  const [tablespoons, setTablespoons] = useState<number>(0);
  const [teaspoons, setTeaspoons] = useState<number>(0);
  const [ounces, setOunces] = useState<number>(0);
  const [pounds, setPounds] = useState<number>(0);
  const [halfRecipe, setHalfRecipe] = useState<number>(0);
  const [doubleRecipe, setDoubleRecipe] = useState<number>(0);

  // Fraction conversion helper
  const toFraction = (decimal: number): string => {
    const tolerance = 0.01;
    const fractions: [number, string][] = [
      [0, '0'],
      [1 / 8, '⅛'],
      [1 / 4, '¼'],
      [1 / 3, '⅓'],
      [3 / 8, '⅜'],
      [1 / 2, '½'],
      [5 / 8, '⅝'],
      [2 / 3, '⅔'],
      [3 / 4, '¾'],
      [7 / 8, '⅞'],
      [1, '1']
    ];

    const wholePart = Math.floor(decimal);
    const fractionalPart = decimal - wholePart;

    for (let [value, fraction] of fractions) {
      if (Math.abs(fractionalPart - value) < tolerance) {
        if (wholePart === 0) {
          return fraction === '0' ? '0' : fraction;
        } else {
          return fraction === '0' ? wholePart.toString() : `${wholePart} ${fraction}`;
        }
      }
    }

    return decimal.toFixed(3);
  };

  const formatNumber = (num: number, decimals: number = 2): string => {
    if (num === 0) return '0';
    if (num < 0.01) return num.toFixed(3);
    return parseFloat(num.toFixed(decimals)).toString();
  };

  // Calculate conversions
  useEffect(() => {
    if (grams <= 0) {
      setCups(0);
      setCupsDecimal('0');
      setCupsFraction('0');
      setTablespoons(0);
      setTeaspoons(0);
      setOunces(0);
      setPounds(0);
      setHalfRecipe(0);
      setDoubleRecipe(0);
      return;
    }

    const cupsValue = grams / selectedDensity;
    const tablespoonsValue = cupsValue * 16;
    const teaspoonsValue = cupsValue * 48;
    const ouncesValue = grams / 28.35;
    const poundsValue = grams / 453.59;
    const halfRecipeValue = cupsValue / 2;
    const doubleRecipeValue = cupsValue * 2;

    setCups(cupsValue);
    setCupsDecimal(formatNumber(cupsValue, 3));
    setCupsFraction(toFraction(cupsValue));
    setTablespoons(tablespoonsValue);
    setTeaspoons(teaspoonsValue);
    setOunces(ouncesValue);
    setPounds(poundsValue);
    setHalfRecipe(halfRecipeValue);
    setDoubleRecipe(doubleRecipeValue);
  }, [grams, selectedDensity]);

  const handleIngredientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value;
    const ingredient = ingredients.find((ing) => ing.name === name);
    if (ingredient) {
      setSelectedDensity(ingredient.density);
      setSelectedName(ingredient.name);
    }
  };

  const setGramsValue = (amount: number) => {
    setGrams(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1180px] mx-auto px-4 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">Grams to Cups Calculator</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Convert ingredient weights in grams to cups for accurate cooking and baking. Different ingredients have different densities, so select the correct ingredient for precise results.</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Main Calculator Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
            {/* Input Section */}
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ingredient Conversion</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight (grams)</label>
                <input
                  type="number"
                  value={grams === 0 ? '' : grams}
                  onChange={(e) => setGrams(parseFloat(e.target.value) || 0)}
                  step="1"
                  min="0"
                  placeholder="e.g., 250"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ingredient Type</label>
                <select
                  value={selectedName}
                  onChange={handleIngredientChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  {ingredients.map((ing) => (
                    <option key={ing.name} value={ing.name}>
                      {ing.name} ({ing.density} g/cup)
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Weight Buttons */}
              <div className="bg-amber-50 rounded-lg p-4">
                <h4 className="font-semibold text-amber-800 mb-3">Common Weights</h4>
                <div className="grid grid-cols-4 gap-2">
                  {[50, 100, 125, 200, 250, 300, 400, 500].map(val => (
                    <button
                      key={val}
                      onClick={() => setGramsValue(val)}
                      className="px-3 py-2 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 text-sm font-medium transition-colors"
                    >
                      {val}g
                    </button>
                  ))}
                </div>
              </div>

              {/* Ingredient Info */}
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-2">Selected Ingredient</h4>
                <div className="text-yellow-700 text-sm">
                  <p className="font-medium text-lg">{selectedName}</p>
                  <p>Density: <span className="font-semibold">{selectedDensity}</span> grams per cup</p>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="bg-gray-50 rounded-xl p-3 sm:p-4 md:p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Conversion Results</h3>

              <div className="space-y-4">
                {/* Primary Result */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 text-center text-white">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold">{cupsFraction}</div>
                  <div className="text-lg opacity-90">cups</div>
                  <div className="text-sm opacity-75 mt-1">({cupsDecimal} cups decimal)</div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Tablespoons:</span>
                    <span className="font-semibold text-gray-800">{formatNumber(tablespoons)} tbsp</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Teaspoons:</span>
                    <span className="font-semibold text-gray-800">{formatNumber(teaspoons)} tsp</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Ounces:</span>
                    <span className="font-semibold text-gray-800">{formatNumber(ounces)} oz</span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Pounds:</span>
                    <span className="font-semibold text-gray-800">{formatNumber(pounds, 3)} lbs</span>
                  </div>
                </div>

                {/* Recipe Scaling */}
                <div className="bg-purple-100 rounded-lg p-4 mt-4">
                  <h4 className="font-semibold text-purple-800 mb-2">Recipe Scaling</h4>
                  <div className="text-purple-700 text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Half recipe (÷2):</span>
                      <span className="font-semibold">{toFraction(halfRecipe)} cups</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Double recipe (×2):</span>
                      <span className="font-semibold">{toFraction(doubleRecipe)} cups</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ingredient Density Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Common Ingredient Densities (grams per cup)</h2>

          <div className="grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-4 text-lg">Flours & Starches</h3>
              <div className="space-y-2 text-sm">
                {ingredients.filter(i => i.name.includes('Flour') || i.name.includes('Cornstarch')).map(ing => (
                  <div key={ing.name} className="flex justify-between py-1 border-b border-gray-100">
                    <span>{ing.name}</span>
                    <span className="font-semibold">{ing.density} g</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-4 text-lg">Sugars & Sweeteners</h3>
              <div className="space-y-2 text-sm">
                {ingredients.filter(i => i.name.includes('Sugar') || i.name.includes('Honey') || i.name.includes('Syrup') || i.name.includes('Molasses')).map(ing => (
                  <div key={ing.name} className="flex justify-between py-1 border-b border-gray-100">
                    <span>{ing.name}</span>
                    <span className="font-semibold">{ing.density} g</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-4 text-lg">Other Ingredients</h3>
              <div className="space-y-2 text-sm">
                {ingredients.filter(i =>
                  !i.name.includes('Flour') &&
                  !i.name.includes('Sugar') &&
                  !i.name.includes('Honey') &&
                  !i.name.includes('Syrup') &&
                  !i.name.includes('Molasses') &&
                  !i.name.includes('Cornstarch')
                ).map(ing => (
                  <div key={ing.name} className="flex justify-between py-1 border-b border-gray-100">
                    <span>{ing.name}</span>
                    <span className="font-semibold">{ing.density} g</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Baking Tips */}
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-2xl font-bold text-amber-800 mb-3 sm:mb-4 md:mb-6">Baking & Cooking Tips</h2>
          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 text-amber-700">
            <div>
              <h3 className="font-semibold mb-3 text-amber-800">For Accurate Measurements:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  Use a kitchen scale for best accuracy
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  Spoon flour into cups, never pack it
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  Level off dry ingredients with a knife
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  Different brands may have slight variations
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-amber-800">Measurement Notes:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  These are approximate conversions
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  Humidity can affect ingredient density
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  Sifted vs. unsifted makes a difference
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  Always follow your recipe&apos;s preference
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Common Conversions Examples */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Quick Reference Examples</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-amber-50 rounded-lg p-4 text-center">
              <h4 className="font-semibold mb-2 text-amber-800">All-Purpose Flour</h4>
              <p className="text-sm text-amber-700">250g</p>
              <p className="font-bold text-amber-600 text-lg">= 2 cups</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 text-center">
              <h4 className="font-semibold mb-2 text-amber-800">White Sugar</h4>
              <p className="text-sm text-amber-700">200g</p>
              <p className="font-bold text-amber-600 text-lg">= 1 cup</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 text-center">
              <h4 className="font-semibold mb-2 text-amber-800">Butter</h4>
              <p className="text-sm text-amber-700">113g</p>
              <p className="font-bold text-amber-600 text-lg">= ½ cup</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 text-center">
              <h4 className="font-semibold mb-2 text-amber-800">Brown Sugar</h4>
              <p className="text-sm text-amber-700">220g</p>
              <p className="font-bold text-amber-600 text-lg">= 1 cup</p>
            </div>
          </div>
        </div>

        {/* Mobile MREC2 - Before FAQs */}


        <CalculatorMobileMrec2 />



        {/* FAQs Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-5 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {relatedCalculators.map((calc) => (
              <Link key={calc.href} href={calc.href} className="group">
                <div className="rounded-lg p-4 bg-gray-50 border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all h-full">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-amber-600">{calc.title}</h3>
                  <p className="text-xs text-gray-600">{calc.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      
      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="grams-to-cups-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
      </div>
    </div>
  );
}
