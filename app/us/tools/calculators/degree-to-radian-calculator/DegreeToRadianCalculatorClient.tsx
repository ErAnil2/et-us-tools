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
    question: "What is a Degree To Radian Calculator?",
    answer: "A Degree To Radian Calculator is a free online tool designed to help you quickly and accurately calculate degree to radian-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Degree To Radian Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Degree To Radian Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Degree To Radian Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function DegreeToRadianCalculatorClient() {
  const { getH1, getSubHeading } = usePageSEO('degree-to-radian-calculator');

  const [degrees, setDegrees] = useState(180);
  const [radians, setRadians] = useState(Math.PI);
  const [mode, setMode] = useState('degToRad');

  useEffect(() => {
    if (mode === 'degToRad') {
      setRadians(degrees * (Math.PI / 180));
    }
  }, [degrees, mode]);

  useEffect(() => {
    if (mode === 'radToDeg') {
      setDegrees(radians * (180 / Math.PI));
    }
  }, [radians, mode]);

  const relatedCalculators = [
    { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages', color: 'bg-blue-600' },
    { href: '/us/tools/calculators/scientific-calculator', title: 'Scientific Calculator', description: 'Advanced calculations', color: 'bg-purple-600' },
    { href: '/us/tools/calculators/area-calculator', title: 'Area Calculator', description: 'Calculate areas', color: 'bg-green-600' },
    { href: '/us/tools/calculators/unit-converter', title: 'Unit Converter', description: 'Convert units', color: 'bg-orange-500' },
    { href: '/us/tools/calculators/fraction-calculator', title: 'Fraction Calculator', description: 'Work with fractions', color: 'bg-teal-600' },
    { href: '/us/tools/calculators/circumference-calculator', title: 'Circumference Calculator', description: 'Calculate circumference', color: 'bg-red-500' },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Degree to Radian Calculator')}</h1>
        <p className="text-lg text-gray-600">Convert angles between degrees and radians</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Convert Angles</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Conversion Mode</label>
              <select value={mode} onChange={(e) => setMode(e.target.value)} className="w-full px-4 py-3 border rounded-lg">
                <option value="degToRad">Degrees to Radians</option>
                <option value="radToDeg">Radians to Degrees</option>
              </select>
            </div>

            {mode === 'degToRad' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Degrees: {degrees.toFixed(2)}°</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={degrees}
                  onChange={(e) => setDegrees(Number(e.target.value))}
                  className="w-full h-2 bg-blue-200 rounded-lg"
                />
                <input
                  type="number"
                  value={degrees}
                  onChange={(e) => setDegrees(Number(e.target.value))}
                  className="w-full mt-2 px-4 py-3 border rounded-lg"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Radians: {radians.toFixed(4)}</label>
                <input
                  type="number"
                  step="0.1"
                  value={radians.toFixed(4)}
                  onChange={(e) => setRadians(Number(e.target.value))}
                  className="w-full px-4 py-3 border rounded-lg"
                />
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Conversion Formula</h3>
              <p className="text-sm text-blue-700 font-mono">
                {mode === 'degToRad'
                  ? 'Radians = Degrees × (π / 180)'
                  : 'Degrees = Radians × (180 / π)'}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Result</h2>

            <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200 mb-4">
              <div className="text-sm text-purple-600 mb-1">
                {mode === 'degToRad' ? 'Radians' : 'Degrees'}
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-700">
                {mode === 'degToRad'
                  ? radians.toFixed(6)
                  : degrees.toFixed(4) + '°'}
              </div>
              <div className="text-sm text-purple-600 mt-2">
                ≈ {mode === 'degToRad'
                  ? (radians / Math.PI).toFixed(4) + 'π'
                  : degrees.toFixed(4) + ' degrees'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <div className="text-xs text-gray-500">Degrees</div>
                <div className="text-lg font-bold text-gray-800">{degrees.toFixed(2)}°</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <div className="text-xs text-gray-500">Radians</div>
                <div className="text-lg font-bold text-gray-800">{radians.toFixed(4)}</div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">Common Conversions</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>0° = 0 rad</p>
                <p>90° = π/2 rad ≈ 1.5708</p>
                <p>180° = π rad ≈ 3.1416</p>
                <p>270° = 3π/2 rad ≈ 4.7124</p>
                <p>360° = 2π rad ≈ 6.2832</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-lg p-4 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <div className="text-2xl mb-2">📐</div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{calc.title}</h3>
                <p className="text-xs text-gray-600">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="degree-to-radian-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
</div>
  );
}
