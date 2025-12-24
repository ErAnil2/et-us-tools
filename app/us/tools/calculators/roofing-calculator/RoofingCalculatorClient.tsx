'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';

import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
// Fallback FAQs for Roofing Calculator
const fallbackFaqs = [
  {
    id: 'faq-1',
    question: 'How do I calculate how many roofing squares I need?',
    answer: 'A roofing square equals 100 square feet. To calculate squares needed: first find your roof area in square feet (length × width for simple roofs), then divide by 100. For example, a 2,000 sq ft roof needs 20 squares. Add 10-15% for waste, slopes, and cuts. For complex roofs with multiple sections, calculate each section separately and add them together.',
    order: 1,
  },
  {
    id: 'faq-2',
    question: 'What is roof pitch and how does it affect material needs?',
    answer: 'Roof pitch is the slope expressed as rise over run (e.g., 6/12 means 6 inches rise per 12 inches of horizontal run). Steeper pitches require more roofing material because the actual roof surface area is larger than the footprint. A 6/12 pitch adds about 12% more area, while a 12/12 pitch (45°) adds about 41% more. Use pitch multipliers: 4/12=1.06, 6/12=1.12, 8/12=1.20, 10/12=1.30, 12/12=1.41.',
    order: 2,
  },
  {
    id: 'faq-3',
    question: 'How much does roofing material cost per square?',
    answer: 'Roofing costs vary by material: Asphalt shingles cost $80-120 per square (material only), Metal roofing costs $150-600 per square, Wood shingles cost $250-600 per square, Tile roofing costs $300-800 per square, and Slate costs $800-1,500+ per square. Labor typically adds $150-300 per square. Total installed costs range from $300-450 for asphalt to $1,500-2,500+ for premium materials.',
    order: 3,
  },
  {
    id: 'faq-4',
    question: 'How many shingles are in a bundle and how many bundles per square?',
    answer: 'Standard 3-tab shingles typically come 3 bundles per square (26-29 shingles per bundle). Architectural/dimensional shingles may require 3-5 bundles per square depending on the manufacturer and style. Always check the manufacturer\'s specifications as coverage varies. Most bundles weigh 60-80 lbs for 3-tab and 65-80 lbs for architectural shingles.',
    order: 4,
  },
  {
    id: 'faq-5',
    question: 'How do I calculate roofing felt/underlayment needed?',
    answer: 'Roofing felt comes in rolls - typically 15 lb felt covers about 400 sq ft per roll (4 squares), while 30 lb felt covers about 200 sq ft per roll (2 squares). Synthetic underlayment covers 1,000 sq ft (10 squares) per roll. Calculate total roof area including pitch factor, then divide by roll coverage. Add 10% for overlaps and waste. Most codes require underlayment beneath shingles.',
    order: 5,
  },
  {
    id: 'faq-6',
    question: 'What additional roofing materials do I need besides shingles?',
    answer: 'Beyond shingles, you\'ll need: underlayment/felt paper, drip edge (linear feet = perimeter), ice/water shield for eaves and valleys (1-3 feet up from eaves), ridge cap shingles (linear feet of ridges ÷ 3), roofing nails (about 2.5 lbs per square), and possibly starter strips, flashing, and ventilation. Don\'t forget about disposal costs for old roofing - typically $50-100 per square.',
    order: 6,
  },
];

// Pitch multipliers for calculating actual roof area
const pitchMultipliers: Record<number, number> = {
  1: 1.003, 2: 1.014, 3: 1.031, 4: 1.054, 5: 1.083, 6: 1.118,
  7: 1.158, 8: 1.202, 9: 1.250, 10: 1.302, 11: 1.357, 12: 1.414
};

// Shingle coverage data
const shingleData: Record<string, { coverage: number; bundles: number; weight: number; costPerSq: number }> = {
  '3-tab': { coverage: 33.33, bundles: 3, weight: 200, costPerSq: 100 },
  'architectural': { coverage: 32.8, bundles: 3, weight: 240, costPerSq: 150 },
  'premium': { coverage: 25, bundles: 4, weight: 320, costPerSq: 250 },
  'slate': { coverage: 100, bundles: 1, weight: 800, costPerSq: 1200 },
  'tile': { coverage: 100, bundles: 1, weight: 600, costPerSq: 600 },
  'metal': { coverage: 100, bundles: 1, weight: 100, costPerSq: 400 }
};

// Roofing material presets
const materialPresets = [
  { name: '3-Tab Asphalt', key: '3-tab', icon: '🏠', desc: 'Budget friendly' },
  { name: 'Architectural', key: 'architectural', icon: '🏘️', desc: 'Most popular' },
  { name: 'Premium Designer', key: 'premium', icon: '✨', desc: 'High-end look' },
  { name: 'Metal Roofing', key: 'metal', icon: '🏭', desc: 'Long lasting' },
  { name: 'Clay Tile', key: 'tile', icon: '🏰', desc: 'Mediterranean' },
  { name: 'Natural Slate', key: 'slate', icon: '⛰️', desc: 'Premium choice' },
];

export default function RoofingCalculatorClient() {
  const { getH1, getSubHeading, faqSchema } = usePageSEO('roofing-calculator');

  const [roofType, setRoofType] = useState('hip');
  const [roofLength, setRoofLength] = useState(40);
  const [roofWidth, setRoofWidth] = useState(30);
  const [roofPitch, setRoofPitch] = useState(6);
  const [shingleType, setShingleType] = useState('architectural');
  const [wasteFactor, setWasteFactor] = useState(10);
  const [materialCost, setMaterialCost] = useState(3.50);
  const [laborCost, setLaborCost] = useState(4.50);

  const [results, setResults] = useState({
    totalSquares: 0,
    roofArea: 0,
    actualArea: 0,
    bundlesNeeded: 0,
    totalMaterialCost: 0,
    totalLaborCost: 0,
    totalProjectCost: 0,
    additionalMaterials: {
      underlaymentRolls: 0,
      ridgeCap: 0,
      starterStrips: 0,
      nailsNeeded: 0
    }
  });

  useEffect(() => {
    calculateRoofing();
  }, [roofType, roofLength, roofWidth, roofPitch, shingleType, wasteFactor, materialCost, laborCost]);

  const calculateRoofing = () => {
    if (roofLength <= 0 || roofWidth <= 0) {
      resetResults();
      return;
    }

    let baseArea = roofLength * roofWidth;

    let typeMultiplier = 1.0;
    switch(roofType) {
      case 'gable': typeMultiplier = 1.0; break;
      case 'hip': typeMultiplier = 1.1; break;
      case 'shed': typeMultiplier = 1.0; break;
      case 'complex': typeMultiplier = 1.2; break;
    }

    baseArea *= typeMultiplier;

    const pitchMultiplier = pitchMultipliers[roofPitch] || 1.118;
    const actualArea = baseArea * pitchMultiplier;

    const wasteFactorDecimal = wasteFactor / 100;
    const areaWithWaste = actualArea * (1 + wasteFactorDecimal);

    const totalSquares = areaWithWaste / 100;

    const shingleInfo = shingleData[shingleType];
    const bundlesPerSquare = shingleInfo.bundles;
    const totalBundles = Math.ceil(totalSquares * bundlesPerSquare);

    const totalMaterialCost = areaWithWaste * materialCost;
    const totalLaborCost = areaWithWaste * laborCost;
    const totalProjectCost = totalMaterialCost + totalLaborCost;

    const underlaymentRolls = Math.ceil(actualArea / 400);
    const ridgeLength = Math.max(roofLength, roofWidth);
    const ridgeCap = Math.ceil(ridgeLength * 1.1);
    const starterStrips = Math.ceil((roofLength + roofWidth) * 2 * 1.1);
    const nailsNeeded = Math.ceil(totalSquares * 0.67);

    setResults({
      totalSquares,
      roofArea: baseArea,
      actualArea,
      bundlesNeeded: totalBundles,
      totalMaterialCost,
      totalLaborCost,
      totalProjectCost,
      additionalMaterials: { underlaymentRolls, ridgeCap, starterStrips, nailsNeeded }
    });
  };

  const resetResults = () => {
    setResults({
      totalSquares: 0, roofArea: 0, actualArea: 0, bundlesNeeded: 0,
      totalMaterialCost: 0, totalLaborCost: 0, totalProjectCost: 0,
      additionalMaterials: { underlaymentRolls: 0, ridgeCap: 0, starterStrips: 0, nailsNeeded: 0 }
    });
  };

  const applyMaterialPreset = (key: string) => {
    setShingleType(key);
    const material = shingleData[key];
    if (material) {
      setMaterialCost(material.costPerSq / 100 * 3.5);
    }
  };

  // Schema.org WebApplication markup
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Roofing Calculator",
    "description": "Calculate roofing materials, squares, bundles, and costs. Estimate shingles, underlayment, and labor for your roof replacement project.",
    "url": "https://www.example.com/us/tools/calculators/roofing-calculator",
    "applicationCategory": "Construction Calculator",
    "operatingSystem": "All",
    "permissions": "none",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
  };

  return (
    <article className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-100 py-4 sm:py-6 md:py-8">
      {/* Schema.org markup */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      <div className="max-w-[1180px] mx-auto px-4">
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {getH1('Roofing Calculator')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {getSubHeading('Calculate roofing materials, squares, and costs for your project')}
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        <div className="grid lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8">
          {/* Calculator Section */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-6">
            {/* Main Calculator */}
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 flex items-center gap-2">
                <span className="text-2xl">🏠</span> Roof Specifications
              </h2>

              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                {/* Material Presets */}
                <div className="bg-orange-50 rounded-lg p-5">
                  <h3 className="font-semibold mb-3 text-orange-800">Select Roofing Material</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {materialPresets.map((preset) => (
                      <button
                        key={preset.key}
                        onClick={() => applyMaterialPreset(preset.key)}
                        className={`p-3 rounded-lg border-2 transition text-center ${
                          shingleType === preset.key
                            ? 'border-orange-500 bg-orange-100'
                            : 'border-gray-200 bg-white hover:border-orange-300'
                        }`}
                      >
                        <div className="text-xl">{preset.icon}</div>
                        <div className="text-xs font-medium text-gray-700">{preset.name}</div>
                        <div className="text-xs text-orange-600">{preset.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Roof Type & Dimensions */}
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-5">
                  <h3 className="font-semibold mb-4 text-amber-800">Roof Dimensions</h3>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Roof Type</label>
                      <select
                        value={roofType}
                        onChange={(e) => setRoofType(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="gable">Gable Roof</option>
                        <option value="hip">Hip Roof (+10%)</option>
                        <option value="shed">Shed Roof</option>
                        <option value="complex">Complex (+20%)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Length (ft)</label>
                      <input
                        type="number"
                        value={roofLength}
                        onChange={(e) => setRoofLength(parseFloat(e.target.value) || 0)}
                        min="1"
                        step="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Width (ft)</label>
                      <input
                        type="number"
                        value={roofWidth}
                        onChange={(e) => setRoofWidth(parseFloat(e.target.value) || 0)}
                        min="1"
                        step="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Pitch Selection */}
                <div className="bg-blue-50 rounded-lg p-5">
                  <h3 className="font-semibold mb-3 text-blue-800">Roof Pitch (Rise/12in Run)</h3>
                  <select
                    value={roofPitch}
                    onChange={(e) => setRoofPitch(parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1">1/12 (4.8°) - Nearly flat</option>
                    <option value="2">2/12 (9.5°) - Low slope</option>
                    <option value="3">3/12 (14.0°) - Low slope</option>
                    <option value="4">4/12 (18.4°) - Walkable</option>
                    <option value="6">6/12 (26.6°) - Standard</option>
                    <option value="8">8/12 (33.7°) - Steep</option>
                    <option value="10">10/12 (39.8°) - Very steep</option>
                    <option value="12">12/12 (45.0°) - Extremely steep</option>
                  </select>
                  <div className="mt-2 text-sm text-blue-600">
                    Pitch multiplier: {pitchMultipliers[roofPitch]}x - adds {Math.round((pitchMultipliers[roofPitch] - 1) * 100)}% to footprint
                  </div>
                </div>

                {/* Additional Options */}
                <div className="bg-green-50 rounded-lg p-5">
                  <h3 className="font-semibold mb-4 text-green-800">Cost & Waste Settings</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Waste Factor</label>
                      <select
                        value={wasteFactor}
                        onChange={(e) => setWasteFactor(parseFloat(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="10">10% - Standard</option>
                        <option value="15">15% - Complex roof</option>
                        <option value="20">20% - Many angles</option>
                        <option value="25">25% - Very complex</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Material ($/sq ft)</label>
                      <input
                        type="number"
                        value={materialCost}
                        onChange={(e) => setMaterialCost(parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Labor ($/sq ft)</label>
                      <input
                        type="number"
                        value={laborCost}
                        onChange={(e) => setLaborCost(parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

            {/* Understanding Roofing */}
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Understanding Roofing Measurements</h3>
              <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">What is a Roofing Square?</h4>
                    <p className="text-sm text-orange-700">
                      A roofing square = 100 square feet. This is the standard unit for measuring and pricing roofing materials.
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Pitch Calculation</h4>
                    <p className="text-sm text-blue-700">
                      A 6/12 pitch rises 6 inches for every 12 inches horizontal. Steeper = more surface area = more materials.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Waste Factor</h4>
                    <p className="text-sm text-green-700">
                      Add 10-15% for simple roofs, 15-25% for complex roofs with valleys, hips, or dormers.
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">Material Lifespan</h4>
                    <p className="text-sm text-purple-700">
                      Asphalt: 20-30 yrs. Architectural: 30-50 yrs. Metal: 40-70 yrs. Slate/Tile: 75-150 yrs.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Material Comparison */}
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Material Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-3">Material</th>
                      <th className="text-left p-3">Cost/Sq</th>
                      <th className="text-left p-3">Lifespan</th>
                      <th className="text-left p-3">Best For</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b"><td className="p-3 font-medium">3-Tab Asphalt</td><td className="p-3">$80-120</td><td className="p-3">15-20 yrs</td><td className="p-3 text-gray-600">Budget projects</td></tr>
                    <tr className="border-b bg-gray-50"><td className="p-3 font-medium">Architectural</td><td className="p-3">$100-200</td><td className="p-3">25-30 yrs</td><td className="p-3 text-gray-600">Most homeowners</td></tr>
                    <tr className="border-b"><td className="p-3 font-medium">Metal</td><td className="p-3">$150-600</td><td className="p-3">40-70 yrs</td><td className="p-3 text-gray-600">Durability, energy efficiency</td></tr>
                    <tr className="border-b bg-gray-50"><td className="p-3 font-medium">Wood Shakes</td><td className="p-3">$250-600</td><td className="p-3">20-30 yrs</td><td className="p-3 text-gray-600">Natural aesthetics</td></tr>
                    <tr className="border-b"><td className="p-3 font-medium">Clay Tile</td><td className="p-3">$300-800</td><td className="p-3">50-100 yrs</td><td className="p-3 text-gray-600">Mediterranean style</td></tr>
                    <tr className="bg-gray-50"><td className="p-3 font-medium">Slate</td><td className="p-3">$800-1,500+</td><td className="p-3">75-150 yrs</td><td className="p-3 text-gray-600">Premium, historic homes</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
{/* SEO Content */}
            

            {/* Mobile MREC2 - Before FAQs */}

            

            <CalculatorMobileMrec2 />


            

            {/* FAQ Section */}
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
              <FirebaseFAQs fallbackFaqs={fallbackFaqs} />
            </div>
          </div>

          {/* Results Sidebar */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-5">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>📊</span> Estimate Results
              </h3>

              <div className="space-y-4">
                {/* Primary Squares Display */}
                <div className="p-5 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl text-white text-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold">{results.totalSquares.toFixed(1)}</div>
                  <div className="text-orange-100 mt-1">Roofing Squares</div>
                </div>

                {/* Area Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Base Area</span>
                    <span className="font-bold text-gray-800">{results.roofArea.toFixed(0)} sq ft</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-gray-600">With Pitch</span>
                    <span className="font-bold text-blue-700">{results.actualArea.toFixed(0)} sq ft</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-gray-600">Bundles Needed</span>
                    <span className="font-bold text-green-700">{results.bundlesNeeded}</span>
                  </div>
                </div>

                {/* Additional Materials */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-700 mb-3 text-sm">Additional Materials</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-yellow-50 rounded">
                      <span className="text-yellow-700">Underlayment Rolls</span>
                      <span className="font-medium text-yellow-800">{results.additionalMaterials.underlaymentRolls}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-purple-50 rounded">
                      <span className="text-purple-700">Ridge Cap (lin ft)</span>
                      <span className="font-medium text-purple-800">{results.additionalMaterials.ridgeCap}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-blue-50 rounded">
                      <span className="text-blue-700">Drip Edge (lin ft)</span>
                      <span className="font-medium text-blue-800">{results.additionalMaterials.starterStrips}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span className="text-gray-700">Nails (lbs)</span>
                      <span className="font-medium text-gray-800">{results.additionalMaterials.nailsNeeded}</span>
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-700 mb-3">Cost Estimate</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between p-2">
                      <span className="text-gray-600">Materials</span>
                      <span className="font-medium text-gray-700">${results.totalMaterialCost.toLocaleString('en-US', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div className="flex justify-between p-2">
                      <span className="text-gray-600">Labor</span>
                      <span className="font-medium text-gray-700">${results.totalLaborCost.toLocaleString('en-US', {maximumFractionDigits: 0})}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-green-100 rounded-lg">
                      <span className="font-semibold text-green-800">Total Estimate</span>
                      <span className="text-xl font-bold text-green-800">${results.totalProjectCost.toLocaleString('en-US', {maximumFractionDigits: 0})}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pitch Reference */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5">
              <h3 className="text-lg font-bold text-blue-800 mb-3">Pitch Reference</h3>
              <div className="space-y-2 text-sm">
                {[{p: 4, name: 'Low Slope'}, {p: 6, name: 'Standard'}, {p: 8, name: 'Steep'}, {p: 10, name: 'Very Steep'}, {p: 12, name: '45°'}].map(({p, name}) => (
                  <div key={p} className="flex justify-between py-1 border-b border-blue-200">
                    <span className="text-blue-700">{p}/12 ({name})</span>
                    <span className="font-medium text-blue-800">+{Math.round((pitchMultipliers[p] - 1) * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Tips */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5">
              <h3 className="text-lg font-bold text-green-800 mb-3">Pro Tips</h3>
              <div className="space-y-2 text-sm text-green-700">
                <div className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span><span>Get 3+ quotes from licensed contractors</span></div>
                <div className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span><span>Check local permit requirements</span></div>
                <div className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span><span>Ask about material and labor warranties</span></div>
                <div className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span><span>Consider ventilation and ice dams</span></div>
                <div className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span><span>Factor in old roof removal costs</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
