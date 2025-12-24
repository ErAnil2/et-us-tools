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

interface PipeVolumeCalculatorClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '📊' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

const fluidDensities: { [key: string]: number } = {
  water: 1000,     // kg/m³
  air: 1.2,        // kg/m³ at 20°C
  oil: 900,        // kg/m³ (typical motor oil)
  gas: 0.8,        // kg/m³ (natural gas)
  steam: 0.6       // kg/m³ at atmospheric pressure
};

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Pipe Volume Calculator?",
    answer: "A Pipe Volume Calculator is a mathematical tool that helps you quickly calculate or convert pipe volume-related values. It eliminates manual calculations and provides instant, accurate results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Pipe Volume Calculator?",
    answer: "Simply enter your values in the input fields provided. The calculator will automatically compute and display the results. You can adjust values to see how changes affect the outcome.",
    order: 2
  },
  {
    id: '3',
    question: "Are the results accurate?",
    answer: "Yes, our Pipe Volume Calculator uses precise mathematical formulas to ensure accurate results. The calculations follow standard mathematical conventions and formulas.",
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
    answer: "Yes, this Pipe Volume Calculator is completely free to use with no registration required. Use it as many times as you need for your calculations.",
    order: 5
  }
];

export default function PipeVolumeCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: PipeVolumeCalculatorClientProps) {
  const { getH1, getSubHeading } = usePageSEO('pipe-volume-calculator');

  const [pipeType, setPipeType] = useState('circular');
  const [materialType, setMaterialType] = useState('steel');
  const [diameter, setDiameter] = useState(100);
  const [wallThickness, setWallThickness] = useState(3);
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(150);
  const [length, setLength] = useState(10);
  const [quantity, setQuantity] = useState(1);
  const [fluidType, setFluidType] = useState('water');
  const [fillPercentage, setFillPercentage] = useState(100);
  const [results, setResults] = useState<string>('');

  const calculatePipeVolume = () => {
    if (length <= 0) return;

    let crossSectionalArea = 0; // m²
    let surfaceArea = 0; // m²

    if (pipeType === 'circular') {
      if (diameter <= 0) return;

      const radiusM = (diameter / 1000) / 2; // Convert mm to m, then to radius
      crossSectionalArea = Math.PI * Math.pow(radiusM, 2);
      surfaceArea = 2 * Math.PI * radiusM * length; // Internal surface area
    } else if (pipeType === 'rectangular' || pipeType === 'square') {
      const w = width;
      const h = pipeType === 'square' ? width : height;

      if (w <= 0 || h <= 0) return;

      const widthM = w / 1000; // Convert mm to m
      const heightM = h / 1000;
      crossSectionalArea = widthM * heightM;
      surfaceArea = 2 * (widthM + heightM) * length; // Internal surface area
    }

    // Volume calculations
    const internalVolume = crossSectionalArea * length; // m³ per pipe
    const totalVolume = internalVolume * quantity;
    const fluidVolume = internalVolume * (fillPercentage / 100);
    const fluidVolumeliters = fluidVolume * 1000; // Convert to liters

    // Fluid weight
    const fluidDensity = fluidDensities[fluidType];
    const fluidWeight = fluidVolume * fluidDensity; // kg

    // Generate results HTML
    const resultsHTML = `
      <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
        <div class="text-center">
          <div class="text-3xl font-bold text-blue-600">${internalVolume.toFixed(4)} m³</div>
          <div class="text-sm text-gray-600 mt-1">Internal Volume</div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div class="bg-gray-50 p-4 rounded-lg text-center">
          <div class="text-xl font-bold text-gray-800">${fluidVolumeliters.toFixed(1)}</div>
          <div class="text-sm text-gray-600">Liters</div>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg text-center">
          <div class="text-xl font-bold text-gray-800">${fluidWeight.toFixed(1)}</div>
          <div class="text-sm text-gray-600">Fluid Weight (kg)</div>
        </div>
      </div>

      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-600">Cross-sectional Area:</span>
          <span class="font-semibold">${crossSectionalArea.toFixed(6)} m²</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Surface Area:</span>
          <span class="font-semibold">${surfaceArea.toFixed(2)} m²</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Total Volume (${quantity} pcs):</span>
          <span class="font-semibold">${totalVolume.toFixed(4)} m³</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Fill Percentage:</span>
          <span class="font-semibold">${fillPercentage}%</span>
        </div>
      </div>

      <div class="bg-green-50 p-4 rounded-lg border border-green-200">
        <h4 class="text-sm font-semibold text-green-800 mb-3">Flow Capacity</h4>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">Volume per Meter:</span>
            <span class="font-semibold">${(crossSectionalArea * 1000).toFixed(2)} L/m</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Fluid Type:</span>
            <span class="font-semibold">${fluidType.charAt(0).toUpperCase() + fluidType.slice(1)}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Density:</span>
            <span class="font-semibold">${fluidDensity} kg/m³</span>
          </div>
        </div>
      </div>

      <div class="bg-amber-50 p-4 rounded-lg border border-amber-200">
        <h4 class="text-sm font-semibold text-amber-800 mb-2">💡 Quick Info</h4>
        <ul class="text-sm text-gray-700 space-y-1">
          <li>• Volume = Cross-section × Length</li>
          <li>• 1 m³ = 1000 liters</li>
          <li>• Consider wall thickness for external dimensions</li>
          <li>• Add 10-15% for fittings and joints</li>
        </ul>
      </div>
    `;

    setResults(resultsHTML);
  };

  useEffect(() => {
    calculatePipeVolume();
  }, [pipeType, materialType, diameter, wallThickness, width, height, length, quantity, fluidType, fillPercentage]);

  return (
    <div className="max-w-[1180px] mx-auto p-4 md:p-6">
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">{getH1('Pipe Volume Calculator')}</h1>
        <p className="text-base md:text-lg text-gray-600">Calculate pipe internal volume, flow capacity, and material requirements</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Two Column Layout */}
      <div className="lg:grid lg:gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8" style={{ gridTemplateColumns: '1fr 350px' }}>

        {/* Left Column - Input Form */}

      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Pipe Specifications</h2>

          <div className="space-y-4">
            {/* Pipe Type */}
            <div>
              <label htmlFor="pipeType" className="block text-sm font-medium text-gray-700 mb-2">
                <span className="inline-flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
                  </svg>
                  Pipe Type
                </span>
              </label>
              <select
                id="pipeType"
                value={pipeType}
                onChange={(e) => setPipeType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="circular">Circular Pipe</option>
                <option value="rectangular">Rectangular Duct</option>
                <option value="square">Square Duct</option>
              </select>
            </div>

            {/* Material Type */}
            <div>
              <label htmlFor="materialType" className="block text-sm font-medium text-gray-700 mb-2">
                <span className="inline-flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                  </svg>
                  Material Type
                </span>
              </label>
              <select
                id="materialType"
                value={materialType}
                onChange={(e) => setMaterialType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="steel">Steel</option>
                <option value="copper">Copper</option>
                <option value="pvc">PVC</option>
                <option value="aluminum">Aluminum</option>
                <option value="cast_iron">Cast Iron</option>
                <option value="concrete">Concrete</option>
              </select>
            </div>

            {/* Circular Pipe Inputs */}
            {pipeType === 'circular' && (
              <div id="circularInputs">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="diameter" className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="inline-flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        Internal Diameter (mm)
                      </span>
                    </label>
                    <input
                      type="number"
                      id="diameter"
                      value={diameter}
                      onChange={(e) => setDiameter(Number(e.target.value))}
                      min="1"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="wallThickness" className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="inline-flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
                        </svg>
                        Wall Thickness (mm)
                      </span>
                    </label>
                    <input
                      type="number"
                      id="wallThickness"
                      value={wallThickness}
                      onChange={(e) => setWallThickness(Number(e.target.value))}
                      min="0.1"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Rectangular/Square Duct Inputs */}
            {(pipeType === 'rectangular' || pipeType === 'square') && (
              <div id="rectangularInputs">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="inline-flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                        </svg>
                        Internal Width (mm)
                      </span>
                    </label>
                    <input
                      type="number"
                      id="width"
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value))}
                      min="1"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  {pipeType === 'rectangular' && (
                    <div id="heightInput">
                      <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
                        <span className="inline-flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                          </svg>
                          Internal Height (mm)
                        </span>
                      </label>
                      <input
                        type="number"
                        id="height"
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        min="1"
                        step="0.1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Length and Quantity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="inline-flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    </svg>
                    Length (m)
                  </span>
                </label>
                <input
                  type="number"
                  id="length"
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  min="0.1"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="inline-flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                    </svg>
                    Quantity
                  </span>
                </label>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  min="1"
                  step="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Fluid Type and Fill Percentage */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="fluidType" className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="inline-flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    Fluid
                  </span>
                </label>
                <select
                  id="fluidType"
                  value={fluidType}
                  onChange={(e) => setFluidType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="water">Water</option>
                  <option value="air">Air (20°C)</option>
                  <option value="oil">Oil</option>
                  <option value="gas">Natural Gas</option>
                  <option value="steam">Steam</option>
                </select>
              </div>
              <div>
                <label htmlFor="fillPercentage" className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="inline-flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                    Fill %
                  </span>
                </label>
                <input
                  type="number"
                  id="fillPercentage"
                  value={fillPercentage}
                  onChange={(e) => setFillPercentage(Number(e.target.value))}
                  min="1"
                  max="100"
                  step="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Mobile Results */}
          <div className="lg:hidden mt-6">
            <div id="results-mobile" className="space-y-4" dangerouslySetInnerHTML={{ __html: results }}></div>
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

        {/* Right Column - Results (Desktop Only) */}
        <div className="hidden lg:block" style={{ width: '350px' }}>
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 lg:sticky lg:top-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Volume Calculations</h3>
            <div id="results-sidebar" className="space-y-4" dangerouslySetInnerHTML={{ __html: results }}></div>
          </div>
        </div>
      </div>

      {/* Information Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
        {/* Common Pipe Sizes */}
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Common Pipe Sizes</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  15mm (½"): Small residential
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  20mm (¾"): Standard supply
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  50mm (2"): Building services
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  100mm (4"): Large diameter
                </li>
              </ul>
            </div>
          </div>
        </div>
{/* Material Properties */}
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Material Properties</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Steel: High pressure, industrial
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Copper: Potable water, HVAC
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  PVC: Cold water, drainage
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Cast Iron: Sewer systems
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Flow Formulas */}
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Flow Formulas</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Volume Flow: Q = A × v
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Velocity: v = Q / A
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Reynolds: Re = ρvD/μ
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Pressure Drop: ΔP = f(L/D)(ρv²/2)
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Design Considerations */}
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Design Tips</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Match pressure rating to system
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Account for thermal expansion
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Proper support spacing
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Consider insulation needs
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Application Areas */}
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Applications</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Plumbing systems
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  HVAC ductwork
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Industrial processes
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Fire protection systems
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Fluid Densities */}
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fluid Densities</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Water: 1000 kg/m³
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Air (20°C): 1.2 kg/m³
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Oil: 900 kg/m³
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Natural Gas: 0.8 kg/m³
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="font-medium text-gray-900">How do I calculate pipe volume?</span>
              </div>
              <svg className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </summary>
            <div className="mt-3 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">For circular pipes, use the formula: Volume = π × r² × L, where r is the internal radius and L is the length. For rectangular ducts, use: Volume = Width × Height × Length. This calculator automatically converts units and provides accurate results.</p>
            </div>
          </details>

          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="font-medium text-gray-900">What's the difference between internal and nominal diameter?</span>
              </div>
              <svg className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </summary>
            <div className="mt-3 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">Nominal diameter is a standardized size designation that approximates the pipe size. Internal diameter (ID) is the actual inside measurement of the pipe. For volume calculations, always use the internal diameter as it represents the actual fluid carrying capacity.</p>
            </div>
          </details>

          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="font-medium text-gray-900">Why does fluid weight matter?</span>
              </div>
              <svg className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </summary>
            <div className="mt-3 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">Fluid weight is critical for structural support design, pump sizing, and system pressure calculations. Different fluids have different densities - water is much heavier than air or steam. Knowing the total weight helps ensure proper pipe supports and hangers are installed.</p>
            </div>
          </details>

          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="font-medium text-gray-900">When should I use rectangular ducts vs circular pipes?</span>
              </div>
              <svg className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </summary>
            <div className="mt-3 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">Circular pipes are more efficient for pressure systems and provide better flow characteristics. Rectangular ducts are commonly used in HVAC systems where space constraints exist (like above ceilings) or when fitting ductwork into tight spaces. Rectangular ducts can be easier to fabricate and install in certain applications.</p>
            </div>
          </details>

          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="font-medium text-gray-900">What is fill percentage used for?</span>
              </div>
              <svg className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </summary>
            <div className="mt-3 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">Fill percentage is important for drainage systems and partially filled pipes. Gravity drainage pipes typically run at 50-75% capacity to allow air flow and prevent airlocks. For pressurized systems, use 100% fill. Adjust this value based on your specific application requirements.</p>
            </div>
          </details>
        </div>
      </div>

      {/* MREC Advertisement Banners */}
      {/* Enhanced Related Calculators */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Engineering Calculators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedCalculators.map((calc, index) => (
            <Link
              key={index}
              href={calc.href}
              className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 sm:p-4 md:p-6"
            >
              <div className={`w-12 h-12 ${calc.color || 'bg-gray-500'} rounded-lg flex items-center justify-center mb-4`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{calc.title}</h3>
              <p className="text-sm text-gray-600">{calc.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="pipe-volume-calculator" fallbackFaqs={fallbackFaqs} />
      </div>

    </div>
  );
}
