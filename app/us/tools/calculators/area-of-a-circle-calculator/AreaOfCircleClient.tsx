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

interface AreaOfCircleClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '📊' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

const unitConversions: Record<string, number> = {
  mm: 0.1,
  cm: 1,
  m: 100,
  in: 2.54,
  ft: 30.48,
  km: 100000,
};

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Area Of A Circle Calculator?",
    answer: "A Area Of A Circle Calculator is a mathematical tool that helps you quickly calculate or convert area of a circle-related values. It eliminates manual calculations and provides instant, accurate results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Area Of A Circle Calculator?",
    answer: "Simply enter your values in the input fields provided. The calculator will automatically compute and display the results. You can adjust values to see how changes affect the outcome.",
    order: 2
  },
  {
    id: '3',
    question: "Are the results accurate?",
    answer: "Yes, our Area Of A Circle Calculator uses precise mathematical formulas to ensure accurate results. The calculations follow standard mathematical conventions and formulas.",
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
    answer: "Yes, this Area Of A Circle Calculator is completely free to use with no registration required. Use it as many times as you need for your calculations.",
    order: 5
  }
];

export default function AreaOfCircleClient({ relatedCalculators = defaultRelatedCalculators }: AreaOfCircleClientProps) {
  const { getH1, getSubHeading } = usePageSEO('area-of-a-circle-calculator');

  const [inputMethod, setInputMethod] = useState('radius');
  const [value, setValue] = useState(5);
  const [unit, setUnit] = useState('cm');

  // Calculated values
  const [radiusCm, setRadiusCm] = useState(0);
  const [area, setArea] = useState(0);
  const [diameter, setDiameter] = useState(0);
  const [circumference, setCircumference] = useState(0);
  const [steps, setSteps] = useState<string[]>([]);

  useEffect(() => {
    calculateCircle();
  }, [inputMethod, value, unit]);

  const calculateCircle = () => {
    const valueCm = value * unitConversions[unit];
    let r = 0;

    // Calculate radius in cm based on input method
    switch (inputMethod) {
      case 'radius':
        r = valueCm;
        break;
      case 'diameter':
        r = valueCm / 2;
        break;
      case 'circumference':
        r = valueCm / (2 * Math.PI);
        break;
    }

    setRadiusCm(r);

    // Calculate all properties
    const a = Math.PI * r * r;
    const d = r * 2;
    const c = 2 * Math.PI * r;

    setArea(a);
    setDiameter(d);
    setCircumference(c);

    // Generate steps
    generateSteps(inputMethod, value, unit, r, a);
  };

  const generateSteps = (method: string, val: number, u: string, r: number, a: number) => {
    const newSteps: string[] = [];

    switch (method) {
      case 'radius':
        newSteps.push(`Step 1: Given radius r = ${val} ${u}`);
        newSteps.push(`Step 2: Apply formula A = π × r²`);
        newSteps.push(`Step 3: A = π × ${val}²`);
        newSteps.push(`Step 4: A = π × ${(val * val).toFixed(2)}`);
        newSteps.push(`Step 5: A = ${formatNumber(a / (unitConversions[u] * unitConversions[u]))} ${u}²`);
        break;
      case 'diameter':
        newSteps.push(`Step 1: Given diameter d = ${val} ${u}`);
        newSteps.push(`Step 2: Calculate radius r = d/2 = ${val}/2 = ${(val / 2).toFixed(2)} ${u}`);
        newSteps.push(`Step 3: Apply formula A = π × r²`);
        newSteps.push(`Step 4: A = π × ${(val / 2).toFixed(2)}²`);
        newSteps.push(`Step 5: A = ${formatNumber(a / (unitConversions[u] * unitConversions[u]))} ${u}²`);
        break;
      case 'circumference':
        newSteps.push(`Step 1: Given circumference C = ${val} ${u}`);
        newSteps.push(`Step 2: Calculate radius r = C/(2π) = ${val}/(2π)`);
        newSteps.push(`Step 3: r = ${formatNumber(r / unitConversions[u])} ${u}`);
        newSteps.push(`Step 4: Apply formula A = π × r²`);
        newSteps.push(`Step 5: A = ${formatNumber(a / (unitConversions[u] * unitConversions[u]))} ${u}²`);
        break;
    }

    setSteps(newSteps);
  };

  const formatNumber = (num: number, decimals = 2): string => {
    if (num === 0) return '0';
    if (num < 0.001) return num.toExponential(2);
    return parseFloat(num.toFixed(decimals)).toString();
  };

  const setPresetRadius = (r: number) => {
    setInputMethod('radius');
    setValue(r);
    setUnit('cm');
  };

  const getFormula = () => {
    switch (inputMethod) {
      case 'radius':
        return { formula: 'A = π × r²', description: 'Area equals pi times radius squared' };
      case 'diameter':
        return { formula: 'A = π × (d/2)²', description: 'Area equals pi times diameter squared divided by 4' };
      case 'circumference':
        return { formula: 'A = C² ÷ (4π)', description: 'Area equals circumference squared divided by 4 pi' };
      default:
        return { formula: 'A = π × r²', description: 'Area equals pi times radius squared' };
    }
  };

  const formula = getFormula();

  // Unit conversions for display
  const areaCm2 = area;
  const areaM2 = areaCm2 * 0.0001;
  const areaIn2 = areaCm2 * 0.15500031;
  const areaFt2 = areaCm2 * 0.00107639;
  const areaMm2 = areaCm2 * 100;

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-6 md:py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <Link href="/us/tools" className="text-blue-600 hover:text-blue-800 text-sm md:text-base">
          Home
        </Link>
        <span className="text-gray-400">›</span>
        <span className="text-gray-600 text-sm md:text-base">Area of a Circle Calculator</span>
      </div>

      {/* Header */}
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-lg sm:text-xl md:text-2xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">{getH1('Area of a Circle Calculator Online')}</h1>
        <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto">
          Calculate circle area from radius, diameter, or circumference with step-by-step solutions and unit conversions.
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 mb-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Circle Measurements</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Calculate From</label>
              <select
                value={inputMethod}
                onChange={(e) => setInputMethod(e.target.value)}
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="radius">Radius</option>
                <option value="diameter">Diameter</option>
                <option value="circumference">Circumference</option>
              </select>
            </div>

            {/* Input with Unit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {inputMethod.charAt(0).toUpperCase() + inputMethod.slice(1)}
              </label>
              <div className="flex">
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
                  step="0.01"
                  min="0"
                  placeholder="e.g., 5"
                  className="flex-1 px-2 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="px-2 py-3 border border-l-0 border-gray-300 rounded-r-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
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

            {/* Quick Size Presets */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-3">Common Sizes</h4>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 5, 7.5, 10].map((r) => (
                  <button
                    key={r}
                    onClick={() => setPresetRadius(r)}
                    className="px-3 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm transition-colors"
                  >
                    r={r}
                  </button>
                ))}
              </div>
            </div>

            {/* Formula Display */}
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Formula Used</h4>
              <div className="text-green-700">
                <p className="font-mono">{formula.formula}</p>
                <p className="text-xs mt-1">{formula.description}</p>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Circle Properties</h3>

            <div className="space-y-4">
              <div className="bg-green-100 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-600">
                  {formatNumber(area / (unitConversions[unit] * unitConversions[unit]))}
                </div>
                <div className="text-green-700">Area ({unit}²)</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Radius:</span>
                  <span className="font-semibold">
                    {formatNumber(radiusCm / unitConversions[unit])} {unit}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Diameter:</span>
                  <span className="font-semibold">
                    {formatNumber(diameter / unitConversions[unit])} {unit}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Circumference:</span>
                  <span className="font-semibold">
                    {formatNumber(circumference / unitConversions[unit])} {unit}
                  </span>
                </div>
              </div>

              {/* Unit Conversions */}
              <div className="bg-purple-100 rounded-lg p-4">
                <h4 className="font-semibold text-purple-800 mb-2">Area in Other Units</h4>
                <div className="text-purple-700 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Square meters:</span>
                    <span className="font-semibold">{formatNumber(areaM2, 4)} m²</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Square inches:</span>
                    <span className="font-semibold">{formatNumber(areaIn2)} in²</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Square feet:</span>
                    <span className="font-semibold">{formatNumber(areaFt2, 3)} ft²</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Square mm:</span>
                    <span className="font-semibold">{formatNumber(areaMm2, 0)} mm²</span>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Calculation */}
              <div className="bg-yellow-100 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Calculation Steps</h4>
                <div className="text-yellow-700 text-sm space-y-1">
                  {steps.map((step, index) => (
                    <p key={index}>{step}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* Real-world Examples */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 mb-8">
        <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">Real-World Examples</h3>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Pizza (12-inch diameter)</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Radius: 6 inches</li>
              <li>• Area: 113.10 in²</li>
              <li>• Perfect for 2-3 people</li>
            </ul>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">Garden Bed (3m diameter)</h4>
            <ul className="text-green-700 text-sm space-y-1">
              <li>• Radius: 1.5 meters</li>
              <li>• Area: 7.07 m²</li>
              <li>• Great for herb garden</li>
            </ul>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-2">Round Table (4ft diameter)</h4>
            <ul className="text-purple-700 text-sm space-y-1">
              <li>• Radius: 2 feet</li>
              <li>• Area: 12.57 ft²</li>
              <li>• Seats 4-6 people</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div className="bg-blue-50 rounded-lg p-3 sm:p-4 mb-8">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">About Circle Area Calculation</h3>
        <div className="grid md:grid-cols-2 gap-6 text-blue-700">
          <div>
            <h4 className="font-semibold mb-2">Key Formulas:</h4>
            <ul className="space-y-2 text-sm">
              <li>• <strong>From radius:</strong> A = π × r²</li>
              <li>• <strong>From diameter:</strong> A = π × (d/2)²</li>
              <li>• <strong>From circumference:</strong> A = C² ÷ (4π)</li>
              <li>• π (pi) ≈ 3.14159265359</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Important Notes:</h4>
            <ul className="space-y-2 text-sm">
              <li>• Area is always in square units (unit²)</li>
              <li>• Radius is half the diameter</li>
              <li>• All measurements must use the same units</li>
              <li>• π is a mathematical constant (~3.14159)</li>
            </ul>
          </div>
        </div>
      </div>
{/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Related Math Calculators</h2>
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
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="area-of-a-circle-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
</div>
  );
}
