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
}

interface CubicFeetClientProps {
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
    question: "What is a Cubic Feet Calculator?",
    answer: "A Cubic Feet Calculator is a free online tool designed to help you quickly and accurately calculate cubic feet-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Cubic Feet Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Cubic Feet Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Cubic Feet Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function CubicFeetClient({ relatedCalculators = defaultRelatedCalculators }: CubicFeetClientProps) {
  const { getH1, getSubHeading } = usePageSEO('cubic-feet-calculator');

  const [shapeType, setShapeType] = useState<'rectangular' | 'cylindrical'>('rectangular');
  const [length, setLength] = useState<number>(10);
  const [width, setWidth] = useState<number>(10);
  const [height, setHeight] = useState<number>(10);
  const [diameter, setDiameter] = useState<number>(10);
  const [unit, setUnit] = useState<'feet' | 'inches' | 'meters' | 'centimeters' | 'yards'>('feet');

  // Results
  const [cubicFeet, setCubicFeet] = useState<number>(0);
  const [cubicInches, setCubicInches] = useState<number>(0);
  const [cubicMeters, setCubicMeters] = useState<number>(0);
  const [cubicYards, setCubicYards] = useState<number>(0);
  const [gallons, setGallons] = useState<number>(0);
  const [liters, setLiters] = useState<number>(0);

  // Material estimates
  const [concreteWeight, setConcreteWeight] = useState<number>(0);
  const [soilWeight, setSoilWeight] = useState<number>(0);
  const [mulchWeight, setMulchWeight] = useState<number>(0);

  const [practicalInfo, setPracticalInfo] = useState<string>('');

  // Conversion factors to feet
  const toFeet = (value: number, fromUnit: string): number => {
    switch (fromUnit) {
      case 'feet': return value;
      case 'inches': return value / 12;
      case 'meters': return value * 3.28084;
      case 'centimeters': return value * 0.0328084;
      case 'yards': return value * 3;
      default: return value;
    }
  };

  const calculateVolume = () => {
    let volumeInCubicFeet = 0;

    if (shapeType === 'rectangular') {
      const lengthFt = toFeet(length, unit);
      const widthFt = toFeet(width, unit);
      const heightFt = toFeet(height, unit);
      volumeInCubicFeet = lengthFt * widthFt * heightFt;
    } else {
      // Cylindrical
      const diameterFt = toFeet(diameter, unit);
      const heightFt = toFeet(height, unit);
      const radiusFt = diameterFt / 2;
      volumeInCubicFeet = Math.PI * radiusFt * radiusFt * heightFt;
    }

    // Set cubic feet
    setCubicFeet(volumeInCubicFeet);

    // Conversions
    setCubicInches(volumeInCubicFeet * 1728);
    setCubicMeters(volumeInCubicFeet * 0.0283168);
    setCubicYards(volumeInCubicFeet / 27);
    setGallons(volumeInCubicFeet * 7.48052);
    setLiters(volumeInCubicFeet * 28.3168);

    // Material estimates (weights in lbs)
    setConcreteWeight(volumeInCubicFeet * 150); // 150 lbs per cubic foot
    setSoilWeight(volumeInCubicFeet * 90); // 90 lbs per cubic foot
    setMulchWeight(volumeInCubicFeet * 25); // 25 lbs per cubic foot

    // Practical information
    generatePracticalInfo(volumeInCubicFeet);
  };

  const generatePracticalInfo = (cf: number) => {
    if (cf < 1) {
      setPracticalInfo('Small volume - about the size of a shoebox');
    } else if (cf < 10) {
      setPracticalInfo('Medium volume - about the size of a filing cabinet');
    } else if (cf < 50) {
      setPracticalInfo('Large volume - about the size of a refrigerator');
    } else if (cf < 200) {
      setPracticalInfo('Very large volume - about the size of a small room');
    } else if (cf < 1000) {
      setPracticalInfo('Extra large volume - about the size of a large room or small garage');
    } else {
      setPracticalInfo('Massive volume - about the size of a large warehouse space');
    }
  };

  useEffect(() => {
    calculateVolume();
  }, [shapeType, length, width, height, diameter, unit]);

  const handleQuickPreset = (l: number, w: number, h: number, u: string) => {
    setShapeType('rectangular');
    setLength(l);
    setWidth(w);
    setHeight(h);
    setUnit(u as any);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-6 md:py-8 px-2 sm:px-4 lg:px-3 sm:px-5 md:px-8">
      <article className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">{getH1('Cubic Feet Calculator')}</h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            Calculate volume in cubic feet for rectangular or cylindrical spaces. Perfect for construction,
            shipping, storage, and material estimation.
          </p>
        </header>

        {/* Main Calculator Card */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Left Column - Inputs */}
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Calculator Inputs</h2>

              {/* Shape Type Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Shape Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="shapeType"
                      value="rectangular"
                      checked={shapeType === 'rectangular'}
                      onChange={(e) => setShapeType(e.target.value as 'rectangular')}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Rectangular</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="shapeType"
                      value="cylindrical"
                      checked={shapeType === 'cylindrical'}
                      onChange={(e) => setShapeType(e.target.value as 'cylindrical')}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Cylindrical</span>
                  </label>
                </div>
              </div>

              {/* Unit Selection */}
              <div>
                <label htmlFor="unit" className="block text-sm font-semibold text-gray-700 mb-2">
                  Unit of Measurement
                </label>
                <select
                  id="unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="feet">Feet (ft)</option>
                  <option value="inches">Inches (in)</option>
                  <option value="meters">Meters (m)</option>
                  <option value="centimeters">Centimeters (cm)</option>
                  <option value="yards">Yards (yd)</option>
                </select>
              </div>

              {shapeType === 'rectangular' ? (
                <>
                  {/* Length */}
                  <div>
                    <label htmlFor="length" className="block text-sm font-semibold text-gray-700 mb-2">
                      Length ({unit})
                    </label>
                    <input
                      type="number"
                      id="length"
                      value={length}
                      onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                      step="0.1"
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Width */}
                  <div>
                    <label htmlFor="width" className="block text-sm font-semibold text-gray-700 mb-2">
                      Width ({unit})
                    </label>
                    <input
                      type="number"
                      id="width"
                      value={width}
                      onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                      step="0.1"
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Diameter */}
                  <div>
                    <label htmlFor="diameter" className="block text-sm font-semibold text-gray-700 mb-2">
                      Diameter ({unit})
                    </label>
                    <input
                      type="number"
                      id="diameter"
                      value={diameter}
                      onChange={(e) => setDiameter(parseFloat(e.target.value) || 0)}
                      step="0.1"
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}

              {/* Height */}
              <div>
                <label htmlFor="height" className="block text-sm font-semibold text-gray-700 mb-2">
                  Height ({unit})
                </label>
                <input
                  type="number"
                  id="height"
                  value={height}
                  onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                  step="0.1"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Quick Presets */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Presets</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleQuickPreset(10, 10, 8, 'feet')}
                    className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    Small Room (10×10×8 ft)
                  </button>
                  <button
                    onClick={() => handleQuickPreset(20, 15, 8, 'feet')}
                    className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    Large Room (20×15×8 ft)
                  </button>
                  <button
                    onClick={() => handleQuickPreset(40, 20, 8, 'feet')}
                    className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    Garage (40×20×8 ft)
                  </button>
                  <button
                    onClick={() => handleQuickPreset(1, 1, 1, 'meters')}
                    className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    1 Cubic Meter
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Results */}
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Results</h2>

              {/* Primary Result */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3 sm:p-4 md:p-6 text-white">
                <div className="text-sm font-semibold mb-2 opacity-90">Volume</div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1">
                  {cubicFeet.toFixed(2)}
                </div>
                <div className="text-lg opacity-90">cubic feet (ft³)</div>
              </div>

              {/* Volume Conversions */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-gray-900 mb-3">Volume Conversions</h3>

                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Cubic Inches:</span>
                  <span className="font-semibold text-gray-900">{cubicInches.toFixed(2)} in³</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Cubic Meters:</span>
                  <span className="font-semibold text-gray-900">{cubicMeters.toFixed(4)} m³</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Cubic Yards:</span>
                  <span className="font-semibold text-gray-900">{cubicYards.toFixed(4)} yd³</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Gallons (US):</span>
                  <span className="font-semibold text-gray-900">{gallons.toFixed(2)} gal</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Liters:</span>
                  <span className="font-semibold text-gray-900">{liters.toFixed(2)} L</span>
                </div>
              </div>

              {/* Material Estimates */}
              <div className="bg-green-50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-gray-900 mb-3">Material Weight Estimates</h3>

                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Concrete (150 lbs/ft³):</span>
                  <span className="font-semibold text-green-700">
                    {concreteWeight.toFixed(0)} lbs ({(concreteWeight / 2000).toFixed(2)} tons)
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Soil (90 lbs/ft³):</span>
                  <span className="font-semibold text-green-700">
                    {soilWeight.toFixed(0)} lbs ({(soilWeight / 2000).toFixed(2)} tons)
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Mulch (25 lbs/ft³):</span>
                  <span className="font-semibold text-green-700">
                    {mulchWeight.toFixed(0)} lbs ({(mulchWeight / 2000).toFixed(2)} tons)
                  </span>
                </div>
              </div>

              {/* Practical Info */}
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Practical Size</h3>
                <p className="text-gray-700">{practicalInfo}</p>
              </div>

              {/* HVAC Info (for rectangular rooms) */}
              {shapeType === 'rectangular' && (
                <div className="bg-orange-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">HVAC Requirement</h3>
                  <p className="text-gray-700">
                    Estimated BTU needed: <span className="font-semibold text-orange-700">
                      {(cubicFeet * 0.133).toFixed(0)} BTU/hr
                    </span>
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Based on 0.133 BTU per cubic foot (general estimate)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

        {/* Formula Section */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Formulas Used</h2>

          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Rectangular Volume</h3>
              <p className="text-gray-700 font-mono text-sm bg-white p-3 rounded border border-blue-200">
                Volume = Length × Width × Height
              </p>
              <p className="text-gray-600 text-sm mt-2">
                Calculate the volume of a rectangular space by multiplying its three dimensions.
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Cylindrical Volume</h3>
              <p className="text-gray-700 font-mono text-sm bg-white p-3 rounded border border-purple-200">
                Volume = π × (Diameter ÷ 2)² × Height
              </p>
              <p className="text-gray-600 text-sm mt-2">
                Calculate the volume of a cylinder using its diameter and height.
              </p>
            </div>
          </div>

          {/* Conversion Reference */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Conversion Reference</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">1 cubic foot =</span>
                <span className="font-semibold text-gray-900">1,728 cubic inches</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">1 cubic foot =</span>
                <span className="font-semibold text-gray-900">0.0283 cubic meters</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">1 cubic foot =</span>
                <span className="font-semibold text-gray-900">0.0370 cubic yards</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">1 cubic foot =</span>
                <span className="font-semibold text-gray-900">7.48 gallons (US)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">1 cubic foot =</span>
                <span className="font-semibold text-gray-900">28.32 liters</span>
              </div>
            </div>
          </div>
        </div>

        {/* Educational Content */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About Cubic Feet</h2>

          <div className="prose prose-blue max-w-none">
            <p className="text-gray-700 mb-4">
              A cubic foot is a unit of volume measurement equal to a cube that is one foot on each side.
              It's commonly used in the United States for measuring volumes in construction, shipping, storage,
              and various other applications.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Common Applications</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span><strong>Construction:</strong> Calculating concrete, soil, or gravel needed for projects</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span><strong>Shipping:</strong> Determining freight costs and container capacity</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span><strong>Storage:</strong> Estimating storage space requirements</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span><strong>HVAC:</strong> Calculating heating and cooling requirements for rooms</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span><strong>Landscaping:</strong> Estimating mulch, soil, or rock coverage</span>
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Material Density Guide</h3>
            <div className="bg-gray-50 rounded-lg p-4 mt-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <strong className="text-gray-900">Concrete:</strong>
                  <span className="text-gray-700"> ~150 lbs/ft³</span>
                </div>
                <div>
                  <strong className="text-gray-900">Water:</strong>
                  <span className="text-gray-700"> ~62.4 lbs/ft³</span>
                </div>
                <div>
                  <strong className="text-gray-900">Soil (topsoil):</strong>
                  <span className="text-gray-700"> ~90 lbs/ft³</span>
                </div>
                <div>
                  <strong className="text-gray-900">Sand (dry):</strong>
                  <span className="text-gray-700"> ~100 lbs/ft³</span>
                </div>
                <div>
                  <strong className="text-gray-900">Mulch (bark):</strong>
                  <span className="text-gray-700"> ~25 lbs/ft³</span>
                </div>
                <div>
                  <strong className="text-gray-900">Gravel:</strong>
                  <span className="text-gray-700"> ~110 lbs/ft³</span>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Tips for Accurate Measurements</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Always measure in the same unit to avoid conversion errors</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>For irregular shapes, break them down into simpler geometric forms</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Add 10-15% extra material for waste and spillage in construction projects</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Double-check your measurements before ordering materials</span>
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
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{calc.title}</h3>
                <p className="text-sm text-gray-600">{calc.description}</p>
              </Link>
            ))}
          </div>
        
      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="cubic-feet-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
      </div>
      </article>
    </div>
  );
}
