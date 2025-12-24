'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FirebaseFAQs } from '@/components/PageSEOContent';

import { CalculatorAfterCalcBanners } from '@/components/MRECBanners';
import { usePageSEO } from '@/lib/usePageSEO';
interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color?: string;
  icon?: string;
}

interface CylinderVolumeClientProps {
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
    question: "What is a Cylinder Volume Calculator?",
    answer: "A Cylinder Volume Calculator is a mathematical tool that helps you quickly calculate or convert cylinder volume-related values. It eliminates manual calculations and provides instant, accurate results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Cylinder Volume Calculator?",
    answer: "Simply enter your values in the input fields provided. The calculator will automatically compute and display the results. You can adjust values to see how changes affect the outcome.",
    order: 2
  },
  {
    id: '3',
    question: "Are the results accurate?",
    answer: "Yes, our Cylinder Volume Calculator uses precise mathematical formulas to ensure accurate results. The calculations follow standard mathematical conventions and formulas.",
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
    answer: "Yes, this Cylinder Volume Calculator is completely free to use with no registration required. Use it as many times as you need for your calculations.",
    order: 5
  }
];

export default function CylinderVolumeClient({ relatedCalculators = defaultRelatedCalculators }: CylinderVolumeClientProps) {
  const { getH1, getSubHeading } = usePageSEO('cylinder-volume-calculator');

  const [inputMethod, setInputMethod] = useState<'radius' | 'diameter'>('radius');
  const [radius, setRadius] = useState<number>(5);
  const [diameter, setDiameter] = useState<number>(10);
  const [height, setHeight] = useState<number>(10);
  const [radiusUnit, setRadiusUnit] = useState<'cm' | 'm' | 'in' | 'ft'>('cm');
  const [diameterUnit, setDiameterUnit] = useState<'cm' | 'm' | 'in' | 'ft'>('cm');
  const [heightUnit, setHeightUnit] = useState<'cm' | 'm' | 'in' | 'ft'>('cm');

  // Results
  const [volume, setVolume] = useState<number>(0);
  const [surfaceArea, setSurfaceArea] = useState<number>(0);
  const [lateralArea, setLateralArea] = useState<number>(0);
  const [baseArea, setBaseArea] = useState<number>(0);
  const [volumeIn3, setVolumeIn3] = useState<number>(0);
  const [volumeFt3, setVolumeFt3] = useState<number>(0);
  const [volumeL, setVolumeL] = useState<number>(0);
  const [volumeGal, setVolumeGal] = useState<number>(0);
  const [usedRadiusCm, setUsedRadiusCm] = useState<number>(0);
  const [usedHeightCm, setUsedHeightCm] = useState<number>(0);

  const unitConversions: Record<string, number> = {
    cm: 1,
    m: 100,
    in: 2.54,
    ft: 30.48
  };

  const convertToCm = (value: number, unit: string): number => {
    return value * unitConversions[unit];
  };

  const convertVolumeFromCm3 = (volumeCm3: number) => {
    return {
      cm3: volumeCm3,
      in3: volumeCm3 / 16.387,
      ft3: volumeCm3 / 28316.8,
      l: volumeCm3 / 1000,
      gal: volumeCm3 / 3785.41
    };
  };

  const calculateCylinder = () => {
    let radiusCm: number;
    let heightCm: number;

    if (inputMethod === 'radius') {
      radiusCm = convertToCm(radius, radiusUnit);
    } else {
      radiusCm = convertToCm(diameter, diameterUnit) / 2;
    }

    heightCm = convertToCm(height, heightUnit);

    // Calculate cylinder properties
    const vol = Math.PI * Math.pow(radiusCm, 2) * heightCm;
    const base = Math.PI * Math.pow(radiusCm, 2);
    const lateral = 2 * Math.PI * radiusCm * heightCm;
    const surface = 2 * base + lateral;

    // Convert volume to different units
    const volumeConverted = convertVolumeFromCm3(vol);

    // Update state
    setVolume(vol);
    setSurfaceArea(surface);
    setLateralArea(lateral);
    setBaseArea(base);
    setVolumeIn3(volumeConverted.in3);
    setVolumeFt3(volumeConverted.ft3);
    setVolumeL(volumeConverted.l);
    setVolumeGal(volumeConverted.gal);
    setUsedRadiusCm(radiusCm);
    setUsedHeightCm(heightCm);
  };

  useEffect(() => {
    calculateCylinder();
  }, [inputMethod, radius, diameter, height, radiusUnit, diameterUnit, heightUnit]);

  const formatNumber = (num: number, decimals: number = 2): string => {
    return num.toFixed(decimals);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 py-4 sm:py-6 md:py-8 px-2 sm:px-4 lg:px-3 sm:px-5 md:px-8">
      <article className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">{getH1('Cylinder Volume Calculator')}</h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            Calculate the volume and surface area of cylinders using radius and height with multiple unit conversions.
          </p>
        </header>

        {/* Main Calculator Card */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Left Column - Inputs (2 columns on large screens) */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Calculator Inputs</h2>

              {/* Input Method Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Input Method
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="inputMethod"
                      value="radius"
                      checked={inputMethod === 'radius'}
                      onChange={(e) => setInputMethod(e.target.value as 'radius')}
                      className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-gray-700">Radius</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="inputMethod"
                      value="diameter"
                      checked={inputMethod === 'diameter'}
                      onChange={(e) => setInputMethod(e.target.value as 'diameter')}
                      className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-gray-700">Diameter</span>
                  </label>
                </div>
              </div>

              {/* Radius Input */}
              {inputMethod === 'radius' && (
                <div>
                  <label htmlFor="radius" className="block text-sm font-semibold text-gray-700 mb-2">
                    Radius (r)
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      id="radius"
                      value={radius}
                      onChange={(e) => setRadius(parseFloat(e.target.value) || 0)}
                      step="0.01"
                      min="0"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <select
                      value={radiusUnit}
                      onChange={(e) => setRadiusUnit(e.target.value as any)}
                      className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-lg bg-gray-50 text-gray-700"
                    >
                      <option value="cm">cm</option>
                      <option value="m">m</option>
                      <option value="in">in</option>
                      <option value="ft">ft</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Diameter Input */}
              {inputMethod === 'diameter' && (
                <div>
                  <label htmlFor="diameter" className="block text-sm font-semibold text-gray-700 mb-2">
                    Diameter (d)
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      id="diameter"
                      value={diameter}
                      onChange={(e) => setDiameter(parseFloat(e.target.value) || 0)}
                      step="0.01"
                      min="0"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <select
                      value={diameterUnit}
                      onChange={(e) => setDiameterUnit(e.target.value as any)}
                      className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-lg bg-gray-50 text-gray-700"
                    >
                      <option value="cm">cm</option>
                      <option value="m">m</option>
                      <option value="in">in</option>
                      <option value="ft">ft</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Height Input */}
              <div>
                <label htmlFor="height" className="block text-sm font-semibold text-gray-700 mb-2">
                  Height (h)
                </label>
                <div className="flex">
                  <input
                    type="number"
                    id="height"
                    value={height}
                    onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                    step="0.01"
                    min="0"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <select
                    value={heightUnit}
                    onChange={(e) => setHeightUnit(e.target.value as any)}
                    className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-lg bg-gray-50 text-gray-700"
                  >
                    <option value="cm">cm</option>
                    <option value="m">m</option>
                    <option value="in">in</option>
                    <option value="ft">ft</option>
                  </select>
                </div>
              </div>

              {/* Formula Display */}
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-sm font-semibold text-gray-700 mb-2">Formulas:</div>
                <div className="space-y-1">
                  <div className="font-mono text-sm text-gray-600">Volume: V = π × r² × h</div>
                  <div className="font-mono text-sm text-gray-600">Surface Area: SA = 2π × r × (r + h)</div>
                  <div className="font-mono text-sm text-gray-600">Lateral Area: LA = 2π × r × h</div>
                </div>
              </div>
            </div>

            {/* Right Column - Results */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cylinder Properties</h2>

              {/* Volume */}
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-3 sm:p-4 md:p-6 text-white">
                <div className="text-sm font-semibold mb-2 opacity-90">Volume</div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">
                  {formatNumber(volume)}
                </div>
                <div className="text-base opacity-90">cm³</div>
              </div>

              {/* Surface Area */}
              <div className="bg-white rounded-lg p-4 border-2 border-orange-200">
                <div className="text-sm text-gray-600">Surface Area</div>
                <div className="text-lg font-semibold text-gray-800">{formatNumber(surfaceArea)} cm²</div>
              </div>

              {/* Lateral Surface Area */}
              <div className="bg-white rounded-lg p-4 border-2 border-orange-200">
                <div className="text-sm text-gray-600">Lateral Surface Area</div>
                <div className="text-lg font-semibold text-gray-800">{formatNumber(lateralArea)} cm²</div>
              </div>
{/* Base Area */}
              <div className="bg-white rounded-lg p-4 border-2 border-orange-200">
                <div className="text-sm text-gray-600">Base Area</div>
                <div className="text-lg font-semibold text-gray-800">{formatNumber(baseArea)} cm²</div>
              </div>

              {/* Volume Conversions */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-semibold text-gray-700 mb-3">Volume Conversions</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cubic Inches:</span>
                    <span className="font-semibold text-gray-900">{formatNumber(volumeIn3)} in³</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cubic Feet:</span>
                    <span className="font-semibold text-gray-900">{formatNumber(volumeFt3, 4)} ft³</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Liters:</span>
                    <span className="font-semibold text-gray-900">{formatNumber(volumeL, 3)} L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gallons (US):</span>
                    <span className="font-semibold text-gray-900">{formatNumber(volumeGal, 3)} gal</span>
                  </div>
                </div>
              </div>

              {/* Dimensions Used */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm font-semibold text-gray-700 mb-2">Dimensions Used</div>
                <div className="text-sm space-y-1">
                  <div>Radius: <span className="font-semibold text-blue-700">{formatNumber(usedRadiusCm)} cm</span></div>
                  <div>Height: <span className="font-semibold text-blue-700">{formatNumber(usedHeightCm)} cm</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

        {/* Educational Content */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Calculate Cylinder Volume</h2>

          <div className="prose prose-orange max-w-none">
            <p className="text-gray-700 mb-4">
              Calculating cylinder volume is useful for engineering, construction, and manufacturing applications.
              Our cylinder calculator uses the standard formula V = π × r² × h to determine volume, surface area,
              and other properties. Enter your cylinder's radius (or diameter) and height to get instant results in
              multiple units.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Understanding Cylinder Formulas</h3>

            <div className="space-y-4 mt-4">
              <div className="bg-orange-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Volume Formula</h4>
                <p className="text-gray-700 font-mono text-sm bg-white p-3 rounded border border-orange-200 mb-2">
                  V = π × r² × h
                </p>
                <p className="text-gray-600 text-sm">
                  Where r is the radius of the circular base and h is the height of the cylinder.
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Surface Area Formula</h4>
                <p className="text-gray-700 font-mono text-sm bg-white p-3 rounded border border-blue-200 mb-2">
                  SA = 2πr(r + h) = 2πr² + 2πrh
                </p>
                <p className="text-gray-600 text-sm">
                  The total surface area includes both circular bases and the lateral (curved) surface.
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Lateral Surface Area</h4>
                <p className="text-gray-700 font-mono text-sm bg-white p-3 rounded border border-purple-200 mb-2">
                  LA = 2πrh
                </p>
                <p className="text-gray-600 text-sm">
                  The lateral surface area is just the curved surface, excluding the top and bottom circles.
                </p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Common Applications</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                <span><strong>Engineering:</strong> Calculating capacity of tanks, pipes, and storage vessels</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                <span><strong>Construction:</strong> Determining concrete volume for cylindrical columns</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                <span><strong>Manufacturing:</strong> Computing material requirements for cylindrical parts</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                <span><strong>Food Industry:</strong> Calculating capacity of cans and containers</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                <span><strong>Science:</strong> Measuring volumes in laboratory experiments</span>
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">FAQ</h3>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  What is the formula for cylinder volume?
                </h4>
                <p className="text-gray-700 text-sm">
                  The volume of a cylinder is calculated using the formula V = π × r² × h, where r is the
                  radius of the base and h is the height of the cylinder.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  How do I find the radius if I only know the diameter?
                </h4>
                <p className="text-gray-700 text-sm">
                  The radius is half of the diameter. If you have the diameter, divide it by 2 to get the
                  radius (r = d/2). Our calculator allows you to input either radius or diameter directly.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  What units can I use for calculations?
                </h4>
                <p className="text-gray-700 text-sm">
                  You can input measurements in centimeters (cm), meters (m), inches (in), or feet (ft).
                  The calculator automatically converts and displays results in multiple units.
                </p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Tips for Accurate Measurements</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Ensure you measure the radius or diameter at the widest point of the cylinder</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Measure height perpendicular to the base for accurate results</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Use consistent units throughout your calculations</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>For hollow cylinders, calculate outer and inner volumes separately and subtract</span>
              </li>
            </ul>
          </div>
        </div>
{/* Related Calculators */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedCalculators.map((calc, index) => (
              <Link
                key={index}
                href={calc.href}
                className="p-4 border border-gray-200 rounded-lg hover:border-orange-500 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{calc.title}</h3>
                <p className="text-sm text-gray-600">{calc.description}</p>
              </Link>
            ))}
          </div>
        
      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="cylinder-volume-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
      </div>
      </article>
    </div>
  );
}
