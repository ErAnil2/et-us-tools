'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
}

interface Props {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '%' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

interface RebarProperties {
  diameter: number;
  weight: number;
  area: number;
}

interface RebarData {
  [key: string]: RebarProperties;
}

const rebarData: RebarData = {
  '#3': { diameter: 0.375, weight: 0.376, area: 0.11 },
  '#4': { diameter: 0.500, weight: 0.668, area: 0.20 },
  '#5': { diameter: 0.625, weight: 1.043, area: 0.31 },
  '#6': { diameter: 0.750, weight: 1.502, area: 0.44 },
  '#7': { diameter: 0.875, weight: 2.044, area: 0.60 },
  '#8': { diameter: 1.000, weight: 2.670, area: 0.79 },
  '#9': { diameter: 1.128, weight: 3.400, area: 1.00 },
  '#10': { diameter: 1.270, weight: 4.303, area: 1.27 },
  '#11': { diameter: 1.410, weight: 5.313, area: 1.56 }
};

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Rebar Calculator?",
    answer: "A Rebar Calculator is a free online tool designed to help you quickly and accurately calculate rebar-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Rebar Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Rebar Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Rebar Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function RebarCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('rebar-calculator');

  const [rebarSize, setRebarSize] = useState('#4');
  const [projectType, setProjectType] = useState('custom');
  const [totalLength, setTotalLength] = useState(100);
  const [slabLength, setSlabLength] = useState(0);
  const [slabWidth, setSlabWidth] = useState(0);
  const [spacing, setSpacing] = useState(18);
  const [barLength, setBarLength] = useState(20);
  const [pricePerFoot, setPricePerFoot] = useState(0.85);

  const [barsNeeded, setBarsNeeded] = useState(5);
  const [displayTotalLength, setDisplayTotalLength] = useState('100 ft');
  const [displaySize, setDisplaySize] = useState('#4 (1/2")');
  const [weightPerFoot, setWeightPerFoot] = useState('0.668 lbs/ft');
  const [totalWeight, setTotalWeight] = useState('66.8 lbs');
  const [totalCost, setTotalCost] = useState('$85.00');
  const [rebarProperties, setRebarProperties] = useState<string[]>([
    '• Diameter: 0.500 inches',
    '• Cross-sectional area: 0.20 sq in',
    '• Steel grade: Grade 60 (typical)'
  ]);

  const calculateRebar = () => {
    let calculatedTotalLength = 0;

    if (projectType === 'custom') {
      calculatedTotalLength = totalLength;
    } else if (projectType === 'slab' || projectType === 'footing') {
      if (slabLength > 0 && slabWidth > 0) {
        // Calculate length direction bars
        const lengthBars = Math.ceil(slabWidth * 12 / spacing) + 1;
        const lengthRebar = lengthBars * slabLength;

        // Calculate width direction bars
        const widthBars = Math.ceil(slabLength * 12 / spacing) + 1;
        const widthRebar = widthBars * slabWidth;

        calculatedTotalLength = lengthRebar + widthRebar;
      }
    }

    if (calculatedTotalLength <= 0 || !rebarData[rebarSize]) {
      resetResults();
      return;
    }

    const rebarProps = rebarData[rebarSize];
    const calculatedBarsNeeded = Math.ceil(calculatedTotalLength / barLength);
    const calculatedTotalWeight = calculatedTotalLength * rebarProps.weight;
    const calculatedTotalCost = calculatedTotalLength * pricePerFoot;

    // Update display
    setBarsNeeded(calculatedBarsNeeded);
    setDisplayTotalLength(`${calculatedTotalLength.toFixed(1)} ft`);
    setDisplaySize(`${rebarSize} (${rebarProps.diameter}")`);
    setWeightPerFoot(`${rebarProps.weight.toFixed(3)} lbs/ft`);
    setTotalWeight(`${calculatedTotalWeight.toFixed(1)} lbs`);
    setTotalCost(`$${calculatedTotalCost.toFixed(2)}`);

    // Update rebar properties
    setRebarProperties([
      `• Diameter: ${rebarProps.diameter} inches`,
      `• Cross-sectional area: ${rebarProps.area.toFixed(2)} sq in`,
      `• Steel grade: Grade 60 (typical)`,
      `• Standard length: ${barLength} feet`
    ]);
  };

  const resetResults = () => {
    setBarsNeeded(0);
    setDisplayTotalLength('0 ft');
    setDisplaySize('#4 (1/2")');
    setWeightPerFoot('0.668 lbs/ft');
    setTotalWeight('0 lbs');
    setTotalCost('$0.00');
    setRebarProperties(['Enter project details to see rebar properties']);
  };

  useEffect(() => {
    calculateRebar();
  }, [rebarSize, projectType, totalLength, slabLength, slabWidth, spacing, barLength, pricePerFoot]);

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Rebar Calculator')}</h1>
        <p className="text-lg text-gray-600">Calculate rebar weight, length requirements, and project cost for concrete reinforcement</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Project Specifications</h2>

            {/* Rebar Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rebar Size</label>
              <select
                id="rebarSize"
                value={rebarSize}
                onChange={(e) => setRebarSize(e.target.value)}
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="#3">#3 (3/8" - 0.375")</option>
                <option value="#4">#4 (1/2" - 0.500")</option>
                <option value="#5">#5 (5/8" - 0.625")</option>
                <option value="#6">#6 (3/4" - 0.750")</option>
                <option value="#7">#7 (7/8" - 0.875")</option>
                <option value="#8">#8 (1" - 1.000")</option>
                <option value="#9">#9 (1-1/8" - 1.128")</option>
                <option value="#10">#10 (1-1/4" - 1.270")</option>
                <option value="#11">#11 (1-3/8" - 1.410")</option>
              </select>
            </div>

            {/* Project Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
              <select
                id="projectType"
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="slab">Concrete Slab</option>
                <option value="footing">Footing/Foundation</option>
                <option value="custom">Custom Length</option>
              </select>
            </div>

            {/* Slab Dimensions */}
            {(projectType === 'slab' || projectType === 'footing') && (
              <div id="slabDimensions">
                <h4 className="font-semibold text-gray-700 mb-3">Slab Dimensions</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Length (ft)</label>
                    <input
                      type="number"
                      id="slabLength"
                      value={slabLength || ''}
                      onChange={(e) => setSlabLength(parseFloat(e.target.value) || 0)}
                      step="0.1"
                      placeholder="e.g., 20"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Width (ft)</label>
                    <input
                      type="number"
                      id="slabWidth"
                      value={slabWidth || ''}
                      onChange={(e) => setSlabWidth(parseFloat(e.target.value) || 0)}
                      step="0.1"
                      placeholder="e.g., 10"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-sm text-gray-600 mb-1">Spacing (inches)</label>
                  <select
                    id="spacing"
                    value={spacing}
                    onChange={(e) => setSpacing(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="12">12" on center</option>
                    <option value="16">16" on center</option>
                    <option value="18">18" on center</option>
                    <option value="24">24" on center</option>
                  </select>
                </div>
              </div>
            )}

            {/* Custom Length */}
            {projectType === 'custom' && (
              <div id="customLength">
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Length Needed (ft)</label>
                <input
                  type="number"
                  id="totalLength"
                  value={totalLength}
                  onChange={(e) => setTotalLength(parseFloat(e.target.value) || 0)}
                  step="0.1"
                  placeholder="e.g., 500"
                  className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Standard Bar Length */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Standard Bar Length</label>
              <select
                id="barLength"
                value={barLength}
                onChange={(e) => setBarLength(parseFloat(e.target.value))}
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="20">20 feet</option>
                <option value="30">30 feet</option>
                <option value="40">40 feet</option>
                <option value="60">60 feet</option>
              </select>
            </div>

            {/* Cost Information */}
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-3">Cost Calculation</h4>
              <div>
                <label className="block text-xs text-green-700 mb-1">Price per Foot ($)</label>
                <input
                  type="number"
                  id="pricePerFoot"
                  value={pricePerFoot}
                  onChange={(e) => setPricePerFoot(parseFloat(e.target.value) || 0)}
                  step="0.01"
                  placeholder="e.g., 0.85"
                  className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Rebar Requirements</h3>

            <div className="space-y-4">
              <div className="bg-blue-100 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600" id="barsNeeded">{barsNeeded}</div>
                <div className="text-blue-700">Bars Needed</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Total Length:</span>
                  <span id="displayTotalLength" className="font-semibold">{displayTotalLength}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Rebar Size:</span>
                  <span id="displaySize" className="font-semibold">{displaySize}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Weight per Foot:</span>
                  <span id="weightPerFoot" className="font-semibold">{weightPerFoot}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Total Weight:</span>
                  <span id="totalWeight" className="font-semibold text-orange-600">{totalWeight}</span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Estimated Cost:</span>
                  <span id="totalCost" className="font-semibold text-green-600">{totalCost}</span>
                </div>
              </div>
            </div>

            {/* Rebar Properties */}
            <div className="mt-6 p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Rebar Properties</h4>
              <div id="rebarProperties" className="text-purple-700 space-y-1 text-sm">
                {rebarProperties.map((prop, index) => (
                  <div key={index}>{prop}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* Information Section */}
      <div className="bg-purple-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-xl font-semibold text-purple-800 mb-4">Rebar Size Reference</h3>
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 text-purple-700">
          <div>
            <h4 className="font-semibold mb-2">Common Rebar Sizes & Weights:</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span>#3 (3/8"):</span> <span>0.376 lbs/ft</span></div>
              <div className="flex justify-between"><span>#4 (1/2"):</span> <span>0.668 lbs/ft</span></div>
              <div className="flex justify-between"><span>#5 (5/8"):</span> <span>1.043 lbs/ft</span></div>
              <div className="flex justify-between"><span>#6 (3/4"):</span> <span>1.502 lbs/ft</span></div>
              <div className="flex justify-between"><span>#7 (7/8"):</span> <span>2.044 lbs/ft</span></div>
              <div className="flex justify-between"><span>#8 (1"):</span> <span>2.670 lbs/ft</span></div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Typical Applications:</h4>
            <ul className="space-y-1 text-sm">
              <li>• <strong>#3, #4:</strong> Residential slabs, sidewalks</li>
              <li>• <strong>#5, #6:</strong> Driveways, commercial slabs</li>
              <li>• <strong>#7, #8:</strong> Structural beams, columns</li>
              <li>• <strong>#9-#11:</strong> Heavy structural work</li>
              <li>• <strong>Spacing:</strong> Typically 12"-24" on center</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Guidelines Section */}
      <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-xl font-semibold text-yellow-800 mb-4">Rebar Installation Guidelines</h3>
        <div className="grid md:grid-cols-3 gap-4 text-yellow-700">
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">Placement Rules</h4>
            <ul className="text-sm space-y-1">
              <li>• Minimum 3" from edge</li>
              <li>• 2" clear cover minimum</li>
              <li>• Proper lap splice length</li>
              <li>• Support with chairs/blocks</li>
            </ul>
          </div>
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">Spacing Guidelines</h4>
            <ul className="text-sm space-y-1">
              <li>• Residential: 18" typical</li>
              <li>• Commercial: 12" typical</li>
              <li>• Heavy loads: 8-12"</li>
              <li>• Both directions for slabs</li>
            </ul>
          </div>
<div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">Safety & Quality</h4>
            <ul className="text-sm space-y-1">
              <li>• Check local building codes</li>
              <li>• Verify with structural engineer</li>
              <li>• Use proper tie wire</li>
              <li>• Inspect before pour</li>
            </ul>
          </div>
        </div>
      </div>

      {/* MREC Advertisement Banners */}
{/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-lg p-4 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <div className="text-2xl mb-2">📊</div>
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
        <FirebaseFAQs pageId="rebar-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
