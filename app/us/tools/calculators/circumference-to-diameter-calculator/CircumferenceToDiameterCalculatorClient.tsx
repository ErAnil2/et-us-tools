'use client';

import { useState, useEffect } from 'react';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { FirebaseFAQs } from '@/components/PageSEOContent';

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Circumference To Diameter Calculator?",
    answer: "A Circumference To Diameter Calculator is a free online tool designed to help you quickly and accurately calculate circumference to diameter-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Circumference To Diameter Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Circumference To Diameter Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Circumference To Diameter Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function CircumferenceToDiameterCalculatorClient() {
  const [circumference, setCircumference] = useState(31.42);
  const [unit, setUnit] = useState('cm');

  const unitConversions: any = {
    mm: 0.1,
    cm: 1,
    m: 100,
    in: 2.54,
    ft: 30.48,
    km: 100000
  };

  const formatNumber = (num: number, decimals = 2) => {
    if (num === 0) return '0';
    return parseFloat(num.toFixed(decimals)).toString();
  };

  const convertToCm = (value: number, unit: string) => {
    return value * unitConversions[unit];
  };

  const convertFromCm = (valueCm: number, unit: string) => {
    return valueCm / unitConversions[unit];
  };

  // Calculate diameter using d = C / π
  const diameter = circumference > 0 ? circumference / Math.PI : 0;
  const radius = diameter / 2;
  const area = Math.PI * Math.pow(radius, 2);

  // Convert to cm for unit conversions
  const diameterCm = convertToCm(diameter, unit);

  // Generate step-by-step calculation
  const getCalculationSteps = () => {
    if (circumference <= 0) {
      return '<p>Enter a circumference value to see the calculation steps.</p>';
    }

    const steps = [
      `<strong>Step 1:</strong> Given circumference C = ${circumference} ${unit}`,
      `<strong>Step 2:</strong> Apply formula d = C ÷ π`,
      `<strong>Step 3:</strong> d = ${circumference} ÷ π`,
      `<strong>Step 4:</strong> d = ${circumference} ÷ 3.14159`,
      `<strong>Step 5:</strong> d = ${formatNumber(diameter)} ${unit}`,
      `<br /><strong>Additional calculations:</strong>`,
      `• Radius = diameter ÷ 2 = ${formatNumber(radius)} ${unit}`,
      `• Area = π × r² = ${formatNumber(area)} ${unit}²`
    ];

    return steps.join('<br />');
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Circumference to Diameter Calculator</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Convert circle circumference to diameter, radius, and area instantly with step-by-step calculations.
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Enter Circumference</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Circumference</label>
              <div className="flex">
                <input
                  type="number"
                  value={circumference}
                  onChange={(e) => setCircumference(Number(e.target.value))}
                  step="0.01"
                  min="0"
                  placeholder="e.g., 31.42"
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

            {/* Formula Display */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Formula Used</h3>
              <p className="text-blue-700 font-mono">d = C / π</p>
              <p className="text-blue-600 text-sm mt-2">Where: d = diameter, C = circumference, π ≈ 3.14159</p>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Results</h3>

            <div className="space-y-4">
              <div className="bg-green-100 rounded-lg p-4 text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">
                  {circumference > 0 ? `${formatNumber(diameter)} ${unit}` : '0'}
                </div>
                <div className="text-green-700">Diameter</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Radius:</span>
                  <span className="font-semibold">
                    {circumference > 0 ? `${formatNumber(radius)} ${unit}` : '0'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Area:</span>
                  <span className="font-semibold">
                    {circumference > 0 ? `${formatNumber(area)} ${unit}²` : '0'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Circumference:</span>
                  <span className="font-semibold">
                    {circumference > 0 ? `${formatNumber(circumference)} ${unit}` : '0'}
                  </span>
                </div>
              </div>

              {/* Unit Conversions */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-700 mb-3">Diameter in Other Units</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">mm:</span>
                    <span className="font-semibold">
                      {circumference > 0 ? `${formatNumber(convertFromCm(diameterCm, 'mm'))} mm` : '0 mm'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">cm:</span>
                    <span className="font-semibold">
                      {circumference > 0 ? `${formatNumber(convertFromCm(diameterCm, 'cm'))} cm` : '0 cm'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">m:</span>
                    <span className="font-semibold">
                      {circumference > 0 ? `${formatNumber(convertFromCm(diameterCm, 'm'), 4)} m` : '0 m'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">in:</span>
                    <span className="font-semibold">
                      {circumference > 0 ? `${formatNumber(convertFromCm(diameterCm, 'in'))} in` : '0 in'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ft:</span>
                    <span className="font-semibold">
                      {circumference > 0 ? `${formatNumber(convertFromCm(diameterCm, 'ft'))} ft` : '0 ft'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">km:</span>
                    <span className="font-semibold">
                      {circumference > 0 ? `${formatNumber(convertFromCm(diameterCm, 'km'), 6)} km` : '0 km'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Calculation */}
      <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-xl font-semibold text-yellow-800 mb-4">Step-by-Step Calculation</h3>
        <div className="text-yellow-700" dangerouslySetInnerHTML={{ __html: getCalculationSteps() }} />
      </div>

      {/* Information Section */}
      <div className="bg-blue-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">About Circumference to Diameter Conversion</h3>
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 text-blue-700">
          <div>
            <h4 className="font-semibold mb-2">Key Relationships:</h4>
            <ul className="space-y-2">
              <li>• <strong>Diameter = Circumference ÷ π</strong></li>
              <li>• <strong>Radius = Diameter ÷ 2</strong></li>
              <li>• <strong>Area = π × radius²</strong></li>
              <li>• π (pi) ≈ 3.14159265359</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Common Uses:</h4>
            <ul className="space-y-2">
              <li>• Engineering and design</li>
              <li>• Construction projects</li>
              <li>• Manufacturing</li>
              <li>• Mathematics homework</li>
              <li>• DIY projects</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Examples Section */}
      <div className="bg-green-50 rounded-lg p-3 sm:p-4 md:p-6">
        <h3 className="text-xl font-semibold text-green-800 mb-4">Common Examples</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2 text-green-800">Small Circle</h4>
            <p className="text-sm text-green-700">Circumference: 15.71 cm</p>
            <p className="font-medium text-green-600">Diameter: 5.00 cm</p>
          </div>
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2 text-green-800">Medium Circle</h4>
            <p className="text-sm text-green-700">Circumference: 62.83 cm</p>
            <p className="font-medium text-green-600">Diameter: 20.00 cm</p>
          </div>
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2 text-green-800">Large Circle</h4>
            <p className="text-sm text-green-700">Circumference: 314.16 cm</p>
            <p className="font-medium text-green-600">Diameter: 100.00 cm</p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="circumference-to-diameter-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
