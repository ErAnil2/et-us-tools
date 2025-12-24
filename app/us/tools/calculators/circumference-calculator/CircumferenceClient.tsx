'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FirebaseFAQs } from '@/components/PageSEOContent';

import { CalculatorAfterCalcBanners } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
}

interface CircumferenceClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '📊' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

type InputMethod = 'radius' | 'diameter' | 'area';
type LinearUnit = 'mm' | 'cm' | 'm' | 'in' | 'ft' | 'km';
type AreaUnit = 'mm2' | 'cm2' | 'm2' | 'in2' | 'ft2' | 'km2';

const unitConversions = {
  // Linear units (to cm)
  mm: 0.1,
  cm: 1,
  m: 100,
  in: 2.54,
  ft: 30.48,
  km: 100000,
  // Area units (to cm²)
  mm2: 0.01,
  cm2: 1,
  m2: 10000,
  in2: 6.4516,
  ft2: 929.03,
  km2: 10000000000
};

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Circumference Calculator?",
    answer: "A Circumference Calculator is a free online tool designed to help you quickly and accurately calculate circumference-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Circumference Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Circumference Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Circumference Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function CircumferenceClient({ relatedCalculators = defaultRelatedCalculators }: CircumferenceClientProps) {
  const { getH1, getSubHeading } = usePageSEO('circumference-calculator');

  const [inputMethod, setInputMethod] = useState<InputMethod>('radius');

  // Radius
  const [radius, setRadius] = useState(5);
  const [radiusUnit, setRadiusUnit] = useState<LinearUnit>('cm');

  // Diameter
  const [diameter, setDiameter] = useState(10);
  const [diameterUnit, setDiameterUnit] = useState<LinearUnit>('cm');

  // Area
  const [area, setArea] = useState(78.54);
  const [areaUnit, setAreaUnit] = useState<AreaUnit>('cm2');

  // Results
  const [circumferenceCm, setCircumferenceCm] = useState(0);
  const [radiusCm, setRadiusCm] = useState(0);
  const [diameterCm, setDiameterCm] = useState(0);
  const [areaCm2, setAreaCm2] = useState(0);
  const [steps, setSteps] = useState<string[]>([]);

  useEffect(() => {
    calculateCircumference();
  }, [inputMethod, radius, radiusUnit, diameter, diameterUnit, area, areaUnit]);

  const convertToCm = (value: number, unit: LinearUnit | AreaUnit): number => {
    return value * unitConversions[unit];
  };

  const convertFromCm = (valueCm: number, unit: LinearUnit): number => {
    return valueCm / unitConversions[unit];
  };

  const formatNumber = (num: number, decimals: number = 2): string => {
    return num.toFixed(decimals);
  };

  const calculateCircumference = () => {
    let radiusInCm: number;
    let calculationSteps: string[] = [];

    switch (inputMethod) {
      case 'radius':
        radiusInCm = convertToCm(radius, radiusUnit);
        calculationSteps = [
          `Step 1: Given radius r = ${radius} ${radiusUnit}`,
          `Step 2: Apply formula C = 2πr`,
          `Step 3: C = 2 × π × ${radius}`,
          `Step 4: C = ${formatNumber(2 * Math.PI * radius)} ${radiusUnit}`
        ];
        break;

      case 'diameter':
        radiusInCm = convertToCm(diameter, diameterUnit) / 2;
        calculationSteps = [
          `Step 1: Given diameter d = ${diameter} ${diameterUnit}`,
          `Step 2: Apply formula C = πd`,
          `Step 3: C = π × ${diameter}`,
          `Step 4: C = ${formatNumber(Math.PI * diameter)} ${diameterUnit}`
        ];
        break;

      case 'area':
        const areaCm = convertToCm(area, areaUnit);
        radiusInCm = Math.sqrt(areaCm / Math.PI);
        const radiusFromArea = Math.sqrt(area / Math.PI);
        const circumferenceFromArea = 2 * Math.PI * radiusFromArea;
        const baseUnit = areaUnit.replace('2', '');
        calculationSteps = [
          `Step 1: Given area A = ${area} ${areaUnit}`,
          `Step 2: Find radius: r = √(A/π)`,
          `Step 3: r = √(${area}/π) = ${formatNumber(radiusFromArea)} ${baseUnit}`,
          `Step 4: Apply C = 2πr`,
          `Step 5: C = ${formatNumber(circumferenceFromArea)} ${baseUnit}`
        ];
        break;
    }

    // Calculate all circle properties
    const circum = 2 * Math.PI * radiusInCm;
    const diam = 2 * radiusInCm;
    const areaResult = Math.PI * Math.pow(radiusInCm, 2);

    setCircumferenceCm(circum);
    setRadiusCm(radiusInCm);
    setDiameterCm(diam);
    setAreaCm2(areaResult);
    setSteps(calculationSteps);
  };

  const getFormula = () => {
    switch (inputMethod) {
      case 'radius':
        return { formula: 'C = 2πr', explanation: 'Circumference equals 2 times π times radius' };
      case 'diameter':
        return { formula: 'C = πd', explanation: 'Circumference equals π times diameter' };
      case 'area':
        return { formula: 'C = 2π√(A/π)', explanation: 'First find radius from area, then calculate circumference' };
    }
  };

  const formulaInfo = getFormula();

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-6 md:py-8">
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <Link href="/us/tools" className="text-blue-600 hover:text-blue-800 text-sm md:text-base">
          Home
        </Link>
        <span className="text-gray-400">›</span>
        <span className="text-gray-600 text-sm md:text-base">Circumference Calculator</span>
      </div>

      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 md:mb-4">{getH1('Circumference Calculator')}</h1>
        <p className="text-sm md:text-lg text-gray-600">
          Calculate circle circumference from radius, diameter, or area with step-by-step calculations
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-4 sm:mb-6 md:mb-8">
        {/* Calculator Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
            {/* Input Method Selection */}
            <div className="mb-3 sm:mb-4 md:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Calculate From:</label>
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {[
                  { value: 'radius' as InputMethod, label: 'Radius' },
                  { value: 'diameter' as InputMethod, label: 'Diameter' },
                  { value: 'area' as InputMethod, label: 'Area' }
                ].map((method) => (
                  <label
                    key={method.value}
                    className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                      inputMethod === method.value ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      checked={inputMethod === method.value}
                      onChange={() => setInputMethod(method.value)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              {/* Radius Input */}
              {inputMethod === 'radius' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Radius (r)</label>
                  <div className="flex">
                    <input
                      type="number"
                      value={radius}
                      onChange={(e) => setRadius(parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                      className="flex-1 px-3 py-2.5 rounded-l-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <select
                      value={radiusUnit}
                      onChange={(e) => setRadiusUnit(e.target.value as LinearUnit)}
                      className="px-3 py-2.5 rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 text-gray-700"
                    >
                      <option value="cm">cm</option>
                      <option value="m">m</option>
                      <option value="in">in</option>
                      <option value="ft">ft</option>
                      <option value="mm">mm</option>
                      <option value="km">km</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Diameter Input */}
              {inputMethod === 'diameter' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Diameter (d)</label>
                  <div className="flex">
                    <input
                      type="number"
                      value={diameter}
                      onChange={(e) => setDiameter(parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                      className="flex-1 px-3 py-2.5 rounded-l-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <select
                      value={diameterUnit}
                      onChange={(e) => setDiameterUnit(e.target.value as LinearUnit)}
                      className="px-3 py-2.5 rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 text-gray-700"
                    >
                      <option value="cm">cm</option>
                      <option value="m">m</option>
                      <option value="in">in</option>
                      <option value="ft">ft</option>
                      <option value="mm">mm</option>
                      <option value="km">km</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Area Input */}
              {inputMethod === 'area' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Area (A)</label>
                  <div className="flex">
                    <input
                      type="number"
                      value={area}
                      onChange={(e) => setArea(parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                      className="flex-1 px-3 py-2.5 rounded-l-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <select
                      value={areaUnit}
                      onChange={(e) => setAreaUnit(e.target.value as AreaUnit)}
                      className="px-3 py-2.5 rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 text-gray-700"
                    >
                      <option value="cm2">cm²</option>
                      <option value="m2">m²</option>
                      <option value="in2">in²</option>
                      <option value="ft2">ft²</option>
                      <option value="mm2">mm²</option>
                      <option value="km2">km²</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Formula Display */}
            <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-2">Current Formula:</div>
              <div className="font-mono text-sm text-gray-600">{formulaInfo.formula}</div>
              <div className="text-xs text-gray-500 mt-1">{formulaInfo.explanation}</div>
            </div>
          </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

        </div>

        {/* Results Panel */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-100 rounded-xl p-3 sm:p-4 sticky top-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-3 sm:mb-4 md:mb-6">Circle Properties</h2>

            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600">Circumference</div>
                <div className="text-2xl font-bold text-indigo-600">{formatNumber(circumferenceCm)} cm</div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600">Radius</div>
                <div className="text-lg font-semibold text-gray-800">{formatNumber(radiusCm)} cm</div>
              </div>
<div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600">Diameter</div>
                <div className="text-lg font-semibold text-gray-800">{formatNumber(diameterCm)} cm</div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600">Area</div>
                <div className="text-lg font-semibold text-gray-800">{formatNumber(areaCm2)} cm²</div>
              </div>

              {/* Unit Conversions */}
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-3">Circumference in Other Units</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Millimeters:</span>
                    <span className="font-semibold">{formatNumber(convertFromCm(circumferenceCm, 'mm'))} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Meters:</span>
                    <span className="font-semibold">{formatNumber(convertFromCm(circumferenceCm, 'm'), 4)} m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Inches:</span>
                    <span className="font-semibold">{formatNumber(convertFromCm(circumferenceCm, 'in'))} in</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Feet:</span>
                    <span className="font-semibold">{formatNumber(convertFromCm(circumferenceCm, 'ft'))} ft</span>
                  </div>
                </div>
              </div>

              {/* Calculation Steps */}
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-2">Calculation Steps</div>
                <div className="text-xs text-gray-600 space-y-1">
                  {steps.map((step, index) => (
                    <div key={index}>{step}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Content */}
      <div className="bg-blue-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">How to Calculate Circle Circumference</h3>
        <div className="text-blue-700 text-sm md:text-base space-y-3">
          <p>
            Calculating circumference is fundamental in geometry and has many real-world applications. Whether you're measuring
            the perimeter of a circular garden, calculating material needed for a wheel, or solving geometry problems, our
            circumference calculator provides accurate results.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold mb-2">Common Formulas:</h4>
              <ul className="space-y-1 text-sm">
                <li>• C = 2πr (from radius)</li>
                <li>• C = πd (from diameter)</li>
                <li>• C = 2π√(A/π) (from area)</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold mb-2">Real-World Uses:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Track and field measurements</li>
                <li>• Wheel and tire sizing</li>
                <li>• Circular garden planning</li>
                <li>• Engineering designs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
{/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Math Calculators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {relatedCalculators.map((calc, index) => (
            <Link key={index} href={calc.href} className="group">
              <div className="p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all">
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
        <FirebaseFAQs pageId="circumference-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
