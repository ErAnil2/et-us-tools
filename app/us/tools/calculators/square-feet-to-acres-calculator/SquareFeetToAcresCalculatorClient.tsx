'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
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
    question: "What is a Square Feet To Acres Calculator?",
    answer: "A Square Feet To Acres Calculator is a free online tool designed to help you quickly and accurately calculate square feet to acres-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Square Feet To Acres Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Square Feet To Acres Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Square Feet To Acres Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function SquareFeetToAcresCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('square-feet-to-acres-calculator');

  const [squareFeet, setSquareFeet] = useState(43560);
  const [acresResult, setAcresResult] = useState(0);
  const [acres, setAcres] = useState(1);
  const [sqFtResult, setSqFtResult] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [resultText, setResultText] = useState('');

  const sqFtToAcres = (sqFt: number) => {
    return sqFt / 43560;
  };

  const acresToSqFt = (acres: number) => {
    return acres * 43560;
  };

  const updateSqFtToAcres = () => {
    const acres = sqFtToAcres(squareFeet);
    setAcresResult(acres);
    setResultText(`${squareFeet.toLocaleString()} square feet = ${acres.toFixed(6)} acres`);
    setShowResults(true);
  };

  const updateAcresToSqFt = () => {
    const sqFt = acresToSqFt(acres);
    setSqFtResult(sqFt);
    setResultText(`${acres} acres = ${sqFt.toLocaleString()} square feet`);
    setShowResults(true);
  };

  // Auto-calculate on input
  useEffect(() => {
    updateSqFtToAcres();
  }, [squareFeet]);

  useEffect(() => {
    updateAcresToSqFt();
  }, [acres]);

  // Initial calculation
  useEffect(() => {
    updateSqFtToAcres();
    updateAcresToSqFt();
  }, []);

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{getH1('Square Feet to Acres Calculator')}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Convert between square feet and acres for land measurement, real estate calculations, and property planning.
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="grid lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8">
        {/* Calculator */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Area Converter</h2>

            {/* Square Feet to Acres */}
            <div className="mb-4 sm:mb-6 md:mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                📐 Square Feet to Acres
              </h3>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="squareFeet" className="block text-sm font-medium text-gray-700 mb-2">Square Feet</label>
                  <input
                    type="number"
                    id="squareFeet"
                    step="0.01"
                    value={squareFeet}
                    onChange={(e) => setSquareFeet(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label htmlFor="acresResult" className="block text-sm font-medium text-gray-700 mb-2">Acres</label>
                  <input
                    type="number"
                    id="acresResult"
                    step="0.001"
                    value={acresResult.toFixed(6)}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                  />
                </div>
              </div>

              <button
                onClick={updateSqFtToAcres}
                className="w-full md:w-auto bg-green-600 text-white px-3 sm:px-4 md:px-6 py-3 rounded-md hover:bg-green-700 transition-colors font-medium"
              >
                Convert to Acres
              </button>
            </div>

            {/* Acres to Square Feet */}
            <div className="mb-4 sm:mb-6 md:mb-8 border-t pt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                🏞️ Acres to Square Feet
              </h3>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="acres" className="block text-sm font-medium text-gray-700 mb-2">Acres</label>
                  <input
                    type="number"
                    id="acres"
                    step="0.001"
                    value={acres}
                    onChange={(e) => setAcres(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="sqFtResult" className="block text-sm font-medium text-gray-700 mb-2">Square Feet</label>
                  <input
                    type="number"
                    id="sqFtResult"
                    step="0.01"
                    value={sqFtResult.toFixed(2)}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                  />
                </div>
              </div>

              <button
                onClick={updateAcresToSqFt}
                className="w-full md:w-auto bg-blue-600 text-white px-3 sm:px-4 md:px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Convert to Square Feet
              </button>
            </div>

            {/* Results Display */}
            {showResults && (
              <div id="results" className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Conversion Results</h3>
                <div id="resultContent" className="text-gray-700">{resultText}</div>
              </div>
            )}
          </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

          {/* Conversion Reference Table */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Quick Reference Table</h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-2 py-3 text-left font-semibold">Square Feet</th>
                    <th className="border border-gray-300 px-2 py-3 text-left font-semibold">Acres</th>
                    <th className="border border-gray-300 px-2 py-3 text-left font-semibold">Common Use</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-2 py-2">43,560</td>
                    <td className="border border-gray-300 px-2 py-2">1</td>
                    <td className="border border-gray-300 px-2 py-2">Standard acre</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-2 py-2">21,780</td>
                    <td className="border border-gray-300 px-2 py-2">0.5</td>
                    <td className="border border-gray-300 px-2 py-2">Half acre lot</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-2 py-2">10,890</td>
                    <td className="border border-gray-300 px-2 py-2">0.25</td>
                    <td className="border border-gray-300 px-2 py-2">Quarter acre lot</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-2 py-2">87,120</td>
                    <td className="border border-gray-300 px-2 py-2">2</td>
                    <td className="border border-gray-300 px-2 py-2">Large residential lot</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-2 py-2">435,600</td>
                    <td className="border border-gray-300 px-2 py-2">10</td>
                    <td className="border border-gray-300 px-2 py-2">Small farm</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-2 py-2">4,356,000</td>
                    <td className="border border-gray-300 px-2 py-2">100</td>
                    <td className="border border-gray-300 px-2 py-2">Medium farm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Formula and Information */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Conversion Formula</h2>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Square Feet to Acres:</h3>
                <p className="text-blue-800 font-mono">Acres = Square Feet ÷ 43,560</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">Acres to Square Feet:</h3>
                <p className="text-green-800 font-mono">Square Feet = Acres × 43,560</p>
              </div>
            </div>
          </div>
</div>

        {/* Sidebar */}
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {/* Key Facts */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Key Facts</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                <span>1 acre = 43,560 square feet exactly</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>1 acre ≈ 4,047 square meters</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <span>1 acre ≈ 0.405 hectares</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-orange-600">•</span>
                <span>Football field ≈ 1.32 acres</span>
              </div>
            </div>
          </div>

          {/* Common Lot Sizes */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Common Lot Sizes</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Urban lot:</span>
                <span className="font-medium">0.1-0.25 acres</span>
              </div>
              <div className="flex justify-between">
                <span>Suburban lot:</span>
                <span className="font-medium">0.25-0.5 acres</span>
              </div>
              <div className="flex justify-between">
                <span>Large suburban:</span>
                <span className="font-medium">0.5-1 acre</span>
              </div>
              <div className="flex justify-between">
                <span>Rural lot:</span>
                <span className="font-medium">1+ acres</span>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">💡 Tips</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p>Use this converter for property listings, land purchases, and zoning calculations.</p>
              <p>Remember that lot shape affects usable space - irregular lots may have less practical area.</p>
              <p>Check local zoning laws for minimum lot size requirements.</p>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Advertisement Banners */}
{/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mt-8">
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
        <FirebaseFAQs pageId="square-feet-to-acres-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
