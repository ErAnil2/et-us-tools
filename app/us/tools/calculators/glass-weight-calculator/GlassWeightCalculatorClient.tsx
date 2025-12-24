'use client';

import React, { useState, useEffect } from 'react';
import { FirebaseFAQs } from '@/components/PageSEOContent';

const glassDensities: { [key: string]: number } = {
  float: 2500,
  tempered: 2500,
  laminated: 2550,
  lowE: 2520,
  tinted: 2600,
  wired: 2700
};

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Glass Weight Calculator?",
    answer: "A Glass Weight Calculator is a health and fitness tool that helps you calculate glass weight-related metrics. It provides quick estimates to help you understand and track your health status.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is this Glass Weight Calculator?",
    answer: "This calculator provides estimates based on standard formulas. While useful for general guidance, it should not replace professional medical advice. Consult a healthcare provider for personalized recommendations.",
    order: 2
  },
  {
    id: '3',
    question: "Is this calculator suitable for everyone?",
    answer: "This calculator is designed for general adult use. Results may vary for children, pregnant women, athletes, or individuals with specific health conditions. Consult a healthcare professional for personalized advice.",
    order: 3
  },
  {
    id: '4',
    question: "How often should I use this calculator?",
    answer: "You can use this calculator as often as needed to track changes. For health metrics, weekly or monthly tracking is typically recommended to observe meaningful trends.",
    order: 4
  },
  {
    id: '5',
    question: "What should I do with my results?",
    answer: "Use the results as a starting point for understanding your glass weight status. If results indicate concerns, or for personalized advice, consult with a healthcare professional.",
    order: 5
  }
];

export default function GlassWeightCalculatorClient() {
  // Inputs
  const [glassType, setGlassType] = useState<string>('float');
  const [length, setLength] = useState<number>(2000);
  const [width, setWidth] = useState<number>(1000);
  const [thickness, setThickness] = useState<number>(6);
  const [quantity, setQuantity] = useState<number>(1);
  const [wastage, setWastage] = useState<number>(5);

  // Results
  const [singleWeight, setSingleWeight] = useState<number>(0);
  const [totalWeight, setTotalWeight] = useState<number>(0);
  const [weightPerSqm, setWeightPerSqm] = useState<number>(0);
  const [glassArea, setGlassArea] = useState<number>(0);
  const [glassVolume, setGlassVolume] = useState<number>(0);
  const [glassDensity, setGlassDensity] = useState<number>(2500);

  // Calculate glass weight
  useEffect(() => {
    if (length <= 0 || width <= 0 || thickness <= 0) return;

    // Convert dimensions to meters
    const lengthM = length / 1000;
    const widthM = width / 1000;
    const thicknessM = thickness / 1000;

    // Calculate area and volume
    const area = lengthM * widthM;
    const volume = area * thicknessM;

    // Get glass density
    const density = glassDensities[glassType];

    // Calculate weights
    const single = volume * density;
    const totalBase = single * quantity;
    const total = totalBase * (1 + wastage / 100);
    const perSqm = single / area;

    // Update states
    setSingleWeight(single);
    setTotalWeight(total);
    setWeightPerSqm(perSqm);
    setGlassArea(area);
    setGlassVolume(volume);
    setGlassDensity(density);
  }, [glassType, length, width, thickness, quantity, wastage]);

  const applyPreset = (type: string) => {
    switch (type) {
      case 'window':
        setLength(1500);
        setWidth(1200);
        setThickness(4);
        break;
      case 'door':
        setLength(2100);
        setWidth(900);
        setThickness(6);
        break;
      case 'shopfront':
        setLength(3000);
        setWidth(2500);
        setThickness(10);
        break;
      case 'curtainwall':
        setLength(3600);
        setWidth(1500);
        setThickness(12);
        break;
    }
  };

  const copyResults = () => {
    const results = `Glass Weight Calculator Results

Single Panel Weight: ${singleWeight.toFixed(2)} kg
Total Weight (with wastage): ${totalWeight.toFixed(2)} kg
Weight per m²: ${weightPerSqm.toFixed(2)} kg/m²
Glass Area: ${glassArea.toFixed(3)} m²
Volume: ${glassVolume.toFixed(6)} m³
Glass Density: ${glassDensity} kg/m³`;

    navigator.clipboard.writeText(results).then(() => {
      alert('✅ Results copied to clipboard!');
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-8">
      {/* Header */}
      <header className="text-center mb-6 md:mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
          Glass Weight Calculator
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
          Calculate the weight of glass panels for architectural glazing, windows, and structural applications
        </p>
      </header>

      {/* Main Calculator Layout */}
      <div className="grid lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
        {/* Left Column: Inputs (2/3) */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Glass Type Selector */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Glass Type</h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3 mb-4 md:mb-6">
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="glassType"
                  value="float"
                  checked={glassType === 'float'}
                  onChange={(e) => setGlassType(e.target.value)}
                  className="peer sr-only"
                />
                <div className="h-full p-3 border-2 border-gray-300 rounded-lg text-center peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:shadow-md transition-all hover:bg-gray-50">
                  <div className="text-2xl mb-1">🪟</div>
                  <div className="text-xs md:text-sm font-semibold text-gray-900">Float Glass</div>
                  <div className="text-xs text-gray-500">2500 kg/m³</div>
                </div>
              </label>

              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="glassType"
                  value="tempered"
                  checked={glassType === 'tempered'}
                  onChange={(e) => setGlassType(e.target.value)}
                  className="peer sr-only"
                />
                <div className="h-full p-3 border-2 border-gray-300 rounded-lg text-center peer-checked:border-orange-600 peer-checked:bg-orange-50 peer-checked:shadow-md transition-all hover:bg-gray-50">
                  <div className="text-2xl mb-1">💪</div>
                  <div className="text-xs md:text-sm font-semibold text-gray-900">Tempered</div>
                  <div className="text-xs text-gray-500">2500 kg/m³</div>
                </div>
              </label>

              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="glassType"
                  value="laminated"
                  checked={glassType === 'laminated'}
                  onChange={(e) => setGlassType(e.target.value)}
                  className="peer sr-only"
                />
                <div className="h-full p-3 border-2 border-gray-300 rounded-lg text-center peer-checked:border-green-600 peer-checked:bg-green-50 peer-checked:shadow-md transition-all hover:bg-gray-50">
                  <div className="text-2xl mb-1">🔗</div>
                  <div className="text-xs md:text-sm font-semibold text-gray-900">Laminated</div>
                  <div className="text-xs text-gray-500">2550 kg/m³</div>
                </div>
              </label>

              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="glassType"
                  value="lowE"
                  checked={glassType === 'lowE'}
                  onChange={(e) => setGlassType(e.target.value)}
                  className="peer sr-only"
                />
                <div className="h-full p-3 border-2 border-gray-300 rounded-lg text-center peer-checked:border-purple-600 peer-checked:bg-purple-50 peer-checked:shadow-md transition-all hover:bg-gray-50">
                  <div className="text-2xl mb-1">🌡️</div>
                  <div className="text-xs md:text-sm font-semibold text-gray-900">Low-E</div>
                  <div className="text-xs text-gray-500">2520 kg/m³</div>
                </div>
              </label>

              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="glassType"
                  value="tinted"
                  checked={glassType === 'tinted'}
                  onChange={(e) => setGlassType(e.target.value)}
                  className="peer sr-only"
                />
                <div className="h-full p-3 border-2 border-gray-300 rounded-lg text-center peer-checked:border-amber-600 peer-checked:bg-amber-50 peer-checked:shadow-md transition-all hover:bg-gray-50">
                  <div className="text-2xl mb-1">🎨</div>
                  <div className="text-xs md:text-sm font-semibold text-gray-900">Tinted</div>
                  <div className="text-xs text-gray-500">2600 kg/m³</div>
                </div>
              </label>

              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="glassType"
                  value="wired"
                  checked={glassType === 'wired'}
                  onChange={(e) => setGlassType(e.target.value)}
                  className="peer sr-only"
                />
                <div className="h-full p-3 border-2 border-gray-300 rounded-lg text-center peer-checked:border-gray-600 peer-checked:bg-gray-50 peer-checked:shadow-md transition-all hover:bg-gray-50">
                  <div className="text-2xl mb-1">🔒</div>
                  <div className="text-xs md:text-sm font-semibold text-gray-900">Wired</div>
                  <div className="text-xs text-gray-500">2700 kg/m³</div>
                </div>
              </label>
            </div>

            {/* Quick Size Presets */}
            <div className="mb-4 md:mb-6">
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2 md:mb-3">
                Quick Size Presets:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3">
                <button
                  onClick={() => applyPreset('window')}
                  className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-xs md:text-sm font-semibold hover:bg-blue-200 transition-all"
                >
                  🪟 Standard Window
                </button>
                <button
                  onClick={() => applyPreset('door')}
                  className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-xs md:text-sm font-semibold hover:bg-green-200 transition-all"
                >
                  🚪 Door Panel
                </button>
                <button
                  onClick={() => applyPreset('shopfront')}
                  className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-xs md:text-sm font-semibold hover:bg-purple-200 transition-all"
                >
                  🏪 Shopfront
                </button>
                <button
                  onClick={() => applyPreset('curtainwall')}
                  className="px-3 py-2 bg-orange-100 text-orange-700 rounded-lg text-xs md:text-sm font-semibold hover:bg-orange-200 transition-all"
                >
                  🏢 Curtain Wall
                </button>
              </div>
            </div>

            {/* Dimensions */}
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label htmlFor="length" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  Length (mm)
                </label>
                <input
                  type="number"
                  id="length"
                  value={length}
                  onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                  min="1"
                  step="1"
                  className="w-full px-3 md:px-2 py-2 md:py-3 border-2 border-gray-300 rounded-lg text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label htmlFor="width" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  Width (mm)
                </label>
                <input
                  type="number"
                  id="width"
                  value={width}
                  onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                  min="1"
                  step="1"
                  className="w-full px-3 md:px-2 py-2 md:py-3 border-2 border-gray-300 rounded-lg text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Thickness Slider */}
            <div className="mt-4 md:mt-6">
              <label htmlFor="thickness" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                Thickness: <span className="text-blue-600 font-bold text-sm md:text-base">{thickness} mm</span>
              </label>
              <input
                type="range"
                id="thickness"
                value={thickness}
                onChange={(e) => setThickness(parseFloat(e.target.value))}
                min="3"
                max="25"
                step="0.5"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>3mm (Picture Frame)</span>
                <span>6mm (Standard)</span>
                <span>25mm (Heavy Duty)</span>
              </div>
            </div>

            {/* Quantity and Wastage */}
            <div className="grid md:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
              <div>
                <label htmlFor="quantity" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  Quantity (pieces)
                </label>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  min="1"
                  step="1"
                  className="w-full px-3 md:px-2 py-2 md:py-3 border-2 border-gray-300 rounded-lg text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label htmlFor="wastage" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  Wastage Factor (%)
                </label>
                <input
                  type="number"
                  id="wastage"
                  value={wastage}
                  onChange={(e) => setWastage(parseFloat(e.target.value) || 0)}
                  min="0"
                  max="50"
                  step="0.1"
                  className="w-full px-3 md:px-2 py-2 md:py-3 border-2 border-gray-300 rounded-lg text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Results (1/3) */}
        <div className="space-y-4 md:space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-xl p-4 md:p-6 text-white sticky top-4">
            <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4 flex items-center gap-2">
              <span>⚖️</span> Weight Calculations
            </h3>

            {/* Primary Result */}
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 md:p-4 mb-3 md:mb-4">
              <div className="text-xs md:text-sm opacity-90 mb-1">Single Panel Weight</div>
              <div className="text-2xl md:text-3xl font-bold break-words">{singleWeight.toFixed(2)} kg</div>
            </div>

            {/* Detailed Results */}
            <div className="space-y-2 md:space-y-3">
              <div className="bg-white/10 rounded-lg p-2 md:p-3">
                <div className="text-xs opacity-80">Total Weight (with wastage)</div>
                <div className="text-lg md:text-xl font-bold">{totalWeight.toFixed(2)} kg</div>
              </div>

              <div className="bg-white/10 rounded-lg p-2 md:p-3">
                <div className="text-xs opacity-80">Weight per m²</div>
                <div className="text-lg md:text-xl font-bold">{weightPerSqm.toFixed(2)} kg/m²</div>
              </div>

              <div className="bg-white/10 rounded-lg p-2 md:p-3">
                <div className="text-xs opacity-80">Glass Area</div>
                <div className="text-lg md:text-xl font-bold">{glassArea.toFixed(3)} m²</div>
              </div>

              <div className="bg-white/10 rounded-lg p-2 md:p-3">
                <div className="text-xs opacity-80">Volume</div>
                <div className="text-lg md:text-xl font-bold">{glassVolume.toFixed(6)} m³</div>
              </div>

              <div className="bg-white/10 rounded-lg p-2 md:p-3">
                <div className="text-xs opacity-80">Glass Density</div>
                <div className="text-lg md:text-xl font-bold">{glassDensity} kg/m³</div>
              </div>
            </div>

            {/* Copy Button */}
            <button
              onClick={copyResults}
              className="w-full mt-4 md:mt-6 px-3 md:px-2 py-2 md:py-3 bg-white text-blue-600 rounded-lg text-xs md:text-sm font-semibold hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
            >
              <span>📋</span> Copy Results
            </button>
          </div>
        </div>
      </div>

      {/* Information Sections */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
            <span>🔬</span> Glass Types & Properties
          </h3>
          <ul className="space-y-2 text-xs md:text-sm text-gray-700">
            <li>
              <strong>Float Glass:</strong> Standard window glass, density ~2500 kg/m³
            </li>
            <li>
              <strong>Tempered Glass:</strong> Heat-strengthened, same density as float
            </li>
            <li>
              <strong>Laminated Glass:</strong> Multiple layers with interlayer, ~2550 kg/m³
            </li>
            <li>
              <strong>Low-E Glass:</strong> Coated for energy efficiency, ~2520 kg/m³
            </li>
            <li>
              <strong>Tinted Glass:</strong> Colored float glass, ~2600 kg/m³
            </li>
            <li>
              <strong>Wired Glass:</strong> Wire-reinforced safety glass, ~2700 kg/m³
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
            <span>📏</span> Standard Thicknesses
          </h3>
          <ul className="space-y-2 text-xs md:text-sm text-gray-700">
            <li>
              <strong>3mm:</strong> Picture frames, small windows
            </li>
            <li>
              <strong>4-6mm:</strong> Standard windows, doors
            </li>
            <li>
              <strong>8-10mm:</strong> Large windows, shopfronts
            </li>
            <li>
              <strong>12-15mm:</strong> Structural glazing, curtain walls
            </li>
            <li>
              <strong>19-25mm:</strong> Heavy-duty commercial applications
            </li>
            <li>
              <strong>32mm+:</strong> Specialized structural applications
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
            <span>⚠️</span> Load Considerations
          </h3>
          <ul className="space-y-2 text-xs md:text-sm text-gray-700">
            <li>
              <strong>Dead Load:</strong> Permanent glass weight on structure
            </li>
            <li>
              <strong>Wind Load:</strong> Dynamic pressure from wind forces
            </li>
            <li>
              <strong>Thermal Load:</strong> Expansion/contraction effects
            </li>
            <li>
              <strong>Support Spacing:</strong> Affects deflection and stress
            </li>
            <li>
              <strong>Edge Support:</strong> Continuous vs. point supports
            </li>
            <li>
              <strong>Safety Factor:</strong> Account for installation tolerances
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
            <span>🔧</span> Installation Guidelines
          </h3>
          <ul className="space-y-2 text-xs md:text-sm text-gray-700">
            <li>
              <strong>Handling:</strong> Use proper lifting equipment for heavy panels
            </li>
            <li>
              <strong>Storage:</strong> Store vertically on padded racks
            </li>
            <li>
              <strong>Transport:</strong> Secure properly to prevent shifting
            </li>
            <li>
              <strong>Glazing:</strong> Use appropriate glazing compounds
            </li>
            <li>
              <strong>Drainage:</strong> Ensure proper water drainage
            </li>
            <li>
              <strong>Thermal Movement:</strong> Allow for expansion joints
            </li>
          </ul>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="glass-weight-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
