'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
interface Ingredient {
  amount: number;
  unit: string;
  ingredient: string;
}

interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color?: string;
  icon?: string;
}

interface Props {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '%' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Recipe Scaling Calculator?",
    answer: "A Recipe Scaling Calculator is a free online tool designed to help you quickly and accurately calculate recipe scaling-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Recipe Scaling Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Recipe Scaling Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Recipe Scaling Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function RecipeScalingCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('recipe-scaling-calculator');

  const [recipeName, setRecipeName] = useState('');
  const [originalServings, setOriginalServings] = useState(4);
  const [desiredServings, setDesiredServings] = useState(6);
  const [scalingFactor, setScalingFactor] = useState(1.5);
  const [scalingDescription, setScalingDescription] = useState('Making 50% more');
  const [newAmount, setNewAmount] = useState('');
  const [newUnit, setNewUnit] = useState('cups');
  const [newIngredient, setNewIngredient] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    updateScalingFactor();
  }, [originalServings, desiredServings]);

  useEffect(() => {
    updateServingInfo();
  }, [recipeName, originalServings, desiredServings, ingredients]);

  const updateScalingFactor = () => {
    const original = originalServings || 1;
    const desired = desiredServings || 1;
    const factor = desired / original;

    setScalingFactor(factor);

    let description = '';
    if (factor > 1) {
      const percent = Math.round((factor - 1) * 100);
      description = `Making ${percent}% more`;
    } else if (factor < 1) {
      const percent = Math.round((1 - factor) * 100);
      description = `Making ${percent}% less`;
    } else {
      description = 'Same size';
    }

    setScalingDescription(description);
  };

  const updateServingInfo = () => {
    // This is handled in the JSX directly
  };

  const addIngredient = () => {
    const amount = parseFloat(newAmount);
    const unit = newUnit;
    const ingredient = newIngredient.trim();

    if (!amount || !ingredient) {
      alert('Please enter both amount and ingredient name');
      return;
    }

    setIngredients([...ingredients, { amount, unit, ingredient }]);

    // Clear inputs
    setNewAmount('');
    setNewIngredient('');
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const formatAmount = (amount: number, unit: string): string => {
    // Convert to fractions for common measurements
    if (unit === 'cups' || unit === 'tbsp' || unit === 'tsp') {
      return formatFraction(amount);
    }

    // Round to reasonable precision for other units
    if (amount >= 10) {
      return Math.round(amount).toString();
    } else if (amount >= 1) {
      return (Math.round(amount * 4) / 4).toString(); // Round to nearest 0.25
    } else {
      return (Math.round(amount * 8) / 8).toString(); // Round to nearest 0.125
    }
  };

  const formatFraction = (decimal: number): string => {
    const whole = Math.floor(decimal);
    const fraction = decimal - whole;

    // Common fraction conversions
    const fractions: [number, string][] = [
      [0.125, '1/8'], [0.25, '1/4'], [0.333, '1/3'], [0.375, '3/8'],
      [0.5, '1/2'], [0.625, '5/8'], [0.667, '2/3'], [0.75, '3/4'], [0.875, '7/8']
    ];

    // Find closest fraction
    let bestFraction = decimal.toFixed(2);

    for (const [value, text] of fractions) {
      if (Math.abs(fraction - value) < 0.06) {
        bestFraction = whole > 0 ? `${whole} ${text}` : text;
        break;
      }
    }

    // If no good fraction match, use decimal
    if (bestFraction === decimal.toFixed(2)) {
      if (decimal >= 1) {
        bestFraction = (Math.round(decimal * 4) / 4).toString();
      } else {
        bestFraction = (Math.round(decimal * 8) / 8).toString();
      }
    }

    return bestFraction;
  };

  const quickScale = (factor: number) => {
    const original = originalServings || 1;
    const newDesired = original * factor;
    setDesiredServings(newDesired);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addIngredient();
    }
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Recipe Scaling Calculator')}</h1>
        <p className="text-lg text-gray-600">Scale recipe ingredients up or down for different serving sizes with accurate measurements</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recipe Information</h2>

            {/* Recipe Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recipe Name (Optional)</label>
              <input
                type="text"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                placeholder="e.g., Chocolate Chip Cookies"
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Serving Sizes */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Original Servings</label>
                <input
                  type="number"
                  value={originalServings}
                  onChange={(e) => setOriginalServings(parseFloat(e.target.value) || 1)}
                  step="0.5"
                  placeholder="e.g., 4"
                  min="0.5"
                  className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Desired Servings</label>
                <input
                  type="number"
                  value={desiredServings}
                  onChange={(e) => setDesiredServings(parseFloat(e.target.value) || 1)}
                  step="0.5"
                  placeholder="e.g., 6"
                  min="0.5"
                  className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Scaling Factor Display */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-blue-800 font-medium">Scaling Factor:</span>
                <span className="text-2xl font-bold text-blue-600">{scalingFactor.toFixed(2)}×</span>
              </div>
              <div className="text-xs text-blue-600 mt-1">{scalingDescription}</div>
            </div>

            {/* Ingredient Input */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Ingredients</h3>

              <div className="space-y-3">
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-3">
                    <input
                      type="number"
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      onKeyPress={handleKeyPress}
                      step="0.125"
                      placeholder="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="col-span-3">
                    <select
                      value={newUnit}
                      onChange={(e) => setNewUnit(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="cups">cups</option>
                      <option value="tbsp">tbsp</option>
                      <option value="tsp">tsp</option>
                      <option value="oz">oz</option>
                      <option value="lbs">lbs</option>
                      <option value="ml">ml</option>
                      <option value="L">liters</option>
                      <option value="g">grams</option>
                      <option value="kg">kg</option>
                      <option value="pieces">pieces</option>
                      <option value="cloves">cloves</option>
                      <option value="pinch">pinch</option>
                    </select>
                  </div>
                  <div className="col-span-5">
                    <input
                      type="text"
                      value={newIngredient}
                      onChange={(e) => setNewIngredient(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="flour"
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="col-span-1">
                    <button
                      onClick={addIngredient}
                      className="w-full px-2 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  Enter amount, unit, and ingredient name, then click + to add
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Scaled Recipe</h3>

            <div className="space-y-4">
              {/* Recipe Header */}
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-lg font-bold text-gray-800">{recipeName || 'Scaled Recipe'}</div>
                <div className="text-sm text-gray-600">For {desiredServings} servings (was {originalServings})</div>
              </div>

              {/* Scaled Ingredients List */}
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Ingredients:</h4>
                <div className="space-y-2 text-sm">
                  {ingredients.length === 0 ? (
                    <div className="text-gray-500 italic">Add ingredients to see scaled amounts</div>
                  ) : (
                    ingredients.map((ingredient, index) => {
                      const scaledAmount = ingredient.amount * scalingFactor;
                      const displayAmount = formatAmount(scaledAmount, ingredient.unit);

                      return (
                        <div key={index} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
                          <span className="font-medium">{displayAmount} {ingredient.unit} {ingredient.ingredient}</span>
                          <button
                            onClick={() => removeIngredient(index)}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
{/* Quick Scale Buttons */}
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Quick Scale Options:</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => quickScale(0.5)}
                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                  >
                    Half Recipe
                  </button>
                  <button
                    onClick={() => quickScale(2)}
                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                  >
                    Double Recipe
                  </button>
                  <button
                    onClick={() => quickScale(3)}
                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                  >
                    Triple Recipe
                  </button>
                  <button
                    onClick={() => quickScale(0.25)}
                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                  >
                    Quarter Recipe
                  </button>
                </div>
              </div>

              {/* Conversion Notes */}
              <div className="bg-yellow-50 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Conversion Notes</h4>
                <div className="text-yellow-700 text-xs space-y-1">
                  <div>• Measurements are automatically converted to practical amounts</div>
                  <div>• Scaling may affect cooking times and temperatures</div>
                  <div>• Taste and adjust seasonings as needed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* Information Section */}
      <div className="bg-purple-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-xl font-semibold text-purple-800 mb-4">Recipe Scaling Guidelines</h3>
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 text-purple-700">
          <div>
            <h4 className="font-semibold mb-2">What Scales Easily:</h4>
            <ul className="space-y-1">
              <li>• <strong>Most ingredients:</strong> Flour, sugar, liquids</li>
              <li>• <strong>Vegetables:</strong> Onions, garlic, herbs</li>
              <li>• <strong>Proteins:</strong> Meat, fish, eggs</li>
              <li>• <strong>Spices:</strong> Most seasonings</li>
              <li>• <strong>Leavening:</strong> Baking powder, yeast</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">What Needs Adjustment:</h4>
            <ul className="space-y-1">
              <li>• <strong>Salt:</strong> Scale by 0.8× for large batches</li>
              <li>• <strong>Strong spices:</strong> Cayenne, hot sauce</li>
              <li>• <strong>Alcohol:</strong> May not need full scaling</li>
              <li>• <strong>Thickeners:</strong> Cornstarch, flour for sauces</li>
              <li>• <strong>Cooking times:</strong> Don't scale linearly</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-xl font-semibold text-yellow-800 mb-4">Scaling Tips & Tricks</h3>
        <div className="grid md:grid-cols-3 gap-4 text-yellow-700">
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">Baking Tips</h4>
            <ul className="text-sm space-y-1">
              <li>• Use kitchen scale for accuracy</li>
              <li>• Don't scale leavening agents blindly</li>
              <li>• Adjust pan sizes proportionally</li>
              <li>• Monitor baking times closely</li>
            </ul>
          </div>
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">Cooking Tips</h4>
            <ul className="text-sm space-y-1">
              <li>• Taste and adjust seasonings</li>
              <li>• Use larger pots/pans for big batches</li>
              <li>• Cooking times may not double</li>
              <li>• Start with less salt and pepper</li>
            </ul>
          </div>
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">Measurement Tips</h4>
            <ul className="text-sm space-y-1">
              <li>• Round to practical measurements</li>
              <li>• Convert between units as needed</li>
              <li>• Keep ingredient ratios intact</li>
              <li>• Write down your scaled recipe</li>
            </ul>
          </div>
        </div>
      </div>

      {/* MREC Advertisement Banners */}
{/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Math Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-lg p-4 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <div className="text-2xl mb-2">📊</div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {calc.title}
                </h3>
                <p className="text-xs text-gray-600">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="recipe-scaling-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
