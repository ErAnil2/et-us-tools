'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
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
    question: "What is a Pool Volume Calculator?",
    answer: "A Pool Volume Calculator is a mathematical tool that helps you quickly calculate or convert pool volume-related values. It eliminates manual calculations and provides instant, accurate results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Pool Volume Calculator?",
    answer: "Simply enter your values in the input fields provided. The calculator will automatically compute and display the results. You can adjust values to see how changes affect the outcome.",
    order: 2
  },
  {
    id: '3',
    question: "Are the results accurate?",
    answer: "Yes, our Pool Volume Calculator uses precise mathematical formulas to ensure accurate results. The calculations follow standard mathematical conventions and formulas.",
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
    answer: "Yes, this Pool Volume Calculator is completely free to use with no registration required. Use it as many times as you need for your calculations.",
    order: 5
  }
];

export default function PoolVolumeCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('pool-volume-calculator');

  const [poolShape, setPoolShape] = useState('rectangular');
  const [units, setUnits] = useState('feet');
  const [depthType, setDepthType] = useState('constant');

  // Rectangular/Kidney/L-shaped fields
  const [length, setLength] = useState('30');
  const [width, setWidth] = useState('15');

  // Circular fields
  const [diameter, setDiameter] = useState('24');

  // Oval fields
  const [longAxis, setLongAxis] = useState('30');
  const [shortAxis, setShortAxis] = useState('15');

  // L-shaped fields
  const [length1, setLength1] = useState('25');
  const [width1, setWidth1] = useState('15');
  const [length2, setLength2] = useState('10');
  const [width2, setWidth2] = useState('8');

  // Depth fields
  const [depth, setDepth] = useState('5');
  const [shallowDepth, setShallowDepth] = useState('3');
  const [deepDepth, setDeepDepth] = useState('8');

  const [resultsHTML, setResultsHTML] = useState('');

  useEffect(() => {
    calculateVolume();
  }, [poolShape, units, depthType, length, width, diameter, longAxis, shortAxis, length1, width1, length2, width2, depth, shallowDepth, deepDepth]);

  const calculateVolume = () => {
    let surfaceArea = 0;
    let averageDepth = 0;

    // Calculate surface area
    try {
      switch(poolShape) {
        case 'rectangular':
          const rectLength = parseFloat(length) || 0;
          const rectWidth = parseFloat(width) || 0;
          surfaceArea = rectLength * rectWidth;
          break;

        case 'circular':
          const circleDiameter = parseFloat(diameter) || 0;
          surfaceArea = Math.PI * Math.pow(circleDiameter / 2, 2);
          break;

        case 'oval':
          const ovalLong = parseFloat(longAxis) || 0;
          const ovalShort = parseFloat(shortAxis) || 0;
          surfaceArea = Math.PI * (ovalLong / 2) * (ovalShort / 2);
          break;

        case 'kidney':
          const kidneyLength = parseFloat(length) || 0;
          const kidneyWidth = parseFloat(width) || 0;
          surfaceArea = kidneyLength * kidneyWidth * 0.85;
          break;

        case 'lshaped':
          const l1 = parseFloat(length1) || 0;
          const w1 = parseFloat(width1) || 0;
          const l2 = parseFloat(length2) || 0;
          const w2 = parseFloat(width2) || 0;
          surfaceArea = (l1 * w1) + (l2 * w2);
          break;
      }

      // Calculate average depth
      if (depthType === 'constant') {
        averageDepth = parseFloat(depth) || 0;
      } else {
        const shallow = parseFloat(shallowDepth) || 0;
        const deep = parseFloat(deepDepth) || 0;
        averageDepth = (shallow + deep) / 2;
      }

      // Calculate volume
      let volumeCubic = surfaceArea * averageDepth;
      let volumeGallons, volumeLiters, volumeCubicFeet;
      let surfaceAreaDisplay;

      if (units === 'feet') {
        volumeCubicFeet = volumeCubic;
        volumeGallons = volumeCubic * 7.48052;
        volumeLiters = volumeGallons * 3.78541;
        surfaceAreaDisplay = surfaceArea.toFixed(1) + ' sq ft';
      } else {
        volumeCubicFeet = volumeCubic * 35.3147;
        volumeGallons = volumeCubic * 264.172;
        volumeLiters = volumeCubic * 1000;
        surfaceAreaDisplay = surfaceArea.toFixed(1) + ' sq m';
      }

      // Generate results HTML
      const html = `
        <div class="space-y-4">
          <!-- Volume in Gallons -->
          <div class="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <div class="text-sm text-blue-600 mb-1">Total Volume</div>
            <div class="text-4xl font-bold text-blue-700">${Math.round(volumeGallons).toLocaleString()}</div>
            <div class="text-sm text-blue-600 mt-1">US Gallons</div>
          </div>

          <!-- Volume in Liters -->
          <div class="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-green-900">Volume (Liters)</span>
              <span class="text-lg font-bold text-green-700">${Math.round(volumeLiters).toLocaleString()} L</span>
            </div>
          </div>

          <!-- Cubic Feet -->
          <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-purple-900">Volume (Cubic Feet)</span>
              <span class="text-lg font-bold text-purple-700">${volumeCubicFeet.toFixed(1)} cu ft</span>
            </div>
          </div>

          <!-- Surface Area -->
          <div class="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-orange-900">Surface Area</span>
              <span class="text-lg font-bold text-orange-700">${surfaceAreaDisplay}</span>
            </div>
          </div>

          <!-- Chemical Doses -->
          <div class="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-lg border border-teal-200">
            <div class="text-sm font-semibold text-teal-900 mb-3">Weekly Chemical Doses</div>
            <div class="space-y-2 text-xs text-teal-700">
              <div class="flex justify-between">
                <span>Chlorine Shock:</span>
                <span class="font-semibold">${(volumeGallons / 10000).toFixed(1)} lbs</span>
              </div>
              <div class="flex justify-between">
                <span>Algaecide:</span>
                <span class="font-semibold">${(volumeGallons / 10000 * 16).toFixed(0)} fl oz</span>
              </div>
              <div class="flex justify-between">
                <span>Muriatic Acid:</span>
                <span class="font-semibold">${(volumeGallons / 10000 * 25).toFixed(0)} fl oz</span>
              </div>
            </div>
          </div>

          <!-- Cost Estimates -->
          <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
            <div class="text-sm font-semibold text-yellow-900 mb-3">Monthly Costs</div>
            <div class="space-y-2 text-xs text-yellow-700">
              <div class="flex justify-between">
                <span>Water Fill:</span>
                <span class="font-semibold">$${(volumeGallons * 0.004).toFixed(0)} (one-time)</span>
              </div>
              <div class="flex justify-between">
                <span>Chemicals:</span>
                <span class="font-semibold">$${(volumeGallons / 10000 * 25).toFixed(0)}/month</span>
              </div>
              <div class="flex justify-between">
                <span>Electricity:</span>
                <span class="font-semibold">$${(volumeGallons / 10000 * 30).toFixed(0)}/month</span>
              </div>
              <div class="flex justify-between">
                <span>Heating (if used):</span>
                <span class="font-semibold">$${(volumeGallons * 0.12).toFixed(0)}/season</span>
              </div>
            </div>
          </div>

          <!-- Pro Tip -->
          <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg border border-indigo-200">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-indigo-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div class="text-sm text-indigo-800">
                <strong>Tip:</strong> This pool needs a pump rated at ${Math.round(volumeGallons / 8).toLocaleString()} GPH minimum (full turnover in 8 hours). Test chemicals 2-3 times weekly during swimming season.
              </div>
            </div>
          </div>
        </div>
      `;

      setResultsHTML(html);
    } catch (error) {
      console.error('Calculation error:', error);
    }
  };

  const renderDynamicFields = () => {
    const unitLabel = units === 'feet' ? 'ft' : 'm';

    switch(poolShape) {
      case 'rectangular':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-1">
                <svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
                Length ({unitLabel})
              </label>
              <input type="number" id="length" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                     placeholder="30" value={length} onChange={(e) => setLength(e.target.value)} min="0" step="0.1" />
            </div>
            <div>
              <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-1">
                <svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
                Width ({unitLabel})
              </label>
              <input type="number" id="width" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                     placeholder="15" value={width} onChange={(e) => setWidth(e.target.value)} min="0" step="0.1" />
            </div>
          </div>
        );

      case 'circular':
        return (
          <div>
            <label htmlFor="diameter" className="block text-sm font-medium text-gray-700 mb-1">
              <svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Diameter ({unitLabel})
            </label>
            <input type="number" id="diameter" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                   placeholder="24" value={diameter} onChange={(e) => setDiameter(e.target.value)} min="0" step="0.1" />
          </div>
        );

      case 'oval':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="longAxis" className="block text-sm font-medium text-gray-700 mb-1">Long Axis ({unitLabel})</label>
              <input type="number" id="longAxis" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                     placeholder="30" value={longAxis} onChange={(e) => setLongAxis(e.target.value)} min="0" step="0.1" />
            </div>
            <div>
              <label htmlFor="shortAxis" className="block text-sm font-medium text-gray-700 mb-1">Short Axis ({unitLabel})</label>
              <input type="number" id="shortAxis" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                     placeholder="15" value={shortAxis} onChange={(e) => setShortAxis(e.target.value)} min="0" step="0.1" />
            </div>
          </div>
        );

      case 'kidney':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-1">Overall Length ({unitLabel})</label>
                <input type="number" id="length" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       placeholder="30" value={length} onChange={(e) => setLength(e.target.value)} min="0" step="0.1" />
              </div>
              <div>
                <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-1">Overall Width ({unitLabel})</label>
                <input type="number" id="width" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       placeholder="15" value={width} onChange={(e) => setWidth(e.target.value)} min="0" step="0.1" />
              </div>
            </div>
            <p className="text-xs text-amber-600 mt-2">Note: Kidney pools are approximated as 0.85 × length × width</p>
          </>
        );

      case 'lshaped':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Section 1 (Main Rectangle)</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="length1" className="block text-sm font-medium text-gray-700 mb-1">Length ({unitLabel})</label>
                  <input type="number" id="length1" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                         placeholder="25" value={length1} onChange={(e) => setLength1(e.target.value)} min="0" step="0.1" />
                </div>
                <div>
                  <label htmlFor="width1" className="block text-sm font-medium text-gray-700 mb-1">Width ({unitLabel})</label>
                  <input type="number" id="width1" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                         placeholder="15" value={width1} onChange={(e) => setWidth1(e.target.value)} min="0" step="0.1" />
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Section 2 (Extension)</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="length2" className="block text-sm font-medium text-gray-700 mb-1">Length ({unitLabel})</label>
                  <input type="number" id="length2" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                         placeholder="10" value={length2} onChange={(e) => setLength2(e.target.value)} min="0" step="0.1" />
                </div>
                <div>
                  <label htmlFor="width2" className="block text-sm font-medium text-gray-700 mb-1">Width ({unitLabel})</label>
                  <input type="number" id="width2" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                         placeholder="8" value={width2} onChange={(e) => setWidth2(e.target.value)} min="0" step="0.1" />
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  const renderDepthFields = () => {
    const unitLabel = units === 'feet' ? 'ft' : 'm';

    if (depthType === 'constant') {
      return (
        <div>
          <label htmlFor="depth" className="block text-sm font-medium text-gray-700 mb-1">
            <svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
            </svg>
            Depth ({unitLabel})
          </label>
          <input type="number" id="depth" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                 placeholder="5" value={depth} onChange={(e) => setDepth(e.target.value)} min="0" step="0.1" />
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="shallowDepth" className="block text-sm font-medium text-gray-700 mb-1">Shallow End ({unitLabel})</label>
            <input type="number" id="shallowDepth" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                   placeholder="3" value={shallowDepth} onChange={(e) => setShallowDepth(e.target.value)} min="0" step="0.1" />
          </div>
          <div>
            <label htmlFor="deepDepth" className="block text-sm font-medium text-gray-700 mb-1">Deep End ({unitLabel})</label>
            <input type="number" id="deepDepth" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                   placeholder="8" value={deepDepth} onChange={(e) => setDeepDepth(e.target.value)} min="0" step="0.1" />
          </div>
        </div>
      );
    }
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      {/* Hero Section */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">{getH1('Pool Volume Calculator')}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Calculate your swimming pool's water volume for proper chemical dosing, heating costs, and maintenance planning. Supports all pool shapes and sizes.
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Calculator */}
      <div className="lg:grid lg:gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8" style={{ gridTemplateColumns: '1fr 350px' }}>
        {/* Left Column - Input Form */}

      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Pool Measurements</h2>

          <div className="space-y-4">
            {/* Pool Shape */}
            <div>
              <label htmlFor="poolShape" className="block text-sm font-medium text-gray-700 mb-1">
                <svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z"></path>
                </svg>
                Pool Shape
              </label>
              <select id="poolShape" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={poolShape} onChange={(e) => setPoolShape(e.target.value)}>
                <option value="rectangular">Rectangular</option>
                <option value="circular">Circular/Round</option>
                <option value="oval">Oval</option>
                <option value="kidney">Kidney/Freeform</option>
                <option value="lshaped">L-Shaped</option>
              </select>
            </div>

            {/* Measurement Units */}
            <div>
              <label htmlFor="units" className="block text-sm font-medium text-gray-700 mb-1">
                <svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
                </svg>
                Measurement Units
              </label>
              <select id="units" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={units} onChange={(e) => setUnits(e.target.value)}>
                <option value="feet">Feet</option>
                <option value="meters">Meters</option>
              </select>
            </div>

            {/* Dynamic Fields */}
            <div id="dynamicFields">
              {renderDynamicFields()}
            </div>

            {/* Depth Type */}
            <div>
              <label htmlFor="depthType" className="block text-sm font-medium text-gray-700 mb-1">
                <svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                </svg>
                Depth Type
              </label>
              <select id="depthType" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={depthType} onChange={(e) => setDepthType(e.target.value)}>
                <option value="constant">Constant Depth</option>
                <option value="variable">Variable Depth (Shallow to Deep)</option>
              </select>
            </div>

            {/* Depth Fields */}
            <div id="depthFields">
              {renderDepthFields()}
            </div>
          </div>

          {/* Mobile Results */}
          <div className="lg:hidden mt-6">
            <div id="results-mobile" dangerouslySetInnerHTML={{ __html: resultsHTML }}></div>
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

        {/* Right Column - Results (Desktop Only) */}
        <div className="hidden lg:block" style={{ width: '350px' }}>
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 lg:sticky lg:top-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Pool Volume</h3>
            <div id="results-sidebar" dangerouslySetInnerHTML={{ __html: resultsHTML }}></div>
          </div>
        </div>
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
        {/* Card 1: Pool Sizes */}
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start mb-3">
            <div className="bg-blue-100 rounded-lg p-2 mr-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Pool Sizes</h3>
              <p className="text-sm text-gray-600">Small pool: 10,000-15,000 gal. Medium: 15,000-25,000 gal. Large: 25,000-40,000 gal. Olympic: 660,000 gal. Spa/hot tub: 300-500 gal.</p>
            </div>
          </div>
        </div>
{/* Card 2: Chemical Dosing */}
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start mb-3">
            <div className="bg-green-100 rounded-lg p-2 mr-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Chemical Levels</h3>
              <p className="text-sm text-gray-600">Chlorine: 1-3 ppm. pH: 7.2-7.6. Total Alkalinity: 80-120 ppm. Calcium Hardness: 200-400 ppm. Cyanuric Acid: 30-50 ppm. Test weekly.</p>
            </div>
          </div>
        </div>

        {/* Card 3: Heating Costs */}
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start mb-3">
            <div className="bg-purple-100 rounded-lg p-2 mr-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Heating Costs</h3>
              <p className="text-sm text-gray-600">Gas heater: $4-7/hour. Electric: $5-9/hour. Heat pump: $2-4/hour. Solar: $0/hour (free). Average heating season: $200-400/month depending on size and climate.</p>
            </div>
          </div>
        </div>

        {/* Card 4: Pump & Filter */}
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start mb-3">
            <div className="bg-orange-100 rounded-lg p-2 mr-3">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Pump & Filter Sizing</h3>
              <p className="text-sm text-gray-600">Pool volume ÷ 8 hours = GPH needed. 15k gal pool needs 1,875 GPH pump. Filter should match pump flow rate. Run pump 8-12 hours daily. Cost: $30-100/month electricity.</p>
            </div>
          </div>
        </div>

        {/* Card 5: Maintenance Schedule */}
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start mb-3">
            <div className="bg-teal-100 rounded-lg p-2 mr-3">
              <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Maintenance Schedule</h3>
              <p className="text-sm text-gray-600">Daily: Skim debris, check chlorine. Weekly: Vacuum, brush, test all chemicals. Monthly: Shock, clean filter. Seasonally: Deep clean, backwash, winterize.</p>
            </div>
          </div>
        </div>

        {/* Card 6: Water Loss */}
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start mb-3">
            <div className="bg-red-100 rounded-lg p-2 mr-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Water Loss</h3>
              <p className="text-sm text-gray-600">Evaporation: 1/4 inch per day (hot weather). Splash-out: varies by use. Backwashing: 200-300 gal. Pool cover reduces loss 95%. Monthly refill: 2-10% of volume.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-800 py-3 border-b border-gray-200 flex justify-between items-center">
              How do I measure my pool accurately?
              <svg className="w-5 h-5 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </summary>
            <div className="py-3 text-gray-600 text-sm">
              Measure at water level, not pool edge. For rectangular pools, measure length and width at widest points. For irregular shapes, break into sections. Use a tape measure along the pool edge. For depth, measure from water surface to bottom at multiple points if variable.
            </div>
          </details>

          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-800 py-3 border-b border-gray-200 flex justify-between items-center">
              How often should I test pool chemicals?
              <svg className="w-5 h-5 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </summary>
            <div className="py-3 text-gray-600 text-sm">
              Test chlorine and pH daily or at least 2-3 times per week during swimming season. Test alkalinity, calcium hardness, and cyanuric acid weekly. After heavy rain, pool parties, or if water appears cloudy, test immediately. Use test strips or digital testers for accuracy.
            </div>
          </details>

          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-800 py-3 border-b border-gray-200 flex justify-between items-center">
              What's the cheapest way to heat a pool?
              <svg className="w-5 h-5 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </summary>
            <div className="py-3 text-gray-600 text-sm">
              Solar heating is cheapest to operate (free after initial cost of $3k-7k). Heat pumps cost $2-4/hour vs gas $4-7/hour. Pool covers retain heat and reduce costs 50-70%. Heat only when using pool. Target 78-82°F for comfort. In warm climates, solar blankets may be sufficient.
            </div>
          </details>

          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-800 py-3 border-b border-gray-200 flex justify-between items-center">
              How much does pool maintenance cost?
              <svg className="w-5 h-5 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </summary>
            <div className="py-3 text-gray-600 text-sm">
              DIY maintenance: $80-150/month (chemicals, electricity, water). Professional service: $200-400/month. Annual costs: $1,000-2,500 (chemicals, repairs, cleaning). Heated pools add $100-500/month. Saltwater systems reduce chemical costs 50-75% but have $500-2,500 upfront cost.
            </div>
          </details>

          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-800 py-3 border-b border-gray-200 flex justify-between items-center">
              Should I get a saltwater or chlorine pool?
              <svg className="w-5 h-5 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </summary>
            <div className="py-3 text-gray-600 text-sm">
              Saltwater systems cost more upfront ($500-2,500) but save 50-75% on chemicals annually. Softer on skin/eyes. Still produces chlorine but automatically. Cell replacement every 3-7 years ($200-700). Traditional chlorine is cheaper upfront, requires more monitoring. Both work well.
            </div>
          </details>
        </div>
      </div>

      {/* MREC Advertisement Banners */}
      {/* Enhanced Related Calculators */}
      <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Math Calculators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedCalculators.map((calc, index) => (
            <Link key={index} href={calc.href} className="block">
              <div className={`${calc.color || 'bg-gray-500'} text-white rounded-lg p-4 hover:opacity-90 transition-opacity`}>
                <h3 className="font-semibold text-lg mb-1">{calc.title}</h3>
                <p className="text-sm opacity-90">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="pool-volume-calculator" fallbackFaqs={fallbackFaqs} />
      </div>

      <style jsx>{`
        input:focus, select:focus {
          outline: none;
        }

        details summary::-webkit-details-marker {
          display: none;
        }

        details[open] summary {
          border-bottom-color: transparent;
        }
      `}</style>
    </div>
  );
}
