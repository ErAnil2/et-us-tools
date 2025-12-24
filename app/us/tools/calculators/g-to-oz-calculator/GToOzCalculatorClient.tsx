'use client';

import React, { useState, useEffect } from 'react';
import { FirebaseFAQs } from '@/components/PageSEOContent';

const bakingIngredients = [
  { name: 'All-purpose flour', amount: '1 cup ≈ 120g (4.2 oz)' },
  { name: 'Granulated sugar', amount: '1 cup ≈ 200g (7.1 oz)' },
  { name: 'Brown sugar (packed)', amount: '1 cup ≈ 220g (7.8 oz)' },
  { name: 'Butter', amount: '1 stick ≈ 113g (4 oz)' },
  { name: 'Powdered sugar', amount: '1 cup ≈ 120g (4.2 oz)' },
  { name: 'Cocoa powder', amount: '1 cup ≈ 85g (3 oz)' }
];

const kitchenItems = [
  { name: 'Tablespoon (water)', amount: '≈ 15g (0.5 oz)' },
  { name: 'Teaspoon (water)', amount: '≈ 5g (0.18 oz)' },
  { name: 'Medium egg', amount: '≈ 50g (1.8 oz)' },
  { name: 'Slice of bread', amount: '≈ 30g (1.1 oz)' },
  { name: 'Pat of butter', amount: '≈ 5g (0.18 oz)' },
  { name: 'Coffee (brewed cup)', amount: '≈ 240g (8.5 oz)' }
];

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a G To Oz Calculator?",
    answer: "A G To Oz Calculator is a free online tool designed to help you quickly and accurately calculate g to oz-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this G To Oz Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this G To Oz Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this G To Oz Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function GToOzCalculatorClient() {
  const [grams, setGrams] = useState<number>(100);
  const [ounces, setOunces] = useState<number>(3.53);
  const [gramsResult, setGramsResult] = useState<number>(0);
  const [ouncesResult, setOuncesResult] = useState<number>(0);

  const gramsToOunces = (g: number): number => g / 28.3495;
  const ouncesToGrams = (oz: number): number => oz * 28.3495;

  // Update results when inputs change
  useEffect(() => {
    const oz = gramsToOunces(grams);
    setOuncesResult(oz);
  }, [grams]);

  useEffect(() => {
    const g = ouncesToGrams(ounces);
    setGramsResult(g);
  }, [ounces]);

  const setWeightGrams = (weight: number) => {
    setGrams(weight);
  };

  const setWeightOunces = (weight: number) => {
    setOunces(weight);
  };

  // Generate conversion tables
  const gramValues = [1, 5, 10, 25, 50, 100, 150, 200, 250, 300, 400, 500, 750, 1000];
  const ounceValues = [0.1, 0.25, 0.5, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-8">
      {/* Header */}
      <header className="text-center mb-6 md:mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
          Grams to Ounces Calculator
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
          Convert between grams and ounces instantly. Perfect for cooking, baking, science, and international measurements.
        </p>
      </header>

      {/* Main Layout */}
      <div className="grid lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
        {/* Left Column: Calculator (2/3) */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Grams to Ounces Converter */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Grams to Ounces Converter</h3>

            {/* Input Section */}
            <div className="mb-4 md:mb-6">
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2 md:mb-3">From</label>
              <div className="grid grid-cols-5 gap-2 md:gap-3">
                <input
                  type="number"
                  value={grams === 0 ? '' : grams}
                  onChange={(e) => setGrams(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.001"
                  className="col-span-2 px-3 md:px-2 py-2 md:py-3 border-2 border-gray-300 rounded-lg text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter grams"
                />
                <div className="col-span-3 px-3 md:px-2 py-2 md:py-3 border-2 border-gray-300 rounded-lg text-sm md:text-base bg-gray-100 flex items-center font-medium text-gray-700">
                  Grams (g)
                </div>
              </div>
            </div>

            {/* To Section */}
            <div className="mb-4 md:mb-6">
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2 md:mb-3">To</label>
              <div className="grid grid-cols-5 gap-2 md:gap-3">
                <input
                  type="number"
                  value={ouncesResult.toFixed(4)}
                  readOnly
                  className="col-span-2 px-3 md:px-2 py-2 md:py-3 border-2 border-gray-300 rounded-lg text-sm md:text-base bg-gray-50 font-semibold"
                  placeholder="Result"
                />
                <div className="col-span-3 px-3 md:px-2 py-2 md:py-3 border-2 border-gray-300 rounded-lg text-sm md:text-base bg-gray-100 flex items-center font-medium text-gray-700">
                  Ounces (oz)
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="mb-4 md:mb-6">
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2 md:mb-3">Quick Weights (Grams):</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3">
                <button
                  onClick={() => setWeightGrams(50)}
                  className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-xs md:text-sm font-semibold hover:bg-blue-200 transition-all"
                >
                  50g
                </button>
                <button
                  onClick={() => setWeightGrams(100)}
                  className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-xs md:text-sm font-semibold hover:bg-green-200 transition-all"
                >
                  100g
                </button>
                <button
                  onClick={() => setWeightGrams(250)}
                  className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-xs md:text-sm font-semibold hover:bg-purple-200 transition-all"
                >
                  250g
                </button>
                <button
                  onClick={() => setWeightGrams(500)}
                  className="px-3 py-2 bg-orange-100 text-orange-700 rounded-lg text-xs md:text-sm font-semibold hover:bg-orange-200 transition-all"
                >
                  500g
                </button>
              </div>
            </div>

            {/* Conversion Formula Display */}
            <div className="p-3 md:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="text-xs font-medium text-gray-700 mb-1">Conversion Formula:</div>
              <div className="text-xs md:text-sm text-blue-700">Grams ÷ 28.3495 = Ounces</div>
            </div>
          </div>

          {/* Ounces to Grams Converter */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Ounces to Grams Converter</h3>

            {/* Input Section */}
            <div className="mb-4 md:mb-6">
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2 md:mb-3">From</label>
              <div className="grid grid-cols-5 gap-2 md:gap-3">
                <input
                  type="number"
                  value={ounces === 0 ? '' : ounces}
                  onChange={(e) => setOunces(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.001"
                  className="col-span-2 px-3 md:px-2 py-2 md:py-3 border-2 border-gray-300 rounded-lg text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter ounces"
                />
                <div className="col-span-3 px-3 md:px-2 py-2 md:py-3 border-2 border-gray-300 rounded-lg text-sm md:text-base bg-gray-100 flex items-center font-medium text-gray-700">
                  Ounces (oz)
                </div>
              </div>
            </div>

            {/* To Section */}
            <div className="mb-4 md:mb-6">
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2 md:mb-3">To</label>
              <div className="grid grid-cols-5 gap-2 md:gap-3">
                <input
                  type="number"
                  value={gramsResult.toFixed(3)}
                  readOnly
                  className="col-span-2 px-3 md:px-2 py-2 md:py-3 border-2 border-gray-300 rounded-lg text-sm md:text-base bg-gray-50 font-semibold"
                  placeholder="Result"
                />
                <div className="col-span-3 px-3 md:px-2 py-2 md:py-3 border-2 border-gray-300 rounded-lg text-sm md:text-base bg-gray-100 flex items-center font-medium text-gray-700">
                  Grams (g)
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="mb-4 md:mb-6">
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2 md:mb-3">Quick Weights (Ounces):</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3">
                <button
                  onClick={() => setWeightOunces(1)}
                  className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-xs md:text-sm font-semibold hover:bg-blue-200 transition-all"
                >
                  1 oz
                </button>
                <button
                  onClick={() => setWeightOunces(4)}
                  className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-xs md:text-sm font-semibold hover:bg-green-200 transition-all"
                >
                  4 oz
                </button>
                <button
                  onClick={() => setWeightOunces(8)}
                  className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-xs md:text-sm font-semibold hover:bg-purple-200 transition-all"
                >
                  8 oz
                </button>
                <button
                  onClick={() => setWeightOunces(16)}
                  className="px-3 py-2 bg-orange-100 text-orange-700 rounded-lg text-xs md:text-sm font-semibold hover:bg-orange-200 transition-all"
                >
                  16 oz (1 lb)
                </button>
              </div>
            </div>

            {/* Conversion Formula Display */}
            <div className="p-3 md:p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="text-xs font-medium text-gray-700 mb-1">Conversion Formula:</div>
              <div className="text-xs md:text-sm text-green-700">Ounces × 28.3495 = Grams</div>
            </div>
          </div>

          {/* Common Cooking Measurements */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Common Cooking Measurements</h3>

            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <h4 className="text-sm md:text-base font-semibold text-gray-800 mb-3">Baking Ingredients</h4>
                <div className="space-y-2">
                  {bakingIngredients.map((ingredient, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-blue-50 rounded text-xs md:text-sm">
                      <span className="font-medium">{ingredient.name}</span>
                      <span className="text-blue-700">{ingredient.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm md:text-base font-semibold text-gray-800 mb-3">Common Kitchen Items</h4>
                <div className="space-y-2">
                  {kitchenItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-green-50 rounded text-xs md:text-sm">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-green-700">{item.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Conversion Tables */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Conversion Tables</h3>

            <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              {/* Grams to Ounces */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Grams to Ounces</h4>
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold">Grams</th>
                        <th className="px-3 py-2 text-left font-semibold">Ounces</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {gramValues.map((g) => (
                        <tr key={g} className="hover:bg-gray-50">
                          <td className="px-3 py-2 font-medium">{g}g</td>
                          <td className="px-3 py-2">{gramsToOunces(g).toFixed(3)} oz</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Ounces to Grams */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Ounces to Grams</h4>
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-green-50">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold">Ounces</th>
                        <th className="px-3 py-2 text-left font-semibold">Grams</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {ounceValues.map((oz) => (
                        <tr key={oz} className="hover:bg-gray-50">
                          <td className="px-3 py-2 font-medium">{oz} oz</td>
                          <td className="px-3 py-2">{ouncesToGrams(oz).toFixed(1)}g</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Results (1/3) */}
        <div className="space-y-4 md:space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 sticky top-4">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
              <span>📊</span> Conversion Results
            </h3>

            {/* Primary Results */}
            <div className="space-y-2 md:space-y-3 mb-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 md:p-4 border-2 border-blue-200">
                <div className="text-xs md:text-sm text-gray-600 mb-1">Grams to Ounces</div>
                <div className="text-2xl md:text-3xl font-bold text-blue-700">{ouncesResult.toFixed(2)} oz</div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 md:p-4 border-2 border-green-200">
                <div className="text-xs md:text-sm text-gray-600 mb-1">Ounces to Grams</div>
                <div className="text-2xl md:text-3xl font-bold text-green-700">{gramsResult.toFixed(1)} g</div>
              </div>
            </div>

            {/* Quick Reference */}
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-xs md:text-sm font-semibold text-gray-900 mb-2 md:mb-3">Quick Reference</h4>
              <div className="space-y-2 text-xs md:text-sm text-gray-700">
                <div className="p-2 bg-blue-50 rounded">
                  <strong>1 oz</strong> = 28.35 grams
                </div>
                <div className="p-2 bg-green-50 rounded">
                  <strong>1 g</strong> = 0.035 ounces
                </div>
                <div className="p-2 bg-purple-50 rounded">
                  <strong>100 g</strong> ≈ 3.5 oz
                </div>
                <div className="p-2 bg-amber-50 rounded">
                  <strong>1 lb</strong> = 16 oz = 453.6 g
                </div>
              </div>
            </div>

            {/* Conversion Tips */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-xs md:text-sm font-semibold text-gray-900 mb-2 md:mb-3">💡 Tips</h4>
              <ul className="space-y-2 text-xs md:text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">•</span>
                  <span>30g ≈ 1 oz (quick estimate)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>Use digital scale for accuracy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Grams more precise for baking</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information Sections */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Understanding Units */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
            <span>📚</span> Understanding Weight Units
          </h3>
          <div className="space-y-3 text-xs md:text-sm text-gray-700">
            <div>
              <strong className="text-gray-900">Gram (g):</strong>
              <p className="mt-1">Metric unit. 1/1000 of a kilogram. Used worldwide for precise measurements.</p>
            </div>
            <div>
              <strong className="text-gray-900">Ounce (oz):</strong>
              <p className="mt-1">Imperial unit. 1/16 of a pound = 28.3495 grams. Common in US cooking.</p>
            </div>
            <div className="p-2 bg-blue-50 rounded">
              <strong className="text-blue-900">Exact Conversion:</strong>
              <p className="text-blue-700 mt-1">1 oz = 28.349523125 grams</p>
            </div>
          </div>
        </div>

        {/* Cooking & Baking */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
            <span>🍳</span> Cooking & Baking
          </h3>
          <div className="space-y-2 text-xs md:text-sm">
            <div className="p-2 bg-gray-50 rounded">
              <div className="font-semibold text-gray-900">Baking Precision</div>
              <div className="text-gray-700">Grams preferred for accuracy</div>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <div className="font-semibold text-gray-900">Recipe Conversion</div>
              <div className="text-gray-700">International recipe adaptation</div>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <div className="font-semibold text-gray-900">Portion Control</div>
              <div className="text-gray-700">Accurate serving sizes</div>
            </div>
            <div className="p-2 bg-gray-50 rounded">
              <div className="font-semibold text-gray-900">Scaling Recipes</div>
              <div className="text-gray-700">Easy ingredient multiplication</div>
            </div>
          </div>
        </div>

        {/* Common Uses */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
            <span>🎯</span> Common Applications
          </h3>
          <ul className="space-y-2 text-xs md:text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>
                <strong>Laboratory:</strong> Scientific measurements require metric
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold">•</span>
              <span>
                <strong>Jewelry:</strong> Precious metals weighed in grams
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>
                <strong>Pharmaceuticals:</strong> Precise dosing in grams/mg
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600 font-bold">•</span>
              <span>
                <strong>Shipping:</strong> International packages in grams/kg
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 font-bold">•</span>
              <span>
                <strong>Nutrition:</strong> Food labels show grams
              </span>
            </li>
          </ul>
        </div>

        {/* System Comparison */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
            <span>⚖️</span> Metric vs Imperial
          </h3>
          <div className="space-y-3 text-xs md:text-sm text-gray-700">
            <div>
              <strong className="text-green-900">Metric System (Grams):</strong>
              <p className="mt-1">Used in 195+ countries. Base-10 system. Scientific standard.</p>
            </div>
            <div>
              <strong className="text-blue-900">Imperial System (Ounces):</strong>
              <p className="mt-1">Primarily USA. Historical measurements. Cooking tradition.</p>
            </div>
            <div className="p-2 bg-yellow-50 rounded border border-yellow-200">
              <strong className="text-yellow-900">💡 Pro Tip:</strong>
              <span className="text-yellow-800"> Digital kitchen scales can switch between units instantly!</span>
            </div>
          </div>
        </div>

        {/* Baking Reference */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
            <span>🧁</span> Baking Quick Reference
          </h3>
          <div className="space-y-2 text-xs md:text-sm">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-gray-700">1 cup flour</span>
              <span className="font-semibold text-gray-900">120g (4.2oz)</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-gray-700">1 cup sugar</span>
              <span className="font-semibold text-gray-900">200g (7.1oz)</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-gray-700">1 stick butter</span>
              <span className="font-semibold text-gray-900">113g (4oz)</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-gray-700">1 tbsp water</span>
              <span className="font-semibold text-gray-900">15g (0.5oz)</span>
            </div>
          </div>
        </div>

        {/* Why Precision Matters */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
            <span>🔬</span> Why Precision Matters
          </h3>
          <div className="space-y-3 text-xs md:text-sm text-gray-700">
            <div>
              <strong className="text-gray-900">Baking Chemistry:</strong>
              <p className="mt-1">Exact ratios create proper reactions. Even 5g difference affects texture.</p>
            </div>
            <div>
              <strong className="text-gray-900">Medical Dosing:</strong>
              <p className="mt-1">Pharmaceutical precision measured in milligrams (mg).</p>
            </div>
            <div>
              <strong className="text-gray-900">International Trade:</strong>
              <p className="mt-1">Shipping costs calculated by weight. Accuracy saves money.</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="g-to-oz-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
