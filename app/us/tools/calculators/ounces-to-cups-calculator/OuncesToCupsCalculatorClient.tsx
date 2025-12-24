'use client';

import { useState, useEffect } from 'react';
import { CalculatorAfterCalcBanners } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import Link from 'next/link';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color: string;
  icon: string;
}

interface OuncesToCupsCalculatorClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '📊' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Ounces To Cups Calculator?",
    answer: "A Ounces To Cups Calculator is a free online tool designed to help you quickly and accurately calculate ounces to cups-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Ounces To Cups Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Ounces To Cups Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Ounces To Cups Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function OuncesToCupsCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: OuncesToCupsCalculatorClientProps) {
  const { getH1, getSubHeading } = usePageSEO('ounces-to-cups-calculator');

  const [fluidOunces, setFluidOunces] = useState<string>('8');
  const [cupsResult, setCupsResult] = useState<string>('0');
  const [cupsDecimal, setCupsDecimal] = useState<string>('0');
  const [cupsFraction, setCupsFraction] = useState<string>('0');
  const [pintsResult, setPintsResult] = useState<string>('0');
  const [quartsResult, setQuartsResult] = useState<string>('0');
  const [gallonsResult, setGallonsResult] = useState<string>('0');
  const [millilitersResult, setMillilitersResult] = useState<string>('0 mL');
  const [kitchenEquivalent, setKitchenEquivalent] = useState<string>('Enter an amount to see kitchen equivalents');

  // Fraction conversion helper
  const toFraction = (decimal: number): string => {
    const tolerance = 0.01;
    const fractions: [number, string][] = [
      [0, '0'],
      [1/8, '⅛'],
      [1/4, '¼'],
      [3/8, '⅜'],
      [1/2, '½'],
      [5/8, '⅝'],
      [3/4, '¾'],
      [7/8, '⅞'],
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
    if (num < 0.01) return num.toFixed(4);
    return parseFloat(num.toFixed(decimals)).toString();
  };

  const getKitchenEquivalent = (flOz: number): string => {
    if (flOz === 0) return 'Enter an amount to see kitchen equivalents';

    const equivalents: [number, string][] = [
      [1, '2 tablespoons'],
      [2, '4 tablespoons'],
      [4, '½ cup or 8 tablespoons'],
      [6, '¾ cup or 12 tablespoons'],
      [8, '1 cup or 16 tablespoons'],
      [12, '1½ cups'],
      [16, '2 cups or 1 pint'],
      [24, '3 cups'],
      [32, '4 cups or 1 quart'],
      [64, '8 cups or ½ gallon'],
      [128, '16 cups or 1 gallon']
    ];

    for (let [oz, equiv] of equivalents) {
      if (flOz === oz) {
        return equiv;
      }
    }

    // For non-exact matches, provide general equivalents
    const cups = flOz / 8;
    const tablespoons = flOz * 2;

    if (flOz < 8) {
      return `${tablespoons} tablespoons`;
    } else {
      return `${formatNumber(cups)} cups`;
    }
  };

  const calculateConversion = () => {
    const flOz = parseFloat(fluidOunces) || 0;

    if (flOz < 0) {
      resetResults();
      return;
    }

    // Calculate conversions
    const cups = flOz / 8;
    const pints = flOz / 16;
    const quarts = flOz / 32;
    const gallons = flOz / 128;
    const milliliters = flOz * 29.5735;

    // Update results
    setCupsResult(formatNumber(cups));
    setCupsDecimal(formatNumber(cups, 3));
    setCupsFraction(toFraction(cups));
    setPintsResult(formatNumber(pints, 3));
    setQuartsResult(formatNumber(quarts, 3));
    setGallonsResult(formatNumber(gallons, 3));
    setMillilitersResult(formatNumber(milliliters, 1) + ' mL');

    // Update kitchen equivalent
    setKitchenEquivalent(getKitchenEquivalent(flOz));
  };

  const resetResults = () => {
    setCupsResult('0');
    setCupsDecimal('0');
    setCupsFraction('0');
    setPintsResult('0');
    setQuartsResult('0');
    setGallonsResult('0');
    setMillilitersResult('0 mL');
    setKitchenEquivalent('Enter an amount to see kitchen equivalents');
  };

  const setOunces = (amount: number) => {
    setFluidOunces(amount.toString());
  };

  // Auto-calculate on input change
  useEffect(() => {
    calculateConversion();
  }, [fluidOunces]);

  // Set initial example on mount
  useEffect(() => {
    calculateConversion();
  }, []);

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Ounces to Cups Calculator')}</h1>
        <p className="text-lg text-gray-600">Convert fluid ounces to cups for cooking, baking, and recipe measurements</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Convert Measurements</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fluid Ounces (fl oz)</label>
              <input
                type="number"
                id="fluidOunces"
                value={fluidOunces}
                onChange={(e) => setFluidOunces(e.target.value)}
                step="0.125"
                min="0"
                placeholder="e.g., 16"
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Quick Conversion Buttons */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-3">Common Amounts</h4>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => setOunces(1)} className="px-3 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm">1 oz</button>
                <button onClick={() => setOunces(2)} className="px-3 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm">2 oz</button>
                <button onClick={() => setOunces(4)} className="px-3 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm">4 oz</button>
                <button onClick={() => setOunces(6)} className="px-3 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm">6 oz</button>
                <button onClick={() => setOunces(8)} className="px-3 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm">8 oz</button>
                <button onClick={() => setOunces(12)} className="px-3 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm">12 oz</button>
                <button onClick={() => setOunces(16)} className="px-3 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm">16 oz</button>
                <button onClick={() => setOunces(32)} className="px-3 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm">32 oz</button>
                <button onClick={() => setOunces(64)} className="px-3 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm">64 oz</button>
              </div>
            </div>

            {/* Formula Display */}
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Conversion Formula</h4>
              <p className="text-green-700 font-mono text-sm">Cups = Fluid Ounces ÷ 8</p>
              <p className="text-green-600 text-xs mt-1">1 cup = 8 fluid ounces</p>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Conversion Results</h3>

            <div className="space-y-4">
              <div className="bg-blue-100 rounded-lg p-4 text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600" id="cupsResult">{cupsResult}</div>
                <div className="text-blue-700">Cups</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Cups (decimal):</span>
                  <span id="cupsDecimal" className="font-semibold">{cupsDecimal}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Cups (fraction):</span>
                  <span id="cupsFraction" className="font-semibold">{cupsFraction}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Pints:</span>
                  <span id="pintsResult" className="font-semibold">{pintsResult}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Quarts:</span>
                  <span id="quartsResult" className="font-semibold">{quartsResult}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Gallons:</span>
                  <span id="gallonsResult" className="font-semibold">{gallonsResult}</span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Milliliters:</span>
                  <span id="millilitersResult" className="font-semibold">{millilitersResult}</span>
                </div>
              </div>

              {/* Common Kitchen Equivalents */}
              <div className="bg-yellow-50 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Kitchen Equivalent</h4>
                <div id="kitchenEquivalent" className="text-yellow-700 text-sm">
                  {kitchenEquivalent}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* Conversion Table */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Quick Conversion Table</h3>

        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          <div>
            <h4 className="font-semibold text-gray-700 mb-4">Common Fluid Ounce to Cup Conversions</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>1 fl oz</span>
                <span className="font-semibold">⅛ cup</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>2 fl oz</span>
                <span className="font-semibold">¼ cup</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>4 fl oz</span>
                <span className="font-semibold">½ cup</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>6 fl oz</span>
                <span className="font-semibold">¾ cup</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>8 fl oz</span>
                <span className="font-semibold">1 cup</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>12 fl oz</span>
                <span className="font-semibold">1½ cups</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>16 fl oz</span>
                <span className="font-semibold">2 cups</span>
              </div>
              <div className="flex justify-between py-1">
                <span>32 fl oz</span>
                <span className="font-semibold">4 cups</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-4">Related Kitchen Measurements</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>1 cup</span>
                <span className="font-semibold">16 tablespoons</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>1 cup</span>
                <span className="font-semibold">48 teaspoons</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>1 cup</span>
                <span className="font-semibold">½ pint</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>2 cups</span>
                <span className="font-semibold">1 pint</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>4 cups</span>
                <span className="font-semibold">1 quart</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>16 cups</span>
                <span className="font-semibold">1 gallon</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span>1 fl oz</span>
                <span className="font-semibold">29.57 mL</span>
              </div>
              <div className="flex justify-between py-1">
                <span>1 cup</span>
                <span className="font-semibold">236.6 mL</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Examples */}
      <div className="bg-green-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-xl font-semibold text-green-800 mb-4">Recipe Examples</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2 text-green-800">Coffee</h4>
            <p className="text-sm text-green-700">6 fl oz per serving</p>
            <p className="font-medium text-green-600">= ¾ cup</p>
          </div>
<div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2 text-green-800">Milk (Recipe)</h4>
            <p className="text-sm text-green-700">12 fl oz needed</p>
            <p className="font-medium text-green-600">= 1½ cups</p>
          </div>
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2 text-green-800">Soup Portion</h4>
            <p className="text-sm text-green-700">10 fl oz serving</p>
            <p className="font-medium text-green-600">= 1¼ cups</p>
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div className="bg-blue-50 rounded-lg p-3 sm:p-4 md:p-6">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">About Fluid Ounce to Cup Conversion</h3>
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 text-blue-700">
          <div>
            <h4 className="font-semibold mb-2">Key Facts:</h4>
            <ul className="space-y-2">
              <li>• 1 cup = 8 fluid ounces (US customary)</li>
              <li>• Fluid ounces measure volume, not weight</li>
              <li>• Different ingredients have different weights per cup</li>
              <li>• Measuring cups are designed for liquid measurements</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Cooking Tips:</h4>
            <ul className="space-y-2">
              <li>• Use liquid measuring cups for fluid ounces</li>
              <li>• Check at eye level for accurate measurements</li>
              <li>• Different countries use different cup sizes</li>
              <li>• Recipe conversions may need adjustment</li>
            </ul>
          </div>
        </div>
      </div>

      {/* MREC Advertisement Banners */}
      {/* Enhanced Related Calculators */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Converter Calculators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {relatedCalculators.map((calc, index) => (
            <Link
              key={index}
              href={calc.href}
              className={`${calc.color} rounded-lg p-6 text-white hover:opacity-90 transition-opacity`}
            >
              <h3 className="text-xl font-semibold mb-2">{calc.title}</h3>
              <p className="text-sm opacity-90">{calc.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="ounces-to-cups-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
