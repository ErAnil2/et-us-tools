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
  color: string;
  icon: string;
}

interface MaterialData {
  density: number;
  name: string;
  tensile: string;
  yield: string;
}

interface SteelPlateWeightCalculatorClientProps {
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
    question: "What is a Steel Plate Weight Calculator?",
    answer: "A Steel Plate Weight Calculator is a health and fitness tool that helps you calculate steel plate weight-related metrics. It provides quick estimates to help you understand and track your health status.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is this Steel Plate Weight Calculator?",
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
    answer: "Use the results as a starting point for understanding your steel plate weight status. If results indicate concerns, or for personalized advice, consult with a healthcare professional.",
    order: 5
  }
];

export default function SteelPlateWeightCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: SteelPlateWeightCalculatorClientProps) {
  const { getH1, getSubHeading } = usePageSEO('steel-plate-weight-calculator');

  const [steelType, setSteelType] = useState('mild');
  const [shapeType, setShapeType] = useState('plate');
  const [plateLength, setPlateLength] = useState(48);
  const [plateWidth, setPlateWidth] = useState(24);
  const [plateThickness, setPlateThickness] = useState(0.25);
  const [roundDiameter, setRoundDiameter] = useState(0);
  const [roundLength, setRoundLength] = useState(0);
  const [squareSide, setSquareSide] = useState(0);
  const [squareLength, setSquareLength] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [pricePerPound, setPricePerPound] = useState(0.85);

  const [totalWeight, setTotalWeight] = useState(72.58);
  const [volume, setVolume] = useState(256);
  const [weightPerPiece, setWeightPerPiece] = useState(72.58);
  const [surfaceArea, setSurfaceArea] = useState(2424);
  const [materialCost, setMaterialCost] = useState(61.69);
  const [materialProperties, setMaterialProperties] = useState('');
  const [weightBreakdown, setWeightBreakdown] = useState('');

  // Material density database (lb/in³)
  const materialData: Record<string, MaterialData> = {
    mild: {
      density: 0.2836,
      name: 'Mild Steel (A36)',
      tensile: '58,000-80,000 psi',
      yield: '36,000 psi'
    },
    stainless304: {
      density: 0.290,
      name: 'Stainless Steel 304',
      tensile: '85,000 psi',
      yield: '35,000 psi'
    },
    stainless316: {
      density: 0.290,
      name: 'Stainless Steel 316',
      tensile: '85,000 psi',
      yield: '35,000 psi'
    },
    aluminum: {
      density: 0.0975,
      name: 'Aluminum 6061',
      tensile: '45,000 psi',
      yield: '40,000 psi'
    },
    brass: {
      density: 0.307,
      name: 'Brass',
      tensile: '54,000 psi',
      yield: '21,000 psi'
    },
    copper: {
      density: 0.324,
      name: 'Copper',
      tensile: '32,000 psi',
      yield: '10,000 psi'
    },
    carbon: {
      density: 0.2836,
      name: 'Carbon Steel',
      tensile: '70,000-120,000 psi',
      yield: '40,000-90,000 psi'
    }
  };

  const calculateSteelWeight = () => {
    let calcVolume = 0;
    let calcSurfaceArea = 0;
    let dimensions = '';

    // Calculate volume based on shape
    switch(shapeType) {
      case 'plate':
        if (plateLength > 0 && plateWidth > 0 && plateThickness > 0) {
          calcVolume = plateLength * plateWidth * plateThickness;
          calcSurfaceArea = 2 * (plateLength * plateWidth + plateLength * plateThickness + plateWidth * plateThickness);
          dimensions = `${plateLength}" × ${plateWidth}" × ${plateThickness}"`;
        }
        break;

      case 'round':
        if (roundDiameter > 0 && roundLength > 0) {
          const radius = roundDiameter / 2;
          calcVolume = Math.PI * radius * radius * roundLength;
          calcSurfaceArea = 2 * Math.PI * radius * roundLength + 2 * Math.PI * radius * radius;
          dimensions = `Ø${roundDiameter}" × ${roundLength}"`;
        }
        break;

      case 'square':
        if (squareSide > 0 && squareLength > 0) {
          calcVolume = squareSide * squareSide * squareLength;
          calcSurfaceArea = 4 * squareSide * squareLength + 2 * squareSide * squareSide;
          dimensions = `${squareSide}" × ${squareSide}" × ${squareLength}"`;
        }
        break;
    }

    if (calcVolume <= 0) {
      resetResults();
      return;
    }

    const material = materialData[steelType];
    const calcWeightPerPiece = calcVolume * material.density;
    const calcTotalWeight = calcWeightPerPiece * quantity;
    const calcTotalCost = calcTotalWeight * pricePerPound;

    // Update state
    setTotalWeight(calcTotalWeight);
    setVolume(calcVolume);
    setWeightPerPiece(calcWeightPerPiece);
    setSurfaceArea(calcSurfaceArea);
    setMaterialCost(calcTotalCost);

    // Update material properties
    setMaterialProperties(`
      <div>• Density: ${material.density} lb/in³</div>
      <div>• Tensile Strength: ${material.tensile}</div>
      <div>• Yield Strength: ${material.yield}</div>
    `);

    // Update weight breakdown
    setWeightBreakdown(`
      <div>• Steel type: ${material.name}</div>
      <div>• Dimensions: ${dimensions}</div>
      <div>• Density: ${material.density} lb/in³</div>
      <div>• Quantity: ${quantity} piece${quantity !== 1 ? 's' : ''}</div>
    `);
  };

  const resetResults = () => {
    setTotalWeight(0);
    setVolume(0);
    setWeightPerPiece(0);
    setSurfaceArea(0);
    setMaterialCost(0);
    setMaterialProperties('<div>Select material to see properties</div>');
    setWeightBreakdown('<div>Enter dimensions to see weight breakdown</div>');
  };

  useEffect(() => {
    calculateSteelWeight();
  }, [steelType, shapeType, plateLength, plateWidth, plateThickness, roundDiameter, roundLength, squareSide, squareLength, quantity, pricePerPound]);

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Steel Plate Weight Calculator')}</h1>
        <p className="text-lg text-gray-600">Calculate weight and cost of steel plates, sheets, and bars for industrial applications</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Steel Specifications</h2>

            {/* Steel Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Steel Type</label>
              <select
                id="steelType"
                value={steelType}
                onChange={(e) => setSteelType(e.target.value)}
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="mild">Mild Steel (A36)</option>
                <option value="stainless304">Stainless Steel 304</option>
                <option value="stainless316">Stainless Steel 316</option>
                <option value="aluminum">Aluminum 6061</option>
                <option value="brass">Brass</option>
                <option value="copper">Copper</option>
                <option value="carbon">Carbon Steel</option>
              </select>
            </div>

            {/* Shape Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shape Type</label>
              <select
                id="shapeType"
                value={shapeType}
                onChange={(e) => setShapeType(e.target.value)}
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="plate">Flat Plate/Sheet</option>
                <option value="round">Round Bar</option>
                <option value="square">Square Bar</option>
                <option value="tube">Round Tube</option>
                <option value="angle">Angle Iron</option>
              </select>
            </div>

            {/* Dimensions for Plate */}
            {shapeType === 'plate' && (
              <div id="plateDimensions">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Length (inches)</label>
                    <input
                      type="number"
                      id="plateLength"
                      step="0.125"
                      placeholder="e.g., 48"
                      value={plateLength}
                      onChange={(e) => setPlateLength(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Width (inches)</label>
                    <input
                      type="number"
                      id="plateWidth"
                      step="0.125"
                      placeholder="e.g., 24"
                      value={plateWidth}
                      onChange={(e) => setPlateWidth(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thickness (inches)</label>
                  <input
                    type="number"
                    id="plateThickness"
                    step="0.0625"
                    placeholder="e.g., 0.25"
                    value={plateThickness}
                    onChange={(e) => setPlateThickness(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Dimensions for Round Bar */}
            {shapeType === 'round' && (
              <div id="roundDimensions">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Diameter (inches)</label>
                    <input
                      type="number"
                      id="roundDiameter"
                      step="0.125"
                      placeholder="e.g., 2"
                      value={roundDiameter}
                      onChange={(e) => setRoundDiameter(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Length (inches)</label>
                    <input
                      type="number"
                      id="roundLength"
                      step="0.125"
                      placeholder="e.g., 72"
                      value={roundLength}
                      onChange={(e) => setRoundLength(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Dimensions for Square Bar */}
            {shapeType === 'square' && (
              <div id="squareDimensions">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Side (inches)</label>
                    <input
                      type="number"
                      id="squareSide"
                      step="0.125"
                      placeholder="e.g., 1.5"
                      value={squareSide}
                      onChange={(e) => setSquareSide(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Length (inches)</label>
                    <input
                      type="number"
                      id="squareLength"
                      step="0.125"
                      placeholder="e.g., 72"
                      value={squareLength}
                      onChange={(e) => setSquareLength(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Quantity and Cost */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  placeholder="e.g., 5"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price per lb ($)</label>
                <input
                  type="number"
                  id="pricePerPound"
                  step="0.01"
                  placeholder="e.g., 0.85"
                  value={pricePerPound}
                  onChange={(e) => setPricePerPound(parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Material Properties Display */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Material Properties</h4>
              <div id="materialProperties" className="text-blue-700 space-y-1 text-sm" dangerouslySetInnerHTML={{ __html: materialProperties }} />
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Weight & Cost Results</h3>

            <div className="space-y-4">
              <div className="bg-green-100 rounded-lg p-4 text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600" id="totalWeight">{totalWeight.toFixed(2)}</div>
                <div className="text-green-700">Total Weight (lbs)</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Volume:</span>
                  <span id="volume" className="font-semibold">{volume.toFixed(1)} in³</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Weight per piece:</span>
                  <span id="weightPerPiece" className="font-semibold">{weightPerPiece.toFixed(2)} lbs</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Surface area:</span>
                  <span id="surfaceArea" className="font-semibold">{surfaceArea.toFixed(0)} in²</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Material cost:</span>
                  <span id="materialCost" className="font-semibold text-green-600">${materialCost.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Cost per pound:</span>
                  <span id="costPerPound" className="font-semibold">${pricePerPound.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Weight Breakdown */}
            <div className="mt-6 p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Weight Breakdown</h4>
              <div id="weightBreakdown" className="text-purple-700 space-y-1 text-sm" dangerouslySetInnerHTML={{ __html: weightBreakdown }} />
            </div>
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div className="bg-purple-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-xl font-semibold text-purple-800 mb-4">Steel Properties Reference</h3>
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 text-purple-700">
          <div>
            <h4 className="font-semibold mb-2">Material Densities (lb/in³):</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span>Mild Steel (A36):</span> <span>0.2836</span></div>
              <div className="flex justify-between"><span>Stainless Steel 304:</span> <span>0.290</span></div>
              <div className="flex justify-between"><span>Stainless Steel 316:</span> <span>0.290</span></div>
              <div className="flex justify-between"><span>Aluminum 6061:</span> <span>0.0975</span></div>
              <div className="flex justify-between"><span>Brass:</span> <span>0.307</span></div>
              <div className="flex justify-between"><span>Copper:</span> <span>0.324</span></div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Common Applications:</h4>
            <ul className="space-y-1 text-sm">
              <li>• <strong>Mild Steel:</strong> Structural, general fabrication</li>
              <li>• <strong>Stainless 304:</strong> Food service, architecture</li>
              <li>• <strong>Stainless 316:</strong> Marine, chemical processing</li>
              <li>• <strong>Aluminum:</strong> Aerospace, automotive</li>
              <li>• <strong>Brass:</strong> Decorative, electrical</li>
              <li>• <strong>Copper:</strong> Electrical, plumbing</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Guidelines Section */}
      <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 md:p-6">
        <h3 className="text-xl font-semibold text-yellow-800 mb-4">Steel Calculation Guidelines</h3>
        <div className="grid md:grid-cols-3 gap-4 text-yellow-700">
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">Measurement Tips</h4>
            <ul className="text-sm space-y-1">
              <li>• Use decimal inches (not fractions)</li>
              <li>• Measure precisely for accuracy</li>
              <li>• Account for material tolerances</li>
              <li>• Consider processing waste</li>
            </ul>
          </div>
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">Cost Considerations</h4>
            <ul className="text-sm space-y-1">
              <li>• Prices vary by quantity</li>
              <li>• Consider processing costs</li>
              <li>• Factor in shipping weight</li>
              <li>• Check for bulk discounts</li>
            </ul>
          </div>
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">Safety Notes</h4>
            <ul className="text-sm space-y-1">
              <li>• Consider lifting capacity</li>
              <li>• Use proper handling equipment</li>
              <li>• Check structural load limits</li>
              <li>• Account for dynamic loads</li>
            </ul>
          </div>
        </div>
      </div>

      {/* MREC Advertisement Banners */}
      <CalculatorAfterCalcBanners />

      {/* Enhanced Related Calculators */}
      <div className="mt-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Converter Calculators</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href}>
              <div className={`${calc.color} rounded-lg p-6 text-white hover:opacity-90 transition-opacity cursor-pointer`}>
                <h4 className="text-xl font-semibold mb-2">{calc.title}</h4>
                <p className="text-sm opacity-90">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="steel-plate-weight-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
